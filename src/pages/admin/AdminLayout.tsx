import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client"; // ✅ correct import

const AdminLayout = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        // ✅ Always get latest session
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !session) {
          console.warn("❌ No active session found");
          navigate("/");
          return;
        }

        const user = session.user;
        console.log("✅ Logged in as:", user.email);

        // ✅ Verify admin record
        const { data, error } = await supabase
          .from("admins")
          .select("email")
          .eq("email", user.email)
          .maybeSingle();

        if (error) {
          console.error("❌ Admin check error:", error.message);
          navigate("/");
          return;
        }

        if (!data) {
          console.warn("⛔ Not an admin, redirecting...");
          navigate("/");
          return;
        }

        console.log("✅ Admin verified:", user.email);
        setIsAdmin(true);
      } catch (err) {
        console.error("❌ Unexpected error:", err);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    checkAdminAccess();
  }, [navigate]);

  if (loading)
    return <div className="p-8 text-center">🔍 Checking admin access...</div>;

  if (!isAdmin) return null;

  return (
    <div>
      <header className="p-4 border-b shadow-sm bg-gray-50">
        <h1 className="text-lg font-semibold">Admin Dashboard</h1>
      </header>
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
