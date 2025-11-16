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

  if (!payload?.customerEmail) {
    return res.status(400).json({
      success: false,
      message: "'customerEmail' is required"
    });
  }

  try {
    const supabaseUrl = process.env.SUPABASE_URL;

    // ✅ Use anon key for Authorization header
    const supRes = await fetch(`${supabaseUrl}/functions/v1/send-invoice-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify(payload),
    });

    // Safely parse JSON response
    const data = await supRes.json().catch(() => ({
      error: "Invalid JSON response from function"
    }));

    if (!supRes.ok) {
      console.error("Supabase function error:", supRes.status, data);

      return res.status(supRes.status).json({
        success: false,
        message: "Supabase function failed",
        error: data.error || data.message || "Unknown error"
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
      error: err.message || String(err)
    });
  }
});

// Server start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;