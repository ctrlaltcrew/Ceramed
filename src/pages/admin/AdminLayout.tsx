import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const AdminLayout = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const isAdminStored = localStorage.getItem("isAdmin");
    if (isAdminStored === "true") {
      setIsAdmin(true);
    } else {
      navigate("/admin");
    }
  }, [navigate]);

  if (!isAdmin) return null; // Avoid flicker before redirect

  return (
    <div className="p-4">
      <Outlet />
    </div>
  );
};

export default AdminLayout;
