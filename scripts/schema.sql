-- SuratResmi.Online — Complete Database Schema
-- Run this in Supabase SQL Editor (Settings > Singapore region recommended)
-- All tables have RLS enabled (default deny, whitelisted with policies)

-- ============================================================
-- Table 1: organizations (must exist before users due to FK)
-- ============================================================
CREATE TABLE public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  plan TEXT NOT NULL CHECK (plan IN ('basic', 'enterprise')),
  max_seats INTEGER NOT NULL CHECK (max_seats IN (3, 10)),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

-- NOTE: orgs policies reference public.users, so they are added AFTER users table below.

CREATE INDEX idx_organizations_plan ON public.organizations(plan);

-- ============================================================
-- Table 2: users (extends Supabase auth.users)
-- ============================================================
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  credits INTEGER NOT NULL DEFAULT 3,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'credit', 'b2b_basic', 'b2b_team', 'admin')),
  org_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_active TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_select_own" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "users_update_own" ON public.users
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "users_admin_all" ON public.users
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND plan = 'admin')
  );

CREATE INDEX idx_users_org_id ON public.users(org_id);

-- organizations policies (deferred — required public.users to exist first)
CREATE POLICY "orgs_select_own" ON public.organizations
  FOR SELECT USING (
    id IN (SELECT org_id FROM public.users WHERE id = auth.uid())
  );

CREATE POLICY "orgs_admin_all" ON public.organizations
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND plan = 'admin')
  );

-- ============================================================
-- Table 3: letters (generated letter records)
-- ============================================================
CREATE TABLE public.letters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('kuasa', 'surat_jual', 'kuasa_istimewa', 'perj_kerja', 'perj_sewa', 'perj_utang')),
  subtype_id TEXT NOT NULL,
  content TEXT NOT NULL,
  input_data JSONB NOT NULL,
  api_tokens_used INTEGER NOT NULL,
  pdf_downloaded BOOLEAN NOT NULL DEFAULT FALSE,
  flagged BOOLEAN NOT NULL DEFAULT FALSE,
  flag_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.letters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "letters_select_own" ON public.letters
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "letters_insert_own" ON public.letters
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "letters_admin_all" ON public.letters
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND plan = 'admin')
  );

CREATE INDEX idx_letters_user_id ON public.letters(user_id);
CREATE INDEX idx_letters_type_subtype ON public.letters(type, subtype_id);
CREATE INDEX idx_letters_created_at ON public.letters(created_at);
CREATE INDEX idx_letters_flagged ON public.letters(flagged) WHERE flagged = TRUE;

-- ============================================================
-- Table 4: transactions (credit ledger)
-- ============================================================
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('purchase', 'debit', 'refund', 'grant')),
  credits_delta INTEGER NOT NULL,
  amount_idr INTEGER,
  midtrans_order_id TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed', 'refunded')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "transactions_select_own" ON public.transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "transactions_admin_all" ON public.transactions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND plan = 'admin')
  );

CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_transactions_midtrans_order_id ON public.transactions(midtrans_order_id);
CREATE INDEX idx_transactions_status ON public.transactions(status);
CREATE INDEX idx_transactions_created_at ON public.transactions(created_at DESC);

-- ============================================================
-- Table 5: templates (letter definitions — populated by Track B)
-- ============================================================
CREATE TABLE public.templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  subtype_id TEXT NOT NULL UNIQUE,
  name_id TEXT NOT NULL,
  name_en TEXT,
  required_fields JSONB NOT NULL,
  prompt_template TEXT NOT NULL,
  requires_materai BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "templates_select_public" ON public.templates
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "templates_all_admin" ON public.templates
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND plan = 'admin')
  );

CREATE INDEX idx_templates_type ON public.templates(type);
CREATE INDEX idx_templates_is_active ON public.templates(is_active);

-- ============================================================
-- Table 6: seo_cache (pre-generated SEO examples — Phase 4)
-- ============================================================
CREATE TABLE public.seo_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subtype_id TEXT NOT NULL UNIQUE REFERENCES public.templates(subtype_id),
  example_letter TEXT NOT NULL,
  meta_title TEXT NOT NULL,
  meta_description TEXT NOT NULL,
  faq_json JSONB NOT NULL,
  related_subtypes TEXT[] NOT NULL,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.seo_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "seo_cache_select_public" ON public.seo_cache
  FOR SELECT USING (TRUE);

CREATE INDEX idx_seo_cache_subtype_id ON public.seo_cache(subtype_id);

-- ============================================================
-- Table 7: support_tickets (help desk)
-- ============================================================
CREATE TABLE public.support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('payment', 'letter_quality', 'account', 'bug', 'legal', 'other')),
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'waiting_user', 'resolved', 'closed')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  assigned_to TEXT,
  related_letter_id UUID REFERENCES public.letters(id) ON DELETE SET NULL,
  related_transaction_id UUID REFERENCES public.transactions(id) ON DELETE SET NULL,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "support_tickets_select_own" ON public.support_tickets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "support_tickets_insert_own" ON public.support_tickets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "support_tickets_admin_all" ON public.support_tickets
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND plan = 'admin')
  );

CREATE INDEX idx_support_tickets_user_id ON public.support_tickets(user_id);
CREATE INDEX idx_support_tickets_status ON public.support_tickets(status);
CREATE INDEX idx_support_tickets_priority ON public.support_tickets(priority);
CREATE INDEX idx_support_tickets_created_at ON public.support_tickets(created_at DESC);

-- ============================================================
-- Table 8: audit_log (UU PDP compliance trail)
-- ============================================================
CREATE TABLE public.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID,
  actor_type TEXT NOT NULL CHECK (actor_type IN ('user', 'admin', 'system', 'cron')),
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "audit_log_admin_all" ON public.audit_log
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND plan = 'admin')
  );

CREATE POLICY "audit_log_insert_system" ON public.audit_log
  FOR INSERT WITH CHECK (TRUE);

CREATE INDEX idx_audit_log_actor_id ON public.audit_log(actor_id);
CREATE INDEX idx_audit_log_action ON public.audit_log(action);
CREATE INDEX idx_audit_log_resource_type_id ON public.audit_log(resource_type, resource_id);
CREATE INDEX idx_audit_log_created_at ON public.audit_log(created_at DESC);
