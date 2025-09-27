-- Create blogs table for dynamic blog management
CREATE TABLE public.blogs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  image_url TEXT,
  author_name TEXT DEFAULT 'Admin',
  category TEXT,
  tags TEXT[],
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read published blogs
CREATE POLICY "Anyone can view published blogs" 
ON public.blogs 
FOR SELECT 
USING (published = true);

-- Allow authenticated users to manage blogs (for admin)
CREATE POLICY "Authenticated users can manage blogs" 
ON public.blogs 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_blogs_updated_at
BEFORE UPDATE ON public.blogs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample blog posts
INSERT INTO public.blogs (title, content, excerpt, image_url, category, tags, published) VALUES
('The Future of Healthcare Technology', 'Healthcare technology is rapidly evolving, bringing new possibilities for patient care and medical research. From AI-powered diagnostics to telemedicine platforms, the landscape is changing dramatically...', 'Exploring the latest trends in healthcare technology and their impact on patient care.', 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop', 'Technology', ARRAY['healthcare', 'technology', 'AI'], true),
('10 Essential Health Tips for Modern Living', 'In our fast-paced world, maintaining good health can be challenging. Here are ten essential tips that can help you stay healthy and energized throughout your busy day...', 'Simple yet effective health tips for busy professionals and families.', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop', 'Health Tips', ARRAY['health', 'wellness', 'lifestyle'], true),
('Understanding Mental Health in the Workplace', 'Mental health awareness in the workplace has become increasingly important. Companies are recognizing the need to support their employees mental well-being for better productivity and overall satisfaction...', 'A comprehensive guide to workplace mental health initiatives and their benefits.', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=600&fit=crop', 'Mental Health', ARRAY['mental-health', 'workplace', 'wellness'], true);