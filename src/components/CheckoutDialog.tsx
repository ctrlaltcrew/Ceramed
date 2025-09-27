import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, Phone, Banknote } from 'lucide-react';

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
  totalAmount 
}) => {
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
  });

  const { user } = useAuth();
  const { clearCart } = useCart();
  const { toast } = useToast();

  const getSessionId = () => {
    return localStorage.getItem('cart_session_id') || crypto.randomUUID();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentMethod) {
      toast({
        title: 'Payment method required',
        description: 'Please select a payment method.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        user_id: user?.id || null,
        session_id: user ? null : getSessionId(),
        total_amount: totalAmount,
        status: 'pending',
        payment_method: paymentMethod,
        customer_name: customerData.name,
        customer_email: customerData.email,
        customer_phone: customerData.phone,
        shipping_address: {
          address: customerData.address,
          city: customerData.city,
          postalCode: customerData.postalCode,
        },
        order_items: cartItems.map(item => ({
          product_id: item.product_id,
          product_name: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          total: item.quantity * item.product.price,
        })),
      };

      const { error } = await supabase
        .from('orders')
        .insert(orderData);

      if (error) throw error;

      await clearCart();
      
      toast({
        title: 'Order placed successfully!',
        description: `Your order has been placed. Total: $${totalAmount.toFixed(2)}`,
      });

      onOpenChange(false);
      
      // Reset form
      setCustomerData({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
      });
      setPaymentMethod('');

    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        title: 'Error',
        description: 'Failed to place order. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Checkout</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Order Summary */}
          <div className="space-y-4">
            <h3 className="font-semibold">Order Summary</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <span>{item.product.name} × {item.quantity}</span>
                  <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-2 font-semibold">
              Total: ${totalAmount.toFixed(2)}
            </div>
          </div>

          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="font-semibold">Customer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={customerData.name}
                  onChange={(e) => setCustomerData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={customerData.email}
                  onChange={(e) => setCustomerData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={customerData.phone}
                  onChange={(e) => setCustomerData(prev => ({ ...prev, phone: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={customerData.city}
                  onChange={(e) => setCustomerData(prev => ({ ...prev, city: e.target.value }))}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  value={customerData.address}
                  onChange={(e) => setCustomerData(prev => ({ ...prev, address: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  value={customerData.postalCode}
                  onChange={(e) => setCustomerData(prev => ({ ...prev, postalCode: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-4">
            <h3 className="font-semibold">Payment Method</h3>
            <Select value={paymentMethod} onValueChange={setPaymentMethod} required>
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easypaisa">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    EasyPaisa
                  </div>
                </SelectItem>
                <SelectItem value="jazzcash">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    JazzCash
                  </div>
                </SelectItem>
                <SelectItem value="bank_transfer">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Bank Transfer
                  </div>
                </SelectItem>
                <SelectItem value="cash_on_delivery">
                  <div className="flex items-center gap-2">
                    <Banknote className="h-4 w-4" />
                    Cash on Delivery
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            {paymentMethod === 'easypaisa' && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm">
                  <strong>EasyPaisa Payment Instructions:</strong><br />
                  1. Send payment to: 03409052244<br />
                  2. Include your order reference in the transaction<br />
                  3. We'll confirm your order once payment is received
                </p>
              </div>
            )}

            {paymentMethod === 'jazzcash' && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm">
                  <strong>JazzCash Payment Instructions:</strong><br />
                  1. Send payment to: 03409052244<br />
                  2. Include your order reference in the transaction<br />
                  3. We'll confirm your order once payment is received
                </p>
              </div>
            )}

            {paymentMethod === 'bank_transfer' && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm">
                  <strong>Bank Transfer Details:</strong><br />
                  Account Title: CERA MEDICAL<br />
                  Account Number: [To be provided]<br />
                  Bank: [To be specified]<br />
                  Please include your order reference in the transfer description.
                </p>
              </div>
            )}

            {paymentMethod === 'cash_on_delivery' && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm">
                  <strong>Cash on Delivery:</strong><br />
                  Pay when your order is delivered to your doorstep.<br />
                  Additional delivery charges may apply.
                </p>
              </div>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={loading} size="lg">
            {loading ? 'Placing Order...' : `Place Order - $${totalAmount.toFixed(2)}`}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutDialog;