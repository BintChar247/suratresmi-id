import { SupabaseClient } from '@supabase/supabase-js';

export const FREE_TIER_CREDITS = 3;

export const CREDIT_PACKAGES = [
  { id: 'hemat', credits: 5, price_idr: 5000, label: '5 surat' },
  { id: 'standar', credits: 20, price_idr: 15000, label: '20 surat' },
  { id: 'profesional', credits: 50, price_idr: 35000, label: '50 surat' },
] as const;

export async function checkCredits(
  supabase: SupabaseClient,
  userId: string,
  required: number = 1
): Promise<boolean> {
  const { data } = await supabase
    .from('users')
    .select('credits')
    .eq('id', userId)
    .single();

  return (data?.credits ?? 0) >= required;
}

export async function debitCredit(
  supabase: SupabaseClient,
  userId: string,
  amount: number = 1
): Promise<number> {
  const { data } = await supabase.rpc('debit_credit', {
    p_user_id: userId,
    p_amount: amount,
  });

  return data?.credits_remaining ?? 0;
}

export async function creditUser(
  supabase: SupabaseClient,
  userId: string,
  amount: number
): Promise<number> {
  const { data } = await supabase.rpc('credit_user', {
    p_user_id: userId,
    p_amount: amount,
  });

  return data?.credits ?? 0;
}
