-- Add wallet_address to profiles so sellers can receive ALGO payments
ALTER TABLE public.profiles ADD COLUMN wallet_address text;
