import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config(); // load .env file

const app = express();
app.use(express.json());

app.post("/api/send-invoice", async (req, res) => {
  const payload = req.body;

  if (!payload?.to) {
    return res.status(400).json({ message: "'to' email is required" });
  }

  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // must be server key

    // Call the Supabase Edge Function
    const supRes = await fetch(`${supabaseUrl}/functions/v1/send-invoice-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${serviceKey}`, // correct header
      },
      body: JSON.stringify(payload),
    });

    const data = await supRes.json().catch(() => null);

    if (!supRes.ok) {
      console.error("Supabase function error:", supRes.status, data);
      return res.status(500).json({ message: "Failed to call email function", error: data });
    }

    return res.status(200).json({ message: "Email sent successfully", data });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
