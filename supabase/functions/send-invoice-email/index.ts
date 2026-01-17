// TypeScript: declare Deno global to avoid type errors
declare const Deno: any;
// supabase/functions/send-invoice-email/index.ts

// Universal serve handler for Deno and Node.js
const serveHandler = async (req: any): Promise<Response> => {
  try {
    // --- Handle CORS preflight ---
    if (req.method === "OPTIONS") {
      return new Response("ok", {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    }

    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
        status: 405,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    // Parse JSON body
    const body = await req.json();
    const {
      customerEmail,
      customerName,
      orderId,
      items,
      total,
      shippingAddress,
      billingAddress
    } = body;

    console.log("📨 Received Email Request:");
    console.log("Customer:", customerName, "Email:", customerEmail);
    console.log("Shipping Address:", JSON.stringify(shippingAddress));
    console.log("Billing Address:", JSON.stringify(billingAddress));

    if (!customerEmail || !customerName || !orderId || !items || !total) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    const deliveryCharges = 200;
    const grandTotal = parseFloat(total) + deliveryCharges;

    // Build items HTML
    const itemsHTML = (items as Array<{ name: string; quantity: number; price: number }>).map((item) => `
      <tr>
        <td style="padding:8px 0;color:#333;">${item.name} × ${item.quantity}</td>
        <td style="padding:8px 0;text-align:right;color:#333;">₨${item.price}</td>
      </tr>
    `).join("");

    // Format address helper
    const formatAddress = (addr: { street?: string; city?: string; zip?: string } | undefined) =>
      addr && typeof addr === "object"
        ? `${addr.street || ""}, ${addr.city || ""}, ${addr.zip || ""}`
        : "Not provided";

    // Build invoice HTML
    // Build new email HTML template
    const logo_url = "https://ceramed.org/logo.png";
    const order_link = `https://ceramed.org/orders/${orderId}`;
    const support_email = "info@ceramed.org";
    const productRows = (items as Array<{ name: string; size?: string; price: number }>).map((item) => `
      <tr>
        <td>${item.name}${item.size ? ` (${item.size})` : ""}</td>
        <td align="right">Rs. ${item.price}</td>
      </tr>
    `).join("");
    const shipping = deliveryCharges;
    const tax = 0;
    const totalDisplay = grandTotal;
    // Extract address components safely - handle both object and string formats
    let address = "";
    let city = "";
    let country = "Pakistan";
    
    if (typeof shippingAddress === "object" && shippingAddress !== null) {
      address = shippingAddress.street || "";
      city = shippingAddress.city || "";
      country = shippingAddress.country || "Pakistan";
    } else if (typeof shippingAddress === "string") {
      // If it's a string, split by comma
      const parts = shippingAddress.split(",").map((p: string) => p.trim());
      address = parts[0] || "";
      city = parts[1] || "";
      country = parts[2] || "Pakistan";
    }
    
    // Extract billing address components
    let billingAddressStr = "";
    let billingCity = "";
    let billingCountry = "Pakistan";
    
    if (typeof billingAddress === "object" && billingAddress !== null) {
      billingAddressStr = billingAddress.street || address; // fallback to shipping
      billingCity = billingAddress.city || city;
      billingCountry = billingAddress.country || "Pakistan";
    } else if (typeof billingAddress === "string") {
      const parts = billingAddress.split(",").map((p: string) => p.trim());
      billingAddressStr = parts[0] || address;
      billingCity = parts[1] || city;
      billingCountry = parts[2] || "Pakistan";
    }
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Order Confirmation</title>
    </head>
    <body style="margin:0; padding:0; background-color:#f4f4f4; font-family:Arial, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; margin:30px 0; padding:30px; border-radius:6px;">
              <tr>
                <td align="center" style="padding-bottom:20px;">
                  <img src="${logo_url}" alt="Company Logo" width="120">
                </td>
              </tr>
              <tr>
                <td align="center">
                  <h2 style="margin:0; color:#333;">Thank you for your purchase!</h2>
                  <p style="color:#777; margin-top:8px;">
                    Order <strong>#${orderId}</strong>
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding:20px 0; color:#555; text-align:center;">
                  We're getting your order ready to be shipped.<br>
                  We’ll notify you once it has been sent after admin approval.
                </td>
              </tr>

              <tr>
                <td>
                  <h3 style="border-bottom:1px solid #eee; padding-bottom:10px;">Order Summary</h3>
                  <table width="100%" cellpadding="8">
                    ${productRows}
                    <tr>
                      <td>Shipping</td>
                      <td align="right">Rs. ${shipping}</td>
                    </tr>
                    <tr>
                      <td>Taxes</td>
                      <td align="right">Rs. ${tax}</td>
                    </tr>
                    <tr>
                      <td><strong>Total</strong></td>
                      <td align="right"><strong>Rs. ${totalDisplay}</strong></td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding-top:25px;">
                  <h3 style="border-bottom:1px solid #eee; padding-bottom:10px;">Customer Information</h3>
                  <p>
                    <strong>Shipping Address</strong><br>
                    ${customerName}<br>
                    ${address || "Address not provided"}<br>
                    ${city || "City not provided"}, ${country}
                  </p>
                  <p style="margin-top:15px;">
                    <strong>Billing Address</strong><br>
                    ${customerName}<br>
                    ${billingAddressStr || "Address not provided"}<br>
                    ${billingCity || "City not provided"}, ${billingCountry}
                  </p>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding-top:30px; color:#999; font-size:12px;">
                  If you have any questions, contact us at  
                  <a href="mailto:${support_email}" style="color:#8cc63f;">${support_email}</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `;

    // --- Send email via Brevo API ---
    // Get Brevo API key in a way compatible with Deno and Node.js
    let BREVO_API_KEY = undefined;
    if (typeof globalThis !== "undefined" && typeof (globalThis as any).Deno !== "undefined" && (globalThis as any).Deno.env && typeof (globalThis as any).Deno.env.get === "function") {
      BREVO_API_KEY = (globalThis as any).Deno.env.get("BREVO_API_KEY");
    } else if (typeof process !== "undefined" && process.env) {
      BREVO_API_KEY = process.env.BREVO_API_KEY;
    }
    if (!BREVO_API_KEY) {
      return new Response(JSON.stringify({ error: "Brevo API key not configured" }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    const brevoRes = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: { email: "info@ceramed.org", name: "Ceramed" },
        to: [{ email: customerEmail, name: customerName }],
        subject: `Order #${orderId} Received - Ceramed`,
        htmlContent: html,
      }),
    });

    console.log("Brevo API Response Status:", brevoRes.status);

    if (!brevoRes.ok) {
      const errText = await brevoRes.text();
      console.error("Brevo error:", brevoRes.status, errText);
      return new Response(JSON.stringify({ success: false, error: errText }), {
        status: brevoRes.status,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    console.log("Email sent successfully to:", customerEmail);
    return new Response(JSON.stringify({ success: true, message: "Order received email sent via Brevo" }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });

  } catch (err) {
    console.error("Error sending email:", err);
    return new Response(JSON.stringify({ success: false, error: String(err) }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
};

if (typeof globalThis !== "undefined" && typeof (globalThis as any).Deno !== "undefined" && typeof (globalThis as any).Deno.serve === "function") {
  (globalThis as any).Deno.serve(serveHandler);
}
export default serveHandler;
