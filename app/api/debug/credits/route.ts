import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email')
  
  if (!email) {
    return NextResponse.json({ error: 'Email parameter required' }, { status: 400 })
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 })
  }

  try {
    // Get customer with all related data
    const { data: customer, error: customerError } = await supabaseAdmin
      .from('customers')
      .select(`
        *,
        session_credits (
          id,
          customer_id,
          purchase_id,
          sessions_remaining,
          sessions_total,
          created_at
        ),
        bookings (
          id,
          booking_datetime,
          status,
          calendly_event_id
        ),
        purchases (
          id,
          package_type,
          sessions_purchased,
          created_at
        )
      `)
      .eq('email', email)
      .single()

    if (customerError || !customer) {
      return NextResponse.json({ 
        error: 'Customer not found',
        details: customerError 
      }, { status: 404 })
    }

    // Check for recent Calendly webhooks
    const { data: recentWebhooks } = await supabaseAdmin
      .from('calendly_webhooks')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)

    // Calculate total available sessions
    const totalSessions = customer.session_credits?.reduce(
      (sum: number, credit: any) => sum + (credit.sessions_remaining || 0), 
      0
    ) || 0

    // Check for session usage
    const { data: sessionUsage } = await supabaseAdmin
      .from('session_usage')
      .select(`
        *,
        bookings (
          booking_datetime,
          calendly_event_id
        )
      `)
      .in('session_credit_id', customer.session_credits?.map((c: any) => c.id) || [])

    return NextResponse.json({
      customer: {
        id: customer.id,
        email: customer.email,
        name: customer.name,
        stripe_customer_id: customer.stripe_customer_id
      },
      credits_summary: {
        total_available: totalSessions,
        credits_count: customer.session_credits?.length || 0,
        credits: customer.session_credits?.map((c: any) => ({
          id: c.id,
          customer_id: c.customer_id,
          sessions_remaining: c.sessions_remaining,
          sessions_total: c.sessions_total,
          created_at: c.created_at,
          purchase_id: c.purchase_id
        }))
      },
      bookings: {
        total: customer.bookings?.length || 0,
        scheduled: customer.bookings?.filter((b: any) => b.status === 'scheduled').length || 0,
        recent: customer.bookings?.slice(0, 5)
      },
      purchases: {
        total: customer.purchases?.length || 0,
        recent: customer.purchases?.slice(0, 5)
      },
      session_usage: sessionUsage,
      recent_webhooks: recentWebhooks?.map((w: any) => ({
        event_type: w.event_type,
        created_at: w.created_at,
        payload_email: w.payload?.payload?.email || w.payload?.email
      }))
    })
  } catch (error) {
    console.error('Debug endpoint error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error 
    }, { status: 500 })
  }
}