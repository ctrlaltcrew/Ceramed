import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

export interface Product {
  id: string;
  name: string;
  description?: string;
  full_description?: string;
  price: number;
  image_url: string | null;
  category?: string;
  benefits?: string[];
  rating?: number;
  reviews_count?: number;
  stock_quantity?: number;
  size?: string;
  color?: string;
}

interface ProductDetailProps {
  product: Product;
  onClose: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = async () => {
    await addToCart(product.id);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000); // hide notification after 2s
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 font-bold text-lg"
        >
          ×
        </button>

        {/* Product Image */}
        <div className="flex justify-center mb-4">
          <img
            src={product.image_url || "/placeholder.png"}
            alt={product.name}
            className="w-full max-w-sm h-64 object-contain rounded-lg"
          />
        </div>

        {/* Product Info */}
        <h2 className="text-2xl font-bold mb-2">{product.name}</h2>

        <div className="flex items-center gap-2 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-5 w-5 ${
                i < Math.floor(product.rating || 0)
                  ? "text-yellow-400 fill-current"
                  : "text-gray-300"
              }`}
            />
          ))}
          <span className="text-sm text-gray-500">
            ({product.reviews_count || 0} reviews)
          </span>
        </div>

        <p className="text-gray-700 mb-4">{product.description}</p>
        {product.full_description && (
          <p className="text-gray-600 mb-4">{product.full_description}</p>
        )}

        {(product.size || product.color) && (
          <div className="flex gap-4 mb-4">
            {product.size && <Badge variant="outline">Size: {product.size}</Badge>}
            {product.color && <Badge variant="outline">Color: {product.color}</Badge>}
          </div>
        )}

        {product.benefits && product.benefits.length > 0 && (
          <ul className="list-disc list-inside text-gray-600 mb-4">
            {product.benefits.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        )}

        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between mt-4 border-t pt-4">
          <span className="text-2xl font-bold text-[#0b8686]">
            ₨{product.price.toLocaleString("en-PK")}
          </span>
          <Button
            onClick={handleAddToCart}
            disabled={product.stock_quantity === 0}
            className="bg-[#0b8686] hover:bg-[#097575] text-white"
          >
            {product.stock_quantity === 0 ? "Out of Stock" : "Add to Cart"}
          </Button>
        </div>

        {/* Added to Cart Notification */}
        {added && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded shadow-lg">
            Product added to cart!
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
