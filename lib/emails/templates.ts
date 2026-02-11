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
    * { color-scheme: light only !important; }
    @media (prefers-color-scheme: dark) {
      body, table, td, div, p, span, h1, a, strong { background-color: #ffffff !important; color: #111827 !important; }
    }
    [data-ogsc] body, [data-ogsc] table, [data-ogsc] td, [data-ogsc] div, [data-ogsc] p, [data-ogsc] span, [data-ogsc] h1 { background-color: #ffffff !important; color: #111827 !important; }
    u + .body { background-color: #ffffff !important; }
  </style>
</head>
<body class="body" style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #ffffff !important; color: #111827 !important; -webkit-text-size-adjust: 100%;">
  <div style="background-color: #ffffff !important; color: #111827 !important;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #ffffff !important;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width: 100% !important; background-color: #ffffff !important;">

          <!-- Logo/Header -->
          <tr>
            <td style="padding-bottom: 30px; background-color: #ffffff !important;">
              <span style="color: #059669 !important; font-size: 24px; font-weight: bold;">Seattle Ball Machine</span>
            </td>
          </tr>

          <!-- Main Message -->
          <tr>
            <td style="padding-bottom: 25px; background-color: #ffffff !important;">
              <h1 style="margin: 0; font-size: 28px; font-weight: bold; color: #111827 !important;">Thank you for your purchase!</h1>
            </td>
          </tr>

          <!-- Package Info -->
          <tr>
            <td style="padding-bottom: 25px; color: #374151 !important; font-size: 17px; line-height: 1.6; background-color: #ffffff !important;">
              <strong>${sessions} session${sessions > 1 ? "s" : ""}</strong> (2 hours each) with 65 balls + basket${swingStick ? ", plus SwingStick phone mount" : ""}.
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td style="padding-bottom: 30px; background-color: #ffffff !important;">
              <a href="${process.env.NEXT_PUBLIC_URL}/book" style="display: inline-block; padding: 14px 28px; background-color: #059669 !important; color: #ffffff !important; text-decoration: none; font-weight: bold; font-size: 17px; border-radius: 6px;">
                Schedule Your First Session
              </a>
            </td>
          </tr>

          <!-- Pickup Info -->
          <tr>
            <td style="padding-bottom: 30px; border-top: 1px solid #e5e7eb; padding-top: 25px; background-color: #ffffff !important;">
              <p style="margin: 0 0 8px 0; font-size: 15px; color: #6b7280 !important; text-transform: uppercase; letter-spacing: 0.5px; background-color: #ffffff !important;">Pickup Location</p>
              <p style="margin: 0; font-size: 17px; color: #111827 !important; background-color: #ffffff !important;">2116 4th Avenue West, Seattle, WA 98119</p>
              <p style="margin: 5px 0 0 0; font-size: 15px; color: #6b7280 !important; background-color: #ffffff !important;">Equipment will be ready on the porch</p>
            </td>
          </tr>

          <!-- Help Link -->
          <tr>
            <td style="padding-bottom: 30px; background-color: #ffffff !important;">
              <a href="${process.env.NEXT_PUBLIC_URL}/guide" style="color: #059669 !important; font-size: 15px; text-decoration: none;">
                View setup guide &rarr;
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="border-top: 1px solid #e5e7eb; padding-top: 25px; color: #6b7280 !important; font-size: 15px; background-color: #ffffff !important;">
              <p style="margin: 0 0 5px 0; background-color: #ffffff !important; color: #6b7280 !important;">Questions? <a href="mailto:support@firstserveseattle.com" style="color: #059669 !important; text-decoration: none;">support@firstserveseattle.com</a> or <a href="tel:+12532529577" style="color: #059669 !important; text-decoration: none;">(253) 252-9577</a></p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
  </div>
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
    * { color-scheme: light only !important; }
    @media (prefers-color-scheme: dark) {
      body, table, td, div, p, span, h1, a, strong { background-color: #ffffff !important; color: #111827 !important; }
    }
    [data-ogsc] body, [data-ogsc] table, [data-ogsc] td, [data-ogsc] div, [data-ogsc] p, [data-ogsc] span, [data-ogsc] h1 { background-color: #ffffff !important; color: #111827 !important; }
    u + .body { background-color: #ffffff !important; }
  </style>
</head>
<body class="body" style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #ffffff !important; color: #111827 !important; -webkit-text-size-adjust: 100%;">
  <div style="background-color: #ffffff !important; color: #111827 !important;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #ffffff !important;">
    <tr>
      <td align="center" style="padding: 40px 20px; background-color: #ffffff !important;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width: 100% !important; background-color: #ffffff !important;">

          <!-- Logo/Header -->
          <tr>
            <td style="padding-bottom: 30px; background-color: #ffffff !important;">
              <span style="color: #059669 !important; font-size: 24px; font-weight: bold;">Seattle Ball Machine</span>
            </td>
          </tr>

          <!-- Main Message -->
          <tr>
            <td style="padding-bottom: 8px; background-color: #ffffff !important;">
              <h1 style="margin: 0; font-size: 28px; font-weight: bold; color: #111827 !important;">You're all set!</h1>
            </td>
          </tr>

          <!-- Session Date/Time -->
          <tr>
            <td style="padding-bottom: 25px; background-color: #ffffff !important;">
              <p style="margin: 0; font-size: 22px; color: #111827 !important; font-weight: 600; background-color: #ffffff !important;">
                ${date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })} at ${date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
              </p>
              <p style="margin: 8px 0 0 0; font-size: 15px; color: #6b7280 !important; background-color: #ffffff !important;">
                2 hours &bull; 65 balls + basket &bull; ${sessionsRemaining} session${sessionsRemaining !== 1 ? "s" : ""} remaining
              </p>
            </td>
          </tr>

          <!-- Pickup Info -->
          <tr>
            <td style="padding-bottom: 25px; border-top: 1px solid #e5e7eb; padding-top: 25px; background-color: #ffffff !important;">
              <p style="margin: 0 0 8px 0; font-size: 15px; color: #6b7280 !important; text-transform: uppercase; letter-spacing: 0.5px; background-color: #ffffff !important;">Pickup Location</p>
              <p style="margin: 0; font-size: 17px; color: #111827 !important; background-color: #ffffff !important;">2116 4th Avenue West, Seattle, WA 98119</p>
              <p style="margin: 5px 0 0 0; font-size: 15px; color: #6b7280 !important; background-color: #ffffff !important;">Equipment will be ready on the porch</p>
            </td>
          </tr>

          <!-- Setup Guide Link -->
          <tr>
            <td style="padding-bottom: 25px; background-color: #ffffff !important;">
              <a href="${process.env.NEXT_PUBLIC_URL}/guide" style="color: #059669 !important; font-size: 15px; text-decoration: none;">
                View setup guide &rarr;
              </a>
            </td>
          </tr>

          <!-- Action Links -->
          ${rescheduleUrl || cancelUrl ? `
          <tr>
            <td style="padding-bottom: 25px; background-color: #ffffff !important;">
              ${rescheduleUrl ? `<a href="${rescheduleUrl}" style="color: #3b82f6 !important; font-size: 15px; text-decoration: none; margin-right: 20px;">Reschedule</a>` : ""}
              ${cancelUrl ? `<a href="${cancelUrl}" style="color: #ef4444 !important; font-size: 15px; text-decoration: none;">Cancel booking</a>` : ""}
            </td>
          </tr>
          ` : ""}

          <!-- Footer -->
          <tr>
            <td style="border-top: 1px solid #e5e7eb; padding-top: 25px; color: #6b7280 !important; font-size: 15px; background-color: #ffffff !important;">
              <p style="margin: 0 0 5px 0; background-color: #ffffff !important; color: #6b7280 !important;">Questions? <a href="mailto:support@firstserveseattle.com" style="color: #059669 !important; text-decoration: none;">support@firstserveseattle.com</a> or <a href="tel:+12532529577" style="color: #059669 !important; text-decoration: none;">(253) 252-9577</a></p>
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
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #ffffff !important; color: #111827 !important; -webkit-text-size-adjust: 100%;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #ffffff !important;">
    <tr>
      <td align="center" style="padding: 40px 20px; background-color: #ffffff !important;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width: 100% !important; background-color: #ffffff !important;">

          <!-- Logo/Header -->
          <tr>
            <td style="padding-bottom: 30px; background-color: #ffffff !important;">
              <span style="color: #059669 !important; font-size: 24px; font-weight: bold;">Seattle Ball Machine</span>
            </td>
          </tr>

          <!-- Main Message -->
          <tr>
            <td style="padding-bottom: 8px; background-color: #ffffff !important;">
              <h1 style="margin: 0; font-size: 28px; font-weight: bold; color: #111827 !important;">See you tomorrow!</h1>
            </td>
          </tr>

          <!-- Session Date/Time -->
          <tr>
            <td style="padding-bottom: 25px; background-color: #ffffff !important;">
              <p style="margin: 0; font-size: 22px; color: #111827 !important; font-weight: 600; background-color: #ffffff !important;">
                ${date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })} at ${time}
              </p>
            </td>
          </tr>

          <!-- Pickup Info -->
          <tr>
            <td style="padding-bottom: 25px; border-top: 1px solid #e5e7eb; padding-top: 25px; background-color: #ffffff !important;">
              <p style="margin: 0 0 8px 0; font-size: 15px; color: #6b7280 !important; text-transform: uppercase; letter-spacing: 0.5px; background-color: #ffffff !important;">Pickup Location</p>
              <p style="margin: 0; font-size: 17px; color: #111827 !important; background-color: #ffffff !important;">2116 4th Avenue West, Seattle, WA 98119</p>
              <p style="margin: 5px 0 0 0; font-size: 15px; color: #6b7280 !important; background-color: #ffffff !important;">Equipment will be ready on the porch</p>
            </td>
          </tr>

          <!-- Quick Tips -->
          <tr>
            <td style="padding-bottom: 25px; border-top: 1px solid #e5e7eb; padding-top: 25px; background-color: #ffffff !important;">
              <p style="margin: 0 0 10px 0; font-size: 15px; color: #6b7280 !important; text-transform: uppercase; letter-spacing: 0.5px; background-color: #ffffff !important;">Quick reminders</p>
              <p style="margin: 0; font-size: 17px; color: #374151 !important; line-height: 1.6; background-color: #ffffff !important;">
                Download the <strong>Proton Control</strong> app for easy machine control. Return equipment to the same porch location when done.
              </p>
            </td>
          </tr>

          <!-- Setup Guide Link -->
          <tr>
            <td style="padding-bottom: 25px; background-color: #ffffff !important;">
              <a href="${process.env.NEXT_PUBLIC_URL}/guide" style="color: #059669 !important; font-size: 15px; text-decoration: none;">
                View setup guide &rarr;
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="border-top: 1px solid #e5e7eb; padding-top: 25px; color: #6b7280 !important; font-size: 15px; background-color: #ffffff !important;">
              <p style="margin: 0 0 5px 0; background-color: #ffffff !important; color: #6b7280 !important;">Questions? <a href="mailto:support@firstserveseattle.com" style="color: #059669 !important; text-decoration: none;">support@firstserveseattle.com</a> or <a href="tel:+12532529577" style="color: #059669 !important; text-decoration: none;">(253) 252-9577</a></p>
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
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #ffffff !important; color: #111827 !important; -webkit-text-size-adjust: 100%;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #ffffff !important;">
    <tr>
      <td align="center" style="padding: 40px 20px; background-color: #ffffff !important;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width: 100% !important; background-color: #ffffff !important;">

          <!-- Logo/Header -->
          <tr>
            <td style="padding-bottom: 30px; background-color: #ffffff !important;">
              <span style="color: #059669 !important; font-size: 24px; font-weight: bold;">Seattle Ball Machine</span>
            </td>
          </tr>

          <!-- Main Message -->
          <tr>
            <td style="padding-bottom: 8px; background-color: #ffffff !important;">
              <h1 style="margin: 0; font-size: 28px; font-weight: bold; color: #111827 !important;">Booking cancelled</h1>
            </td>
          </tr>

          <!-- Confirmation -->
          <tr>
            <td style="padding-bottom: 25px; background-color: #ffffff !important;">
              <p style="margin: 0; font-size: 17px; color: #374151 !important; line-height: 1.6; background-color: #ffffff !important;">
                Your session credit has been restored. You can book another session anytime.
              </p>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td style="padding-bottom: 30px; background-color: #ffffff !important;">
              <a href="${process.env.NEXT_PUBLIC_URL}/book" style="display: inline-block; padding: 14px 28px; background-color: #059669 !important; color: #ffffff !important; text-decoration: none; font-weight: bold; font-size: 17px; border-radius: 6px;">
                Book Another Session
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="border-top: 1px solid #e5e7eb; padding-top: 25px; color: #6b7280 !important; font-size: 15px; background-color: #ffffff !important;">
              <p style="margin: 0 0 5px 0; background-color: #ffffff !important; color: #6b7280 !important;">Questions? <a href="mailto:support@firstserveseattle.com" style="color: #059669 !important; text-decoration: none;">support@firstserveseattle.com</a> or <a href="tel:+12532529577" style="color: #059669 !important; text-decoration: none;">(253) 252-9577</a></p>
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
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #ffffff !important; color: #111827 !important; -webkit-text-size-adjust: 100%;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #ffffff !important;">
    <tr>
      <td align="center" style="padding: 40px 20px; background-color: #ffffff !important;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width: 100% !important; background-color: #ffffff !important;">

          <!-- Logo/Header -->
          <tr>
            <td style="padding-bottom: 30px; background-color: #ffffff !important;">
              <span style="color: #059669 !important; font-size: 24px; font-weight: bold;">Seattle Ball Machine</span>
            </td>
          </tr>

          <!-- Main Message -->
          <tr>
            <td style="padding-bottom: 8px; background-color: #ffffff !important;">
              <h1 style="margin: 0; font-size: 28px; font-weight: bold; color: #111827 !important;">Action required</h1>
            </td>
          </tr>

          <!-- Warning -->
          <tr>
            <td style="padding-bottom: 25px; background-color: #ffffff !important;">
              <p style="margin: 0; font-size: 17px; color: #374151 !important; line-height: 1.6; background-color: #ffffff !important;">
                You've booked a session but have no credits remaining. Please purchase additional sessions to secure your booking.
              </p>
              <p style="margin: 15px 0 0 0; font-size: 15px; color: #ef4444 !important; background-color: #ffffff !important;">
                Your booking may be automatically cancelled if payment is not received.
              </p>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td style="padding-bottom: 30px; background-color: #ffffff !important;">
              <a href="${process.env.NEXT_PUBLIC_URL}/#pricing" style="display: inline-block; padding: 14px 28px; background-color: #ef4444 !important; color: #ffffff !important; text-decoration: none; font-weight: bold; font-size: 17px; border-radius: 6px;">
                Purchase Sessions Now
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="border-top: 1px solid #e5e7eb; padding-top: 25px; color: #6b7280 !important; font-size: 15px; background-color: #ffffff !important;">
              <p style="margin: 0 0 5px 0; background-color: #ffffff !important; color: #6b7280 !important;">Questions? <a href="mailto:support@firstserveseattle.com" style="color: #059669 !important; text-decoration: none;">support@firstserveseattle.com</a> or <a href="tel:+12532529577" style="color: #059669 !important; text-decoration: none;">(253) 252-9577</a></p>
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
