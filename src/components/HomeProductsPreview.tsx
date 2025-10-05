import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Link, useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

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
    navigate(`/products/${product.id}`); // Redirect to product detail page
  };

  return (
    <>
      {/* Featured Products */}
      <section
        id="featured-products"
        className="py-12 bg-gradient-to-b from-white to-accent/10 overflow-hidden"
      >
        <div className="container mx-auto px-4">
          {/* Heading */}
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
              Featured <span className="text-secondary">Products</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
              Explore our latest science-backed innovations — crafted to enhance wellness and performance.
            </p>
          </div>

          {/* Auto Scroll */}
          <div className="relative overflow-hidden">
            <div className="flex gap-4 animate-scroll scrollbar-hide">
              {[...products, ...products].map((product, index) => (
                <div
                  key={index}
                  className="min-w-[200px] sm:min-w-[220px] bg-white shadow-md rounded-xl overflow-hidden flex flex-col p-3 flex-shrink-0 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                  onClick={() => handleProductClick(product)}
                >
                  {/* Image Section */}
                  <div className="relative mb-3 overflow-hidden rounded-lg h-40 flex items-center justify-center bg-gray-50">
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
                    <h3 className="text-sm sm:text-md font-semibold text-gray-800 truncate mb-1">
                      {product.name}
                    </h3>
                    <p className="text-primary font-bold text-sm sm:text-base mt-auto">
                      ${product.price?.toFixed(2) || "0.00"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* View More Button */}
          <div className="text-center mt-8">
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
        `}
      </style>
    </>
  );
};

export default HomeProductsPreview;
