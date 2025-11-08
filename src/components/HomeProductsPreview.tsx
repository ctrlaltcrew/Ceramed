import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import ProductDetail, { Product } from "../pages/ProductDetail"; // ✅ correct import

const fallbackImages = [
  "/Active-P.png",
  "/zest.png",
  "/Mossent.png",
  "/default-product.png",
  "/herbal-supplement.png",
];

const HomeProductsPreview = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase.from("products").select("*").limit(10);
      if (error) throw error;

      const processed =
        data?.map((p, i) => {
          let image = p.image_url;
          if (!image || image.trim() === "") image = fallbackImages[i % fallbackImages.length];
          else if (!image.startsWith("http")) {
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

  return (
    <>
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

          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            slidesPerView={3}
            spaceBetween={20}
            loop
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            navigation
            pagination={{ clickable: true }}
            breakpoints={{ 640: { slidesPerView: 1 }, 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
          >
            {products.map((product) => (
              <SwiperSlide key={product.id}>
                <div
                  className="bg-white shadow-lg rounded-2xl overflow-hidden p-4 flex flex-col items-center cursor-pointer hover:scale-105 transition-transform duration-300"
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className="relative mb-3 h-56 w-full flex items-center justify-center bg-gray-50 rounded-xl">
                    <img src={product.image_url} alt={product.name} className="max-h-full w-auto object-contain" />
                    <Badge className="absolute top-2 left-2 bg-[#FFB84D] text-white text-[10px] px-2 py-[2px] shadow-sm">
                      {product.category || "Health"}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 truncate mb-1 text-center">{product.name}</h3>
                  <p className="text-[#0b8686] font-bold text-base mb-2">Rs{product.price?.toFixed(2)}</p>
                  <Button
                    className="bg-[#0b8686] hover:bg-[#097575] w-full text-white font-semibold transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product.id);
                    }}
                  >
                    Add to Cart
                  </Button>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* Product Modal */}
      {selectedProduct && <ProductDetail product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    </>
  );
};

export default HomeProductsPreview;
