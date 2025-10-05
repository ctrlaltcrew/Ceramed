import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const AdminLayout = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const adminStatus = localStorage.getItem("isAdmin");

    if (adminStatus === "true") {
      setIsAdmin(true);
    } else {
      navigate("/admin/login");
    }

    setLoading(false);
  }, [navigate]);

  if (loading) return <div className="p-10 text-center">Loading admin panel...</div>;

  if (!isAdmin)
    return (
      <div className="p-10 text-center text-red-600">
        Access denied. Please log in.
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white shadow-sm p-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-primary">Admin Panel</h1>
        <button
          onClick={() => {
            localStorage.removeItem("isAdmin");
            navigate("/admin/login");
          }}
          className="text-sm bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </header>

      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
