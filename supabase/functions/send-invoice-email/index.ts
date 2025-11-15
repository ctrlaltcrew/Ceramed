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
          "Access-Control-Allow-Headers": "content-type, x-function-secret",
        },
      });
    }

    // Only POST allowed
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method Not Allowed" }),
        { status: 405, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
      );
    }

    // --- Check secret ---
    const secretHeader = req.headers.get("x-function-secret");
    if (secretHeader !== Deno.env.get("SEND_INVOICE_SECRET")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
      );
    }

    // Parse JSON body
    const body = await req.json();

    const { customerEmail, customerName, orderId, items, total, shippingAddress, billingAddress } = body;

    if (!customerEmail || !customerName || !orderId || !items || !total) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
      );
    }

    // Build HTML
    const itemsHTML = items.map((i: any) => `<tr>
      <td>${i.name} × ${i.quantity}</td>
      <td>Rs${i.price}</td>
    </tr>`).join("");

    const html = `
      <h2>Invoice for Order #${orderId}</h2>
      <p>Hi ${customerName},</p>
      <table>${itemsHTML}</table>
      <p><strong>Total: Rs${total}</strong></p>
      <p><strong>Shipping:</strong> ${shippingAddress}</p>
      <p><strong>Billing:</strong> ${billingAddress}</p>
    `;

    // --- SMTP Client (Hostinger) ---
    const SMTP_HOST = Deno.env.get("SMTP_HOST");
    const SMTP_PORT = parseInt(Deno.env.get("SMTP_PORT") || "587");
    const SMTP_USER = Deno.env.get("SMTP_USER");
    const SMTP_PASS = Deno.env.get("SMTP_PASS");

    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
      return new Response(
        JSON.stringify({ error: "SMTP not configured" }),
        { status: 500, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
      );
    }

    const client = new SMTPClient({
      connection: {
        hostname: SMTP_HOST,
        port: SMTP_PORT,
        tls: SMTP_PORT === 465,
        auth: { username: SMTP_USER, password: SMTP_PASS },
      },
    });

    await client.send({
      from: SMTP_USER,
      to: customerEmail,
      subject: `Invoice for Order #${orderId}`,
      html,
    });
    await client.close();

    return new Response(
      JSON.stringify({ success: true, message: "Email sent" }),
      { status: 200, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
    );

  } catch (err) {
    console.error("Error sending email:", err);
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
    );
  }
});
