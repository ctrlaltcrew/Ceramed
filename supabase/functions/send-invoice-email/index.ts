import nodemailer from "npm:nodemailer";

Deno.serve(async (req) => {
  // Handle CORS preflight
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
    const { customerEmail, invoiceHtml } = await req.json();

    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      auth: {
        user: Deno.env.get("BREVO_USER"),
        pass: Deno.env.get("BREVO_PASS"),
      },
    });

    await transporter.sendMail({
      from: Deno.env.get("BREVO_USER"),
      to: customerEmail,
      subject: "Your Invoice",
      html: invoiceHtml,
    });

    return new Response(
      JSON.stringify({ message: "Email sent successfully" }),
      {
        headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: err.message || "Email sending failed" }),
      {
        status: 500,
        headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
      }
    );
  }
});
