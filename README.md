# ERP Procurement System

Selamat datang di sistem **ERP Procurement**, sebuah aplikasi berbasis web modern yang dirancang untuk mengelola proses pengadaan barang secara efisien dan profesional.

## 🚀 Gambaran Aplikasi

Aplikasi ini dibangun menggunakan arsitektur modern yang menggabungkan kekuatan backend Laravel dengan frontend React yang reaktif melalui antarmuka Inertia.js. Fokus utama aplikasi adalah pada kemudahan penggunaan (UX), kecepatan, dan skalabilitas.

## 🛠️ Tech Stack

- **Backend**: Laravel 11.x (PHP)
- **Frontend**: React.js with TypeScript
- **Adapter**: Inertia.js (Membantu integrasi frontend-backend tanpa API terpisah)
- **Styling**: Tailwind CSS (Desain premium dan responsif)
- **Icons**: Lucide React
- **Database**: MySQL/PostgreSQL (Laravel standard)

## ✨ Fitur & Dokumentasi Modul

Berikut adalah daftar modul dan fitur yang telah berhasil diimplementasikan:

### 1. 🔐 Sistem Autentikasi (Auth)
Sistem keamanan tingkat lanjut yang mencakup:
- **Login & Register**: Pendaftaran dan masuk pengguna baru.
- **Verifikasi Email**: Memastikan keamanan akun pengguna.
- **Manajemen Password**: Lupa kata sandi dan pengaturan ulang.
- **Session Management**: Sesi yang aman untuk setiap pengguna.

### 2. 🏠 Dashboard
Halaman utama yang memberikan ringkasan status sistem dan selamat datang yang personal untuk pengguna.

### 3. 📦 Master Barang (Items)
Modul inti untuk manajemen inventaris procurement:
- **Daftar Barang**: Tampilan tabel dinamis (List & Grid) dengan pencarian dan filter.
- **Kategori Barang**: Pengelompokan barang berdasarkan jenis atau departemen.
- **Satuan Barang**: Pengaturan unit pengukuran (contoh: Pcs, Kg, Box).
- **Manajemen Data**: Tambah, Ubah, dan Hapus (CRUD) data barang secara real-time.

### 4. 🏢 Struktur Organisasi (Organization)
Fitur untuk mengelola hierarki dan struktur organisasi dalam perusahaan guna mendukung alur kerja procurement yang sesuai dengan struktur jabatan.

### 5. 👤 Profil Pengguna
Memungkinkan pengguna untuk memperbarui informasi pribadi dan menjaga kredensial akun mereka.

### 6. 🌐 Multi-Language Support (Internasionalisasi)
Aplikasi telah mendukung fitur multi-bahasa yang fleksibel:
- **Bahasa**: Tersedia dalam Bahasa Inggris (Default) dan Bahasa Indonesia.
- **Switcher**: Pengubah bahasa yang mudah diakses dari navbar.
- **Dynamic**: Sistem dirancang agar dapat ditambahkan bahasa baru dengan mudah tanpa perubahan kode inti (menggunakan file JSON).

## 🎨 Desain & UI/UX

Aplikasi ini mengusung tema **Modern & Premium**:
- **Sidebar Navigation**: Navigasi yang responsif dan dapat di-*expand*.
- **DataTables**: Tabel data yang canggih dengan fitur sorting, searching, dan pagination.
- **Responsive Design**: Tampilan yang optimal di perangkat Desktop maupun Mobile.
- **Micro-animations**: Transisi halus untuk pengalaman pengguna yang lebih baik.

---

*Dokumentasi ini dibuat untuk memberikan gambaran umum kemajuan pengembangan aplikasi ERP Procurement.*
