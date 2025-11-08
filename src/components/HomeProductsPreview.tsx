import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

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
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, price, image_url, category")
        .limit(10); // get more for carousel

      if (error) throw error;

      const processed =
        data?.map((p, i) => {
          let image = p.image_url;

          if (!image || image.trim() === "") {
            image = fallbackImages[i % fallbackImages.length];
          } else if (!image.startsWith("http")) {
            const { data: publicUrlData } = supabase.storage
              .from("product-images")
              .getPublicUrl(p.image_url);
            image =
              publicUrlData?.publicUrl ||
              fallbackImages[i % fallbackImages.length];
          }

          return { ...p, image_url: image };
        }) || [];

      setProducts(processed);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleProductClick = (product: Product) => {
    navigate(`/products/${product.id}`);
  };

  const handleAddToCart = async (product: Product) => {
    try {
      await addToCart(product.id);
    } catch (err) {
      console.error("Add to cart failed:", err);
    }
  };

  return (
    <section className="py-12 bg-gradient-to-b from-white to-accent/10 overflow-hidden font-sans">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 font-parka">
            Featured <span className="text-[#0b8686] font-bold">Products</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-base font-parka">
            Explore our latest science-backed innovations — crafted to enhance wellness and performance.
          </p>
        </div>

        {/* Swiper Carousel */}
        <Swiper
          modules={[Navigation]}
          spaceBetween={20}
          slidesPerView={1}
          navigation
          breakpoints={{
            640: { slidesPerView: 1.5 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
        >
          {products.map((product, index) => (
            <SwiperSlide key={product.id}>
              <div className="bg-white shadow-md rounded-2xl overflow-hidden flex flex-col p-4 hover:shadow-xl transition-shadow duration-300 font-parka">
                <div
                  className="relative mb-3 overflow-hidden rounded-xl h-40 flex items-center justify-center bg-gray-50 cursor-pointer"
                  onClick={() => handleProductClick(product)}
                >
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="max-h-full w-auto object-contain transition-transform duration-300 hover:scale-105"
                  />
                  <Badge className="absolute top-2 left-2 bg-[#FFB84D] text-white text-[10px] font-medium rounded-full px-2 py-[2px] shadow-sm">
                    {product.category || "Health"}
                  </Badge>
                </div>

                <div className="flex flex-col flex-grow text-center">
                  <h3 className="text-md font-semibold text-gray-800 truncate mb-1">
                    {product.name}
                  </h3>
                  <p className="text-[#0b8686] font-bold text-base mb-2">
                    Rs{product.price?.toFixed(2) || "0.00"}
                  </p>
                  <Button
                    className="bg-[#0b8686] hover:bg-[#097575] w-full text-white font-semibold transition-all"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* View More Button */}
        <div className="text-center mt-10 font-semibold">
          <Link to="/products">
            <Button className="group bg-[#0b8686] hover:bg-[#097575] text-white px-6 py-3 font-semibold">
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
