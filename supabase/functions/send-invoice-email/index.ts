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

    // ✅ Accept flexible key names
    const to =
      body.to || body.customerEmail || body.email || body.recipientEmail;
    const subject = body.subject || "Your Invoice";
    const html =
      body.html || body.invoiceHtml || "<p>No invoice content provided.</p>";

    // 🧩 Log for debugging
    console.log("📧 Email details received:", { to, subject });

    // ✅ Ensure recipient exists
    if (!to) {
      throw new Error("No recipient email provided");
    }

    // ✅ Create Brevo transporter
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false,
      auth: {
        user: Deno.env.get("BREVO_USER"),
        pass: Deno.env.get("BREVO_PASS"),
      },
    });

    // ✅ Send the email
    const info = await transporter.sendMail({
      from: Deno.env.get("BREVO_USER"),
      to,
      subject,
      html,
    });

    console.log("✅ Email sent:", info.messageId);

    return new Response(JSON.stringify({ success: true, messageId: info.messageId }), {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    console.error("💥 Email send failed:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Internal Server Error" }),
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
