import nodemailer from "npm:nodemailer";

Deno.serve(async (req) => {
  // ✅ Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  try {
    const body = await req.json();

    // ✅ Extract order data
    const to = body.to || body.customerEmail;
    const customerName = body.customerName || "Valued Customer";
    const orderId = body.orderId || "000000";
    const items = body.items || [];
    const total = body.total || "0.00";
    const shippingAddress = body.shippingAddress || "Not Provided";
    const billingAddress = body.billingAddress || "Not Provided";

    if (!to) throw new Error("No recipient email provided");

    // ✅ Setup your mail transporter (SMTP)
    const transporter = nodemailer.createTransport({
      host: "mail.ceramed.org", // replace with your SMTP host
      port: 465,
      secure: true,
      auth: {
        user: Deno.env.get("EMAIL_USER"), // e.g. info@ceramed.org
        pass: Deno.env.get("EMAIL_PASS"),
      },
    });

    // ✅ Inline-styled HTML email (Gmail compatible)
    const html = `
<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background:#f5f5f5;padding:20px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
            
            <!-- Header -->
            <tr>
              <td align="center" style="background:#111;color:#ffffff;padding:25px 10px;font-size:22px;font-weight:bold;letter-spacing:1px;">
                DIVERSITY — Order #${orderId}
              </td>
            </tr>
            
            <!-- Content -->
            <tr>
              <td style="padding:30px;">
                <h2 style="color:#222;margin-bottom:10px;">Thank you for your purchase!</h2>
                <p style="font-size:15px;color:#333;line-height:1.6;">
                  Hi <b>${customerName}</b>, we're getting your order ready to be shipped.<br>
                  We’ll notify you when it has been sent.
                </p>
                
                <div style="margin-top:20px;">
                  <a href="#" style="background:#111;color:#fff;text-decoration:none;padding:12px 20px;border-radius:6px;display:inline-block;margin-right:10px;">View your order</a>
                  <a href="https://diversity.pk" style="background:#555;color:#fff;text-decoration:none;padding:12px 20px;border-radius:6px;display:inline-block;">Visit our store</a>
                </div>

                <!-- Order Summary -->
                <div style="margin-top:30px;background:#f4f4f4;border-radius:8px;padding:15px;">
                  <h3 style="margin:0 0 10px 0;color:#222;">Order Summary</h3>
                  <table width="100%" cellpadding="0" cellspacing="0">
                    ${items
                      .map(
                        (item) => `
                        <tr>
                          <td style="padding:8px 0;color:#333;">${item.name} ${item.size ? `(${item.size})` : ""}</td>
                          <td style="padding:8px 0;text-align:right;color:#333;">Rs. ${item.price}</td>
                        </tr>`
                      )
                      .join("")}
                    <tr>
                      <td style="padding-top:10px;border-top:1px solid #ddd;font-weight:bold;">Total</td>
                      <td style="padding-top:10px;border-top:1px solid #ddd;text-align:right;font-weight:bold;">Rs. ${total} PKR</td>
                    </tr>
                  </table>
                </div>

                <!-- Addresses -->
                <h3 style="margin-top:25px;color:#222;">Customer Information</h3>
                <p style="font-size:14px;color:#333;line-height:1.5;">
                  <b>Shipping address:</b><br>${shippingAddress.replace(/\n/g, "<br>")}<br><br>
                  <b>Billing address:</b><br>${billingAddress.replace(/\n/g, "<br>")}<br><br>
                  <b>Shipping method:</b> 🚚 Free Delivery (2 - 4 Working Days)
                </p>

                <p style="font-size:14px;color:#555;">
                  If you have any questions, reply to this email or contact us at 
                  <a href="mailto:support@diversity.pk" style="color:#111;">support@diversity.pk</a>
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td align="center" style="background:#fafafa;padding:15px;color:#777;font-size:13px;">
                © 2025 DIVERSITY. All rights reserved.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

    // ✅ Send the email
    const info = await transporter.sendMail({
      from: "DIVERSITY <info@ceramed.org>",
      to,
      subject: `Order #${orderId} Confirmation - DIVERSITY`,
      html,
    });

    console.log("✅ Email sent successfully:", info.messageId);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Email sent successfully",
        messageId: info.messageId,
      }),
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    console.error("💥 Email send failed:", err);
    return new Response(
      JSON.stringify({
        success: false,
        error: err.message || "Internal Server Error",
      }),
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      }
    );
  }
});
