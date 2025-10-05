import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ShoppingCart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  category: string;
}

const fallbackImages = [
  "/Active-P.png",
  "/zest.png",
  "/Mossent.png",
  "/default-product.png",
  "/herbal-supplement.png",
];

const HomeProductsPreview = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    fetchProducts();
    updateCartCount();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, price, image_url, category")
        .limit(5);

      if (error) throw error;

      const processed =
        data?.map((p, i) => ({
          ...p,
          image_url:
            p.image_url && p.image_url !== ""
              ? p.image_url
              : fallbackImages[i % fallbackImages.length],
        })) || [];

      setProducts(processed);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleAddToCart = (product: Product) => {
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    existingCart.push(product);
    localStorage.setItem("cart", JSON.stringify(existingCart));
    setCartCount(existingCart.length);

    // Mini animation
    const cartIcon = document.getElementById("cart-icon");
    if (cartIcon) {
      cartIcon.classList.add("animate-bounce");
      setTimeout(() => cartIcon.classList.remove("animate-bounce"), 500);
    }
  };

  const updateCartCount = () => {
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartCount(existingCart.length);
  };

  return (
    <>
      {/* Floating Cart Icon */}
      <div className="fixed bottom-6 right-6 z-50">
        <div
          id="cart-icon"
          className="relative bg-secondary text-white p-4 rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform"
          onClick={() => window.location.href = "/cart"}
        >
          <ShoppingCart size={24} />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {cartCount}
            </span>
          )}
        </div>
      </div>

      {/* Featured Products */}
      <section
        id="featured-products"
        className="py-12 bg-gradient-to-b from-white to-accent/10 overflow-hidden"
      >
        <div className="container mx-auto px-6">
          {/* Heading */}
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3">
              Featured <span className="text-secondary">Products</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
              Explore our latest science-backed innovations — crafted to enhance wellness and performance.
            </p>
          </div>

          {/* Auto Scroll */}
          <div className="relative overflow-hidden">
            <div className="flex gap-6 animate-scroll scrollbar-hide">
              {[...products, ...products].map((product, index) => (
                <div
                  key={index}
                  className="min-w-[200px] sm:min-w-[220px] bg-white shadow-lg rounded-2xl overflow-hidden flex flex-col p-4 flex-shrink-0 hover:shadow-2xl hover:scale-105 transition-transform duration-300 cursor-pointer"
                >
                  {/* Image Section */}
                  <div className="relative mb-4 overflow-hidden rounded-2xl flex-shrink-0 h-40 flex items-center justify-center bg-gray-50">
                    <img
                      src={product.image_url || fallbackImages[index % fallbackImages.length]}
                      alt={product.name}
                      className="max-h-full w-auto object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          fallbackImages[index % fallbackImages.length];
                      }}
                    />
                    <Badge className="absolute top-2 left-2 bg-secondary text-white text-xs">
                      {product.category || "Health"}
                    </Badge>
                  </div>

                  {/* Product Info */}
                  <div className="flex flex-col flex-grow">
                    <h3 className="text-md sm:text-lg font-semibold text-gray-800 truncate mb-1">
                      {product.name}
                    </h3>
                    <p className="text-primary font-bold text-sm sm:text-base mt-auto">
                      ${product.price?.toFixed(2) || "0.00"}
                    </p>
                    <Button
                      className="mt-2 bg-secondary w-full text-white px-4 py-2 text-sm"
                      onClick={() => handleAddToCart(product)}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* View More Button */}
          <div className="text-center mt-10">
            <Link to="/products">
              <Button className="group bg-secondary hover:bg-secondary/90 text-white px-6 py-3">
                View More Products
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Scroll Animation CSS */}
      <style>
        {`
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-scroll {
            display: flex;
            animation: scroll 20s linear infinite;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .animate-bounce {
            animation: bounce 0.5s ease-in-out;
          }
          @keyframes bounce {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.2); }
          }
        `}
      </style>
    </>
  );
};

export default HomeProductsPreview;
