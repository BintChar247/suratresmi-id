# PDF Generation — Quick Start Guide

## 1-Minute Setup

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Server running on `http://localhost:3002` (or next available port).

---

## Generate a Letter + Download PDF

### From the UI

1. Open http://localhost:3002
2. Step 1: Pick letter type (Surat Kuasa, Jual Beli, etc.)
3. Step 2: Pick subtype (kuasa_stnk, surat_jual_beli_tanah, etc.)
4. Step 3: Fill form fields
5. Step 4: Preview → **Unduh PDF**

---

## Test via API

### Get Auth Token

```bash
# Sign in via UI, then open browser DevTools → Network tab
# Copy Authorization: Bearer ... header value
export AUTH_TOKEN="eyJ..."
```

### Generate Letter

```bash
curl -X POST http://localhost:3002/api/generate \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "subtype": "kuasa_stnk",
    "fields": {
      "nama_pemberi_kuasa": "Budi Santoso",
      "nomor_ktp_pemberi": "1234567890123456",
      "alamat_pemberi": "Jl. Merdeka No. 123, Jakarta",
      "nama_penerima_kuasa": "Siti Nurhaliza",
      "nomor_ktp_penerima": "9876543210654321",
      "nomor_polisi": "B 1234 ABC",
      "merek_kendaraan": "Toyota Avanza",
      "tahun_kendaraan": "2020"
    }
  }'
```

**Response:**
```json
{
  "letter": "SURAT KUASA\n\nYang bertanda tangan di bawah ini...",
  "credits_remaining": 47,
  "requires_materai": true,
  "template_name": "Surat Kuasa Perpanjangan STNK"
}
```

### Download PDF

```bash
curl -X POST http://localhost:3002/api/pdf \
  -H "Content-Type: application/json" \
  -d '{
    "letter": "SURAT KUASA\n\nYang bertanda tangan...",
    "letterType": "kuasa",
    "requiresMaterai": true,
    "isFreeUser": false
  }' \
  --output surat.pdf
```

Open `surat.pdf` in your PDF viewer.

---

## Run QA Tests

```bash
# All tests
npm run test:qa

# Watch mode
npm run test:watch

# Specific test
npx jest --testNamePattern="kuasa_stnk"
```

**Requirements:**
- `TEST_AUTH_TOKEN` in `.env.local` (Bearer token from test account)
- `npm run dev` running in parallel
- Sufficient credits (1 per test)

See `tests/README.md` for detailed setup.

---

## Supported Document Types

| Type | Count | Examples |
|------|-------|----------|
| **Surat Kuasa** | 8 | kuasa_stnk, kuasa_istimewa, kuasa_jual_tanah |
| **Surat Jual Beli** | 4 | surat_jual_beli_tanah, surat_jual_beli_kendaraan |
| **Perjanjian Kerja** | 6 | perj_kerja_tetap, perj_kerja_kontrak, perj_magang |
| **Perjanjian Sewa** | 2 | perj_sewa_rumah, perj_sewa_toko |
| **Perjanjian Utang** | 5 | perj_utang_pribadi, perj_cicilan |
| **Surat Pernyataan** | 5 | surat_pernyataan_janda, surat_rekomendasi |

**Total**: 30+ subtypes with comprehensive test coverage.

---

## PDF Features

| Feature | Details |
|---------|---------|
| **Format** | A4 (210×297mm) portrait |
| **Font** | Times New Roman |
| **Multi-page** | Auto page breaks |
| **Watermark** | "DRAF - SuratResmi.Online" (free tier only) |
| **Materai** | Rp 10.000 placement notice (where required) |
| **File Size** | 1KB–500KB |
| **Response** | `Content-Type: application/pdf` with attachment header |

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| **Port 3000 in use** | `lsof -ti:3000 \| xargs kill -9` |
| **401 Unauthorized** | Check `TEST_AUTH_TOKEN` is valid and not expired |
| **Insufficient credits** | Buy credits or reset test account via dashboard |
| **PDF not downloading** | Check `Content-Disposition` header in response |
| **Letter is empty** | Verify all required fields are in request |

---

## Key Files

- **PDF Endpoint**: `app/api/pdf/route.ts` (116 lines)
- **Generate Endpoint**: `app/api/generate/route.ts` (376 lines with security)
- **Frontend Integration**: `components/Wizard/Step3.tsx` (153 lines)
- **QA Tests**: `tests/pdf-qa.test.ts` (808 lines, 30+ tests)
- **Jest Config**: `jest.config.js` (24 lines)

---

## Environment Variables

```env
# .env.local (for testing)
TEST_API_URL=http://localhost:3002
TEST_AUTH_TOKEN=your_supabase_bearer_token

# Already configured
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
ANTHROPIC_API_KEY=...
```

---

## Database Queries

### Recent letter generations
```sql
SELECT COUNT(*) FROM letters WHERE created_at > now() - interval '1 hour';
```

### Test anomalies
```sql
SELECT * FROM audit_log 
WHERE action = 'letter_generate_anomaly' 
AND created_at > now() - interval '1 hour';
```

### Credit usage
```sql
SELECT user_id, SUM(-credits_delta) as credits_used 
FROM transactions 
WHERE created_at > now() - interval '24 hours' 
GROUP BY user_id;
```

---

## Next Steps

- ✅ PDF generation working
- ✅ QA tests automated
- ⬜ Track A: UX enhancements (mobile preview, rich editor)
- ⬜ Track B: API expansion (webhooks, batch, history)

---

**Version**: 1.0 | **Last Updated**: 2026-04-11
