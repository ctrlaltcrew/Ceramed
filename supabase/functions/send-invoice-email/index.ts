// supabase/functions/send-invoice-email/index.ts
import { Resend } from "resend";

// ✅ Use environment variable for security
const resend = new Resend(process.env.RESEND_API_KEY);

Deno.serve(async (req) => {
  const startTime = Date.now();
  console.log("Function start:", new Date().toISOString());

  try {
    const bodyText = await req.text();
    if (!bodyText) return new Response("Missing request body", { status: 400 });

    let data;
    try { 
      data = JSON.parse(bodyText); 
    } catch (err) { 
      return new Response("Invalid JSON format", { status: 400 }); 
    }

    const { email, subject, message } = data;
    if (!email || !subject || !message) 
      return new Response("Missing fields: email, subject, message", { status: 400 });

    const result = await resend.emails.send({
      from: "CtrlAltCrew <noreply@ctrlaltcrew.tech>",
      to: [email],
      subject,
      html: `<p>${message}</p>`,
    });

    console.log("✅ Email send result:", result);
    return new Response(JSON.stringify({ success: true, result }), { status: 200 });

  } catch (error) {
    console.error("⚠️ Unexpected function error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message || error }),
      { status: 500 }
    );
  } finally {
    console.log(
      "Function end:",
      new Date().toISOString(),
      "Duration(ms):",
      Date.now() - startTime
    );
  }
});
