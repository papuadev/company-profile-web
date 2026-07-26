## PRD: Perfume Company Profile Website

## 1. Product overview
### 1.1 Document title and version
- PRD: Perfume Company Profile Website
- Version: 1.0

### 1.2 Product summary
Website profil perusahaan untuk merek parfum kelas atas yang didesain secara spesifik untuk membangun *brand awareness* secara elegan dan premium (dengan tema *Elegant Black*). Proyek ini mencakup 8 halaman utama (Home, About Us, Services/Products, Teams, Blog List, Blog Detail, Create Blog, dan Login) yang berfokus pada pameran produk, cerita *brand*, dan sistem pengelolaan blog sederhana. Seluruh fitur dinamis seperti Autentikasi dan Database Blog akan dijalankan secara *backendless* menggunakan integrasi platform Backendless.com.

## 2. Goals
### 2.1 Business goals
- Membangun citra merek parfum yang eksklusif, mewah, dan profesional di internet.
- Menyediakan katalog informasi produk (wewangian) yang jelas bagi calon pelanggan.
- Menjadi saluran komunikasi resmi melalui publikasi artikel (*Blog*).

### 2.2 User goals
- Mengetahui profil, sejarah, dan nilai *culture* perusahaan parfum ini.
- Melihat daftar produk parfum yang ditawarkan, harga, serta testimoni pembelinya.
- Membaca konten blog seputar gaya hidup dan parfum.
- (Bagi Admin) Dapat *login* secara aman dan mempublikasikan artikel baru.

### 2.3 Non-goals (Out of Scope)
- **E-Commerce Checkout:** Tidak ada fitur keranjang belanja (Cart) atau gerbang pembayaran (Payment Gateway) pada fase MVP ini.
- **Pendaftaran Publik:** Pengunjung biasa tidak bisa mendaftar akun; fitur Login murni ditujukan bagi Admin internal.

## 3. User personas
### 3.1 Key user types
- Pengunjung / Calon Pelanggan (Visitor)
- Administrator Web (Admin)

### 3.2 Basic persona details
- **Visitor**: Seseorang yang tertarik dengan produk wewangian mewah, mencari informasi harga, atau sekadar membaca blog perusahaan.
- **Admin**: Staf pemasaran atau pengelola web dari perusahaan parfum yang bertugas mem-posting pembaruan atau artikel secara berkala.

### 3.3 Role-based access
- **Visitor**: Hanya memiliki akses lihat (*Read-Only*) ke seluruh halaman publik (Home, About, Services, Teams, Blog List).
- **Admin**: Memiliki hak untuk masuk via halaman `/login`, mengakses halaman `/create-blog`, dan mempublikasikan artikel (Write Access).

## 4. Functional requirements
- **Public Pages** (Priority: High)
  - Harus menampilkan UI *Elegant Black*. Tersedia navigasi ke Home, About Us, Services, Teams, Blog List, dan Blog Detail.
- **Dynamic Teams Fetch** (Priority: Medium)
  - Mengambil data profil fiktif dari API `randomuser.me` menggunakan Axios.
  - *Edge Case Handling*: Jika API gagal/timeout, sistem menggunakan data *dummy* statis sebagai *fallback*.
- **Blog System & Auth** (Priority: High)
  - Autentikasi Admin dan pengelolaan data Blog penuh (*CRUD: Create, Read, Update, Delete*) di platform *Backendless.com*.
  - Penyimpanan Media: Integrasi *2-step upload* menggunakan **Cloudinary** untuk gambar di dalam konten Markdown.

## 5. User experience
### 5.1 Entry points & first-time user flow
- Pengunjung masuk melalui Homepage dan langsung disambut oleh *Hero Section* dengan gambar parfum elegan.
- Admin mengakses `/login` dari URL spesifik untuk masuk ke sistem pembuatan blog.

### 5.2 Core experience
- **Browsing**: Navigasi antar halaman publik terasa sangat mulus dengan transisi *fade-in*. Saat menelusuri artikel di `/blog`, artikel baru dimuat otomatis (*Infinite Scroll*).
- **Publishing**: Admin login dengan kredensialnya -> mengisi *form* (Judul, Konten via Rich Text Editor, Tags) -> Submit -> kembali ke Blog List.

### 5.3 UI/UX highlights & Edge cases
- Penggunaan warna latar *Deep Black* dan elemen aksen Emas.
- **Edge Case 1 (Teams API Down):** UI tidak boleh terlihat rusak/kosong. Jika gagal memuat, *fallback dummy data* akan langsung ditampilkan secara instan.
- **Edge Case 2 (Sesi Berakhir saat Mengetik):** Kita akan menerapkan **Silent Token Refresh**. Jika token *expired* saat menekan *Submit*, sistem akan secara otomatis me-*refresh* token di latar belakang (via *Axios Interceptor* atau SDK) dan mengulang pengiriman form tanpa disadari oleh Admin, sehingga data ketikan aman 100%.

## 6. Narrative
Pengunjung (Calon Pelanggan) akan merasakan pengalaman menjelajah web yang eksklusif saat menelusuri katalog parfum. Di balik layar, staf internal (Admin) dengan mudah membagikan berita terbaru melalui portal khusus Admin yang didukung oleh keandalan infrastruktur awan (BaaS).

## 7. Success metrics
### 7.1 User-centric metrics
- Waktu memuat (*Load time*) di bawah 2 detik untuk setiap halaman agar memanjakan pengalaman pengunjung.
### 7.2 Business metrics
- Peluncuran MVP (*Minimum Viable Product*) sukses dalam batas waktu.
### 7.3 Technical metrics
- `0` error atau kejanggalan (*glitches*) pada pemanggilan API `randomuser.me` maupun API dari `Backendless.com`.

## 8. Technical considerations (Input for Engineering Team)
### 8.1 Integration points
- **Backendless.com SDK**: Untuk fungsionalitas `Login` (Authentication API) dan penyimpanan Blog (Data API).
- **Axios**: Untuk mengambil HTTP GET data ke `https://randomuser.me/api/`.
- **React Helmet (Async)**: Mengelola `<head>` dokumen secara dinamis (*Title, Meta Description*) di setiap halaman agar lebih *SEO Friendly*.

### 8.2 Data storage & privacy
- *Credentials* Admin tidak akan pernah disimpan di *source code*, melainkan di-set langsung di *Dashboard Backendless*.

### 8.3 Scalability & potential technical challenges
- **Rich Text / HTML Sanitization**: Karena menggunakan *Rich Text Editor*, input yang disubmit akan berupa string HTML. Kita wajib menggunakan pustaka *sanitizer* (seperti `DOMPurify`) sebelum merendernya dengan `dangerouslySetInnerHTML` di React, untuk mencegah serangan XSS (*Cross-Site Scripting*).

## 9. Milestones & sequencing
### 9.1 Project estimate & Team composition
- **Size**: 1 Minggu | **Team**: 1 Fullstack (Frontend) Developer.
### 9.2 Suggested phases
- **Phase 1**: Inisialisasi **Vite + React** + Tailwind + UI (Shadcn). Setup struktur *Atomic Design*.
- **Phase 2**: Pembuatan halaman statis (Home, About, Services).
- **Phase 3**: Integrasi Teams via Axios & Integrasi Backendless (Login & Blog).

## 10. User stories & Acceptance Criteria

### 10.1. Menjelajah Halaman Utama
- **ID**: PRF-001
- **Story**: Sebagai Visitor, saya ingin melihat halaman Homepage yang elegan, sehingga saya dapat memahami citra merek ini sekilas.
- **Acceptance criteria**:
  - [ ] Terdapat Hero Section, Company Overview, cuplikan produk, dan testimonial.
  - [ ] Navigasi ke About Us, Services, dan Blog berjalan tanpa *reload* seluruh halaman (via *React Router*).
  - [ ] Menggunakan **React Helmet** untuk mengatur *Title* ("Home | Perfume Brand") dan meta deskripsi.

### 10.2. Melihat Anggota Tim (Dynamic)
- **ID**: PRF-002
- **Story**: Sebagai Visitor, saya ingin melihat halaman Teams, sehingga saya tahu siapa di balik parfum ini.
- **Acceptance criteria**:
  - [ ] Halaman melakukan `GET` request ke `randomuser.me`.
  - [ ] Menampilkan 10 data tim berupa *grid cards* (foto, nama, peran).
  - [ ] **Jika API gagal (timeout/CORS)**, otomatis menggunakan data tim *dummy* tanpa merusak layout.

### 10.3. Login sebagai Admin
- **ID**: PRF-003
- **Story**: Sebagai Admin, saya ingin masuk ke dalam sistem menggunakan otentikasi, agar saya bisa membuat blog baru secara eksklusif.
- **Acceptance criteria**:
  - [ ] Halaman `/login` memiliki form email dan password.
  - [ ] Autentikasi terhubung dengan API Backendless.com.
  - [ ] **Silent Refresh**: Sistem mampu me-*refresh* token kedaluwarsa secara otomatis di latar belakang.
  - [ ] Mencegah pengunjung biasa (*unauthenticated*) mengakses `/create-blog`.

### 10.4. Membuat Blog Baru
- **ID**: PRF-004
- **Story**: Sebagai Admin yang sudah login, saya ingin membuat artikel blog, agar pengunjung dapat membacanya.
- **Acceptance criteria**:
  - [ ] Formulir di `/create-blog` memuat input Judul, Konten (Rich Text Editor / WYSIWYG), dan Tags.
  - [ ] Mendukung *2-step upload* gambar ke **Cloudinary** dan menyisipkannya secara visual ke dalam editor.
  - [ ] Saat *Submit*, data disimpan ke tabel Backendless dalam format HTML.
  - [ ] Admin di-redirect ke `/blog` setelah sukses menyimpan.

### 10.5. Melihat Daftar Blog
- **ID**: PRF-005
- **Story**: Sebagai Visitor, saya ingin melihat daftar blog, sehingga saya bisa memilih artikel yang menarik untuk dibaca.
- **Acceptance criteria**:
  - [ ] Halaman `/blog` menampilkan seluruh data blog yang ditarik dari tabel Backendless.
  - [ ] Data ditampilkan dalam layout Grid dengan mencantumkan judul, potongan teks (*excerpt*), dan tanggal.
  - [ ] Menggunakan mekanisme **Infinite Scroll** untuk memuat artikel tambahan secara otomatis saat halaman digulir ke bawah demi menjaga performa *load time*.

### 10.6. Mengedit Blog
- **ID**: PRF-006
- **Story**: Sebagai Admin, saya ingin bisa mengedit artikel blog yang sudah diterbitkan, agar saya bisa memperbaiki *typo* atau memperbarui informasi.
- **Acceptance criteria**:
  - [ ] Admin memiliki tombol "Edit" di setiap artikel (hanya terlihat saat login).
  - [ ] Form Edit menampilkan data artikel yang sudah ada.
  - [ ] Menyimpan perubahan (Update) ke Backendless tanpa mengubah tanggal pembuatan awal.

### 10.7. Menghapus Blog
- **ID**: PRF-007
- **Story**: Sebagai Admin, saya ingin bisa menghapus artikel blog, agar konten yang sudah tidak relevan bisa dihilangkan.
- **Acceptance criteria**:
  - [ ] Admin memiliki tombol "Delete" dengan konfirmasi (untuk mencegah hapus tak sengaja).
  - [ ] Menghapus data secara permanen dari Backendless saat dikonfirmasi.

### 10.8. Membaca Detail Blog
- **ID**: PRF-008
- **Story**: Sebagai Visitor, saya ingin bisa mengklik artikel di daftar blog untuk membaca isi lengkapnya di halaman terpisah.
- **Acceptance criteria**:
  - [ ] Terdapat rute `/blog/:id` yang didedikasikan untuk menampilkan *Rich Text HTML* secara penuh (termasuk gambar).
  - [ ] Hasil render HTML wajib di-sanitasi menggunakan `DOMPurify` untuk menghindari XSS.
  - [ ] Mengubah *Meta Title* halaman sesuai dengan Judul Artikel menggunakan **React Helmet** (sangat krusial untuk SEO).
  - [ ] Memiliki tombol *Back* untuk kembali ke daftar blog.

### 10.9. Manajemen Produk (CMS)
- **ID**: PRF-009
- **Story**: Sebagai Admin, saya ingin bisa menambah, mengedit, dan menghapus produk parfum beserta harganya, agar katalog selalu *up-to-date*.
- **Acceptance criteria**:
  - [ ] Menggunakan tabel `Products` di Backendless.
  - [ ] Admin memiliki form untuk Input (Nama, Harga, Deskripsi, Upload Gambar via Cloudinary).
  - [ ] Harga otomatis diformat dan ditampilkan dalam Rupiah (IDR) di frontend.
  - [ ] Pengunjung dapat melihat katalog produk terbaru di halaman publik yang langsung ditarik dari database secara dinamis.

### 10.10. Admin Dashboard & Ganti Password
- **ID**: PRF-010
- **Story**: Sebagai Admin, saya ingin memiliki halaman Dashboard pusat setelah login untuk mengakses menu pengelolaan (Blog & Produk) serta mengganti password saya demi keamanan.
- **Acceptance criteria**:
  - [ ] Terdapat halaman `/admin` (terproteksi) yang memiliki *Sidebar/Navbar* menu: "Kelola Blog", "Kelola Produk", dan "Pengaturan".
  - [ ] Di menu Pengaturan, terdapat form untuk mengubah Password akun Admin.
  - [ ] Menggunakan API *User Service* Backendless untuk memperbarui *password*.
