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
    const to = body.to;
    if (!to) throw new Error("No recipient email provided");

    const customerName = body.customerName || "Customer";
    const orderId = body.orderId || Math.floor(Math.random() * 900000 + 100000);
    const items = body.items || [];
    const total = body.total || "0.00";
    const shippingAddress = body.shippingAddress || "Not Provided";
    const billingAddress = body.billingAddress || "Not Provided";

    // ✅ SMTP config (set these in Supabase Edge Function secrets)
    const host = Deno.env.get("SMTP_HOST");
    const port = parseInt(Deno.env.get("SMTP_PORT") || "465");
    const user = Deno.env.get("SMTP_USER");
    const pass = Deno.env.get("SMTP_PASS");

    if (!host || !user || !pass) throw new Error("SMTP credentials not set");

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
      </tr>`).join("");

    // ✅ Generate email HTML
    const html = `
    <html>
      <body style="font-family:Arial,sans-serif;background:#f5f5f5;padding:20px;">
        <h2>Hi ${customerName},</h2>
        <p>Thank you for your order #${orderId}!</p>
        <table width="100%" style="background:#fff;padding:15px;border-radius:8px;">
          <tr><th>Product</th><th>Price</th></tr>
          ${itemsHTML}
          <tr>
            <td style="padding-top:10px;border-top:1px solid #ddd;font-weight:bold;">Total</td>
            <td style="padding-top:10px;border-top:1px solid #ddd;text-align:right;font-weight:bold;">₨${total}</td>
          </tr>
        </table>
        <p>Shipping Address: ${shippingAddress.replace(/\n/g, "<br>")}</p>
        <p>Billing Address: ${billingAddress.replace(/\n/g, "<br>")}</p>
      </body>
    </html>`;

    // ✅ Send the email
    const info = await transporter.sendMail({
      from: `"Diversity Store" <${user}>`,
      to,
      subject: `Order #${orderId} Confirmation`,
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
