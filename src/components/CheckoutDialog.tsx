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

  // 🧠 Get or create local session ID
  const getSessionId = () => {
    const existing = localStorage.getItem("cart_session_id");
    if (existing) return existing;
    const newId = crypto.randomUUID();
    localStorage.setItem("cart_session_id", newId);
    return newId;
  };

  // 📤 Upload receipt image to Supabase
  const uploadReceipt = async (file: File) => {
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const fileName = `${Date.now()}_Receipt_${cleanFileName}`;

    console.log("Uploading file as:", fileName);

    const { data, error } = await supabase.storage
      .from("receipts")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("❌ Supabase Upload Error:", error.message);
      throw new Error("Failed to upload receipt. " + error.message);
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("receipts").getPublicUrl(fileName);

    return publicUrl;
  };

  // 📧 Send invoice email directly via Brevo API (from client)
  const sendInvoiceEmail = async (orderId: string) => {
    try {
      const items = cartItems.map((item) => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price.toFixed(2),
      }));

      const shippingAddress = `${customerData.address}, ${customerData.city}${
        customerData.postalCode ? `, ${customerData.postalCode}` : ""
      }`;

      // Build HTML content
      const itemsHTML = items.map((item) => `
        <tr>
          <td style="padding:8px 0;color:#333;">
            ${item.name} × ${item.quantity}
          </td>
          <td style="padding:8px 0;text-align:right;color:#333;">₨${item.price}</td>
        </tr>
      `).join("");

      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Thank you for your order!</h2>
          <p>Hi <b>${customerData.name}</b>, your order is confirmed.</p>
          <p><strong>Order #${orderId}</strong></p>
          
          <table style="width:100%;border-collapse:collapse;margin:20px 0;">
            <thead>
              <tr style="border-bottom: 2px solid #ddd;">
                <th style="text-align:left;padding:8px;">Item</th>
                <th style="text-align:right;padding:8px;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
            </tbody>
          </table>
          
          <p style="font-size:18px;font-weight:bold;margin-top:20px;">
            Total: ₨${totalAmount.toFixed(2)}
          </p>
          
          <div style="margin-top:20px;padding:15px;background:#f5f5f5;border-radius:5px;">
            <p><strong>Shipping Address:</strong><br>${shippingAddress}</p>
            <p><strong>Billing Address:</strong><br>${shippingAddress}</p>
          </div>
          
          <p style="margin-top:30px;color:#666;">
            Thank you for shopping with Ceramed!
          </p>
        </div>
      `;

      console.log("📧 Sending invoice email to:", customerData.email);

      // Call Brevo API directly (you'll need to proxy this through your backend for security)
      // For now, let's use a simple notification
      console.log("✅ Order placed! Email notification would be sent here.");
      
      // TODO: Implement proper email sending through a secure backend endpoint
      // This is just a placeholder - DO NOT expose your Brevo API key in frontend code!
      
    } catch (error) {
      console.error("❌ Error preparing email:", error);
    }
  };

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
      let receiptUrl: string | null = null;

      // Upload file if provided
      if (receiptFile) {
        receiptUrl = await uploadReceipt(receiptFile);
      }

      const shipping_address = {
        address: customerData.address,
        city: customerData.city,
        postalCode: customerData.postalCode,
      };

      // Step 1: Create order record
      const { data: newOrder, error: orderError } = await supabase
        .from("orders")
        .insert([
          {
            user_id: user?.id || null,
            session_id: user ? null : getSessionId(),
            total_amount: totalAmount,
            status: "pending",
            payment_method: paymentMethod,
            payment_receipt: receiptUrl || null,
            customer_name: customerData.name,
            customer_email: customerData.email,
            customer_phone: customerData.phone,
            shipping_address,
          },
        ])
        .select("id")
        .single();

      if (orderError) throw orderError;

      // Step 2: Insert order items
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

        // Step 3: Send invoice email 📧
        await sendInvoiceEmail(newOrder.id);
      }

      // Step 4: Clear cart + success toast
      await clearCart();

      toast({
        title: "Order placed successfully 🎉",
        description: `Your order (total Rs.${totalAmount.toFixed(
          2
        )}) has been placed. Check your email for the invoice!`,
      });

      // Reset all fields
      onOpenChange(false);
      setCustomerData({
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        postalCode: "",
      });
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

  // 🖼 Handle file input + preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setReceiptFile(file);
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setReceiptPreview(previewUrl);
    }
  };

  const requiresReceipt =
    paymentMethod === "easypaisa" ||
    paymentMethod === "jazzcash" ||
    paymentMethod === "bank_transfer";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Checkout</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 🧾 Order Summary */}
          <div className="space-y-4">
            <h3 className="font-semibold">Order Summary</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center text-sm"
                >
                  <span>
                    {item.product.name} × {item.quantity}
                  </span>
                  <span>Rs{(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-2 font-semibold">
              Total: Rs{totalAmount.toFixed(2)}
            </div>
          </div>

          {/* 👤 Customer Info */}
          <div className="space-y-4">
            <h3 className="font-semibold">Customer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={customerData.name}
                  onChange={(e) =>
                    setCustomerData((p) => ({ ...p, name: e.target.value }))
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={customerData.email}
                  onChange={(e) =>
                    setCustomerData((p) => ({ ...p, email: e.target.value }))
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={customerData.phone}
                  onChange={(e) =>
                    setCustomerData((p) => ({ ...p, phone: e.target.value }))
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={customerData.city}
                  onChange={(e) =>
                    setCustomerData((p) => ({ ...p, city: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  value={customerData.address}
                  onChange={(e) =>
                    setCustomerData((p) => ({ ...p, address: e.target.value }))
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  value={customerData.postalCode}
                  onChange={(e) =>
                    setCustomerData((p) => ({
                      ...p,
                      postalCode: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          </div>

          {/* 💳 Payment Section */}
          <div className="space-y-4">
            <h3 className="font-semibold">Payment Method</h3>
            <Select
              value={paymentMethod}
              onValueChange={setPaymentMethod}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easypaisa">EasyPaisa</SelectItem>
                <SelectItem value="jazzcash">JazzCash</SelectItem>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                <SelectItem value="cash_on_delivery">
                  Cash on Delivery
                </SelectItem>
              </SelectContent>
            </Select>

            {requiresReceipt && (
              <div className="p-4 bg-muted rounded-lg space-y-3">
                <Label htmlFor="receipt">Upload Payment Screenshot</Label>
                <Input
                  id="receipt"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {receiptPreview && (
                  <img
                    src={receiptPreview}
                    alt="Receipt Preview"
                    className="mt-2 w-40 h-40 object-contain rounded-lg border"
                  />
                )}
              </div>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={loading} size="lg">
            {loading
              ? "Placing Order..."
              : `Place Order - Rs.${totalAmount.toFixed(2)}`}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutDialog;