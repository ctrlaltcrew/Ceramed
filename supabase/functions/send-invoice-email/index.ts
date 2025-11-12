// supabase/functions/send-invoice-email/index.ts

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
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

    // Parse request body
    const body = await req.json();
    const to = body.customerEmail;
    if (!to) throw new Error("Recipient email missing");

    const customerName = body.customerName || "Customer";
    const orderId = body.orderId || Math.floor(Math.random() * 900000 + 100000);
    const items = body.items || [];
    const total = body.total || "0.00";
    const shippingAddress = body.shippingAddress || "Not Provided";
    const billingAddress = body.billingAddress || "Not Provided";

    // Build items HTML
    const itemsHTML = items.map(item => `
      <tr>
        <td style="padding:8px 0;color:#333;">
          ${item.name}${item.size ? ` (${item.size})` : ""}
        </td>
        <td style="padding:8px 0;text-align:right;color:#333;">₨${item.price}</td>
      </tr>
    `).join("");

    // Email HTML content
    const html = `
      <h2>Thank you for your order!</h2>
      <p>Hi <b>${customerName}</b>, your order is confirmed. Order #${orderId}</p>
      <table>${itemsHTML}</table>
      <p><b>Total:</b> ₨${total}</p>
      <p><b>Shipping:</b> ${shippingAddress}</p>
      <p><b>Billing:</b> ${billingAddress}</p>
    `;

    // Brevo API key from environment
    const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY");
    if (!BREVO_API_KEY) throw new Error("Brevo API key not set");

    // Send email using Brevo API
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "content-type": "application/json",
        "api-key": BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: { name: "Ceramed", email: "info@ceramed.org" },
        to: [{ email: to, name: customerName }],
        subject: `Order #${orderId} Confirmation`,
        htmlContent: html,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Brevo API error: ${res.status} ${errText}`);
    }

    return new Response(JSON.stringify({ success: true, orderId }), {
      status: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });

  } catch (err) {
    console.error("❌ Error sending email:", err);
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }
});
