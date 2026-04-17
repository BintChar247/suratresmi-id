'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createBrowserClient } from '@supabase/auth-helpers-nextjs';


interface Stats {
  mau: number;
  dau: number;
  revenue: number;
  apiCost: number;
  errors: number;
}

interface UserRow {
  id: string;
  email: string;
  credits: number;
  plan: string;
  created_at: string;
  last_active: string;
}

export default function AdminDashboard(): JSX.Element {
  const [stats, setStats] = useState<Stats>({
    mau: 0,
    dau: 0,
    revenue: 0,
    apiCost: 0,
    errors: 0,
  });

  const supabaseRef = useRef(
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  );
  const supabase = supabaseRef.current;

  useEffect(() => {
    const fetchStats = async () => {
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();

      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

      const [dauResult, mauResult, txResult] = await Promise.all([
        supabase
          .from('letters')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', todayStart),
        supabase
          .from('letters')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', oneMonthAgo.toISOString()),
        supabase
          .from('transactions')
          .select('amount_idr')
          .eq('status', 'success')
          .eq('type', 'purchase'),
      ]);

      const revenue = txResult.data?.reduce((a, t) => a + (t.amount_idr || 0), 0) || 0;

      setStats({
        mau: mauResult.count || 0,
        dau: dauResult.count || 0,
        revenue,
        apiCost: Math.round((mauResult.count || 0) * 50),
        errors: 0,
      });
    };

    fetchStats();
  }, [supabase]);

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <KpiCard label="MAU" value={stats.mau} />
        <KpiCard label="DAU" value={stats.dau} />
        <KpiCard label="Revenue" value={`Rp ${stats.revenue.toLocaleString('id-ID')}`} />
        <KpiCard label="API Cost (est)" value={`Rp ${stats.apiCost.toLocaleString('id-ID')}`} />
        <KpiCard label="Errors" value={stats.errors} />
      </div>

      <UserManagement supabase={supabase} />
      <PaymentDisputes supabase={supabase} />
      <ErrorLog />
      <CreditGrants supabase={supabase} />
    </div>
  );
}

function KpiCard({ label, value }: { label: string; value: string | number }): JSX.Element {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <p className="text-gray-600 text-sm">{label}</p>
      <p className="text-2xl font-bold">{String(value)}</p>
    </div>
  );
}

function UserManagement({ supabase }: { supabase: ReturnType<typeof createBrowserClient> }): JSX.Element {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('users')
        .select('id, email, credits, plan, created_at, last_active')
        .order('created_at', { ascending: false })
        .limit(50);
      setUsers((data as UserRow[]) || []);
      setLoading(false);
    };
    load();
  }, [supabase]);

  const updatePlan = async (userId: string, plan: string) => {
    await supabase.from('users').update({ plan }).eq('id', userId);
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, plan } : u)));
  };

  return (
    <section className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">User Management</h2>
      {loading ? (
        <p className="text-gray-500">Memuat...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="pb-2">Email</th>
                <th className="pb-2">Plan</th>
                <th className="pb-2">Credits</th>
                <th className="pb-2">Last Active</th>
                <th className="pb-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b">
                  <td className="py-2">{u.email}</td>
                  <td className="py-2">
                    <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-medium">
                      {u.plan}
                    </span>
                  </td>
                  <td className="py-2">{u.credits}</td>
                  <td className="py-2">{new Date(u.last_active).toLocaleDateString('id-ID')}</td>
                  <td className="py-2 space-x-2">
                    {u.plan !== 'admin' && (
                      <button
                        onClick={() => updatePlan(u.id, 'free')}
                        className="text-red-600 text-xs hover:underline"
                      >
                        Ban
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function PaymentDisputes({ supabase }: { supabase: ReturnType<typeof createBrowserClient> }): JSX.Element {
  const [disputes, setDisputes] = useState<Array<{
    id: string;
    amount_idr: number;
    status: string;
    midtrans_order_id: string | null;
    created_at: string;
  }>>([]);

  useEffect(() => {
    const load = async () => {
      const { data }: { data: typeof disputes | null } = await supabase
        .from('transactions')
        .select('id, amount_idr, status, midtrans_order_id, created_at')
        .in('status', ['failed', 'refunded'])
        .order('created_at', { ascending: false })
        .limit(20);
      setDisputes(data || []);
    };
    load();
  }, [supabase]);

  return (
    <section className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Payment Disputes</h2>
      {disputes.length === 0 ? (
        <p className="text-gray-500">Tidak ada dispute saat ini.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="pb-2">Order ID</th>
                <th className="pb-2">Amount</th>
                <th className="pb-2">Status</th>
                <th className="pb-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {disputes.map((d) => (
                <tr key={d.id} className="border-b">
                  <td className="py-2 font-mono text-xs">{d.midtrans_order_id || d.id.slice(0, 8)}</td>
                  <td className="py-2">Rp {(d.amount_idr || 0).toLocaleString('id-ID')}</td>
                  <td className="py-2">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        d.status === 'refunded' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {d.status}
                    </span>
                  </td>
                  <td className="py-2">{new Date(d.created_at).toLocaleDateString('id-ID')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function ErrorLog(): JSX.Element {
  return (
    <section className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Error Log</h2>
      <p className="text-gray-500">
        Real-time errors from Sentry, sorted by frequency. Connect Sentry SDK to populate this section.
      </p>
    </section>
  );
}

function CreditGrants({ supabase }: { supabase: ReturnType<typeof createBrowserClient> }): JSX.Element {
  const [email, setEmail] = useState('');
  const [credits, setCredits] = useState('');
  const [message, setMessage] = useState('');

  const handleGrant = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    const creditsNum = parseInt(credits, 10);
    if (!email || isNaN(creditsNum) || creditsNum <= 0) {
      setMessage('Email dan jumlah kredit harus valid.');
      return;
    }

    const { data: targetUser } = await supabase
      .from('users')
      .select('id, credits')
      .eq('email', email)
      .single();

    if (!targetUser) {
      setMessage('User tidak ditemukan.');
      return;
    }

    const { error: txError } = await supabase.from('transactions').insert({
      user_id: targetUser.id,
      type: 'grant',
      credits_delta: creditsNum,
      status: 'success',
    });

    if (txError) {
      setMessage(`Gagal: ${txError.message}`);
      return;
    }

    const { error: updateError } = await supabase
      .from('users')
      .update({ credits: targetUser.credits + creditsNum })
      .eq('id', targetUser.id);

    if (updateError) {
      setMessage(`Gagal update credits: ${updateError.message}`);
      return;
    }

    setMessage(`Berhasil memberikan ${creditsNum} kredit ke ${email}.`);
    setEmail('');
    setCredits('');
  };

  return (
    <section className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Grant Credits</h2>
      <form onSubmit={handleGrant} className="space-y-4 max-w-md">
        <input
          type="email"
          placeholder="User Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-full rounded"
          required
        />
        <input
          type="number"
          placeholder="Jumlah Credits"
          value={credits}
          onChange={(e) => setCredits(e.target.value)}
          className="border p-2 w-full rounded"
          min={1}
          required
        />
        <button
          type="submit"
          className="bg-primary-500 text-white px-4 py-2 rounded hover:bg-primary-600 transition-colors"
        >
          Grant
        </button>
        {message && <p className="text-sm text-gray-700">{message}</p>}
      </form>
    </section>
  );
}
