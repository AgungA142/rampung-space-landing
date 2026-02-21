-- Indexes for performance

CREATE INDEX idx_submissions_status ON diagnostic_submissions(status);
CREATE INDEX idx_submissions_created_at ON diagnostic_submissions(created_at DESC);
CREATE INDEX idx_submissions_complexity ON diagnostic_submissions(complexity_level);
CREATE INDEX idx_submissions_email ON diagnostic_submissions(email);

CREATE INDEX idx_portfolios_slug ON portfolios(slug);
CREATE INDEX idx_portfolios_published ON portfolios(is_published, sort_order);
CREATE INDEX idx_portfolios_featured ON portfolios(is_featured) WHERE is_featured = true;

CREATE INDEX idx_testimonials_published ON testimonials(is_published, sort_order);

CREATE INDEX idx_admin_profiles_user_id ON admin_profiles(user_id);

-- Function: Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_portfolios_updated_at
  BEFORE UPDATE ON portfolios
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_testimonials_updated_at
  BEFORE UPDATE ON testimonials
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Function: Get dashboard stats
CREATE OR REPLACE FUNCTION get_dashboard_stats()
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_submissions', (SELECT COUNT(*) FROM diagnostic_submissions),
    'new_submissions', (SELECT COUNT(*) FROM diagnostic_submissions WHERE status = 'new'),
    'contacted_submissions', (SELECT COUNT(*) FROM diagnostic_submissions WHERE status = 'contacted'),
    'in_progress_submissions', (SELECT COUNT(*) FROM diagnostic_submissions WHERE status = 'in_progress'),
    'completed_submissions', (SELECT COUNT(*) FROM diagnostic_submissions WHERE status = 'completed'),
    'total_portfolios', (SELECT COUNT(*) FROM portfolios),
    'total_testimonials', (SELECT COUNT(*) FROM testimonials),
    'submissions_this_week', (SELECT COUNT(*) FROM diagnostic_submissions WHERE created_at >= NOW() - INTERVAL '7 days')
  ) INTO result;
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
