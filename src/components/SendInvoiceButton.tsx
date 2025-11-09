import React from "react";

interface Props {
  invoiceId: string;
  amount: number;
  customerEmail: string;
}

export default function SendInvoiceButton({ invoiceId, amount, customerEmail }: Props) {
  const handleSend = async () => {
    try {
      const res = await fetch("/api/send-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: customerEmail,
          invoiceId,
          amount,
          subject: `Invoice #${invoiceId}`,
          html: `<p>Invoice #${invoiceId}</p><p>Amount: ${amount}</p>`
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Request failed");

      alert("Email request sent successfully!");
      console.log(data);
    } catch (err) {
      console.error("Error sending invoice:", err);
      alert("Failed to send email: " + err.message);
    }
  };

  return (
    <button
      onClick={handleSend}
      className="px-4 py-2 bg-blue-600 text-white rounded"
    >
      Send Invoice
    </button>
  );
}
