'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createBrowserClient } from '@supabase/auth-helpers-nextjs';
import { useAuth } from '@/lib/auth-context';

type Tab = 'usage' | 'team' | 'invoices' | 'branding';

interface OrgInfo {
  id: string;
  name: string;
  plan: string;
  max_seats: number;
  logo_url: string | null;
  address: string | null;
}

interface TeamMember {
  id: string;
  email: string;
  plan: string;
  last_active: string;
}

interface Invoice {
  id: string;
  amount_idr: number;
  created_at: string;
  status: string;
}

export default function B2BDashboard(): JSX.Element {
  const [tab, setTab] = useState<Tab>('usage');

  const supabaseRef = useRef(
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  );
  const supabase = supabaseRef.current;

  const tabs: { key: Tab; label: string }[] = [
    { key: 'usage', label: 'Penggunaan' },
    { key: 'team', label: 'Tim' },
    { key: 'invoices', label: 'Faktur' },
    { key: 'branding', label: 'Branding' },
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Dashboard Bisnis</h1>

      <div className="flex gap-4 mb-8 border-b">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`pb-2 font-semibold transition-colors ${
              tab === t.key
                ? 'border-b-2 border-primary-500 text-primary-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'usage' && <UsageStats supabase={supabase} />}
      {tab === 'team' && <TeamManagement supabase={supabase} />}
      {tab === 'invoices' && <InvoiceList supabase={supabase} />}
      {tab === 'branding' && <BrandingSettings supabase={supabase} />}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }): JSX.Element {
  return (
    <div className="bg-gray-50 p-4 rounded">
      <p className="text-gray-600 text-sm">{label}</p>
      <p className="text-2xl font-bold">{String(value)}</p>
    </div>
  );
}

function UsageStats({ supabase }: { supabase: ReturnType<typeof createBrowserClient> }): JSX.Element {
  const { user } = useAuth();
  const [letterCount, setLetterCount] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);

  useEffect(() => {
    if (!user) return;

    const fetchUsage = async () => {
      const monthStart = new Date();
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);

      // Count letters generated this month by the user's org members
      const { data: orgUser } = await supabase
        .from('users')
        .select('org_id')
        .eq('id', user.id)
        .single();

      if (!orgUser?.org_id) return;

      const { data: members }: { data: { id: string }[] | null } = await supabase
        .from('users')
        .select('id')
        .eq('org_id', orgUser.org_id);

      if (!members) return;

      const memberIds = members.map((m) => m.id);

      const { count } = await supabase
        .from('letters')
        .select('*', { count: 'exact', head: true })
        .in('user_id', memberIds)
        .gte('created_at', monthStart.toISOString());

      const { data: activeMembers } = await supabase
        .from('users')
        .select('id')
        .eq('org_id', orgUser.org_id)
        .gte('last_active', monthStart.toISOString());

      setLetterCount(count || 0);
      setActiveUsers(activeMembers?.length || 0);
    };

    fetchUsage();
  }, [supabase, user]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Penggunaan Bulan Ini</h2>
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Total Surat" value={letterCount} />
        <StatCard label="Pengguna Aktif" value={activeUsers} />
        <StatCard label="Sisa dari Paket" value="Unlimited" />
      </div>
    </div>
  );
}

function TeamManagement({ supabase }: { supabase: ReturnType<typeof createBrowserClient> }): JSX.Element {
  const { user } = useAuth();
  const [org, setOrg] = useState<OrgInfo | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user) return;

    const fetchTeam = async () => {
      const { data: u } = await supabase
        .from('users')
        .select('org_id')
        .eq('id', user.id)
        .single();

      if (!u?.org_id) return;

      const { data: orgData } = await supabase
        .from('organizations')
        .select('id, name, plan, max_seats, logo_url, address')
        .eq('id', u.org_id)
        .single();

      if (orgData) setOrg(orgData as OrgInfo);

      const { data: teamData } = await supabase
        .from('users')
        .select('id, email, plan, last_active')
        .eq('org_id', u.org_id)
        .order('created_at', { ascending: true });

      setMembers((teamData as TeamMember[]) || []);
    };

    fetchTeam();
  }, [supabase, user]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    if (!org) return;

    if (members.length >= org.max_seats) {
      setMessage(`Batas ${org.max_seats} anggota telah tercapai.`);
      return;
    }

    // Update the invited user's org_id
    const { data: invitedUser, error } = await supabase
      .from('users')
      .update({ org_id: org.id, plan: org.plan === 'enterprise' ? 'b2b_team' : 'b2b_basic' })
      .eq('email', inviteEmail)
      .select('id, email, plan, last_active')
      .single();

    if (error || !invitedUser) {
      setMessage('User tidak ditemukan atau gagal diundang.');
      return;
    }

    setMembers((prev) => [...prev, invitedUser as TeamMember]);
    setMessage(`${inviteEmail} berhasil diundang.`);
    setInviteEmail('');
  };

  const removeMember = async (memberId: string) => {
    await supabase
      .from('users')
      .update({ org_id: null, plan: 'free' })
      .eq('id', memberId);
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Anggota Tim</h2>
      {org && (
        <p className="text-sm text-gray-600 mb-4">
          Paket {org.plan === 'enterprise' ? 'Enterprise' : 'Basic'} ({members.length}/{org.max_seats} tempat)
        </p>
      )}

      <form onSubmit={handleInvite} className="flex gap-2 mb-6">
        <input
          type="email"
          placeholder="Email anggota baru"
          value={inviteEmail}
          onChange={(e) => setInviteEmail(e.target.value)}
          className="border p-2 rounded flex-1"
          required
        />
        <button
          type="submit"
          className="bg-primary-500 text-white px-4 py-2 rounded hover:bg-primary-600 transition-colors"
        >
          Undang
        </button>
      </form>

      {message && <p className="text-sm text-gray-700 mb-4">{message}</p>}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="pb-2">Email</th>
              <th className="pb-2">Role</th>
              <th className="pb-2">Last Active</th>
              <th className="pb-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id} className="border-b">
                <td className="py-2">{m.email}</td>
                <td className="py-2">
                  <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-medium">{m.plan}</span>
                </td>
                <td className="py-2">{new Date(m.last_active).toLocaleDateString('id-ID')}</td>
                <td className="py-2">
                  {m.id !== user?.id && (
                    <button
                      onClick={() => removeMember(m.id)}
                      className="text-red-600 text-xs hover:underline"
                    >
                      Hapus
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function InvoiceList({ supabase }: { supabase: ReturnType<typeof createBrowserClient> }): JSX.Element {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    if (!user) return;

    const load = async () => {
      const { data } = await supabase
        .from('transactions')
        .select('id, amount_idr, created_at, status')
        .eq('user_id', user.id)
        .eq('type', 'purchase')
        .eq('status', 'success')
        .order('created_at', { ascending: false });
      setInvoices((data as Invoice[]) || []);
    };
    load();
  }, [supabase, user]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Faktur & Pembayaran</h2>
      {invoices.length === 0 ? (
        <p className="text-gray-500">Belum ada faktur.</p>
      ) : (
        <div className="space-y-2">
          {invoices.map((inv) => (
            <div key={inv.id} className="border p-4 rounded flex justify-between items-center">
              <div>
                <p className="font-medium">
                  Invoice {new Date(inv.created_at).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                </p>
                <p className="text-sm text-gray-600">Rp {(inv.amount_idr || 0).toLocaleString('id-ID')}</p>
              </div>
              <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs font-medium">
                {inv.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function BrandingSettings({ supabase }: { supabase: ReturnType<typeof createBrowserClient> }): JSX.Element {
  const { user } = useAuth();
  const [orgName, setOrgName] = useState('');
  const [address, setAddress] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [orgId, setOrgId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchOrg = async () => {
      const { data: u } = await supabase
        .from('users')
        .select('org_id')
        .eq('id', user.id)
        .single();

      if (!u?.org_id) return;
      setOrgId(u.org_id);

      const { data: org } = await supabase
        .from('organizations')
        .select('name, address')
        .eq('id', u.org_id)
        .single();

      if (org) {
        setOrgName(org.name || '');
        setAddress(org.address || '');
      }
    };

    fetchOrg();
  }, [supabase, user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    if (!orgId) {
      setMessage('Organisasi tidak ditemukan.');
      return;
    }

    let logoUrl: string | undefined;

    if (logoFile) {
      const ext = logoFile.name.split('.').pop();
      const path = `org-logos/${orgId}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('public')
        .upload(path, logoFile, { upsert: true });

      if (uploadError) {
        setMessage(`Gagal upload logo: ${uploadError.message}`);
        return;
      }

      const { data: urlData } = supabase.storage.from('public').getPublicUrl(path);
      logoUrl = urlData.publicUrl;
    }

    const updates: Record<string, string> = { name: orgName, address };
    if (logoUrl) updates.logo_url = logoUrl;

    const { error } = await supabase
      .from('organizations')
      .update(updates)
      .eq('id', orgId);

    if (error) {
      setMessage(`Gagal menyimpan: ${error.message}`);
      return;
    }

    setMessage('Branding berhasil disimpan.');
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Kop Surat Custom</h2>
      <p className="text-gray-600 mb-4">Upload logo dan alamat perusahaan Anda</p>
      <form onSubmit={handleSave} className="space-y-4 max-w-lg">
        <div>
          <label className="block text-sm font-medium mb-1">Logo Perusahaan (PNG/JPG)</label>
          <input
            type="file"
            className="border p-2 w-full rounded"
            accept="image/png,image/jpeg"
            onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Nama Perusahaan</label>
          <input
            type="text"
            className="border p-2 w-full rounded"
            placeholder="PT. Nama Perusahaan"
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Alamat</label>
          <textarea
            className="border p-2 w-full rounded"
            placeholder="Jl. ... No. ..."
            rows={3}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="bg-primary-500 text-white px-4 py-2 rounded hover:bg-primary-600 transition-colors"
        >
          Simpan
        </button>
        {message && <p className="text-sm text-gray-700 mt-2">{message}</p>}
      </form>
    </div>
  );
}
