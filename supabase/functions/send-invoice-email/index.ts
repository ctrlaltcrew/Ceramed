import nodemailer from "npm:nodemailer";

Deno.serve(async (req) => {
  // ✅ Handle CORS preflight
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
    const body = await req.json();

    // ✅ Extract data from payload
    const to = body.to || body.customerEmail;
    const customerName = body.customerName || "Valued Customer";
    const orderId = body.orderId || "000000";
    const items = body.items || [];
    const total = body.total || "0.00";
    const shippingAddress = body.shippingAddress || "Not Provided";
    const billingAddress = body.billingAddress || "Not Provided";

    if (!to) throw new Error("No recipient email provided");

    // ✅ Gmail / SMTP transporter
    const transporter = nodemailer.createTransport({
      service: "gmail", // you can replace this with "smtp.hostinger.com" etc.
      auth: {
        user: Deno.env.get("EMAIL_USER"),
        pass: Deno.env.get("EMAIL_PASS"),
      },
    });

    // ✅ Build items HTML dynamically
    const itemsHTML = items
      .map(
        (item) => `
          <tr>
            <td style="padding:8px 0;">${item.name} (${item.size || ""})</td>
            <td style="text-align:right; padding:8px 0;">Rs. ${item.price}</td>
          </tr>
        `
      )
      .join("");

    // ✅ Responsive HTML Email Template
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>DIVERSITY Order Confirmation</title>
  <style>
    /* Base Styles */
    body { font-family: 'Segoe UI', sans-serif; background: #f8f8f8; margin: 0; padding: 0; }
    .container { max-width: 600px; background: #fff; margin: 20px auto; border-radius: 10px; overflow: hidden; box-shadow: 0 3px 8px rgba(0,0,0,0.08); }
    .header { background: #111; color: #fff; text-align: center; padding: 25px 10px; font-size: 20px; font-weight: 600; letter-spacing: 1px; }
    .content { padding: 25px; line-height: 1.6; }
    .content h2 { color: #222; font-size: 18px; margin-bottom: 10px; }
    .order-summary { background: #f4f4f4; padding: 15px; border-radius: 8px; margin: 20px 0; }
    .order-summary table { width: 100%; border-collapse: collapse; }
    .order-summary th, .order-summary td { text-align: left; }
    .total { font-weight: bold; border-top: 2px solid #ddd; padding-top: 10px; }
    .btn { display: inline-block; background: #111; color: #fff; text-decoration: none; padding: 12px 22px; border-radius: 6px; font-weight: 500; margin-top: 15px; }
    .btn-secondary { background: #444; }
    .footer { text-align: center; padding: 15px; color: #777; font-size: 13px; background: #fafafa; }

    /* Responsive Styles */
    @media only screen and (max-width: 600px) {
      .container { width: 95%; margin: 10px auto; }
      .content { padding: 20px; }
      .btn, .btn-secondary { display: block; width: 100%; text-align: center; margin-top: 10px; }
      .order-summary table td { display: block; text-align: left; }
      .order-summary td:last-child { text-align: left; margin-bottom: 10px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">DIVERSITY — Order #${orderId}</div>
    <div class="content">
      <h2>Thank you for your purchase!</h2>
      <p>Hi <b>${customerName}</b>, we're getting your order ready to be shipped.<br>
      We’ll notify you when it has been sent.</p>

      <a href="#" class="btn">View your order</a>
      <a href="https://diversity.pk" class="btn btn-secondary">Visit our store</a>

      <div class="order-summary">
        <table>
          <tr><th>Item</th><th style="text-align:right;">Price</th></tr>
          ${itemsHTML}
          <tr class="total"><td>Total</td><td style="text-align:right;">Rs. ${total} PKR</td></tr>
        </table>
      </div>

      <h3>Customer Information</h3>
      <p><b>Shipping address:</b><br>${shippingAddress.replace(/\n/g, "<br>")}</p>
      <p><b>Billing address:</b><br>${billingAddress.replace(/\n/g, "<br>")}</p>
      <p><b>Shipping method:</b> 🚚 Free Delivery (2 - 4 Working Days)</p>

      <p>If you have any questions, reply to this email or contact us at 
      <a href="mailto:support@diversity.pk">support@diversity.pk</a></p>
    </div>
    <div class="footer">© 2025 DIVERSITY. All rights reserved.</div>
  </div>
</body>
</html>
`;

    // ✅ Send the email
    const info = await transporter.sendMail({
      from: "DIVERSITY <ctrlaltcreww@gmail.com>",
      to,
      subject: `Order #${orderId} Confirmation - DIVERSITY`,
      html,
    });

    console.log("✅ Email sent successfully:", info.messageId);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Email sent successfully",
        messageId: info.messageId,
      }),
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    console.error("💥 Email send failed:", err);
    return new Response(
      JSON.stringify({
        success: false,
        error: err.message || "Internal Server Error",
      }),
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      }
    );
  }
});
