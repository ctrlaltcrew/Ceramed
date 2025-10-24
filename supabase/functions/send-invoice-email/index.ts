import { Resend } from "npm:resend@3.2.0";
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  "https://xpaqoturecevoyjjmwez.supabase.co",
  "<YOUR_PUBLIC_ANON_KEY>"
);

Deno.serve(async (req) => {
  try {
    const { email, name, orderId, total, items } = await req.json();

    if (!email) {
      return new Response(JSON.stringify({ error: "Missing email" }), { status: 400 });
    }

    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

    const html = `
      <h2>🧾 Invoice for your Order #${orderId}</h2>
      <p>Hi ${name || "Customer"},</p>
      <p>Thank you for shopping with us! Here's your invoice:</p>
      <ul>
        ${
          items?.map(
            (item: any) =>
              `<li>${item.name || item.product_name} × ${item.quantity} — ₨${item.price}</li>`
          ).join("")
        }
      </ul>
      <p><strong>Total:</strong> ₨${total}</p>
      <p>We hope to serve you again soon!</p>
    `;
    const supabase = createClient(
  "https://xpaqoturecevoyjjmwez.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);


    const { data, error } = await resend.emails.send({
      from: "Cera Biomed Vision <support@ceramed.org>",
      to: [email],
      subject: `Your Order Invoice #${orderId}`,
      html,
    });

    if (error) {
      console.error("Resend Error:", error);
      return new Response(JSON.stringify({ error }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true, data }), { status: 200 });
  } catch (err) {
    console.error("Function Error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});
