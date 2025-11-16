import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// Health check
app.get("/", (req, res) => res.send("Server is running"));

// Send invoice email
app.post("/api/send-invoice", async (req, res) => {
  const payload = req.body;

  if (!payload?.to) {
    return res.status(400).json({
      success: false,
      message: "'to' email is required"
    });
  }

  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    const supRes = await fetch(`${supabaseUrl}/functions/v1/send-invoice-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${serviceKey}`,

        "x-function-secret": process.env.SEND_INVOICE_SECRET
      },
      body: JSON.stringify(payload),
    });

    const data = await supRes.json().catch(() => ({
      error: "Invalid JSON response from function"
    }));

    if (!supRes.ok) {
      console.error("Supabase function error:", supRes.status, data);

      return res.status(500).json({
        success: false,
        message: "Supabase function failed",
        error: data.error || data.message || "Unknown error from edge function"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Invoice email sent successfully",
      data
    });

  } catch (err) {
    console.error("Server error:", err);

    return res.status(500).json({
      success: false,
      message: "Internal server error (backend)",
      error: err.message || err
    });
  }
});

// Server start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
