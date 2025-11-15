import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

Deno.serve(async (req) => {
  console.log("📧 Function invoked");

  // CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "content-type, authorization"
      }
    });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }

  try {
    const body = await req.json();
    console.log("📦 Body:", body);

    const to = body.customerEmail;
    if (!to) throw new Error("Recipient email missing");

    const customerName = body.customerName || "Customer";
    const orderId = body.orderId || Math.floor(Math.random() * 900000 + 100000);
    const items = body.items || [];
    const total = body.total || "0.00";

    const itemsHTML = items.map((item) => `
      <tr>
        <td>${item.name} × ${item.quantity}</td>
        <td style="text-align:right;">₨${item.price}</td>
      </tr>
    `).join("");

    const html = `
      <div style="font-family: Arial; max-width: 600px;">
        <h2>Thank you for your order!</h2>
        <p>Hello <b>${customerName}</b>,</p>
        <p>Your order <b>#${orderId}</b> has been confirmed.</p>

        <table style="width:100%;margin-top:20px;">
          <tbody>${itemsHTML}</tbody>
        </table>

        <p style="font-size:18px;font-weight:bold;margin-top:20px;">
          Total: ₨${total}
        </p>

        <p style="margin-top:30px;">Thank you for shopping with Ceramed!</p>
      </div>
    `;

    // Hostinger SMTP
    const SMTP_HOST = Deno.env.get("SMTP_HOST");
    const SMTP_PORT = parseInt(Deno.env.get("SMTP_PORT") || "465");
    const SMTP_USER = Deno.env.get("SMTP_USER");
    const SMTP_PASS = Deno.env.get("SMTP_PASS");

    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
      throw new Error("SMTP credentials missing");
    }

    const client = new SMTPClient({
      connection: {
        hostname: SMTP_HOST,
        port: SMTP_PORT,
        tls: true,
        auth: {
          username: SMTP_USER,
          password: SMTP_PASS
        },
      },
    });

    console.log("📨 Sending email...");

    await client.send({
      from: SMTP_USER,
      to,
      subject: `Order Confirmation #${orderId}`,
      html,
    });

    await client.close();

    console.log("✅ Email sent");

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });

  } catch (err) {
    console.error("❌ Error:", err.message);

    return new Response(JSON.stringify({
      success: false,
      error: err.message
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
});
