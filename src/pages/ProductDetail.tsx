import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { Star, ShoppingCart, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  category: string;
  benefits: string[];
  rating: number;
  reviews_count: number;
  stock_quantity: number;
}

const localImages = ["/Active-P.png", "/zest.png", "/Mossent.png"];

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    if (id) fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      if (!data) return setProduct(null);

      let image = data.image_url;
      if (!image || image.trim() === "") {
        image = localImages[Math.floor(Math.random() * localImages.length)];
      } else if (!image.startsWith("http")) {
        const { data: publicUrlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(data.image_url);
        image = publicUrlData?.publicUrl || localImages[0];
      }

      setProduct({ ...data, image_url: image });
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    await addToCart(product.id);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-white/60 backdrop-blur-md z-[9999]">
        <p className="text-gray-700 text-lg font-medium">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-white/60 backdrop-blur-md z-[9999]">
        <div className="bg-background p-10 rounded-2xl text-center shadow-xl">
          <p className="text-lg text-muted-foreground mb-4">
            Product not found
          </p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      {/* Overlay */}
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          transition: { duration: 0.4, ease: "easeOut" },
        }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-white/60 backdrop-blur-md flex justify-center items-center z-[9999]"
      >
        {/* Close Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 right-6 text-gray-700 hover:text-gray-900 transition-colors"
        >
          <X size={28} />
        </button>

        {/* Product Card */}
        <motion.div
          key="modal"
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.3 }}
          className="max-w-5xl w-[95%] bg-white rounded-2xl shadow-2xl overflow-hidden grid md:grid-cols-2 gap-8 p-8 relative"
        >
          {/* Product Image */}
          <div className="flex items-center justify-center bg-gray-50 rounded-xl p-6">
            <img
              src={product.image_url || localImages[0]}
              alt={product.name}
              className="max-h-96 w-auto object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = localImages[0];
              }}
            />
          </div>

          {/* Details Section */}
          <div className="flex flex-col justify-between">
            <div>
              <Badge className="mb-4 bg-secondary text-secondary-foreground">
                {product.category}
              </Badge>
              <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {product.description}
              </p>

              {/* Benefits */}
              {product.benefits?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {product.benefits.map((b, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {b}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Rating */}
              <div className="flex items-center gap-2 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="text-sm text-muted-foreground">
                  {product.rating} ({product.reviews_count} reviews)
                </span>
              </div>
            </div>

            {/* Price & Add to Cart */}
            <div className="flex items-center justify-between pt-6 border-t border-border">
              <div className="text-3xl font-bold text-[#0b8686]">
                ₨
                {product.price.toLocaleString("en-PK", {
                  minimumFractionDigits: 2,
                })}
              </div>
              <Button
                className="bg-[#0b8686] hover:bg-[#097575] text-white"
                onClick={handleAddToCart}
                disabled={product.stock_quantity === 0}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {product.stock_quantity === 0 ? "Out of Stock" : "Add to Cart"}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* ✅ Add-to-Cart Toast (Bottom Right, White Background) */}
        {added && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 right-6 bg-white text-gray-800 px-6 py-3 rounded-lg shadow-lg border border-gray-200 z-[10000]"
          >
            ✅ Product added to cart!
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default ProductDetail;
