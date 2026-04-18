import type { MetadataRoute } from 'next';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

const SITE_URL = 'https://suratresmi.id';

export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data } = await getSupabaseAdmin()
    .from('templates')
    .select('type, subtype_id, updated_at')
    .eq('is_active', true);

  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/surat`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];

  const templateRoutes: MetadataRoute.Sitemap = (data ?? []).map(
    (t: { type: string; subtype_id: string; updated_at: string }) => ({
      url: `${SITE_URL}/surat/${t.type}/${t.subtype_id}`,
      lastModified: t.updated_at ? new Date(t.updated_at) : now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })
  );

  return [...staticRoutes, ...templateRoutes];
}
