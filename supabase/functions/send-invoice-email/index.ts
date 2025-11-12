// supabase/functions/send-invoice-email/index.ts
Deno.serve(async (req) => {
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
    // ✅ Only POST allowed
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
        status: 405,
        headers: { "Access-Control-Allow-Origin": "*" },
      });
    }

    // ✅ Authorization check
    const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhwYXFvdHVyZWNldm95amptd2V6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzOTYzODIsImV4cCI6MjA3Mzk3MjM4Mn0.ohoFcJIiYeeZ3b16o_8U5OeKXgPez3JTMAD7maAtT7c";
    const authHeader = req.headers.get("Authorization") || req.headers.get("apikey");
    if (!authHeader || authHeader.replace("Bearer ", "") !== supabaseAnonKey) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Access-Control-Allow-Origin": "*" },
      });
    }

    const body = await req.json();
    const to = body.customerEmail;
    if (!to) throw new Error("Recipient email missing");

    const customerName = body.customerName || "Customer";
    const invoiceId = body.invoiceId || null;
    const orderId = body.orderId || Math.floor(Math.random() * 900000 + 100000);
    const items = body.items || [];
    const total = body.total || "0.00";
    const shippingAddress = body.shippingAddress || "Not Provided";
    const billingAddress = body.billingAddress || "Not Provided";

    // ✅ Use Brevo / SendGrid API key from secrets
    const SENDGRID_API_KEY = Deno.env.get("SENDGRID_API_KEY");
    if (!SENDGRID_API_KEY) throw new Error("SendGrid API key missing");

    const itemsHTML = items
      .map(
        (item: any) => `
        <tr>
          <td style="padding:8px 0;color:#333;">${item.name}${item.size ? ` (${item.size})` : ""}</td>
          <td style="padding:8px 0;text-align:right;color:#333;">₨${item.price}</td>
        </tr>`
      )
      .join("");

    const html = `
      <!DOCTYPE html>
      <html>
      <body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:20px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
                <tr>
                  <td align="center" style="background:#0b8686;color:#ffffff;padding:25px 10px;font-size:22px;font-weight:bold;">
                    Ceramed — Order #${orderId}
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
                      <a href="https://ceramed.pk" style="background:#0b8686;color:#fff;text-decoration:none;padding:12px 20px;border-radius:6px;display:inline-block;">Visit Store</a>
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
                      Questions? Contact us at <a href="mailto:support@ceramed.pk" style="color:#0b8686;">support@ceramed.pk</a>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="background:#fafafa;padding:15px;color:#777;font-size:13px;">
                    © 2025 Ceramed. All rights reserved.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SENDGRID_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: { email: "support@ceramed.pk", name: "Ceramed" },
        subject: `Order #${orderId} Confirmation`,
        content: [{ type: "text/html", value: html }],
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`SendGrid error: ${res.status} ${errorText}`);
    }

    return new Response(JSON.stringify({ success: true, orderId }), {
      status: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  } catch (err: any) {
    console.error("❌ Error sending email:", err);
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }
});
