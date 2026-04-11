import { supabase } from './supabase';

export async function signInWithGoogle(): Promise<void> {
  await supabase.auth.signInWithOAuth({ provider: 'google' });
}

export async function signInWithMagicLink(email: string): Promise<void> {
  await supabase.auth.signInWithOtp({ email });
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}

export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}
