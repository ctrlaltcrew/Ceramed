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

    // ✅ Extract fields dynamically from frontend or payload
    const to = body.to || body.customerEmail;
    const customerName = body.customerName || "Valued Customer";
    const orderId = body.orderId || "000000";
    const items = body.items || [];
    const total = body.total || "0.00";
    const shippingAddress = body.shippingAddress || "Not Provided";
    const billingAddress = body.billingAddress || "Not Provided";

    if (!to) throw new Error("No recipient email provided");

    // ✅ Create the transporter (using your real Gmail or SMTP)
    const transporter = nodemailer.createTransport({
      service: "gmail", // or your SMTP service
      auth: {
        user: Deno.env.get("EMAIL_USER"), // e.g., ctrlaltcreww@gmail.com
        pass: Deno.env.get("EMAIL_PASS"), // your app password
      },
    });

    // ✅ Build the items table dynamically
    const itemsHTML = items
      .map(
        (item) => `
          <tr>
            <td>${item.name} (${item.size || ""})</td>
            <td>Rs. ${item.price}</td>
          </tr>
        `
      )
      .join("");

    // ✅ Professional HTML template
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Order Confirmation</title>
  <style>
    body { font-family: 'Segoe UI', sans-serif; background-color: #f8f8f8; margin: 0; padding: 0; }
    .container { max-width: 600px; background: #fff; margin: 30px auto; border-radius: 10px; overflow: hidden; box-shadow: 0 3px 8px rgba(0,0,0,0.05); }
    .header { background: #111; color: #fff; text-align: center; padding: 25px; font-size: 20px; letter-spacing: 1px; }
    .content { padding: 25px; }
    .content h2 { color: #222; font-size: 18px; }
    .order-summary { background: #f4f4f4; padding: 15px; border-radius: 8px; margin: 20px 0; }
    .order-summary table { width: 100%; border-collapse: collapse; }
    .order-summary th, .order-summary td { text-align: left; padding: 8px 0; }
    .total { font-weight: bold; border-top: 2px solid #ddd; padding-top: 10px; }
    .btn { display: inline-block; background: #111; color: #fff; text-decoration: none; padding: 12px 22px; border-radius: 6px; font-weight: 500; margin-top: 15px; }
    .footer { text-align: center; padding: 15px; color: #777; font-size: 13px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">DIVERSITY — Order #${orderId}</div>
    <div class="content">
      <h2>Thank you for your purchase!</h2>
      <p>Hi <b>${customerName}</b>, we're getting your order ready to be shipped.<br>
      We will notify you when it has been sent.</p>

      <a href="#" class="btn">View your order</a>
      <a href="https://diversity.pk" class="btn" style="background:#444;">Visit our store</a>

      <div class="order-summary">
        <table>
          <tr><th>Item</th><th>Price</th></tr>
          ${itemsHTML}
          <tr class="total"><td>Total</td><td>Rs. ${total} PKR</td></tr>
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

    // ✅ Send email
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
