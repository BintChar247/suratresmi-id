-- SuratResmi.Online — Template Seeding Script (Part 1 of 2)
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
-- SuratResmi.Online — Template Seeding Script (Part 2 of 2)
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
-- SuratResmi.Online — Template Seeding Script (Part 3 of 3)
-- Run this in Supabase SQL Editor AFTER Parts 1 & 2
-- Templates: Perjanjian Utang (5 subtypes) + Surat Pernyataan (6 subtypes)

-- ============================================================
-- 5. PERJANJIAN UTANG (Loan/Debt Agreements) — 5 subtypes
-- ============================================================

-- 5.1 perj_utang_pribadi: Personal Loan Agreement
INSERT INTO public.templates (type, subtype_id, name_id, name_en, required_fields, prompt_template, requires_materai) VALUES
('perj_utang', 'perj_utang_pribadi', 'Perjanjian Pinjam Uang Pribadi', 'Personal Loan Agreement',
'[{"key":"nama_pemberi_pinjam","label_id":"Nama Pemberi Pinjam (Kreditur)","type":"text","max_length":100,"required":true},{"key":"nomor_ktp_pemberi","label_id":"Nomor KTP Pemberi","type":"text","max_length":16,"required":true},{"key":"alamat_pemberi","label_id":"Alamat Pemberi","type":"textarea","required":true},{"key":"nama_peminjam","label_id":"Nama Peminjam (Debitur)","type":"text","max_length":100,"required":true},{"key":"nomor_ktp_peminjam","label_id":"Nomor KTP Peminjam","type":"text","max_length":16,"required":true},{"key":"alamat_peminjam","label_id":"Alamat Peminjam","type":"textarea","required":true},{"key":"jumlah_pinjam","label_id":"Jumlah Pinjam (Rp)","type":"number","required":true},{"key":"bunga_persen","label_id":"Bunga (% per tahun, atau 0 jika tanpa bunga)","type":"number","required":true},{"key":"jangka_waktu_bulan","label_id":"Jangka Waktu (bulan)","type":"number","required":true},{"key":"tanggal_pencairan","label_id":"Tanggal Pencairan Dana","type":"date","required":true},{"key":"tanggal_jatuh_tempo","label_id":"Tanggal Jatuh Tempo (pelunasan)","type":"date","required":true},{"key":"tata_cara_pembayaran","label_id":"Tata Cara Pembayaran (Lump Sum/Cicilan)","type":"text","max_length":100,"required":true},{"key":"denda_keterlambatan","label_id":"Denda Keterlambatan (Rp/hari atau %)","type":"text","max_length":100,"required":false},{"key":"ada_tanggungan","label_id":"Ada Tanggungan/Jaminan? (Ya/Tidak/Detail)","type":"text","max_length":100,"required":false}]',
'Buatlah perjanjian pinjam uang pribadi yang jelas dan legal.

DATA PEMBERI PINJAM (KREDITUR):
- Nama: {{nama_pemberi_pinjam}} (KTP: {{nomor_ktp_pemberi}})
- Alamat: {{alamat_pemberi}}

DATA PEMINJAM (DEBITUR):
- Nama: {{nama_peminjam}} (KTP: {{nomor_ktp_peminjam}})
- Alamat: {{alamat_peminjam}}

DETAIL PINJAMAN:
- Jumlah: Rp {{jumlah_pinjam}} (terbilang: ...)
- Bunga: {{bunga_persen}}% per tahun
- Durasi: {{jangka_waktu_bulan}} bulan
- Pencairan: {{tanggal_pencairan}}
- Jatuh Tempo: {{tanggal_jatuh_tempo}}
- Pembayaran: {{tata_cara_pembayaran}}
- Denda Telat: {{denda_keterlambatan}}
- Jaminan: {{ada_tanggungan}}

PERSYARATAN WAJIB:
1. JUMLAH JELAS: Rp dalam angka dan terbilang
2. BUNGA: % per tahun (jika ada), atau 0% jika tanpa bunga
3. DURASI: Bulan jelas, atau tanggal jatuh tempo
4. PEMBAYARAN: Lump sum atau cicilan (berapa kali)
5. DENDA: Keterlambatan (Rp/hari atau %)
6. JAMINAN: Ada atau tidak (jika ada, detail apa)
7. TANDA TANGAN: Kreditur dan debitur
8. SAKSI: Minimal 2 orang (recommended)
9. MATERAI: Rp 10.000

BUNGA CLAUSE:
"Bunga adalah {{bunga_persen}}% per tahun dari pokok pinjam.
Total bunga = Rp {{jumlah_pinjam}} x {{bunga_persen}}% = Rp [dihitung]
Total yang harus dibayar kembali = Rp {{jumlah_pinjam}} + Rp [bunga]"

DENDA CLAUSE:
"Jika pembayaran terlambat lebih dari {{denda_hari}} hari dari jadwal,
peminjam dikenakan denda {{denda_keterlambatan}}.
Denda terus bertambah setiap {{denda_period}} hari."

JAMINAN CLAUSE (jika ada):
"Peminjam memberikan jaminan: {{ada_tanggungan}}
Jika peminjam wanprestasi, pemberi pinjam berhak menjual jaminan untuk
melunasi sisa pinjaman."

Output: Perjanjian pinjam pribadi yang legal dan fair.',
true);

-- 5.2 perj_utang_bisnis: Business Loan Agreement
INSERT INTO public.templates (type, subtype_id, name_id, name_en, required_fields, prompt_template, requires_materai) VALUES
('perj_utang', 'perj_utang_bisnis', 'Perjanjian Pinjam Uang Bisnis', 'Business Loan Agreement',
'[{"key":"nama_pemberi_pinjam","label_id":"Nama Pemberi Pinjam (Bank/Investor)","type":"text","max_length":100,"required":true},{"key":"nama_peminjam","label_id":"Nama Peminjam (Individu/Perusahaan)","type":"text","max_length":100,"required":true},{"key":"nomor_identitas_peminjam","label_id":"Nomor KTP / NPWP Peminjam","type":"text","max_length":50,"required":true},{"key":"nama_perusahaan_peminjam","label_id":"Nama Perusahaan (jika peminjam perusahaan)","type":"text","max_length":100,"required":false},{"key":"jumlah_pinjam","label_id":"Jumlah Pinjam (Rp)","type":"number","required":true},{"key":"tujuan_pinjam","label_id":"Tujuan Pinjam (Pembelian Aset/Modal Kerja/Ekspansi)","type":"textarea","required":true},{"key":"bunga_persen","label_id":"Bunga (% per tahun)","type":"number","required":true},{"key":"jangka_waktu_bulan","label_id":"Jangka Waktu (bulan)","type":"number","required":true},{"key":"tanggal_pencairan","label_id":"Tanggal Pencairan","type":"date","required":true},{"key":"tata_cara_pembayaran_cicilan","label_id":"Tata Cara Pembayaran (Cicilan Per Bulan: Rp berapa)","type":"number","required":true},{"key":"tanggal_jatuh_tempo","label_id":"Tanggal Jatuh Tempo Pelunasan","type":"date","required":true},{"key":"jaminan_aset","label_id":"Jaminan/Collateral (Deskripsi Aset)","type":"textarea","required":true},{"key":"denda_keterlambatan","label_id":"Denda Keterlambatan (Rp/hari atau %)","type":"text","max_length":100,"required":false},{"key":"pencepatan_pembayaran","label_id":"Klausul Percepatan (Jika default >X hari, sisa jatuh tempo)","type":"text","max_length":100,"required":false}]',
'Buatlah perjanjian pinjam bisnis yang komprehensif dan melindungi kedua belah pihak.

DATA PEMBERI PINJAM:
- Nama: {{nama_pemberi_pinjam}}

DATA PEMINJAM:
- Nama: {{nama_peminjam}} (ID: {{nomor_identitas_peminjam}})
- Perusahaan: {{nama_perusahaan_peminjam}}

DETAIL PINJAMAN BISNIS:
- Jumlah: Rp {{jumlah_pinjam}}
- Tujuan: {{tujuan_pinjam}}
- Bunga: {{bunga_persen}}% per tahun
- Durasi: {{jangka_waktu_bulan}} bulan
- Pencairan: {{tanggal_pencairan}}
- Cicilan/Bulan: Rp {{tata_cara_pembayaran_cicilan}}
- Jatuh Tempo: {{tanggal_jatuh_tempo}}
- Jaminan: {{jaminan_aset}}
- Denda: {{denda_keterlambatan}}
- Akselerasi: {{pencepatan_pembayaran}}

PERSYARATAN WAJIB (BISNIS):
1. TUJUAN JELAS: Penggunaan dana (aset, modal kerja, ekspansi)
2. JUMLAH & BUNGA: Rp jelas, % per tahun terukur
3. CICILAN: Berapa Rp per bulan, total berapa cicilan
4. JAMINAN: Aset apa yang dijaminkan, nilai aset
5. LIEN: Jaminan didaftarkan atas nama pemberi pinjam
6. DEFAULT CLAUSE: Apa yang dianggap wanprestasi
7. AKSELERASI: Jika default, sisa cicilan jatuh tempo langsung
8. ENFORCEMENT: Cara menjual jaminan jika default
9. TANDA TANGAN: Kedua belah pihak + notaris (recommended untuk jumlah besar)

JAMINAN CLAUSE:
"Peminjam memberikan jaminan: {{jaminan_aset}}
Pemberi pinjam berhak mendaftarkan hak tanggungan/gadai (jika aset tetap).
Jika peminjam wanprestasi, pemberi pinjam berhak menjual jaminan
untuk melunasi sisa pinjaman dan biaya penjualan."

AKSELERASI CLAUSE:
"Jika peminjam terlambat membayar cicilan lebih dari {{pencepatan_pembayaran}},
seluruh sisa saldo pinjaman (pokok + bunga) dinyatakan jatuh tempo
dan harus dibayar segera oleh peminjam."

DEFAULT DEFINITION:
"Peminjam dianggap wanprestasi jika:
1. Terlambat bayar cicilan > {{default_hari}} hari
2. Tidak memenuhi financial covenants (jika ada)
3. Mengalami kebangkrutan atau likuidasi
4. Menjual/mengalihkan jaminan tanpa izin pemberi pinjam"

Output: Perjanjian pinjam bisnis yang aman dan comprehensive.',
true);

-- 5.3 perj_utang_dengan_bunga: Loan with Interest
INSERT INTO public.templates (type, subtype_id, name_id, name_en, required_fields, prompt_template, requires_materai) VALUES
('perj_utang', 'perj_utang_dengan_bunga', 'Perjanjian Pinjam Dengan Bunga', 'Loan Agreement with Interest',
'[{"key":"nama_pemberi_pinjam","label_id":"Nama Pemberi Pinjam","type":"text","max_length":100,"required":true},{"key":"nama_peminjam","label_id":"Nama Peminjam","type":"text","max_length":100,"required":true},{"key":"jumlah_pinjam","label_id":"Jumlah Pinjam (Rp)","type":"number","required":true},{"key":"bunga_persen_tahunan","label_id":"Bunga (% per tahun)","type":"number","required":true},{"key":"jangka_waktu_bulan","label_id":"Jangka Waktu (bulan)","type":"number","required":true},{"key":"tanggal_pencairan","label_id":"Tanggal Pencairan Dana","type":"date","required":true},{"key":"jadwal_cicilan","label_id":"Jadwal Cicilan (Pokok + Bunga: Rp per bulan)","type":"number","required":true},{"key":"tanggal_jatuh_tempo","label_id":"Tanggal Jatuh Tempo Final","type":"date","required":true},{"key":"metode_perhitungan_bunga","label_id":"Metode Bunga (Flat/Diminishing/Compound)","type":"text","max_length":50,"required":true},{"key":"denda_telat","label_id":"Denda Keterlambatan (Rp/hari atau %)","type":"text","max_length":100,"required":false},{"key":"prepayment_allowed","label_id":"Boleh Pelunasan Dipercepat? (Ya/Tidak/Dengan Penalty)","type":"text","max_length":100,"required":false}]',
'Buatlah perjanjian pinjam dengan bunga yang transparan dan jelas.

DATA:
- Pemberi: {{nama_pemberi_pinjam}}
- Peminjam: {{nama_peminjam}}

PINJAMAN:
- Pokok: Rp {{jumlah_pinjam}}
- Bunga: {{bunga_persen_tahunan}}% per tahun
- Metode: {{metode_perhitungan_bunga}}
- Durasi: {{jangka_waktu_bulan}} bulan
- Cicilan: Rp {{jadwal_cicilan}}/bulan (pokok + bunga)
- Pencairan: {{tanggal_pencairan}}
- Jatuh Tempo: {{tanggal_jatuh_tempo}}
- Denda: {{denda_telat}}
- Prepayment: {{prepayment_allowed}}

PERSYARATAN BUNGA:
1. BUNGA JELAS: % per tahun, metode perhitungan spesifik
2. PERHITUNGAN: Total bunga hitung untuk seluruh periode
3. CICILAN: Rp berapa per bulan (pokok berapa, bunga berapa)
4. DISCLOSURE: Peminjam harus tahu total yang akan dibayar
5. VERIFIKASI USURY: Bunga wajar (< 30%/tahun untuk informal lending)

PERHITUNGAN BUNGA:
"Metode: {{metode_perhitungan_bunga}}
- Flat: Bunga = Rp {{jumlah_pinjam}} x {{bunga_persen_tahunan}}% = Rp [total] per tahun
- Diminishing: Bunga dihitung atas sisa pokok, berkurang setiap bulan
- Compound: Bunga berbunga (bunga ditambah setiap periode)

Cicilan bulanan = [Rp {{jadwal_cicilan}}] (pokok + bunga)
Total dibayar = Rp {{jadwal_cicilan}} x {{jangka_waktu_bulan}} bulan"

DENDA:
"Jika pembayaran terlambat > {{denda_hari}} hari, peminjam dikenakan denda {{denda_telat}}."

PREPAYMENT:
"Peminjam {{prepayment_allowed}} melakukan pelunasan lebih awal.
Jika ada, pengurangan bunga dihitung sesuai periode yang tersisa."

USURY WARNING:
"⚠️ Bunga {{bunga_persen_tahunan}}% per tahun adalah {{wajar_or_tinggi}}.
Jika dianggap terlalu tinggi (riba), pengadilan bisa membatalkan perjanjian
dan memerintahkan pengembalian ke pokok saja (bunga dibatalkan)."

Output: Perjanjian pinjam berbunga yang transparan.',
true);

-- 5.4 perj_utang_tanpa_bunga: Interest-Free Loan
INSERT INTO public.templates (type, subtype_id, name_id, name_en, required_fields, prompt_template, requires_materai) VALUES
('perj_utang', 'perj_utang_tanpa_bunga', 'Perjanjian Pinjam Tanpa Bunga', 'Interest-Free Loan Agreement',
'[{"key":"nama_pemberi_pinjam","label_id":"Nama Pemberi Pinjam","type":"text","max_length":100,"required":true},{"key":"nama_peminjam","label_id":"Nama Peminjam","type":"text","max_length":100,"required":true},{"key":"jumlah_pinjam","label_id":"Jumlah Pinjam (Rp)","type":"number","required":true},{"key":"jangka_waktu_bulan","label_id":"Jangka Waktu Pengembalian (bulan)","type":"number","required":true},{"key":"tanggal_pencairan","label_id":"Tanggal Pencairan Dana","type":"date","required":true},{"key":"tanggal_jatuh_tempo","label_id":"Tanggal Jatuh Tempo (Pelunasan)","type":"date","required":true},{"key":"tata_cara_pembayaran","label_id":"Tata Cara Pembayaran (Lump Sum / Cicilan)","type":"text","max_length":100,"required":true},{"key":"bisa_dicicil","label_id":"Jika Cicilan, berapa Rp per cicilan","type":"number","required":false},{"key":"biaya_administrasi","label_id":"Ada Biaya Administrasi? (Rp atau Tidak Ada)","type":"text","max_length":100,"required":false}]',
'Buatlah perjanjian pinjam tanpa bunga yang jelas dan fair.

DATA:
- Pemberi: {{nama_pemberi_pinjam}}
- Peminjam: {{nama_peminjam}}

PINJAMAN:
- Pokok: Rp {{jumlah_pinjam}} (TANPA BUNGA)
- Durasi: {{jangka_waktu_bulan}} bulan
- Pencairan: {{tanggal_pencairan}}
- Jatuh Tempo: {{tanggal_jatuh_tempo}}
- Pembayaran: {{tata_cara_pembayaran}}
- Cicilan: {{bika_dicicil}} (jika cicilan)
- Biaya Admin: {{biaya_administrasi}}

PERSYARATAN:
1. BUNGA: TIDAK ADA (0%)
2. POKOK SAJA: Peminjam hanya bayar pokok yang dipinjam
3. DURASI JELAS: Tanggal jatuh tempo pasti
4. PEMBAYARAN: Lump sum atau cicilan (spesifik jumlah)
5. BIAYA: Admin fee (jika ada) harus dinyatakan
6. KETENTUAN: Jelas kalau tanpa bunga (mutual agreement)

CLAUSE TANPA BUNGA:
"Ini adalah pinjaman tanpa bunga (zero interest loan).
Peminjam hanya wajib mengembalikan pokok pinjam sebesar Rp {{jumlah_pinjam}}.
Tidak ada bunga atau biaya tambahan (kecuali biaya administrasi jika dinyatakan)."

PEMBAYARAN:
"Peminjam akan mengembalikan dana sebesar Rp {{jumlah_pinjam}} pada {{tanggal_jatuh_tempo}}.
Pembayaran dilakukan dengan cara: {{tata_cara_pembayaran}}
{{detail_cicilan_jika_ada}}"

Output: Perjanjian pinjam tanpa bunga yang simple dan fair.',
true);

-- 5.5 perj_cicilan: Installment Agreement
INSERT INTO public.templates (type, subtype_id, name_id, name_en, required_fields, prompt_template, requires_materai) VALUES
('perj_utang', 'perj_cicilan', 'Perjanjian Cicilan', 'Installment Agreement',
'[{"key":"nama_kreditur","label_id":"Nama Kreditur (Pemberi Barang/Uang)","type":"text","max_length":100,"required":true},{"key":"nama_debitur","label_id":"Nama Debitur (Penerima Barang/Uang)","type":"text","max_length":100,"required":true},{"key":"deskripsi_barang_atau_uang","label_id":"Deskripsi Barang/Uang yang Dicicil","type":"textarea","required":true},{"key":"harga_total","label_id":"Harga Total (Rp)","type":"number","required":true},{"key":"jumlah_cicilan","label_id":"Jumlah Cicilan (berapa kali)","type":"number","required":true},{"key":"nilai_cicilan_perbulan","label_id":"Nilai Cicilan Per Bulan (Rp)","type":"number","required":true},{"key":"tanggal_mulai_cicilan","label_id":"Tanggal Mulai Cicilan (Cicilan 1)","type":"date","required":true},{"key":"tanggal_akhir_cicilan","label_id":"Tanggal Akhir Cicilan (Cicilan Terakhir)","type":"date","required":true},{"key":"bisa_pelunasan_dipercepat","label_id":"Boleh Pelunasan Dipercepat? (Ya/Tidak/Dengan Potongan)","type":"text","max_length":100,"required":false},{"key":"denda_keterlambatan_cicilan","label_id":"Denda Keterlambatan Cicilan (Rp/hari atau %)","type":"text","max_length":100,"required":false},{"key":"jaminan_cicilan","label_id":"Jaminan/Collateral (Ada/Tidak)","type":"text","max_length":100,"required":false}]',
'Buatlah perjanjian cicilan yang jelas dan teratur.

DATA:
- Kreditur: {{nama_kreditur}}
- Debitur: {{nama_debitur}}

BARANG/UANG:
- Deskripsi: {{deskripsi_barang_atau_uang}}
- Harga Total: Rp {{harga_total}}

CICILAN:
- Jumlah Cicilan: {{jumlah_cicilan}} kali
- Per Cicilan: Rp {{nilai_cicilan_perbulan}}/bulan
- Mulai: {{tanggal_mulai_cicilan}}
- Selesai: {{tanggal_akhir_cicilan}}
- Pelunasan Dipercepat: {{bisa_pelunasan_dipercepat}}
- Denda Telat: {{denda_keterlambatan_cicilan}}
- Jaminan: {{jaminan_cicilan}}

PERSYARATAN:
1. BARANG/UANG JELAS: Deskripsi detail
2. HARGA TOTAL: Rp pasti
3. JADWAL CICILAN: Tanggal dan jumlah setiap cicilan
4. PELUNASAN: Berapa kali cicilan sampai lunas
5. DENDA: Keterlambatan (Rp/hari atau %)
6. JAMINAN: Aset apa (jika ada)
7. EARLY PAYMENT: Boleh bayar lebih cepat atau tidak

JADWAL CICILAN:
"Debitur wajib membayar Rp {{nilai_cicilan_perbulan}} setiap:
- Cicilan 1: {{tanggal_mulai_cicilan}}
- Cicilan 2: [+1 bulan]
- ...
- Cicilan {{jumlah_cicilan}} (terakhir): {{tanggal_akhir_cicilan}}

Total: Rp {{nilai_cicilan_perbulan}} x {{jumlah_cicilan}} = Rp {{harga_total}}"

DENDA & DEFAULT:
"Jika cicilan terlambat > {{denda_hari}}, debitur dikenakan denda {{denda_keterlambatan_cicilan}}.
Jika terlambat > {{default_hari}}, kreditur berhak:
1. Hentikan pengiriman barang (jika belum semuanya dikirim)
2. Tarik kembali barang yang sudah diserahkan
3. Minta pembayaran sisa cicilan sekaligus (accelerated)"

JAMINAN (jika ada):
"Barang berupa {{jaminan_cicilan}} dijaminkan kepada kreditur.
Jika debitur default, kreditur berhak menjual jaminan untuk
melunasi sisa cicilan."

Output: Perjanjian cicilan yang fair dan teratur.',
true);

-- ============================================================
-- 6. SURAT PERNYATAAN (Declarations) — 6 subtypes
-- ============================================================

-- 6.1 surat_pernyataan_tanggung_jawab: Responsibility Statement
INSERT INTO public.templates (type, subtype_id, name_id, name_en, required_fields, prompt_template, requires_materai) VALUES
('surat_pernyataan', 'surat_pernyataan_tanggung_jawab', 'Surat Pernyataan Tanggung Jawab', 'Statement of Responsibility',
'[{"key":"nama_penyataan","label_id":"Nama Lengkap Penyataan","type":"text","max_length":100,"required":true},{"key":"nomor_ktp","label_id":"Nomor KTP","type":"text","max_length":16,"required":true},{"key":"alamat","label_id":"Alamat Lengkap","type":"textarea","required":true},{"key":"isi_pernyataan","label_id":"Isi Pernyataan (Apa yang dinyatakan)","type":"textarea","required":true},{"key":"tanggung_jawab_detail","label_id":"Tanggung Jawab Apa yang Diambil (Detail)","type":"textarea","required":true},{"key":"keperluan_pernyataan","label_id":"Untuk Keperluan (e.g., administratif, pengajuan, dll)","type":"text","max_length":100,"required":true},{"key":"konsekuensi_jika_salah","label_id":"Saya Memahami Konsekuensi Jika Pernyataan Palsu (Ya/Tidak)","type":"text","required":true}]',
'Buatlah surat pernyataan tanggung jawab yang jelas dan legal.

DATA PENYATAAN:
- Nama: {{nama_penyataan}}
- KTP: {{nomor_ktp}}
- Alamat: {{alamat}}

ISI PERNYATAAN:
"Saya, {{nama_penyataan}} (KTP {{nomor_ktp}}) dengan ini menyatakan:
{{isi_pernyataan}}"

TANGGUNG JAWAB:
"Saya bertanggung jawab atas:
{{tanggung_jawab_detail}}"

KEPERLUAN:
"Pernyataan ini dibuat untuk keperluan: {{keperluan_pernyataan}}"

PERSYARATAN:
1. NAMA & KTP: Penyataan harus jelas identitas
2. INTI PERNYATAAN: Jelas apa yang dinyatakan
3. TANGGUNG JAWAB: Jelas siapa bertanggung jawab apa
4. KEPERLUAN: Untuk apa pernyataan ini dibuat
5. TANDA TANGAN: Basah, tanggal jelas
6. MATERAI: Rp 10.000 (jika akan digunakan formal)

DISCLAIMER PENTING:
"⚠️ PERHATIAN: Pernyataan palsu atau tidak sesuai fakta dapat dikenakan
hukuman pidana berdasarkan KUHP Pasal 263 (pemalsuan dokumen)
atau Pasal 266 (penyalahgunaan dokumen palsu).
Saya bertanggung jawab penuh atas kebenaran pernyataan ini."

KONSEKUENSI CLAUSE:
"Saya memahami bahwa jika pernyataan ini ternyata tidak sesuai fakta,
saya akan menghadapi:
- Hukuman pidana (hingga 2 tahun penjara dan/atau denda Rp 60 juta)
- Tanggung jawab perdata (ganti rugi)
- Pencabutan hak-hak lainnya

Oleh karena itu, saya menyatakan bahwa isi pernyataan ini adalah {{konsekuensi_jika_salah}}."

Output: Surat pernyataan tanggung jawab yang legal dan serius.',
true);

-- 6.2 surat_pernyataan_janda: Widow Declaration
INSERT INTO public.templates (type, subtype_id, name_id, name_en, required_fields, prompt_template, requires_materai) VALUES
('surat_pernyataan', 'surat_pernyataan_janda', 'Surat Pernyataan Status Janda', 'Widow Status Declaration',
'[{"key":"nama_janda","label_id":"Nama Lengkap (Janda)","type":"text","max_length":100,"required":true},{"key":"nomor_ktp_janda","label_id":"Nomor KTP","type":"text","max_length":16,"required":true},{"key":"alamat_janda","label_id":"Alamat Lengkap","type":"textarea","required":true},{"key":"nama_suami_almarhum","label_id":"Nama Suami (Almarhum)","type":"text","max_length":100,"required":true},{"key":"tanggal_meninggal","label_id":"Tanggal Meninggal Suami","type":"date","required":true},{"key":"akta_kematian_nomor","label_id":"Nomor Akta Kematian (jika ada)","type":"text","max_length":50,"required":false},{"key":"keperluan_pernyataan","label_id":"Untuk Keperluan (e.g., Warisan, Bantuan Sosial, dll)","type":"text","max_length":100,"required":true}]',
'Buatlah surat pernyataan status janda (untuk keperluan warisan/administrasi).

DATA JANDA:
- Nama: {{nama_janda}}
- KTP: {{nomor_ktp_janda}}
- Alamat: {{alamat_janda}}

DATA ALMARHUM:
- Nama: {{nama_suami_almarhum}}
- Tanggal Meninggal: {{tanggal_meninggal}}
- Akta Kematian: {{akta_kematian_nomor}}

KEPERLUAN:
- Untuk: {{keperluan_pernyataan}}

PERSYARATAN:
1. DATA JANDA: Nama dan KTP jelas
2. ALMARHUM: Nama dan tanggal meninggal
3. BUKTI: Akta kematian (jika ada)
4. PERNYATAAN: Jelas menyatakan status janda
5. KEPERLUAN: Untuk apa pernyataan ini (warisan, bantuan, dll)
6. TANDA TANGAN: Basah, tanggal
7. MATERAI: Rp 10.000 (akan digunakan di pengadilan/notaris)

ISI PERNYATAAN:
"Saya, {{nama_janda}} (KTP {{nomor_ktp_janda}}) dengan ini menyatakan
bahwa saya adalah janda (istri yang telah ditinggal meninggal) dari
{{nama_suami_almarhum}} yang meninggal pada {{tanggal_meninggal}}.

Akta Kematian: {{akta_kematian_nomor}} (dari Dinsos/Kelurahan..."

PERNYATAAN ASET:
"Harta bersama dengan almarhum adalah: [deskripsi harta]
Yang menjadi hak saya sebagai janda adalah: [perincian harta]"

OUTPUT:
- Surat pernyataan janda untuk keperluan warisan/administrasi
- Dapat digunakan di pengadilan agama (warisan Islam)
- Dapat digunakan di notaris atau Dinsos
- Materai wajib untuk penggunaan resmi',
true);

-- 6.3 surat_pernyataan_penghasilan: Income Declaration
INSERT INTO public.templates (type, subtype_id, name_id, name_en, required_fields, prompt_template, requires_materai) VALUES
('surat_pernyataan', 'surat_pernyataan_penghasilan', 'Surat Pernyataan Penghasilan', 'Income Declaration',
'[{"key":"nama_penyataan","label_id":"Nama Lengkap Penyataan","type":"text","max_length":100,"required":true},{"key":"nomor_ktp","label_id":"Nomor KTP","type":"text","max_length":16,"required":true},{"key":"alamat","label_id":"Alamat Lengkap","type":"textarea","required":true},{"key":"status_pekerjaan","label_id":"Status Pekerjaan (Karyawan/Wiraswasta/Profesional/Petani)","type":"text","max_length":100,"required":true},{"key":"nama_perusahaan_usaha","label_id":"Nama Perusahaan/Usaha (jika ada)","type":"text","max_length":100,"required":false},{"key":"jabatan_posisi","label_id":"Jabatan/Posisi (jika karyawan)","type":"text","max_length":100,"required":false},{"key":"penghasilan_bulanan","label_id":"Penghasilan Bulanan (Rp)","type":"number","required":true},{"key":"penghasilan_tahunan","label_id":"Penghasilan Tahunan (Rp)","type":"number","required":false},{"key":"sumber_penghasilan_lain","label_id":"Sumber Penghasilan Lain (jika ada)","type":"textarea","required":false},{"key":"keperluan_pernyataan","label_id":"Untuk Keperluan (e.g., Pengajuan Kredit, Visa, Bantuan, dll)","type":"text","max_length":100,"required":true}]',
'⚠️ CRITICAL: Pernyataan penghasilan palsu = FRAUD untuk pengajuan kredit

Buatlah surat pernyataan penghasilan yang AKURAT dan sesuai kenyataan.

DATA PENYATAAN:
- Nama: {{nama_penyataan}}
- KTP: {{nomor_ktp}}
- Alamat: {{alamat}}

PEKERJAAN & PENGHASILAN:
- Status: {{status_pekerjaan}}
- Perusahaan/Usaha: {{nama_perusahaan_usaha}}
- Jabatan: {{jabatan_posisi}}
- Penghasilan/Bulan: Rp {{penghasilan_bulanan}}
- Penghasilan/Tahun: Rp {{penghasilan_tahunan}}
- Sumber Lain: {{sumber_penghasilan_lain}}

KEPERLUAN:
- Untuk: {{keperluan_pernyataan}}

PERSYARATAN:
1. AKURAT: Penghasilan HARUS sesuai kenyataan (lihat slip gaji/laporan usaha)
2. TERVERIFIKASI: Siap untuk diverifikasi bank/lembaga pemberi kredit
3. DETAIL: Sumber penghasilan jelas
4. KEPERLUAN: Untuk apa pernyataan (kredit, visa, bantuan)
5. TANDA TANGAN: Basah, tanggal, KTP
6. MATERAI: Rp 10.000 (untuk pengajuan kredit)

PENOLAKAN KREDIT BERDASARKAN PERNYATAAN PALSU:
"Jika bank menemukan penghasilan yang dinyatakan TIDAK SESUAI dengan
slip gaji/laporan usaha/tax return, kredit bisa ditolak dan pelapor
BISA DITUNTUT ATAS DASAR FRAUD/PENIPUAN dengan hukuman pidana."

KONSEKUENSI:
"Saya memahami bahwa:
1. Pernyataan penghasilan palsu = kejahatan (fraud)
2. Bank akan memverifikasi penghasilan ke perusahaan/pajak
3. Jika ketemu palsu = ditolak dan kemungkinan dituntut
4. Hukuman hingga 15 tahun penjara dan/atau Rp 5 miliar (untuk fraud kredit)"

OUTPUT:
- Surat pernyataan penghasilan untuk pengajuan kredit
- HARUS akurat dan punya bukti (slip gaji, faktur, SPT pajak)
- Bank akan verifikasi
- Jangan pernah buat palsu',
true);

-- 6.4 surat_pernyataan_tidak_punya_hutang: Debt-Free Declaration
INSERT INTO public.templates (type, subtype_id, name_id, name_en, required_fields, prompt_template, requires_materai) VALUES
('surat_pernyataan', 'surat_pernyataan_tidak_punya_hutang', 'Surat Pernyataan Tidak Punya Hutang', 'Debt-Free Declaration',
'[{"key":"nama_penyataan","label_id":"Nama Lengkap Penyataan","type":"text","max_length":100,"required":true},{"key":"nomor_ktp","label_id":"Nomor KTP","type":"text","max_length":16,"required":true},{"key":"alamat","label_id":"Alamat Lengkap","type":"textarea","required":true},{"key":"pernyataan_scope","label_id":"Scope Pernyataan (Hutang Apapun / Hutang Bank / Hutang Pribadi / lainnya)","type":"textarea","required":true},{"key":"periode_waktu","label_id":"Hingga Tanggal (sekarang / atau periode tertentu)","type":"date","required":true},{"key":"keperluan","label_id":"Untuk Keperluan (Warisan/Pembagian Harta/Bisnis, dll)","type":"text","max_length":100,"required":true}]',
'Buatlah surat pernyataan tidak punya hutang yang jelas dan spesifik.

DATA PENYATAAN:
- Nama: {{nama_penyataan}}
- KTP: {{nomor_ktp}}
- Alamat: {{alamat}}

PERNYATAAN:
- Scope: {{pernyataan_scope}}
- Hingga: {{periode_waktu}}
- Untuk: {{keperluan}}

PERSYARATAN:
1. SCOPE JELAS: Jenis hutang apa (semua / bank / pribadi)
2. PERIODE: Hingga kapan tidak ada hutang
3. AKURAT: Sudah dicek dengan semua kreditur
4. KEPERLUAN: Untuk apa pernyataan (warisan, transaksi, dll)
5. TANDA TANGAN: Basah, tanggal, KTP
6. MATERAI: Rp 10.000

ISI PERNYATAAN:
"Saya, {{nama_penyataan}} (KTP {{nomor_ktp}}) dengan ini menyatakan
bahwa saya TIDAK MEMILIKI {{pernyataan_scope}} hingga tanggal {{periode_waktu}}.

Saya telah melakukan pengecekan menyeluruh dan memastikan bahwa:
- Tidak ada hutang ke bank
- Tidak ada hutang ke kreditur pribadi
- Tidak ada hutang denda/pajak
- Semua kewajiban finansial telah dilunasi"

KONSEKUENSI:
"Jika pernyataan ini ternyata tidak sesuai fakta (ada hutang yang belum diungkapkan),
saya siap menghadapi konsekuensi hukum dan tanggung jawab perdata,
termasuk pembatalan transaksi yang berkaitan dengan pernyataan ini."

KEGUNAAN:
- Pembagian warisan/harta
- Transaksi jual beli properti (pembeli yakin penjual tidak ada hutang)
- Proses bisnis partnership
- Administrasi lainnya

OUTPUT:
- Surat pernyataan tidak punya hutang untuk keperluan formal
- Harus akurat dan bisa diverifikasi
- Materai wajib',
true);

-- 6.5 surat_rekomendasi: Recommendation Letter
INSERT INTO public.templates (type, subtype_id, name_id, name_en, required_fields, prompt_template, requires_materai) VALUES
('surat_pernyataan', 'surat_rekomendasi', 'Surat Rekomendasi', 'Recommendation Letter',
'[{"key":"nama_pemberi_rekomendasi","label_id":"Nama Pemberi Rekomendasi","type":"text","max_length":100,"required":true},{"key":"jabatan_pemberi","label_id":"Jabatan/Posisi Pemberi Rekomendasi","type":"text","max_length":100,"required":true},{"key":"institusi_pemberi","label_id":"Institusi/Perusahaan Pemberi Rekomendasi","type":"text","max_length":100,"required":true},{"key":"nama_penerima_rekomendasi","label_id":"Nama Penerima Rekomendasi","type":"text","max_length":100,"required":true},{"key":"konteks_hubungan","label_id":"Konteks Hubungan (Atasan-Bawahan / Dosen-Mahasiswa / Kolega / lainnya)","type":"text","max_length":100,"required":true},{"key":"durasi_hubungan","label_id":"Durasi Hubungan (Berapa lama)","type":"text","max_length":100,"required":true},{"key":"kekuatan_utama","label_id":"Kekuatan Utama Penerima Rekomendasi (Skills/Karakter)","type":"textarea","required":true},{"key":"kegunaan_rekomendasi","label_id":"Untuk Keperluan (e.g., Pengajuan Beasiswa, Lamaran Kerja, Masuk Program, dll)","type":"text","max_length":100,"required":true},{"key":"kontak_pemberi","label_id":"Kontak Pemberi (Email/Telepon)","type":"text","max_length":100,"required":true}]',
'Buatlah surat rekomendasi yang kredibel dan supportif.

PEMBERI REKOMENDASI:
- Nama: {{nama_pemberi_rekomendasi}}
- Jabatan: {{jabatan_pemberi}}
- Institusi: {{institusi_pemberi}}
- Kontak: {{kontak_pemberi}}

PENERIMA REKOMENDASI:
- Nama: {{nama_penerima_rekomendasi}}
- Hubungan: {{konteks_hubungan}}
- Durasi Hubungan: {{durasi_hubungan}}

KEKUATAN UTAMA:
{{kekuatan_utama}}

KEPERLUAN:
- Untuk: {{kegunaan_rekomendasi}}

PERSYARATAN:
1. PEMBERI KREDIBEL: Harus punya authority/expertise untuk merekomendasikan
2. KONTEKS JELAS: Hubungan antara pemberi dan penerima (atasan, dosen, dll)
3. DURASI: Berapa lama saling kenal (basis kredibilitas)
4. KEKUATAN: Sebutkan 2-3 kekuatan utama penerima
5. SPESIFIK: Jangan generic, kasih contoh konkrit jika bisa
6. KONTAK: Pemberi harus siap untuk diverifikasi
7. TANDA TANGAN: Basah, tanggal, stempel institusi (jika ada)

FORMAT STANDAR:
"Saya, {{nama_pemberi_rekomendasi}}, sebagai {{jabatan_pemberi}} di {{institusi_pemberi}},
dengan ini merekomendasikan {{nama_penerima_rekomendasi}} untuk {{kegunaan_rekomendasi}}.

Saya telah bekerja/belajar bersama {{nama_penerima_rekomendasi}} selama {{durasi_hubungan}}.
Dalam waktu tersebut, saya sangat terkesan dengan:
- {{kekuatan_1}}
- {{kekuatan_2}}
- {{kekuatan_3}}

Contoh konkrit: [Sebutkan pencapaian atau perilaku spesifik]

Saya merasa yakin {{nama_penerima_rekomendasi}} akan sukses di {{kegunaan_rekomendasi}}
dan saya merekomendasikan beliau dengan sangat hangat.

Silakan hubungi saya jika ada pertanyaan lebih lanjut."

TIDAK DIPERLUKAN MATERAI:
- Surat rekomendasi adalah opini subjektif
- Tidak ada konsekuensi hukum jika opininya salah
- Pembaca yang bertanggung jawab untuk memverifikasi

OUTPUT:
- Surat rekomendasi yang spesifik dan kredibel
- Harus punya kontak pemberi untuk verifikasi
- Pemberi siap defend rekomendasi mereka',
false);

-- 6.6 surat_keterangan_kerja: Work Certificate/Reference Letter
INSERT INTO public.templates (type, subtype_id, name_id, name_en, required_fields, prompt_template, requires_materai) VALUES
('surat_pernyataan', 'surat_keterangan_kerja', 'Surat Keterangan Kerja', 'Work Certificate/Employment Reference',
'[{"key":"nama_perusahaan","label_id":"Nama Perusahaan (Pemberi Keterangan)","type":"text","max_length":100,"required":true},{"key":"alamat_perusahaan","label_id":"Alamat Perusahaan","type":"textarea","required":true},{"key":"nama_pejabat_hr","label_id":"Nama Pejabat HR/Pimpinan yang Tanda Tangan","type":"text","max_length":100,"required":true},{"key":"jabatan_pejabat","label_id":"Jabatan Pejabat (Direktur/Manager HR/Kepala Personalia)","type":"text","max_length":100,"required":true},{"key":"nama_karyawan","label_id":"Nama Karyawan (Pemegang Sertifikat)","type":"text","max_length":100,"required":true},{"key":"nomor_ktp_karyawan","label_id":"Nomor KTP Karyawan","type":"text","max_length":16,"required":true},{"key":"jabatan_karyawan","label_id":"Jabatan/Posisi Karyawan Saat Bekerja","type":"text","max_length":100,"required":true},{"key":"tanggal_mulai_kerja","label_id":"Tanggal Mulai Kerja","type":"date","required":true},{"key":"tanggal_akhir_kerja","label_id":"Tanggal Akhir/Keluar Kerja","type":"date","required":true},{"key":"alasan_keluar","label_id":"Alasan Keluar (Resign/PHK/Kontrak Selesai)","type":"text","max_length":100,"required":true},{"key":"deskripsi_kinerja","label_id":"Deskripsi Singkat Kinerja & Pencapaian","type":"textarea","required":true}]',
'Buatlah surat keterangan kerja yang FACTUAL dan berstandar untuk karyawan keluar.

PERUSAHAAN:
- Nama: {{nama_perusahaan}}
- Alamat: {{alamat_perusahaan}}
- Pejabat: {{nama_pejabat_hr}} ({{jabatan_pejabat}})

KARYAWAN:
- Nama: {{nama_karyawan}}
- KTP: {{nomor_ktp_karyawan}}
- Jabatan: {{jabatan_karyawan}}
- Mulai: {{tanggal_mulai_kerja}}
- Selesai: {{tanggal_akhir_kerja}}
- Keluar: {{alasan_keluar}}

KINERJA:
{{deskripsi_kinerja}}

PERSYARATAN WAJIB (UU 13/2003):
1. PERUSAHAAN WAJIB MEMBERIKAN: Setiap karyawan keluar berhak minta sertifikat kerja
2. DATA LENGKAP: Nama, KTP, jabatan, periode kerja
3. FACTUAL: Hanya pernyataan fakta (tanggal, jabatan, periode)
4. NETRAL: Jangan opini (bukan "pekerja malas" tapi "kinerjanya sedang-sedang saja")
5. PERIODE JELAS: Tanggal mulai dan selesai
6. ALASAN KELUAR: Resign/PHK/Kontrak Selesai
7. TANDA TANGAN: Pejabat HR/Pimpinan + stempel perusahaan
8. TANGGAL: Jelas kapan sertifikat dikeluarkan
9. MATERAI: Rp 10.000 (jika akan digunakan resmi ke instansi)

BAHASA YANG TEPAT:
✓ "Jabatan: Manager Sales selama periode {{durasi}}"
✓ "Kinerja: Konsisten memenuhi target penjualan dan laporan tepat waktu"
✗ "Pekerja yang malas dan sering datang terlambat" (subjektif, bisa masalah hukum)

FORMAT ISI:
"Dengan ini kami menerangkan bahwa:

Nama: {{nama_karyawan}}
KTP: {{nomor_ktp_karyawan}}
Jabatan: {{jabatan_karyawan}}
Periode Kerja: {{tanggal_mulai_kerja}} sampai {{tanggal_akhir_kerja}}
Status Keluar: {{alasan_keluar}}

Selama bekerja di perusahaan kami, {{nama_karyawan}} menunjukkan:
- {{pencapaian_1}}
- {{pencapaian_2}}
- {{pencapaian_3}}

Sertifikat ini dikeluarkan untuk keperluan: [sesuai permintaan karyawan]
Sertifikat ini berlaku selamanya dan dapat digunakan kapan saja."

TANGGUNG JAWAB PERUSAHAAN:
"Perusahaan bertanggung jawab atas kebenaran data dalam sertifikat ini.
Jika ada kesalahan, perusahaan siap memberikan sertifikat yang diperbaiki."

PENTING - JANGAN SERTAKAN:
❌ Opini negatif tentang karakter/kepribadian
❌ Masalah disiplin (kecuali jika alasan PHK resmi)
❌ Gaji atau benefits yang dijanjikan
❌ Klausul "tidak boleh bekerja di tempat lain"

OUTPUT:
- Surat keterangan kerja yang factual dan netral
- Dapat digunakan karyawan untuk mencari kerja baru
- Menjadi bukti periode kerja dan jabatan
- Perusahaan bertanggung jawab atas akurasi',
false);

-- ============================================================
-- Seeding Complete
-- Run: Part 1, then Part 2, then Part 3
-- Total templates: ~50+
-- ============================================================
