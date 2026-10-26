import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Member, Transaction, ForumEvent, Article, ActivityLog, UserProfile, OrgStructureMember } from '../types';

// Initial realistic seed data for Forum UMKM KUAT Kecamatan Tangerang
export const INITIAL_MEMBERS: Member[] = [
  {
    id: 'mem-001',
    memberNumber: 'KUAT-TNG-2026-001',
    fullName: 'Hj. Siti Rohmah',
    nik: '3671014502780001',
    phone: '081289234111',
    email: 'siti.rohmah@gmail.com',
    address: 'Jl. Daan Mogot No. 42 RT 02/RW 04',
    kelurahan: 'Babakan',
    status: 'aktif',
    joinDate: '2025-01-15',
    businessName: 'Dapur Mak Rohmah - Aneka Kue Basah & Nasi Uduk',
    category: 'Kuliner',
    topProduct: 'Kue Cucur Pandan & Tumpeng Mini',
    businessAddress: 'Jl. Daan Mogot No. 42, Babakan',
    businessPhone: '081289234111',
    memberPhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    productPhoto: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&q=80',
    legalities: 'NIB, Sertifikat Halal MUI, P-IRT',
    isPublicDirectory: true,
    createdAt: '2025-01-15T08:00:00Z',
    updatedAt: '2026-02-10T10:00:00Z',
  },
  {
    id: 'mem-002',
    memberNumber: 'KUAT-TNG-2026-002',
    fullName: 'Bambang Sugito, S.E.',
    nik: '3671011208800003',
    phone: '081318459022',
    email: 'bambang.kriya@gmail.com',
    address: 'Komplek Kehakiman Blok C No. 12',
    kelurahan: 'Buaran Indah',
    status: 'aktif',
    joinDate: '2025-02-01',
    businessName: 'Tangerang Craft & Anyaman Bambu Lestari',
    category: 'Kriya & Kerajinan',
    topProduct: 'Tas Anyaman Bambu Modern & Hampers Kerajinan',
    businessAddress: 'Jl. Veteran No. 15, Buaran Indah',
    businessPhone: '081318459022',
    memberPhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
    productPhoto: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=600&q=80',
    legalities: 'NIB, HKI Merek Terdaftar',
    isPublicDirectory: true,
    createdAt: '2025-02-01T09:30:00Z',
    updatedAt: '2026-01-20T11:15:00Z',
  },
  {
    id: 'mem-003',
    memberNumber: 'KUAT-TNG-2026-003',
    fullName: 'Nurul Hidayati',
    nik: '3671015610850002',
    phone: '085710223948',
    email: 'nurul.hijab@gmail.com',
    address: 'Jl. MH Thamrin Gg. Mandiri RT 01/RW 02',
    kelurahan: 'Cikokol',
    status: 'aktif',
    joinDate: '2025-02-18',
    businessName: 'Zaskia Hijab & Modest Fashion',
    category: 'Fashion & Tekstil',
    topProduct: 'Gamis Katun Rayon & Hijab Voal Digital Printing',
    businessAddress: 'Ruko Cikokol Plaza No. 8',
    businessPhone: '085710223948',
    productPhoto: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=600&q=80',
    legalities: 'NIB',
    isPublicDirectory: true,
    createdAt: '2025-02-18T10:00:00Z',
    updatedAt: '2026-03-01T14:00:00Z',
  },
  {
    id: 'mem-004',
    memberNumber: 'KUAT-TNG-2026-004',
    fullName: 'Ahmad Syafei',
    nik: '3671012304750005',
    phone: '081905332190',
    email: 'syafei.kopi@yahoo.com',
    address: 'Jl. Satria Sudirman No. 8',
    kelurahan: 'Kelapa Indah',
    status: 'aktif',
    joinDate: '2025-03-05',
    businessName: 'Roastery Kopi Benteng Tangerang',
    category: 'Kuliner',
    topProduct: 'Biji Kopi Robusta & Cold Brew Tangerang Blend',
    businessAddress: 'Jl. Satria Sudirman No. 8, Kelapa Indah',
    businessPhone: '081905332190',
    productPhoto: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80',
    legalities: 'NIB, P-IRT, Sertifikat Halal',
    isPublicDirectory: true,
    createdAt: '2025-03-05T08:45:00Z',
    updatedAt: '2026-02-28T16:20:00Z',
  },
  {
    id: 'mem-005',
    memberNumber: 'KUAT-TNG-2026-005',
    fullName: 'Dedi Kusnadi',
    nik: '3671011809910004',
    phone: '087788991200',
    email: 'dedi.tanah.tinggi@gmail.com',
    address: 'Jl. Benteng Betawi RT 03/RW 01',
    kelurahan: 'Tanah Tinggi',
    status: 'aktif',
    joinDate: '2025-04-12',
    businessName: 'Snack Renyah Tangerang - Keripik Singkong & Pisang Lumer',
    category: 'Kuliner',
    topProduct: 'Keripik Tempe Aneka Rasa & Keripik Pisang Keju',
    businessAddress: 'Jl. Benteng Betawi No. 88, Tanah Tinggi',
    businessPhone: '087788991200',
    productPhoto: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&w=600&q=80',
    legalities: 'NIB, P-IRT',
    isPublicDirectory: true,
    createdAt: '2025-04-12T11:20:00Z',
    updatedAt: '2026-01-15T09:30:00Z',
  },
  {
    id: 'mem-006',
    memberNumber: 'KUAT-TNG-2026-006',
    fullName: 'Eka Wahyuni, Amd.Keb',
    nik: '3671016703880002',
    phone: '081290334811',
    email: 'eka.herbal@gmail.com',
    address: 'Jl. K.S. Tubun No. 22',
    kelurahan: 'Sukarasa',
    status: 'aktif',
    joinDate: '2025-05-20',
    businessName: 'Banten Herbal & Sabun Organik Alami',
    category: 'Kesehatan & Kecantikan',
    topProduct: 'Sabun Batang Daun Kelor & Minyak VCO Extra Virgin',
    businessAddress: 'Jl. K.S. Tubun No. 22, Sukarasa',
    businessPhone: '081290334811',
    productPhoto: 'https://images.unsplash.com/photo-1608248597359-07d0f1712a7a?auto=format&fit=crop&w=600&q=80',
    legalities: 'NIB, Izin Edar BPOM',
    isPublicDirectory: true,
    createdAt: '2025-05-20T13:00:00Z',
    updatedAt: '2026-02-15T15:45:00Z',
  },
  {
    id: 'mem-007',
    memberNumber: 'KUAT-TNG-2026-007',
    fullName: 'Rian Darmawan',
    nik: '3671010507930006',
    phone: '085811224567',
    email: 'rian.printing@gmail.com',
    address: 'Jl. A. Damyati No. 10',
    kelurahan: 'Sukasari',
    status: 'aktif',
    joinDate: '2025-06-11',
    businessName: 'Creative Point Digital & Packaging Label UMKM',
    category: 'Jasa & Konsultasi',
    topProduct: 'Stiker Kemasan Tahan Air & Cetak Dus Makanan Food Grade',
    businessAddress: 'Jl. A. Damyati No. 10, Sukasari',
    businessPhone: '085811224567',
    productPhoto: 'https://images.unsplash.com/photo-1589330694653-dad6d3240a91?auto=format&fit=crop&w=600&q=80',
    legalities: 'NIB, SIUP',
    isPublicDirectory: true,
    createdAt: '2025-06-11T14:30:00Z',
    updatedAt: '2026-03-05T10:10:00Z',
  },
  {
    id: 'mem-008',
    memberNumber: 'KUAT-TNG-2026-008',
    fullName: 'Lilis Mardiana',
    nik: '3671015101820003',
    phone: '082110998877',
    email: 'lilis.sukasih@gmail.com',
    address: 'Jl. Kali Pasir RT 04/RW 01',
    kelurahan: 'Suka Asih',
    status: 'aktif',
    joinDate: '2025-07-01',
    businessName: 'Warung Dimsum & Siomay Benteng Asli',
    category: 'Kuliner',
    topProduct: 'Siomay Ikan Tenggiri & Dimsum Mentai Halal',
    businessAddress: 'Jl. Kali Pasir Pinggir Cisadane, Suka Asih',
    businessPhone: '082110998877',
    productPhoto: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=600&q=80',
    legalities: 'NIB, Sertifikat Halal',
    isPublicDirectory: true,
    createdAt: '2025-07-01T09:00:00Z',
    updatedAt: '2026-02-18T13:30:00Z',
  },
  {
    id: 'mem-009',
    memberNumber: 'KUAT-TNG-2026-009',
    fullName: 'Rudi Hartono',
    nik: '3671011504860007',
    phone: '081389776655',
    email: 'rudi.hidroponik@gmail.com',
    address: 'Jl. Windu Asri Blok A No. 5',
    kelurahan: 'Babakan',
    status: 'aktif',
    joinDate: '2025-08-14',
    businessName: 'Kebun Kota Babakan - Sayur Hidroponik Segar',
    category: 'Pertanian & Agro',
    topProduct: 'Selada Romaine, Pakcoy Hidroponik & Melon Golden',
    businessAddress: 'Jl. Windu Asri Blok A No. 5, Babakan',
    businessPhone: '081389776655',
    productPhoto: 'https://images.unsplash.com/photo-1557844352-761f2565b576?auto=format&fit=crop&w=600&q=80',
    legalities: 'NIB, Sertifikasi Prima 3',
    isPublicDirectory: true,
    createdAt: '2025-08-14T08:15:00Z',
    updatedAt: '2026-03-02T11:00:00Z',
  },
  {
    id: 'mem-010',
    memberNumber: 'KUAT-TNG-2026-010',
    fullName: 'Winda Aryani',
    nik: '3671014909950001',
    phone: '085698765432',
    email: 'winda.craft@gmail.com',
    address: 'Jl. Dr. Sitanala No. 17',
    kelurahan: 'Tanah Tinggi',
    status: 'pending',
    joinDate: '2026-02-01',
    businessName: 'Glow Resin & Wooden Giftware',
    category: 'Kriya & Kerajinan',
    topProduct: 'Talenan Kayu Jati Kombinasi Resin & Coaster Cantik',
    businessAddress: 'Jl. Dr. Sitanala No. 17, Tanah Tinggi',
    businessPhone: '085698765432',
    productPhoto: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
    legalities: 'Dalam Proses NIB',
    isPublicDirectory: false, // Belum disetujui tampil
    createdAt: '2026-02-01T10:00:00Z',
    updatedAt: '2026-02-01T10:00:00Z',
  },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'trx-001',
    transactionNumber: 'TRX-2026-001',
    type: 'pemasukan',
    category: 'Saldo Awal Tahun 2026',
    date: '2026-01-02',
    amount: 15450000,
    description: 'Saldo kas awal tahun buku 2026 Forum UMKM KUAT Kec. Tangerang',
    recorderName: 'Hj. Mardiah (Bendahara)',
    recorderId: 'usr-bendahara',
    approvalStatus: 'disetujui',
    approvedBy: 'Emus Muslihant (Ketua Forum)',
    notes: 'Dipindahkan dari buku kas tahun 2025',
    createdAt: '2026-01-02T09:00:00Z',
    updatedAt: '2026-01-02T10:00:00Z',
  },
  {
    id: 'trx-002',
    transactionNumber: 'TRX-2026-002',
    type: 'pemasukan',
    category: 'Iuran Anggota',
    date: '2026-01-15',
    amount: 2500000,
    description: 'Penerimaan iuran bulanan Januari 2026 (50 anggota x Rp 50.000)',
    recorderName: 'Hj. Mardiah (Bendahara)',
    recorderId: 'usr-bendahara',
    approvalStatus: 'disetujui',
    approvedBy: 'Emus Muslihant (Ketua Forum)',
    createdAt: '2026-01-15T14:30:00Z',
    updatedAt: '2026-01-15T15:00:00Z',
  },
  {
    id: 'trx-003',
    transactionNumber: 'TRX-2026-003',
    type: 'pengeluaran',
    category: 'Operasional Sekretariat',
    date: '2026-01-20',
    amount: 850000,
    description: 'Pengadaan ATK, printer refill, dan konsumsi rapat koordinasi bulanan',
    recorderName: 'Hj. Mardiah (Bendahara)',
    recorderId: 'usr-bendahara',
    approvalStatus: 'disetujui',
    approvedBy: 'Emus Muslihant (Ketua Forum)',
    proofUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80',
    createdAt: '2026-01-20T16:00:00Z',
    updatedAt: '2026-01-20T16:30:00Z',
  },
  {
    id: 'trx-004',
    transactionNumber: 'TRX-2026-004',
    type: 'pemasukan',
    category: 'Bantuan & Hibah',
    date: '2026-02-05',
    amount: 10000000,
    description: 'Dukungan Program Pembinaan UMKM dari Dinas Koperasi & UKM Kota Tangerang',
    recorderName: 'Hj. Mardiah (Bendahara)',
    recorderId: 'usr-bendahara',
    approvalStatus: 'disetujui',
    approvedBy: 'Emus Muslihant (Ketua Forum)',
    notes: 'Alokasi untuk pelatihan digital marketing dan perizinan NIB',
    createdAt: '2026-02-05T10:00:00Z',
    updatedAt: '2026-02-05T11:00:00Z',
  },
  {
    id: 'trx-005',
    transactionNumber: 'TRX-2026-005',
    type: 'pengeluaran',
    category: 'Kegiatan & Bazar',
    date: '2026-02-12',
    amount: 3200000,
    description: 'Sewa tenda sarnafil, sound system, dan spanduk Bazar Gebyar UMKM Cisadane',
    recorderName: 'Hj. Mardiah (Bendahara)',
    recorderId: 'usr-bendahara',
    approvalStatus: 'disetujui',
    approvedBy: 'Emus Muslihant (Ketua Forum)',
    createdAt: '2026-02-12T13:45:00Z',
    updatedAt: '2026-02-12T14:00:00Z',
  },
  {
    id: 'trx-006',
    transactionNumber: 'TRX-2026-006',
    type: 'pemasukan',
    category: 'Iuran Anggota',
    date: '2026-02-18',
    amount: 2750000,
    description: 'Penerimaan iuran bulanan Februari 2026 (55 anggota x Rp 50.000)',
    recorderName: 'Hj. Mardiah (Bendahara)',
    recorderId: 'usr-bendahara',
    approvalStatus: 'disetujui',
    approvedBy: 'Emus Muslihant (Ketua Forum)',
    createdAt: '2026-02-18T15:20:00Z',
    updatedAt: '2026-02-18T16:00:00Z',
  },
  {
    id: 'trx-007',
    transactionNumber: 'TRX-2026-007',
    type: 'pemasukan',
    category: 'Sponsor & Donasi',
    date: '2026-02-24',
    amount: 3500000,
    description: 'Sponsorship kemitraan perbankan BJB untuk fasilitasi QRIS UMKM',
    recorderName: 'Hj. Mardiah (Bendahara)',
    recorderId: 'usr-bendahara',
    approvalStatus: 'disetujui',
    approvedBy: 'Emus Muslihant (Ketua Forum)',
    createdAt: '2026-02-24T11:00:00Z',
    updatedAt: '2026-02-24T11:30:00Z',
  },
  {
    id: 'trx-008',
    transactionNumber: 'TRX-2026-008',
    type: 'pengeluaran',
    category: 'Pelatihan & Pembinaan',
    date: '2026-03-02',
    amount: 1800000,
    description: 'Honor narasumber praktisi foto produk e-commerce & sertifikasi halal',
    recorderName: 'Hj. Mardiah (Bendahara)',
    recorderId: 'usr-bendahara',
    approvalStatus: 'disetujui',
    approvedBy: 'Emus Muslihant (Ketua Forum)',
    createdAt: '2026-03-02T14:10:00Z',
    updatedAt: '2026-03-02T15:00:00Z',
  },
];

export const INITIAL_EVENTS: ForumEvent[] = [
  {
    id: 'evt-001',
    title: 'Gebyar Bazar UMKM Ramadhan Cisadane 1447H',
    description: 'Pesta kuliner takjil dan bazar produk unggulan UMKM binaan Forum UMKM KUAT Kecamatan Tangerang di bantaran Sungai Cisadane. Menghadirkan lebih dari 60 stand kuliner, fashion muslim, dan kriya.',
    date: '2026-03-15',
    time: '15.00 - 22.00 WIB',
    location: 'Pelataran Cisadane Walk, Kelurahan Sukarasa, Kec. Tangerang',
    organizer: 'Forum UMKM KUAT bekerjasama dengan Kantor Kecamatan Tangerang',
    posterUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
    status: 'terbit',
    targetAudience: 'Masyarakat umum & seluruh pelaku UMKM',
    registrationUrl: 'https://forms.gle/umkmbazartangerang2026',
    createdAt: '2026-02-01T08:00:00Z',
    updatedAt: '2026-02-15T09:00:00Z',
  },
  {
    id: 'evt-002',
    title: 'Workshop Akselerasi NIB OSS & Sertifikasi Halal Gratis (SEHATI)',
    description: 'Pendampingan langsung pembuatan Nomor Induk Berusaha (NIB) berbasis risiko dan pengajuan sertifikasi Halal Self-Declare gratis dengan fasilitator resmi dari BPJPH Kemenag dan Disperindag.',
    date: '2026-03-28',
    time: '08.30 - 13.00 WIB',
    location: 'Aula Kantor Kecamatan Tangerang, Jl. Daan Mogot No. 5',
    organizer: 'Bidang Pembinaan & Legalitas Forum UMKM KUAT',
    posterUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
    status: 'terbit',
    targetAudience: 'Pelaku UMKM Kuliner se-Kecamatan Tangerang yang belum ber-NIB/Halal',
    registrationUrl: 'https://wa.me/6281289234111?text=Daftar%20Workshop%20NIB%20Halal',
    createdAt: '2026-02-10T09:30:00Z',
    updatedAt: '2026-02-20T10:00:00Z',
  },
  {
    id: 'evt-003',
    title: 'Pelatihan Fotografi Produk dengan Smartphone & Optimasi Marketplace',
    description: 'Trik praktis membuat foto produk berkelas studio hanya menggunakan smartphone, editing canva, dan strategi pasang iklan di Shopee serta TikTok Shop.',
    date: '2026-04-12',
    time: '09.00 - 15.00 WIB',
    location: 'Ruang Kolaborasi Gedung Cisadane Lantai 2',
    organizer: 'Divisi Kreatif & Digitalisasi Forum UMKM KUAT',
    posterUrl: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=800&q=80',
    status: 'terbit',
    targetAudience: 'Pelaku UMKM Anggota Forum UMKM KUAT',
    createdAt: '2026-02-25T11:00:00Z',
    updatedAt: '2026-02-25T11:00:00Z',
  },
];

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 'art-001',
    title: 'Camat Tangerang Resmikan Galeri & Pojok UMKM KUAT di Kantor Kecamatan',
    excerpt: 'Langkah nyata pemerintah Kecamatan Tangerang dalam memfasilitasi promosi dan etalase produk unggulan 8 kelurahan.',
    content: `Kecamatan Tangerang kembali menunjukkan komitmennya dalam mendorong kebangkitan ekonomi kerakyatan dengan meresmikan Galeri & Pojok UMKM KUAT di lobi utama Kantor Kecamatan Tangerang.

Fasilitas ini bertujuan sebagai ruang pamer representatif bagi produk binaan Forum UMKM KUAT dari delapan kelurahan, mulai dari Babakan, Buaran Indah, Cikokol, Kelapa Indah, Suka Asih, Sukarasa, Sukasari, hingga Tanah Tinggi.

Ketua Forum UMKM KUAT Kecamatan Tangerang menyampaikan apresiasi setinggi-tingginya kepada Camat Tangerang beserta jajaran atas sinergi tanpa henti. "Dengan adanya Pojok UMKM ini, setiap warga yang mengurus perizinan atau layanan administrasi di kantor kecamatan dapat langsung melihat dan membeli produk lokal karya tetangga mereka sendiri," tuturnya.`,
    category: 'Kabar Kecamatan',
    author: 'Tim Humas Forum UMKM KUAT',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    publishedDate: '2026-02-20',
    status: 'terbit',
    createdAt: '2026-02-20T08:00:00Z',
    updatedAt: '2026-02-20T08:00:00Z',
  },
  {
    id: 'art-002',
    title: 'Panduan Praktis: Cara Mendapatkan Sertifikasi Halal Gratis (SEHATI) 2026',
    excerpt: 'Ketahui syarat mudah, alur pendaftaran, dan pendampingan yang disediakan Forum UMKM KUAT bagi pelaku usaha kuliner.',
    content: `Sertifikasi halal kini menjadi kebutuhan penting bagi konsumen modern dan membuka pintu akses pasar ritel modern serta ekspor. Bagi pelaku UMKM dengan proses produksi sederhana, Kementerian Agama melalui BPJPH kembali menggelar program Sertifikasi Halal Gratis (SEHATI).

Forum UMKM KUAT Kecamatan Tangerang telah menyiapkan tim pendamping proses produk halal (PPH) berlisensi yang siap membimbing anggota dari awal input dokumen SiHalal hingga terbitnya sertifikat.

Syarat utama:
1. Memiliki NIB berbasis risiko (KBLI mikro/kecil).
2. Menggunakan bahan-bahan yang sudah dipastikan kehalalannya (bersertifikat halal atau bahan alam segar).
3. Proses pengolahan higienis dan terpisah dari kontaminasi non-halal.
4. Bersedia didampingi oleh petugas PPH Forum UMKM KUAT.`,
    category: 'Edukasi Bisnis',
    author: 'Divisi Legalitas & Halal',
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
    publishedDate: '2026-02-25',
    status: 'terbit',
    createdAt: '2026-02-25T10:00:00Z',
    updatedAt: '2026-02-25T10:00:00Z',
  },
  {
    id: 'art-003',
    title: 'Strategi UMKM Tangerang Tembus Ritel Modern dan Bazar Cisadane',
    excerpt: 'Perbaiki kemasan, lengkapi legalitas, dan manfaatkan jejaring komunitas untuk scale-up omset berkali lipat.',
    content: `Banyak pelaku usaha kecil yang memproduksi makanan lezat atau kerajinan tangan berkualitas tinggi, tetapi kesulitan menembus pasar skala besar karena kendala kemasan dan legalitas.

Melalui program kurasi berkala di Forum UMKM KUAT, para anggota diberikan pendampingan perbaikan packaging tahan kedap udara, desain label dengan standar BPOM, serta pencantuman barcode dan tanggal kedaluwarsa.

Dengan jejaring yang kuat di 8 kelurahan se-Kecamatan Tangerang, peluang kolaborasi antar anggota semakin terbuka lebar.`,
    category: 'Inspirasi Usaha',
    author: 'Emus Muslihant',
    imageUrl: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=80',
    publishedDate: '2026-03-01',
    status: 'terbit',
    createdAt: '2026-03-01T11:00:00Z',
    updatedAt: '2026-03-01T11:00:00Z',
  },
];

export const INITIAL_LOGS: ActivityLog[] = [
  {
    id: 'log-001',
    userId: 'usr-admin-1',
    userName: 'Super Admin UMKM KUAT',
    action: 'Inisialisasi Sistem',
    target: 'Sistem UMKM Management',
    details: 'Database Firestore dan konfigurasi peran pengguna berhasil diaktifkan',
    timestamp: '2026-03-01T08:00:00Z',
  },
  {
    id: 'log-002',
    userId: 'usr-bendahara',
    userName: 'Hj. Mardiah (Bendahara)',
    action: 'Pencatatan Keuangan',
    target: 'TRX-2026-007',
    details: 'Menambahkan pemasukan sponsorship kemitraan BJB Rp 3.500.000',
    timestamp: '2026-03-02T11:30:00Z',
  },
  {
    id: 'log-003',
    userId: 'usr-keanggotaan',
    userName: 'Admin Keanggotaan',
    action: 'Pendaftaran Anggota',
    target: 'KUAT-TNG-2026-010',
    details: 'Mendaftarkan anggota baru Winda Aryani (Tanah Tinggi)',
    timestamp: '2026-03-03T10:15:00Z',
  },
];

export const INITIAL_ORG_STRUCTURE: OrgStructureMember[] = [
  {
    id: 'org-001',
    role: 'Pelindung',
    name: 'Riswan Setyo Kardinto, S.STP',
    title: 'Camat Kecamatan Tangerang',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    order: 1,
  },
  {
    id: 'org-002',
    role: 'Penasihat',
    name: 'Ibu Hj. DEWI SUBARSIH',
    title: 'Tokoh Penggerak & Pembina UMKM Kota Tangerang',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    order: 2,
  },
  {
    id: 'org-003',
    role: 'Ketua',
    name: 'EMus Muslihant',
    title: 'Ketua Forum UMKM KUAT Kecamatan Tangerang',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    order: 3,
  },
  {
    id: 'org-004',
    role: 'Wakil Ketua',
    name: 'Ferry Juni Purwanto',
    title: 'Koordinator Pengembangan Usaha & Kemitraan',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    order: 4,
  },
  {
    id: 'org-005',
    role: 'Sekretaris',
    name: 'DIna Fatrian S.I.Kom',
    title: 'Administrasi, Kesekretariatan & Kehumasan',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    order: 5,
  },
  {
    id: 'org-006',
    role: 'Bendahara',
    name: 'Peni Martin',
    title: 'Pengelolaan Kas, Iuran & Keuangan Forum',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    order: 6,
  },
];

// Helper to load or persist items with local cache fallbacks
const LOCAL_STORAGE_PREFIX = 'umkm_mgmt_';

function getLocalData<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_PREFIX + key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch (e) {
    return defaultValue;
  }
}

function setLocalData<T>(key: string, data: T) {
  try {
    localStorage.setItem(LOCAL_STORAGE_PREFIX + key, JSON.stringify(data));
  } catch (e) {
    console.error('LocalStorage error: ', e);
  }
}

// Data service methods
export const dbService = {
  // MEMBERS
  async getMembers(): Promise<Member[]> {
    try {
      const q = query(collection(db, 'members'), orderBy('memberNumber', 'asc'));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const list: Member[] = [];
        snapshot.forEach((d) => list.push({ id: d.id, ...(d.data() as Omit<Member, 'id'>) }));
        setLocalData('members', list);
        return list;
      }
    } catch (err) {
      console.warn('Firestore fetch failed, using local cache:', err);
    }
    // Fallback to local
    const local = getLocalData<Member[]>('members', INITIAL_MEMBERS);
    return local;
  },

  async saveMember(member: Member): Promise<void> {
    try {
      await setDoc(doc(db, 'members', member.id), member);
    } catch (err) {
      console.warn('Firestore write failed, falling back to local storage:', err);
    }
    const current = await this.getMembers();
    const idx = current.findIndex((m) => m.id === member.id);
    if (idx >= 0) {
      current[idx] = member;
    } else {
      current.push(member);
    }
    setLocalData('members', current);
  },

  async deleteMember(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'members', id));
    } catch (err) {
      console.warn('Firestore delete failed:', err);
    }
    const current = await this.getMembers();
    const updated = current.filter((m) => m.id !== id);
    setLocalData('members', updated);
  },

  // TRANSACTIONS
  async getTransactions(): Promise<Transaction[]> {
    try {
      const q = query(collection(db, 'transactions'), orderBy('date', 'desc'));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const list: Transaction[] = [];
        snapshot.forEach((d) => list.push({ id: d.id, ...(d.data() as Omit<Transaction, 'id'>) }));
        setLocalData('transactions', list);
        return list;
      }
    } catch (err) {
      console.warn('Firestore getTransactions failed, using local cache:', err);
    }
    return getLocalData<Transaction[]>('transactions', INITIAL_TRANSACTIONS);
  },

  async saveTransaction(trx: Transaction): Promise<void> {
    try {
      await setDoc(doc(db, 'transactions', trx.id), trx);
    } catch (err) {
      console.warn('Firestore saveTransaction failed:', err);
    }
    const current = await this.getTransactions();
    const idx = current.findIndex((t) => t.id === trx.id);
    if (idx >= 0) {
      current[idx] = trx;
    } else {
      current.unshift(trx);
    }
    setLocalData('transactions', current);
  },

  async deleteTransaction(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'transactions', id));
    } catch (err) {
      console.warn('Firestore deleteTransaction failed:', err);
    }
    const current = await this.getTransactions();
    const updated = current.filter((t) => t.id !== id);
    setLocalData('transactions', updated);
  },

  // EVENTS
  async getEvents(): Promise<ForumEvent[]> {
    try {
      const q = query(collection(db, 'events'), orderBy('date', 'desc'));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const list: ForumEvent[] = [];
        snapshot.forEach((d) => list.push({ id: d.id, ...(d.data() as Omit<ForumEvent, 'id'>) }));
        setLocalData('events', list);
        return list;
      }
    } catch (err) {
      console.warn('Firestore getEvents failed:', err);
    }
    return getLocalData<ForumEvent[]>('events', INITIAL_EVENTS);
  },

  async saveEvent(event: ForumEvent): Promise<void> {
    try {
      await setDoc(doc(db, 'events', event.id), event);
    } catch (err) {
      console.warn('Firestore saveEvent failed:', err);
    }
    const current = await this.getEvents();
    const idx = current.findIndex((e) => e.id === event.id);
    if (idx >= 0) {
      current[idx] = event;
    } else {
      current.unshift(event);
    }
    setLocalData('events', current);
  },

  async deleteEvent(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'events', id));
    } catch (err) {
      console.warn('Firestore deleteEvent failed:', err);
    }
    const current = await this.getEvents();
    setLocalData('events', current.filter((e) => e.id !== id));
  },

  // ARTICLES
  async getArticles(): Promise<Article[]> {
    try {
      const q = query(collection(db, 'articles'), orderBy('publishedDate', 'desc'));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const list: Article[] = [];
        snapshot.forEach((d) => list.push({ id: d.id, ...(d.data() as Omit<Article, 'id'>) }));
        setLocalData('articles', list);
        return list;
      }
    } catch (err) {
      console.warn('Firestore getArticles failed:', err);
    }
    return getLocalData<Article[]>('articles', INITIAL_ARTICLES);
  },

  async saveArticle(article: Article): Promise<void> {
    try {
      await setDoc(doc(db, 'articles', article.id), article);
    } catch (err) {
      console.warn('Firestore saveArticle failed:', err);
    }
    const current = await this.getArticles();
    const idx = current.findIndex((a) => a.id === article.id);
    if (idx >= 0) {
      current[idx] = article;
    } else {
      current.unshift(article);
    }
    setLocalData('articles', current);
  },

  async deleteArticle(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'articles', id));
    } catch (err) {
      console.warn('Firestore deleteArticle failed:', err);
    }
    const current = await this.getArticles();
    setLocalData('articles', current.filter((a) => a.id !== id));
  },

  // ACTIVITY LOGS
  async getLogs(): Promise<ActivityLog[]> {
    try {
      const q = query(collection(db, 'activity_logs'), orderBy('timestamp', 'desc'));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const list: ActivityLog[] = [];
        snapshot.forEach((d) => list.push({ id: d.id, ...(d.data() as Omit<ActivityLog, 'id'>) }));
        setLocalData('activity_logs', list);
        return list;
      }
    } catch (err) {
      console.warn('Firestore getLogs failed:', err);
    }
    return getLocalData<ActivityLog[]>('activity_logs', INITIAL_LOGS);
  },

  async addLog(log: Omit<ActivityLog, 'id' | 'timestamp'>): Promise<void> {
    const newLog: ActivityLog = {
      ...log,
      id: 'log-' + Date.now(),
      timestamp: new Date().toISOString(),
    };
    try {
      await setDoc(doc(db, 'activity_logs', newLog.id), newLog);
    } catch (err) {
      console.warn('Firestore addLog failed:', err);
    }
    const current = await this.getLogs();
    current.unshift(newLog);
    setLocalData('activity_logs', current.slice(0, 50)); // Keep recent 50
  },

  // ORGANIZATION STRUCTURE (Struktur Pengurus Organisasi)
  async getOrgStructure(): Promise<OrgStructureMember[]> {
    try {
      const q = query(collection(db, 'org_structure'), orderBy('order', 'asc'));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const list: OrgStructureMember[] = [];
        snapshot.forEach((d) => list.push({ id: d.id, ...(d.data() as Omit<OrgStructureMember, 'id'>) }));
        setLocalData('org_structure', list);
        return list;
      }
    } catch (err) {
      console.warn('Firestore getOrgStructure failed:', err);
    }
    return getLocalData<OrgStructureMember[]>('org_structure', INITIAL_ORG_STRUCTURE);
  },

  async saveOrgStructureMember(member: OrgStructureMember): Promise<void> {
    try {
      await setDoc(doc(db, 'org_structure', member.id), {
        ...member,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('Firestore saveOrgStructureMember failed:', err);
    }
    const current = await this.getOrgStructure();
    const idx = current.findIndex((m) => m.id === member.id);
    if (idx >= 0) {
      current[idx] = { ...member, updatedAt: new Date().toISOString() };
    } else {
      current.push({ ...member, updatedAt: new Date().toISOString() });
    }
    current.sort((a, b) => a.order - b.order);
    setLocalData('org_structure', current);
  },

  async deleteOrgStructureMember(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'org_structure', id));
    } catch (err) {
      console.warn('Firestore deleteOrgStructureMember failed:', err);
    }
    const current = await this.getOrgStructure();
    setLocalData('org_structure', current.filter((m) => m.id !== id));
  },

  // DATA BACKUP & RESTORE
  async exportFullBackup(): Promise<string> {
    const [members, transactions, events, articles, logs, orgStructure] = await Promise.all([
      this.getMembers(),
      this.getTransactions(),
      this.getEvents(),
      this.getArticles(),
      this.getLogs(),
      this.getOrgStructure(),
    ]);

    const backup = {
      appName: 'UMKM MANAGEMENT - Forum UMKM KUAT Kec. Tangerang',
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      data: {
        members,
        transactions,
        events,
        articles,
        logs,
        orgStructure,
      },
    };
    return JSON.stringify(backup, null, 2);
  },

  async importBackup(jsonString: string): Promise<boolean> {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.data) throw new Error('Format cadangan tidak valid');
      const { members, transactions, events, articles, logs, orgStructure } = parsed.data;

      if (Array.isArray(members)) setLocalData('members', members);
      if (Array.isArray(transactions)) setLocalData('transactions', transactions);
      if (Array.isArray(events)) setLocalData('events', events);
      if (Array.isArray(articles)) setLocalData('articles', articles);
      if (Array.isArray(logs)) setLocalData('activity_logs', logs);
      if (Array.isArray(orgStructure)) setLocalData('org_structure', orgStructure);

      return true;
    } catch (err) {
      console.error('Import failed:', err);
      return false;
    }
  },

  // Reset to initial demo data
  resetDemoData() {
    setLocalData('members', INITIAL_MEMBERS);
    setLocalData('transactions', INITIAL_TRANSACTIONS);
    setLocalData('events', INITIAL_EVENTS);
    setLocalData('articles', INITIAL_ARTICLES);
    setLocalData('activity_logs', INITIAL_LOGS);
    setLocalData('org_structure', INITIAL_ORG_STRUCTURE);
  },
};
