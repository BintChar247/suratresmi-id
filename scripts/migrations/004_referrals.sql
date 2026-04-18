-- Migration 004: Referral program (Phase 5 — Marketing)
-- Adds referral tracking on users + a referrals ledger.
-- Run after 003_credit_rpc_functions.sql.

-- ============================================================
-- 1. Add referral columns to public.users
-- ============================================================
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS referred_by UUID REFERENCES public.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_users_referred_by ON public.users(referred_by);

-- ============================================================
-- 2. referrals ledger
-- ============================================================
CREATE TABLE IF NOT EXISTS public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  referred_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  source TEXT,                       -- 'whatsapp' | 'twitter' | 'copy' | 'tiktok' | NULL
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  converted_at TIMESTAMPTZ,          -- set when referred user makes first purchase
  reward_granted_at TIMESTAMPTZ,     -- set when referrer's bonus credits are issued
  CONSTRAINT referrals_no_self_ref CHECK (referrer_id <> referred_id),
  CONSTRAINT referrals_unique_referred UNIQUE (referred_id)
);

ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "referrals_select_own" ON public.referrals
  FOR SELECT USING (
    auth.uid() = referrer_id OR auth.uid() = referred_id
  );

CREATE POLICY "referrals_admin_all" ON public.referrals
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND plan = 'admin')
  );

CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON public.referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred_id ON public.referrals(referred_id);
CREATE INDEX IF NOT EXISTS idx_referrals_created_at ON public.referrals(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_referrals_converted_at ON public.referrals(converted_at) WHERE converted_at IS NOT NULL;
