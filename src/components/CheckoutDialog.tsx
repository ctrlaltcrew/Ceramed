import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  product: {
    name: string;
    price: number;
    image_url: string;
  };
}

interface CheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cartItems: CartItem[];
  totalAmount: number;
}

const CheckoutDialog: React.FC<CheckoutDialogProps> = ({
  open,
  onOpenChange,
  cartItems,
  totalAmount,
}) => {
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

  // 🧾 Handle checkout
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!paymentMethod) {
      toast({
        title: "Payment method required",
        description: "Please select a payment method.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Step 1: Upload receipt if provided
      let receiptUrl: string | null = null;
      if (receiptFile) {
        const cleanFileName = receiptFile.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
        const fileName = `${Date.now()}_Receipt_${cleanFileName}`;

        const { data, error } = await supabase.storage
          .from("receipts")
          .upload(fileName, receiptFile, { cacheControl: "3600", upsert: false });

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage.from("receipts").getPublicUrl(fileName);
        receiptUrl = publicUrl;
      }

      const shipping_address = {
        address: customerData.address,
        city: customerData.city,
        postalCode: customerData.postalCode,
      };

      // Step 2: Create order
      const { data: newOrder, error: orderError } = await supabase
        .from("orders")
        .insert([{
          user_id: user?.id || null,
          session_id: user ? null : localStorage.getItem("cart_session_id") || crypto.randomUUID(),
          total_amount: totalAmount,
          status: "pending",
          payment_method: paymentMethod,
          payment_receipt: receiptUrl || null,
          customer_name: customerData.name,
          customer_email: customerData.email,
          customer_phone: customerData.phone,
          shipping_address,
        }])
        .select("id")
        .single();

      if (orderError) throw orderError;

      // Step 3: Insert order items
      if (newOrder?.id) {
        const orderItems = cartItems.map((item) => ({
          order_id: newOrder.id,
          product_id: item.product_id,
          product_name: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          total: item.quantity * item.product.price,
        }));

        const { error: itemsError } = await supabase
          .from("order_items")
          .insert(orderItems);

        if (itemsError) throw itemsError;

        // Step 4: Send invoice email via Supabase Edge Function
        await sendInvoiceEmail(newOrder.id);
      }

      // Step 5: Clear cart + success toast
      await clearCart();

      toast({
        title: "Order placed successfully 🎉",
        description: `Your order (total Rs.${totalAmount.toFixed(
          2
        )}) has been placed. Check your email for the invoice!`,
      });

      onOpenChange(false);
      setCustomerData({ name: "", email: "", phone: "", address: "", city: "", postalCode: "" });
      setPaymentMethod("");
      setReceiptFile(null);
      setReceiptPreview(null);

    } catch (error: any) {
      console.error("🔥 Order error:", error);
      toast({
        title: "Error placing order",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // 📨 Send invoice email (calls Supabase Edge Function)
  const sendInvoiceEmail = async (orderId: string) => {
    try {
      const items = cartItems.map((item) => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price.toFixed(2),
      }));

      const shippingAddress = `${customerData.address}, ${customerData.city}${customerData.postalCode ? `, ${customerData.postalCode}` : ""}`;

      await fetch("https://xpaqoturecevoyjjmwez.functions.supabase.co/send-invoice-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerEmail: customerData.email,
          customerName: customerData.name,
          orderId,
          items,
          total: totalAmount.toFixed(2),
          shippingAddress,
          billingAddress: shippingAddress,
        }),
      })
      .then(res => res.json())
      .then(data => console.log("Email result:", data))
      .catch(err => console.error("Error sending invoice:", err));

    } catch (error) {
      console.error("❌ Error preparing invoice:", error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setReceiptFile(file);
    if (file) setReceiptPreview(URL.createObjectURL(file));
  };

  const requiresReceipt = ["easypaisa", "jazzcash", "bank_transfer"].includes(paymentMethod);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Checkout</DialogTitle></DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Order Summary */}
          <div className="space-y-4">
            <h3 className="font-semibold">Order Summary</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <span>{item.product.name} × {item.quantity}</span>
                  <span>Rs{(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-2 font-semibold">Total: Rs{totalAmount.toFixed(2)}</div>
          </div>

          {/* Customer Info */}
          <div className="space-y-4">
            <h3 className="font-semibold">Customer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField id="name" label="Full Name *" value={customerData.name} onChange={v => setCustomerData(p => ({ ...p, name: v }))} required />
              <InputField id="email" label="Email *" type="email" value={customerData.email} onChange={v => setCustomerData(p => ({ ...p, email: v }))} required />
              <InputField id="phone" label="Phone Number *" value={customerData.phone} onChange={v => setCustomerData(p => ({ ...p, phone: v }))} required />
              <InputField id="city" label="City *" value={customerData.city} onChange={v => setCustomerData(p => ({ ...p, city: v }))} required />
              <div className="md:col-span-2">
                <Label htmlFor="address">Address *</Label>
                <Textarea id="address" value={customerData.address} onChange={e => setCustomerData(p => ({ ...p, address: e.target.value }))} required />
              </div>
              <InputField id="postalCode" label="Postal Code" value={customerData.postalCode} onChange={v => setCustomerData(p => ({ ...p, postalCode: v }))} />
            </div>
          </div>

          {/* Payment Section */}
          <div className="space-y-4">
            <h3 className="font-semibold">Payment Method</h3>
            <Select value={paymentMethod} onValueChange={setPaymentMethod} required>
              <SelectTrigger><SelectValue placeholder="Select payment method" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="easypaisa">EasyPaisa</SelectItem>
                <SelectItem value="jazzcash">JazzCash</SelectItem>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                <SelectItem value="cash_on_delivery">Cash on Delivery</SelectItem>
              </SelectContent>
            </Select>

            {requiresReceipt && (
              <div className="p-4 bg-muted rounded-lg space-y-3">
                <Label htmlFor="receipt">Upload Payment Screenshot</Label>
                <Input id="receipt" type="file" accept="image/*" onChange={handleFileChange} />
                {receiptPreview && <img src={receiptPreview} alt="Receipt Preview" className="mt-2 w-40 h-40 object-contain rounded-lg border" />}
              </div>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={loading} size="lg">
            {loading ? "Placing Order..." : `Place Order - Rs.${totalAmount.toFixed(2)}`}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Reusable InputField
const InputField = ({ id, label, value, onChange, type = "text", required = false }: any) => (
  <div>
    <Label htmlFor={id}>{label}</Label>
    <Input id={id} type={type} value={value} onChange={e => onChange(e.target.value)} required={required} />
  </div>
);

export default CheckoutDialog;
