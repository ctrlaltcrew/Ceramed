// supabase/functions/send-invoice-email/index.ts

Deno.serve(async (req) => {
  // Handle CORS preflight
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

    // Authorization check
    const authHeader = req.headers.get("Authorization");
    const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");
    const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    if (token !== ANON_KEY && token !== SERVICE_ROLE_KEY) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
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
    const itemsHTML = items.map(
      (item) => `<tr>
        <td style="padding:8px 0;color:#333;">
          ${item.name}${item.size ? ` (${item.size})` : ""}
        </td>
        <td style="padding:8px 0;text-align:right;color:#333;">₨${item.price}</td>
      </tr>`
    ).join("");

    const html = `
      <html>
        <body style="font-family:Arial,Helvetica,sans-serif;background:#f5f5f5;padding:20px;">
          <h2>Thank you for your order, ${customerName}!</h2>
          <p>Order #${orderId} confirmed.</p>
          <h3>Order Summary</h3>
          <table>${itemsHTML}
            <tr>
              <td style="font-weight:bold;">Total</td>
              <td style="text-align:right;font-weight:bold;">₨${total}</td>
            </tr>
          </table>
          <p><b>Shipping Address:</b><br>${shippingAddress.replace(/\n/g, "<br>")}</p>
          <p><b>Billing Address:</b><br>${billingAddress.replace(/\n/g, "<br>")}</p>
          <p>Questions? Contact us at <a href="mailto:info@ceramed.org">info@ceramed.org</a></p>
        </body>
      </html>
    `;

    // Send email via Brevo API
    const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY");
    if (!BREVO_API_KEY) throw new Error("Brevo API key missing");

    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: { name: "Ceramed", email: "info@ceramed.org" },
        to: [{ email: to }],
        subject: `Order #${orderId} Confirmation`,
        htmlContent: html,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Brevo API error: ${res.status} ${errorText}`);
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
