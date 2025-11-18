import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";
import puppeteer from "puppeteer";
import { createClient } from "@supabase/supabase-js";
import path from "path";
import fs from "fs";

// ---------------------
// Supabase setup
// ---------------------
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// ---------------------
// Nodemailer setup
// ---------------------
const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.HOSTINGER_USER,
    pass: process.env.HOSTINGER_PASS,
  },
});

// ---------------------
// Ensure PDF path exists
// ---------------------
const PDF_PATH = process.env.PDF_PATH || "./invoices";
if (!fs.existsSync(PDF_PATH)) fs.mkdirSync(PDF_PATH);

// ---------------------
// Generate PDF from HTML
// ---------------------
async function generatePDF(invoiceHtml, filename) {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      executablePath: process.env.CHROME_PATH || undefined,
    });

    const page = await browser.newPage();
    await page.setContent(invoiceHtml, { waitUntil: "networkidle0" });

    const pdfPath = path.join(PDF_PATH, filename);
    await page.pdf({ path: pdfPath, format: "A4" });

    await browser.close();
    return pdfPath;
  } catch (err) {
    if (browser) await browser.close();
    throw new Error(`PDF generation failed: ${err.message}`);
  }
}

// ---------------------
// Send invoice email
// ---------------------
async function sendInvoiceEmail(to, subject, html, pdfPath) {
  try {
    const info = await transporter.sendMail({
      from: `"Ceramad" <${process.env.HOSTINGER_USER}>`,
      to,
      subject,
      html,
      attachments: [{ filename: "invoice.pdf", path: pdfPath }],
    });
    console.log("✅ Email sent:", info.messageId);
  } catch (err) {
    console.error("💥 Email send failed:", err.message);
    throw err;
  }
}

// ---------------------
// Process new orders
// ---------------------
async function processNewOrders() {
  const { data: orders, error } = await supabase
    .from("orders")
    .select("*")
    .eq("invoice_sent", false);

  if (error) {
    console.error("Supabase fetch error:", error);
    return;
  }

  for (const order of orders) {
    let pdfPath;
    try {
      const invoiceHtml = `
        <h1>Invoice #${order.id}</h1>
        <p>Customer: ${order.customer_name}</p>
        <p>Email: ${order.customer_email}</p>
        <p>Amount: $${order.amount}</p>
        <p>Date: ${new Date(order.created_at).toLocaleDateString()}</p>
      `;

      const pdfFilename = `invoice-${order.id}.pdf`;

      try {
        pdfPath = await generatePDF(invoiceHtml, pdfFilename);
      } catch (pdfError) {
        console.error(`⚠️ PDF generation failed for order ${order.id}:`, pdfError.message);
      }

      try {
        await sendInvoiceEmail(order.customer_email, `Your Invoice #${order.id}`, invoiceHtml, pdfPath);
      } catch (emailError) {
        console.error(`⚠️ Email sending failed for order ${order.id}:`, emailError.message);
      }

      // Mark order as processed even if PDF/email fails
      await supabase
        .from("orders")
        .update({ invoice_sent: true })
        .eq("id", order.id);

      // Delete PDF if created
      if (pdfPath && fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);

      console.log(`✅ Order processed: ${order.id}`);
    } catch (err) {
      console.error(`💥 Unexpected error for order ${order.id}:`, err.message);
    }
  }
}

// ---------------------
// Run script
// ---------------------
processNewOrders()
  .then(() => console.log("All orders processed"))
  .catch(err => console.error("💥 Fatal error:", err));
