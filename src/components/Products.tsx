import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Star, ShoppingCart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useCart } from '@/contexts/CartContext';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  benefits: string[];
  rating: number;
  reviews_count: number;
  stock_quantity: number;
}

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
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId: string) => {
    await addToCart(productId);
  };

  const scrollToProducts = () => {
    const productsSection = document.getElementById('products');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <section id="products" className="section-padding bg-gradient-to-br from-accent/10 to-background">
        <div className="container mx-auto">
          <div className="text-center">
            <div className="text-xl text-muted-foreground">Loading products...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="section-padding bg-gradient-to-br from-accent/10 to-background">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-block px-4 py-2 bg-secondary/10 text-secondary rounded-full text-sm font-semibold mb-6">
            Our Products
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
            Evidence-Based 
            <span className="text-secondary"> Health Solutions</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover our range of scientifically-developed natural health products, 
            each formulated with precision and backed by rigorous research.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {products.map((product, index) => (
            <div 
              key={product.id}
              className="medical-card group hover:bg-gradient-card animate-slide-up"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Product Image */}
              <div className="relative mb-6 overflow-hidden rounded-xl">
                <img
                  src={product.image_url}
                  alt={`${product.name} - ${product.description}`}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Badge className="absolute top-3 left-3 bg-secondary text-secondary-foreground">
                  {product.category}
                </Badge>
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
              <div className="space-y-4">
                <div>
                  <h3 className="text-2xl font-semibold text-foreground mb-2">
                    {product.name}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Benefits */}
                <div className="flex flex-wrap gap-2">
                  {product.benefits?.map((benefit, benefitIndex) => (
                    <Badge key={benefitIndex} variant="outline" className="text-xs">
                      {benefit}
                    </Badge>
                  ))}
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {product.rating} ({product.reviews_count} reviews)
                  </span>
                </div>

                {/* Price & Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="text-2xl font-bold text-primary">
                    ${product.price.toFixed(2)}
                  </div>
                  <Button 
                    className="btn-medical group"
                    onClick={() => handleAddToCart(product.id)}
                    disabled={product.stock_quantity === 0}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center">
            <p className="text-muted-foreground">No products available at the moment.</p>
          </div>
        )}

        {/* CTA */}
        <div className="text-center animate-fade-in">
          <Button className="btn-medical text-lg group" onClick={scrollToProducts}>
            Shop All Products
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Products;