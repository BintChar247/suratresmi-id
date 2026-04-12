# SuratResmi.Online — QA Test Suite

Comprehensive test suite for PDF generation and letter quality assurance. Tests validate letter content, PDF format, and Indonesian language compliance across 30+ document subtypes.

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Environment Variables

Create a `.env.local` file with:

```env
# API endpoint (default: http://localhost:3002)
TEST_API_URL=http://localhost:3002

# Supabase authentication token (Bearer token from your test account)
TEST_AUTH_TOKEN=your_supabase_bearer_token_here
```

#### Getting a Bearer Token

1. Sign in to your Supabase account via the app
2. Open browser DevTools → Network tab
3. Make any authenticated request
4. Copy the `Authorization: Bearer ...` header
5. Paste the token value into `TEST_AUTH_TOKEN`

### 3. Start the Dev Server

```bash
npm run dev
```

The server will start on `http://localhost:3002` (or next available port).

## Running Tests

### Run All QA Tests

```bash
npm run test:qa
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Run Specific Test

```bash
npx jest --testNamePattern="kuasa_stnk — Basic"
```

### Run with Coverage

```bash
npx jest --coverage tests/pdf-qa.test.ts
```

## Test Coverage

### Document Types (30+ subtypes)

- **Surat Kuasa** (Power of Attorney)
  - kuasa_stnk — Vehicle registration proxy
  - kuasa_stnk_perj — Vehicle proxy + employment contract
  - kuasa_jual_tanah — Land sale proxy
  - kuasa_istimewa — Special power of attorney
  - kuasa_pencairan_asuransi — Insurance claim proxy
  - kuasa_notaris — Notary representation proxy
  - kuasa_bpkb — Vehicle ownership certificate proxy

- **Surat Jual Beli** (Sales Agreements)
  - surat_jual_beli_tanah — Land sale
  - surat_jual_beli_barang — Goods sale
  - surat_jual_beli_kendaraan — Vehicle sale
  - surat_jual_beli_rumah — House sale

- **Perjanjian Kerja** (Employment Agreements)
  - perj_kerja_tetap — Permanent employment
  - perj_kerja_kontrak — Fixed-term contract
  - perj_kerja_magang — Internship
  - perj_kerja_lepas — Freelance/independent contractor
  - perj_kerja_paruh_waktu — Part-time employment
  - perj_pengakhiran_kerja — Termination agreement

- **Perjanjian Sewa** (Rental Agreements)
  - perj_sewa_rumah — House rental
  - perj_sewa_toko — Commercial space rental

- **Perjanjian Utang** (Debt Agreements)
  - perj_utang_pribadi — Personal loan
  - perj_utang_bisnis — Business loan
  - perj_utang_dengan_bunga — Loan with interest
  - perj_utang_tanpa_bunga — Zero-interest loan
  - perj_cicilan — Installment plan

- **Surat Pernyataan** (Statements/Declarations)
  - surat_pernyataan_tanggung_jawab — Statement of responsibility
  - surat_pernyataan_janda — Widow declaration
  - surat_pernyataan_penghasilan — Income declaration
  - surat_pernyataan_tidak_punya_hutang — Non-debt declaration
  - surat_rekomendasi — Recommendation letter
  - surat_keterangan_kerja — Work verification letter

### Validation Checks per Test

For each document type:

1. **Letter Generation** ✅
   - Subtype validation
   - Field parameter passing
   - Non-empty output (100–8000 characters)

2. **Content Validation** ✅
   - Expected keywords present
   - Forbidden content absent (`ERROR`, `null`, `{{`)
   - Indonesian language (no excessive English)
   - No code blocks or markdown

3. **PDF Generation** ✅
   - HTTP 200 OK response
   - Correct MIME type (`application/pdf`)
   - Valid PDF structure (magic bytes `%PDF`)
   - File size 1KB–500KB
   - Watermark on free tier
   - Materai placement notice

4. **Metadata Validation** ✅
   - Input data correctly reflected in output
   - Field substitution working
   - No PII leakage (names, IDs match input)

## Example: Running a Single Document Type

```bash
# Run only kuasa_stnk tests
npx jest --testNamePattern="kuasa_stnk"

# Run only Surat Jual Beli tests
npx jest --testNamePattern="surat_jual_beli"

# Run only basic employment contract tests
npx jest --testNamePattern="perj_kerja_tetap"
```

## Troubleshooting

### `TEST_AUTH_TOKEN` Error

**Problem:** `TEST_AUTH_TOKEN environment variable required`

**Solution:** 
1. Get your Supabase session token (see "Getting a Bearer Token" above)
2. Add to `.env.local`: `TEST_AUTH_TOKEN=your_token`
3. Restart tests

### 401 Unauthorized

**Problem:** Tests fail with `401 Unauthorized`

**Solution:**
- Token may have expired (valid ~1 hour)
- Refresh by signing in again and copying new token
- Check `TEST_API_URL` matches running server

### Insufficient Credits

**Problem:** Tests fail mid-run with credit error

**Solution:**
- Each test consumes 1 credit
- Buy credits via dashboard or use admin endpoint to reset test account
- Or use a test account with seeded credits

### Port Already in Use

**Problem:** `Port 3000 is in use`

**Solution:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use TEST_API_URL environment variable
TEST_API_URL=http://localhost:3002 npm run test:qa
```

## Adding New Test Cases

Edit `tests/pdf-qa.test.ts`:

```typescript
{
  name: 'my_subtype — Description',
  subtype: 'my_subtype',
  input: {
    field_1: 'value 1',
    field_2: 'value 2',
    // ... all required fields from template
  },
  expectedKeywords: ['KEYWORD1', 'KEYWORD2'],
  requiresMaterai: true,
  mustNotContain: ['ERROR', 'undefined'],
},
```

Then run:
```bash
npm run test:qa
```

## Performance Notes

- Each test takes ~3–5 seconds (API latency + PDF generation)
- 30 tests ≈ 2–3 minutes total runtime
- Parallel test execution disabled to avoid rate limiting
- Timeout: 60 seconds per test (adjustable in `jest.config.js`)

## Continuous Integration

To run in CI (GitHub Actions, GitLab CI, etc.):

```bash
# Install dependencies
npm ci

# Run QA suite
TEST_API_URL=http://localhost:3002 \
TEST_AUTH_TOKEN=$SUPABASE_TEST_TOKEN \
npm run test:qa

# Generate coverage report
npm run test:qa -- --coverage
```

## Audit & Compliance

Test results are automatically logged to:
- `audit_log` table (successes + anomalies)
- `letters` table (generated content)
- `transactions` table (credit usage)

Query recent test runs:
```sql
SELECT action, count(*) as cnt
FROM audit_log
WHERE created_at > now() - interval '1 hour'
GROUP BY action;
```

## References

- [jsPDF Documentation](https://github.com/parallax/jsPDF)
- [Jest Testing Guide](https://jestjs.io/)
- [Supabase Authentication](https://supabase.com/docs/guides/auth)
