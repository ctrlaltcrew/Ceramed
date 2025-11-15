const CheckoutDialog: React.FC<CheckoutDialogProps> = ({ open, onOpenChange, cartItems, totalAmount }) => {
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [customerData, setCustomerData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });

  const { user } = useAuth();
  const { clearCart } = useCart();
  const { toast } = useToast();

  // Generate guest session ID
  const getSessionId = () => {
    const existing = localStorage.getItem("cart_session_id");
    if (existing) return existing;
    const newId = crypto.randomUUID();
    localStorage.setItem("cart_session_id", newId);
    return newId;
  };

  // Upload receipt file
  const uploadReceipt = async (file: File) => {
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const fileName = `${Date.now()}_Receipt_${cleanFileName}`;
    const { error } = await supabase.storage.from("receipts").upload(fileName, file, { cacheControl: "3600", upsert: false });
    if (error) throw new Error("Failed to upload receipt: " + error.message);
    const { data } = supabase.storage.from("receipts").getPublicUrl(fileName);
    return data.publicUrl;
  };

  // ✅ Paste sendInvoiceEmail here
  const sendInvoiceEmail = async (orderId: string) => {
    const email = customerData.email?.trim();
    const name = customerData.name?.trim();

    if (!email || !email.includes("@")) {
      console.warn("Invalid email, skipping send");
      return;
    }
    if (!name) {
      console.warn("Customer name missing, skipping send");
      return;
    }

    const items = cartItems.map((item) => ({
      name: item.product.name,
      quantity: item.quantity,
      price: item.product.price.toFixed(2),
    }));

    if (!items.length) {
      console.warn("Cart is empty, skipping send");
      return;
    }

    const body = {
      customerEmail: email,
      customerName: name,
      orderId: String(orderId),
      items,
      total: totalAmount.toFixed(2),
      shippingAddress: `${customerData.address}, ${customerData.city}${customerData.postalCode ? `, ${customerData.postalCode}` : ""}`,
      billingAddress: `${customerData.address}, ${customerData.city}${customerData.postalCode ? `, ${customerData.postalCode}` : ""}`,
    };

    try {
      const res = await fetch("https://xpaqoturecevoyjjmwez.functions.supabase.co/send-invoice-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Failed to send email:", text);
      } else {
        const data = await res.json();
        console.log("Invoice email sent successfully:", data);
      }
    } catch (err) {
      console.error("Error sending invoice:", err);
    }
  };

  // Handle checkout submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const email = customerData.email.trim();
    const name = customerData.name.trim();

    if (!paymentMethod) {
      toast({ title: "Payment method required", description: "Please select a payment method.", variant: "destructive" });
      return;
    }
    if (!email || !email.includes("@") || !name) {
      toast({ title: "Valid info required", description: "Please enter a valid name and email.", variant: "destructive" });
      return;
    }

    setLoading(true);

    try {
      let receiptUrl: string | null = null;
      if (receiptFile) receiptUrl = await uploadReceipt(receiptFile);

      const shipping_address = {
        address: customerData.address,
        city: customerData.city,
        postalCode: customerData.postalCode,
      };

      // Insert order
      const { data: newOrder, error: orderError } = await supabase.from("orders").insert([{
        user_id: user?.id || null,
        session_id: user ? null : getSessionId(),
        total_amount: totalAmount,
        status: "pending",
        payment_method: paymentMethod,
        payment_receipt: receiptUrl || null,
        customer_name: name,
        customer_email: email,
        customer_phone: customerData.phone,
        shipping_address,
      }]).select("id").single();

      if (orderError) throw orderError;

      // Insert order items
      if (newOrder?.id) {
        const orderItems = cartItems.map((item) => ({
          order_id: newOrder.id,
          product_id: item.product_id,
          product_name: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          total: item.product.price * item.quantity,
        }));

        const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
        if (itemsError) throw itemsError;

        // ✅ Call sendInvoiceEmail after order is created
        await sendInvoiceEmail(newOrder.id);
      }

      // Clear cart & show success toast
      await clearCart();
      toast({ title: "Order placed successfully 🎉", description: `Your order (total Rs.${totalAmount.toFixed(2)}) has been placed. Check your email for the invoice!` });

      // Reset form
      onOpenChange(false);
      setCustomerData({ name: "", email: "", phone: "", address: "", city: "", postalCode: "" });
      setPaymentMethod("");
      setReceiptFile(null);
      setReceiptPreview(null);
    } catch (error: any) {
      console.error("Order error:", error);
      toast({ title: "Error placing order", description: error.message || "Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // Handle receipt file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setReceiptFile(file);
    if (file) setReceiptPreview(URL.createObjectURL(file));
  };

  const requiresReceipt = ["easypaisa", "jazzcash", "bank_transfer"].includes(paymentMethod);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* ... form JSX as before ... */}
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutDialog;
