import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

serve(async (req) => {
  try {
    const { customerEmail, invoiceHtml } = await req.json();

    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "content-type": "application/json",
        "api-key": Deno.env.get("BREVO_API_KEY"),
      },
      body: JSON.stringify({
        sender: { name: "Ceramed", email: "no-reply@ceramed.org" },
        to: [{ email: customerEmail }],
        subject: "Your Invoice from Ceramed",
        htmlContent:
          invoiceHtml ||
          "<h2>Thank you for your order!</h2><p>Your invoice is attached below.</p>",
      }),
    });

    const data = await res.json();

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Email send error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { "Content-Type": "application/json" }, status: 500 },
    );
  }
});
