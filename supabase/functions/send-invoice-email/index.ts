// Send invoice email via Supabase Edge Function
const sendInvoiceEmail = async (orderId: string) => {
  try {
    const res = await fetch(
      "https://xpaqoturecevoyjjmwez.functions.supabase.co/send-invoice-email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // ✅ Use anon key for JWT verification ON
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`, 
          // If using Next.js instead of Vite:
          // Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          customerEmail: customerData.email,
          customerName: customerData.name,
          orderId,
          items: cartItems.map((item) => ({
            name: item.product.name,
            quantity: item.quantity,
            price: item.product.price.toFixed(2),
          })),
          total: totalAmount.toFixed(2),
          shippingAddress: `${customerData.address}, ${customerData.city}${
            customerData.postalCode ? `, ${customerData.postalCode}` : ""
          }`,
          billingAddress: `${customerData.address}, ${customerData.city}${
            customerData.postalCode ? `, ${customerData.postalCode}` : ""
          }`,
        }),
      }
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed with status ${res.status}`);
    }

    console.log("Invoice email sent successfully");
  } catch (err: any) {
    console.error("Error sending invoice:", err);
    toast({
      title: "Error",
      description: "Failed to send invoice email. Please try again.",
      variant: "destructive",
    });
  }
};
