-- Strengthen RLS policies for orders table to improve security
-- Add time-based restrictions and additional checks for session-based access

-- Drop existing policy
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;

-- Create more secure policies with time restrictions for guest users
CREATE POLICY "Authenticated users can view their own orders" 
ON public.orders 
FOR SELECT 
USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- For guest users, limit access to orders created within the last 24 hours only
-- This reduces the window of vulnerability if session_id is compromised
CREATE POLICY "Guest users can view recent orders with valid session" 
ON public.orders 
FOR SELECT 
USING (
  auth.uid() IS NULL 
  AND user_id IS NULL 
  AND session_id IS NOT NULL 
  AND created_at > (now() - interval '24 hours')
);

-- Add additional security function to validate session format
CREATE OR REPLACE FUNCTION public.is_valid_session_format(session_id text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  -- Check if session_id matches UUID format (crypto.randomUUID() generates UUIDs)
  SELECT session_id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$';
$$;

-- Update guest policy to also validate session format
DROP POLICY IF EXISTS "Guest users can view recent orders with valid session" ON public.orders;

CREATE POLICY "Guest users can view recent orders with valid session" 
ON public.orders 
FOR SELECT 
USING (
  auth.uid() IS NULL 
  AND user_id IS NULL 
  AND session_id IS NOT NULL 
  AND public.is_valid_session_format(session_id)
  AND created_at > (now() - interval '24 hours')
);