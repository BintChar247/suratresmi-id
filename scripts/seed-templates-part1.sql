-- SuratResmi.id — Template Seeding Script (Part 1 of 2)
-- Run this in Supabase SQL Editor
-- Templates: Surat Kuasa (all subtypes) + Surat Jual Beli

-- IMPORTANT: Adjust prompt_template values after implementation
-- These are TEMPLATE EXAMPLES; customize based on actual implementation

-- ============================================================
-- 1. SURAT KUASA (Power of Attorney) — 8 subtypes
-- ============================================================

-- 1.1 kuasa_stnk: Vehicle Registration Extension Proxy
INSERT INTO public.templates
(type, subtype_id, name_id, name_en, required_fields, prompt_template, requires_materai)
VALUES (
  'kuasa',
  'kuasa_stnk',
  'Surat Kuasa Perpanjangan STNK',
  'Power of Attorney for Vehicle Registration Extension',
  '[
    {"key":"nama_pemberi_kuasa","label_id":"Nama Lengkap Pemberi Kuasa","type":"text","max_length":100,"required":true},
    {"key":"nomor_ktp_pemberi","label_id":"Nomor KTP Pemberi Kuasa","type":"text","max_length":16,"required":true},
    {"key":"alamat_pemberi","label_id":"Alamat Lengkap Pemberi Kuasa","type":"textarea","required":true},
    {"key":"nama_penerima_kuasa","label_id":"Nama Penerima Kuasa","type":"text","max_length":100,"required":true},
    {"key":"nomor_ktp_penerima","label_id":"Nomor KTP Penerima Kuasa","type":"text","max_length":16,"required":true},
    {"key":"nomor_polisi","label_id":"Nomor Polisi Kendaraan","type":"text","max_length":20,"required":true},
    {"key":"merek_kendaraan","label_id":"Merek Kendaraan","type":"text","max_length":50,"required":true},
    {"key":"tahun_kendaraan","label_id":"Tahun Kendaraan","type":"number","required":true},
    {"key":"nomor_stnk","label_id":"Nomor STNK Saat Ini","type":"text","max_length":50,"required":false}
  ]'::jsonb,
  'Buatlah surat kuasa untuk perpanjangan STNK yang sah menurut hukum Indonesia.

Data:
- Pemberi kuasa: {{nama_pemberi_kuasa}} (KTP: {{nomor_ktp_pemberi}})
- Alamat: {{alamat_pemberi}}
- Penerima kuasa: {{nama_penerima_kuasa}} (KTP: {{nomor_ktp_penerima}})
- Kendaraan: {{merek_kendaraan}} tahun {{tahun_kendaraan}} (Nomor Polisi: {{nomor_polisi}})

Persyaratan:
1. Mengikuti format UU No. 8 Tahun 1997 tentang Dokumen
2. Menyebutkan scope authority terbatas pada perpanjangan STNK
3. Mencantumkan tanggal dan garis tanda tangan
4. Memperingatkan bahwa materai Rp 10.000 diperlukan
5. Menggunakan bahasa Indonesia baku

Output: Surat kuasa siap cetak dengan garis kosong untuk tanda tangan basah.',
  true
);

-- 1.2 kuasa_stnk_perj: Vehicle Registration + Employment Agreement Proxy
INSERT INTO public.templates
(type, subtype_id, name_id, name_en, required_fields, prompt_template, requires_materai)
VALUES (
  'kuasa',
  'kuasa_stnk_perj',
  'Surat Kuasa Perpanjangan STNK & Perjanjian Kerja',
  'Power of Attorney for Vehicle Registration + Employment Agreement',
  '[
    {"key":"nama_pemberi_kuasa","label_id":"Nama Lengkap Pemberi Kuasa","type":"text","max_length":100,"required":true},
    {"key":"nomor_ktp_pemberi","label_id":"Nomor KTP","type":"text","max_length":16,"required":true},
    {"key":"alamat_pemberi","label_id":"Alamat","type":"textarea","required":true},
    {"key":"nama_penerima_kuasa","label_id":"Nama Penerima Kuasa","type":"text","max_length":100,"required":true},
    {"key":"nomor_polisi","label_id":"Nomor Polisi Kendaraan","type":"text","max_length":20,"required":true},
    {"key":"merek_kendaraan","label_id":"Merek Kendaraan","type":"text","max_length":50,"required":true},
    {"key":"nama_perusahaan","label_id":"Nama Perusahaan Tempat Kerja","type":"text","max_length":100,"required":true},
    {"key":"posisi_jabatan","label_id":"Posisi/Jabatan","type":"text","max_length":100,"required":true},
    {"key":"gaji_bulanan","label_id":"Gaji Bulanan (Rp)","type":"number","required":true},
    {"key":"jam_kerja_mingguan","label_id":"Jam Kerja Per Minggu","type":"number","required":true},
    {"key":"provinsi","label_id":"Provinsi (untuk UMP reference)","type":"text","max_length":50,"required":true}
  ]'::jsonb,
  'Buatlah DUA dokumen terpisah yang saling melengkapi:

DOKUMEN 1: SURAT KUASA PERPANJANGAN STNK
DOKUMEN 2: PERJANJIAN KERJA

SURAT KUASA:
- Pemberi kuasa: {{nama_pemberi_kuasa}} (KTP: {{nomor_ktp_pemberi}})
- Penerima kuasa: {{nama_penerima_kuasa}}
- Kendaraan: {{merek_kendaraan}} ({{nomor_polisi}})
- Scope: Perpanjangan STNK SAJA

PERJANJIAN KERJA (Sesuai UU No. 13/2003):
- Karyawan: {{nama_penerima_kuasa}}
- Perusahaan: {{nama_perusahaan}}
- Posisi: {{posisi_jabatan}}
- Gaji: Rp {{gaji_bulanan}}/bulan (verifikasi UMP {{provinsi}})
- Jam kerja: {{jam_kerja_mingguan}} jam/minggu (HARUS ≤ 40)
- Status: Perjanjian Kerja Tetap
- Termasuk: BPJS Ketenagakerjaan, BPJS Kesehatan, severance clause

PERSYARATAN:
1. Dua surat dengan materai terpisah
2. Perjanjian kerja sesuai UU 13/2003 (UMP compliance)
3. Gaji minimal tidak boleh di bawah UMP {{provinsi}}
4. Jam kerja jelas ≤ 40 jam/minggu
5. Setiap dokumen ada garis tanda tangan terpisah

Output: Dua dokumen lengkap, siap cetak, dengan pemisahan yang jelas.',
  true
);

-- 1.3 kuasa_perpanjangan: General Extension Proxy
INSERT INTO public.templates
(type, subtype_id, name_id, name_en, required_fields, prompt_template, requires_materai)
VALUES (
  'kuasa',
  'kuasa_perpanjangan',
  'Surat Kuasa Perpanjangan (Umum)',
  'Power of Attorney for Extension (General)',
  '[
    {"key":"nama_pemberi_kuasa","label_id":"Nama Lengkap Pemberi Kuasa","type":"text","max_length":100,"required":true},
    {"key":"nomor_ktp_pemberi","label_id":"Nomor KTP Pemberi Kuasa","type":"text","max_length":16,"required":true},
    {"key":"alamat_pemberi","label_id":"Alamat Pemberi Kuasa","type":"textarea","required":true},
    {"key":"nama_penerima_kuasa","label_id":"Nama Penerima Kuasa","type":"text","max_length":100,"required":true},
    {"key":"jenis_dokumen_diperpanjang","label_id":"Jenis Dokumen yang Diperpanjang (e.g., Pasport, SIM, Izin Usaha)","type":"text","max_length":100,"required":true},
    {"key":"nomor_dokumen","label_id":"Nomor Dokumen yang Diperpanjang","type":"text","max_length":50,"required":false},
    {"key":"lembaga_terkait","label_id":"Lembaga yang Mengelola (e.g., Imigrasi, Polda, Dinas)","type":"text","max_length":100,"required":true}
  ]'::jsonb,
  'Buatlah surat kuasa umum untuk perpanjangan dokumen apapun.

Data:
- Pemberi kuasa: {{nama_pemberi_kuasa}} (KTP: {{nomor_ktp_pemberi}})
- Penerima kuasa: {{nama_penerima_kuasa}}
- Dokumen: {{jenis_dokumen_diperpanjang}} (No. {{nomor_dokumen}})
- Lembaga: {{lembaga_terkait}}

Persyaratan:
1. Format standar kuasa (Article 1792 KUH Perdata)
2. Scope terbatas pada perpanjangan {{jenis_dokumen_diperpanjang}}
3. Spesifik nomor dokumen jika ada
4. Tanggal dan tanda tangan
5. Materai Rp 10.000 diperlukan

Output: Surat kuasa siap pakai untuk berbagai jenis perpanjangan dokumen.',
  true
);

-- 1.4 kuasa_jual_tanah: Land Sale Proxy (CRITICAL)
INSERT INTO public.templates
(type, subtype_id, name_id, name_en, required_fields, prompt_template, requires_materai)
VALUES (
  'kuasa',
  'kuasa_jual_tanah',
  'Surat Kuasa Jual Tanah',
  'Power of Attorney for Land Sale',
  '[
    {"key":"nama_pemberi_kuasa","label_id":"Nama Pemilik Tanah","type":"text","max_length":100,"required":true},
    {"key":"nomor_ktp_pemberi","label_id":"Nomor KTP Pemilik","type":"text","max_length":16,"required":true},
    {"key":"alamat_pemberi","label_id":"Alamat Pemilik","type":"textarea","required":true},
    {"key":"nama_penerima_kuasa","label_id":"Nama Penerima Kuasa (Agent)","type":"text","max_length":100,"required":true},
    {"key":"alamat_tanah","label_id":"Alamat Tanah (Lengkap)","type":"textarea","required":true},
    {"key":"nomor_sertifikat","label_id":"Nomor Sertifikat Hak Milik (SHM) atau Hak Guna Usaha (HGU)","type":"text","max_length":50,"required":true},
    {"key":"luas_tanah","label_id":"Luas Tanah (m²)","type":"number","required":true},
    {"key":"harga_jual","label_id":"Harga Jual (Rp)","type":"number","required":true},
    {"key":"kabupaten_kota","label_id":"Kabupaten/Kota (untuk BPN)","type":"text","max_length":50,"required":true}
  ]'::jsonb,
  'Buatlah SURAT KUASA JUAL TANAH dengan standar hukum Indonesia tertinggi.

⚠️ CRITICAL: Dokumen ini hanya untuk KUASA. Penjualan aktual HARUS melalui notaris.

Data Tanah:
- Pemilik: {{nama_pemberi_kuasa}} (KTP: {{nomor_ktp_pemberi}})
- Lokasi: {{alamat_tanah}}
- Sertifikat: {{nomor_sertifikat}}
- Luas: {{luas_tanah}} m²
- Harga: Rp {{harga_jual}}
- BPN: {{kabupaten_kota}}

Penerima Kuasa:
- Nama: {{nama_penerima_kuasa}}
- Authority: Mewakili pemilik untuk MENJUAL tanah

Persyaratan WAJIB:
1. Identitas lengkap pemilik (KTP, alamat)
2. Data tanah lengkap (sertifikat, alamat, luas)
3. HARGA JELAS (dalam Rupiah)
4. Scope dibatasi: "Untuk menjual tanah tersebut"
5. DISCLAIMER NOTARIS: "Akta jual beli HARUS dilakukan di hadapan notaris"
6. Tanda tangan pemilik (wet signature)
7. Materai Rp 10.000

PENTING:
- Perjanjian ini hanya KUASA (pemberian wewenang)
- Penjualan SEBENARNYA harus melalui notaris
- BPN tidak akan memproses balik nama tanpa akta notaris
- Sertifikat asli harus diverifikasi di BPN sebelum penjualan

Output: Surat kuasa jual tanah yang legal dan komprehensif.',
  true
);

-- 1.5 kuasa_istimewa: Special Power of Attorney (CRITICAL)
INSERT INTO public.templates
(type, subtype_id, name_id, name_en, required_fields, prompt_template, requires_materai)
VALUES (
  'kuasa',
  'kuasa_istimewa',
  'Surat Kuasa Istimewa',
  'Special Power of Attorney',
  '[
    {"key":"nama_pemberi_kuasa","label_id":"Nama Lengkap Pemberi Kuasa","type":"text","max_length":100,"required":true},
    {"key":"nomor_ktp_pemberi","label_id":"Nomor KTP Pemberi Kuasa","type":"text","max_length":16,"required":true},
    {"key":"alamat_pemberi","label_id":"Alamat Pemberi Kuasa","type":"textarea","required":true},
    {"key":"nama_penerima_kuasa","label_id":"Nama Penerima Kuasa","type":"text","max_length":100,"required":true},
    {"key":"daftar_authority","label_id":"Daftar Authority (pisahkan dengan semicolon)","type":"textarea","required":true,"placeholder":"Contoh: Mengurus permohonan visa; Menandatangani dokumen pinjaman; Mewakili dalam negosiasi properti"},
    {"key":"tanggal_mulai","label_id":"Tanggal Berlaku","type":"date","required":true},
    {"key":"tanggal_berakhir","label_id":"Tanggal Berakhir","type":"date","required":true},
    {"key":"include_witness","label_id":"Sertakan Saksi? (Yes/No)","type":"text","required":false}
  ]'::jsonb,
  'Buatlah SURAT KUASA ISTIMEWA (Special Power of Attorney) dengan wewenang luas.

⚠️ CRITICAL: Kuasa istimewa memberikan WEWENANG LUAS. Hati-hati dalam pemberian.

Data Pemberi:
- Nama: {{nama_pemberi_kuasa}} (KTP: {{nomor_ktp_pemberi}})
- Alamat: {{alamat_pemberi}}

Penerima Kuasa:
- Nama: {{nama_penerima_kuasa}}
- Berlaku dari: {{tanggal_mulai}} sampai {{tanggal_berakhir}}

DAFTAR WEWENANG (HARUS SPESIFIK):
{{daftar_authority}}

Persyaratan WAJIB:
1. HARUS menyebutkan "Surat Kuasa Istimewa" atau "Kuasa Khusus"
2. Daftar authority dalam format NUMBERED/BULLET (bukan "semua hak")
3. JELAS bahwa authority TERBATAS pada daftar yang disebutkan
4. Tanggal berlaku DAN tanggal berakhir (REQUIRED untuk istimewa)
5. Revocation clause: "Pemberi kuasa dapat mencabut kuasa ini dengan surat tertulis"
6. Tanda tangan pemberi + rekomendasi: tanda tangan penerima (acceptance)
7. Witness signature (opsional tapi recommended untuk jumlah tinggi)
8. Materai Rp 10.000

BAHASA PENTING untuk istimewa:
- "Dengan ini saya memberi kuasa khusus kepada [nama] untuk:"
- Bukan "semua hak" atau "segala sesuatunya"
- Authority list spesifik dan jelas

Output: Surat kuasa istimewa yang legally sound dan aman.',
  true
);

-- 1.6 kuasa_pencairan_asuransi: Insurance Claim Proxy
INSERT INTO public.templates
(type, subtype_id, name_id, name_en, required_fields, prompt_template, requires_materai)
VALUES (
  'kuasa',
  'kuasa_pencairan_asuransi',
  'Surat Kuasa Pencairan Klaim Asuransi',
  'Power of Attorney for Insurance Claim Settlement',
  '[
    {"key":"nama_pemberi_kuasa","label_id":"Nama Pemegang Polis","type":"text","max_length":100,"required":true},
    {"key":"nomor_ktp_pemberi","label_id":"Nomor KTP Pemegang Polis","type":"text","max_length":16,"required":true},
    {"key":"alamat_pemberi","label_id":"Alamat Pemegang Polis","type":"textarea","required":true},
    {"key":"nama_penerima_kuasa","label_id":"Nama Penerima Kuasa (Penerima Klaim)","type":"text","max_length":100,"required":true},
    {"key":"nama_perusahaan_asuransi","label_id":"Nama Perusahaan Asuransi","type":"text","max_length":100,"required":true},
    {"key":"nomor_polis","label_id":"Nomor Polis Asuransi","type":"text","max_length":50,"required":true},
    {"key":"jenis_asuransi","label_id":"Jenis Asuransi (Kesehatan, Jiwa, Properti, dll)","type":"text","max_length":100,"required":true},
    {"key":"tanggal_klaim","label_id":"Tanggal Klaim (Kejadian)","type":"date","required":true}
  ]'::jsonb,
  'Buatlah surat kuasa untuk pencairan klaim asuransi.

Data Pemegang Polis:
- Nama: {{nama_pemberi_kuasa}} (KTP: {{nomor_ktp_pemberi}})
- Alamat: {{alamat_pemberi}}

Penerima Kuasa (Penerima Klaim):
- Nama: {{nama_penerima_kuasa}}

Data Asuransi:
- Perusahaan: {{nama_perusahaan_asuransi}}
- Nomor Polis: {{nomor_polis}}
- Jenis: {{jenis_asuransi}}
- Tanggal Kejadian/Klaim: {{tanggal_klaim}}

Persyaratan:
1. Authority TERBATAS pada "pencairan klaim asuransi saja"
2. Bukan untuk modifikasi polis atau perubahan penerima
3. Nomor polis HARUS tercantum
4. Spesifik jenis asuransi (kesehatan, jiwa, properti)
5. Tanggal klaim jelas
6. Tanda tangan pemegang polis
7. Materai Rp 10.000

Clause Penting:
- "Tidak termasuk wewenang untuk mengubah polis atau penerima"
- "Penerima kuasa hanya berwenang mengurus pencairan klaim"

Output: Surat kuasa untuk pencairan asuransi yang aman dan terbatas.',
  true
);

-- 1.7 kuasa_notaris: Notary Representation Proxy
INSERT INTO public.templates
(type, subtype_id, name_id, name_en, required_fields, prompt_template, requires_materai)
VALUES (
  'kuasa',
  'kuasa_notaris',
  'Surat Kuasa Mewakili Di Hadapan Notaris',
  'Power of Attorney for Representation Before Notary',
  '[
    {"key":"nama_pemberi_kuasa","label_id":"Nama Lengkap Pemberi Kuasa","type":"text","max_length":100,"required":true},
    {"key":"nomor_ktp_pemberi","label_id":"Nomor KTP Pemberi Kuasa","type":"text","max_length":16,"required":true},
    {"key":"alamat_pemberi","label_id":"Alamat Pemberi Kuasa","type":"textarea","required":true},
    {"key":"nama_penerima_kuasa","label_id":"Nama Penerima Kuasa (Perwakilan)","type":"text","max_length":100,"required":true},
    {"key":"nama_notaris","label_id":"Nama Notaris (Opsional, jika sudah dipilih)","type":"text","max_length":100,"required":false},
    {"key":"lokasi_notaris","label_id":"Lokasi Kantor Notaris (Kota)","type":"text","max_length":50,"required":true},
    {"key":"jenis_akta","label_id":"Jenis Akta yang Akan Ditandatangani (e.g., Akta Jual Beli, Akta Pinjam)","type":"text","max_length":100,"required":true}
  ]'::jsonb,
  'Buatlah surat kuasa untuk MEREPRESENTASIKAN pemberi kuasa di hadapan notaris.

⚠️ IMPORTANT: Penerima kuasa HANYA mewakili pemberi kuasa HADIR ke notaris.
Hanya NOTARIS yang menandatangani akta (bukan penerima kuasa).

Data Pemberi:
- Nama: {{nama_pemberi_kuasa}} (KTP: {{nomor_ktp_pemberi}})
- Alamat: {{alamat_pemberi}}

Penerima Kuasa:
- Nama: {{nama_penerima_kuasa}}
- Lokasi Notaris: {{lokasi_notaris}}

Akta yang Dimaksud:
- Jenis: {{jenis_akta}}
- Notaris: {{nama_notaris}}

Persyaratan:
1. Jelas bahwa kuasa ini HANYA untuk REPRESENTASI (kehadiran) ke notaris
2. Notaris akan menandatangani, BUKAN penerima kuasa
3. Penerima kuasa HADIR untuk memberikan instruksi
4. Spesifik jenis akta (Jual Beli, Pinjam, Hibah, dll)
5. Lokasi notaris jelas
6. Tanda tangan pemberi kuasa
7. Materai Rp 10.000

DISCLAIMER PENTING:
"Penerima kuasa hanya berwenang merepresentasikan pemberi kuasa di hadapan notaris.
Hanya notaris yang memiliki wewenang menandatangani akta notariat."

Output: Surat kuasa representasi notaris yang legal dan aman.',
  true
);

-- 1.8 kuasa_bpkb: Vehicle Registration (BPKB) Proxy
INSERT INTO public.templates
(type, subtype_id, name_id, name_en, required_fields, prompt_template, requires_materai)
VALUES (
  'kuasa',
  'kuasa_bpkb',
  'Surat Kuasa Perpanjangan BPKB & Registrasi Kendaraan',
  'Power of Attorney for Vehicle Registration (BPKB)',
  '[
    {"key":"nama_pemberi_kuasa","label_id":"Nama Pemilik Kendaraan","type":"text","max_length":100,"required":true},
    {"key":"nomor_ktp_pemberi","label_id":"Nomor KTP Pemilik","type":"text","max_length":16,"required":true},
    {"key":"alamat_pemberi","label_id":"Alamat Pemilik","type":"textarea","required":true},
    {"key":"nama_penerima_kuasa","label_id":"Nama Penerima Kuasa","type":"text","max_length":100,"required":true},
    {"key":"nomor_bpkb","label_id":"Nomor BPKB (Bukti Kepemilikan Kendaraan Bermotor)","type":"text","max_length":50,"required":true},
    {"key":"nomor_polisi","label_id":"Nomor Polisi","type":"text","max_length":20,"required":true},
    {"key":"merek_kendaraan","label_id":"Merek Kendaraan","type":"text","max_length":50,"required":true},
    {"key":"nomor_rangka","label_id":"Nomor Rangka Kendaraan","type":"text","max_length":50,"required":true},
    {"key":"nomor_mesin","label_id":"Nomor Mesin Kendaraan","type":"text","max_length":50,"required":true},
    {"key":"polda_terkait","label_id":"POLDA/SATLANTAS Terkait (untuk registrasi)","type":"text","max_length":100,"required":true}
  ]'::jsonb,
  'Buatlah surat kuasa untuk perpanjangan dan registrasi BPKB kendaraan.

Data Pemilik:
- Nama: {{nama_pemberi_kuasa}} (KTP: {{nomor_ktp_pemberi}})
- Alamat: {{alamat_pemberi}}

Penerima Kuasa:
- Nama: {{nama_penerima_kuasa}}

Data Kendaraan (HARUS LENGKAP):
- Nomor Polisi: {{nomor_polisi}}
- Merek: {{merek_kendaraan}}
- Nomor BPKB: {{nomor_bpkb}}
- Nomor Rangka: {{nomor_rangka}}
- Nomor Mesin: {{nomor_mesin}}
- POLDA: {{polda_terkait}}

Persyaratan:
1. DATA KENDARAAN LENGKAP (semua nomor harus ada)
2. Authority terbatas pada REGISTRASI & PERPANJANGAN BPKB
3. Bukan untuk PENJUALAN atau HIBAH
4. Spesifik lokasi POLDA untuk registrasi
5. Tanda tangan pemilik
6. Materai Rp 10.000

SCOPE JELAS:
- Authority hanya untuk: perpanjangan STNK, registrasi BPKB, pembayaran pajak
- BUKAN untuk menjual atau menghibahkan kendaraan
- BUKAN untuk mengubah kepemilikan

Output: Surat kuasa BPKB yang detail dan aman untuk registrasi kendaraan.',
  true
);

-- ============================================================
-- 2. SURAT JUAL BELI (Sale & Purchase) — 4 subtypes
-- ============================================================

-- 2.1 surat_jual_beli_tanah: Land Sale Agreement
INSERT INTO public.templates
(type, subtype_id, name_id, name_en, required_fields, prompt_template, requires_materai)
VALUES (
  'surat_jual',
  'surat_jual_beli_tanah',
  'Surat Jual Beli Tanah',
  'Land Sale Agreement',
  '[
    {"key":"nama_penjual","label_id":"Nama Lengkap Penjual","type":"text","max_length":100,"required":true},
    {"key":"nomor_ktp_penjual","label_id":"Nomor KTP Penjual","type":"text","max_length":16,"required":true},
    {"key":"alamat_penjual","label_id":"Alamat Penjual","type":"textarea","required":true},
    {"key":"nama_pembeli","label_id":"Nama Lengkap Pembeli","type":"text","max_length":100,"required":true},
    {"key":"nomor_ktp_pembeli","label_id":"Nomor KTP Pembeli","type":"text","max_length":16,"required":true},
    {"key":"alamat_pembeli","label_id":"Alamat Pembeli","type":"textarea","required":true},
    {"key":"alamat_tanah","label_id":"Alamat Tanah Lengkap","type":"textarea","required":true},
    {"key":"nomor_sertifikat","label_id":"Nomor Sertifikat Hak Milik (SHM)","type":"text","max_length":50,"required":true},
    {"key":"luas_tanah","label_id":"Luas Tanah (m²)","type":"number","required":true},
    {"key":"harga_jual","label_id":"Harga Jual Tanah (Rp)","type":"number","required":true},
    {"key":"tata_cara_pembayaran","label_id":"Tata Cara Pembayaran (Tunai/Cicilan/Transfer)","type":"text","max_length":50,"required":true},
    {"key":"tanggal_serah_terima","label_id":"Tanggal Serah Terima Tanah (Rencana)","type":"date","required":true},
    {"key":"kabupaten_kota","label_id":"Kabupaten/Kota","type":"text","max_length":50,"required":true}
  ]'::jsonb,
  '⚠️ CRITICAL: Ini adalah DRAF perjanjian jual beli tanah SAJA.
Untuk transaksi SAH secara hukum, HARUS ditandatangani di hadapan NOTARIS.

Buatlah perjanjian jual beli tanah yang lengkap dan sesuai KUH Perdata.

DATA PENJUAL:
- Nama: {{nama_penjual}} (KTP: {{nomor_ktp_penjual}})
- Alamat: {{alamat_penjual}}

DATA PEMBELI:
- Nama: {{nama_pembeli}} (KTP: {{nomor_ktp_pembeli}})
- Alamat: {{alamat_pembeli}}

DATA TANAH:
- Lokasi: {{alamat_tanah}}
- Sertifikat: {{nomor_sertifikat}} (SHM)
- Luas: {{luas_tanah}} m²
- Harga: Rp {{harga_jual}} (JELAS dalam angka dan huruf)
- Pembayaran: {{tata_cara_pembayaran}}
- Serah Terima: {{tanggal_serah_terima}}
- BPN: {{kabupaten_kota}}

PERSYARATAN WAJIB:
1. Data lengkap penjual dan pembeli (KTP, alamat)
2. Data tanah spesifik (sertifikat, alamat, luas, harga)
3. HARGA dalam angka DAN terbilang dalam Rupiah
4. Kondisi tanah (kosong, ada bangunan, dll)
5. Bukti kepemilikan penjual (sertifikat asli)
6. Tanda tangan KEDUA belah pihak
7. Tanggal perjanjian jelas
8. Materai Rp 10.000 pada setiap copy

DISCLAIMER NOTARIS (HARUS DICANTUMKAN):
"Perjanjian ini adalah DRAF. Untuk transaksi yang sah secara hukum, kedua belah pihak
HARUS menandatangani di hadapan notaris resmi. Tanpa akta notaris, transaksi tanah
tidak diakui BPN dan tidak dapat didaftar balik nama."

PROSES SETELAH PENANDATANGANAN:
1. ✓ Verifikasi sertifikat original di BPN
2. ✓ Pembayaran (melalui bank/escrow)
3. ✓ Penandatanganan akta NOTARIS
4. ✓ Proses balik nama di BPN
5. ✓ Penerima sertifikat baru (atas nama pembeli)

Output: Perjanjian jual beli tanah yang detail, legal, dan siap untuk notarisasi.',
  true
);

-- 2.2 surat_jual_beli_barang: Goods Sale Agreement
INSERT INTO public.templates
(type, subtype_id, name_id, name_en, required_fields, prompt_template, requires_materai)
VALUES (
  'surat_jual',
  'surat_jual_beli_barang',
  'Surat Jual Beli Barang',
  'Goods Sale Agreement',
  '[
    {"key":"nama_penjual","label_id":"Nama Penjual","type":"text","max_length":100,"required":true},
    {"key":"alamat_penjual","label_id":"Alamat Penjual","type":"textarea","required":true},
    {"key":"nama_pembeli","label_id":"Nama Pembeli","type":"text","max_length":100,"required":true},
    {"key":"alamat_pembeli","label_id":"Alamat Pembeli","type":"textarea","required":true},
    {"key":"deskripsi_barang","label_id":"Deskripsi Barang (merek, spesifikasi, kondisi)","type":"textarea","required":true},
    {"key":"jumlah_barang","label_id":"Jumlah Barang","type":"number","required":true},
    {"key":"satuan_barang","label_id":"Satuan (unit, set, lot, dll)","type":"text","max_length":50,"required":true},
    {"key":"harga_satuan","label_id":"Harga Per Satuan (Rp)","type":"number","required":true},
    {"key":"harga_total","label_id":"Harga Total (Rp)","type":"number","required":true},
    {"key":"tata_cara_pembayaran","label_id":"Tata Cara Pembayaran","type":"text","max_length":100,"required":true},
    {"key":"waktu_penyerahan","label_id":"Waktu Penyerahan Barang","type":"text","max_length":100,"required":true},
    {"key":"tempat_penyerahan","label_id":"Tempat Penyerahan Barang","type":"text","max_length":100,"required":true},
    {"key":"garansi_barang","label_id":"Garansi Barang (Iya/Tidak)","type":"text","required":false}
  ]'::jsonb,
  'Buatlah perjanjian jual beli barang yang jelas dan mengikat.

DATA PENJUAL:
- Nama: {{nama_penjual}}
- Alamat: {{alamat_penjual}}

DATA PEMBELI:
- Nama: {{nama_pembeli}}
- Alamat: {{alamat_pembeli}}

DATA BARANG:
- Deskripsi: {{deskripsi_barang}}
- Jumlah: {{jumlah_barang}} {{satuan_barang}}
- Harga: Rp {{harga_satuan}} per {{satuan_barang}} = Rp {{harga_total}} (total)
- Garansi: {{garansi_barang}}

PEMBAYARAN & PENYERAHAN:
- Cara Pembayaran: {{tata_cara_pembayaran}}
- Waktu Penyerahan: {{waktu_penyerahan}}
- Tempat Penyerahan: {{tempat_penyerahan}}

PERSYARATAN WAJIB:
1. Deskripsi barang spesifik (merek, tipe, kondisi)
2. Harga satuan DAN total (dalam Rupiah, jelas)
3. Syarat pembayaran (tunai, DP, cicilan, dll)
4. Tanggal/waktu penyerahan barang jelas
5. Tempat penyerahan spesifik
6. Garansi (jika ada): durasi, cakupan, kondisi
7. Tanda tangan kedua belah pihak
8. Tanggal perjanjian
9. Materai Rp 10.000

CLAUSE PENTING:
- Kondisi barang "sebagaimana adanya" atau dengan garansi
- Penolakan barang (jika rusak/cacat) deadline
- Biaya pengiriman (ditanggung siapa)
- Risiko kerusakan barang (saat transit, dll)

Output: Perjanjian jual beli barang yang lengkap dan aman.',
  true
);

-- 2.3 surat_jual_beli_kendaraan: Vehicle Sale Agreement
INSERT INTO public.templates
(type, subtype_id, name_id, name_en, required_fields, prompt_template, requires_materai)
VALUES (
  'surat_jual',
  'surat_jual_beli_kendaraan',
  'Surat Jual Beli Kendaraan Bermotor',
  'Vehicle Sale Agreement',
  '[
    {"key":"nama_penjual","label_id":"Nama Penjual","type":"text","max_length":100,"required":true},
    {"key":"nomor_ktp_penjual","label_id":"Nomor KTP Penjual","type":"text","max_length":16,"required":true},
    {"key":"alamat_penjual","label_id":"Alamat Penjual","type":"textarea","required":true},
    {"key":"nama_pembeli","label_id":"Nama Pembeli","type":"text","max_length":100,"required":true},
    {"key":"nomor_ktp_pembeli","label_id":"Nomor KTP Pembeli","type":"text","max_length":16,"required":true},
    {"key":"alamat_pembeli","label_id":"Alamat Pembeli","type":"textarea","required":true},
    {"key":"merek_kendaraan","label_id":"Merek Kendaraan","type":"text","max_length":50,"required":true},
    {"key":"nomor_polisi","label_id":"Nomor Polisi","type":"text","max_length":20,"required":true},
    {"key":"tahun_kendaraan","label_id":"Tahun Pembuatan","type":"number","required":true},
    {"key":"nomor_rangka","label_id":"Nomor Rangka","type":"text","max_length":50,"required":true},
    {"key":"nomor_mesin","label_id":"Nomor Mesin","type":"text","max_length":50,"required":true},
    {"key":"nomor_bpkb","label_id":"Nomor BPKB","type":"text","max_length":50,"required":true},
    {"key":"nomor_stnk","label_id":"Nomor STNK","type":"text","max_length":50,"required":true},
    {"key":"harga_jual","label_id":"Harga Jual (Rp)","type":"number","required":true},
    {"key":"kondisi_kendaraan","label_id":"Kondisi (Baik/Sedang/Rusak dengan detail)","type":"textarea","required":true},
    {"key":"garansi_kendaraan","label_id":"Garansi (Mesin, Cat, Interior) atau Sebagaimana Adanya","type":"textarea","required":false},
    {"key":"hutang_kendaraan","label_id":"Hutang/Cicilan Kendaraan (Ada/Tidak)","type":"text","required":true},
    {"key":"pajak_status","label_id":"Status Pajak (Lunas/Menunggak sampai tgl...)","type":"text","required":true}
  ]'::jsonb,
  'Buatlah perjanjian jual beli kendaraan bermotor yang lengkap dan aman.

DATA PENJUAL:
- Nama: {{nama_penjual}} (KTP: {{nomor_ktp_penjual}})
- Alamat: {{alamat_penjual}}

DATA PEMBELI:
- Nama: {{nama_pembeli}} (KTP: {{nomor_ktp_pembeli}})
- Alamat: {{alamat_pembeli}}

DATA KENDARAAN:
- Merek: {{merek_kendaraan}}
- Tahun: {{tahun_kendaraan}}
- Nomor Polisi: {{nomor_polisi}}
- Nomor Rangka: {{nomor_rangka}}
- Nomor Mesin: {{nomor_mesin}}
- BPKB: {{nomor_bpkb}}
- STNK: {{nomor_stnk}}

KONDISI & GARANSI:
- Kondisi: {{kondisi_kendaraan}}
- Garansi: {{garansi_kendaraan}}
- Hutang: {{hutang_kendaraan}}
- Pajak: {{pajak_status}}

HARGA: Rp {{harga_jual}} (dalam angka dan huruf)

PERSYARATAN WAJIB:
1. DATA KENDARAAN LENGKAP (semua nomor harus ada)
2. Kondisi kendaraan detail (mesin, cat, interior, kerusakan jika ada)
3. Garansi spesifik atau "sebagaimana adanya"
4. HARGA JELAS (dalam Rupiah)
5. Status hutang: ada/tidak ada
6. Status pajak (lunas/menunggak)
7. Tanda tangan kedua belah pihak
8. Tanggal transaksi
9. Materai Rp 10.000

DISCLOSURE WAJIB (PENJUAL):
- Tidak ada hutang/cicilan tertunggak
- Tidak ada pengaduan polisi / tilang
- Bukan kendaraan curian / incaran hukum

PEMBELI HARUS:
✓ Verifikasi dokumen kendaraan di SAMSAT
✓ Periksa kondisi fisik langsung
✓ Pastikan penjual hak milik sah
✓ Lakukan BALIK NAMA di SAMSAT dalam 7 hari setelah transaksi

Output: Perjanjian jual beli kendaraan yang aman dan komprehensif.',
  true
);

-- 2.4 surat_jual_beli_rumah: House Sale Agreement
INSERT INTO public.templates
(type, subtype_id, name_id, name_en, required_fields, prompt_template, requires_materai)
VALUES (
  'surat_jual',
  'surat_jual_beli_rumah',
  'Surat Jual Beli Rumah',
  'House Sale Agreement',
  '[
    {"key":"nama_penjual","label_id":"Nama Penjual","type":"text","max_length":100,"required":true},
    {"key":"nomor_ktp_penjual","label_id":"Nomor KTP Penjual","type":"text","max_length":16,"required":true},
    {"key":"alamat_penjual","label_id":"Alamat Penjual","type":"textarea","required":true},
    {"key":"nama_pembeli","label_id":"Nama Pembeli","type":"text","max_length":100,"required":true},
    {"key":"nomor_ktp_pembeli","label_id":"Nomor KTP Pembeli","type":"text","max_length":16,"required":true},
    {"key":"alamat_pembeli","label_id":"Alamat Pembeli","type":"textarea","required":true},
    {"key":"alamat_rumah","label_id":"Alamat Rumah Lengkap","type":"textarea","required":true},
    {"key":"nomor_sertifikat","label_id":"Nomor Sertifikat (SHM/HGU)","type":"text","max_length":50,"required":true},
    {"key":"luas_tanah","label_id":"Luas Tanah (m²)","type":"number","required":true},
    {"key":"luas_bangunan","label_id":"Luas Bangunan (m²)","type":"number","required":true},
    {"key":"jumlah_kamar_tidur","label_id":"Jumlah Kamar Tidur","type":"number","required":false},
    {"key":"jumlah_kamar_mandi","label_id":"Jumlah Kamar Mandi","type":"number","required":false},
    {"key":"tahun_dibangun","label_id":"Tahun Dibangun","type":"number","required":false},
    {"key":"harga_jual","label_id":"Harga Jual (Rp)","type":"number","required":true},
    {"key":"kondisi_rumah","label_id":"Kondisi Rumah (Baik/Sedang/Rusak + detail)","type":"textarea","required":true},
    {"key":"fasilitas_utilitas","label_id":"Fasilitas (Listrik, Air, Gas, dll) - Ada/Tidak","type":"textarea","required":true},
    {"key":"hutang_properti","label_id":"Hutang/Cicilan Properti (Ada/Tidak/Detail)","type":"textarea","required":true},
    {"key":"pajak_status","label_id":"Status Pajak & Iuran Bulanan","type":"textarea","required":false},
    {"key":"tata_cara_pembayaran","label_id":"Tata Cara Pembayaran","type":"textarea","required":true},
    {"key":"tanggal_serah_terima","label_id":"Tanggal Serah Terima (Rencana)","type":"date","required":true},
    {"key":"kabupaten_kota","label_id":"Kabupaten/Kota","type":"text","max_length":50,"required":true}
  ]'::jsonb,
  '⚠️ CRITICAL: Ini adalah DRAF perjanjian jual beli rumah SAJA.
Untuk transaksi SAH secara hukum, HARUS melalui NOTARIS RESMI.

Buatlah perjanjian jual beli rumah yang komprehensif dan sesuai KUH Perdata.

DATA PENJUAL:
- Nama: {{nama_penjual}} (KTP: {{nomor_ktp_penjual}})
- Alamat: {{alamat_penjual}}

DATA PEMBELI:
- Nama: {{nama_pembeli}} (KTP: {{nomor_ktp_pembeli}})
- Alamat: {{alamat_pembeli}}

DATA PROPERTI:
- Alamat: {{alamat_rumah}}
- Sertifikat: {{nomor_sertifikat}}
- Tanah: {{luas_tanah}} m²
- Bangunan: {{luas_bangunan}} m²
- Kamar: {{jumlah_kamar_tidur}} tidur, {{jumlah_kamar_mandi}} mandi
- Tahun Bangun: {{tahun_dibangun}}
- Harga: Rp {{harga_jual}}
- Kondisi: {{kondisi_rumah}}
- Fasilitas: {{fasilitas_utilitas}}
- Hutang: {{hutang_properti}}
- Pajak: {{pajak_status}}
- Pembayaran: {{tata_cara_pembayaran}}
- Serah Terima: {{tanggal_serah_terima}}

PERSYARATAN WAJIB:
1. Data lengkap penjual dan pembeli (KTP, alamat)
2. Data properti spesifik (sertifikat, luas, kondisi)
3. HARGA JELAS (dalam angka dan terbilang)
4. Kondisi rumah DETAIL (struktur, kerusakan, cacat tersembunyi)
5. FASILITAS & UTILITAS (listrik, air, gas status)
6. HUTANG/CICILAN (full disclosure)
7. PAJAK & IURAN (PBB, iuran HOA status)
8. Tanda tangan kedua belah pihak
9. Tanggal perjanjian dan serah terima
10. Materai Rp 10.000 pada setiap copy

DISCLAIMER NOTARIS (WAJIB DICANTUMKAN):
"Perjanjian ini adalah DRAF. Untuk transaksi yang SAH secara hukum:
1. HARUS ditandatangani di hadapan NOTARIS RESMI
2. Sertifikat asli harus diverifikasi BPN sebelumnya
3. BPHTB dan PPh harus dihitung dan dibayar
4. Proses balik nama harus di BPN setelah akta notaris
Tanpa notaris, transaksi tidak diakui secara hukum."

DEFECTS DISCLOSURE:
- Penjual wajib mengungkap semua cacat tersembunyi (bocor, rayap, dll)
- Jika cacat disembunyikan, pembeli bisa menuntut pembatalan + ganti rugi

PROSES SETELAH SIGNING:
1. ✓ Verifikasi sertifikat original
2. ✓ Perhitungan BPHTB & PPh
3. ✓ Penandatanganan di hadapan NOTARIS
4. ✓ Pembayaran
5. ✓ Proses balik nama BPN
6. ✓ Serah terima kunci & dokumen

Output: Perjanjian jual beli rumah yang detail, legal, dan siap notarisasi.',
  true
);
