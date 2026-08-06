-- ====================================================================
-- SprintFlow AI - Complete Supabase PostgreSQL Schema Definition
-- Includes 8 Tables, UUID Primary Keys, Foreign Keys, Indexes & RLS
-- Copy and paste this script directly into the Supabase SQL Editor.
-- ====================================================================

-- Enable pgcrypto extension for UUID generation if not enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- --------------------------------------------------------------------
-- 1. USERS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'manager',
  company_name TEXT DEFAULT 'SprintFlow Enterprise',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 2. PROJECTS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  business_type TEXT NOT NULL,
  goal TEXT NOT NULL,
  deadline TEXT NOT NULL,
  budget NUMERIC NOT NULL,
  priority TEXT DEFAULT 'High',
  status TEXT DEFAULT 'planned',
  team_members JSONB DEFAULT '[]'::jsonb,
  expected_deliverables JSONB DEFAULT '[]'::jsonb,
  executive_summary TEXT,
  ai_confidence_score INT DEFAULT 95,
  business_health_score INT DEFAULT 91,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 3. TIMELINES TABLE (Roadmap & Milestones)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.timelines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  duration_weeks INT DEFAULT 2,
  target_date TEXT,
  deliverables JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 4. TASKS TABLE (Kanban Tasks with Assignment Rationale)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  timeline_id UUID REFERENCES public.timelines(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  assigned_to TEXT,
  assigned_to_name TEXT,
  skill_required TEXT,
  status TEXT DEFAULT 'todo',
  priority TEXT DEFAULT 'Medium',
  estimated_days INT DEFAULT 3,
  assignment_rationale TEXT,
  dependencies JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 5. RISK_ANALYSIS TABLE (2x2 Matrix & Mitigations)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.risk_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT DEFAULT 'General',
  impact TEXT DEFAULT 'High',
  likelihood TEXT DEFAULT 'Medium',
  description TEXT,
  mitigation_strategy TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 6. REPORTS TABLE (README, Meeting Notes, Client Briefings)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  readme TEXT,
  meeting_notes TEXT,
  status_report TEXT,
  presentation_outline TEXT,
  client_report TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 7. AGENTS TABLE (Specialized Agent Mesh Registry)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  model TEXT DEFAULT 'gemini-1.5-flash',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert Default 5 Specialized Agents
INSERT INTO public.agents (name, role, status) VALUES
  ('Planner Agent', 'Milestone Decomposition & Timeline Buffer', 'active'),
  ('Task Agent', 'Skill Matching & Assignment Rationale', 'active'),
  ('Risk Agent', 'Dependency Locking & Mitigation Analysis', 'active'),
  ('Coordinator Agent', 'Critical Path & Workflow Synchronization', 'active'),
  ('Report Agent', 'Artifact Synthesis & Markdown Compilation', 'active')
ON CONFLICT (name) DO NOTHING;

-- --------------------------------------------------------------------
-- 8. ACTIVITY_LOGS TABLE (Real-time Agent Reasoning Logs)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  agent_name TEXT NOT NULL,
  action TEXT NOT NULL,
  details TEXT,
  type TEXT DEFAULT 'info',
  timestamp_str TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- --------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_timelines_project_id ON public.timelines(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON public.tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_risk_analysis_project_id ON public.risk_analysis(project_id);
CREATE INDEX IF NOT EXISTS idx_reports_project_id ON public.reports(project_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_project_id ON public.activity_logs(project_id);

-- --------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- --------------------------------------------------------------------
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Create permissive RLS policies for application operations
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'users_all_policy') THEN
    CREATE POLICY users_all_policy ON public.users FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'projects_all_policy') THEN
    CREATE POLICY projects_all_policy ON public.projects FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'timelines_all_policy') THEN
    CREATE POLICY timelines_all_policy ON public.timelines FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tasks_all_policy') THEN
    CREATE POLICY tasks_all_policy ON public.tasks FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'risk_analysis_all_policy') THEN
    CREATE POLICY risk_analysis_all_policy ON public.risk_analysis FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'reports_all_policy') THEN
    CREATE POLICY reports_all_policy ON public.reports FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'agents_all_policy') THEN
    CREATE POLICY agents_all_policy ON public.agents FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'activity_logs_all_policy') THEN
    CREATE POLICY activity_logs_all_policy ON public.activity_logs FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;
