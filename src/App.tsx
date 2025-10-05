import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";

// ---------------- PUBLIC PAGES ----------------
import Index from "./pages/Index";
import AboutPage from "./pages/About";
import ServicesPage from "./pages/Services";
import ProductsPage from "./pages/Products";
import TeamPage from "./pages/Team";
import BlogPage from "./pages/Blog";
import ContactPage from "./pages/Contact";
import NotFound from "./pages/NotFound";

// ---------------- ADMIN PAGES ----------------
import AdminLayout from "./pages/admin/AdminLayout";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminBlogs from "./pages/admin/AdminBlogs";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />

            <BrowserRouter>
              <Routes>
                {/* ---------------- PUBLIC ROUTES ---------------- */}
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/team" element={<TeamPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/contact" element={<ContactPage />} />

                {/* ---------------- ADMIN ROUTES ---------------- */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="blogs" element={<AdminBlogs />} />
                </Route>

                {/* ---------------- 404 PAGE ---------------- */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
