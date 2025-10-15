import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

serve(async (req) => {
  try {
    const { email, orderId, name, total } = await req.json();

    // Compose a simple invoice message
    const subject = `Your Order #${orderId} is Confirmed`;
    const body = `
      Hi ${name},
      
      Your order (ID: ${orderId}) has been successfully verified and confirmed.  
      Total amount: $${total}.
      
      Thank you for shopping with us!

      — Cera Biomed Vision Team
    `;

    // Send email using Resend API (you can switch to SMTP if needed)
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Cera Biomed <no-reply@cerabiomed.com>",
        to: [email],
        subject,
        text: body,
      }),
    });

    if (!emailResponse.ok) {
      throw new Error(`Email send failed: ${await emailResponse.text()}`);
    }

    return new Response(
      JSON.stringify({ success: true, message: "Invoice email sent successfully" }),
      { headers: { "Content-Type": "application/json" }, status: 200 },
    );

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});
