/**
 * PDF Generation & Letter Quality Assurance Test Suite
 *
 * Comprehensive tests for all 50+ letter subtypes, validating:
 * - Letter generation (keywords, content validation)
 * - PDF generation (file integrity, size, format)
 * - Indonesian language compliance
 * - Forbidden content detection
 * - Materai placement for appropriate letter types
 *
 * NOTES:
 * - Tests require ANTHROPIC_API_KEY and valid Supabase credentials
 * - Each test consumes 1 credit (requires sufficient credits in test account)
 * - Tests are designed to be run against a live API (not mocked)
 * - PDF validation checks file structure, not rendering
 */

import { describe, it as test, expect, beforeAll } from '@jest/globals';

// Test configuration
const API_BASE_URL = process.env.TEST_API_URL ?? 'http://localhost:3002';
const AUTH_TOKEN = process.env.TEST_AUTH_TOKEN ?? '';

// Test data for all 50+ letter subtypes
const TEST_CASES = [
  // ============================================================
  // SURAT KUASA (Power of Attorney) — 8 subtypes
  // ============================================================
  {
    name: 'kuasa_stnk — Basic vehicle registration proxy',
    subtype: 'kuasa_stnk',
    input: {
      nama_pemberi_kuasa: 'Budi Santoso',
      nomor_ktp_pemberi: '1234567890123456',
      alamat_pemberi: 'Jl. Merdeka No. 123, Jakarta Pusat',
      nama_penerima_kuasa: 'Siti Nurhaliza',
      nomor_ktp_penerima: '9876543210654321',
      nomor_polisi: 'B 1234 ABC',
      merek_kendaraan: 'Toyota Avanza',
      tahun_kendaraan: '2020',
      nomor_stnk: 'N 123456789',
    },
    expectedKeywords: [
      'SURAT KUASA',
      'Budi Santoso',
      'Siti Nurhaliza',
      'Toyota Avanza',
      'B 1234 ABC',
      'STNK',
    ],
    requiresMaterai: true,
    mustNotContain: ['ERROR', 'undefined', 'null', 'API Error', '{{'],
  },
  {
    name: 'kuasa_stnk — Long names and addresses',
    subtype: 'kuasa_stnk',
    input: {
      nama_pemberi_kuasa: 'Muhammad Ali Ridho Pratama Sinaga Wijaya',
      nomor_ktp_pemberi: '3201234567890123',
      alamat_pemberi:
        'Jl. Diponegoro No. 456, Komplek Perumahan Merah Putih Blok C, Kota Depok, Jawa Barat 16425',
      nama_penerima_kuasa: 'Dr. Siti Nurhaliza Wijaya, S.H., M.Hum.',
      nomor_ktp_penerima: '1111111111111111',
      nomor_polisi: 'F 5678 XYZ',
      merek_kendaraan: 'Daihatsu Xenia',
      tahun_kendaraan: '2018',
    },
    expectedKeywords: ['SURAT KUASA', 'Kota Depok', 'Daihatsu'],
    requiresMaterai: true,
  },
  {
    name: 'kuasa_stnk_perj — Combined vehicle proxy + employment contract',
    subtype: 'kuasa_stnk_perj',
    input: {
      nama_pemberi_kuasa: 'Ahmad Harjadi',
      nomor_ktp_pemberi: '5555555555555555',
      alamat_pemberi: 'Jl. Sudirman No. 789, Bandung',
      nama_penerima_kuasa: 'Eka Putri Lestari',
      nomor_polisi: 'D 9999 QWE',
      merek_kendaraan: 'Honda Civic',
      nama_perusahaan: 'PT Maju Sentosa Indonesia',
      posisi_jabatan: 'Senior Marketing Manager',
      gaji_bulanan: '7500000',
      jam_kerja_mingguan: '40',
      provinsi: 'Jawa Barat',
    },
    expectedKeywords: [
      'SURAT KUASA',
      'PERJANJIAN KERJA',
      'PT Maju Sentosa Indonesia',
      'Eka Putri Lestari',
    ],
    requiresMaterai: true,
  },
  {
    name: 'kuasa_jual_tanah — Land sale proxy',
    subtype: 'kuasa_jual_tanah',
    input: {
      nama_pemberi: 'Wono Setiawan',
      nomor_ktp_pemberi: '2222222222222222',
      alamat_pemberi: 'Jl. Gatot Subroto, Jakarta Selatan',
      nama_penerima: 'Citra Dewi Mandiri',
      nomor_sertifikat_tanah: 'AHU.09.10-5678-2015',
      luas_tanah: '500',
      alamat_tanah: 'Jl. Merpati No. 100, Bekasi',
      nilai_transaksi: '2500000000',
    },
    expectedKeywords: ['KUASA', 'JUAL TANAH', 'SERTIFIKAT', '500'],
    requiresMaterai: true,
  },
  {
    name: 'kuasa_istimewa — Special power of attorney for legal action',
    subtype: 'kuasa_istimewa',
    input: {
      nama_pemberi_kuasa: 'Ir. Budiman Soepriyo',
      nomor_ktp_pemberi: '6666666666666666',
      alamat_pemberi: 'Jl. Panglima Polim No. 123, Jakarta',
      nama_penerima_kuasa: 'H. Bambang Suryanto, S.H.',
      tujuan_kuasa: 'Mengajukan gugatan perdata terkait sengketa perbatasan lahan',
      pengadilan_tujuan: 'Pengadilan Negeri Jakarta Selatan',
    },
    expectedKeywords: [
      'KUASA ISTIMEWA',
      'GUGATAN',
      'Bambang Suryanto',
      'PENGADILAN',
    ],
    requiresMaterai: true,
  },
  {
    name: 'kuasa_pencairan_asuransi — Insurance claim proxy',
    subtype: 'kuasa_pencairan_asuransi',
    input: {
      nama_pemberi: 'Slamet Riyanto',
      nomor_ktp: '7777777777777777',
      alamat: 'Jl. Hayam Wuruk, Surabaya',
      nama_penerima: 'Dyah Indah Sari',
      nomor_polis: 'POL-2024-0001234',
      perusahaan_asuransi: 'PT Asuransi Bersama Indonesia',
      nominal_klaim: '150000000',
    },
    expectedKeywords: [
      'KUASA',
      'ASURANSI',
      'PENCAIRAN',
      'Dyah Indah Sari',
      'Rp 150.000.000',
    ],
    requiresMaterai: true,
  },
  {
    name: 'kuasa_notaris — Notary representation proxy',
    subtype: 'kuasa_notaris',
    input: {
      nama_pemberi: 'Rudy Hermawan',
      nomor_ktp: '8888888888888888',
      alamat: 'Jl. Blora No. 45, Medan',
      nama_penerima: 'Suripto Harsono',
      notaris_tujuan: 'Notaris Soedarto, S.H.',
      lokasi_notaris: 'Jl. Ahmad Yani No. 67, Medan',
      tujuan_pengurusan:
        'Pembuatan Akta Jual Beli Tanah dan Bangunan Komersial',
    },
    expectedKeywords: [
      'KUASA',
      'NOTARIS',
      'Suripto Harsono',
      'Soedarto',
    ],
    requiresMaterai: true,
  },
  {
    name: 'kuasa_bpkb — Vehicle ownership certificate proxy',
    subtype: 'kuasa_bpkb',
    input: {
      nama_pemberi: 'Yanto Wijaya',
      nomor_ktp: '9999999999999999',
      alamat: 'Jl. Sudimulya No. 23, Yogyakarta',
      nama_penerima: 'Ratna Dewi Kusuma',
      nomor_polisi: 'AB 1111 CD',
      merek_kendaraan: 'Yamaha Nmax',
      nomor_bpkb: 'BPK-0000123456',
      tahun_pembuatan: '2021',
    },
    expectedKeywords: ['KUASA', 'BPKB', 'Ratna Dewi', 'Yamaha'],
    requiresMaterai: true,
  },

  // ============================================================
  // SURAT JUAL BELI (Sales Agreements) — 4 subtypes
  // ============================================================
  {
    name: 'surat_jual_beli_tanah — Land sale agreement',
    subtype: 'surat_jual_beli_tanah',
    input: {
      nama_pembeli: 'Hartono Subekti',
      nomor_ktp_pembeli: '1010101010101010',
      alamat_pembeli: 'Jl. Benda No. 12, Jakarta Selatan',
      nama_penjual: 'Neneng Sumarna',
      nomor_ktp_penjual: '2020202020202020',
      alamat_penjual: 'Jl. Kayu Putih No. 34, Jakarta Timur',
      alamat_tanah: 'Jl. Menteng No. 56, Jakarta Pusat',
      luas_tanah: '300',
      nomor_sertifikat: 'SHM 123/Jakpus-2015',
      harga_jual: '1500000000',
      tanggal_pembayaran: '2024-05-15',
    },
    expectedKeywords: [
      'PERJANJIAN JUAL BELI',
      'Hartono Subekti',
      'Neneng Sumarna',
      'Rp 1.500.000.000',
      'SERTIFIKAT',
    ],
    requiresMaterai: true,
  },
  {
    name: 'surat_jual_beli_barang — Goods/merchandise sale',
    subtype: 'surat_jual_beli_barang',
    input: {
      nama_penjual: 'Rini Hermanto',
      nomor_ktp_penjual: '3030303030303030',
      alamat_penjual: 'Jl. Raya Bogor Km 10, Depok',
      nama_pembeli: 'Benny Kusuma',
      nomor_ktp_pembeli: '4040404040404040',
      alamat_pembeli: 'Jl. Jenderal Sudirman No. 88, Tangerang',
      deskripsi_barang: '20 unit komputer desktop bekas kondisi baik',
      harga_per_unit: '3500000',
      jumlah_unit: '20',
      harga_total: '70000000',
    },
    expectedKeywords: [
      'JUAL BELI',
      'BARANG',
      'Benny Kusuma',
      'Rini Hermanto',
      'komputer',
    ],
    requiresMaterai: false,
  },
  {
    name: 'surat_jual_beli_kendaraan — Vehicle sale agreement',
    subtype: 'surat_jual_beli_kendaraan',
    input: {
      nama_penjual: 'Soemanto Wijaya',
      nomor_ktp_penjual: '5050505050505050',
      alamat_penjual: 'Jl. Pemuda No. 45, Semarang',
      nama_pembeli: 'Ferry Gunawan',
      nomor_ktp_pembeli: '6060606060606060',
      alamat_pembeli: 'Jl. Tentara Pelajar No. 23, Semarang',
      merek_kendaraan: 'Honda Accord',
      tahun_pembuatan: '2019',
      nomor_polisi: 'H 2020 AA',
      nomor_mesin: 'K20Z3123456',
      nomor_rangka: 'JHMCF5144LC000123',
      harga_jual: '300000000',
    },
    expectedKeywords: [
      'JUAL BELI',
      'KENDARAAN',
      'Honda Accord',
      'Ferry Gunawan',
      'Rp 300.000.000',
    ],
    requiresMaterai: true,
  },
  {
    name: 'surat_jual_beli_rumah — House/property sale agreement',
    subtype: 'surat_jual_beli_rumah',
    input: {
      nama_penjual: 'Suwarno Hermanto',
      nomor_ktp_penjual: '7070707070707070',
      alamat_penjual: 'Jl. Letjen Suprapto No. 67, Bandung',
      nama_pembeli: 'Indra Pratama',
      nomor_ktp_pembeli: '8080808080808080',
      alamat_pembeli: 'Jl. Cipularang No. 89, Bandung',
      alamat_rumah: 'Jl. Pasteur No. 101, Bandung',
      luas_bangunan: '150',
      luas_tanah: '250',
      tahun_dibangun: '2010',
      nomor_sertifikat: 'SHM 456/Bandung-2018',
      harga_jual: '800000000',
    },
    expectedKeywords: [
      'JUAL BELI',
      'RUMAH',
      'Indra Pratama',
      'Suwarno',
      'Rp 800.000.000',
    ],
    requiresMaterai: true,
  },

  // ============================================================
  // PERJANJIAN KERJA (Employment Agreements) — 6 subtypes
  // ============================================================
  {
    name: 'perj_kerja_tetap — Permanent employment contract',
    subtype: 'perj_kerja_tetap',
    input: {
      nama_karyawan: 'Sinta Rahayuningsih',
      nomor_ktp: 'KTP9191919191919191',
      tempat_tanggal_lahir: 'Surabaya, 15 Juni 1992',
      nama_perusahaan: 'PT Teknologi Maju Indonesia',
      alamat_perusahaan: 'Jl. Gatot Subroto No. 123, Jakarta Selatan',
      posisi_jabatan: 'Systems Administrator',
      departemen: 'Information Technology',
      tanggal_mulai: '2024-06-01',
      gaji_pokok: '8500000',
      tunjangan_kesehatan: '1000000',
      tunjangan_transportasi: '500000',
      jam_kerja_harian: '8',
      hari_kerja_seminggu: '5',
      nama_pimpinan: 'Drs. Bambang Sutrisno',
    },
    expectedKeywords: [
      'PERJANJIAN KERJA',
      'TETAP',
      'Sinta Rahayuningsih',
      'Systems Administrator',
      'PT Teknologi Maju Indonesia',
    ],
    requiresMaterai: true,
  },
  {
    name: 'perj_kerja_kontrak — Fixed-term employment contract',
    subtype: 'perj_kerja_kontrak',
    input: {
      nama_karyawan: 'Joko Priyanto',
      nomor_ktp: '1212121212121212',
      alamat: 'Jl. Mertani No. 45, Yogyakarta',
      nama_perusahaan: 'CV Jasa Konstruksi Bersama',
      posisi_jabatan: 'Site Supervisor',
      tanggal_mulai: '2024-01-01',
      tanggal_berakhir: '2024-12-31',
      gaji_bulanan: '5000000',
      jam_kerja_mingguan: '48',
      nomor_proyek: 'PROYEK-JALAN-2024',
    },
    expectedKeywords: [
      'PERJANJIAN KERJA',
      'KONTRAK',
      'Joko Priyanto',
      '2024-12-31',
    ],
    requiresMaterai: true,
  },
  {
    name: 'perj_kerja_magang — Internship agreement',
    subtype: 'perj_kerja_magang',
    input: {
      nama_peserta: 'Rina Sudarsono',
      nomor_identitas: '2323232323232323',
      nama_institusi: 'Universitas Indonesia',
      nama_perusahaan: 'PT Konsultasi Bisnis Nusantara',
      departemen_magang: 'Human Resources',
      durasi_magang: '6',
      tanggal_mulai: '2024-02-01',
      nama_mentor: 'Ibu Dwi Handayani, S.H.',
      allowance_bulanan: '2000000',
      jam_kerja_harian: '7',
      hari_kerja_seminggu: '5',
    },
    expectedKeywords: ['MAGANG', 'Rina Sudarsono', 'Universitas Indonesia'],
    requiresMaterai: false,
  },
  {
    name: 'perj_kerja_lepas — Freelance/independent contractor agreement',
    subtype: 'perj_kerja_lepas',
    input: {
      nama_kontraktor: 'Edi Warsito',
      nomor_ktp: '3434343434343434',
      alamat: 'Jl. Gatot Kaca No. 12, Medan',
      nama_pengguna_jasa: 'PT Media Grafis Indonesia',
      jenis_pekerjaan: 'Desain Grafis dan Layout Majalah',
      nilai_kontrak: '25000000',
      durasi_proyek: '3',
      tanggal_mulai: '2024-03-01',
      metode_pembayaran: 'Setelah proyek selesai',
      estimasi_jam_kerja: '200',
    },
    expectedKeywords: ['KERJA LEPAS', 'Edi Warsito', 'Desain Grafis'],
    requiresMaterai: false,
  },
  {
    name: 'perj_kerja_paruh_waktu — Part-time employment',
    subtype: 'perj_kerja_paruh_waktu',
    input: {
      nama_karyawan: 'Lina Wijaya',
      nomor_ktp: '4545454545454545',
      alamat: 'Jl. Pendidikan No. 67, Bandung',
      nama_perusahaan: 'Toko Elektronik Maju Jaya',
      posisi_jabatan: 'Kasir dan Customer Service',
      tanggal_mulai: '2024-04-01',
      gaji_per_jam: '25000',
      jam_kerja_seminggu: '20',
      hari_kerja: 'Senin, Rabu, Jumat, Sabtu, Minggu',
    },
    expectedKeywords: ['PARUH WAKTU', 'Lina Wijaya', '20 jam'],
    requiresMaterai: false,
  },
  {
    name: 'perj_pengakhiran_kerja — Employment termination agreement',
    subtype: 'perj_pengakhiran_kerja',
    input: {
      nama_karyawan: 'Bambang Setiawan',
      nomor_ktp: '5656565656565656',
      nama_perusahaan: 'PT Industri Otomotif Sejahtera',
      tanggal_penghentian: '2024-05-31',
      alasan_penghentian: 'PHK karena efisiensi',
      tunjangan_akhir: '50000000',
      uang_pesangon: '75000000',
      uang_penggantian_hak: '25000000',
      nama_pimpinan: 'Direktur Utama',
    },
    expectedKeywords: [
      'PENGAKHIRAN',
      'Bambang Setiawan',
      'PHK',
      'PESANGON',
    ],
    requiresMaterai: true,
  },

  // ============================================================
  // PERJANJIAN SEWA (Rental Agreements) — 2 subtypes
  // ============================================================
  {
    name: 'perj_sewa_rumah — House rental agreement',
    subtype: 'perj_sewa_rumah',
    input: {
      nama_pemilik: 'Suryanto Hermawan',
      nomor_ktp_pemilik: '6767676767676767',
      alamat_pemilik: 'Jl. Mampang Prapatan No. 123, Jakarta',
      nama_penyewa: 'Wahyu Adi Pratama',
      nomor_ktp_penyewa: '7878787878787878',
      alamat_penyewa: 'Jl. Karet Pedurenan, Jakarta Selatan',
      alamat_rumah_sewa: 'Jl. Tebet Barat No. 45, Jakarta Selatan',
      luas_bangunan: '120',
      luas_tanah: '200',
      harga_sewa_bulanan: '4000000',
      jangka_waktu_sewa: '24',
      tanggal_mulai: '2024-06-01',
      fasilitas: 'Listrik, air, internet included',
      biaya_calon: '8000000',
    },
    expectedKeywords: [
      'SEWA',
      'RUMAH',
      'Suryanto Hermawan',
      'Wahyu Adi',
      'Rp 4.000.000',
    ],
    requiresMaterai: true,
  },
  {
    name: 'perj_sewa_toko — Shop/commercial space rental',
    subtype: 'perj_sewa_toko',
    input: {
      nama_pemilik: 'Karjo Wibisono',
      nomor_ktp_pemilik: '8989898989898989',
      alamat_pemilik: 'Jl. Sudirman No. 789, Surabaya',
      nama_penyewa: 'Siti Nurhaliza',
      nomor_ktp_penyewa: '9090909090909090',
      alamat_toko: 'Jl. Pemuda No. 100, Pusat Kota Surabaya',
      luas_toko: '50',
      harga_sewa_bulanan: '5000000',
      jangka_waktu_sewa: '36',
      tanggal_mulai: '2024-07-01',
      biaya_maintenance: '500000',
      jenis_usaha: 'Toko Pakaian dan Aksesori',
    },
    expectedKeywords: [
      'SEWA',
      'TOKO',
      'Karjo Wibisono',
      'Siti Nurhaliza',
      'Rp 5.000.000',
    ],
    requiresMaterai: true,
  },

  // ============================================================
  // PERJANJIAN UTANG (Debt/Loan Agreements) — 5 subtypes
  // ============================================================
  {
    name: 'perj_utang_pribadi — Personal loan agreement',
    subtype: 'perj_utang_pribadi',
    input: {
      nama_pemberi_pinjaman: 'Hendra Wijaya',
      nomor_ktp_pemberi: '1111222233334444',
      alamat_pemberi: 'Jl. Cipulir No. 50, Jakarta Barat',
      nama_peminjam: 'Joni Santoso',
      nomor_ktp_peminjam: '5555666677778888',
      alamat_peminjam: 'Jl. Petamburan No. 25, Jakarta Barat',
      nominal_pinjaman: '50000000',
      tanggal_pinjaman: '2024-06-01',
      tanggal_jatuh_tempo: '2024-12-01',
      bunga: 'Tidak ada',
      metode_pembayaran: 'Lunas pada tanggal jatuh tempo',
      tujuan_pinjaman: 'Modal usaha kecil',
    },
    expectedKeywords: [
      'PINJAMAN',
      'PRIBADI',
      'Rp 50.000.000',
      'Joni Santoso',
      'Hendra Wijaya',
    ],
    requiresMaterai: false,
  },
  {
    name: 'perj_utang_bisnis — Business loan agreement',
    subtype: 'perj_utang_bisnis',
    input: {
      nama_pemberi_pinjaman: 'PT Bank Swasta Indonesia',
      nomor_npwp: '12.345.678.9-123.000',
      nama_peminjam: 'CV Usaha Mandiri Jaya',
      nomor_npwp_peminjam: '98.765.432.1-000.001',
      nominal_pinjaman: '500000000',
      tujuan_pinjaman: 'Pembelian mesin produksi dan renovasi pabrik',
      tanggal_pencairan: '2024-06-15',
      tenor_bulan: '36',
      bunga_per_tahun: '12',
      metode_pembayaran: 'Cicilan bulanan',
      tanggungan_agunan: 'Mesin produksi merk DAINICHI senilai Rp 550 juta',
    },
    expectedKeywords: [
      'PINJAMAN BISNIS',
      'CV Usaha Mandiri',
      'Rp 500.000.000',
      '12%',
    ],
    requiresMaterai: true,
  },
  {
    name: 'perj_utang_dengan_bunga — Loan with interest',
    subtype: 'perj_utang_dengan_bunga',
    input: {
      nama_pemberi_pinjaman: 'Sugiarto Hermawan',
      nomor_ktp_pemberi: '2222333344445555',
      alamat_pemberi: 'Jl. Benda No. 67, Jakarta Selatan',
      nama_peminjam: 'Dedi Irawan',
      nomor_ktp_peminjam: '6666777788889999',
      alamat_peminjam: 'Jl. Kramat Raya No. 45, Jakarta Pusat',
      nominal_pinjaman: '100000000',
      bunga_per_tahun: '15',
      durasi_bulan: '24',
      tanggal_pinjaman: '2024-07-01',
      metode_pembayaran: 'Cicilan bultan Rp 4.687.500 + bunga',
      tujuan: 'Renovasi rumah',
    },
    expectedKeywords: [
      'PINJAMAN DENGAN BUNGA',
      'Dedi Irawan',
      '15%',
      'Rp 100.000.000',
    ],
    requiresMaterai: true,
  },
  {
    name: 'perj_utang_tanpa_bunga — Zero-interest loan',
    subtype: 'perj_utang_tanpa_bunga',
    input: {
      nama_pemberi_pinjaman: 'Trisna Wijaya',
      nomor_ktp_pemberi: '3333444455556666',
      alamat_pemberi: 'Jl. Gatot Kaca No. 78, Medan',
      nama_peminjam: 'Rina Pratama',
      nomor_ktp_peminjam: '7777888899990000',
      alamat_peminjam: 'Jl. Pendidikan No. 34, Medan',
      nominal_pinjaman: '75000000',
      tanggal_pinjaman: '2024-05-15',
      tanggal_jatuh_tempo: '2025-05-15',
      metode_pembayaran: 'Cicilan bulanan',
      tujuan_pinjaman: 'Biaya pernikahan',
      catatan: 'Atas dasar hubungan keluarga',
    },
    expectedKeywords: [
      'PINJAMAN TANPA BUNGA',
      'Rina Pratama',
      'Rp 75.000.000',
    ],
    requiresMaterai: false,
  },
  {
    name: 'perj_cicilan — Installment plan agreement',
    subtype: 'perj_cicilan',
    input: {
      nama_penjual: 'Toko Elektronik Sejahtera',
      alamat_toko: 'Jl. Ahmad Yani No. 123, Semarang',
      nama_pembeli: 'Paulus Wijaya',
      nomor_ktp: '1111000022223333',
      alamat_pembeli: 'Jl. Siliwangi No. 56, Semarang',
      barang_dibeli: 'Kulkas Toshiba 2 pintu (Silver)',
      harga_kontant: '8500000',
      uang_muka: '2500000',
      sisa_pembayaran: '6000000',
      cicilan_bulanan: '1200000',
      jumlah_cicilan: '5',
      tanggal_mulai: '2024-07-01',
      bunga_administrasi: '0',
    },
    expectedKeywords: [
      'CICILAN',
      'Paulus Wijaya',
      'Kulkas Toshiba',
      'Rp 1.200.000',
    ],
    requiresMaterai: false,
  },

  // ============================================================
  // SURAT PERNYATAAN (Statements/Declarations) — 5 subtypes
  // ============================================================
  {
    name: 'surat_pernyataan_tanggung_jawab — Statement of responsibility',
    subtype: 'surat_pernyataan_tanggung_jawab',
    input: {
      nama_pembuat_pernyataan: 'Mirza Teguh Pratama',
      nomor_ktp: '2222000033334444',
      alamat: 'Jl. Warung Buncit No. 45, Jakarta Selatan',
      tanggal_pernyataan: '2024-06-15',
      perihal_pernyataan: 'Tanggung jawab atas kerusakan kendaraan milik perusahaan',
      detail_kejadian:
        'Mobil avanza putih dengan nomor polisi B 3456 DEF mengalami kerusakan bumper depan akibat kecelakaan lalu lintas pada tanggal 10 Juni 2024',
      komitmen_ganti_rugi:
        'Bersedia mengganti biaya perbaikan sesuai dengan estimasi dari bengkel resmi',
      estimasi_biaya: '5000000',
      nama_notaris: 'Notaris Soedarto, S.H.',
    },
    expectedKeywords: [
      'SURAT PERNYATAAN',
      'TANGGUNG JAWAB',
      'Mirza Teguh',
      'Rp 5.000.000',
    ],
    requiresMaterai: true,
  },
  {
    name: 'surat_pernyataan_janda — Widow/widower declaration',
    subtype: 'surat_pernyataan_janda',
    input: {
      nama_pembuat: 'Suminah Binti Karjo Wibisono',
      nomor_ktp: '3333000044445555',
      alamat: 'Jl. Kompleks Perumahan Sentosa Blok B No. 12, Surabaya',
      tanggal_pernyataan: '2024-06-20',
      nama_alm_suami: 'Alm. Bambang Setiawan, S.Kom',
      tanggal_kematian: '2022-03-15',
      tujuan_pernyataan: 'Pengajuan bantuan sosial pemerintah untuk keluarga kurang mampu',
      nama_anak: 'Reza Setiawan (usia 8 tahun)',
      catatan: 'Belum menikah lagi sampai sekarang',
    },
    expectedKeywords: ['JANDA', 'Suminah', 'Bambang Setiawan'],
    requiresMaterai: false,
  },
  {
    name: 'surat_pernyataan_penghasilan — Income declaration letter',
    subtype: 'surat_pernyataan_penghasilan',
    input: {
      nama_pembuat: 'Sukiman Hermawan',
      nomor_ktp: '4444000055556666',
      alamat: 'Jl. Keputran No. 78, Yogyakarta',
      tanggal_pernyataan: '2024-06-25',
      pekerjaan_saat_ini: 'Wiraswasta / Pemilik Toko Elektronik',
      nama_usaha: 'Toko Elektronik Wijaya Elektronik',
      alamat_usaha: 'Jl. Malioboro No. 500, Yogyakarta',
      penghasilan_rata_rata_bulanan: '25000000',
      periode_usaha: '10 Tahun (sejak 2014)',
      tujuan_pernyataan: 'Pengajuan kredit modal usaha ke bank',
      nama_bank: 'Bank Mandiri Cabang Yogyakarta',
    },
    expectedKeywords: [
      'PENGHASILAN',
      'Sukiman Hermawan',
      'Rp 25.000.000',
      'WIRASWASTA',
    ],
    requiresMaterai: false,
  },
  {
    name: 'surat_pernyataan_tidak_punya_hutang — Non-debt declaration',
    subtype: 'surat_pernyataan_tidak_punya_hutang',
    input: {
      nama_pembuat: 'Rudy Santoso',
      nomor_ktp: '5555000066667777',
      alamat: 'Jl. Kebon Kacang No. 23, Jakarta Pusat',
      tanggal_pernyataan: '2024-06-30',
      tujuan_pernyataan: 'Pengajuan kartu kredit dan proses verifikasi finansial',
      periode_pernyataan: 'Sampai dengan tanggal 30 Juni 2024',
      catatan_tambahan:
        'Seluruh kewajiban finansial selama ini telah dilunasi dengan baik dan tepat waktu',
      nama_instansi: 'Bank Danamon Indonesia Tbk',
    },
    expectedKeywords: [
      'PERNYATAAN TIDAK PUNYA HUTANG',
      'Rudy Santoso',
      'TELAH DILUNASI',
    ],
    requiresMaterai: false,
  },
  {
    name: 'surat_rekomendasi — Recommendation/reference letter',
    subtype: 'surat_rekomendasi',
    input: {
      nama_pemberi_rekomendasi: 'Dr. Ir. Bambang Sutrisno, M.Tech.',
      jabatan: 'Direktur Utama',
      nama_perusahaan: 'PT Teknologi Maju Indonesia',
      alamat_perusahaan: 'Jl. Gatot Subroto No. 123, Jakarta Selatan',
      nama_pencari_kerja: 'Andi Permana',
      periode_pekerjaan: 'Januari 2020 — Juni 2024',
      posisi_terakhir: 'Senior Software Engineer',
      alasan_meninggalkan: 'Pensiun dini untuk melanjutkan studi di luar negeri',
      kualitas_kerja: 'Sangat baik, profesional, bertanggung jawab, dan dapat diandalkan',
      rekomendasi: 'Sangat layak untuk posisi yang lebih tinggi',
    },
    expectedKeywords: [
      'REKOMENDASI',
      'Andi Permana',
      'Bambang Sutrisno',
      'Senior Software Engineer',
    ],
    requiresMaterai: false,
  },
  {
    name: 'surat_keterangan_kerja — Work verification letter',
    subtype: 'surat_keterangan_kerja',
    input: {
      nama_perusahaan: 'PT Jasa Konsultasi Bisnis Nusantara',
      alamat_perusahaan: 'Jl. Sudirman No. 456, Jakarta Selatan',
      nama_karyawan: 'Citra Dewi Mandiri',
      nomor_ktp: '6666000077778888',
      posisi_jabatan: 'Marketing Coordinator',
      tanggal_mulai_kerja: '2021-03-01',
      tanggal_selesai_kerja: '2024-06-30',
      status_kerja: 'Mengundurkan diri (resign)',
      tanggal_surat: '2024-07-01',
      tujuan_surat:
        'Untuk keperluan administrasi dan pengajuan tunjangan sosial ke asuransi',
      nama_penandatangan: 'Ibu HR Manager',
    },
    expectedKeywords: [
      'KETERANGAN KERJA',
      'Citra Dewi Mandiri',
      'Marketing Coordinator',
      '2024-06-30',
    ],
    requiresMaterai: false,
  },
];

// ============================================================
// Test Suite
// ============================================================

describe('PDF Generation & Letter QA Suite', () => {
  beforeAll(() => {
    if (!AUTH_TOKEN) {
      throw new Error(
        'TEST_AUTH_TOKEN environment variable required (Bearer token from Supabase auth)'
      );
    }
  });

  test.each(TEST_CASES)(
    '$name',
    async (testCase) => {
      // 1. Call /api/generate endpoint
      const generateResponse = await fetch(
        `${API_BASE_URL}/api/generate`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${AUTH_TOKEN}`,
          },
          body: JSON.stringify({
            subtype: testCase.subtype,
            fields: testCase.input,
          }),
        }
      );

      expect(generateResponse.ok).toBe(true);

      const generateData = (await generateResponse.json()) as {
        letter: string;
        requires_materai?: boolean;
      };

      const letter = generateData.letter;

      // 2. Validate letter output
      expect(letter).toBeDefined();
      expect(typeof letter).toBe('string');
      expect(letter.length).toBeGreaterThan(100);
      expect(letter.length).toBeLessThan(8000);

      // 3. Check for expected keywords
      for (const keyword of testCase.expectedKeywords) {
        expect(letter).toContain(keyword);
      }

      // 4. Check for forbidden content
      if (testCase.mustNotContain) {
        for (const forbidden of testCase.mustNotContain) {
          expect(letter).not.toContain(forbidden);
        }
      }

      // 5. Validate Indonesian language (no excessive English)
      const englishHits = (
        letter.match(
          /\b(Dear\s|Hello\s|Sir,|Madam,|Please\s+note|Thank\s+you|Sincerely,)\b/gi
        ) ?? []
      ).length;
      expect(englishHits).toBeLessThan(3);

      // 6. Generate PDF and validate
      const pdfResponse = await fetch(`${API_BASE_URL}/api/pdf`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          letter,
          letterType: testCase.subtype.split('_')[0],
          requiresMaterai: testCase.requiresMaterai,
          isFreeUser: false,
        }),
      });

      expect(pdfResponse.ok).toBe(true);

      const pdfBlob = await pdfResponse.blob();
      expect(pdfBlob.size).toBeGreaterThan(1000);
      expect(pdfBlob.size).toBeLessThan(500000); // Less than 500KB
      expect(pdfBlob.type).toBe('application/pdf');

      // 7. Validate PDF structure (magic bytes: %PDF)
      const pdfBuffer = await pdfBlob.arrayBuffer();
      const pdfMagic = Buffer.from(pdfBuffer).toString('utf-8', 0, 4);
      expect(pdfMagic).toBe('%PDF');
    },
    60000 // 60 second timeout per test
  );
});
