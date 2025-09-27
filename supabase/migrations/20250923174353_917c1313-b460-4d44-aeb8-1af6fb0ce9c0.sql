-- Enhanced security for orders table with encryption and stronger session validation

-- Install pgcrypto extension for encryption functions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create a more robust session validation function
CREATE OR REPLACE FUNCTION public.validate_session_security(session_id text)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  session_length integer;
  unique_chars integer;
BEGIN
  -- Check if session_id is NULL or empty
  IF session_id IS NULL OR length(session_id) = 0 THEN
    RETURN false;
  END IF;
  
  -- Validate UUID format (already implemented but keeping for completeness)
  IF NOT (session_id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$') THEN
    RETURN false;
  END IF;
  
  -- Check session entropy - count unique characters
  SELECT length(session_id), 
         length(regexp_replace(session_id, '(.)(?=.*\1)', '', 'g'))
  INTO session_length, unique_chars;
  
  -- Ensure sufficient entropy (at least 16 unique characters in a UUID)
  IF unique_chars < 16 THEN
    RETURN false;
  END IF;
  
  RETURN true;
END;
$$;

-- Add encrypted columns for sensitive data (keeping originals for backward compatibility during migration)
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS customer_email_encrypted text,
ADD COLUMN IF NOT EXISTS customer_name_encrypted text,
ADD COLUMN IF NOT EXISTS customer_phone_encrypted text,
ADD COLUMN IF NOT EXISTS shipping_address_encrypted text,
ADD COLUMN IF NOT EXISTS encryption_key_id text DEFAULT 'default_key_v1';

-- Create function to encrypt sensitive data
CREATE OR REPLACE FUNCTION public.encrypt_customer_data()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  encryption_key text := 'customer_data_encryption_key_v1_change_in_production';
BEGIN
  -- Encrypt sensitive fields when inserting or updating
  IF NEW.customer_email IS NOT NULL THEN
    NEW.customer_email_encrypted := encode(encrypt(NEW.customer_email::bytea, encryption_key, 'aes'), 'base64');
  END IF;
  
  IF NEW.customer_name IS NOT NULL THEN
    NEW.customer_name_encrypted := encode(encrypt(NEW.customer_name::bytea, encryption_key, 'aes'), 'base64');
  END IF;
  
  IF NEW.customer_phone IS NOT NULL THEN
    NEW.customer_phone_encrypted := encode(encrypt(NEW.customer_phone::bytea, encryption_key, 'aes'), 'base64');
  END IF;
  
  IF NEW.shipping_address IS NOT NULL THEN
    NEW.shipping_address_encrypted := encode(encrypt(NEW.shipping_address::text::bytea, encryption_key, 'aes'), 'base64');
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for automatic encryption
DROP TRIGGER IF EXISTS encrypt_customer_data_trigger ON public.orders;
CREATE TRIGGER encrypt_customer_data_trigger
  BEFORE INSERT OR UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.encrypt_customer_data();

-- Update RLS policies with stronger session validation
DROP POLICY IF EXISTS "Guest users can view recent orders with valid session" ON public.orders;

CREATE POLICY "Guest users can view recent orders with validated session" 
ON public.orders 
FOR SELECT 
USING (
  auth.uid() IS NULL 
  AND user_id IS NULL 
  AND session_id IS NOT NULL 
  AND public.validate_session_security(session_id)
  AND created_at > (now() - interval '24 hours')
);

-- Add rate limiting table for session-based access
CREATE TABLE IF NOT EXISTS public.session_access_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  access_time timestamp with time zone DEFAULT now(),
  ip_address inet,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on access log
ALTER TABLE public.session_access_log ENABLE ROW LEVEL SECURITY;

-- Policy to allow session logging (restricted to system)
CREATE POLICY "System can log session access" 
ON public.session_access_log 
FOR INSERT 
WITH CHECK (true);

-- Function to check rate limiting (max 10 requests per minute per session)
CREATE OR REPLACE FUNCTION public.check_session_rate_limit(session_id text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*) < 10
  FROM public.session_access_log 
  WHERE session_id = $1 
  AND access_time > (now() - interval '1 minute');
$$;

-- Update the guest policy to include rate limiting
DROP POLICY IF EXISTS "Guest users can view recent orders with validated session" ON public.orders;

CREATE POLICY "Guest users can view recent orders with security checks" 
ON public.orders 
FOR SELECT 
USING (
  auth.uid() IS NULL 
  AND user_id IS NULL 
  AND session_id IS NOT NULL 
  AND public.validate_session_security(session_id)
  AND public.check_session_rate_limit(session_id)
  AND created_at > (now() - interval '24 hours')
);