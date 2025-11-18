import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const AdminDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🟢 Fetch initial data
  const fetchRequests = async () => {
    const { data, error } = await supabase
      .from("research_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) console.error("Error fetching requests:", error);
    else setRequests(data || []);
    setLoading(false);
  };

  // 🟢 Realtime listener for new requests
  useEffect(() => {
    fetchRequests();

    const channel = supabase
      .channel("research_requests_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "research_requests" },
        (payload) => {
          console.log("🔔 Change detected:", payload);
          fetchRequests(); // refresh on insert/update/delete
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-gray-600">
        <Loader2 className="animate-spin mr-2" /> Loading requests...
      </div>
    );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold mb-4">📬 Service Requests</h1>

      {requests.length === 0 ? (
        <p className="text-gray-500">No service requests yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {requests.map((req) => (
            <Card key={req.id} className="hover:shadow-md transition-all">
              <CardHeader>
                <CardTitle className="text-lg">
                  {req.full_name || "Unknown User"}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>
                  <strong>Email:</strong> {req.email || "N/A"}
                </p>
                <p>
                  <strong>Service Type:</strong> {req.service_type || "N/A"}
                </p>
                <p>
                  <strong>Message:</strong> {req.message || "—"}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(req.created_at).toLocaleString()}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 w-full"
                  onClick={() => alert(`Request ID: ${req.id}`)}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
