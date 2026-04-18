#!/usr/bin/env node
// Bulk SEO cache generator: populates public.seo_cache for every active template.
//
// Reads templates from Supabase, asks Claude Sonnet 4.6 for {meta_title,
// meta_description, example_letter, faq_json}, computes related_subtypes
// deterministically, and upserts one row per template.
//
// Usage:
//   node scripts/generate-seo-cache.mjs                    # all rows, skip existing
//   node scripts/generate-seo-cache.mjs --only kuasa_stnk  # single row (test)
//   node scripts/generate-seo-cache.mjs --force            # overwrite existing
//   node scripts/generate-seo-cache.mjs --dry-run          # no DB writes
//   node scripts/generate-seo-cache.mjs --concurrency 3    # parallel requests

import { readFileSync } from 'node:fs';
import { parseArgs } from 'node:util';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

// ─── Env ─────────────────────────────────────────────────────────────────────

function loadEnvLocal() {
  try {
    const raw = readFileSync(new URL('../.env.local', import.meta.url), 'utf8');
    for (const line of raw.split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
      if (!m) continue;
      const [, k, v] = m;
      if (process.env[k]) continue;
      process.env[k] = v.replace(/^["']|["']$/g, '');
    }
  } catch (e) {
    if (e.code !== 'ENOENT') throw e;
  }
}
loadEnvLocal();

const { ANTHROPIC_API_KEY, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
for (const [k, v] of Object.entries({ ANTHROPIC_API_KEY, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY })) {
  if (!v) {
    console.error(`Missing env var: ${k} (check .env.local)`);
    process.exit(1);
  }
}

// ─── Args ────────────────────────────────────────────────────────────────────

const { values: args } = parseArgs({
  options: {
    only: { type: 'string' },
    force: { type: 'boolean', default: false },
    'dry-run': { type: 'boolean', default: false },
    concurrency: { type: 'string', default: '3' },
    model: { type: 'string', default: 'claude-sonnet-4-6' },
  },
});
const CONCURRENCY = Math.max(1, parseInt(args.concurrency, 10) || 3);

// ─── Clients ─────────────────────────────────────────────────────────────────

const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });
const supabase = createClient(NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ─── Prompt ──────────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `Anda adalah penulis konten SEO dan ahli surat resmi Indonesia untuk SuratResmi.id — platform yang membantu masyarakat Indonesia membuat surat resmi dengan cepat.

Tugas Anda: untuk setiap template surat yang diberikan, menghasilkan konten landing page SEO dalam Bahasa Indonesia berkualitas tinggi. Output akan muncul di halaman publik https://suratresmi.id/surat/<type>/<subtype_id> dan dipindai oleh Google.

## Output yang harus Anda hasilkan (sebagai objek JSON tunggal)

\`\`\`json
{
  "meta_title": "string (50-65 karakter, termasuk kata kunci utama + brand 'SuratResmi.id')",
  "meta_description": "string (140-160 karakter, mengandung CTA dan kata kunci utama, mendorong klik dari SERP)",
  "example_letter": "string (contoh surat LENGKAP, realistis, 400-700 kata, format surat resmi Indonesia)",
  "faq_json": [
    { "question": "string", "answer": "string (2-4 kalimat)" }
    // 5 atau 6 item total
  ]
}
\`\`\`

## Aturan ketat

1. **Bahasa**: Seluruh output dalam Bahasa Indonesia baku. Tidak ada campuran bahasa Inggris kecuali istilah teknis yang memang lazim (mis. "PDF", "download").

2. **Contoh surat (example_letter)**:
   - Format surat resmi Indonesia lengkap: judul, tempat & tanggal pembuatan, identitas pihak, isi (dengan pasal-pasal jika perjanjian), penutup, tanda tangan.
   - Gunakan data PLACEHOLDER yang jelas-jelas fiktif. Contoh nama: "Budi Santoso", "Siti Rahmawati", "Ahmad Fauzi". Alamat: "Jl. Merdeka No. 123, RT 001/RW 002, Kelurahan Cempaka Putih, Kecamatan Menteng, Jakarta Pusat". NIK: "3171012345678901" (format benar, angka acak). Tanggal: tahun 2025 atau 2026.
   - JANGAN menggunakan data asli siapa pun, JANGAN menggunakan merek atau nama perusahaan asli.
   - Panjang wajar: 400-700 kata. Harus terlihat seperti surat asli siap pakai, bukan template dengan {{variabel}}.

3. **FAQ**: 5-6 pertanyaan yang BENAR-BENAR ditanyakan pengguna. Tercakup minimal: (a) apakah perlu materai, (b) syarat sah / legal, (c) siapa yang boleh membuat, (d) apakah berlaku di pengadilan/notaris, (e) apakah harus dibuat oleh notaris. Jawaban ringkas, jelas, dan akurat secara hukum Indonesia.

4. **Larangan keras**:
   - JANGAN memberi nasihat hukum spesifik untuk kasus individu. Sebut "disarankan konsultasi dengan profesional hukum" jika relevan.
   - JANGAN menyertakan URL kecuali suratresmi.id.
   - JANGAN menyertakan kode, tag HTML, atau placeholder seperti {{nama}}.
   - JANGAN menyebut merek platform lain.

5. **SEO**:
   - meta_title mencakup nama surat persis + tahun tidak perlu + "SuratResmi.id". Contoh: "Contoh Surat Kuasa Pengurusan STNK (Gratis) | SuratResmi.id"
   - meta_description harus berisi kata kerja CTA: "Buat", "Unduh", "Gratis", "30 detik". Tepat 140-160 karakter.

## Contoh output lengkap (referensi kualitas)

Input template:
- name_id: Surat Kuasa Pengurusan STNK
- type: kuasa
- subtype_id: kuasa_stnk

Output yang diharapkan (singkatan untuk ruang; contoh sebenarnya LENGKAP):

\`\`\`json
{
  "meta_title": "Contoh Surat Kuasa Pengurusan STNK (Gratis) | SuratResmi.id",
  "meta_description": "Buat Surat Kuasa Pengurusan STNK resmi dalam 30 detik. Contoh lengkap, format benar, langsung jadi PDF. Gratis 3 surat pertama.",
  "example_letter": "SURAT KUASA PENGURUSAN STNK\\n\\nYang bertanda tangan di bawah ini:\\n\\nNama\\t\\t: Budi Santoso\\nNIK\\t\\t: 3171012345678901\\nAlamat\\t: Jl. Merdeka No. 123, RT 001/RW 002, Kelurahan Cempaka Putih, Kecamatan Menteng, Jakarta Pusat\\n\\nSelanjutnya disebut sebagai PEMBERI KUASA.\\n\\nDengan ini memberikan kuasa penuh kepada:\\n\\nNama\\t\\t: Ahmad Fauzi\\nNIK\\t\\t: 3171098765432109\\nAlamat\\t: Jl. Sudirman No. 45, Jakarta Pusat\\n\\nSelanjutnya disebut sebagai PENERIMA KUASA.\\n\\n... [isi surat lengkap 400-700 kata dengan detail kendaraan, maksud pengurusan, penutup, tanda tangan kedua belah pihak] ...",
  "faq_json": [
    { "question": "Apakah Surat Kuasa Pengurusan STNK perlu materai?", "answer": "Ya, sesuai UU Bea Materai No. 10 Tahun 2020, surat kuasa yang digunakan sebagai alat bukti di hadapan instansi resmi wajib dibubuhi materai Rp10.000. Tempelkan materai di atas tanda tangan pemberi kuasa." },
    { "question": "Apakah harus dibuat di hadapan notaris?", "answer": "Tidak wajib. Surat kuasa di bawah tangan yang ditandatangani kedua belah pihak dan dibubuhi materai sudah sah untuk keperluan pengurusan STNK di SAMSAT." },
    { "question": "Siapa yang bisa menjadi penerima kuasa?", "answer": "Siapa pun yang dipercaya pemberi kuasa, biasanya keluarga, teman, atau biro jasa. Pastikan penerima kuasa membawa KTP asli dan salinan KTP pemberi kuasa saat ke SAMSAT." },
    { "question": "Berapa lama surat kuasa berlaku?", "answer": "Secara umum sampai urusan selesai atau dicabut secara tertulis. Sebutkan jangka waktu spesifik di dalam surat agar lebih jelas, misalnya 30 hari sejak tanggal dibuat." },
    { "question": "Dokumen apa saja yang harus dibawa penerima kuasa ke SAMSAT?", "answer": "Surat kuasa bermaterai asli, KTP asli pemberi dan penerima kuasa, STNK asli, BPKB asli, dan bukti pembayaran pajak tahun sebelumnya." }
  ]
}
\`\`\`

## Output Anda

Untuk setiap permintaan, balas HANYA dengan satu blok JSON di dalam fenced code block \`\`\`json ... \`\`\`. Jangan menambahkan teks di luar blok tersebut.`;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function extractJson(text) {
  // Prefer fenced ```json block; fall back to first {...}
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = fenced ? fenced[1] : text;
  const start = candidate.indexOf('{');
  const end = candidate.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('No JSON object in response');
  return JSON.parse(candidate.slice(start, end + 1));
}

function validateSeo(data, subtype) {
  const errs = [];
  if (typeof data.meta_title !== 'string' || data.meta_title.length < 20 || data.meta_title.length > 80) {
    errs.push(`meta_title length ${data.meta_title?.length}`);
  }
  if (typeof data.meta_description !== 'string' || data.meta_description.length < 100 || data.meta_description.length > 180) {
    errs.push(`meta_description length ${data.meta_description?.length}`);
  }
  if (typeof data.example_letter !== 'string' || data.example_letter.length < 400) {
    errs.push(`example_letter length ${data.example_letter?.length}`);
  }
  if (!Array.isArray(data.faq_json) || data.faq_json.length < 3) {
    errs.push(`faq_json count ${data.faq_json?.length}`);
  } else {
    for (const [i, item] of data.faq_json.entries()) {
      if (!item || typeof item.question !== 'string' || typeof item.answer !== 'string') {
        errs.push(`faq_json[${i}] shape`);
      }
    }
  }
  if (errs.length) throw new Error(`Validation failed for ${subtype}: ${errs.join('; ')}`);
  return data;
}

function computeRelated(template, allTemplates) {
  const sameType = allTemplates
    .filter((t) => t.type === template.type && t.subtype_id !== template.subtype_id)
    .map((t) => t.subtype_id)
    .sort();
  return sameType.slice(0, 3);
}

async function generateOne(template, allTemplates) {
  const userContent = `<template>
name_id: ${template.name_id}
type: ${template.type}
subtype_id: ${template.subtype_id}
required_fields: ${JSON.stringify(template.required_fields)}
</template>

Hasilkan konten SEO JSON untuk template di atas, mengikuti skema dan aturan di system prompt.`;

  const message = await anthropic.messages.create({
    model: args.model,
    max_tokens: 16000,
    thinking: { type: 'adaptive' },
    output_config: { effort: 'medium' },
    system: [
      {
        type: 'text',
        text: SYSTEM_PROMPT,
        cache_control: { type: 'ephemeral' },
      },
    ],
    messages: [{ role: 'user', content: userContent }],
  });

  const textBlock = message.content.find((b) => b.type === 'text');
  if (!textBlock) throw new Error(`No text block in response for ${template.subtype_id}`);

  const parsed = extractJson(textBlock.text);
  const validated = validateSeo(parsed, template.subtype_id);

  return {
    seo: validated,
    related: computeRelated(template, allTemplates),
    usage: message.usage,
  };
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`[seo-gen] model=${args.model} concurrency=${CONCURRENCY} dry-run=${args['dry-run']} force=${args.force}${args.only ? ` only=${args.only}` : ''}`);

  const { data: templates, error: tErr } = await supabase
    .from('templates')
    .select('type, subtype_id, name_id, required_fields')
    .eq('is_active', true)
    .order('type')
    .order('subtype_id');
  if (tErr) throw tErr;
  console.log(`[seo-gen] fetched ${templates.length} active templates`);

  const { data: existing } = await supabase.from('seo_cache').select('subtype_id');
  const existingSet = new Set((existing ?? []).map((r) => r.subtype_id));

  let queue = templates;
  if (args.only) queue = queue.filter((t) => t.subtype_id === args.only);
  if (!args.force) queue = queue.filter((t) => !existingSet.has(t.subtype_id));

  if (!queue.length) {
    console.log('[seo-gen] nothing to do (all cached; use --force to regenerate)');
    return;
  }
  console.log(`[seo-gen] will generate ${queue.length} row(s)`);

  const results = { ok: 0, failed: [], tokensIn: 0, tokensOut: 0, tokensCacheRead: 0, tokensCacheWrite: 0 };

  // Sequential kickoff to warm the cache, then parallel.
  const warmup = queue.slice(0, 1);
  const rest = queue.slice(1);

  async function run(template) {
    const label = `${template.type}/${template.subtype_id}`;
    const t0 = Date.now();
    try {
      const { seo, related, usage } = await generateOne(template, templates);
      const row = {
        subtype_id: template.subtype_id,
        example_letter: seo.example_letter,
        meta_title: seo.meta_title,
        meta_description: seo.meta_description,
        faq_json: seo.faq_json,
        related_subtypes: related,
        generated_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      if (!args['dry-run']) {
        const { error } = await supabase.from('seo_cache').upsert(row, { onConflict: 'subtype_id' });
        if (error) throw error;
      }
      results.ok += 1;
      results.tokensIn += usage?.input_tokens ?? 0;
      results.tokensOut += usage?.output_tokens ?? 0;
      results.tokensCacheRead += usage?.cache_read_input_tokens ?? 0;
      results.tokensCacheWrite += usage?.cache_creation_input_tokens ?? 0;
      const ms = Date.now() - t0;
      const cacheNote = usage?.cache_read_input_tokens ? ` [cache=${usage.cache_read_input_tokens}]` : usage?.cache_creation_input_tokens ? ` [cache_write=${usage.cache_creation_input_tokens}]` : '';
      console.log(`  ✓ ${label}  (${ms}ms, in=${usage?.input_tokens}, out=${usage?.output_tokens}${cacheNote})`);
    } catch (e) {
      results.failed.push({ subtype: template.subtype_id, error: e.message });
      console.error(`  ✗ ${label}  ${e.message}`);
    }
  }

  for (const t of warmup) await run(t);

  for (let i = 0; i < rest.length; i += CONCURRENCY) {
    const batch = rest.slice(i, i + CONCURRENCY);
    await Promise.all(batch.map(run));
  }

  console.log('\n[seo-gen] summary');
  console.log(`  ok:            ${results.ok}/${queue.length}`);
  console.log(`  failed:        ${results.failed.length}`);
  console.log(`  tokens in:     ${results.tokensIn} (cache_read ${results.tokensCacheRead}, cache_write ${results.tokensCacheWrite})`);
  console.log(`  tokens out:    ${results.tokensOut}`);
  // Sonnet 4.6 pricing: $3/MTok in, $15/MTok out. cache read ~0.1x, cache write ~1.25x (5-min TTL).
  const cost = ((results.tokensIn / 1e6) * 3) + ((results.tokensOut / 1e6) * 15) + ((results.tokensCacheWrite / 1e6) * 3 * 1.25) + ((results.tokensCacheRead / 1e6) * 3 * 0.1);
  console.log(`  est. cost:     ~$${cost.toFixed(3)}`);
  if (results.failed.length) {
    console.log('\n  failures:');
    for (const f of results.failed) console.log(`    ${f.subtype}: ${f.error}`);
    process.exit(1);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
