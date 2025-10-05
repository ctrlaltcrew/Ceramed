import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";

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

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const processed = (data || []).map((p: Product, i: number) => {
        let image = p.image_url;

        if (!image || image.trim() === "") {
          image = localImages[i % localImages.length];
        } else if (!image.startsWith("http")) {
          const { data: publicUrlData } = supabase.storage
            .from("product-images")
            .getPublicUrl(p.image_url);
          image = publicUrlData?.publicUrl || localImages[i % localImages.length];
        }

        return { ...p, image_url: image };
      });

      setProducts(processed);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId: string) => {
    await addToCart(productId);
  };

  if (loading) {
    return (
      <section
        id="products"
        className="section-padding bg-gradient-to-br from-accent/10 to-background"
      >
        <div className="container mx-auto text-center">
          <p className="text-lg text-muted-foreground">Loading products...</p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="products"
      className="section-padding bg-gradient-to-br from-accent/10 to-background"
    >
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-secondary/10 text-secondary rounded-full text-sm font-semibold mb-6">
            Our Products
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
            Evidence-Based
            <span className="text-secondary"> Health Solutions</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Explore our trusted, science-backed health products — developed with
            precision and innovation to improve wellbeing.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-8 mb-16">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="flex flex-col justify-between h-full bg-background rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all animate-slide-up"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Product Image */}
              <div className="relative overflow-hidden rounded-t-2xl flex items-center justify-center bg-gray-50 h-56">
                <img
                  src={product.image_url || localImages[index % localImages.length]}
                  alt={`${product.name} - ${product.description}`}
                  className="max-h-56 w-auto object-contain group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      localImages[index % localImages.length];
                  }}
                />

                {/* Category Badge */}
                <Badge className="absolute top-3 left-3 bg-secondary text-secondary-foreground">
                  {product.category}
                </Badge>

                {/* Stock Status */}
                {product.stock_quantity <= 5 && product.stock_quantity > 0 && (
                  <Badge variant="destructive" className="absolute top-3 right-3">
                    Only {product.stock_quantity} left
                  </Badge>
                )}
                {product.stock_quantity === 0 && (
                  <Badge variant="destructive" className="absolute top-3 right-3">
                    Out of Stock
                  </Badge>
                )}
              </div>

              {/* Product Info */}
              <div className="flex flex-col flex-grow justify-between p-6">
                <div>
                  <h3 className="text-2xl font-semibold text-foreground mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed line-clamp-3">
                    {product.description}
                  </p>

                  {/* Benefits */}
                  {product.benefits?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {product.benefits.map((benefit, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Rating */}
                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {product.rating} ({product.reviews_count} reviews)
                    </span>
                  </div>
                </div>

                {/* Price & Add to Cart */}
                <div className="flex items-center justify-between pt-4 border-t border-border mt-6">
                  <div className="text-2xl font-bold text-primary">
                    ${product.price.toFixed(2)}
                  </div>
                  <Button
                    className="btn-medical group"
                    onClick={() => handleAddToCart(product.id)}
                    disabled={product.stock_quantity === 0}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {product.stock_quantity === 0 ? "Out of Stock" : "Add to Cart"}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center text-muted-foreground">
            No products available at the moment.
          </div>
        )}
      </div>
    </section>
  );
};

export default Products;
