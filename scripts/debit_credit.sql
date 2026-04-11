-- Atomic credit debit — run this in the Supabase SQL Editor
-- Used by /api/generate to decrement user credits without race conditions.
-- SELECT FOR UPDATE acquires a row lock so concurrent requests can't double-spend.

CREATE OR REPLACE FUNCTION public.debit_credit(
  p_user_id UUID,
  p_amount  INTEGER
)
RETURNS TABLE(credits_remaining INTEGER)
LANGUAGE plpgsql
SECURITY DEFINER  -- runs as the function owner, bypassing RLS for this operation
AS $$
DECLARE
  v_current INTEGER;
BEGIN
  -- Lock the specific user row for the duration of this transaction
  SELECT credits
    INTO v_current
    FROM public.users
   WHERE id = p_user_id
     FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found: %', p_user_id;
  END IF;

  IF v_current < p_amount THEN
    RAISE EXCEPTION 'Insufficient credits: has %, needs %', v_current, p_amount;
  END IF;

  UPDATE public.users
     SET credits    = credits - p_amount,
         updated_at = NOW()
   WHERE id = p_user_id;

  RETURN QUERY
    SELECT u.credits AS credits_remaining
      FROM public.users u
     WHERE u.id = p_user_id;
END;
$$;

-- Only authenticated service-role callers should execute this function.
-- Revoke public execute and grant only to the service role.
REVOKE EXECUTE ON FUNCTION public.debit_credit(UUID, INTEGER) FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.debit_credit(UUID, INTEGER) TO service_role;
