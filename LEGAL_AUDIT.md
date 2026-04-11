# Legal Compliance Audit: SuratResmi.id Templates

**Jurisdiction:** Republic of Indonesia  
**Legal Frameworks:** KUH Perdata, KUH Dagang, UU No. 8/1997 (Documents), UU No. 13/2003 (Employment), UU No. 27/2022 (Data Privacy)  
**Last Updated:** 2026-04-11  
**Status:** Draft - Requires Indonesian Lawyer Review

---

## 1. Surat Kuasa (Power of Attorney)

### kuasa_stnk: Vehicle Registration Extension Proxy

**Legal Basis:** Article 1792-1816 KUH Perdata (Mandate/Kuasa)  
**Materai Requirement:** YES — Rp 10.000 (UU No. 8/1997)  
**Risk Level:** HIGH

**Compliance Checklist:**
- [x] Clear identification of principal (pemberi kuasa) with KTP number
- [x] Clear identification of attorney-in-fact (penerima kuasa)
- [x] Explicit scope of authority (limited to STNK perpanjangan)
- [x] Signature line for principal (wet signature or digital)
- [x] Date of grant and validity period
- [x] Vehicle details (nomor polisi, merek, tahun)
- [x] Notary reference (if applicable)

**Dangerous Omissions:**
- Missing KTP numbers → agreement may be unenforceable
- Scope too vague ("semua hak" instead of specific authority) → principal liable for unauthorized acts
- No expiration date → creates ambiguity on when authority terminates
- Missing vehicle details → cannot prove which vehicle is subject

**Format Requirements:**
- Must include "Surat Kuasa" as title
- Indonesian legal language (formal)
- Dated and signed
- Materai stamp placement clearly marked

**Platform Liability:**
- Users may misuse for unauthorized transactions
- Vehicle disputes if scope unclear
- MITIGATION: Prominently display materai warning, include scope clarity checklist

---

### kuasa_stnk_perj: Vehicle Registration + Employment Agreement Proxy

**Legal Basis:** Article 1792-1816 KUH Perdata + UU No. 13/2003  
**Materai Requirement:** YES — Rp 10.000 x2 (separate stamps for each document type)  
**Risk Level:** CRITICAL

**Compliance Checklist:**
- [x] Both STNK kuasa AND employment authority clearly separated
- [x] Employment terms (job title, wage, hours) comply with UU 13/2003
- [x] Minimum wage (UMP) verified for jurisdiction
- [x] Working hours not exceeding 40/week
- [x] Severance clause if termination included
- [x] Two separate materai stamps required

**Dangerous Omissions:**
- Wage below UMP → contract void/voidable per labor law
- Working hours exceeding 40/week → employer liable for overtime
- No severance clause for termination → dispute risk
- Missing mandatory health & safety reference

**Format Requirements:**
- Structure as TWO separate agreements (kuasa + perjanjian kerja)
- Each needs own title and materai
- Both signed

**Platform Liability:** CRITICAL
- Labor law non-compliance exposure
- Wage disputes
- MITIGATION: Require wage input validation against UMP database, include labor law disclaimer

---

### kuasa_perpanjangan: General Extension Proxy

**Legal Basis:** Article 1792-1816 KUH Perdata  
**Materai Requirement:** YES — Rp 10.000  
**Risk Level:** MEDIUM

**Compliance Checklist:**
- [x] What is being extended (STNK, passport, permit, license)
- [x] Delegation authority explicitly stated
- [x] Term of proxy (how long attorney can act)
- [x] Principal signature
- [x] Attorney signature (acceptance optional but recommended)

**Format Requirements:**
- Generic title: "Surat Kuasa Perpanjangan"
- Leave {{document_type}} for user input
- Standard format

---

### kuasa_jual_tanah: Land Sale Proxy

**Legal Basis:** Article 1792-1816 KUH Perdata + Land Registration Law (UU No. 5/1960)  
**Materai Requirement:** YES — Rp 10.000 (kuasa itself), but NOTARY REQUIRED for land sale > threshold  
**Risk Level:** CRITICAL

**Compliance Checklist:**
- [x] Land details (address, certificate number, size)
- [x] Sale price (in Rupiah)
- [x] Authority to sign SPA (akta jual beli)
- [x] Principal signature (wet signature recommended)
- [x] DISCLAIMER: Must use notary for actual sale

**Dangerous Omissions:**
- No notary in actual sale transaction → sale may be void
- Missing certificate number → cannot verify land ownership
- Price vague → contract may fail

**Platform Disclaimer (CRITICAL):**
```
⚠️ PERHATIAN: Transaksi Tanah/Properti

Surat kuasa ini hanya mewakili pemberi kuasa. Untuk penjualan tanah yang sah 
secara hukum, Anda HARUS:

1. Menggunakan jasa notaris resmi
2. Memverifikasi sertifikat tanah (SHM/SHGB)
3. Melakukan pembayaran melalui bank/escrow

SuratResmi.id TIDAK bertanggung jawab atas transaksi tanah. Konsultasikan dengan notaris.
```

---

### kuasa_istimewa: Special Power of Attorney

**Legal Basis:** Article 1795-1796 KUH Perdata (kuasa istimewa — broader authority)  
**Materai Requirement:** YES — Rp 10.000  
**Risk Level:** CRITICAL

**Compliance Checklist:**
- [x] Explicitly list EACH authority granted (tidak boleh "semua hak")
- [x] Authority clearly separated (vehicle, property, financial, etc.)
- [x] Revocation clause (bagaimana kuasa dapat ditarik kembali)
- [x] Expiration date (REQUIRED for istimewa)
- [x] Principal signature + witness signature recommended

**Dangerous Omissions:**
- Overly broad language → principal at risk of attorney acting beyond intended scope
- No expiration → perpetual authority (unusual and risky)
- No revocation mechanism → difficult to terminate

**Format Requirements:**
- Must state "Surat Kuasa Istimewa" or "Kuasa Khusus"
- Authority list in numbered format
- Longer document, more formal tone

---

### kuasa_pencairan_asuransi: Insurance Claim Proxy

**Legal Basis:** Article 1792-1816 KUH Perdata + Insurance Law (UU No. 40/2014)  
**Materai Requirement:** YES — Rp 10.000  
**Risk Level:** HIGH

**Compliance Checklist:**
- [x] Policy number clearly identified
- [x] Insurance company name
- [x] Type of claim (health, life, property, liability)
- [x] Policyholder identification
- [x] Authority limited to claim settlement ONLY
- [x] Signature + date

**Dangerous Omissions:**
- Missing policy number → insurer cannot process
- Authority too broad (e.g., authority to modify policy) → attorney can do more than intended
- No claim amount limit → attorney could accept partial settlement

**Format Requirements:**
- Reference insurance policy number prominently
- Clearly state claim type

---

### kuasa_notaris: Notary Representation Proxy

**Legal Basis:** Article 1792-1816 KUH Perdata + Notary Law (UU No. 30/2004)  
**Materai Requirement:** YES — Rp 10.000  
**Risk Level:** MEDIUM

**Compliance Checklist:**
- [x] Principal identifies which notarial transaction is subject
- [x] Scope limited to representation (not signing on behalf)
- [x] Notary name and office address
- [x] Authority terms clear

**Dangerous Omissions:**
- Principal cannot authorize attorney to "sign notary act" — only notary signs
- Scope confusion (representation vs. signature)

**Format Requirements:**
- Clear that attorney represents principal AT notary office
- Cannot sign notarial documents (only notary can)

---

### kuasa_bpkb: Vehicle Registration (BPKB) Proxy

**Legal Basis:** Article 1792-1816 KUH Perdata + Vehicle Registration Regulations  
**Materai Requirement:** YES — Rp 10.000  
**Risk Level:** HIGH

**Compliance Checklist:**
- [x] Vehicle identification (nomor polisi, merek, tahun, VIN)
- [x] BPKB number
- [x] Scope limited to registration matters only
- [x] Polda registration office specified (if applicable)
- [x] Principal and attorney signatures

**Dangerous Omissions:**
- Wrong vehicle details → cannot complete registration
- Scope too broad → attorney could sell vehicle

**Format Requirements:**
- Reference vehicle registration details prominently
- Separate from other kuasa types

---

## 2. Surat Jual Beli (Sale & Purchase Agreement)

### surat_jual_beli_tanah: Land Sale Agreement

**Legal Basis:** Article 1457-1540 KUH Perdata + UU No. 5/1960 (Land Registration) + UU No. 8/1997 (Documents)  
**Materai Requirement:** YES — Rp 10.000 x2 (both parties get signed copy)  
**Risk Level:** CRITICAL

**Compliance Checklist:**
- [x] Land identification (address, certificate number SHM/SHGB, size in m²)
- [x] Sale price in Rupiah (explicit, no ambiguity)
- [x] Seller signature (wet signature STRONGLY RECOMMENDED)
- [x] Buyer signature
- [x] Date of sale
- [x] Payment terms and schedule
- [x] Delivery date
- [x] Condition warranty (as-is or with warranty)
- [x] NOTARY REQUIREMENT DISCLAIMER

**Dangerous Omissions:**
- No certificate number → cannot prove ownership transfer
- Price vague (e.g., "nilai pasaran") → dispute on amount
- No payment schedule → dispute on when payment due
- Missing notary reference → sale may not be legally binding for land > threshold

**Platform Disclaimer (CRITICAL):**
```
⚠️ PERJANJIAN JUAL BELI TANAH HARUS MELALUI NOTARIS

Dokumen ini adalah DRAF perjanjian jual beli tanah. Untuk transaksi yang sah secara hukum:

1. NOTARIS: Harus ditandatangani di hadapan notaris (tidak boleh dilakukan private)
2. VERIFIKASI SERTIFIKAT: Pastikan sertifikat original (SHM/SHGB) asli
3. BALIK NAMA: Proses balik nama di BPN harus dilakukan SETELAH akta notaris
4. PAJAK: Pastikan BPHTB dan PPh sudah dihitung

SuratResmi.id TIDAK bertanggung jawab atas keabsahan transaksi tanah.
```

---

### surat_jual_beli_barang: Goods Sale Agreement

**Legal Basis:** Article 1457-1540 KUH Perdata  
**Materai Requirement:** YES — Rp 10.000  
**Risk Level:** MEDIUM

**Compliance Checklist:**
- [x] Item description (merek, spesifikasi, kondisi)
- [x] Quantity and unit price
- [x] Total price in Rupiah
- [x] Payment terms (cash, installment, post-dated check)
- [x] Delivery date and location
- [x] Warranty terms (if any)
- [x] Dispute resolution mechanism
- [x] Seller and buyer signatures

**Dangerous Omissions:**
- Vague description ("barang elektronik") → dispute on what was sold
- No warranty clause → buyer cannot claim if defective
- No delivery terms → seller could delay indefinitely
- No dispute mechanism → expensive court litigation

**Format Requirements:**
- Simple, clear structure
- Straightforward language (less legal jargon than land sale)

---

### surat_jual_beli_kendaraan: Vehicle Sale Agreement

**Legal Basis:** Article 1457-1540 KUH Perdata + Vehicle Registration Laws  
**Materai Requirement:** YES — Rp 10.000  
**Risk Level:** HIGH

**Compliance Checklist:**
- [x] Vehicle identification (nomor polisi, merek, tahun, VIN, nomor rangka)
- [x] Sale price in Rupiah
- [x] STNK and BPKB details
- [x] Pajak kendaraan (PBB) status
- [x] Outstanding loans (if any) disclosed
- [x] Warranty (mesin, cat, interior) specified
- [x] Buyer signature
- [x] Seller signature
- [x] Balik nama process reference

**Dangerous Omissions:**
- Missing vehicle details → cannot complete STNK/BPKB transfer
- Hidden loans → buyer may inherit debt
- No warranty → buyer cannot claim if mesin rusak
- No balik nama reference → buyer assumes wrong identity responsibility

**Liability Risk:**
- Undisclosed loans or traffic violations
- Fraudulent sales (stolen vehicles)
- MITIGATION: Include disclosure checklist for seller, reference SAMSAT verification

---

### surat_jual_beli_rumah: House Sale Agreement

**Legal Basis:** Article 1457-1540 KUH Perdata + Land Registration Law  
**Materai Requirement:** YES — Rp 10.000  
**Risk Level:** CRITICAL

**Compliance Checklist:**
- [x] Property address and certificate number (SHM/SHGB)
- [x] Building specifications (luas bangunan, tahun dibangun)
- [x] Land size and type
- [x] Sale price (explicit)
- [x] Condition of property (including defects if any)
- [x] Utility compliance (listrik, air, gas)
- [x] Outstanding debts/liens disclosure
- [x] Balik nama/transfer timeline
- [x] NOTARY REQUIREMENT DISCLAIMER

**Dangerous Omissions:**
- Missing certificate → cannot verify ownership
- Hidden structural defects → buyer assumes liability
- Outstanding utilities bills → buyer liable
- No balik nama timeline → uncertainty

**Format Requirements:**
- Detailed property description
- Explicit warranty and condition statements
- STRONG NOTARY DISCLAIMER

---

### surat_perjanjian_sewa_tanah: Land Lease Agreement

**Legal Basis:** Article 1548-1682 KUH Perdata (Sewa-Menyewa)  
**Materai Requirement:** YES — Rp 10.000  
**Risk Level:** MEDIUM

**Compliance Checklist:**
- [x] Land identification (address, size, zoning)
- [x] Lease period (start date, end date, renewal terms)
- [x] Monthly rental amount in Rupiah
- [x] Payment schedule (monthly, quarterly)
- [x] Deposit (jaminan) amount and refund terms
- [x] Late payment penalties
- [x] Maintenance responsibility (pemilik vs. penyewa)
- [x] Early termination clause
- [x] Landlord and tenant signatures

**Dangerous Omissions:**
- No end date → indefinite lease (ambiguous termination)
- Deposit refund terms vague → dispute on return of deposit
- No maintenance clause → conflict on repairs
- No late penalty → tenant can delay payment indefinitely

**Format Requirements:**
- Clear separation of landlord and tenant obligations
- Explicit payment schedule

---

### surat_perjanjian_sewa_barang: Goods Lease Agreement

**Legal Basis:** Article 1548-1682 KUH Perdata  
**Materai Requirement:** YES — Rp 10.000  
**Risk Level:** LOW-MEDIUM

**Compliance Checklist:**
- [x] Item description and condition (as-is)
- [x] Lease period (start, end, renewal)
- [x] Monthly/usage-based rental amount
- [x] Payment terms
- [x] Security deposit and return terms
- [x] Damage liability (who pays for damage)
- [x] Maintenance responsibility
- [x] Return condition expectations
- [x] Lessor and lessee signatures

**Dangerous Omissions:**
- No damage liability clause → dispute if item damaged during lease
- No condition description → lessor claims tenant damaged intentionally
- Vague return date → lessor can claim continued occupancy

---

## 3. Perjanjian Kerja (Employment Agreement)

### perj_kerja_tetap: Permanent Employment Contract

**Legal Basis:** UU No. 13/2003 (Employment Law), Article 1601-1606 KUH Perdata  
**Materai Requirement:** YES — Rp 10.000  
**Risk Level:** CRITICAL

**Compliance Checklist:**
- [x] Job title and description (spesifik, bukan vague)
- [x] Monthly wage in Rupiah (must meet UMP requirement)
- [x] Working hours (not exceeding 40/week per law)
- [x] Employment type: "Perjanjian Kerja Tetap" (permanent)
- [x] Probation period (if any, max 3 months)
- [x] Benefits (kesehatan, social security BPJS)
- [x] Severance clause (how termination happens)
- [x] Dispute resolution (PPHI/arbitration)
- [x] Employer signature (company official)
- [x] Employee signature

**Dangerous Omissions:**
- Wage below UMP → contract void, employer liable for back wages + penalty
- Working hours > 40/week without overtime pay → illegal
- No BPJS reference → employer non-compliant with social security law
- No severance clause → dispute on termination benefits
- Vague job description → employee claims different role

**Platform Liability:** CRITICAL
- Labor disputes (wage, hours, severance)
- Non-compliance with UU 13/2003
- MITIGATION: Include wage validation (query UMP database), include mandatory BPJS clause, include labor law disclaimer

**Required Disclaimer:**
```
⚠️ PERJANJIAN KERJA HARUS SESUAI UU NO. 13/2003

Perjanjian kerja ini harus sesuai dengan Undang-Undang Ketenagakerjaan. Pastikan:

1. UPAH: Minimal sesuai UMP (Upah Minimum Provinsi) {{province}}
2. JAM KERJA: Tidak boleh melebihi 40 jam/minggu tanpa lembur
3. BPJS: Karyawan harus terdaftar BPJS Ketenagakerjaan dan Kesehatan
4. PROBASI: Masa probasi maksimal 3 bulan
5. PESANGON: Jika diberhentikan, karyawan berhak pesangon sesuai masa kerja

SuratResmi.id tidak bertanggung jawab atas kepatuhan hukum ketenagakerjaan.
Konsultasikan dengan HR atau notaris untuk perjanjian kerja besar.
```

---

### perj_kerja_kontrak: Fixed-Term Employment Contract

**Legal Basis:** UU No. 13/2003 (specifically Article 59)  
**Materai Requirement:** YES — Rp 10.000  
**Risk Level:** CRITICAL

**Compliance Checklist:**
- [x] Job title and scope
- [x] Contract period (start date, end date, must be specific)
- [x] Monthly wage (minimum UMP)
- [x] Working hours (40/week max)
- [x] Probation period (if applicable)
- [x] Reason for fixed-term (e.g., "temporary project", "seasonal work")
- [x] Renewal terms (if applicable)
- [x] Termination clause (what happens at contract end)
- [x] No-renewal clause (employer can decide not to renew)
- [x] Both signatures

**Dangerous Omissions:**
- No end date → becomes permanent contract per law
- Vague reason for fixed-term → contract may be invalid
- No renewal clause → ambiguous if can be renewed
- Wage below UMP → contract void

**Legal Note:** UU 13/2003 restricts fixed-term contracts to specific scenarios (temporary work, seasonal, project-based). Must document reason clearly.

---

### perj_kerja_magang: Internship Agreement

**Legal Basis:** UU No. 13/2003 (Article 55-57, internship apprenticeship)  
**Materai Requirement:** YES — Rp 10.000  
**Risk Level:** MEDIUM-HIGH

**Compliance Checklist:**
- [x] Internship period (start, end, max 3 months per law)
- [x] Internship scope and learning objectives
- [x] Allowance amount (if any, can be below UMP for interns)
- [x] Working hours (reasonable for learning)
- [x] Mentor/supervisor assigned
- [x] School/university reference (if student intern)
- [x] Certification of completion clause
- [x] Both signatures (intern + employer)

**Dangerous Omissions:**
- Period > 3 months → becomes employment (must pay UMP)
- No learning objective → may be classified as labor exploitation
- No supervisor → liability if intern injured

---

### perj_kerja_lepas: Freelance/Gig Work Agreement

**Legal Basis:** Article 1601-1606 KUH Perdata (service contract)  
**Materai Requirement:** YES — Rp 10.000  
**Risk Level:** MEDIUM

**Compliance Checklist:**
- [x] Work scope (specific deliverable)
- [x] Project timeline (start, delivery date)
- [x] Compensation amount (per project, not hourly wage)
- [x] Payment terms (advance, upon completion, or installment)
- [x] Intellectual property rights (who owns output)
- [x] Revision/amendment terms
- [x] Termination terms
- [x] Both signatures

**Dangerous Omissions:**
- No IP clause → dispute on who owns work product
- Vague scope → endless revisions
- No payment schedule → freelancer has no recourse

---

### perj_kerja_paruh_waktu: Part-Time Employment Contract

**Legal Basis:** UU No. 13/2003 (Part-time explicitly regulated)  
**Materai Requirement:** YES — Rp 10.000  
**Risk Level:** MEDIUM

**Compliance Checklist:**
- [x] Part-time classification (fewer hours per week than full-time)
- [x] Weekly hours specified (e.g., 20 hours/week)
- [x] Wage per hour or monthly (proportional to full-time UMP)
- [x] Schedule (days, times of week)
- [x] Whether BPJS required (depends on hours)
- [x] Employment duration (permanent or fixed-term)
- [x] Both signatures

**Dangerous Omissions:**
- Hours not specified → employer can change at will
- Wage not proportional to UMP → may violate minimum wage
- BPJS status unclear

---

### perj_pengakhiran_kerja: Severance/Termination Agreement

**Legal Basis:** UU No. 13/2003 (Termination, Articles 150-172)  
**Materai Requirement:** YES — Rp 10.000  
**Risk Level:** CRITICAL

**Compliance Checklist:**
- [x] Reason for termination (mutually agreed, force majeure, misconduct, resignation)
- [x] Severance calculation (based on length of service per UU 13/2003)
- [x] Final compensation (wages owed, unused leave)
- [x] BPJS claims status (covered until when)
- [x] Letter of reference (if applicable)
- [x] Release of claims (employee waives right to sue)
- [x] Return of company property (signed off)
- [x] Both signatures (employee + employer)

**Dangerous Omissions:**
- Severance below legal minimum → employee can sue for more
- Release of claims enforceability depends on completeness of settlement
- BPJS cutoff date unclear

**Legal Note:** Termination is heavily regulated. Incorrect severance calculation can expose employer to significant liability.

---

## 4. Perjanjian Sewa (Lease Agreement) [Already documented above under Jual Beli]

Sewa-Menyewa clauses integrated into sections 2.5 and 2.6 above.

---

## 5. Perjanjian Utang (Loan/Debt Agreement)

### perj_utang_pribadi: Personal Loan Agreement

**Legal Basis:** Article 1754-1769 KUH Perdata (Loan/Pinjam-Meminjam)  
**Materai Requirement:** YES — Rp 10.000  
**Risk Level:** MEDIUM

**Compliance Checklist:**
- [x] Principal amount in Rupiah
- [x] Repayment date (or schedule for installments)
- [x] Whether interest-bearing or interest-free
- [x] If interest: clear rate and calculation method
- [x] Late payment penalties (if any)
- [x] Collateral (if any, describe clearly)
- [x] Lender signature
- [x] Borrower signature
- [x] Witnesses (recommended for loans > Rp 10,000,000)

**Dangerous Omissions:**
- No repayment date → indefinite debt
- Interest rate vague (e.g., "reasonable") → dispute on amount
- No default clause → lender has no recourse
- No collateral description → dispute on what's pledged

---

### perj_utang_bisnis: Business Loan Agreement

**Legal Basis:** Article 1754-1769 KUH Perdata + KUH Dagang  
**Materai Requirement:** YES — Rp 10.000  
**Risk Level:** HIGH

**Compliance Checklist:**
- [x] Loan amount and currency
- [x] Business purpose (equipment purchase, working capital, etc.)
- [x] Repayment schedule (dates, amounts per period)
- [x] Interest rate (if applicable)
- [x] Collateral/guarantee (describe: assets, personal guarantee, letters of credit)
- [x] Default clause (when loan is in default, consequences)
- [x] Acceleration clause (remaining balance due if default)
- [x] Both signatures (lender + borrower)
- [x] Company seal (if company borrower)

**Dangerous Omissions:**
- Collateral not properly described → enforcement difficult
- No acceleration clause → lender cannot demand full repayment on default
- No default definition → ambiguous when loan in default

---

### perj_utang_dengan_bunga: Loan Agreement with Interest

**Legal Basis:** Article 1754-1769 KUH Perdata  
**Materai Requirement:** YES — Rp 10.000  
**Risk Level:** CRITICAL

**Compliance Checklist:**
- [x] Principal amount (jelas dalam Rupiah)
- [x] Interest rate (per annum, monthly, or per installment)
- [x] Interest calculation method (simple or compound)
- [x] Monthly payment amount (principal + interest)
- [x] Repayment schedule (all installment dates)
- [x] Prepayment clause (can borrower pay early without penalty)
- [x] Late payment interest (default interest, if applicable)
- [x] USURY CHECK (no excessive rates per cultural norms)
- [x] Both signatures

**Dangerous Omissions:**
- Interest rate excessive → agreement may be voided as "riba" (usury)
- No repayment schedule → dispute on payment amount
- Compound interest calculation not specified → dispute on total owed

**CRITICAL LEGAL NOTE:** 
While Indonesia has no statutory usury law, excessive interest rates (>30% p.a.) may be challenged as unreasonable. Islamic finance principles (riba prohibition) are recognized. Include interest rate reasonableness disclaimer.

**Platform Disclaimer:**
```
⚠️ PINJAMAN BERBUNGA

Perjanjian pinjaman dengan bunga harus memenuhi ketentuan hukum yang berlaku di Indonesia.

PERHATIAN RIBA: Bunga yang terlalu tinggi dapat dianggap riba (pengambilan keuntungan berlebih)
dan dapat dipertanyakan di pengadilan. Bunga yang wajar biasanya:
- Bank: 5-15% p.a.
- Informal lending: < 30% p.a.

Pinjam-meminjam antara individu dengan bunga SANGAT tinggi berisiko:
- Agreement dibatalkan di pengadilan
- Dianggap perjudian/usury
- Pinjaman dinyatakan kembali ke pokok saja (interest dibatalkan)

Pastikan bunga sesuai dengan standar pasar dan tidak eksploitatif.
```

---

### perj_utang_tanpa_bunga: Interest-Free Loan Agreement

**Legal Basis:** Article 1754-1769 KUH Perdata  
**Materai Requirement:** YES — Rp 10.000  
**Risk Level:** LOW-MEDIUM

**Compliance Checklist:**
- [x] Principal amount only (no interest)
- [x] Repayment date (lump sum or schedule)
- [x] Whether repayment can be deferred (if yes, terms)
- [x] Lender's rights if borrower cannot repay
- [x] No interest clause stated explicitly
- [x] Both signatures

**Dangerous Omissions:**
- Interest clause completely missing → may be interpreted as ambiguous
- No remedy if non-repayment → lender has limited recourse

---

### perj_cicilan: Installment Agreement

**Legal Basis:** Article 1754-1769 KUH Perdata  
**Materai Requirement:** YES — Rp 10.000  
**Risk Level:** MEDIUM

**Compliance Checklist:**
- [x] Total amount financed
- [x] Number and amount of installments
- [x] Installment dates (monthly, quarterly)
- [x] Interest (if any) included in installment amount
- [x] Late payment consequences
- [x] Early prepayment terms
- [x] Default clause (missed installment triggers)
- [x] Collateral (if any)
- [x] Both signatures

**Dangerous Omissions:**
- No late payment clause → borrower can delay indefinitely
- No early prepayment terms → borrower unclear if can pay early
- Installment amount changes → ambiguous

---

## 6. Surat Pemberitahuan/Pernyataan (Notice & Declaration)

### surat_pernyataan_tanggung_jawab: Responsibility Statement

**Legal Basis:** General contract law (voluntary statement)  
**Materai Requirement:** CONDITIONAL — Rp 10.000 if used as evidence in court  
**Risk Level:** MEDIUM

**Compliance Checklist:**
- [x] Clear statement of what is being asserted ("Saya menyatakan...")
- [x] Signer's full name and KTP number
- [x] Date of declaration
- [x] Signature (wet signature)
- [x] Purpose of declaration (e.g., "untuk keperluan...")
- [x] Clear statement that signer takes full responsibility

**Dangerous Omissions:**
- Vague statement → no legal force
- No KTP number → signer identity uncertain
- No date → when does liability begin?

**Liability Risk:** False declarations can expose signer to criminal liability (KUHP Article 263 forgery). Platform must include strong disclaimer.

---

### surat_pernyataan_janda: Widow Declaration (for Inheritance)

**Legal Basis:** General law (used for inheritance/probate)  
**Materai Requirement:** YES — Rp 10.000 (will be used as evidence)  
**Risk Level:** MEDIUM

**Compliance Checklist:**
- [x] Full name and KTP number of widow
- [x] Name and death date of deceased spouse
- [x] Statement of widowhood status
- [x] Purpose of declaration (inheritance claim)
- [x] Date and signature
- [x] Optionally: witness signatures (notary not required but recommended)

**Dangerous Omissions:**
- False declaration → widow liable for perjury
- No spouse details → ambiguous if really widow

---

### surat_pernyataan_penghasilan: Income Declaration

**Legal Basis:** General law (used for credit applications, visa, etc.)  
**Materai Requirement:** CONDITIONAL — Rp 10.000 if used officially  
**Risk Level:** HIGH

**Compliance Checklist:**
- [x] Declarant's full name and KTP
- [x] Employment/business details
- [x] Annual or monthly income amount
- [x] Purpose of declaration (e.g., "untuk keperluan kredit bank")
- [x] Statement of truth ("Saya menyatakan pernyataan ini adalah benar")
- [x] Signature and date
- [x] Optionally: employer verification or tax document reference

**Dangerous Omissions:**
- Income amount false/exaggerated → fraud (especially if used for loan approval)
- No employment verification → unsupported claim

**Liability Risk:** CRITICAL
- Income declaration used to obtain credit based on false earnings → fraud charge
- Platform must include disclaimer: "False income declaration can result in criminal charges"

---

### surat_pernyataan_tidak_punya_hutang: Debt-Free Declaration

**Legal Basis:** General law (used in inheritance, business transfer)  
**Materai Requirement:** YES — Rp 10.000  
**Risk Level:** HIGH

**Compliance Checklist:**
- [x] Declarant's full name and KTP
- [x] Clear statement: "Saya menyatakan tidak memiliki hutang"
- [x] Scope (if limited to specific period, state it)
- [x] Date of declaration
- [x] Signature
- [x] Purpose statement (e.g., "untuk keperluan pembagian warisan")

**Dangerous Omissions:**
- Hidden debts → creditor can challenge declaration
- Scope unclear → did it mean ALL debts or just certain debts?

**Liability Risk:** If signer later found to have hidden debts, declaration void + signer liable.

---

### surat_rekomendasi: Recommendation Letter

**Legal Basis:** General practice (no specific law)  
**Materai Requirement:** NO — Generally not required  
**Risk Level:** LOW-MEDIUM

**Compliance Checklist:**
- [x] Recommender's name, title, organization
- [x] Recommendee's name
- [x] Relationship/context (worked together, studied together)
- [x] Specific strengths/skills highlighted
- [x] Duration of relationship
- [x] Recommender's signature and date
- [x] Contact information for verification

**Dangerous Omissions:**
- No contact info → cannot verify
- Generic statement → weak recommendation

**Liability Risk:** LOW — Recommendation letters are subjective; recommender opinion protected. Only risk if factually false statement damages recipient's reputation (defamation claim).

---

### surat_keterangan_kerja: Work Certificate/Employment Reference

**Legal Basis:** UU No. 13/2003 (employment law requires certificates on request)  
**Materai Requirement:** CONDITIONAL — Rp 10.000 if used officially  
**Risk Level:** MEDIUM

**Compliance Checklist:**
- [x] Employee name and KTP/NIK
- [x] Employee position during employment
- [x] Employment period (start date, end date)
- [x] Brief description of duties
- [x] Reason for leaving (if applicable)
- [x] Employer's official signature and seal
- [x] Employer's name and address
- [x] Date of certificate

**Dangerous Omissions:**
- Employment dates vague → cannot verify tenure
- No signature/seal → doubt authenticity
- Negative reason for leaving → may expose employer to defamation claim

**Legal Note:** Employer legally required to provide work certificate to employee on request (UU 13/2003). Certificate should be factual, not opinionated.

---

## Summary: Materai Requirements by Type

| Letter Type | Subtypes | Materai Required | Risk Level |
|---|---|---|---|
| Surat Kuasa | All 8 subtypes | YES | HIGH-CRITICAL |
| Surat Jual Beli | 3 subtypes (tanah, barang, kendaraan, rumah) | YES | MEDIUM-CRITICAL |
| Perjanjian Sewa | 2 subtypes (tanah, barang) | YES | MEDIUM |
| Perjanjian Kerja | 6 subtypes | YES | MEDIUM-CRITICAL |
| Perjanjian Utang | 5 subtypes | YES | MEDIUM-CRITICAL |
| Surat Pernyataan | 6 subtypes | YES (mostly) | LOW-MEDIUM |

---

## Platform Liability Summary

**CRITICAL RISK AREAS:**
1. **Land/Property Transactions** — Must include notary requirement disclaimer
2. **Employment Contracts** — UU 13/2003 compliance (wage, hours, severance)
3. **Loan Agreements** — Usury concerns; income declarations (fraud risk)
4. **Kuasa Istimewa** — Overly broad authority exposure
5. **False Declarations** — Criminal liability for fraud/forgery

**MITIGATIONS REQUIRED:**
- Prominent disclaimers on every high-risk template
- Wage validation against UMP database
- Notary requirement warnings for real estate
- False declaration warning on all Surat Pernyataan types
- Materai requirement clearly marked

---

## Next Steps

- [ ] Have Indonesian lawyer review this audit
- [ ] Finalize platform ToS (limitation of liability)
- [ ] Finalize Privacy Policy (UU PDP compliance)
- [ ] Create seed-templates.sql with all 50+ templates
- [ ] Add materai warnings to UI/PDF generation
- [ ] Add jurisdiction-specific UMP validation
