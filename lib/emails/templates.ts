export const emailTemplates = {
  purchaseConfirmation: (sessions: number, swingStick: boolean = false) => ({
    subject: 'Your Seattle Ball Machine Rental is Confirmed! 🎾',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Purchase Confirmation</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            <!-- Header -->
            <div style="background-color: #16a34a; padding: 40px 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">
                Seattle Ball Machine
              </h1>
              <p style="color: #dcfce7; margin: 10px 0 0 0; font-size: 14px;">
                Tennis Training Made Simple
              </p>
            </div>
            
            <!-- Success Badge -->
            <div style="padding: 30px 20px 0; text-align: center;">
              <div style="display: inline-block; background-color: #dcfce7; color: #166534; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 600;">
                ✓ Payment Successful
              </div>
            </div>
            
            <!-- Main Content -->
            <div style="padding: 30px 20px;">
              <h2 style="color: #111827; font-size: 24px; margin: 0 0 20px 0; text-align: center;">
                Thank You for Your Purchase!
              </h2>
              
              <div style="background-color: #f3f4f6; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <p style="color: #374151; font-size: 16px; margin: 0;">
                  <strong>Package:</strong> ${sessions} Session${sessions > 1 ? 's' : ''}<br>
                  ${swingStick ? '<strong>Add-on:</strong> SwingStick Phone Mount<br>' : ''}
                  <strong>Duration:</strong> Each session is 2 hours<br>
                  <strong>Equipment:</strong> 65 balls + basket included
                </p>
              </div>
              
              <!-- CTA Button -->
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_URL}/rentalbooking#calendar" 
                   style="display: inline-block; background-color: #16a34a; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
                  Schedule Your First Session →
                </a>
              </div>
              
              <!-- Pickup Location -->
              <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
                <h3 style="color: #111827; font-size: 18px; margin: 0 0 10px 0;">
                  📍 Pickup Location
                </h3>
                <p style="color: #6b7280; font-size: 15px; line-height: 1.6; margin: 0;">
                  2116 4th Avenue West<br>
                  Seattle, WA 98119<br>
                  <span style="font-size: 14px; color: #9ca3af;">
                    The machine and balls will be on the porch for pickup
                  </span>
                </p>
              </div>
              
              <!-- Help Section -->
              <div style="background-color: #fef3c7; border-radius: 8px; padding: 15px; margin: 20px 0;">
                <p style="color: #92400e; font-size: 14px; margin: 0;">
                  <strong>Need help?</strong> Watch our <a href="${process.env.NEXT_PUBLIC_URL}/rentalbooking#how-it-works" style="color: #92400e; text-decoration: underline;">setup video</a> or contact us anytime.
                </p>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0;">
                Questions? We're here to help!
              </p>
              <p style="color: #6b7280; font-size: 14px; margin: 0;">
                📧 support@firstserveseattle.com<br>
                📱 (253) 252-9577
              </p>
              <p style="color: #9ca3af; font-size: 12px; margin: 20px 0 0 0;">
                © ${new Date().getFullYear()} Seattle Ball Machine. All rights reserved.
              </p>
            </div>
          </div>
        </body>
      </html>
    `
  }),

  bookingConfirmation: (date: Date, sessionsRemaining: number, rescheduleUrl?: string, cancelUrl?: string) => ({
    subject: 'Booking Confirmed - Seattle Ball Machine 🎾',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Booking Confirmation</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            <!-- Header -->
            <div style="background-color: #16a34a; padding: 40px 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">
                Seattle Ball Machine
              </h1>
              <p style="color: #dcfce7; margin: 10px 0 0 0; font-size: 14px;">
                Tennis Training Made Simple
              </p>
            </div>
            
            <!-- Success Badge -->
            <div style="padding: 30px 20px 0; text-align: center;">
              <div style="display: inline-block; background-color: #dcfce7; color: #166534; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 600;">
                ✓ Booking Confirmed
              </div>
            </div>
            
            <!-- Main Content -->
            <div style="padding: 30px 20px;">
              <h2 style="color: #111827; font-size: 24px; margin: 0 0 20px 0; text-align: center;">
                See You Soon!
              </h2>
              
              <!-- Booking Details -->
              <div style="background-color: #f3f4f6; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <h3 style="color: #111827; font-size: 18px; margin: 0 0 15px 0;">
                  📅 Your Booking Details
                </h3>
                <p style="color: #374151; font-size: 16px; margin: 0; line-height: 1.8;">
                  <strong>Date:</strong> ${date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}<br>
                  <strong>Time:</strong> ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}<br>
                  <strong>Duration:</strong> 2 hours<br>
                  <strong>Equipment:</strong> 65 balls + basket
                </p>
              </div>
              
              <!-- Sessions Remaining -->
              <div style="text-align: center; background-color: #fef3c7; border-radius: 8px; padding: 15px; margin: 20px 0;">
                <p style="color: #92400e; font-size: 14px; margin: 0;">
                  <strong>${sessionsRemaining} session${sessionsRemaining !== 1 ? 's' : ''} remaining</strong> after this booking
                </p>
              </div>
              
              <!-- Action Buttons -->
              ${rescheduleUrl || cancelUrl ? `
              <div style="text-align: center; margin: 30px 0;">
                ${rescheduleUrl ? `
                <a href="${rescheduleUrl}" 
                   style="display: inline-block; background-color: #3b82f6; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px; margin: 0 10px;">
                  Reschedule
                </a>
                ` : ''}
                ${cancelUrl ? `
                <a href="${cancelUrl}" 
                   style="display: inline-block; background-color: #ffffff; color: #ef4444; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px; border: 1px solid #ef4444; margin: 0 10px;">
                  Cancel Booking
                </a>
                ` : ''}
              </div>
              ` : ''}
              
              <!-- Pickup Location -->
              <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
                <h3 style="color: #111827; font-size: 18px; margin: 0 0 10px 0;">
                  📍 Pickup Location
                </h3>
                <p style="color: #6b7280; font-size: 15px; line-height: 1.6; margin: 0;">
                  2116 4th Avenue West<br>
                  Seattle, WA 98119<br>
                  <span style="font-size: 14px; color: #9ca3af;">
                    The machine and balls will be on the porch for pickup
                  </span>
                </p>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0;">
                Questions? We're here to help!
              </p>
              <p style="color: #6b7280; font-size: 14px; margin: 0;">
                📧 support@firstserveseattle.com<br>
                📱 (253) 252-9577
              </p>
              <p style="color: #9ca3af; font-size: 12px; margin: 20px 0 0 0;">
                © ${new Date().getFullYear()} Seattle Ball Machine. All rights reserved.
              </p>
            </div>
          </div>
        </body>
      </html>
    `
  }),

  bookingReminder: (date: Date, time: string) => ({
    subject: 'Reminder: Your ball machine rental is tomorrow! 🎾',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Booking Reminder</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            <!-- Header -->
            <div style="background-color: #16a34a; padding: 40px 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">
                Seattle Ball Machine
              </h1>
              <p style="color: #dcfce7; margin: 10px 0 0 0; font-size: 14px;">
                Tennis Training Made Simple
              </p>
            </div>
            
            <!-- Reminder Badge -->
            <div style="padding: 30px 20px 0; text-align: center;">
              <div style="display: inline-block; background-color: #fef3c7; color: #92400e; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 600;">
                ⏰ Reminder: Tomorrow
              </div>
            </div>
            
            <!-- Main Content -->
            <div style="padding: 30px 20px;">
              <h2 style="color: #111827; font-size: 24px; margin: 0 0 20px 0; text-align: center;">
                See You Tomorrow!
              </h2>
              
              <div style="background-color: #f3f4f6; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
                <p style="color: #111827; font-size: 20px; margin: 0 0 10px 0; font-weight: 600;">
                  ${time}
                </p>
                <p style="color: #6b7280; font-size: 16px; margin: 0;">
                  ${date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
              
              <!-- Pickup Location -->
              <div style="border: 2px solid #16a34a; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <h3 style="color: #111827; font-size: 18px; margin: 0 0 10px 0;">
                  📍 Pickup Location
                </h3>
                <p style="color: #374151; font-size: 15px; line-height: 1.6; margin: 0;">
                  <strong>2116 4th Avenue West<br>
                  Seattle, WA 98119</strong><br>
                  <span style="font-size: 14px; color: #6b7280;">
                    The machine and balls will be on the porch for pickup
                  </span>
                </p>
              </div>
              
              <!-- Tips -->
              <div style="background-color: #dcfce7; border-radius: 8px; padding: 15px; margin: 20px 0;">
                <p style="color: #166534; font-size: 14px; margin: 0 0 10px 0;">
                  <strong>💡 Quick Tips:</strong>
                </p>
                <ul style="color: #166534; font-size: 14px; margin: 0; padding-left: 20px;">
                  <li>Download the Proton Control app for easy machine control</li>
                  <li>Return equipment to the same porch location</li>
                  <li>65 balls and basket are included</li>
                </ul>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0;">
                Questions? We're here to help!
              </p>
              <p style="color: #6b7280; font-size: 14px; margin: 0;">
                📧 support@firstserveseattle.com<br>
                📱 (253) 252-9577
              </p>
              <p style="color: #9ca3af; font-size: 12px; margin: 20px 0 0 0;">
                © ${new Date().getFullYear()} Seattle Ball Machine. All rights reserved.
              </p>
            </div>
          </div>
        </body>
      </html>
    `
  }),

  bookingCancelled: () => ({
    subject: 'Booking Cancelled - Seattle Ball Machine',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Booking Cancelled</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            <!-- Header -->
            <div style="background-color: #6b7280; padding: 40px 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">
                Seattle Ball Machine
              </h1>
              <p style="color: #e5e7eb; margin: 10px 0 0 0; font-size: 14px;">
                Tennis Training Made Simple
              </p>
            </div>
            
            <!-- Cancelled Badge -->
            <div style="padding: 30px 20px 0; text-align: center;">
              <div style="display: inline-block; background-color: #fee2e2; color: #991b1b; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 600;">
                Booking Cancelled
              </div>
            </div>
            
            <!-- Main Content -->
            <div style="padding: 30px 20px;">
              <h2 style="color: #111827; font-size: 24px; margin: 0 0 20px 0; text-align: center;">
                Your Booking Has Been Cancelled
              </h2>
              
              <div style="background-color: #dcfce7; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
                <p style="color: #166534; font-size: 16px; margin: 0;">
                  ✓ <strong>Your session credit has been restored</strong>
                </p>
              </div>
              
              <p style="color: #6b7280; font-size: 16px; line-height: 1.6; text-align: center; margin: 20px 0;">
                No worries! You can book another session anytime using your available credits.
              </p>
              
              <!-- CTA Button -->
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_URL}/rentalbooking#calendar" 
                   style="display: inline-block; background-color: #16a34a; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
                  Book Another Session →
                </a>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0;">
                Questions? We're here to help!
              </p>
              <p style="color: #6b7280; font-size: 14px; margin: 0;">
                📧 support@firstserveseattle.com<br>
                📱 (253) 252-9577
              </p>
              <p style="color: #9ca3af; font-size: 12px; margin: 20px 0 0 0;">
                © ${new Date().getFullYear()} Seattle Ball Machine. All rights reserved.
              </p>
            </div>
          </div>
        </body>
      </html>
    `
  }),

  noSessionsWarning: () => ({
    subject: '⚠️ No Sessions Available - Action Required',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>No Sessions Available</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            <!-- Header -->
            <div style="background-color: #ef4444; padding: 40px 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">
                Seattle Ball Machine
              </h1>
              <p style="color: #fee2e2; margin: 10px 0 0 0; font-size: 14px;">
                Action Required
              </p>
            </div>
            
            <!-- Warning Badge -->
            <div style="padding: 30px 20px 0; text-align: center;">
              <div style="display: inline-block; background-color: #fee2e2; color: #991b1b; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 600;">
                ⚠️ No Sessions Available
              </div>
            </div>
            
            <!-- Main Content -->
            <div style="padding: 30px 20px;">
              <h2 style="color: #111827; font-size: 24px; margin: 0 0 20px 0; text-align: center;">
                Your Booking is at Risk
              </h2>
              
              <div style="background-color: #fee2e2; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <p style="color: #991b1b; font-size: 16px; margin: 0; text-align: center;">
                  <strong>You've booked a session but have no credits remaining.</strong>
                </p>
              </div>
              
              <p style="color: #6b7280; font-size: 16px; line-height: 1.6; text-align: center; margin: 20px 0;">
                To secure your booking, please purchase additional sessions immediately.
              </p>
              
              <!-- CTA Button -->
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_URL}/#pricing" 
                   style="display: inline-block; background-color: #ef4444; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
                  Purchase Sessions Now →
                </a>
              </div>
              
              <p style="color: #6b7280; font-size: 14px; text-align: center; margin: 20px 0;">
                Your booking may be automatically cancelled if payment is not received.
              </p>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0;">
                Questions? We're here to help!
              </p>
              <p style="color: #6b7280; font-size: 14px; margin: 0;">
                📧 support@firstserveseattle.com<br>
                📱 (253) 252-9577
              </p>
              <p style="color: #9ca3af; font-size: 12px; margin: 20px 0 0 0;">
                © ${new Date().getFullYear()} Seattle Ball Machine. All rights reserved.
              </p>
            </div>
          </div>
        </body>
      </html>
    `
  })
}