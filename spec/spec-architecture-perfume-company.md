---
title: Technical Specification - Perfume Company Profile Website
version: 1.0
date_created: 2026-07-26
owner: Specification Architect
tags: [React, Backendless, Architecture, Frontend]
---

# Introduction

Spesifikasi Teknis ini merupakan penjabaran arsitektural dari dokumen *Product Requirements Document* (PRD) `prd-company-profile-26072026.md`. Spesifikasi ini berfungsi sebagai panduan mutlak bagi tim *Engineering* dalam mengeksekusi *coding* agar sesuai dengan keputusan arsitektur, skema data, dan batasan eksternal yang telah disepakati.

## 1. Purpose & Scope

Mendefinisikan fondasi *frontend* (**React Vite** dengan TypeScript), integrasi penyimpanan (Backendless.com & Cloudinary), serta struktur kontrak data (*Data Contracts*) untuk website profil perusahaan parfum kelas atas tanpa perlu membangun infrastruktur *backend* kustom.

## 2. Definitions

- **BaaS**: *Backend-as-a-Service* (merujuk pada Backendless.com).
- **Zustand**: *Library State Management* reaktif untuk React.
- **DOMPurify**: Modul keamanan untuk menyanitasi (membersihkan) *string* HTML dari skrip berbahaya (XSS).
- **Atomic Design**: Pola penyusunan komponen UI (Atoms, Molecules, Organisms, Templates, Pages).

## 3. Requirements, Constraints & Guidelines

- **REQ-001**: Harus dikembangkan menggunakan tumpukan teknologi: `React 18+`, `Vite`, `TypeScript`, `Tailwind CSS`, dan `Shadcn UI`.
- **REQ-002**: Validasi formulir (Login & Create Blog) wajib menggunakan **Zod** yang dikombinasikan dengan `react-hook-form`.
- **CON-001**: Aplikasi sepenuhnya berjalan di sisi klien (SPA - *Single Page Application*). Semua pengolahan data persisten berkomunikasi langsung dari browser ke API eksternal (Backendless/Cloudinary).
- **SEC-001**: Semua input `content` blog berbentuk HTML wajib disanitasi menggunakan `DOMPurify` sebelum disisipkan ke DOM via `dangerouslySetInnerHTML`.
- **GUD-001**: Struktur folder `src/components/` harus secara ketat mengikuti metodologi *Atomic Design*.
- **GUD-002 (Lighthouse SEO)**: Untuk menembus skor 100/100 di *PageSpeed Insights*, semua elemen gambar (`<img>`) wajib memiliki atribut `alt` yang deskriptif. Tautan (`<a>`) tidak boleh generik ("Klik di sini") dan harus memiliki kejelasan aksesibilitas.
- **GUD-003 (Lighthouse Performance)**: Mengingat aplikasi ini menggunakan *Client-Side Rendering* murni, pembagian kode (*Code Splitting* via `React.lazy` dan `Suspense`) wajib diimplementasikan di tingkat rute halaman (Route-level) agar metrik *First Contentful Paint* (FCP) tetap optimal.
- **GUD-004 (Typography)**: Seluruh tipografi antarmuka wajib menggunakan font **Plus Jakarta Sans** untuk menunjang estetika desain *Elegant Black* yang modern dan premium.

## 4. Interfaces & Data Contracts

### 4.1. Tabel Backendless: `Blogs`
Skema kolom yang harus dikonfigurasi di *dashboard* Backendless.com:

| Nama Kolom | Tipe Data (Backendless) | Keterangan |
| :--- | :--- | :--- |
| `objectId` | `STRING` | (Otomatis dibuat oleh sistem Backendless) |
| `title` | `STRING` | Judul artikel |
| `content` | `TEXT` | Isi artikel dalam format HTML (*Rich Text*) |
| `tags` | `JSON` / `STRING ARRAY` | Array of strings (e.g., `["perfume", "new"]`) |
| `coverImage` | `STRING` | (Opsional) URL gambar sampul dari Cloudinary |
| `created` | `DATETIME` | (Otomatis dibuat oleh sistem Backendless) |

### 4.2. Tabel Backendless: `Products`
| Nama Kolom | Tipe Data (Backendless) | Keterangan |
| :--- | :--- | :--- |
| `objectId` | `STRING` | (Otomatis dibuat oleh sistem Backendless) |
| `name` | `STRING` | Nama parfum HMNS (contoh: "Orgasm") |
| `price` | `NUMBER` | Harga produk |
| `description` | `TEXT` | Deskripsi komposisi/notes wewangian |
| `image` | `STRING` | URL gambar katalog dari Cloudinary |
| `created` | `DATETIME` | (Otomatis dibuat oleh sistem Backendless) |

### 4.3. API Eksternal: `randomuser.me`
Data Kontrak (Hanya properti yang diambil/di-mapping):
```typescript
interface TeamMember {
  name: { first: string; last: string };
  picture: { large: string };
  // Peran/Jabatan di-generate secara manual (dummy) saat di-mapping di frontend
}
```

### 4.3. Environment Variables (`.env`)
Semua kredensial wajib disimpan di dalam file `.env` dan tidak boleh di-*hardcode*:
- `VITE_BACKENDLESS_APP_ID`: ID Aplikasi Backendless.
- `VITE_BACKENDLESS_API_KEY`: Kunci API JS Backendless.
- `VITE_CLOUDINARY_CLOUD_NAME`: Nama Cloud dari Cloudinary untuk integrasi upload.
- `VITE_CLOUDINARY_UPLOAD_PRESET`: Preset *unsigned upload* Cloudinary.

## 5. Acceptance Criteria

- **AC-001**: Memenuhi arsitektur UI *Elegant Black* tanpa merusak performa *rendering*.
- **AC-002**: Pengambilan data dari Backendless tabel `Blogs` mendukung mekanisme *Infinite Scroll* (memanggil API berbasis parameter `offset` dan `pageSize`).

## 6. Test Automation Strategy

Berdasarkan kesepakatan (Opsi C), penulisan skrip pengujian terotomatisasi ditiadakan untuk fase MVP ini:
- **Test Levels**: `Manual QA Testing` secara komprehensif.
- **CI/CD**: Hanya mencakup *build linting* & *type checking* (TypeScript) sebelum di-deploy. Tidak ada eksekusi *Unit/E2E test*.

## 7. Rationale, Context & Architecture Decisions (ADRs)

- **ADR-001 (State Management)**: Memilih **Zustand** ketimbang *React Context API* murni demi mengurangi *boilerplate* dan meningkatkan kecepatan penulisan fitur Autentikasi sesi.
- **ADR-002 (Image Uploading)**: Memilih mekanisme *2-step upload* ke **Cloudinary** ketimbang mengandalkan penyimpanan file Markdown mentah, agar *Rich Text HTML* hanya perlu menyimpan URL gambar berukuran kecil (menjaga performa *query* database).
- **ADR-003 (Skema Tags)**: Disimpan sebagai `JSON (Array of Strings)`. Jika menggunakan relasi *Many-to-Many*, akan memakan waktu penyiapan skema; jika menggunakan *Comma-Separated String*, akan menyulitkan sistem *filtering* (pencarian) kelak. JSON adalah titik keseimbangan paling ideal.
- **ADR-004 (Form Validation)**: Menggunakan kombinasi **Zod** dan **React Hook Form**. Ini adalah standar modern di React ekosistem yang terintegrasi sempurna dengan arsitektur form dari *Shadcn UI*, memastikan *type-safety* TypeScript terjaga ketat.
- **ADR-005 (Rich Text Editor)**: Memilih pustaka **Tiptap** alih-alih *React Quill*. Tiptap bersifat *headless* sehingga kita bisa mendesain tampilan *toolbar*-nya agar serasi dengan tema *Elegant Black* dan *Shadcn UI*.

## 8. Dependencies & External Integrations

### Core Libraries
- **LIB-001**: `react-router-dom` - Untuk navigasi *Single Page Application* (8 rute halaman).
- **LIB-002**: `react-hook-form` & `@hookform/resolvers` (zod) - Untuk manajemen *state* form.
- **LIB-003**: `zod` - Untuk validasi skema input (contoh: *password* minimal 8 karakter).
- **LIB-004**: `@tiptap/react` & `@tiptap/starter-kit` - Pustaka *Rich Text Editor*.
- **LIB-005**: `react-helmet-async` - Mengelola tag `<head>` (SEO) secara dinamis tanpa bentrok saat *rendering*.
- **LIB-006**: `axios` - Klien HTTP untuk melakukan permintaan data ke API eksternal (`randomuser.me`).

### Third-Party Services
- **SVC-001**: `Backendless.com` - Sebagai sistem Autentikasi Admin, Sistem Manajemen Basis Data (DBMS) *headless*, dan *User Service* (untuk fitur Ganti Password via `Backendless.UserService.update`).
- **SVC-002**: `Cloudinary` - Menangani penyimpanan aset gambar blog secara independen dari teks konten.
- **SVC-003**: `randomuser.me` - Menghasilkan data fiktif foto dan nama untuk halaman *Teams*.

## 9. Examples & Edge Cases

```typescript
// Fallback Edge Case: Jika randomuser.me gagal (CORS/Timeout)
const DUMMY_TEAM: TeamMember[] = [
  { name: { first: "Jean", last: "Baptiste" }, picture: { large: "/assets/dummy-perfumer-1.jpg" } },
  { name: { first: "Coco", last: "Noir" }, picture: { large: "/assets/dummy-perfumer-2.jpg" } }
];

const fetchTeams = async () => {
  try {
    const res = await axios.get('https://randomuser.me/api/?results=10');
    return res.data.results;
  } catch (error) {
    console.warn("randomuser.me failed. Using fallback data.");
    return DUMMY_TEAM;
  }
};
```

## 10. Validation Criteria

- *Load time* metrik halaman tidak lebih dari 2 detik.
- Tidak ada eror CORS saat memanggil `randomuser.me` dari domain *production*.
- Serangan input `<script>alert('XSS')</script>` di halaman *Create Blog* tidak tereksekusi ketika dirender di halaman `/blog/:id`.

## 11. Related Specifications / Further Reading

- [PRD: Perfume Company Profile Website](../doc/prd-company-profile-26072026.md)
