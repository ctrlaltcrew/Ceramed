import { serve } from "https://deno.land/std@0.203.0/http/server.ts";
import nodemailer from "npm:nodemailer";

serve(async (req) => {
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

    // Only allow POST
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    // --- Check function secret ---
    const functionSecret = req.headers.get("x-function-secret");
    if (functionSecret !== Deno.env.get("FUNCTION_SECRET")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    // Parse request body
    const { customerEmail, customerName, orderId, items, total, shippingAddress, billingAddress } = await req.json();

    if (!customerEmail || !customerName || !orderId || !items || !total) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    // --- Build invoice HTML ---
    const itemsHtml = items.map((i: any) => `
      <tr>
        <td style="padding:8px 0;color:#333;">${i.name} × ${i.quantity}</td>
        <td style="padding:8px 0;text-align:right;color:#333;">₨${i.price}</td>
      </tr>
    `).join("");

    const htmlContent = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <h2 style="color:#333;">Thank you for your order!</h2>
        <p>Hi <b>${customerName}</b>, your order is confirmed.</p>
        <p><strong>Order #${orderId}</strong></p>
        <table style="width:100%;border-collapse:collapse;margin:20px 0;">
          <thead>
            <tr style="border-bottom:2px solid #ddd;">
              <th style="text-align:left;padding:8px;">Item</th>
              <th style="text-align:right;padding:8px;">Price</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
        </table>
        <p style="font-size:18px;font-weight:bold;margin-top:20px;">Total: ₨${total}</p>
        <div style="margin-top:20px;padding:15px;background:#f5f5f5;border-radius:5px;">
          <p><strong>Shipping Address:</strong><br>${shippingAddress}</p>
          <p><strong>Billing Address:</strong><br>${billingAddress}</p>
        </div>
        <p style="margin-top:30px;color:#666;">Thank you for shopping with Ceramed!</p>
      </div>
    `;

    // --- Hostinger SMTP transporter ---
    const transporter = nodemailer.createTransport({
      host: Deno.env.get("SMTP_HOST"),
      port: parseInt(Deno.env.get("SMTP_PORT") || "587"),
      secure: false, // 465 = true, 587 = false
      auth: {
        user: Deno.env.get("SMTP_USER"),
        pass: Deno.env.get("SMTP_PASS"),
      },
    });

    await transporter.sendMail({
      from: `"Ceramed" <${Deno.env.get("SMTP_USER")}>`,
      to: customerEmail,
      subject: `Invoice for Order #${orderId}`,
      html: htmlContent,
    });

    return new Response(JSON.stringify({ success: true, message: "Email sent" }), {
      status: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });

  } catch (err) {
    console.error("Error sending invoice:", err);
    return new Response(JSON.stringify({ success: false, error: err.message || String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }
});
