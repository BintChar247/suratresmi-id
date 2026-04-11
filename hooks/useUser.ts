'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { User } from '@/types/index';

export function useUser(): { user: User | null; loading: boolean } {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser(): Promise<void> {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.session.user.id)
        .single();

      setUser(data ?? null);
      setLoading(false);
    }

    void fetchUser();
  }, []);

  return { user, loading };
}
