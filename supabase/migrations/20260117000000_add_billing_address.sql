-- Add billing_address column to orders table
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS billing_address jsonb;

-- Add comment to describe the column
COMMENT ON COLUMN public.orders.billing_address IS 'Billing address for the order (JSON object with street, city, zip fields)';
