import React, { useEffect, useState, useRef } from "react";
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

interface ProductDetailProps {
  modal?: boolean;
  product?: Product;
  productId?: string;
}

const localImages = ["/Active-P.png", "/zest.png", "/Mossent.png"];

const ProductDetail: React.FC<ProductDetailProps> = ({
  modal = true,
  product: initialProduct,
  productId,
}) => {
  const { id: routeId } = useParams<{ id: string }>();
  const id = productId || routeId;
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(initialProduct || null);
  const [loading, setLoading] = useState(!initialProduct && !!id);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!product && id) fetchProduct();
    else setLoading(false);
  }, [id, product]);

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
      setProduct(null);
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

  const handleClose = () => navigate(-1);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      handleClose();
    }
  };

  if (loading) {
    return modal ? (
      <div className="fixed inset-0 flex justify-center items-center z-[9999]">
        <div className="absolute inset-0 bg-black/20 backdrop-blur-md" />
        <p className="relative text-gray-700 text-lg font-medium">Loading product...</p>
      </div>
    ) : (
      <p className="text-gray-500">Loading...</p>
    );
  }

  if (!product) {
    return modal ? (
      <div className="fixed inset-0 flex justify-center items-center z-[9999]">
        <div className="absolute inset-0 bg-black/20 backdrop-blur-md" />
        <div className="relative bg-background p-6 sm:p-10 rounded-2xl text-center shadow-xl max-w-sm sm:max-w-lg w-full">
          <p className="text-lg text-muted-foreground mb-4">Product not found</p>
          <Button onClick={handleClose}>Go Back</Button>
        </div>
      </div>
    ) : (
      <p className="text-red-500">Product not found</p>
    );
  }

  // Inline / homepage card
  if (!modal) {
    return (
      <div className="relative bg-white shadow-md rounded-xl p-4 flex flex-col items-center w-full">
        <img
          src={product.image_url || localImages[0]}
          alt={product.name}
          className="h-40 object-contain"
        />
        <h3 className="font-bold mt-2 text-center">{product.name}</h3>
        <p className="text-[#0b8686] font-semibold">
          ₨{product.price.toLocaleString("en-PK", { minimumFractionDigits: 2 })}
        </p>
        <Button
          className="mt-2 bg-[#0b8686] hover:bg-[#097575] text-white w-full flex justify-center"
          onClick={handleAddToCart}
          disabled={product.stock_quantity === 0}
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          {product.stock_quantity === 0 ? "Out of Stock" : "Add to Cart"}
        </Button>

        {added && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-2 right-2 bg-white text-gray-800 px-3 py-2 rounded-lg shadow-md border border-gray-200"
          >
            ✅ Added!
          </motion.div>
        )}
      </div>
    );
  }

  // Modal overlay
  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.4, ease: "easeOut" } }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 flex justify-center items-center z-[9999] p-4 sm:p-6"
        onClick={handleOverlayClick}
      >
        <div className="absolute inset-0 bg-black/20 backdrop-blur-md pointer-events-auto" />

        <motion.div
          ref={modalRef}
          key="modal"
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-full sm:max-w-3xl md:max-w-4xl lg:max-w-5xl 
                     bg-white rounded-2xl shadow-2xl overflow-auto max-h-[calc(100vh-2rem)] p-4 sm:p-6 md:p-8"
          style={{
            paddingBottom: "calc(env(safe-area-inset-bottom) + 1rem)",
            paddingTop: "calc(env(safe-area-inset-top) + 1rem)",
          }}
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 text-gray-700 hover:text-gray-900 transition-colors z-50
                       w-12 h-12 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-md"
          >
            <X size={28} />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="flex items-center justify-center bg-gray-50 rounded-xl p-4 sm:p-6">
              <img
                src={product.image_url || localImages[0]}
                alt={product.name}
                className="w-full h-auto max-h-96 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = localImages[0];
                }}
              />
            </div>

            <div className="flex flex-col justify-between">
              <div>
                <Badge className="mb-4 bg-secondary text-secondary-foreground">
                  {product.category}
                </Badge>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>
                <p className="text-muted-foreground mb-4 sm:mb-6 leading-relaxed">
                  {product.description}
                </p>

                {product.benefits?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
                    {product.benefits.map((b, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {b}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2 mb-4 sm:mb-6">
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

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t border-border gap-4 sm:gap-0">
                <div className="text-2xl sm:text-3xl font-bold text-[#0b8686]">
                  ₨{product.price.toLocaleString("en-PK", { minimumFractionDigits: 2 })}
                </div>
                <Button
                  className="bg-[#0b8686] hover:bg-[#097575] text-white w-full sm:w-auto flex justify-center items-center"
                  onClick={handleAddToCart}
                  disabled={product.stock_quantity === 0}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {product.stock_quantity === 0 ? "Out of Stock" : "Add to Cart"}
                </Button>
              </div>
            </div>
          </div>

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
      </motion.div>
    </AnimatePresence>
  );
};

export default ProductDetail;
