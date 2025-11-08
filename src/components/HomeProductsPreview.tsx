import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { motion } from "framer-motion";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

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
        .limit(10);

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
            image = publicUrlData?.publicUrl || fallbackImages[i % fallbackImages.length];
          }
          return { ...p, image_url: image };
        }) || [];

      setProducts(processed);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleProductClick = (product: Product) => navigate(`/products/${product.id}`);
  const handleAddToCart = async (product: Product) => await addToCart(product.id);

  return (
    <section className="py-12 bg-gradient-to-b from-white to-accent/10 font-sans">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 font-parka">
            Featured <span className="text-[#0b8686]">Products</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-base font-parka">
            Explore our latest science-backed innovations — crafted to enhance wellness and performance.
          </p>
        </div>

        {products.length > 0 && (
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={3}
            centeredSlides={true}
            loop={true}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            pagination={{ clickable: true, dynamicBullets: true }}
            navigation
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
          >
            {products.map((product) => (
              <SwiperSlide key={product.id}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="relative flex flex-col items-center cursor-pointer"
                >
                  {/* Card */}
                  <div
                    className="bg-white shadow-lg rounded-3xl overflow-hidden p-4 flex flex-col items-center transition-transform duration-300"
                    onClick={() => handleProductClick(product)}
                  >
                    {/* Product Image */}
                    <div className="relative mb-3 h-64 w-full flex items-center justify-center bg-gray-50 rounded-2xl overflow-hidden">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="max-h-full w-auto object-contain"
                      />
                      <Badge className="absolute top-3 left-3 bg-[#FFB84D] text-white text-xs px-2 py-[2px] shadow-sm">
                        {product.category || "Health"}
                      </Badge>

                      {/* Overlay Buttons */}
                      <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 flex flex-col items-center justify-center gap-2 transition-opacity rounded-2xl">
                        <Button
                          className="bg-[#0b8686] hover:bg-[#097575] text-white px-4 py-2 text-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(product);
                          }}
                        >
                          Add to Cart
                        </Button>
                        <Button
                          className="bg-white text-[#0b8686] hover:bg-gray-100 px-4 py-2 text-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleProductClick(product);
                          }}
                        >
                          Quick View
                        </Button>
                      </div>
                    </div>

                    {/* Product Info */}
                    <h3 className="text-lg font-semibold text-gray-800 truncate mb-1 text-center">
                      {product.name}
                    </h3>
                    <p className="text-[#0b8686] font-bold text-base">
                      Rs{product.price?.toFixed(2)}
                    </p>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  );
};

export default HomeProductsPreview;
