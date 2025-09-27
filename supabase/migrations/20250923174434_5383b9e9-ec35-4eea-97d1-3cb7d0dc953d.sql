-- Fix policy creation and complete security enhancements

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "System can log session access" ON public.session_access_log;

-- Create the corrected policy
CREATE POLICY "System can log session access" 
ON public.session_access_log 
FOR INSERT 
WITH CHECK (true);

-- Update the guest policy to include rate limiting (drop first to avoid conflicts)
DROP POLICY IF EXISTS "Guest users can view recent orders with security checks" ON public.orders;

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

-- Create a function to log session access for monitoring
CREATE OR REPLACE FUNCTION public.log_session_access(session_id text, ip_addr text DEFAULT NULL)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  INSERT INTO public.session_access_log (session_id, ip_address)
  VALUES ($1, $2::inet);
$$;