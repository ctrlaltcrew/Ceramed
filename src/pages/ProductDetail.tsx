import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

interface Product {
  id: string;
  name: string;
  description: string;
  full_description?: string;
  price: number;
  image_url: string | null;
  category: string;
  benefits: string[];
  rating: number;
  reviews_count: number;
  stock_quantity: number;
  size?: string;
  color?: string;
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    if (id) fetchProduct(id);
  }, [id]);

  const fetchProduct = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setProduct(data);
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-lg">Loading product...</div>;
  }

  if (!product) {
    return <div className="text-center py-20 text-red-500">Product not found</div>;
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <Link to="/products" className="text-blue-600 hover:underline mb-6 inline-block">
        ← Back to Products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Image */}
        <div className="flex justify-center">
          <img
            src={product.image_url || "/placeholder.png"}
            alt={product.name}
            className="rounded-lg shadow-md w-full max-w-md h-[400px] object-contain bg-gray-50 transition-transform duration-300 hover:scale-105"
            onError={(e) => ((e.target as HTMLImageElement).src = "/placeholder.png")}
          />
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <div className="flex items-center gap-2 mb-3">
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
              ({product.reviews_count} reviews)
            </span>
          </div>

          <p className="text-lg text-muted-foreground mb-4">
            {product.description}
          </p>

          {product.full_description && (
            <p className="text-base text-foreground leading-relaxed mb-6">
              {product.full_description}
            </p>
          )}

          {/* Size & Color */}
          {(product.size || product.color) && (
            <div className="flex gap-4 mb-6">
              {product.size && (
                <Badge variant="outline" className="text-md">
                  Size: {product.size}
                </Badge>
              )}
              {product.color && (
                <Badge variant="outline" className="text-md">
                  Color: {product.color}
                </Badge>
              )}
            </div>
          )}

          {/* Benefits */}
          {product.benefits?.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2 text-lg">Benefits:</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                {product.benefits.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Price & Add to Cart */}
          <div className="flex items-center justify-between border-t pt-4 mt-6">
            <div className="text-3xl font-bold text-primary">
              ₨{product.price.toLocaleString("en-PK")}
            </div>
            <Button
              className="btn-medical"
              onClick={() => addToCart(product.id)}
              disabled={product.stock_quantity === 0}
            >
              {product.stock_quantity === 0 ? "Out of Stock" : "Add to Cart"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
