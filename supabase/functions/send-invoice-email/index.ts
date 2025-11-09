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

    // ✅ Recipient & order info
    const to = body.to || body.customerEmail;
    if (!to) throw new Error("No recipient email provided");

    const customerName = body.customerName || "Customer";
    const invoiceId = body.invoiceId;
    const orderId = body.orderId || Math.floor(Math.random() * 900000 + 100000);
    const items = body.items || [];
    const total = body.total || "0.00";
    const shippingAddress = body.shippingAddress || "Not Provided";
    const billingAddress = body.billingAddress || "Not Provided";

    // ✅ SMTP config (from environment variables)
    const host = Deno.env.get("SMTP_HOST");
    const port = parseInt(Deno.env.get("SMTP_PORT") || "465");
    const user = Deno.env.get("SMTP_USER") || Deno.env.get("EMAIL_USER");
    const pass = Deno.env.get("SMTP_PASS") || Deno.env.get("EMAIL_PASS");

    if (!host || !user || !pass) {
      throw new Error("SMTP credentials not set in Edge Function secrets");
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    // ✅ Build items HTML table
    const itemsHTML = items
      .map((item: any) => `<tr>
        <td style="padding:8px 0;color:#333;">${item.name} ${item.size ? `(${item.size})` : ""}</td>
        <td style="padding:8px 0;text-align:right;color:#333;">₨${item.price}</td>
      </tr>`)
      .join("");

    // ✅ Generate email content
    let subject: string;
    let html: string;

    if (invoiceId) {
      // Invoice email
      subject = `Invoice #${invoiceId}`;
      html = `<p>Dear ${customerName},</p><p>Your invoice #${invoiceId} is ready.</p>`;
    } else {
      // Order confirmation email
      subject = `Order #${orderId} Confirmation - DIVERSITY`;
      html = `
<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:20px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
            <tr>
              <td align="center" style="background:#111;color:#ffffff;padding:25px 10px;font-size:22px;font-weight:bold;">
                DIVERSITY — Order #${orderId}
              </td>
            </tr>
            <tr>
              <td style="padding:30px;">
                <h2 style="color:#222;margin-bottom:10px;">Thank you for your order!</h2>
                <p style="font-size:15px;color:#333;line-height:1.6;">
                  Hi <b>${customerName}</b>, your order is confirmed.<br>
                  We'll notify you once it's shipped.
                </p>
                <div style="margin-top:20px;">
                  <a href="https://diversity.pk" style="background:#111;color:#fff;text-decoration:none;padding:12px 20px;border-radius:6px;display:inline-block;">Visit Store</a>
                </div>
                <div style="margin-top:30px;background:#f4f4f4;border-radius:8px;padding:15px;">
                  <h3 style="margin:0 0 10px 0;color:#222;">Order Summary</h3>
                  <table width="100%" cellpadding="0" cellspacing="0">
                    ${itemsHTML}
                    <tr>
                      <td style="padding-top:10px;border-top:1px solid #ddd;font-weight:bold;">Total</td>
                      <td style="padding-top:10px;border-top:1px solid #ddd;text-align:right;font-weight:bold;">₨${total}</td>
                    </tr>
                  </table>
                </div>
                <h3 style="margin-top:25px;color:#222;">Customer Information</h3>
                <p style="font-size:14px;color:#333;line-height:1.5;">
                  <b>Shipping address:</b><br>${shippingAddress.replace(/\n/g, "<br>")}<br><br>
                  <b>Billing address:</b><br>${billingAddress.replace(/\n/g, "<br>")}<br><br>
                  <b>Shipping method:</b> 🚚 Free Delivery (2 - 4 Working Days)
                </p>
                <p style="font-size:14px;color:#555;">
                  Questions? Contact us at <a href="mailto:support@diversity.pk" style="color:#111;">support@diversity.pk</a>
                </p>
              </td>
            </tr>
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
</html>`;
    }

    // ✅ Send the email
    const info = await transporter.sendMail({
      from: `"Ceramed / DIVERSITY" <${user}>`,
      to,
      subject,
      html,
    });

    console.log("✅ Email sent:", info.messageId);

    return new Response(JSON.stringify({ success: true, id: info.messageId }), {
      headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
    });

  } catch (err: any) {
    console.error("❌ Error sending invoice:", err);
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
    });
  }
});
