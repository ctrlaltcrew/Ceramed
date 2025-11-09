import SendInvoiceButton from "../components/SendInvoiceButton";

export default function Home() {
  return (
    <div>
      <h1>Invoices</h1>
      <SendInvoiceButton
        invoiceId="INV-001"
        amount={2500}
        customerEmail="customer@example.com"
      />
    </div>
  );
}
