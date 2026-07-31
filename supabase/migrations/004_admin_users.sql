-- Drop the old Supabase-Auth-linked admin table and its RLS policies.
DROP POLICY IF EXISTS "Admins can read submissions" ON diagnostic_submissions;
DROP POLICY IF EXISTS "Admins can update submissions" ON diagnostic_submissions;
DROP POLICY IF EXISTS "Admins can delete submissions" ON diagnostic_submissions;
DROP POLICY IF EXISTS "Admins can manage portfolios" ON portfolios;
DROP POLICY IF EXISTS "Admins can manage testimonials" ON testimonials;
DROP POLICY IF EXISTS "Admins can read own profile" ON admin_profiles;
DROP POLICY IF EXISTS "Super admins can manage profiles" ON admin_profiles;
DROP TABLE IF EXISTS admin_profiles;

CREATE TABLE admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_admin_users_email ON admin_users(email);

-- No RLS admin-bypass policies: admin_users is only ever queried through the
-- service-role client in API routes/server components, which bypasses RLS.
-- RLS stays enabled with no policies, so anon/authenticated roles get zero access.
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
