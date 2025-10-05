import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
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

  useEffect(() => {
    fetchProducts();
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

  const handleProductClick = (product: Product) => {
    const quickBuySection = document.getElementById("quick-buy");
    if (quickBuySection) {
      quickBuySection.scrollIntoView({ behavior: "smooth" });
      // You can also set state here to show product info in quick-buy
      setSelectedProduct(product);
    }
  };

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <>
      <section
        id="featured-products"
        className="py-16 bg-gradient-to-b from-white to-accent/10 overflow-hidden"
      >
        <div className="container mx-auto px-6">
          {/* Heading */}
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3">
              Featured <span className="text-secondary">Products</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
              Explore our latest science-backed innovations — crafted to enhance wellness and performance.
            </p>
          </div>

          {/* Continuous Auto-Scrolling Products */}
          <div className="relative overflow-hidden">
            <div className="flex gap-6 animate-scroll">
              {[...products, ...products].map((product, index) => (
                <div
                  key={index}
                  className="min-w-[220px] sm:min-w-[250px] bg-white shadow-lg rounded-2xl p-4 flex-shrink-0 hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                  onClick={() => handleProductClick(product)}
                >
                  <div className="relative mb-3 overflow-hidden rounded-xl">
                    <img
                      src={product.image_url || fallbackImages[index % fallbackImages.length]}
                      alt={product.name}
                      className="w-full h-40 sm:h-44 object-cover hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          fallbackImages[index % fallbackImages.length];
                      }}
                    />
                    <Badge className="absolute top-2 left-2 bg-secondary text-white text-xs">
                      {product.category || "Health"}
                    </Badge>
                  </div>
                  <h3 className="text-md sm:text-lg font-semibold text-gray-800 truncate">
                    {product.name}
                  </h3>
                  <p className="text-primary font-bold mt-1 text-sm sm:text-base">
                    ${product.price?.toFixed(2) || "0.00"}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* View More Button */}
          <div className="text-center mt-10">
            <Link
              to="/products"
              onClick={() => {
                const target = document.getElementById("products");
                if (target) target.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <Button className="group bg-secondary hover:bg-secondary/90 text-white px-6 py-3">
                View More Products
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Buy Section */}
      <section id="quick-buy" className="py-16 bg-white">
        <div className="container mx-auto px-6">
          {selectedProduct ? (
            <div className="max-w-3xl mx-auto bg-gray-50 p-6 rounded-2xl shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Quick Buy: {selectedProduct.name}</h2>
              <img
                src={selectedProduct.image_url || fallbackImages[0]}
                alt={selectedProduct.name}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
              <p className="text-lg font-semibold text-primary">
                Price: ${selectedProduct.price?.toFixed(2) || "0.00"}
              </p>
              <Button className="mt-4 bg-secondary text-white px-6 py-3">
                Buy Now
              </Button>
            </div>
          ) : (
            <p className="text-center text-gray-500">Click on a product above to quick buy.</p>
          )}
        </div>
      </section>

      {/* CSS for continuous scroll animation */}
      <style>
        {`
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-scroll {
            display: flex;
            animation: scroll 30s linear infinite;
          }
        `}
      </style>
    </>
  );
};

export default HomeProductsPreview;
