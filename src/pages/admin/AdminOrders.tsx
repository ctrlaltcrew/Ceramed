import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

interface OrderItem {
  id: string;
  product_name: string;
  quantity: number;
  price: number;
  total: number;
}

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  total_amount: number;
  payment_method?: string;
  payment_receipt?: string;
  status: string;
  created_at: string;
  items?: OrderItem[];
}

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updating, setUpdating] = useState(false);

  // Fetch pending orders
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  // Fetch order items
  const fetchOrderDetails = async (orderId: string) => {
    try {
      const { data: items, error } = await supabase
        .from("order_items")
        .select("*")
        .eq("order_id", orderId);

      if (error) throw error;
      return items || [];
    } catch (err) {
      console.error("Error fetching order items:", err);
      return [];
    }
  };

  // Update order status
  const handleUpdateStatus = async (orderId: string, status: string) => {
    setUpdating(true);

    try {
      const { data, error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", orderId)
        .select();

      if (error) throw error;

      // Remove order from list if verified or cancelled
      if (status === "verified" || status === "cancelled") {
        setOrders(prev => prev.filter(o => o.id !== orderId));
      } else {
        fetchOrders();
      }

      // Send invoice email securely via backend (not frontend)
      if (status === "verified" && data?.[0]) {
        const order = data[0];
        const items = await fetchOrderDetails(order.id);
        try {
          const response = await fetch("/api/send-invoice", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              to: order.customer_email,
              subject: `Invoice for Order #${order.id}`,
              html: `
                <h3>Hello ${order.customer_name}</h3>
                <p>Thank you for your order.</p>
                <p><strong>Total:</strong> ₨${order.total_amount}</p>
                <p><strong>Items:</strong></p>
                ${items.map(i => `<p>${i.product_name} (${i.quantity} × ₨${i.price})</p>`).join("")}
              `,
            }),
          });

          if (!response.ok) console.warn("Email send failed");
        } catch (err) {
          console.error("Error sending invoice:", err);
        }
      }

      if (selectedOrder?.id === orderId) setSelectedOrder(null);
    } catch (err) {
      console.error("Error updating order:", err);
      alert("❌ Failed to update order");
    } finally {
      setUpdating(false);
    }
  };

  const handleViewOrder = async (order: Order) => {
    const items = await fetchOrderDetails(order.id);
    setSelectedOrder({ ...order, items });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">🧾 Orders Management</h1>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map(order => (
            <Card key={order.id} className="shadow-sm border">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{order.customer_name}</span>
                  <Badge
                    className={
                      order.status === "verified"
                        ? "bg-green-500"
                        : order.status === "cancelled"
                        ? "bg-red-500"
                        : "bg-yellow-500"
                    }
                  >
                    {order.status}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>💰 <strong>Total:</strong> ₨{order.total_amount}</p>
                <p>📧 <strong>Email:</strong> {order.customer_email}</p>
                <p>📅 {new Date(order.created_at).toLocaleString()}</p>
                <div className="mt-3 flex justify-between">
                  <Button size="sm" onClick={() => handleViewOrder(order)}>View</Button>
                  <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(order.id, "cancelled")} disabled={updating}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal for order details */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-3">
              <p><strong>Name:</strong> {selectedOrder.customer_name}</p>
              <p><strong>Email:</strong> {selectedOrder.customer_email}</p>
              <p><strong>Phone:</strong> {selectedOrder.customer_phone}</p>
              <p><strong>Total:</strong> ₨{selectedOrder.total_amount}</p>
              <p><strong>Payment Method:</strong> {selectedOrder.payment_method}</p>

              {selectedOrder.payment_receipt && (
                <div>
                  <p><strong>Receipt:</strong></p>
                  <img src={selectedOrder.payment_receipt} alt="Receipt" className="rounded-lg border max-h-80 object-contain" />
                </div>
              )}

              <h3 className="font-semibold mt-4">🛍️ Items:</h3>
              {selectedOrder.items?.map(item => (
                <div key={item.id} className="border p-2 rounded-md text-sm flex justify-between">
                  <span>{item.product_name}</span>
                  <span>{item.quantity} × ₨{item.price} = ₨{item.total}</span>
                </div>
              ))}

              <div className="flex justify-end gap-3 mt-4">
                <Button onClick={() => handleUpdateStatus(selectedOrder.id, "verified")} disabled={updating}>
                  {updating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating</> : "Verify Order"}
                </Button>
                <Button variant="outline" onClick={() => handleUpdateStatus(selectedOrder.id, "cancelled")} disabled={updating}>Cancel</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOrders;
