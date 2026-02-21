-- Core Tables for Rampung Space Landing Page
-- Run this migration first

-- Diagnostic Submissions
CREATE TABLE diagnostic_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Contact Info
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,

  -- Wizard Answers
  budget_idr BIGINT,
  budget_usd INTEGER,
  platform TEXT NOT NULL,
  platform_other TEXT,
  target_user TEXT NOT NULL,
  features TEXT[] NOT NULL DEFAULT '{}',
  timeline TEXT NOT NULL,

  -- Scoring (internal)
  score_budget INTEGER DEFAULT 0,
  score_platform INTEGER DEFAULT 0,
  score_target_user INTEGER DEFAULT 0,
  score_features INTEGER DEFAULT 0,
  score_timeline INTEGER DEFAULT 0,
  total_score INTEGER DEFAULT 0,
  complexity_level TEXT,

  -- Flags
  timeline_warning BOOLEAN DEFAULT FALSE,
  needs_multi_tenant BOOLEAN DEFAULT FALSE,

  -- Admin
  status TEXT DEFAULT 'new',
  admin_notes TEXT,
  contacted_at TIMESTAMPTZ
);

-- Portfolios
CREATE TABLE portfolios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  challenge TEXT NOT NULL,
  solution TEXT NOT NULL,
  tech_stack TEXT[] NOT NULL DEFAULT '{}',
  tags TEXT[] NOT NULL DEFAULT '{}',
  thumbnail_url TEXT,
  images TEXT[],
  is_featured BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0
);

-- Testimonials
CREATE TABLE testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  client_name TEXT NOT NULL,
  client_company TEXT,
  client_position TEXT,
  avatar_url TEXT,
  quote TEXT NOT NULL,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  is_published BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0
);

-- Admin Profiles
CREATE TABLE admin_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
