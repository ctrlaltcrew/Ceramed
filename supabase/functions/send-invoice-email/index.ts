import nodemailer from "npm:nodemailer";

Deno.serve(async (req) => {
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
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
        status: 405,
        headers: { "Access-Control-Allow-Origin": "*" },
      });
    }

    const body = await req.json();

    const to = body.customerEmail;
    if (!to) throw new Error("Recipient email missing");

    const customerName = body.customerName || "Customer";
    const items = body.items || [];
    const subtotal = body.subtotal || 0;
    const deliveryCost = body.deliveryCost || 0;
    const total = subtotal + deliveryCost;
    const shippingAddress = body.shippingAddress || "Not Provided";
    const billingAddress = body.billingAddress || "Not Provided";

    const host = Deno.env.get("SMTP_HOST");
    const port = parseInt(Deno.env.get("SMTP_PORT") || "465");
    const user = Deno.env.get("SMTP_USER");
    const pass = Deno.env.get("SMTP_PASS");

    if (!host || !user || !pass) {
      throw new Error("SMTP credentials are missing in Edge Function secrets");
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    const itemsHTML = items
      .map(
        (item: any) => `
        <tr>
          <td style="padding:8px 0;color:#333;">${item.name}</td>
          <td style="padding:8px 0;text-align:right;color:#333;">₨${item.price}</td>
        </tr>`
      )
      .join("");

    const html = `
      <html>
      <body style="font-family:Arial,sans-serif;background:#f5f5f5;margin:0;padding:20px;">
        <table align="center" width="600" style="background:#fff;border-radius:10px;padding:20px;">
          <tr>
            <td style="text-align:center;background:#0b8686;color:#fff;padding:20px;font-size:22px;font-weight:bold;">
              Ceramed — Order Confirmation
            </td>
          </tr>
          <tr>
            <td style="padding:20px;">
              <h2>Hi ${customerName},</h2>
              <p>Thank you for your order! Here is your order summary:</p>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:10px;">
                ${itemsHTML}
                <tr>
                  <td style="padding-top:10px;border-top:1px solid #ddd;font-weight:bold;">Subtotal</td>
                  <td style="padding-top:10px;border-top:1px solid #ddd;text-align:right;">₨${subtotal}</td>
                </tr>
                <tr>
                  <td>Delivery Cost</td>
                  <td style="text-align:right;">₨${deliveryCost}</td>
                </tr>
                <tr>
                  <td style="font-weight:bold;border-top:1px solid #ddd;">Total</td>
                  <td style="text-align:right;font-weight:bold;border-top:1px solid #ddd;">₨${total}</td>
                </tr>
              </table>

              <h3>Shipping Address</h3>
              <p>${shippingAddress.replace(/\n/g, "<br>")}</p>

              <h3>Billing Address</h3>
              <p>${billingAddress.replace(/\n/g, "<br>")}</p>

              <p>Questions? Contact us at <a href="mailto:info@ceramed.org">info@ceramed.org</a></p>

              <p style="text-align:center;margin-top:20px;">
                <a href="https://ceramed.pk" style="background:#0b8686;color:#fff;padding:10px 20px;border-radius:5px;text-decoration:none;">Visit Store</a>
              </p>
            </td>
          </tr>
          <tr>
            <td style="text-align:center;color:#777;font-size:12px;padding:10px;">
              © 2025 Ceramed. All rights reserved.
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const info = await transporter.sendMail({
      from: `"Ceramed" <${user}>`,
      to,
      subject: `Order Confirmation - Ceramed`,
      html,
    });

    return new Response(
      JSON.stringify({ success: true, messageId: info.messageId }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      }
    );
  } catch (err: any) {
    console.error("❌ Error sending email:", err);
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }
});
