import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe/client'
import { supabaseAdmin } from '@/lib/supabase/server'
import { resend } from '@/lib/resend/client'
import { emailTemplates } from '@/lib/emails/templates'

export async function POST(req: NextRequest) {
  console.log('Stripe webhook received')
  
  // Check if Stripe is configured
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('Stripe not configured - missing stripe client or webhook secret')
    return NextResponse.json(
      { error: 'Stripe not configured' },
      { status: 503 }
    )
  }

  const body = await req.text()
  const signature = headers().get('stripe-signature')!
  console.log('Webhook signature present:', !!signature)

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    )
  }

  console.log('Webhook event type:', event.type)
  
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any
    console.log('Session ID:', session.id)
    console.log('Customer email:', session.customer_email || session.customer_details?.email)
    console.log('Metadata:', session.metadata)
    
    // First Serve Seattle price IDs to ignore
    const firstServeSeattlePriceIds = [
      'price_1Qbm96KSaqiJUYkj7SWySbjU', // FSS Monthly
      'price_1QowMRKSaqiJUYkjgeqLADm4', // FSS Annual
    ]
    
    // Retrieve session with line items to check what was purchased
    const sessionWithLineItems = await stripe.checkout.sessions.retrieve(
      session.id,
      { expand: ['line_items'] }
    )
    
    // Check if this is a First Serve Seattle transaction
    let isFirstServeSeattle = false
    if (sessionWithLineItems.line_items) {
      for (const item of sessionWithLineItems.line_items.data) {
        if (item.price?.id && firstServeSeattlePriceIds.includes(item.price.id)) {
          isFirstServeSeattle = true
          console.log('Detected First Serve Seattle transaction, skipping...')
          break
        }
      }
    }
    
    // Skip if this is a First Serve Seattle transaction
    if (isFirstServeSeattle) {
      return NextResponse.json({ received: true })
    }
    
    // Use customer_details.email if customer_email is null
    const customerEmail = session.customer_email || session.customer_details?.email
    if (!customerEmail) {
      console.error('No customer email found')
      return NextResponse.json({ error: 'No customer email' }, { status: 400 })
    }

    // Check if Supabase is configured
    if (!supabaseAdmin) {
      console.error('Supabase not configured, skipping database operations')
      return NextResponse.json({ received: true })
    }

    // Use the already retrieved session with line items

    // Check if SwingStick was purchased
    let includesSwingStick = false
    let swingStickQuantity = 0
    
    if (sessionWithLineItems.line_items) {
      for (const item of sessionWithLineItems.line_items.data) {
        // Check if this is a SwingStick product by product ID or name
        if (item.price?.product === process.env.STRIPE_PRODUCT_SWINGSTICK ||
            item.description?.toLowerCase().includes('swing') ||
            item.description?.toLowerCase().includes('stick')) {
          includesSwingStick = true
          swingStickQuantity += item.quantity || 0
        }
      }
    }

    // Determine package type from the payment link used
    // Since metadata isn't passed through payment links, we need to infer from amount or link ID
    let packageType = 'single'
    let sessionsCount = 1
    
    // Map payment link IDs to package types (you'll need to update these with your actual link IDs)
    const linkMapping: Record<string, {type: string, sessions: number}> = {
      'plink_1Rv0eiQRPaPngbWPNkTXR9qv': { type: 'single', sessions: 1 },  // Update with your actual link IDs
      // Add your 3-pack and 10-pack link IDs here
    }
    
    if (session.payment_link && linkMapping[session.payment_link]) {
      packageType = linkMapping[session.payment_link].type
      sessionsCount = linkMapping[session.payment_link].sessions
    } else if (session.metadata?.package_type) {
      // Fall back to metadata if present (from custom integration)
      packageType = session.metadata.package_type
      sessionsCount = parseInt(session.metadata.sessions_count || '1')
    } else {
      // Try to infer from amount (before discounts)
      const amount = session.amount_subtotal
      if (amount === 4000) {
        packageType = 'single'
        sessionsCount = 1
      } else if (amount === 10500) {
        packageType = '3_pack'
        sessionsCount = 3
      } else if (amount === 30000) {
        packageType = '10_pack'
        sessionsCount = 10
      }
    }
    
    console.log('Package type:', packageType, 'Sessions:', sessionsCount)

    // Create or update customer
    const { data: customer, error: customerError } = await supabaseAdmin
      .from('customers')
      .upsert({
        email: customerEmail,
        name: session.customer_details?.name,
        phone: session.customer_details?.phone,
        stripe_customer_id: session.customer || null,
      }, {
        onConflict: 'email'
      })
      .select()
      .single()

    if (customerError) {
      console.error('Customer creation error:', customerError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    // Record purchase
    const { data: purchase, error: purchaseError } = await supabaseAdmin
      .from('purchases')
      .insert({
        customer_id: customer.id,
        stripe_payment_intent_id: session.payment_intent || null,
        stripe_checkout_session_id: session.id,
        package_type: packageType,
        sessions_purchased: sessionsCount,
        amount_paid: session.amount_total || 0,
        includes_swingstick: includesSwingStick,
        swingstick_quantity: swingStickQuantity,
      })
      .select()
      .single()

    if (purchaseError) {
      console.error('Purchase creation error:', purchaseError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    // Add session credits
    const { error: creditError } = await supabaseAdmin
      .from('session_credits')
      .insert({
        customer_id: customer.id,
        purchase_id: purchase.id,
        sessions_remaining: sessionsCount,
        sessions_total: sessionsCount,
      })

    if (creditError) {
      console.error('Credit creation error:', creditError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    // Send confirmation email if Resend is configured
    if (resend) {
      const emailContent = emailTemplates.purchaseConfirmation(
        sessionsCount,
        includesSwingStick
      )
      
      try {
        await resend.emails.send({
          from: 'Seattle Ball Machine <noreply@seattleballmachine.com>',
          to: customerEmail,
          ...emailContent
        })
        console.log('Confirmation email sent to:', customerEmail)
      } catch (emailError) {
        console.error('Email send error:', emailError)
        // Don't fail the webhook if email fails
      }
    }
  }

  return NextResponse.json({ received: true })
}