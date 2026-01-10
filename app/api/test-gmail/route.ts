import { NextRequest, NextResponse } from 'next/server'
import { gmail } from '@/lib/gmail/email-service'
import { emailTemplates } from '@/lib/emails/templates'

export async function GET(request: NextRequest) {
  // SECURITY: Only allow in development or with admin secret
  const isProduction = process.env.NODE_ENV === 'production'
  const adminSecret = request.headers.get('x-admin-secret')
  const validSecret = process.env.ADMIN_DEBUG_SECRET

  if (isProduction && (!validSecret || adminSecret !== validSecret)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const searchParams = request.nextUrl.searchParams
  const to = searchParams.get('to')
  const type = searchParams.get('type') || 'purchase'

  if (!to) {
    return NextResponse.json(
      { error: 'Missing "to" query parameter. Usage: /api/test-gmail?to=email@example.com&type=purchase' },
      { status: 400 }
    )
  }

  try {
    let emailContent
    const fromAddress = 'Seattle Ball Machine <ryan@firstserveseattle.com>'

    switch (type) {
      case 'purchase':
        emailContent = emailTemplates.purchaseConfirmation(3, false)
        break
      case 'booking':
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        tomorrow.setHours(10, 0, 0, 0)
        emailContent = emailTemplates.bookingConfirmation(tomorrow, 2)
        break
      case 'reminder':
        const reminderDate = new Date()
        reminderDate.setDate(reminderDate.getDate() + 1)
        emailContent = emailTemplates.bookingReminder(reminderDate, '10:00 AM')
        break
      case 'cancelled':
        emailContent = emailTemplates.bookingCancelled()
        break
      case 'nosessions':
        emailContent = emailTemplates.noSessionsWarning()
        break
      default:
        return NextResponse.json(
          { error: `Unknown email type: ${type}. Valid types: purchase, booking, reminder, cancelled, nosessions` },
          { status: 400 }
        )
    }

    const result = await gmail.emails.send({
      from: fromAddress,
      to,
      ...emailContent
    })

    if (result.error) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Test ${type} email sent to ${to}`,
      data: result.data
    })
  } catch (error) {
    console.error('Test email error:', error)
    return NextResponse.json(
      { error: 'Failed to send test email', details: String(error) },
      { status: 500 }
    )
  }
}
