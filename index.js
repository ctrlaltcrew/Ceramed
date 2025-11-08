// ---------------------
// Load environment variables
// ---------------------
import dotenv from "dotenv";
dotenv.config();

// ---------------------
// Import dependencies
// ---------------------
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
// Nodemailer setup (Hostinger SMTP)
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
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setContent(invoiceHtml, { waitUntil: "networkidle0" });
  const pdfPath = path.join(PDF_PATH, filename);
  await page.pdf({ path: pdfPath, format: "A4" });
  await browser.close();
  return pdfPath;
}

// ---------------------
// Send invoice email
// ---------------------
async function sendInvoiceEmail(to, subject, html, pdfPath) {
  const info = await transporter.sendMail({
    from: `"Ceramed" <${process.env.HOSTINGER_USER}>`,
    to,
    subject,
    html,
    attachments: [
      { filename: "invoice.pdf", path: pdfPath }
    ],
  });
  console.log("✅ Email sent:", info.messageId);
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
    try {
      const invoiceHtml = `
        <h1>Invoice #${order.id}</h1>
        <p>Customer: ${order.customer_name}</p>
        <p>Email: ${order.customer_email}</p>
        <p>Amount: $${order.amount}</p>
        <p>Date: ${new Date(order.created_at).toLocaleDateString()}</p>
      `;

      const pdfFilename = `invoice-${order.id}.pdf`;
      const pdfPath = await generatePDF(invoiceHtml, pdfFilename);

      await sendInvoiceEmail(order.customer_email, `Your Invoice #${order.id}`, invoiceHtml, pdfPath);

      // Mark invoice as sent in Supabase
      await supabase
        .from("orders")
        .update({ invoice_sent: true })
        .eq("id", order.id);

      // Optional: delete PDF after sending
      fs.unlinkSync(pdfPath);

      console.log(`✅ Invoice sent and marked for order ${order.id}`);
    } catch (err) {
      console.error(`💥 Failed for order ${order.id}:`, err);
    }
  }
}

// ---------------------
// Run script
// ---------------------
processNewOrders()
  .then(() => console.log("All invoices processed"))
  .catch(err => console.error(err));
