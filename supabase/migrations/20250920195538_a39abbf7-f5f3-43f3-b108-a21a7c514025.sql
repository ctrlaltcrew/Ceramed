-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  category TEXT,
  benefits TEXT[],
  rating DECIMAL(2,1) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  stock_quantity INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create cart items table
CREATE TABLE public.cart_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT, -- For non-authenticated users
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT unique_user_product UNIQUE (user_id, product_id),
  CONSTRAINT unique_session_product UNIQUE (session_id, product_id)
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_method TEXT,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  shipping_address JSONB,
  order_items JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Products policies (public read)
CREATE POLICY "Anyone can view products" 
ON public.products 
FOR SELECT 
USING (true);

-- Cart items policies
CREATE POLICY "Users can view their own cart items" 
ON public.cart_items 
FOR SELECT 
USING (
  auth.uid() = user_id OR 
  (auth.uid() IS NULL AND session_id IS NOT NULL)
);

CREATE POLICY "Users can insert their own cart items" 
ON public.cart_items 
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id OR 
  (auth.uid() IS NULL AND session_id IS NOT NULL)
);

CREATE POLICY "Users can update their own cart items" 
ON public.cart_items 
FOR UPDATE 
USING (
  auth.uid() = user_id OR 
  (auth.uid() IS NULL AND session_id IS NOT NULL)
);

CREATE POLICY "Users can delete their own cart items" 
ON public.cart_items 
FOR DELETE 
USING (
  auth.uid() = user_id OR 
  (auth.uid() IS NULL AND session_id IS NOT NULL)
);

-- Orders policies
CREATE POLICY "Users can view their own orders" 
ON public.orders 
FOR SELECT 
USING (
  auth.uid() = user_id OR 
  (auth.uid() IS NULL AND session_id IS NOT NULL)
);

CREATE POLICY "Users can create orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (true);

-- Insert sample products
INSERT INTO public.products (name, description, price, image_url, category, benefits, rating, reviews_count, stock_quantity) VALUES
('Mossent', 'Natural health supplement for overall wellness and vitality', 49.99, '/placeholder.svg', 'Supplements', ARRAY['Boosts Energy', 'Immune Support', 'Natural'], 4.8, 156, 50),
('Activ-P', 'Advanced formula for active lifestyle and performance enhancement', 79.99, '/placeholder.svg', 'Performance', ARRAY['Performance', 'Endurance', 'Recovery'], 4.9, 203, 30),
('Zest', 'Premium antioxidant blend for cellular health and anti-aging', 59.99, '/placeholder.svg', 'Antioxidants', ARRAY['Anti-aging', 'Cellular Health', 'Antioxidants'], 4.7, 89, 25);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at
BEFORE UPDATE ON public.cart_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
UPDATE public.products
SET image_url = CASE name
  WHEN 'Activ-P' THEN '/Active-P.png'
  WHEN 'Zest' THEN '/zest.png'
  WHEN 'Mossent' THEN '/Mossent.png'
  ELSE '/default-product.png'
END;
