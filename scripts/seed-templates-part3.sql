-- SuratResmi.id — Template Seeding Script (Part 3 of 3)
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
