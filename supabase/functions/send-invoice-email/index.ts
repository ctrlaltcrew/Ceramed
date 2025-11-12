// supabase/functions/send-invoice-email/index.ts

Deno.serve(async (req) => {
  // CORS preflight
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
      return new Response(JSON.stringify({ error: "Method Not Allowed" }), { status: 405 });
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

    // Build HTML content
    const itemsHTML = items.map((item: any) => `
      <tr>
        <td style="padding:8px 0;color:#333;">
          ${item.name}${item.size ? ` (${item.size})` : ""}
        </td>
        <td style="padding:8px 0;text-align:right;color:#333;">₨${item.price}</td>
      </tr>
    `).join("");

    const html = `
      <h2>Thank you for your order!</h2>
      <p>Hi <b>${customerName}</b>, your order is confirmed. Order #${orderId}</p>
      <table>${itemsHTML}</table>
      <p>Total: ₨${total}</p>
      <p>Shipping Address: ${shippingAddress}</p>
      <p>Billing Address: ${billingAddress}</p>
    `;

    // Send email using Brevo API
    const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY");
    const resp = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "content-type": "application/json",
        "api-key": BREVO_API_KEY!,
      },
      body: JSON.stringify({
        sender: { name: "Ceramed", email: "info@ceramed.org" },
        to: [{ email: to, name: customerName }],
        subject: `Order #${orderId} Confirmation`,
        htmlContent: html,
      }),
    });

    const result = await resp.json();

    return new Response(JSON.stringify({ success: true, result }), {
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
