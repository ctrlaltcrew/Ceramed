import nodemailer from "npm:nodemailer";

// Main Edge Function
Deno.serve(async (req) => {
  // ✅ Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey",
      },
    });
  }

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
    }

    const body = await req.json();

    const to = body.to || body.customerEmail;
    if (!to) throw new Error("No recipient email provided");

    const customerName = body.customerName || "Valued Customer";
    const orderId = body.orderId || Math.floor(Math.random() * 900000 + 100000);
    const items = body.items || [];
    const subtotal = parseFloat(body.subtotal || "0");
    const deliveryCost = parseFloat(body.deliveryCost || "0");
    const total = (subtotal + deliveryCost).toFixed(2);
    const shippingAddress = body.shippingAddress || "Not Provided";

    // ✅ SMTP credentials (from Hostinger)
    const host = Deno.env.get("SMTP_HOST") || "smtp.hostinger.com";
    const port = parseInt(Deno.env.get("SMTP_PORT") || "465");
    const user = Deno.env.get("SMTP_USER") || "info@ceramed.org";
    const pass = Deno.env.get("SMTP_PASS"); // set in Supabase Secrets

    if (!user || !pass) {
      throw new Error("SMTP credentials are missing in environment variables");
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: true,
      auth: { user, pass },
    });

    // ✅ Build product table HTML
    const itemsHTML = items
      .map(
        (item: any) => `
        <tr>
          <td style="padding:8px 0;color:#333;">${item.name} ${item.size ? `(${item.size})` : ""}</td>
          <td style="padding:8px 0;text-align:right;color:#333;">₨${item.price}</td>
        </tr>`
      )
      .join("");

    // ✅ Email HTML
    const html = `
    <html>
    <body style="margin:0;padding:0;background:#f8f9fa;font-family:Arial,Helvetica,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
              
              <!-- Header -->
              <tr>
                <td align="center" style="background:#004AAD;color:#ffffff;padding:25px 10px;font-size:22px;font-weight:bold;">
                  <img src="https://ceramed.org/logo.png" alt="Ceramed" style="max-height:40px;margin-bottom:10px;"/><br/>
                  Order Confirmation — #${orderId}
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding:30px;">
                  <h2 style="color:#222;margin-bottom:10px;">Thank you for your purchase, ${customerName}!</h2>
                  <p style="font-size:15px;color:#333;line-height:1.6;">
                    We’ve received your order and will start preparing it right away.
                    You’ll receive a tracking email once your package ships.
                  </p>

                  <!-- Order Summary -->
                  <div style="margin-top:20px;background:#f4f4f4;border-radius:8px;padding:15px;">
                    <h3 style="margin:0 0 10px 0;color:#222;">Order Summary</h3>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      ${itemsHTML}
                      <tr><td style="padding-top:10px;border-top:1px solid #ddd;">Subtotal</td><td style="padding-top:10px;text-align:right;">₨${subtotal.toFixed(2)}</td></tr>
                      <tr><td>Delivery</td><td style="text-align:right;">₨${deliveryCost.toFixed(2)}</td></tr>
                      <tr><td style="padding-top:10px;border-top:1px solid #ddd;font-weight:bold;">Total</td><td style="padding-top:10px;border-top:1px solid #ddd;text-align:right;font-weight:bold;">₨${total}</td></tr>
                    </table>
                  </div>

                  <!-- Shipping Info -->
                  <h3 style="margin-top:25px;color:#222;">Shipping Details</h3>
                  <p style="font-size:14px;color:#333;line-height:1.5;">
                    ${shippingAddress.replace(/\n/g, "<br>")}
                  </p>

                  <p style="font-size:14px;color:#555;">
                    Questions? Email us at 
                    <a href="mailto:support@ceramed.org" style="color:#004AAD;text-decoration:none;">support@ceramed.org</a>
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td align="center" style="background:#f1f1f1;padding:15px;color:#777;font-size:13px;">
                  © 2025 Ceramed. All rights reserved.
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>`;

    // ✅ Send email
    const info = await transporter.sendMail({
      from: `"Ceramed" <${user}>`,
      to,
      subject: `Your Ceramed Order #${orderId} Confirmation`,
      html,
    });

    console.log("✅ Email sent:", info.messageId);

    return new Response(JSON.stringify({ success: true, id: info.messageId }), {
      headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
    });

  } catch (err: any) {
    console.error("❌ Error sending email:", err);
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
    });
  }
});
