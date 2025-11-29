-- Update is_admin() function to whitelist specific email
-- This allows the user to perform admin actions even if their JWT role claim isn't set to 'admin'

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT (
    auth.jwt() ->> 'role' = 'admin' OR 
    auth.jwt() ->> 'user_role' = 'admin' OR
    auth.jwt() ->> 'email' = 'christian6343@gmail.com'
  );
$$;
