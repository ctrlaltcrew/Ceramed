// supabase/functions/send-invoice-email/index.ts
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

Deno.serve(async (req) => {
  try {
    // --- CORS Preflight ---
    if (req.method === "OPTIONS") {
      return new Response("ok", {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    // Only allow POST requests
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
        status: 405,
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    // --- Parse JSON body ---
    let body;
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    // --- Validate required fields ---
    const to = body.customerEmail?.trim();
    if (!to) {
      return new Response(JSON.stringify({ error: "Recipient email missing" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    const customerName = (body.customerName || "Customer").trim();
    const orderId = body.orderId || Math.floor(Math.random() * 900000 + 100000);
    const items = Array.isArray(body.items) ? body.items : [];
    const total = body.total || "0.00";
    const shippingAddress = (body.shippingAddress || "Not Provided").trim();
    const billingAddress = (body.billingAddress || shippingAddress).trim();

    // --- Build HTML content ---
    const itemsHTML = items
      .map(
        (item: any) => `
      <tr>
        <td style="padding:8px 0;color:#333;">${item.name} × ${item.quantity}</td>
        <td style="padding:8px 0;text-align:right;color:#333;">₨${item.price}</td>
      </tr>`
      )
      .join("");

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Thank you for your order!</h2>
        <p>Hi <b>${customerName}</b>, your order is confirmed.</p>
        <p><strong>Order #${orderId}</strong></p>
        <table style="width:100%;border-collapse:collapse;margin:20px 0;">
          <thead>
            <tr style="border-bottom: 2px solid #ddd;">
              <th style="text-align:left;padding:8px;">Item</th>
              <th style="text-align:right;padding:8px;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHTML}
          </tbody>
        </table>
        <p style="font-size:18px;font-weight:bold;margin-top:20px;">Total: ₨${total}</p>
        <div style="margin-top:20px;padding:15px;background:#f5f5f5;border-radius:5px;">
          <p><strong>Shipping Address:</strong><br>${shippingAddress}</p>
          <p><strong>Billing Address:</strong><br>${billingAddress}</p>
        </div>
        <p style="margin-top:30px;color:#666;">Thank you for shopping with Ceramed!</p>
      </div>
    `;

    // --- SMTP Credentials ---
    const SMTP_HOST = Deno.env.get("SMTP_HOST")?.trim();
    const SMTP_PORT = parseInt(Deno.env.get("SMTP_PORT") || "465");
    const SMTP_USER = Deno.env.get("SMTP_USER")?.trim();
    const SMTP_PASS = Deno.env.get("SMTP_PASS")?.trim();

    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
      return new Response(
        JSON.stringify({ error: "SMTP credentials not configured" }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    // --- Send Email ---
    const client = new SMTPClient({
      connection: {
        hostname: SMTP_HOST,
        port: SMTP_PORT,
        tls: true, // Use true for SMTPS, false + starttls for 587
        auth: { username: SMTP_USER, password: SMTP_PASS },
      },
    });

    try {
      await client.send({
        from: SMTP_USER,
        to,
        subject: `Order #${orderId} Confirmation - Ceramed`,
        html,
      });
    } finally {
      await client.close(); // Ensure client always closes
    }

    return new Response(JSON.stringify({ success: true, message: "Email sent" }), {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    console.error("❌ Error sending email:", err.message || err);
    return new Response(JSON.stringify({ success: false, error: err.message || String(err) }), {
      status: 500,
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
});
