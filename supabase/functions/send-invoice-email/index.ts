// supabase/functions/send-invoice-email/index.ts

Deno.serve(async (req) => {
  console.log("📧 Function invoked");
  
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method Not Allowed" }), { 
        status: 405,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    // Verify authorization
    const authHeader = req.headers.get('Authorization');
    console.log("🔑 Auth header present:", !!authHeader);
    
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), { 
        status: 401,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    // Parse request body
    const body = await req.json();
    console.log("📦 Request body received");
    
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
          ${item.name} × ${item.quantity}
        </td>
        <td style="padding:8px 0;text-align:right;color:#333;">₨${item.price}</td>
      </tr>
    `).join("");

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
        
        <p style="font-size:18px;font-weight:bold;margin-top:20px;">
          Total: ₨${total}
        </p>
        
        <div style="margin-top:20px;padding:15px;background:#f5f5f5;border-radius:5px;">
          <p><strong>Shipping Address:</strong><br>${shippingAddress}</p>
          <p><strong>Billing Address:</strong><br>${billingAddress}</p>
        </div>
        
        <p style="margin-top:30px;color:#666;">
          Thank you for shopping with Ceramed!
        </p>
      </div>
    `;

    // Check for Brevo API key
    const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY");
    console.log("🔑 BREVO_API_KEY present:", !!BREVO_API_KEY);
    
    if (!BREVO_API_KEY) {
      console.error("❌ BREVO_API_KEY not configured");
      throw new Error("BREVO_API_KEY not configured");
    }

    console.log("📧 Sending email to:", to);

    // Send email using Brevo API
    const resp = await fetch("https://api.brevo.com/v3/smtp/email", {
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

    const result = await resp.json();
    console.log("📧 Brevo response status:", resp.status);
    console.log("📧 Brevo response:", JSON.stringify(result));

    if (!resp.ok) {
      console.error("❌ Brevo API error:", result);
      throw new Error(`Brevo API failed: ${JSON.stringify(result)}`);
    }

    console.log("✅ Email sent successfully");
    
    return new Response(JSON.stringify({ success: true, result }), {
      status: 200,
      headers: { 
        "Content-Type": "application/json", 
        "Access-Control-Allow-Origin": "*" 
      },
    });
  } catch (err: any) {
    console.error("❌ Error sending email:", err.message);
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: err.message
    }), {
      status: 500,
      headers: { 
        "Content-Type": "application/json", 
        "Access-Control-Allow-Origin": "*" 
      },
    });
  }
});