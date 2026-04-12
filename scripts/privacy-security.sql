-- ============================================================
-- Privacy & Security Enhancements for UU PDP Compliance
-- Run in Supabase SQL Editor after the base schema.sql
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 1. Admin-safe view: letters WITHOUT PII columns
--    Admins see metadata (type, date, tokens, flags) but NOT
--    the encrypted content or input_data containing KTP/NIK.
-- ────────────────────────────────────────────────────────────

CREATE OR REPLACE VIEW public.letters_admin_view AS
SELECT
  id,
  user_id,
  type,
  subtype_id,
  -- content and input_data are EXCLUDED — encrypted PII
  api_tokens_used,
  pdf_downloaded,
  flagged,
  flag_reason,
  created_at,
  updated_at
FROM public.letters;

COMMENT ON VIEW public.letters_admin_view IS
  'Admin-safe view of letters — excludes encrypted PII fields (content, input_data) for UU PDP compliance.';

-- ────────────────────────────────────────────────────────────
-- 2. Admin-safe view: support_tickets WITHOUT description PII
-- ────────────────────────────────────────────────────────────

CREATE OR REPLACE VIEW public.tickets_admin_view AS
SELECT
  id,
  user_id,
  category,
  subject,
  -- description may contain PII — excluded
  status,
  priority,
  assigned_to,
  related_letter_id,
  related_transaction_id,
  resolved_at,
  created_at,
  updated_at
FROM public.support_tickets;

COMMENT ON VIEW public.tickets_admin_view IS
  'Admin-safe view of support tickets — excludes description field which may contain PII.';

-- ────────────────────────────────────────────────────────────
-- 3. Data retention: auto-purge function
--    Deletes letters and their encrypted PII older than the
--    specified retention period (default: 365 days).
--    Run via pg_cron or Supabase Edge Function on a schedule.
-- ────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.purge_expired_data(
  retention_days INTEGER DEFAULT 365
)
RETURNS TABLE(letters_deleted BIGINT, audit_entries_deleted BIGINT)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  cutoff TIMESTAMPTZ := NOW() - (retention_days || ' days')::INTERVAL;
  l_count BIGINT;
  a_count BIGINT;
BEGIN
  -- Delete old letters (cascades remove nothing — no FK points TO letters except support_tickets.related_letter_id which is SET NULL)
  WITH deleted AS (
    DELETE FROM public.letters
    WHERE created_at < cutoff
    RETURNING id
  )
  SELECT COUNT(*) INTO l_count FROM deleted;

  -- Purge old audit log entries (keep recent 90 days minimum regardless)
  WITH deleted AS (
    DELETE FROM public.audit_log
    WHERE created_at < (NOW() - INTERVAL '90 days')
      AND created_at < cutoff
    RETURNING id
  )
  SELECT COUNT(*) INTO a_count FROM deleted;

  -- Log the purge itself
  INSERT INTO public.audit_log (actor_type, action, resource_type, resource_id, metadata)
  VALUES (
    'cron',
    'data_retention_purge',
    'system',
    gen_random_uuid(),
    jsonb_build_object(
      'retention_days', retention_days,
      'letters_deleted', l_count,
      'audit_entries_deleted', a_count,
      'cutoff_date', cutoff
    )
  );

  RETURN QUERY SELECT l_count, a_count;
END;
$$;

COMMENT ON FUNCTION public.purge_expired_data IS
  'UU PDP data retention: deletes letters and audit entries older than retention_days. Schedule via pg_cron.';

-- ────────────────────────────────────────────────────────────
-- 4. Add privacy_consent column to users table
--    Tracks when the user explicitly consented to data processing.
-- ────────────────────────────────────────────────────────────

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS privacy_consented_at TIMESTAMPTZ;

COMMENT ON COLUMN public.users.privacy_consented_at IS
  'Timestamp when user explicitly consented to privacy policy and data processing (UU PDP requirement).';

-- ────────────────────────────────────────────────────────────
-- 5. Schema change: letters.content and letters.input_data
--    are now stored as encrypted base64 strings. Update the
--    column types to TEXT to accommodate encrypted payloads.
--    (input_data was JSONB — encrypted data must be TEXT)
-- ────────────────────────────────────────────────────────────

-- NOTE: Run this ONLY if input_data is still JSONB.
-- If you have existing data, migrate it first before altering.
-- ALTER TABLE public.letters ALTER COLUMN input_data TYPE TEXT USING input_data::TEXT;
