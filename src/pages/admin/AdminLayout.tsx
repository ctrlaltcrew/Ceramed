import { useEffect, useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const AdminLayout = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !session) {
          navigate("/admin/login");
          return;
        }

        const user = session.user;
        const { data, error } = await supabase
          .from("admins")
          .select("email")
          .eq("email", user.email)
          .maybeSingle();

        if (error || !data) {
          navigate("/admin/login");
          return;
        }

        setIsAdmin(true);
      } catch {
        navigate("/admin/login");
      } finally {
        setLoading(false);
      }
    };

    checkAdminAccess();
  }, [navigate]);

  if (loading) return <div className="p-8 text-center">🔍 Checking admin access...</div>;
  if (!isAdmin) return null;

  return (
    <div>
      {/* 🔹 Header */}
      <header className="p-4 border-b shadow-sm bg-gray-50 flex justify-between items-center">
        <h1 className="text-lg font-semibold text-gray-800">
          🧭 Admin Dashboard
        </h1>

        {/* 🔹 Navigation */}
        <nav className="flex gap-5 text-sm">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              isActive
                ? "font-bold text-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }
          >
            Notifications
          </NavLink>

          <NavLink
            to="/admin/orders"
            className={({ isActive }) =>
              isActive
                ? "font-bold text-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }
          >
            Orders
          </NavLink>

          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              isActive
                ? "font-bold text-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }
          >
            Products
          </NavLink>

          <NavLink
            to="/admin/blogs"
            className={({ isActive }) =>
              isActive
                ? "font-bold text-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }
          >
            Blogs
          </NavLink>
        </nav>

        {/* 🔹 Logout */}
        <button
          onClick={() =>
            supabase.auth.signOut().then(() => navigate("/admin/login"))
          }
          className="text-sm text-red-600 hover:underline"
        >
          Logout
        </button>
      </header>

      {/* 🔹 Outlet */}
      <main className="p-6 bg-gray-50 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
