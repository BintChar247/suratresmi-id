-- Migration: Credit management RPC functions
-- Run this in Supabase SQL Editor

-- Atomically add credits to a user
CREATE OR REPLACE FUNCTION public.credit_user(p_user_id UUID, p_amount INTEGER)
RETURNS TABLE(credits INTEGER) AS $$
BEGIN
  UPDATE public.users
  SET credits = users.credits + p_amount,
      updated_at = NOW()
  WHERE id = p_user_id;

  RETURN QUERY
  SELECT users.credits FROM public.users WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Atomically debit credits from a user (prevents going below zero)
CREATE OR REPLACE FUNCTION public.debit_credit(p_user_id UUID, p_amount INTEGER)
RETURNS TABLE(credits_remaining INTEGER) AS $$
DECLARE
  current_credits INTEGER;
BEGIN
  SELECT users.credits INTO current_credits
  FROM public.users
  WHERE id = p_user_id
  FOR UPDATE;

  IF current_credits < p_amount THEN
    RAISE EXCEPTION 'Insufficient credits: has %, needs %', current_credits, p_amount;
  END IF;

  UPDATE public.users
  SET credits = users.credits - p_amount,
      updated_at = NOW()
  WHERE id = p_user_id;

  RETURN QUERY
  SELECT users.credits AS credits_remaining FROM public.users WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
