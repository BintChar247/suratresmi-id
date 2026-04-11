-- SuratResmi.id — Template Seeding Script (Part 2 of 2)
-- Run this in Supabase SQL Editor AFTER Part 1
-- Templates: Perjanjian Kerja + Perjanjian Sewa + Perjanjian Utang + Surat Pernyataan

-- ============================================================
-- 3. PERJANJIAN KERJA (Employment Agreements) — 6 subtypes
-- ============================================================

-- 3.1 perj_kerja_tetap: Permanent Employment Contract
INSERT INTO public.templates
(type, subtype_id, name_id, name_en, required_fields, prompt_template, requires_materai)
VALUES (
  'perj_kerja',
  'perj_kerja_tetap',
  'Perjanjian Kerja Tetap',
  'Permanent Employment Contract',
  '[
    {"key":"nama_karyawan","label_id":"Nama Lengkap Karyawan","type":"text","max_length":100,"required":true},
    {"key":"nomor_ktp_karyawan","label_id":"Nomor KTP Karyawan","type":"text","max_length":16,"required":true},
    {"key":"alamat_karyawan","label_id":"Alamat Karyawan","type":"textarea","required":true},
    {"key":"nama_perusahaan","label_id":"Nama Perusahaan","type":"text","max_length":100,"required":true},
    {"key":"alamat_perusahaan","label_id":"Alamat Kantor Perusahaan","type":"textarea","required":true},
    {"key":"jabatan_posisi","label_id":"Jabatan/Posisi Pekerjaan","type":"text","max_length":100,"required":true},
    {"key":"deskripsi_pekerjaan","label_id":"Deskripsi Pekerjaan/Tanggung Jawab","type":"textarea","required":true},
    {"key":"gaji_bulanan","label_id":"Gaji Bulanan (Rp)","type":"number","required":true},
    {"key":"tunjangan_lainnya","label_id":"Tunjangan Lain (Transport, Makan, dll) - Rp","type":"number","required":false},
    {"key":"jam_kerja_mingguan","label_id":"Jam Kerja Per Minggu","type":"number","required":true},
    {"key":"hari_kerja","label_id":"Hari Kerja (Senin-Jumat / Senin-Sabtu)","type":"text","required":true},
    {"key":"masa_probasi_bulan","label_id":"Masa Probasi (bulan, max 3)","type":"number","required":false},
    {"key":"tanggal_mulai_kerja","label_id":"Tanggal Mulai Kerja","type":"date","required":true},
    {"key":"provinsi_lokasi","label_id":"Provinsi Lokasi Kerja (untuk UMP reference)","type":"text","max_length":50,"required":true}
  ]'::jsonb,
  '⚠️ CRITICAL: Perjanjian kerja HARUS sesuai UU No. 13/2003 (Employment Law)

Buatlah perjanjian kerja tetap yang legal dan sesuai undang-undang ketenagakerjaan.

DATA KARYAWAN:
- Nama: {{nama_karyawan}} (KTP: {{nomor_ktp_karyawan}})
- Alamat: {{alamat_karyawan}}

DATA PERUSAHAAN:
- Nama: {{nama_perusahaan}}
- Kantor: {{alamat_perusahaan}}

DETAIL PEKERJAAN:
- Jabatan: {{jabatan_posisi}}
- Deskripsi: {{deskripsi_pekerjaan}}
- Mulai: {{tanggal_mulai_kerja}}

KOMPENSASI:
- Gaji: Rp {{gaji_bulanan}}/bulan (VERIFIKASI: HARUS ≥ UMP {{provinsi}})
- Tunjangan: Rp {{tunjangan_lainnya}}
- Total: Rp {{gaji_bulanan + tunjangan_lainnya}}

JAM KERJA:
- {{jam_kerja_mingguan}} jam/minggu (HARUS ≤ 40 per UU)
- Hari: {{hari_kerja}}
- Probasi: {{masa_probasi_bulan}} bulan (max 3)

PERSYARATAN WAJIB (UU No. 13/2003):
1. UPAH: Harus ≥ UMP setempat ({{provinsi}})
2. JAM KERJA: Max 40 jam/minggu (tanpa lembur)
3. DESKRIPSI PEKERJAAN: Spesifik, bukan vague
4. STATUS: Jelas "Perjanjian Kerja Tetap"
5. PROBASI: Max 3 bulan (jika ada)
6. BPJS: Karyawan akan terdaftar BPJS Ketenagakerjaan & Kesehatan
7. CUTI: Minimal 12 hari kerja per tahun
8. SEVERANCE: Jika diberhentikan tanpa alasan, harus bayar pesangon
9. ASURANSI KESEHATAN: Ditanggung perusahaan (BPJS minimal)
10. TANDA TANGAN: Kedua belah pihak, saksi (HR minimal)

CLAUSE PENTING:
- Jam kerja lembur (jika ada): pembayaran 1.5x (malam) atau 2x (hari raya)
- Jaminan hak cuti
- Provision untuk termination dengan pesangon
- Dispute resolution (e.g., P4D/mediasi Dinas Ketenagakerjaan)

DISCLAIMER WAJIB:
"Perjanjian kerja ini harus sesuai dengan Undang-Undang Ketenagakerjaan
No. 13 Tahun 2003. Kedua belah pihak bertanggung jawab memastikan
semua syarat legal terpenuhi, termasuk registrasi BPJS."

Output: Perjanjian kerja tetap yang lengkap dan UU 13/2003 compliant.',
  true
);

-- 3.2 perj_kerja_kontrak: Fixed-Term Employment Contract
INSERT INTO public.templates
(type, subtype_id, name_id, name_en, required_fields, prompt_template, requires_materai)
VALUES (
  'perj_kerja',
  'perj_kerja_kontrak',
  'Perjanjian Kerja Kontrak',
  'Fixed-Term Employment Contract',
  '[
    {"key":"nama_karyawan","label_id":"Nama Lengkap Karyawan","type":"text","max_length":100,"required":true},
    {"key":"nomor_ktp_karyawan","label_id":"Nomor KTP Karyawan","type":"text","max_length":16,"required":true},
    {"key":"alamat_karyawan","label_id":"Alamat Karyawan","type":"textarea","required":true},
    {"key":"nama_perusahaan","label_id":"Nama Perusahaan","type":"text","max_length":100,"required":true},
    {"key":"jabatan_posisi","label_id":"Jabatan/Posisi","type":"text","max_length":100,"required":true},
    {"key":"deskripsi_pekerjaan","label_id":"Deskripsi Pekerjaan","type":"textarea","required":true},
    {"key":"alasan_kontrak","label_id":"Alasan Kontrak (Proyek Temporer/Musiman/Kebutuhan Khusus)","type":"textarea","required":true},
    {"key":"gaji_bulanan","label_id":"Gaji Bulanan (Rp)","type":"number","required":true},
    {"key":"jam_kerja_mingguan","label_id":"Jam Kerja Per Minggu","type":"number","required":true},
    {"key":"tanggal_mulai","label_id":"Tanggal Mulai Kontrak","type":"date","required":true},
    {"key":"tanggal_berakhir","label_id":"Tanggal Berakhir Kontrak","type":"date","required":true},
    {"key":"durasi_total_bulan","label_id":"Durasi Total (bulan)","type":"number","required":true},
    {"key":"kemungkinan_perpanjangan","label_id":"Kemungkinan Perpanjangan? (Ya/Tidak)","type":"text","required":true},
    {"key":"provinsi_lokasi","label_id":"Provinsi (untuk UMP reference)","type":"text","max_length":50,"required":true}
  ]'::jsonb,
  '⚠️ PENTING: Fixed-term contract HANYA untuk situasi khusus per UU No. 13/2003

Buatlah perjanjian kerja kontrak untuk pekerjaan bersifat temporer/musiman/proyek.

DATA KARYAWAN:
- Nama: {{nama_karyawan}} (KTP: {{nomor_ktp_karyawan}})

DATA PEKERJAAN:
- Perusahaan: {{nama_perusahaan}}
- Jabatan: {{jabatan_posisi}}
- Deskripsi: {{deskripsi_pekerjaan}}

PERIODE KONTRAK:
- Mulai: {{tanggal_mulai}}
- Berakhir: {{tanggal_berakhir}}
- Durasi: {{durasi_total_bulan}} bulan
- Alasan Kontrak: {{alasan_kontrak}}
- Perpanjangan Mungkin? {{kemungkinan_perpanjangan}}

KOMPENSASI:
- Gaji: Rp {{gaji_bulanan}}/bulan (VERIFIKASI ≥ UMP {{provinsi}})
- Jam Kerja: {{jam_kerja_mingguan}} jam/minggu (≤ 40)

PERSYARATAN WAJIB (UU 13/2003 Article 59):
1. ALASAN JELAS: Kontrak hanya untuk pekerjaan bersifat:
   - Temporer (sesaat)
   - Musiman (musim tertentu)
   - Kebutuhan khusus (proyek, pekerjaan tertentu)
2. DURASI: Jelas start dan end date
3. UPAH: Minimum UMP, tidak boleh di bawah
4. JAM KERJA: Max 40 jam/minggu
5. TIDAK ADA PERPANJANGAN BERULANG: Jika diperpanjang > 3x atau durasi > 3 tahun = menjadi tetap
6. BPJS: Tetap harus terdaftar untuk karyawan
7. PESANGON: Jika tidak diperpanjang, berhak pesangon 1x upah/bulan
8. TANDA TANGAN: Kedua belah pihak

PENTING - LARANGAN:
❌ Jangan gunakan kontrak untuk pekerjaan tetap/berulang
❌ Kontrak berulang > 3x = illegal, harus jadii tetap
❌ Tidak boleh mengurangi hak jika diperpanjang

CLAUSE RENEWAL:
"Kontrak akan berakhir pada {{tanggal_berakhir}}. Perusahaan berhak memilih untuk:
a) Tidak memperpanjang (karyawan berhak pesangon 1x gaji), atau
b) Memperpanjang (max hingga kontrak menjadi perjanjian tetap)"

Output: Perjanjian kerja kontrak yang UU 13/2003 compliant.',
  true
);

-- 3.3 perj_kerja_magang: Internship Agreement
INSERT INTO public.templates
(type, subtype_id, name_id, name_en, required_fields, prompt_template, requires_materai)
VALUES (
  'perj_kerja',
  'perj_kerja_magang',
  'Perjanjian Magang',
  'Internship Agreement',
  '[
    {"key":"nama_peserta_magang","label_id":"Nama Peserta Magang","type":"text","max_length":100,"required":true},
    {"key":"institusi_pendidikan","label_id":"Institusi Pendidikan (Sekolah/Universitas)","type":"text","max_length":100,"required":false},
    {"key":"nama_perusahaan","label_id":"Nama Perusahaan Tempat Magang","type":"text","max_length":100,"required":true},
    {"key":"bidang_magang","label_id":"Bidang/Departemen Magang","type":"text","max_length":100,"required":true},
    {"key":"deskripsi_magang","label_id":"Deskripsi Aktivitas & Pembelajaran Magang","type":"textarea","required":true},
    {"key":"tunjangan_magang","label_id":"Tunjangan/Allowance (Rp/bulan, atau Gratis)","type":"text","required":true},
    {"key":"jam_kerja_mingguan","label_id":"Jam Kerja Per Minggu","type":"number","required":true},
    {"key":"tanggal_mulai","label_id":"Tanggal Mulai Magang","type":"date","required":true},
    {"key":"tanggal_berakhir","label_id":"Tanggal Berakhir Magang","type":"date","required":true},
    {"key":"durasi_bulan","label_id":"Durasi (bulan, max 3)","type":"number","required":true},
    {"key":"nama_mentor_pembimbing","label_id":"Nama Mentor/Pembimbing","type":"text","max_length":100,"required":true},
    {"key":"sertifikat_penyelesaian","label_id":"Sertifikat Penyelesaian? (Ya/Tidak)","type":"text","required":true}
  ]'::jsonb,
  'Buatlah perjanjian magang yang jelas dan sesuai UU No. 13/2003 (Apprenticeship).

DATA PESERTA:
- Nama: {{nama_peserta_magang}}
- Institusi: {{institusi_pendidikan}}

DATA PERUSAHAAN:
- Nama: {{nama_perusahaan}}
- Bidang: {{bidang_magang}}
- Mentor: {{nama_mentor_pembimbing}}

PROGRAM MAGANG:
- Aktivitas: {{deskripsi_magang}}
- Mulai: {{tanggal_mulai}}
- Berakhir: {{tanggal_berakhir}}
- Durasi: {{durasi_bulan}} bulan (MAX 3)
- Jam Kerja: {{jam_kerja_mingguan}} jam/minggu
- Tunjangan: {{tunjangan_magang}}
- Sertifikat: {{sertifikat_penyelesaian}}

PERSYARATAN WAJIB (UU 13/2003):
1. DURASI: Max 3 bulan
2. LEARNING OBJECTIVE: Jelas tujuan pembelajaran
3. MENTOR: Ditunjuk perusahaan untuk membimbing
4. ALLOWANCE: Dapat diberikan (atau gratis, tapi harus jelas)
5. JAM KERJA: Wajar untuk pembelajaran (biasanya < 40 jam/minggu)
6. SUPERVISOR: Ada penanggung jawab untuk keselamatan
7. ASURANSI: Jika magang > 1 bulan, harus ada asuransi kecelakaan
8. SERTIFIKAT: Perusahaan berkomitmen memberikan sertifikat setelah selesai

PENTING:
❌ JANGAN: Magang > 3 bulan (harus jadii kontrak/tetap)
❌ JANGAN: Magang tanpa learning objective yang jelas
❌ JANGAN: Memaksa peserta magang melakukan pekerjaan rutin (harus pembelajaran)

CLAUSE SERTIFIKASI:
"Perusahaan berkomitmen memberikan sertifikat penyelesaian magang yang menyebutkan:
- Nama peserta
- Periode magang
- Kompetensi yang dicapai
- Penilaian performa"

Output: Perjanjian magang yang legal dan mendidik.',
  true
);

-- 3.4 perj_kerja_lepas: Freelance/Gig Work Agreement
INSERT INTO public.templates
(type, subtype_id, name_id, name_en, required_fields, prompt_template, requires_materai)
VALUES (
  'perj_kerja',
  'perj_kerja_lepas',
  'Perjanjian Kerja Lepas (Freelance)',
  'Freelance/Gig Work Agreement',
  '[
    {"key":"nama_pekerja_lepas","label_id":"Nama Pekerja Lepas / Freelancer","type":"text","max_length":100,"required":true},
    {"key":"nomor_identitas_pekerja","label_id":"Nomor KTP / Paspor / Identitas","type":"text","max_length":50,"required":true},
    {"key":"alamat_pekerja","label_id":"Alamat Pekerja Lepas","type":"textarea","required":true},
    {"key":"nama_klien","label_id":"Nama Klien / Penyedia Pekerjaan","type":"text","max_length":100,"required":true},
    {"key":"alamat_klien","label_id":"Alamat Klien","type":"textarea","required":true},
    {"key":"deskripsi_pekerjaan","label_id":"Deskripsi Pekerjaan/Deliverable (Spesifik)","type":"textarea","required":true},
    {"key":"hasil_kerja_output","label_id":"Hasil Kerja/Output yang Diharapkan","type":"textarea","required":true},
    {"key":"nilai_kompensasi","label_id":"Nilai Kompensasi (Rp)","type":"number","required":true},
    {"key":"jadwal_pembayaran","label_id":"Jadwal Pembayaran (Advance/Completion/Cicilan)","type":"text","max_length":100,"required":true},
    {"key":"deadline_pekerjaan","label_id":"Deadline Pengerjaan","type":"date","required":true},
    {"key":"revisi_unlimited","label_id":"Revisi Unlimited atau Terbatas? (Berapa kali?)","type":"text","max_length":100,"required":true},
    {"key":"hak_cipta_output","label_id":"Hak Cipta Output: Klien/Pekerja (Siapa yang memiliki)","type":"text","max_length":100,"required":true},
    {"key":"jaminan_kualitas","label_id":"Jaminan Kualitas / Warranty (Durasi)","type":"text","max_length":100,"required":false}
  ]'::jsonb,
  'Buatlah perjanjian kerja lepas (freelance) yang jelas dan melindungi kedua belah pihak.

DATA PEKERJA LEPAS:
- Nama: {{nama_pekerja_lepas}} (ID: {{nomor_identitas_pekerja}})
- Alamat: {{alamat_pekerja}}

DATA KLIEN:
- Nama: {{nama_klien}}
- Alamat: {{alamat_klien}}

RUANG LINGKUP PEKERJAAN:
- Deskripsi: {{deskripsi_pekerjaan}}
- Output: {{hasil_kerja_output}}
- Deadline: {{deadline_pekerjaan}}

KOMPENSASI:
- Nilai: Rp {{nilai_kompensasi}}
- Pembayaran: {{jadwal_pembayaran}}

TERMS:
- Revisi: {{revisi_unlimited}}
- Hak Cipta: {{hak_cipta_output}}
- Jaminan Kualitas: {{jaminan_kualitas}}

PERSYARATAN WAJIB:
1. SCOPE KERJA: SPESIFIK dan terukur (bukan vague)
2. DELIVERABLE: Jelas apa hasil yang diharapkan
3. DEADLINE: Tanggal jelas untuk pengerjaan dan penyerahan
4. KOMPENSASI: Jumlah jelas (Rp)
5. JADWAL BAYAR: Jelas kapan pembayaran (DP, lunas setelah selesai, cicilan)
6. REVISI: Berapa kali klien bisa minta revisi (berapa jumlahnya)
7. HAK CIPTA: Jelas siapa yang punya hak atas hasil kerja
8. LATE PENALTY: Jika ada keterlambatan, ada penalty atau tidak
9. TERMINATION: Boleh batal? Kalau batal, apa dampaknya
10. DISPUTE RESOLUTION: Bagaimana kalau ada perselisihan

CLAUSE PENTING:
- "Output dianggap selesai ketika klien accept final deliverable"
- "Pembayaran dilakukan {{jadwal_pembayaran}} setelah {{hasil_kerja_output}} selesai"
- "Revisi dibatasi {{revisi_unlimited}} kali. Revisi tambahan = charge tambahan"
- "Hak cipta {{hak_cipta_output}}. Pekerja tidak boleh menggunakan/dijual kembali"

REVISION CLAUSE:
"Klien berhak minta revisi {{revisi_unlimited}} kali tanpa biaya tambahan.
Setiap revisi tambahan di luar itu dikenakan charge Rp [amount] per revisi."

OUTPUT ACCEPTANCE:
"Pekerjaan dianggap selesai dan diterima ketika:
a) Pekerja menyerahkan deliverable ke klien
b) Klien menerima dan approve deliverable
c) Pembayaran diselesaikan per jadwal pembayaran"

Output: Perjanjian kerja lepas yang comprehensive dan fair.',
  true
);

-- 3.5 perj_kerja_paruh_waktu: Part-Time Employment
INSERT INTO public.templates
(type, subtype_id, name_id, name_en, required_fields, prompt_template, requires_materai)
VALUES (
  'perj_kerja',
  'perj_kerja_paruh_waktu',
  'Perjanjian Kerja Paruh Waktu',
  'Part-Time Employment Contract',
  '[
    {"key":"nama_karyawan","label_id":"Nama Karyawan","type":"text","max_length":100,"required":true},
    {"key":"nomor_ktp","label_id":"Nomor KTP","type":"text","max_length":16,"required":true},
    {"key":"nama_perusahaan","label_id":"Nama Perusahaan","type":"text","max_length":100,"required":true},
    {"key":"jabatan_posisi","label_id":"Jabatan/Posisi","type":"text","max_length":100,"required":true},
    {"key":"jam_kerja_mingguan","label_id":"Jam Kerja Per Minggu (misalnya: 20 jam)","type":"number","required":true},
    {"key":"jadwal_kerja_detail","label_id":"Jadwal Kerja Detail (Senin-Rabu pagi, Kamis-Jumat sore, dll)","type":"textarea","required":true},
    {"key":"upah_per_jam","label_id":"Upah Per Jam (Rp)","type":"number","required":true},
    {"key":"estimasi_upah_bulanan","label_id":"Estimasi Upah Bulanan (Rp)","type":"number","required":true},
    {"key":"status_bpjs","label_id":"Status BPJS (Tergantung jam kerja, dijelaskan di kontrak)","type":"text","required":true},
    {"key":"tanggal_mulai","label_id":"Tanggal Mulai Kerja","type":"date","required":true},
    {"key":"durasi_kontrak","label_id":"Durasi (Tetap / Kontrak X bulan)","type":"text","max_length":100,"required":true},
    {"key":"provinsi","label_id":"Provinsi (untuk UMP reference)","type":"text","max_length":50,"required":true}
  ]'::jsonb,
  'Buatlah perjanjian kerja paruh waktu yang sesuai UU No. 13/2003.

DATA KARYAWAN:
- Nama: {{nama_karyawan}} (KTP: {{nomor_ktp}})

DATA PERUSAHAAN:
- Nama: {{nama_perusahaan}}
- Jabatan: {{jabatan_posisi}}

JADWAL & JAM KERJA:
- Jam/Minggu: {{jam_kerja_mingguan}} jam (paruh waktu)
- Jadwal Detail: {{jadwal_kerja_detail}}
- Mulai: {{tanggal_mulai}}
- Durasi: {{durasi_kontrak}}

KOMPENSASI:
- Upah: Rp {{upah_per_jam}}/jam
- Estimasi Bulanan: Rp {{estimasi_upah_bulanan}} (berdasarkan {{jam_kerja_mingguan}} jam/minggu)
- VERIFIKASI: Minimal UMP {{provinsi}} jika diproporsionalkan

BPJS:
- Status: {{status_bpjs}}
- Note: Jika jam kerja ≥ 21 jam/minggu = BPJS Ketenagakerjaan wajib
- Jika perusahaan > 10 orang = BPJS Kesehatan wajib

PERSYARATAN WAJIB (UU 13/2003):
1. JAM KERJA: Jelas berapa jam/minggu (paruh waktu = < full-time)
2. JADWAL: Detail hari & jam kerja
3. UPAH: Per jam atau per hari (jelas)
4. TOTAL KOMPENSASI: Harus proporsional dengan UMP
5. BPJS STATUS: Jika jam ≥ 21/minggu = BPJS Ketenagakerjaan wajib
6. LEMBUR: Jika ada, bayar 1.5x upah
7. CUTI: Hak cuti proporsional dengan jam kerja
8. STATUS: Tetap atau kontrak (jelas)

UPAH CALCULATION:
"Upah bulanan = Rp {{upah_per_jam}} x {{jam_kerja_mingguan}} jam x 4.3 minggu
             = Rp {{estimasi_upah_bulanan}}"

BPJS CLAUSE:
"Jika jam kerja {{jam_kerja_mingguan}} jam/minggu ≥ 21 jam, karyawan wajib
terdaftar BPJS Ketenagakerjaan dan BPJS Kesehatan atas biaya perusahaan."

Output: Perjanjian kerja paruh waktu yang compliant.',
  true
);

-- 3.6 perj_pengakhiran_kerja: Severance/Termination Agreement
INSERT INTO public.templates
(type, subtype_id, name_id, name_en, required_fields, prompt_template, requires_materai)
VALUES (
  'perj_kerja',
  'perj_pengakhiran_kerja',
  'Perjanjian Pengakhiran Hubungan Kerja (Severance)',
  'Employment Termination Agreement (Severance)',
  '[
    {"key":"nama_karyawan","label_id":"Nama Karyawan","type":"text","max_length":100,"required":true},
    {"key":"nomor_ktp_karyawan","label_id":"Nomor KTP Karyawan","type":"text","max_length":16,"required":true},
    {"key":"nama_perusahaan","label_id":"Nama Perusahaan","type":"text","max_length":100,"required":true},
    {"key":"jabatan_karyawan","label_id":"Jabatan/Posisi Karyawan","type":"text","max_length":100,"required":true},
    {"key":"tanggal_mulai_kerja","label_id":"Tanggal Mulai Kerja (di awal)","type":"date","required":true},
    {"key":"tanggal_akhir_kerja","label_id":"Tanggal Akhir/Keluar (pemisahan)","type":"date","required":true},
    {"key":"alasan_pengakhiran","label_id":"Alasan Pengakhiran (Mutual/Pensiun/Resign/PHK/dll)","type":"textarea","required":true},
    {"key":"masa_kerja_tahun","label_id":"Masa Kerja (tahun)","type":"number","required":true},
    {"key":"gaji_terakhir","label_id":"Gaji Terakhir (Rp/bulan)","type":"number","required":true},
    {"key":"pesangon_dihitung","label_id":"Pesangon (Rp) - berdasarkan UU 13/2003","type":"number","required":true},
    {"key":"uang_penghargaan_masa_kerja","label_id":"Uang Penghargaan Masa Kerja (Rp)","type":"number","required":false},
    {"key":"uang_penggantian_hak","label_id":"Uang Penggantian Hak (Rp) - cuti, tunjangan, dll","type":"number","required":true},
    {"key":"total_pembayaran_akhir","label_id":"Total Pembayaran Akhir (Rp)","type":"number","required":true},
    {"key":"jadwal_pembayaran_severance","label_id":"Jadwal Pembayaran Severance","type":"text","max_length":100,"required":true},
    {"key":"surat_referensi_kerja","label_id":"Surat Referensi/Sertifikat Kerja Diberikan? (Ya/Tidak)","type":"text","required":true},
    {"key":"return_company_property","label_id":"Return Company Property Terkonfirmasi (Ya/Tidak)","type":"text","required":true}
  ]'::jsonb,
  '⚠️ CRITICAL: Pengakhiran hubungan kerja HARUS sesuai UU No. 13/2003

Buatlah perjanjian pengakhiran kerja (severance) yang legal dan fair.

DATA KARYAWAN:
- Nama: {{nama_karyawan}} (KTP: {{nomor_ktp_karyawan}})
- Jabatan: {{jabatan_karyawan}}
- Perusahaan: {{nama_perusahaan}}

MASA KERJA:
- Mulai: {{tanggal_mulai_kerja}}
- Akhir: {{tanggal_akhir_kerja}}
- Total Masa Kerja: {{masa_kerja_tahun}} tahun
- Alasan: {{alasan_pengakhiran}}

KOMPENSASI AKHIR:
- Gaji Terakhir: Rp {{gaji_terakhir}}
- Pesangon: Rp {{pesangon_dihitung}}
- Penghargaan Masa Kerja: Rp {{uang_penghargaan_masa_kerja}}
- Penggantian Hak (cuti, dll): Rp {{uang_penggantian_hak}}
- TOTAL: Rp {{total_pembayaran_akhir}}
- Pembayaran: {{jadwal_pembayaran_severance}}

DOKUMEN & PROPERTY:
- Surat Referensi: {{surat_referensi_kerja}}
- Company Property Returned: {{return_company_property}}

PERSYARATAN WAJIB (UU 13/2003):
1. ALASAN JELAS: Pengakhiran karena apa?
   - Mutual agreement (bersepakat)
   - Resign (karyawan keluar)
   - PHK (perusahaan pecat) - harus ada alasan sah
   - Pensiun (mencapai usia)
   - Meninggal / force majeure

2. PESANGON CALCULATION (per Article 156-167 UU 13/2003):
   - < 1 tahun: 1x upah/bulan
   - 1-5 tahun: 2x upah/bulan
   - 5-15 tahun: 3x upah/bulan
   - > 15 tahun: 4x upah/bulan
   (Jika PHK tanpa alasan sah = 1.5x lebih tinggi)

3. PENGHARGAAN MASA KERJA (per Article 167):
   - 3-6 tahun: 2x upah/bulan
   - 6-9 tahun: 3x upah/bulan
   - > 9 tahun: 4x upah/bulan

4. PENGGANTIAN HAK:
   - Cuti yang belum diambil (bayar)
   - Tunjangan (jika ada)
   - Bonus (jika ada)

5. SURAT REFERENSI: Perusahaan wajib memberikan
6. BPJS: Harus dijelaskan status BPJS setelah keluar
7. TANDA TANGAN: Kedua belah pihak + saksi (minimal 2)

RELEASE CLAUSE (Penting):
"Dengan menandatangani perjanjian ini, karyawan melepaskan semua klaim
atau gugatan lebih lanjut terhadap perusahaan, kecuali:
- Pembayaran severance tidak lunas
- Perusahaan melakukan illegal action sebelumnya

Jika pembayaran di-cicil, release hanya berlaku setelah pembayaran lunas."

PEMBAYARAN SCHEDULE:
"Total Rp {{total_pembayaran_akhir}} dibayarkan {{jadwal_pembayaran_severance}}
ke rekening karyawan atau cash sesuai kesepakatan."

Output: Perjanjian pengakhiran kerja yang legal dan comprehensive.',
  true
);

-- ============================================================
-- 4. PERJANJIAN SEWA (Lease Agreements) — 2 subtypes
-- ============================================================

-- 4.1 perj_sewa_rumah: Residential Lease Agreement
INSERT INTO public.templates
(type, subtype_id, name_id, name_en, required_fields, prompt_template, requires_materai)
VALUES (
  'perj_sewa',
  'perj_sewa_rumah',
  'Perjanjian Sewa Rumah',
  'Residential Lease Agreement',
  '[
    {"key":"nama_pemilik","label_id":"Nama Pemilik/Landlord","type":"text","max_length":100,"required":true},
    {"key":"nomor_ktp_pemilik","label_id":"Nomor KTP Pemilik","type":"text","max_length":16,"required":true},
    {"key":"alamat_pemilik","label_id":"Alamat Pemilik","type":"textarea","required":true},
    {"key":"nama_penyewa","label_id":"Nama Penyewa/Tenant","type":"text","max_length":100,"required":true},
    {"key":"nomor_ktp_penyewa","label_id":"Nomor KTP Penyewa","type":"text","max_length":16,"required":true},
    {"key":"alamat_penyewa","label_id":"Alamat Penyewa (Alamat Sebelumnya)","type":"textarea","required":true},
    {"key":"alamat_rumah_sewa","label_id":"Alamat Rumah/Properti yang Disewa","type":"textarea","required":true},
    {"key":"luas_rumah","label_id":"Luas Rumah (m²)","type":"number","required":false},
    {"key":"deskripsi_ruangan","label_id":"Deskripsi Ruangan (kamar, fasilitas)","type":"textarea","required":true},
    {"key":"harga_sewa_bulanan","label_id":"Harga Sewa Bulanan (Rp)","type":"number","required":true},
    {"key":"jangka_waktu_bulan","label_id":"Jangka Waktu (bulan)","type":"number","required":true},
    {"key":"tanggal_mulai_sewa","label_id":"Tanggal Mulai Sewa","type":"date","required":true},
    {"key":"tanggal_berakhir_sewa","label_id":"Tanggal Berakhir Sewa","type":"date","required":true},
    {"key":"uang_jaminan","label_id":"Uang Jaminan/Deposit (Rp)","type":"number","required":true},
    {"key":"denda_keterlambatan_bulan","label_id":"Denda Keterlambatan Bayar (Rp/hari atau % per bulan)","type":"text","max_length":100,"required":false},
    {"key":"yang_bayar_listrik_air","label_id":"Yang Bayar Listrik & Air (Pemilik/Penyewa/Bersama)","type":"text","max_length":50,"required":true},
    {"key":"perbaikan_tanggung_jawab","label_id":"Perbaikan/Maintenance Tanggung Jawab (Pemilik/Penyewa)","type":"textarea","required":true},
    {"key":"pemutusan_kontrak","label_id":"Masa Proses Pemutusan (berapa hari sebelumnya)","type":"number","required":false}
  ]'::jsonb,
  'Buatlah perjanjian sewa rumah yang jelas dan melindungi kedua belah pihak.

DATA PEMILIK:
- Nama: {{nama_pemilik}} (KTP: {{nomor_ktp_pemilik}})
- Alamat: {{alamat_pemilik}}

DATA PENYEWA:
- Nama: {{nama_penyewa}} (KTP: {{nomor_ktp_penyewa}})
- Alamat: {{alamat_penyewa}}

PROPERTI YANG DISEWA:
- Alamat: {{alamat_rumah_sewa}}
- Luas: {{luas_rumah}} m²
- Deskripsi: {{deskripsi_ruangan}}

PERIODE SEWA:
- Mulai: {{tanggal_mulai_sewa}}
- Berakhir: {{tanggal_berakhir_sewa}}
- Durasi: {{jangka_waktu_bulan}} bulan

BIAYA:
- Sewa Bulanan: Rp {{harga_sewa_bulanan}}
- Jaminan/Deposit: Rp {{uang_jaminan}}
- Denda Telat: {{denda_keterlambatan_bulan}}

TANGGUNG JAWAB:
- Listrik & Air: {{yang_bayar_listrik_air}}
- Perbaikan: {{perbaikan_tanggung_jawab}}
- Proses Pemutusan: {{pemutusan_kontrak}} hari sebelumnya

PERSYARATAN WAJIB:
1. DATA LENGKAP: KTP pemilik dan penyewa
2. PROPERTI JELAS: Alamat dan deskripsi ruangan
3. PERIODE SEWA: Start date dan end date jelas
4. SEWA BULANAN: Jumlah Rp jelas
5. JAMINAN: Uang deposit dan syarat pengembalian
6. DENDA: Keterlambatan pembayaran (Rp/hari atau %)
7. UTILITAS: Siapa yang bayar listrik, air, gas
8. MAINTENANCE: Siapa tanggung jawab perbaikan
9. TERMINATION: Berapa hari notice untuk berhenti (biasanya 1-3 bulan)
10. TANDA TANGAN: Kedua belah pihak + 2 saksi

JAMINAN/DEPOSIT CLAUSE:
"Penyewa membayar jaminan Rp {{uang_jaminan}} yang akan dikembalikan setelah:
a) Rumah dikembalikan dalam kondisi baik
b) Semua biaya (sewa, listrik, air) sudah lunas
c) Tidak ada kerusakan yang disebabkan penyewa
Pengembalian dilakukan dalam {{return_days}} hari setelah pengosongan."

DENDA CLAUSE:
"Jika pembayaran sewa terlambat lebih dari {{denda_hari}} hari,
penyewa dikenakan denda {{denda_keterlambatan_bulan}}.
Jika terlambat > {{terminate_hari}} hari, pemilik berhak membatalkan kontrak."

KERUSAKAN:
"Penyewa bertanggung jawab atas kerusakan rumah yang disebabkan oleh:
- Kelalaian penyewa
- Penggunaan tidak semestinya
- Kerusakan intentional

Kerusakan normal akibat pemakaian = tanggung jawab pemilik."

Output: Perjanjian sewa rumah yang fair dan legal.',
  true
);

-- 4.2 perj_sewa_toko: Commercial Shop Lease Agreement
INSERT INTO public.templates
(type, subtype_id, name_id, name_en, required_fields, prompt_template, requires_materai)
VALUES (
  'perj_sewa',
  'perj_sewa_toko',
  'Perjanjian Sewa Toko/Tempat Usaha',
  'Commercial Shop Lease Agreement',
  '[
    {"key":"nama_pemilik","label_id":"Nama Pemilik Toko","type":"text","max_length":100,"required":true},
    {"key":"nomor_ktp_pemilik","label_id":"Nomor KTP Pemilik","type":"text","max_length":16,"required":true},
    {"key":"nama_penyewa","label_id":"Nama Penyewa (Individu/Perusahaan)","type":"text","max_length":100,"required":true},
    {"key":"nomor_identitas_penyewa","label_id":"Nomor KTP / NPWP Penyewa","type":"text","max_length":50,"required":true},
    {"key":"alamat_toko","label_id":"Alamat Toko/Lokasi Usaha","type":"textarea","required":true},
    {"key":"luas_toko","label_id":"Luas Toko (m²)","type":"number","required":true},
    {"key":"kondisi_toko","label_id":"Kondisi Toko (Kosong/Ada Instalasi/Furnished)","type":"text","max_length":100,"required":true},
    {"key":"harga_sewa_bulanan","label_id":"Harga Sewa Bulanan (Rp)","type":"number","required":true},
    {"key":"biaya_maintenance_bulan","label_id":"Biaya Maintenance/Common Area (Rp/bulan, atau 0)","type":"number","required":false},
    {"key":"jangka_waktu_bulan","label_id":"Jangka Waktu Sewa (bulan)","type":"number","required":true},
    {"key":"tanggal_mulai_sewa","label_id":"Tanggal Mulai Sewa","type":"date","required":true},
    {"key":"uang_jaminan","label_id":"Uang Jaminan/Deposit (Rp)","type":"number","required":true},
    {"key":"asuransi_toko","label_id":"Asuransi Toko (Atas Siapa)","type":"text","max_length":100,"required":false},
    {"key":"perizinan_usaha_pemilik","label_id":"Perizinan Toko (IMB, HO) - Status (Pemilik/Penyewa)","type":"text","max_length":100,"required":true},
    {"key":"biaya_pajak","label_id":"Biaya Pajak Properti/PBB (Siapa yang bayar)","type":"text","max_length":50,"required":true},
    {"key":"perpanjangan_opsi","label_id":"Opsi Perpanjangan (Ya/Tidak, berapa lama)","type":"text","max_length":100,"required":false}
  ]'::jsonb,
  'Buatlah perjanjian sewa toko/tempat usaha yang komprehensif.

DATA PEMILIK:
- Nama: {{nama_pemilik}} (KTP: {{nomor_ktp_pemilik}})

DATA PENYEWA:
- Nama: {{nama_penyewa}} (ID: {{nomor_identitas_penyewa}})

TOKO/LOKASI USAHA:
- Alamat: {{alamat_toko}}
- Luas: {{luas_toko}} m²
- Kondisi: {{kondisi_toko}}

BIAYA SEWA:
- Sewa Bulanan: Rp {{harga_sewa_bulanan}}
- Maintenance: Rp {{biaya_maintenance_bulan}}
- Jaminan: Rp {{uang_jaminan}}
- Total Bulanan: Rp {{harga_sewa_bulanan + biaya_maintenance_bulan}}

PERIODE & OPTION:
- Mulai: {{tanggal_mulai_sewa}}
- Durasi: {{jangka_waktu_bulan}} bulan
- Perpanjangan: {{perpanjangan_opsi}}

TANGGUNG JAWAB:
- Perizinan (IMB, HO): {{perizinan_usaha_pemilik}}
- Pajak/PBB: {{biaya_pajak}}
- Asuransi: {{asuransi_toko}}

PERSYARATAN WAJIB (Khusus Komersial):
1. DATA LENGKAP: KTP pemilik dan penyewa
2. TOKO JELAS: Alamat, luas, kondisi awal
3. SEWA BULANAN: Rp jelas + maintenance/common area
4. JAMINAN: Deposit dan syarat pengembalian
5. PERIZINAN: Jelas IMB/HO status dan siapa tanggung jawab
6. PAJAK & UTILITY: Siapa bayar PBB, listrik, air
7. ASURANSI: Jika ada, siapa yang urus
8. RENOVASI: Penyewa boleh renovasi? Dengan permission siapa?
9. PERPANJANGAN: Opsi untuk perpanjang atau tidak
10. ENFORCEMENT: Cara pemutusan dan denda
11. TANDA TANGAN: Kedua belah pihak + saksi

PERIZINAN CLAUSE:
"{{perizinan_usaha_pemilik}} bertanggung jawab memastikan toko memiliki:
- Izin Mendirikan Bangunan (IMB)
- Surat Izin Usaha (SIU)
- Izin Tempat Usaha (HO)
Penyewa tidak boleh menggunakan toko jika perizinan tidak lengkap."

PAJAK CLAUSE:
"{{biaya_pajak}} bertanggung jawab membayar:
- Pajak Bumi dan Bangunan (PBB)
- Biaya administrasi properti
Jika tidak bayar, penyewa boleh hentikan sewa tanpa denda."

RENOVASI:
"Penyewa boleh melakukan renovasi/dekorasi dengan izin tertulis dari pemilik.
Renovasi harus sesuai dengan peraturan bangunan setempat.
Setelah selesai sewa, renovasi menjadi hak pemilik (atau dibongkar, sesuai perjanjian)."

Output: Perjanjian sewa toko komersial yang fair dan legal.',
  true
);

-- Continue in next batch...
-- Part 2 will have more sections: Perjanjian Utang + Surat Pernyataan
-- SQL file size getting large; consider running Part 2 separately
