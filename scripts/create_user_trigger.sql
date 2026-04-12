-- SuratResmi.Online — Auto-create public.users on Supabase signup
-- Run this in Supabase SQL Editor ONCE
-- This fixes the "Data pengguna tidak ditemukan" 404 error on generation

-- ── 1. Function: fires when a new row lands in auth.users ────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, credits, plan, created_at, last_active, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    3,       -- 3 free credits on signup
    'free',
    NOW(),
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;  -- idempotent: safe to re-run
  RETURN NEW;
END;
$$;

-- ── 2. Trigger: attach to auth.users ────────────────────────────────────────
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── 3. Backfill: create rows for users who already signed up ─────────────────
-- Safe to run even if some rows already exist (ON CONFLICT DO NOTHING)
INSERT INTO public.users (id, email, credits, plan, created_at, last_active, updated_at)
SELECT
  au.id,
  au.email,
  3,
  'free',
  au.created_at,
  au.created_at,
  au.created_at
FROM auth.users au
LEFT JOIN public.users pu ON pu.id = au.id
WHERE pu.id IS NULL;

-- Verify: count should match auth.users count
SELECT
  (SELECT COUNT(*) FROM auth.users)  AS auth_users,
  (SELECT COUNT(*) FROM public.users) AS public_users;
