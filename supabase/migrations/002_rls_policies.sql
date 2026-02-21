-- Row Level Security Policies

-- Enable RLS on all tables
ALTER TABLE diagnostic_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;

-- Diagnostic Submissions: Anyone can insert, only admins can read/update/delete
CREATE POLICY "Anyone can submit diagnostic" ON diagnostic_submissions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can read submissions" ON diagnostic_submissions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM admin_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins can update submissions" ON diagnostic_submissions
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM admin_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins can delete submissions" ON diagnostic_submissions
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM admin_profiles WHERE user_id = auth.uid())
  );

-- Portfolios: Public read for published, admin full access
CREATE POLICY "Public can read published portfolios" ON portfolios
  FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can manage portfolios" ON portfolios
  FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_profiles WHERE user_id = auth.uid())
  );

-- Testimonials: Public read for published, admin full access
CREATE POLICY "Public can read published testimonials" ON testimonials
  FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can manage testimonials" ON testimonials
  FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_profiles WHERE user_id = auth.uid())
  );

-- Admin Profiles: Only admins can read their own profile
CREATE POLICY "Admins can read own profile" ON admin_profiles
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Super admins can manage profiles" ON admin_profiles
  FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_profiles WHERE user_id = auth.uid() AND role = 'super_admin')
  );
