-- Fix security vulnerability in orders table RLS policy
-- Replace the overly permissive order creation policy with a secure one

DROP POLICY IF EXISTS "Users can create orders" ON public.orders;

-- Create a secure policy that ensures users can only create orders for themselves
CREATE POLICY "Users can create orders for themselves" 
ON public.orders 
FOR INSERT 
WITH CHECK (
  -- Authenticated users can only create orders with their own user_id
  (auth.uid() IS NOT NULL AND auth.uid() = user_id) 
  OR 
  -- Unauthenticated users can only create orders with a session_id (no user_id)
  (auth.uid() IS NULL AND user_id IS NULL AND session_id IS NOT NULL)
);