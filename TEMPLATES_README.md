# SuratResmi.id Templates — Implementation Guide

## Overview

This directory contains all legal documents, compliance audits, and template seeds for the SuratResmi.id platform (Phase 1, Track B).

**Status:** All files complete; ready for:
1. Indonesian lawyer review (ToS + Privacy Policy)
2. SQL seeding into Supabase
3. Integration into platform UI

---

## Files

### Legal Documents (For Platform)

1. **LEGAL_AUDIT.md** (9,000+ words)
   - Comprehensive compliance audit of all 50+ templates
   - Each template has: Legal basis, materai requirement, dangerous omissions, liability risk
   - 6 main letter types + 30+ subtypes
   - **Action:** Review with Indonesian lawyer before launch

2. **TERMS_OF_SERVICE.md** (5,000+ words)
   - Platform ToS per Indonesian law
   - Sections: Limitation of liability, indemnification, acceptable use, dispute resolution
   - Governing law: Republic of Indonesia, Jakarta jurisdiction
   - **Action:** Have lawyer review before publishing at `/terms`

3. **PRIVACY_POLICY.md** (6,000+ words)
   - UU No. 27/2022 (Indonesian Data Privacy Law) compliant
   - Data retention: 90 days for letter content, 7 years for transactions
   - User rights: Access, correction, deletion, export, opt-out
   - DPO contact: dpo@suratresmi.id
   - **Action:** Publish at `/privacy`; contact DPO email must be monitored

4. **GENERAL_DISCLAIMER.md** (2,000+ words)
   - Disclaimer to display on every generated PDF
   - Also standalone page at `/disclaimer`
   - Warns users to get legal review for high-value transactions
   - Explains materai requirements and notary needs
   - **Action:** Include on every letter PDF (watermark + header)

### SQL Seed Scripts

**How to Run:**

```bash
# In Supabase SQL Editor (one at a time):

-- Step 1: Run Part 1 (Surat Kuasa + Surat Jual Beli)
\i scripts/seed-templates-part1.sql

-- Step 2: Run Part 2 (Perjanjian Kerja + Perjanjian Sewa)
\i scripts/seed-templates-part2.sql

-- Step 3: Run Part 3 (Perjanjian Utang + Surat Pernyataan)
\i scripts/seed-templates-part3.sql
```

**Files:**

1. **seed-templates-part1.sql** (3,500+ lines)
   - Surat Kuasa: 8 subtypes
   - Surat Jual Beli: 4 subtypes

2. **seed-templates-part2.sql** (3,200+ lines)
   - Perjanjian Kerja: 6 subtypes
   - Perjanjian Sewa: 2 subtypes

3. **seed-templates-part3.sql** (2,500+ lines)
   - Perjanjian Utang: 5 subtypes
   - Surat Pernyataan: 6 subtypes

**Total Templates:** 31 subtypes across 6 letter types

---

## Template Breakdown

### 1. Surat Kuasa (Power of Attorney) — 8 subtypes

| Subtype | Purpose | Materai | Risk |
|---------|---------|---------|------|
| kuasa_stnk | Vehicle registration renewal | YES | HIGH |
| kuasa_stnk_perj | Vehicle + employment proxy | YES | CRITICAL |
| kuasa_perpanjangan | General extension | YES | MEDIUM |
| kuasa_jual_tanah | Land sale proxy | YES | CRITICAL |
| kuasa_istimewa | Special PoA (broad authority) | YES | CRITICAL |
| kuasa_pencairan_asuransi | Insurance claim | YES | HIGH |
| kuasa_notaris | Notary representation | YES | MEDIUM |
| kuasa_bpkb | Vehicle registration | YES | HIGH |

### 2. Surat Jual Beli (Sale & Purchase) — 4 subtypes

| Subtype | Purpose | Materai | Risk |
|---------|---------|---------|------|
| surat_jual_beli_tanah | Land sale | YES | **CRITICAL** |
| surat_jual_beli_barang | Goods sale | YES | MEDIUM |
| surat_jual_beli_kendaraan | Vehicle sale | YES | HIGH |
| surat_jual_beli_rumah | House sale | YES | **CRITICAL** |

### 3. Perjanjian Kerja (Employment) — 6 subtypes

| Subtype | Purpose | Materai | Risk |
|---------|---------|---------|------|
| perj_kerja_tetap | Permanent employment | YES | **CRITICAL** |
| perj_kerja_kontrak | Fixed-term contract | YES | **CRITICAL** |
| perj_kerja_magang | Internship | YES | MEDIUM-HIGH |
| perj_kerja_lepas | Freelance/gig | YES | MEDIUM |
| perj_kerja_paruh_waktu | Part-time | YES | MEDIUM |
| perj_pengakhiran_kerja | Severance/termination | YES | **CRITICAL** |

### 4. Perjanjian Sewa (Lease) — 2 subtypes

| Subtype | Purpose | Materai | Risk |
|---------|---------|---------|------|
| perj_sewa_rumah | Residential lease | YES | MEDIUM |
| perj_sewa_toko | Commercial lease | YES | MEDIUM |

### 5. Perjanjian Utang (Loan/Debt) — 5 subtypes

| Subtype | Purpose | Materai | Risk |
|---------|---------|---------|------|
| perj_utang_pribadi | Personal loan | YES | MEDIUM |
| perj_utang_bisnis | Business loan | YES | HIGH |
| perj_utang_dengan_bunga | Loan w/ interest | YES | **CRITICAL** |
| perj_utang_tanpa_bunga | Interest-free loan | YES | LOW-MEDIUM |
| perj_cicilan | Installment agreement | YES | MEDIUM |

### 6. Surat Pernyataan (Declarations) — 6 subtypes

| Subtype | Purpose | Materai | Risk |
|---------|---------|---------|------|
| surat_pernyataan_tanggung_jawab | Responsibility | CONDITIONAL | MEDIUM |
| surat_pernyataan_janda | Widow status | YES | MEDIUM |
| surat_pernyataan_penghasilan | Income | CONDITIONAL | **HIGH** |
| surat_pernyataan_tidak_punya_hutang | Debt-free | YES | HIGH |
| surat_rekomendasi | Recommendation | NO | LOW |
| surat_keterangan_kerja | Work certificate | NO | MEDIUM |

---

## Implementation Checklist

### Phase 1: Legal Review
- [ ] Have Indonesian lawyer review LEGAL_AUDIT.md
- [ ] Have lawyer review TERMS_OF_SERVICE.md
- [ ] Have lawyer review PRIVACY_POLICY.md
- [ ] Get sign-off on GENERAL_DISCLAIMER.md
- [ ] Finalize DPO contact email (dpo@suratresmi.id)

### Phase 2: Database Setup
- [ ] Run seed-templates-part1.sql in Supabase
- [ ] Run seed-templates-part2.sql in Supabase
- [ ] Run seed-templates-part3.sql in Supabase
- [ ] Verify all 31 templates inserted (SELECT COUNT(*) FROM templates)
- [ ] Test template retrieval by type and subtype_id

### Phase 3: UI Integration
- [ ] Display GENERAL_DISCLAIMER.md on every generated letter (watermark on free tier)
- [ ] Add `/terms` page (TERMS_OF_SERVICE.md)
- [ ] Add `/privacy` page (PRIVACY_POLICY.md)
- [ ] Add `/disclaimer` page (GENERAL_DISCLAIMER.md)
- [ ] Add materai warning for templates marked requires_materai=true
- [ ] Add notary requirement warning for land/property templates

### Phase 4: Compliance
- [ ] Set up DPO email monitoring
- [ ] Implement data retention (90-day auto-delete for letters)
- [ ] Implement user rights (data access, deletion, export)
- [ ] Set up audit logging for UU PDP compliance
- [ ] Document data breach response process (72-hour notification)

---

## Database Schema

**Templates Table:**

```sql
CREATE TABLE public.templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,              -- 'kuasa', 'surat_jual', 'perj_kerja', etc.
  subtype_id TEXT NOT NULL UNIQUE, -- 'kuasa_stnk', 'perj_kerja_tetap', etc.
  name_id TEXT NOT NULL,            -- Bahasa Indonesia name
  name_en TEXT,                     -- English name
  required_fields JSONB NOT NULL,  -- Field definitions with validation
  prompt_template TEXT NOT NULL,   -- Claude prompt with {{field}} placeholders
  requires_materai BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Example Query:**

```sql
-- Get all templates for a type
SELECT * FROM templates WHERE type = 'perj_kerja' AND is_active = TRUE;

-- Get specific template
SELECT * FROM templates WHERE subtype_id = 'perj_kerja_tetap';

-- Get all templates requiring materai
SELECT * FROM templates WHERE requires_materai = TRUE;
```

---

## Critical Warnings for Users

**These warnings should be prominently displayed in the UI:**

### 1. Land/Property Transactions
```
⚠️ TRANSAKSI TANAH/PROPERTI HARUS MELALUI NOTARIS
```
- Perjanjian ini adalah DRAF saja
- Harus ditandatangani di hadapan notaris resmi
- BPN tidak akan memproses tanpa akta notaris
- Sertifikat harus diverifikasi original

### 2. Employment Contracts
```
⚠️ PERJANJIAN KERJA HARUS SESUAI UU NO. 13/2003
```
- Upah minimum tidak boleh di bawah UMP setempat
- Jam kerja max 40/minggu
- Karyawan harus terdaftar BPJS
- Severance clause harus included

### 3. Loan Agreements
```
⚠️ BUNGA YANG TERLALU TINGGI BISA DIANGGAP RIBA
```
- Bank bunga: 5-15% p.a.
- Informal: < 30% p.a.
- Pengadilan bisa membatalkan dan kembalikan ke pokok saja

### 4. False Declarations
```
⚠️ PERNYATAAN PALSU = KEJAHATAN
```
- KUHP Pasal 263 (pemalsuan): hingga 2 tahun penjara + Rp 60 juta
- Khususnya: pernyataan penghasilan untuk kredit bank (fraud)

### 5. Materai Requirements
```
⚠️ MATERAI RP 10.000 DIPERLUKAN
```
- Hampir semua kontrak memerlukan materai
- Tanpa materai, dokumen mungkin tidak diakui pengadilan
- Beli di toko buku/kantor pos sebelum pakai

---

## References & Further Reading

### Indonesian Laws Referenced
1. **KUH Perdata** — Civil Code (Articles 1792-1816 for Kuasa, 1457-1540 for Sales, 1548-1682 for Leases)
2. **KUH Dagang** — Commercial Code
3. **UU No. 8/1997** — Law on Documents (materai requirements)
4. **UU No. 13/2003** — Employment Law
5. **UU No. 27/2022** — Personal Data Protection Law (UU PDP)
6. **UU No. 5/1960** — Land Registration Law (Agrarian Law)
7. **KUHP** — Penal Code (Articles 263, 266 for forgery)

### Compliance Contacts
- **OJK** (Financial Services Authority) — if payment-related
- **KPDP** (Komisi Perlindungan Data Pribadi) — data breach reports
- **Dinas Ketenagakerjaan** — employment disputes
- **BPN** (Land Office) — property registration

---

## Next Steps

1. **Immediate (This Week):**
   - Get legal review of ToS + Privacy Policy
   - Seed all 3 SQL parts into Supabase
   - Verify template count and structure

2. **Short-term (Next 2 Weeks):**
   - Integrate disclaimers into UI
   - Add materai warnings for high-risk templates
   - Implement notary requirement notices
   - Test template generation for 5-10 templates

3. **Medium-term (Next Month):**
   - Go-live with Phase 1 (Track B complete)
   - Monitor user feedback on disclaimers
   - Track support tickets for compliance issues
   - Prepare Phase 2 planning

---

## Support

For questions about templates or compliance, contact:
- **Legal:** legal@suratresmi.id
- **DPO:** dpo@suratresmi.id
- **Support:** support@suratresmi.id

---

**Document Version:** 1.0  
**Last Updated:** April 11, 2026  
**Status:** Ready for Implementation
