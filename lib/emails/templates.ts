export const emailTemplates = {
  purchaseConfirmation: (sessions: number, swingStick = false) => ({
    subject: "Your Seattle Ball Machine Rental is Confirmed!",
    html: `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Purchase Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8fafc; -webkit-text-size-adjust: 100%;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc;">
    <tr>
      <td align="center">
        <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff;">
          
          <!-- Header -->
          <tr>
            <td bgcolor="#059669" style="padding: 40px 30px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="color: #ffffff; font-size: 28px; font-weight: bold;">
                    Seattle Ball Machine
                  </td>
                </tr>
                <tr>
                  <td style="color: #ffffff; font-size: 18px; padding-top: 10px;">
                    Tennis Training Made Simple
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Success Status -->
          <tr>
            <td style="padding: 40px 30px 0 30px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td>
                    <table border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td bgcolor="#d1fae5" style="padding: 10px 20px; border-radius: 20px; color: #065f46; font-weight: bold;">
                          ✓ Payment Successful
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 20px; color: #111827; font-size: 24px; font-weight: bold;">
                    Thank You for Your Purchase!
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Package Details -->
          <tr>
            <td style="padding: 30px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f9fafb; border: 1px solid #e5e7eb;">
                <tr>
                  <td style="padding: 30px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="color: #374151; font-size: 18px; font-weight: bold; padding-bottom: 20px;">
                          Your Package Details
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <table border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                              <td style="color: #6b7280; padding: 10px 0; border-bottom: 1px solid #e5e7eb;">Sessions</td>
                              <td align="right" style="color: #111827; font-weight: bold; padding: 10px 0; border-bottom: 1px solid #e5e7eb;">${sessions} Session${sessions > 1 ? "s" : ""}</td>
                            </tr>
                            ${swingStick ? `
                            <tr>
                              <td style="color: #6b7280; padding: 10px 0; border-bottom: 1px solid #e5e7eb;">Add-on</td>
                              <td align="right" style="color: #111827; font-weight: bold; padding: 10px 0; border-bottom: 1px solid #e5e7eb;">SwingStick Phone Mount</td>
                            </tr>
                            ` : ""}
                            <tr>
                              <td style="color: #6b7280; padding: 10px 0; border-bottom: 1px solid #e5e7eb;">Duration</td>
                              <td align="right" style="color: #111827; font-weight: bold; padding: 10px 0; border-bottom: 1px solid #e5e7eb;">2 hours each</td>
                            </tr>
                            <tr>
                              <td style="color: #6b7280; padding: 10px 0;">Equipment</td>
                              <td align="right" style="color: #111827; font-weight: bold; padding: 10px 0;">65 balls + basket</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- CTA Button -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <table border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td bgcolor="#059669" style="border-radius: 8px;">
                    <a href="${process.env.NEXT_PUBLIC_URL}/rentalbooking#calendar" style="display: block; padding: 15px 30px; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 18px;">
                      Schedule Your First Session
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Pickup Information -->
          <tr>
            <td bgcolor="#f8fafc" style="padding: 30px; border-top: 1px solid #e5e7eb;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td>
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#ffffff" style="border: 1px solid #e5e7eb;">
                      <tr>
                        <td style="padding: 20px;">
                          <table border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                              <td style="color: #111827; font-size: 18px; font-weight: bold; padding-bottom: 15px;">
                                📍 Pickup Location
                              </td>
                            </tr>
                            <tr>
                              <td style="color: #374151; font-weight: bold;">
                                2116 4th Avenue West
                              </td>
                            </tr>
                            <tr>
                              <td style="color: #374151; font-weight: bold; padding-bottom: 10px;">
                                Seattle, WA 98119
                              </td>
                            </tr>
                            <tr>
                              <td style="color: #6b7280; font-size: 16px; font-style: italic;">
                                Equipment will be ready on the porch
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td bgcolor="#111827" style="padding: 30px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="color: #d1d5db; font-size: 18px; font-weight: bold; padding-bottom: 10px;">
                    Questions? We're here to help!
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom: 20px;">
                    <table border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="color: #9ca3af; font-size: 16px;">
                          <a href="mailto:support@firstserveseattle.com" style="color: #86efac; text-decoration: none;">
                            support@firstserveseattle.com
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td style="color: #9ca3af; font-size: 16px; padding-top: 5px;">
                          <a href="tel:+12532529577" style="color: #86efac; text-decoration: none;">
                            (253) 252-9577
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="border-top: 1px solid #374151; padding-top: 20px; color: #6b7280; font-size: 14px;">
                    © ${new Date().getFullYear()} Seattle Ball Machine. All rights reserved.
                  </td>
                </tr>
              </table>
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
  <title>Booking Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8fafc; -webkit-text-size-adjust: 100%;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc;">
    <tr>
      <td align="center">
        <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff;">
          
          <!-- Header -->
          <tr>
            <td bgcolor="#059669" style="padding: 40px 30px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="color: #ffffff; font-size: 28px; font-weight: bold;">
                    Seattle Ball Machine
                  </td>
                </tr>
                <tr>
                  <td style="color: #ffffff; font-size: 18px; padding-top: 10px;">
                    Tennis Training Made Simple
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Success Status -->
          <tr>
            <td style="padding: 40px 30px 0 30px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td>
                    <table border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td bgcolor="#d1fae5" style="padding: 10px 20px; border-radius: 20px; color: #065f46; font-weight: bold;">
                          ✓ Booking Confirmed
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 20px; color: #111827; font-size: 24px; font-weight: bold;">
                    See You Soon!
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Booking Details -->
          <tr>
            <td style="padding: 30px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f9fafb; border: 1px solid #e5e7eb;">
                <tr>
                  <td style="padding: 30px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="color: #374151; font-size: 18px; font-weight: bold; padding-bottom: 20px;">
                          📅 Your Session
                        </td>
                      </tr>
                      <tr>
                        <td style="color: #111827; font-size: 22px; font-weight: bold; padding-bottom: 5px;">
                          ${date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                        </td>
                      </tr>
                      <tr>
                        <td style="color: #059669; font-size: 20px; font-weight: bold; padding-bottom: 15px;">
                          ${date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                        </td>
                      </tr>
                      <tr>
                        <td style="color: #6b7280; font-size: 16px;">
                          2 hours • 65 balls + basket included
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Sessions Remaining -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#d1fae5" style="border: 1px solid #86efac;">
                <tr>
                  <td style="padding: 15px; color: #065f46; font-size: 16px; font-weight: bold;">
                    ${sessionsRemaining} session${sessionsRemaining !== 1 ? "s" : ""} remaining after this booking
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Action Buttons -->
          ${
            rescheduleUrl || cancelUrl
              ? `
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <table border="0" cellpadding="0" cellspacing="0">
                <tr>
                  ${
                    rescheduleUrl
                      ? `
                  <td style="padding-right: 10px;">
                    <table border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td bgcolor="#3b82f6" style="border-radius: 6px;">
                          <a href="${rescheduleUrl}" style="display: block; padding: 12px 24px; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 16px;">
                            Reschedule
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                  `
                      : ""
                  }
                  ${
                    cancelUrl
                      ? `
                  <td>
                    <table border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td bgcolor="#ffffff" style="border: 1px solid #ef4444; border-radius: 6px;">
                          <a href="${cancelUrl}" style="display: block; padding: 12px 24px; color: #ef4444; text-decoration: none; font-weight: bold; font-size: 16px;">
                            Cancel Booking
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                  `
                      : ""
                  }
                </tr>
              </table>
            </td>
          </tr>
          `
              : ""
          }
          
          <!-- Pickup Information -->
          <tr>
            <td bgcolor="#f8fafc" style="padding: 30px; border-top: 1px solid #e5e7eb;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td>
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#ffffff" style="border: 1px solid #e5e7eb;">
                      <tr>
                        <td style="padding: 20px;">
                          <table border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                              <td style="color: #111827; font-size: 18px; font-weight: bold; padding-bottom: 15px;">
                                📍 Pickup Location
                              </td>
                            </tr>
                            <tr>
                              <td style="color: #374151; font-weight: bold;">
                                2116 4th Avenue West
                              </td>
                            </tr>
                            <tr>
                              <td style="color: #374151; font-weight: bold; padding-bottom: 10px;">
                                Seattle, WA 98119
                              </td>
                            </tr>
                            <tr>
                              <td style="color: #6b7280; font-size: 16px; font-style: italic;">
                                Equipment will be ready on the porch
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td bgcolor="#111827" style="padding: 30px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="color: #d1d5db; font-size: 18px; font-weight: bold; padding-bottom: 10px;">
                    Questions? We're here to help!
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom: 20px;">
                    <table border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="color: #9ca3af; font-size: 16px;">
                          <a href="mailto:support@firstserveseattle.com" style="color: #86efac; text-decoration: none;">
                            support@firstserveseattle.com
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td style="color: #9ca3af; font-size: 16px; padding-top: 5px;">
                          <a href="tel:+12532529577" style="color: #86efac; text-decoration: none;">
                            (253) 252-9577
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="border-top: 1px solid #374151; padding-top: 20px; color: #6b7280; font-size: 14px;">
                    © ${new Date().getFullYear()} Seattle Ball Machine. All rights reserved.
                  </td>
                </tr>
              </table>
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
  <title>Booking Reminder</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8fafc; -webkit-text-size-adjust: 100%;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc;">
    <tr>
      <td align="center">
        <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff;">
          
          <!-- Header -->
          <tr>
            <td bgcolor="#059669" style="padding: 40px 30px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="color: #ffffff; font-size: 28px; font-weight: bold;">
                    Seattle Ball Machine
                  </td>
                </tr>
                <tr>
                  <td style="color: #ffffff; font-size: 18px; padding-top: 10px;">
                    Tennis Training Made Simple
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Reminder Status -->
          <tr>
            <td style="padding: 40px 30px 0 30px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td>
                    <table border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td bgcolor="#d1fae5" style="padding: 10px 20px; border-radius: 20px; color: #065f46; font-weight: bold;">
                          Tomorrow's Session
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 20px; color: #111827; font-size: 24px; font-weight: bold;">
                    See You Tomorrow!
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Session Details -->
          <tr>
            <td style="padding: 30px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f9fafb; border: 1px solid #e5e7eb;">
                <tr>
                  <td style="padding: 30px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="color: #111827; font-size: 22px; font-weight: bold; padding-bottom: 5px;">
                          ${date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                        </td>
                      </tr>
                      <tr>
                        <td style="color: #059669; font-size: 20px; font-weight: bold;">
                          ${time}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Pickup Location -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#ffffff" style="border: 2px solid #059669;">
                <tr>
                  <td style="padding: 20px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="color: #111827; font-size: 18px; font-weight: bold; padding-bottom: 15px;">
                          📍 Pickup Location
                        </td>
                      </tr>
                      <tr>
                        <td style="color: #374151; font-weight: bold;">
                          2116 4th Avenue West
                        </td>
                      </tr>
                      <tr>
                        <td style="color: #374151; font-weight: bold; padding-bottom: 10px;">
                          Seattle, WA 98119
                        </td>
                      </tr>
                      <tr>
                        <td style="color: #6b7280; font-size: 16px; font-style: italic;">
                          Equipment will be ready on the porch
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Tips Section -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#d1fae5" style="border: 1px solid #86efac;">
                <tr>
                  <td style="padding: 20px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="color: #065f46; font-size: 18px; font-weight: bold; padding-bottom: 12px;">
                          💡 Quick Reminders
                        </td>
                      </tr>
                      <tr>
                        <td style="color: #047857; font-size: 16px; padding-bottom: 5px;">
                          • Download the Proton Control app for easy machine control
                        </td>
                      </tr>
                      <tr>
                        <td style="color: #047857; font-size: 16px; padding-bottom: 5px;">
                          • Return equipment to the same porch location
                        </td>
                      </tr>
                      <tr>
                        <td style="color: #047857; font-size: 16px;">
                          • 65 balls and basket are included
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td bgcolor="#111827" style="padding: 30px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="color: #d1d5db; font-size: 18px; font-weight: bold; padding-bottom: 10px;">
                    Questions? We're here to help!
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom: 20px;">
                    <table border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="color: #9ca3af; font-size: 16px;">
                          <a href="mailto:support@firstserveseattle.com" style="color: #86efac; text-decoration: none;">
                            support@firstserveseattle.com
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td style="color: #9ca3af; font-size: 16px; padding-top: 5px;">
                          <a href="tel:+12532529577" style="color: #86efac; text-decoration: none;">
                            (253) 252-9577
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="border-top: 1px solid #374151; padding-top: 20px; color: #6b7280; font-size: 14px;">
                    © ${new Date().getFullYear()} Seattle Ball Machine. All rights reserved.
                  </td>
                </tr>
              </table>
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
  <title>Booking Cancelled</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8fafc; -webkit-text-size-adjust: 100%;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc;">
    <tr>
      <td align="center">
        <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff;">
          
          <!-- Header -->
          <tr>
            <td bgcolor="#6b7280" style="padding: 40px 30px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="color: #ffffff; font-size: 28px; font-weight: bold;">
                    Seattle Ball Machine
                  </td>
                </tr>
                <tr>
                  <td style="color: #ffffff; font-size: 18px; padding-top: 10px;">
                    Tennis Training Made Simple
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Cancelled Status -->
          <tr>
            <td style="padding: 40px 30px 0 30px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td>
                    <table border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td bgcolor="#fee2e2" style="padding: 10px 20px; border-radius: 20px; color: #991b1b; font-weight: bold;">
                          Booking Cancelled
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 20px; color: #111827; font-size: 24px; font-weight: bold;">
                    Your Booking Has Been Cancelled
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td style="padding: 30px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td>
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#d1fae5" style="border: 1px solid #86efac;">
                      <tr>
                        <td style="padding: 20px; color: #065f46; font-size: 18px; font-weight: bold;">
                          ✓ Your session credit has been restored
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 20px; padding-bottom: 20px; color: #6b7280; font-size: 18px;">
                    No worries! You can book another session anytime using your available credits.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- CTA Button -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <table border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td bgcolor="#059669" style="border-radius: 8px;">
                    <a href="${process.env.NEXT_PUBLIC_URL}/rentalbooking#calendar" style="display: block; padding: 15px 30px; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 18px;">
                      Book Another Session
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td bgcolor="#111827" style="padding: 30px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="color: #d1d5db; font-size: 18px; font-weight: bold; padding-bottom: 10px;">
                    Questions? We're here to help!
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom: 20px;">
                    <table border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="color: #9ca3af; font-size: 16px;">
                          <a href="mailto:support@firstserveseattle.com" style="color: #86efac; text-decoration: none;">
                            support@firstserveseattle.com
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td style="color: #9ca3af; font-size: 16px; padding-top: 5px;">
                          <a href="tel:+12532529577" style="color: #86efac; text-decoration: none;">
                            (253) 252-9577
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="border-top: 1px solid #374151; padding-top: 20px; color: #6b7280; font-size: 14px;">
                    © ${new Date().getFullYear()} Seattle Ball Machine. All rights reserved.
                  </td>
                </tr>
              </table>
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
  <title>No Sessions Available</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8fafc; -webkit-text-size-adjust: 100%;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc;">
    <tr>
      <td align="center">
        <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff;">
          
          <!-- Header -->
          <tr>
            <td bgcolor="#ef4444" style="padding: 40px 30px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="color: #ffffff; font-size: 28px; font-weight: bold;">
                    Seattle Ball Machine
                  </td>
                </tr>
                <tr>
                  <td style="color: #ffffff; font-size: 18px; padding-top: 10px;">
                    Action Required
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Warning Status -->
          <tr>
            <td style="padding: 40px 30px 0 30px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td>
                    <table border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td bgcolor="#fee2e2" style="padding: 10px 20px; border-radius: 20px; color: #991b1b; font-weight: bold;">
                          ⚠️ No Sessions Available
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 20px; color: #111827; font-size: 24px; font-weight: bold;">
                    Your Booking is at Risk
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td style="padding: 30px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td>
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#fee2e2" style="border: 1px solid #fecaca;">
                      <tr>
                        <td style="padding: 20px; color: #991b1b; font-size: 18px; font-weight: bold;">
                          You've booked a session but have no credits remaining.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 20px; padding-bottom: 20px; color: #6b7280; font-size: 18px;">
                    To secure your booking, please purchase additional sessions immediately.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- CTA Button -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <table border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td bgcolor="#ef4444" style="border-radius: 8px;">
                    <a href="${process.env.NEXT_PUBLIC_URL}/#pricing" style="display: block; padding: 15px 30px; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 18px;">
                      Purchase Sessions Now
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Warning Box -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#fee2e2" style="border: 1px solid #fecaca;">
                <tr>
                  <td style="padding: 15px; color: #991b1b; font-size: 16px;">
                    Your booking may be automatically cancelled if payment is not received.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td bgcolor="#111827" style="padding: 30px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="color: #d1d5db; font-size: 18px; font-weight: bold; padding-bottom: 10px;">
                    Questions? We're here to help!
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom: 20px;">
                    <table border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="color: #9ca3af; font-size: 16px;">
                          <a href="mailto:support@firstserveseattle.com" style="color: #86efac; text-decoration: none;">
                            support@firstserveseattle.com
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td style="color: #9ca3af; font-size: 16px; padding-top: 5px;">
                          <a href="tel:+12532529577" style="color: #86efac; text-decoration: none;">
                            (253) 252-9577
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="border-top: 1px solid #374151; padding-top: 20px; color: #6b7280; font-size: 14px;">
                    © ${new Date().getFullYear()} Seattle Ball Machine. All rights reserved.
                  </td>
                </tr>
              </table>
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