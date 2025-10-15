-- Set Admin Role for Your User
-- Replace 'your-email@example.com' with your actual email

-- Option 1: Set role in user_metadata (recommended)
UPDATE auth.users 
SET raw_user_meta_data = 
  COALESCE(raw_user_meta_data, '{}'::jsonb) || '{"role": "admin"}'::jsonb
WHERE email = 'your-email@example.com';

-- Option 2: Set role in app_metadata (alternative)
-- UPDATE auth.users 
-- SET raw_app_meta_data = 
--   COALESCE(raw_app_meta_data, '{}'::jsonb) || '{"role": "admin"}'::jsonb
-- WHERE email = 'your-email@example.com';

-- Verify the role was set
SELECT 
  id,
  email,
  raw_user_meta_data ->> 'role' as user_role,
  raw_app_meta_data ->> 'role' as app_role,
  created_at
FROM auth.users 
WHERE email = 'your-email@example.com';

-- To see all users and their roles:
SELECT 
  id,
  email,
  raw_user_meta_data ->> 'role' as role,
  created_at
FROM auth.users 
ORDER BY created_at DESC;
