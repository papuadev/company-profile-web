---
title: Project Discovery & Architecture Summary
status: DRAFT (Phase 0)
date_analyzed: 2026-07-26
---

# Project Discovery Summary

## 1. Project Overview

Website **Company Profile** untuk perusahaan parfum kelas atas (luxury perfume brand). Website ini bertujuan untuk membangun *brand awareness*, menampilkan katalog produk unggulan, menceritakan filosofi perusahaan, serta mempublikasikan artikel (blog) terkait gaya hidup dan parfum. Mengusung tema "Elegant Black", antarmuka website ini akan menonjolkan kesan misterius, mewah, dan premium.

## 2. Technology Stack & Infrastructure

- **Core Framework/Language:** React (via Vite) dengan TypeScript.
- **Styling & UI:** Tailwind CSS dan Shadcn UI (Dikonfigurasi dengan tema *Dark Mode* secara default).
- **HTTP Client:** Axios (untuk mengambil data eksternal seperti `randomuser.me`).
- **State Management:** React Context API atau Zustand (untuk menyimpan status *login*).
- **Infrastructure/Data Storage:** Menggunakan platform **Backendless.com** (BaaS) terintegrasi via SDK JS resmi untuk Autentikasi Pengguna dan Database (menyimpan data Blog).

## 3. Current Architecture Assessment & Design Ideas

Proyek ini akan dibangun menggunakan pendekatan *Separation of Concerns* (SoC) yang rapi, memastikan skalabilitas jika nantinya dikembangkan dengan *backend* nyata. 

- **Struktur Folder (Atomic Design & SoC):**
  - `src/components/atoms/`: Elemen dasar (*Button, Input, Typography*).
  - `src/components/molecules/`: Gabungan atom (*Search Bar, Form Input Group*).
  - `src/components/organisms/`: Bagian UI yang utuh (*Navbar, Footer, Hero Section*).
  - `src/components/templates/`: Tata letak kerangka (*MainLayout, AuthLayout*).
  - `src/pages/`: 7 Halaman utama (merakit *template* dan mengambil data).
  - `src/services/`: Logika pengambilan data (`axios`, atau API *backendless*).
  - `src/types/`: *Interface* TypeScript untuk `User`, `Blog`, `Product`, dll.
  - `src/utils/`: Utilitas format tanggal, validasi form, dll.

- **Design Aesthetics (Elegant Black):**
  - **Palet Warna:** *Deep Black* (`#0A0A0A`), *Dark Gray* (`#1A1A1A`) untuk *card*, dengan aksen **Emas** (`#D4AF37`) atau **Perak** untuk memancarkan aura kemewahan parfum.
  - **Tipografi:** Kombinasi *font Serif* (seperti `Playfair Display`) untuk *Heading/Judul* agar terasa klasik, dan *Sans-serif* (seperti `Inter`) untuk teks paragraf demi keterbacaan.
  - **Efek Visual:** Animasi *fade-in* yang halus, transisi *hover* lambat pada gambar produk, dan *Glassmorphism* (efek kaca buram) transparan untuk Navbar.

## 4. Key Workflows & Domain Logic

1. **Authentication Flow (via Backendless.com):**
   - Menggunakan layanan **Backendless.com** (BaaS) dengan SDK JavaScript resmi.
   - User mengunjungi halaman `Create Blog` -> Sistem mengecek *State Login* (melalui session token Backendless).
   - Jika belum login, di-*redirect* ke halaman `Login`.
   - Di halaman `Login`, user login dengan kredensial. Backendless memvalidasi dan mengirimkan session token -> Redirect kembali ke `Create Blog`.

2. **Blog Creation Flow:**
   - Admin (yang sudah login) mengisi *form* (Judul, Konten Markdown/Teks, Tags).
   - Data di-submit -> `services` memanggil API Backendless.com untuk menyimpan data ke tabel `Blogs`.
   - Admin diarahkan ke halaman `Blog List` untuk melihat hasilnya (di-fetch dari tabel `Blogs` di Backendless).

3. **Dynamic Teams Flow:**
   - User mengunjungi halaman `Teams`.
   - Komponen memanggil fungsi `getTeamMembers` di `services`.
   - Fungsi tersebut menggunakan **Axios** untuk melakukan *request* `GET` ke `https://randomuser.me/api/?results=10`.
   - Data di-mapping ke dalam komponen *Card* (menampilkan foto elegan, nama, dan simulasi jabatan).

## 5. Page Requirements (Berdasarkan Brief)

1. **Homepage:** Harus memiliki *Hero Section* (Banner gambar/video, misi perusahaan), *Company Overview*, daftar produk singkat, *Testimonials*, Logo, *Tagline*, dan link navigasi (ke About Us, Services, Blog).
2. **About Us:** Berisi *Company History* (cerita pendiri & pencapaian), Tim pengrajin parfum, dan *Culture* perusahaan.
3. **Products / Services:** Menampilkan daftar parfum dengan deskripsi jelas, rincian harga (Pricing), dan *Testimonials* dari klien.
4. **Teams:** Menampilkan data dari `randomuser.me` (Foto, nama, peran, biodata singkat).
5. **Blog List:** Menampilkan artikel dengan Judul, *Summary/Excerpt*, Penulis, dan Tanggal rilis, beserta tombol/link "Read More". Layout berupa *Grid/List*.
6. **Create Blog:** Form (Judul, Konten Markdown, Tags) eksklusif untuk Admin.
7. **Login:** Halaman untuk mengautentikasi Admin sebelum bisa membuat blog.

## 6. Handoff Notes for Product Manager (@ProductManagerPRD)

- **Keputusan Backendless.com:** Proyek ini *tidak* menggunakan simulasi `localStorage`, melainkan langsung menggunakan platform BaaS **Backendless.com**. PM harus mencatat bahwa kita memerlukan pembuatan *Project/App* di dashboard Backendless untuk mendapatkan *API Key* dan *Application ID*.
- **Manajemen Konten:** Karena kita menggunakan Backendless, data *Blog* akan tersimpan secara permanen di *cloud*. Untuk *Products* dan *Services*, saat ini datanya masih direncanakan *hardcoded* di frontend. Jika ke depannya Product/Service akan dinamis, kita harus membuat tabel tambahan di Backendless.
- **Keamanan:** Login menggunakan otentikasi resmi dari Backendless SDK yang sangat aman (*token-based*).
