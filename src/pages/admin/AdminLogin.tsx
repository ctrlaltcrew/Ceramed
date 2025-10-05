import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const adminUser = import.meta.env.VITE_ADMIN_USERNAME?.trim();
    const adminPass = import.meta.env.VITE_ADMIN_PASSWORD?.trim();

    if (!adminUser || !adminPass) {
      setError("Admin credentials not configured.");
      setLoading(false);
      return;
    }

    if (username === adminUser && password === adminPass) {
      localStorage.setItem("isAdmin", "true");
      navigate("/admin");
    } else {
      setError("Invalid username or password.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm border border-gray-200"
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-primary">
          Admin Login
        </h1>

        {error && (
          <p className="text-red-500 bg-red-50 border border-red-200 p-2 mb-4 rounded text-sm text-center">
            {error}
          </p>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              placeholder="Enter admin username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary/90 transition-all font-medium"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminLogin;
