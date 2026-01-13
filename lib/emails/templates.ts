export const emailTemplates = {
  purchaseConfirmation: (sessions: number, swingStick = false) => ({
    subject: "Your Seattle Ball Machine Rental is Confirmed!",
    html: `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <meta name="color-scheme" content="light only" />
  <meta name="supported-color-schemes" content="light only" />
  <title>Purchase Confirmation</title>
  <style>
    :root { color-scheme: light only; }
    @media (prefers-color-scheme: dark) {
      body, table, td, div, p, span { background-color: #ffffff !important; color: #111827 !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #ffffff; color: #111827; -webkit-text-size-adjust: 100%;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #ffffff;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table border="0" cellpadding="0" cellspacing="0" width="500" style="background-color: #ffffff;">

          <!-- Logo/Header -->
          <tr>
            <td style="padding-bottom: 30px;">
              <span style="color: #059669; font-size: 24px; font-weight: bold;">Seattle Ball Machine</span>
            </td>
          </tr>

          <!-- Main Message -->
          <tr>
            <td style="padding-bottom: 25px;">
              <h1 style="margin: 0; font-size: 28px; font-weight: bold; color: #111827;">Thank you for your purchase!</h1>
            </td>
          </tr>

          <!-- Package Info -->
          <tr>
            <td style="padding-bottom: 25px; color: #374151; font-size: 16px; line-height: 1.6;">
              <strong>${sessions} session${sessions > 1 ? "s" : ""}</strong> (2 hours each) with 65 balls + basket${swingStick ? ", plus SwingStick phone mount" : ""}.
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td style="padding-bottom: 30px;">
              <a href="${process.env.NEXT_PUBLIC_URL}/book" style="display: inline-block; padding: 14px 28px; background-color: #059669; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 16px; border-radius: 6px;">
                Schedule Your First Session
              </a>
            </td>
          </tr>

          <!-- Pickup Info -->
          <tr>
            <td style="padding-bottom: 30px; border-top: 1px solid #e5e7eb; padding-top: 25px;">
              <p style="margin: 0 0 8px 0; font-size: 14px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Pickup Location</p>
              <p style="margin: 0; font-size: 16px; color: #111827;">2116 4th Avenue West, Seattle, WA 98119</p>
              <p style="margin: 5px 0 0 0; font-size: 14px; color: #6b7280;">Equipment will be ready on the porch</p>
            </td>
          </tr>

          <!-- Help Link -->
          <tr>
            <td style="padding-bottom: 30px;">
              <a href="${process.env.NEXT_PUBLIC_URL}/guide" style="color: #059669; font-size: 14px; text-decoration: none;">
                View setup guide &rarr;
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="border-top: 1px solid #e5e7eb; padding-top: 25px; color: #6b7280; font-size: 14px;">
              <p style="margin: 0 0 5px 0;">Questions? <a href="mailto:support@firstserveseattle.com" style="color: #059669; text-decoration: none;">support@firstserveseattle.com</a> or <a href="tel:+12532529577" style="color: #059669; text-decoration: none;">(253) 252-9577</a></p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  }),

  bookingConfirmation: (date: Date, sessionsRemaining: number, rescheduleUrl?: string, cancelUrl?: string) => ({
    subject: "Booking Confirmed - Seattle Ball Machine",
    html: `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <meta name="color-scheme" content="light only" />
  <meta name="supported-color-schemes" content="light only" />
  <title>Booking Confirmation</title>
  <style>
    :root { color-scheme: light only; }
    @media (prefers-color-scheme: dark) {
      body, table, td, div, p, span { background-color: #ffffff !important; color: #111827 !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #ffffff; color: #111827; -webkit-text-size-adjust: 100%;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #ffffff;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table border="0" cellpadding="0" cellspacing="0" width="500" style="background-color: #ffffff;">

          <!-- Logo/Header -->
          <tr>
            <td style="padding-bottom: 30px;">
              <span style="color: #059669; font-size: 24px; font-weight: bold;">Seattle Ball Machine</span>
            </td>
          </tr>

          <!-- Main Message -->
          <tr>
            <td style="padding-bottom: 8px;">
              <h1 style="margin: 0; font-size: 28px; font-weight: bold; color: #111827;">You're all set!</h1>
            </td>
          </tr>

          <!-- Session Date/Time -->
          <tr>
            <td style="padding-bottom: 25px;">
              <p style="margin: 0; font-size: 20px; color: #111827; font-weight: 600;">
                ${date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })} at ${date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
              </p>
              <p style="margin: 8px 0 0 0; font-size: 14px; color: #6b7280;">
                2 hours &bull; 65 balls + basket &bull; ${sessionsRemaining} session${sessionsRemaining !== 1 ? "s" : ""} remaining
              </p>
            </td>
          </tr>

          <!-- Pickup Info -->
          <tr>
            <td style="padding-bottom: 25px; border-top: 1px solid #e5e7eb; padding-top: 25px;">
              <p style="margin: 0 0 8px 0; font-size: 14px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Pickup Location</p>
              <p style="margin: 0; font-size: 16px; color: #111827;">2116 4th Avenue West, Seattle, WA 98119</p>
              <p style="margin: 5px 0 0 0; font-size: 14px; color: #6b7280;">Equipment will be ready on the porch</p>
            </td>
          </tr>

          <!-- Setup Guide Link -->
          <tr>
            <td style="padding-bottom: 25px;">
              <a href="${process.env.NEXT_PUBLIC_URL}/guide" style="color: #059669; font-size: 14px; text-decoration: none;">
                View setup guide &rarr;
              </a>
            </td>
          </tr>

          <!-- Action Links -->
          ${rescheduleUrl || cancelUrl ? `
          <tr>
            <td style="padding-bottom: 25px;">
              ${rescheduleUrl ? `<a href="${rescheduleUrl}" style="color: #3b82f6; font-size: 14px; text-decoration: none; margin-right: 20px;">Reschedule</a>` : ""}
              ${cancelUrl ? `<a href="${cancelUrl}" style="color: #ef4444; font-size: 14px; text-decoration: none;">Cancel booking</a>` : ""}
            </td>
          </tr>
          ` : ""}

          <!-- Footer -->
          <tr>
            <td style="border-top: 1px solid #e5e7eb; padding-top: 25px; color: #6b7280; font-size: 14px;">
              <p style="margin: 0 0 5px 0;">Questions? <a href="mailto:support@firstserveseattle.com" style="color: #059669; text-decoration: none;">support@firstserveseattle.com</a> or <a href="tel:+12532529577" style="color: #059669; text-decoration: none;">(253) 252-9577</a></p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  }),

  bookingReminder: (date: Date, time: string) => ({
    subject: "Reminder: Your ball machine rental is tomorrow!",
    html: `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <meta name="color-scheme" content="light only" />
  <meta name="supported-color-schemes" content="light only" />
  <title>Booking Reminder</title>
  <style>
    :root { color-scheme: light only; }
    @media (prefers-color-scheme: dark) {
      body, table, td, div, p, span { background-color: #ffffff !important; color: #111827 !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #ffffff; color: #111827; -webkit-text-size-adjust: 100%;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #ffffff;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table border="0" cellpadding="0" cellspacing="0" width="500" style="background-color: #ffffff;">

          <!-- Logo/Header -->
          <tr>
            <td style="padding-bottom: 30px;">
              <span style="color: #059669; font-size: 24px; font-weight: bold;">Seattle Ball Machine</span>
            </td>
          </tr>

          <!-- Main Message -->
          <tr>
            <td style="padding-bottom: 8px;">
              <h1 style="margin: 0; font-size: 28px; font-weight: bold; color: #111827;">See you tomorrow!</h1>
            </td>
          </tr>

          <!-- Session Date/Time -->
          <tr>
            <td style="padding-bottom: 25px;">
              <p style="margin: 0; font-size: 20px; color: #111827; font-weight: 600;">
                ${date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })} at ${time}
              </p>
            </td>
          </tr>

          <!-- Pickup Info -->
          <tr>
            <td style="padding-bottom: 25px; border-top: 1px solid #e5e7eb; padding-top: 25px;">
              <p style="margin: 0 0 8px 0; font-size: 14px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Pickup Location</p>
              <p style="margin: 0; font-size: 16px; color: #111827;">2116 4th Avenue West, Seattle, WA 98119</p>
              <p style="margin: 5px 0 0 0; font-size: 14px; color: #6b7280;">Equipment will be ready on the porch</p>
            </td>
          </tr>

          <!-- Quick Tips -->
          <tr>
            <td style="padding-bottom: 25px; border-top: 1px solid #e5e7eb; padding-top: 25px;">
              <p style="margin: 0 0 10px 0; font-size: 14px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Quick reminders</p>
              <p style="margin: 0; font-size: 14px; color: #374151; line-height: 1.6;">
                Download the <strong>Proton Control</strong> app for easy machine control. Return equipment to the same porch location when done.
              </p>
            </td>
          </tr>

          <!-- Setup Guide Link -->
          <tr>
            <td style="padding-bottom: 25px;">
              <a href="${process.env.NEXT_PUBLIC_URL}/guide" style="color: #059669; font-size: 14px; text-decoration: none;">
                View setup guide &rarr;
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="border-top: 1px solid #e5e7eb; padding-top: 25px; color: #6b7280; font-size: 14px;">
              <p style="margin: 0 0 5px 0;">Questions? <a href="mailto:support@firstserveseattle.com" style="color: #059669; text-decoration: none;">support@firstserveseattle.com</a> or <a href="tel:+12532529577" style="color: #059669; text-decoration: none;">(253) 252-9577</a></p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  }),

  bookingCancelled: () => ({
    subject: "Booking Cancelled - Seattle Ball Machine",
    html: `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <meta name="color-scheme" content="light only" />
  <meta name="supported-color-schemes" content="light only" />
  <title>Booking Cancelled</title>
  <style>
    :root { color-scheme: light only; }
    @media (prefers-color-scheme: dark) {
      body, table, td, div, p, span { background-color: #ffffff !important; color: #111827 !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #ffffff; color: #111827; -webkit-text-size-adjust: 100%;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #ffffff;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table border="0" cellpadding="0" cellspacing="0" width="500" style="background-color: #ffffff;">

          <!-- Logo/Header -->
          <tr>
            <td style="padding-bottom: 30px;">
              <span style="color: #059669; font-size: 24px; font-weight: bold;">Seattle Ball Machine</span>
            </td>
          </tr>

          <!-- Main Message -->
          <tr>
            <td style="padding-bottom: 8px;">
              <h1 style="margin: 0; font-size: 28px; font-weight: bold; color: #111827;">Booking cancelled</h1>
            </td>
          </tr>

          <!-- Confirmation -->
          <tr>
            <td style="padding-bottom: 25px;">
              <p style="margin: 0; font-size: 16px; color: #374151; line-height: 1.6;">
                Your session credit has been restored. You can book another session anytime.
              </p>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td style="padding-bottom: 30px;">
              <a href="${process.env.NEXT_PUBLIC_URL}/book" style="display: inline-block; padding: 14px 28px; background-color: #059669; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 16px; border-radius: 6px;">
                Book Another Session
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="border-top: 1px solid #e5e7eb; padding-top: 25px; color: #6b7280; font-size: 14px;">
              <p style="margin: 0 0 5px 0;">Questions? <a href="mailto:support@firstserveseattle.com" style="color: #059669; text-decoration: none;">support@firstserveseattle.com</a> or <a href="tel:+12532529577" style="color: #059669; text-decoration: none;">(253) 252-9577</a></p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  }),

  noSessionsWarning: () => ({
    subject: "No Sessions Available - Action Required",
    html: `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <meta name="color-scheme" content="light only" />
  <meta name="supported-color-schemes" content="light only" />
  <title>No Sessions Available</title>
  <style>
    :root { color-scheme: light only; }
    @media (prefers-color-scheme: dark) {
      body, table, td, div, p, span { background-color: #ffffff !important; color: #111827 !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #ffffff; color: #111827; -webkit-text-size-adjust: 100%;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #ffffff;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table border="0" cellpadding="0" cellspacing="0" width="500" style="background-color: #ffffff;">

          <!-- Logo/Header -->
          <tr>
            <td style="padding-bottom: 30px;">
              <span style="color: #059669; font-size: 24px; font-weight: bold;">Seattle Ball Machine</span>
            </td>
          </tr>

          <!-- Main Message -->
          <tr>
            <td style="padding-bottom: 8px;">
              <h1 style="margin: 0; font-size: 28px; font-weight: bold; color: #111827;">Action required</h1>
            </td>
          </tr>

          <!-- Warning -->
          <tr>
            <td style="padding-bottom: 25px;">
              <p style="margin: 0; font-size: 16px; color: #374151; line-height: 1.6;">
                You've booked a session but have no credits remaining. Please purchase additional sessions to secure your booking.
              </p>
              <p style="margin: 15px 0 0 0; font-size: 14px; color: #ef4444;">
                Your booking may be automatically cancelled if payment is not received.
              </p>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td style="padding-bottom: 30px;">
              <a href="${process.env.NEXT_PUBLIC_URL}/#pricing" style="display: inline-block; padding: 14px 28px; background-color: #ef4444; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 16px; border-radius: 6px;">
                Purchase Sessions Now
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="border-top: 1px solid #e5e7eb; padding-top: 25px; color: #6b7280; font-size: 14px;">
              <p style="margin: 0 0 5px 0;">Questions? <a href="mailto:support@firstserveseattle.com" style="color: #059669; text-decoration: none;">support@firstserveseattle.com</a> or <a href="tel:+12532529577" style="color: #059669; text-decoration: none;">(253) 252-9577</a></p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  }),
}
