-- SuratResmi.Online — Production Readiness Diagnosis
-- Run each block in Supabase SQL Editor to check what's broken

-- ─── 1. Are there templates? ─────────────────────────────────────────────────
SELECT
  type,
  COUNT(*) AS template_count,
  SUM(CASE WHEN is_active THEN 1 ELSE 0 END) AS active
FROM public.templates
GROUP BY type
ORDER BY type;
-- EXPECTED: 6 rows (kuasa, surat_jual, perj_kerja, perj_sewa, perj_utang, + surat_pernyataan types)
-- FIX IF EMPTY: Run scripts/seed-templates-part1.sql, part2.sql, part3.sql

-- ─── 2. Are there users in public.users? ─────────────────────────────────────
SELECT
  (SELECT COUNT(*) FROM auth.users)   AS auth_users,
  (SELECT COUNT(*) FROM public.users) AS public_users;
-- EXPECTED: both counts should match
-- FIX IF public_users < auth_users: Run scripts/create_user_trigger.sql

-- ─── 3. Do users have credits? ───────────────────────────────────────────────
SELECT id, email, credits, plan, created_at
FROM public.users
ORDER BY created_at DESC
LIMIT 20;
-- EXPECTED: credits >= 1 for each user
-- FIX IF 0: UPDATE public.users SET credits = 3 WHERE credits = 0;

-- ─── 4. Does the debit_credit RPC exist? ─────────────────────────────────────
SELECT
  routine_name,
  routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name = 'debit_credit';
-- EXPECTED: 1 row with routine_name = 'debit_credit'
-- FIX IF MISSING: Run scripts/debit_credit.sql

-- ─── 5. Does the handle_new_user trigger exist? ──────────────────────────────
SELECT
  trigger_name,
  event_manipulation,
  event_object_table
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';
-- EXPECTED: 1 row
-- FIX IF MISSING: Run scripts/create_user_trigger.sql

-- ─── 6. Recent letter generation attempts ────────────────────────────────────
SELECT action, metadata, created_at
FROM public.audit_log
ORDER BY created_at DESC
LIMIT 20;
-- Look for: letter_generate (success), letter_generate_anomaly (validation fail)
-- If empty: letters were never attempted or audit_log insert is failing

-- ─── 7. Quick credit grant for your own account ──────────────────────────────
-- Uncomment and replace YOUR_EMAIL to give yourself credits for testing:
-- UPDATE public.users SET credits = 100 WHERE email = 'YOUR_EMAIL@example.com';
-- SELECT id, email, credits FROM public.users WHERE email = 'YOUR_EMAIL@example.com';
