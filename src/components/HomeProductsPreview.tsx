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

  return (
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

        {/* Products Grid / Carousel */}
        <div className="relative">
          {/* For desktop: continuous scroll, for mobile: horizontal scroll */}
          <div className="flex gap-6 overflow-x-auto scrollbar-hide py-4">
            {products.length === 0 ? (
              <p className="text-center text-gray-500">Loading products...</p>
            ) : (
              products.map((product, index) => (
                <div
                  key={product.id}
                  className="min-w-[220px] sm:min-w-[250px] bg-white shadow-lg rounded-2xl p-4 flex-shrink-0 hover:shadow-xl transition-shadow duration-300"
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
              ))
            )}
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
  );
};

export default HomeProductsPreview;
