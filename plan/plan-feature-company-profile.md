---
goal: Project Setup and Full Implementation of Perfume Company Profile Web
version: 1.0
date_created: 2026-07-26
owner: Planner Architect
status: 'Planned'
tags: [feature, architecture, frontend]
---

# Introduction

![Status: Planned](https://img.shields.io/badge/status-Planned-blue)

Dokumen ini adalah Rencana Implementasi (*Implementation Plan*) resmi yang menjabarkan langkah-demi-langkah pengerjaan kode untuk *Perfume Company Profile Website*. Dokumen ini mematuhi spesifikasi arsitektur yang telah dibuat (React Vite, Backendless, Cloudinary, Atomic Design) dan akan dieksekusi secara berurutan oleh AI Agent.

## 1. Requirements & Constraints

- **REQ-001**: Aplikasi Frontend (SPA) menggunakan Vite, React 18+, TypeScript, Tailwind CSS, dan Shadcn UI.
- **CON-001**: Data statis (Home, About, Services) harus dipisahkan ke dalam file *Local Constants* agar JSX tetap bersih.
- **CON-002**: Penggunaan `DOMPurify` mutlak untuk mencegah XSS pada *Rich Text HTML* blog.
- **CON-003**: Semua rahasia koneksi API harus menggunakan `VITE_` *environment variables*.

## 2. Implementation Steps

> **⚠️ EXECUTION DIRECTIVE FOR AI AGENTS:** 
> You MUST execute this plan phase by phase. You MUST run the specific testing/verification task at the end of each phase. After a phase is tested, you **MUST STOP AND WAIT** for the user's explicit approval before proceeding to the next phase.

### Implementation Phase 1: Inisialisasi Proyek & Arsitektur Dasar
- GOAL-001: Membangun fondasi proyek, instalasi pustaka, dan menyiapkan kerangka arsitektur *Atomic Design*.

| Task     | Description                                                             | Completed | Date       |
| -------- | ----------------------------------------------------------------------- | --------- | ---------- |
| TASK-001 | Inisialisasi Vite React TypeScript (`npm create vite@latest`)           |    [x]    | 2026-07-26 |
| TASK-002 | Konfigurasi Tailwind CSS dan inisialisasi komponen dasar *Shadcn UI*    |    [x]    | 2026-07-26 |
| TASK-003 | Instalasi dependensi inti (`react-router-dom`, `react-helmet-async`, `axios`, `@fontsource/plus-jakarta-sans`) |    [x]    | 2026-07-26 |
| TASK-004 | Membuat struktur folder *Atomic Design* (`atoms`, `molecules`, `organisms`, `pages`) dan `src/data` |    [x]    | 2026-07-26 |
| TASK-00X | **VERIFY**: Jalankan `npm run dev` dan pastikan Vite server berjalan tanpa *error* di konsol. |    [x]    | 2026-07-26 |
| TASK-00Y | **APPROVAL**: Wait for explicit user confirmation to proceed to Phase 2 |           |            |

### Implementation Phase 2: Halaman Statis & UI Murni
- GOAL-002: Membangun struktur *Local Constants* dan merakit antarmuka publik bertema *Elegant Black*.

| Task     | Description                                                     | Completed | Date |
| -------- | --------------------------------------------------------------- | --------- | ---- |
| TASK-005 | Membuat file `src/data/constants.ts` berisi data statis Home, About, Services |    [x]    | 2026-07-26 |
| TASK-006 | Membuat komponen *Layouting* global (Navbar & Footer)           |    [x]    | 2026-07-26 |
| TASK-007 | Mengimplementasikan UI halaman Home, About Us, dan Services     |    [x]    | 2026-07-26 |
| TASK-00X | **VERIFY**: Navigasi antar halaman statis berjalan lancar dan data statis *render* sempurna. |    [x]    | 2026-07-26 |
| TASK-00Y | **APPROVAL**: Wait for explicit user confirmation to proceed    |           |      |

### Implementation Phase 3: Integrasi Data Eksternal (Teams)
- GOAL-003: Menyambungkan *frontend* dengan API pihak ketiga secara reaktif dan aman.

| Task     | Description                                                     | Completed | Date |
| -------- | --------------------------------------------------------------- | --------- | ---- |
| TASK-008 | Membuat logika Axios GET request ke `https://randomuser.me/api/?results=10` |    [x]    | 2026-07-26 |
| TASK-009 | Membangun UI halaman Teams dengan layout Grid (Shadcn Cards)    |    [x]    | 2026-07-26 |
| TASK-010 | Mengimplementasikan logika *fallback dummy data* (Jika API gagal) |    [x]    | 2026-07-26 |
| TASK-00X | **VERIFY**: Halaman Teams berhasil menampilkan 10 orang. Uji *fallback* dengan menyabotase URL API. |    [x]    | 2026-07-26 |
| TASK-00Y | **APPROVAL**: Wait for explicit user confirmation to proceed    |           |      |

### Implementation Phase 4: Autentikasi Admin & State Management
- GOAL-004: Mengunci akses aplikasi menggunakan *State Management* dan Backendless.

| Task     | Description                                                     | Completed | Date |
| -------- | --------------------------------------------------------------- | --------- | ---- |
| TASK-011 | Instalasi `zustand`, `zod`, dan `react-hook-form`. Inisialisasi Backendless SDK |           |      |
| TASK-012 | Membuat *Zustand Store* untuk sesi Login & *Silent Refresh*     |           |      |
| TASK-013 | Membangun `/login` form terintegrasi validasi Zod               |           |      |
| TASK-014 | Membuat komponen `ProtectedRoute` dan *Layout* `/admin` (Dashboard dengan *Sidebar/Navbar* menu Blog, Product, Settings) |           |      |
| TASK-015 | Implementasi form *Change Password* di `/admin/settings`        |           |      |
| TASK-00X | **VERIFY**: Coba login, pastikan diarahkan ke `/admin`. Tes ubah password, *logout*, dan *login* dengan password baru. |           |      |
| TASK-00Y | **APPROVAL**: Wait for explicit user confirmation to proceed    |           |      |

### Implementation Phase 5: Sistem Blog (CMS, Tiptap, & Cloudinary)
- GOAL-005: Merealisasikan manajemen konten kaya (*Rich Text*) untuk blog beserta kapabilitas unggah gambar (berada di dalam rute `/admin`).

| Task     | Description                                                     | Completed | Date |
| -------- | --------------------------------------------------------------- | --------- | ---- |
| TASK-016 | Instalasi `@tiptap/react`, `@tiptap/starter-kit`, dan `dompurify` |           |      |
| TASK-017 | Implementasi fungsi `uploadToCloudinary` (*2-step upload*)      |           |      |
| TASK-018 | Membangun UI `/admin/create-blog` dan `/admin/edit-blog/:id` (Tiptap Editor)|           |      |
| TASK-019 | Membangun UI `/admin/blogs` (Daftar Blog Admin) dengan *Infinite Scroll* |           |      |
| TASK-020 | Membangun UI `/blog/:id` (Publik) dengan *DOMPurify* dan injeksi metadata SEO |           |      |
| TASK-00X | **VERIFY**: Pembuatan Blog -> Muncul di Daftar -> Klik Detail -> Metadata SEO berubah -> Edit Blog -> Hapus Blog (End-to-End CMS test). |           |      |
| TASK-00Y | **APPROVAL**: Wait for explicit user confirmation to complete   |           |      |

### Implementation Phase 6: Sistem Katalog Produk (CMS)
- GOAL-006: Membuat sistem dinamis untuk halaman Produk HMNS agar harga dan katalog bisa diatur mandiri oleh Admin (di dalam rute `/admin`).

| Task     | Description                                                     | Completed | Date |
| -------- | --------------------------------------------------------------- | --------- | ---- |
| TASK-021 | Mengubah halaman *Products/Services* publik agar *GET* ke tabel `Products` (dengan format **IDR**) |           |      |
| TASK-022 | Membangun antarmuka `/admin/products` untuk CRUD Katalog        |           |      |
| TASK-023 | Implementasi fungsi CRUD Produk terhubung ke Backendless dan Cloudinary |           |      |
| TASK-00X | **VERIFY**: Tambah produk baru di panel Admin -> Cek apakah langsung muncul di halaman pengunjung dengan format Rp. |           |      |
| TASK-00Y | **APPROVAL**: Rilis final aplikasi siap dilaksanakan.           |           |      |

## 3. Alternatives

- **ALT-001**: Menggunakan Next.js (Ditolak) - Dibatalkan karena melanggar instruksi *brief* utama yang mewajibkan React Vite.
- **ALT-002**: Menggunakan React Context murni untuk *State Management* (Ditolak) - Menggunakan *Zustand* dinilai lebih ringkas untuk *deadline* 1 minggu (ADR-001).

## 4. Dependencies

- **DEP-001**: Backendless.com (Akses *Dashboard* untuk menyetel Tabel `Blogs` dan kredensial Admin)
- **DEP-002**: Akun Cloudinary (Untuk mendapatkan `CLOUD_NAME` dan `UPLOAD_PRESET`)

## 5. Files

- **FILE-001**: `src/App.tsx` (Pusat *Routing*)
- **FILE-002**: `src/data/constants.ts` (Pusat Data Statis)
- **FILE-003**: `.env` (Penyimpanan Variabel Lingkungan Lokal)

## 6. Testing

- **TEST-001**: *Manual QA* pada setiap akhir fase.
- **TEST-002**: *Lighthouse Check* opsional di akhir fase 5 untuk memastikan nilai SEO.

## 7. Risks & Assumptions

- **RISK-001**: Jika struktur API `randomuser.me` berubah, *mapping* data akan gagal. Sistem bergantung pada *fallback dummy*.
- **ASSUMPTION-001**: Administrator Backendless telah menyediakan tabel `Blogs` dengan struktur kolom yang persis sama dengan Spesifikasi Teknis sebelum Fase 4 dimulai.

## 8. Related Specifications / Further Reading

- [Spesifikasi Teknis: spec-architecture-perfume-company.md](../spec/spec-architecture-perfume-company.md)
- [Product Requirements: prd-company-profile-26072026.md](../doc/prd-company-profile-26072026.md)
