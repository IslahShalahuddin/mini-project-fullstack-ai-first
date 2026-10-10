# Mini PRD — Ultimate Bison Boot Sock

| Informasi | Keterangan |
|---|---|
| Versi | 1.0 |
| Status | Draft |
| Produk | Ultimate Bison Boot Sock - Imperfect Packaging |
| Sumber | [Halaman produk United By Blue](https://unitedbyblue.com/products/bison-boot-sock?variant=40799980519496) |
| Tanggal observasi | 6 Oktober 2026 |
| Scope | Satu halaman detail produk dan interaksi pemilihan varian |

> Catatan sumber: endpoint halaman menolak fetch langsung (403), tetapi halaman berhasil dirender di browser dan informasi di bawah ditranskripsikan dari halaman yang terlihat. Harga, rating, promo, dan kebijakan dapat berubah. Interaksi setelah tombol pembelian serta data inventori tidak dapat diverifikasi dari tampilan halaman.

## 1. Product Overview

Halaman detail produk membantu calon pembeli memahami karakteristik kaus kaki boot berbahan wool, melihat foto produk, membandingkan varian, dan menentukan jumlah sebelum melanjutkan ke alur belanja.

### Data produk yang diamati

| Data | Nilai |
|---|---|
| Nama | Ultimate Bison Boot Sock - Imperfect Packaging |
| Harga yang ditampilkan | US$44.00 |
| Varian warna | Coffee, Wild Green |
| Ukuran | S/M, M/L |
| Panduan ukuran | S/M: wanita 6–10, pria 5–8; M/L: wanita 10–13, pria 8–12 |
| Varian pada URL sumber | Coffee, S/M |
| Foto | Galeri 7 gambar; mencakup tampilan produk, detail, dan foto pemakaian |
| Bahan | 62% wool, 22% nylon, 15% bison wool, 1% spandex |
| Rating yang terlihat | 4.8/5 dari 886 ulasan (angka dinamis saat observasi) |
| Garansi/layanan yang ditampilkan | Gratis ongkir untuk pesanan di atas US$30; retur gratis 90 hari termasuk barang yang sudah dipakai; garansi seumur hidup |

Produk diposisikan sebagai versi lebih tinggi dan tangguh dari Ultimate Bison Socks, dengan bantalan penuh, manset ribbed bergaya varsity, penguatan tumit dan ujung, serta serat BisonShield yang diklaim hangat, mengatur suhu, menyerap kelembapan, dan tahan bau. Kemasan batch ini mungkin memiliki label “Trail Socks” alih-alih “Ultimate Socks”; halaman menyatakan produknya tetap sempurna dan dijual dengan harga lebih rendah untuk mengurangi pemborosan.

### Konten utama halaman

Header/navigasi dan breadcrumb, galeri produk, judul dan rating, harga serta promo, pemilih warna dan ukuran, panduan ukuran, kuantitas, tombol pembelian, informasi layanan, deskripsi dan bahan, lalu ulasan pelanggan dan footer.

## 2. Problem + Target User

### Problem

Pembeli perlu memahami tinggi, kehangatan, bahan, ukuran, dan tampilan produk sebelum memilih varian. Informasi ukuran serta status warna/ukuran aktif yang tidak jelas dapat menimbulkan keraguan dan salah pilih. Pengguna juga perlu memahami detail penting seperti kemasan tidak sempurna, promosi, pengiriman, retur, dan garansi sebelum melanjutkan pembelian.

### Target user

Calon pembeli kaus kaki untuk aktivitas cuaca dingin, penggunaan sehari-hari, hiking, atau sepatu kerja/boot, yang mengakses toko melalui desktop maupun ponsel. Kebutuhan utamanya adalah memeriksa gambar dan spesifikasi, memilih warna serta ukuran, menentukan jumlah, lalu melanjutkan ke proses belanja dengan keyakinan.

## 3. Goals + Non-Goals

### Goals

1. Menyajikan manfaat, bahan, panduan ukuran, harga, dan catatan kemasan dengan mudah ditemukan.
2. Memungkinkan pengguna menelusuri foto dan memilih warna, ukuran, serta jumlah.
3. Menjaga ringkasan pilihan dan status kontrol tetap sesuai dengan pilihan terbaru.
4. Menampilkan promosi, kebijakan layanan, dan bukti sosial tanpa mengganggu pemilihan produk.
5. Mendukung pengalaman yang responsif, dapat diakses dengan keyboard, dan jelas bagi pembaca layar.

### Non-Goals

- Akun pengguna, autentikasi, atau personalisasi.
- Pengelolaan stok, harga, promosi, atau ulasan melalui admin.
- Pembayaran, perhitungan pajak/ongkir, dan pemenuhan pesanan.
- Menetapkan ketersediaan stok atau batas kuantitas tanpa data inventori resmi.
- Rekomendasi produk atau sistem pencarian katalog.

Untuk prototipe frontend, integrasi backend/checkout tidak termasuk; tombol pembelian dapat memakai simulasi yang jelas. Pada implementasi toko produksi, tombol mengikuti integrasi commerce yang sudah ada.

## 4. User Flow

1. Pengguna membuka halaman melalui tautan produk.
2. Halaman menampilkan produk dan memilih varian dari URL jika varian tersebut valid; pada URL sumber, warna Coffee dan ukuran S/M terpilih.
3. Pengguna menelusuri galeri, memilih warna dan ukuran, serta membaca panduan ukuran.
4. Pengguna mengubah kuantitas dan memeriksa harga, promo, layanan, serta ringkasan varian.
5. Pengguna menekan “Add to cart” atau “Buy it now” untuk melanjutkan ke alur belanja yang tersedia.
6. Jika terjadi kegagalan penambahan keranjang, halaman menampilkan pesan yang dapat dipahami dan mempertahankan pilihan pengguna.

Kondisi awal bila URL tidak menentukan varian: tampilkan varian default yang valid dari katalog; jangan mengasumsikan ketersediaan stok. Jika varian dari URL tidak lagi valid, tampilkan pilihan default yang valid beserta statusnya secara jelas.

## 5. Features + Requirements

| ID | Fitur | Requirement |
|---|---|---|
| FR-01 | Informasi produk | Tampilkan nama, harga, rating/ulasan bila tersedia, deskripsi, manfaat utama, bahan, dan catatan “imperfect packaging”. |
| FR-02 | Galeri | Tampilkan gambar utama dan thumbnail; pilihan thumbnail mengganti gambar utama tanpa mengubah proporsi. Sertakan teks alternatif yang deskriptif. |
| FR-03 | Varian warna | Sediakan Coffee dan Wild Green. Hanya satu warna aktif; status aktif terlihat dan dapat dikenali teknologi bantu. |
| FR-04 | Ukuran | Sediakan S/M dan M/L, dengan panduan konversi ukuran yang selalu mudah ditemukan. Hanya satu ukuran aktif. |
| FR-05 | Kuantitas | Sediakan kontrol untuk menambah/mengurangi jumlah. Batas stok dan batas maksimum mengikuti data inventori; jangan menampilkan batas yang tidak diketahui sebagai fakta. |
| FR-06 | Harga dan promo | Tampilkan harga dalam USD dan promo “mix any 3 socks, save 15%” beserta syarat minimum tiga item. Harga total mengikuti kuantitas/aturan promo yang benar-benar didukung. |
| FR-07 | Aksi pembelian | Sediakan “Add to cart” dan “Buy it now”. Tampilkan status proses, keberhasilan, atau kesalahan; jangan memberi kesan transaksi berhasil bila belum dikonfirmasi sistem. |
| FR-08 | Layanan | Tampilkan informasi gratis ongkir di atas US$30, retur gratis 90 hari termasuk barang yang telah dipakai, dan garansi seumur hidup; sediakan detail kebijakan yang dapat dibuka. |
| FR-09 | Ulasan | Tampilkan ringkasan rating dan ulasan secara konsisten dengan sumber data. Angka agregat harus dinamis, bukan teks statis. |
| FR-10 | Responsif & aksesibilitas | Pada desktop, galeri dan informasi produk berdampingan; pada ponsel tersusun vertikal. Semua kontrol memiliki label, fokus terlihat, dan status semantik. |

## 6. User Stories

- **US-01:** Sebagai calon pembeli, saya ingin melihat beberapa foto produk agar dapat menilai warna, detail rajutan, dan tampilan saat dipakai.
- **US-02:** Sebagai calon pembeli, saya ingin memahami bahan, fitur, dan catatan kemasan agar dapat memutuskan apakah produk sesuai kebutuhan.
- **US-03:** Sebagai calon pembeli, saya ingin memilih warna dan ukuran serta melihat pilihan aktif agar tidak salah memilih varian.
- **US-04:** Sebagai calon pembeli, saya ingin membaca panduan ukuran agar dapat memilih ukuran yang sesuai.
- **US-05:** Sebagai calon pembeli, saya ingin mengatur jumlah dan memahami promo serta kebijakan layanan sebelum membeli.
- **US-06:** Sebagai calon pembeli, saya ingin mendapatkan status yang jelas setelah menambahkan produk ke keranjang atau melanjutkan pembelian.

## 7. Acceptance Criteria

| ID | Skenario | Hasil yang diharapkan |
|---|---|---|
| AC-01 | Halaman dibuka | Judul, harga, deskripsi ringkas, galeri, warna, ukuran, panduan ukuran, kuantitas, CTA, informasi layanan, ulasan, dan footer tampil. |
| AC-02 | URL sumber dengan variant `40799980519496` dibuka | Jika varian masih valid, Coffee dan S/M ditandai sebagai pilihan aktif; bila tidak valid, tampilkan fallback yang jelas tanpa menyatakan varian tidak tersedia sebagai tersedia. |
| AC-03 | Pengguna memilih thumbnail galeri | Gambar utama berubah ke gambar terkait, proporsi gambar tetap terjaga, dan teks alternatif sesuai gambar aktif. |
| AC-04 | Pengguna memilih warna/ukuran lain | Hanya pilihan terbaru pada kelompok tersebut yang aktif; status pilihan dan URL/varian (bila didukung sistem) mengikuti keadaan terbaru. |
| AC-05 | Pengguna mengubah kuantitas | Nilai tidak kurang dari 1 atau melebihi batas stok yang diberikan sistem; kontrol batas dinonaktifkan atau memberi penjelasan yang sesuai. |
| AC-06 | Harga/promo ditampilkan | Format mata uang konsisten; syarat promo tiga kaus kaki dinyatakan; harga tidak berubah dengan cara yang bertentangan dengan aturan promo. |
| AC-07 | Pengguna menekan CTA | Pengguna menerima indikator proses dan konfirmasi hanya setelah sistem sukses; jika gagal, pesan kesalahan tampil dan pilihan tidak hilang. |
| AC-08 | Informasi layanan atau panduan ukuran dibuka | Detail dapat diakses dengan mouse dan keyboard, status buka/tutup diumumkan secara semantik. |
| AC-09 | Halaman digunakan dengan keyboard/pembaca layar | Semua kontrol dapat dijangkau, fokus terlihat, label dan status pilihan diumumkan, serta urutan fokus masuk akal. |
| AC-10 | Halaman dilihat pada lebar 375 px | Tidak ada scroll horizontal; gambar, teks, pilihan varian, dan CTA tetap dapat digunakan. |

## 8. Constraints + Success Criteria

### Constraints

- Sumber data adalah halaman produk United By Blue; nilai harga, promo, rating, dan kebijakan dapat berubah dan perlu diverifikasi sebelum rilis.
- Tersedia dua warna dan dua ukuran yang terlihat pada halaman saat observasi; inventori per kombinasi tidak diketahui.
- Halaman sumber berbahasa Inggris dan menampilkan harga dalam USD. Lokalisasi dan konversi mata uang bukan bagian dari scope awal.
- Untuk latihan frontend: satu halaman, data lokal, HTML/CSS/JavaScript tanpa framework, tanpa API/backend, dan tanpa transaksi nyata.
- Untuk produksi: gunakan data katalog/inventori dan proses checkout yang sudah ada; jangan mengganti sumber kebenaran dengan data contoh statis.

### Success Criteria

1. Seluruh acceptance criteria lulus pada pengujian manual desktop dan mobile.
2. Pilihan varian dan gambar aktif selalu mencerminkan pilihan terbaru.
3. Tidak ada informasi stok, harga total, atau status transaksi yang menyesatkan.
4. Catatan kemasan, panduan ukuran, promo, dan kebijakan layanan dapat ditemukan sebelum pengguna membeli.
5. Alur utama dapat diselesaikan dengan keyboard dan tanpa scroll horizontal pada viewport 375 px.
6. Tidak ada error JavaScript yang menghalangi penelusuran galeri, pemilihan varian, atau aksi pembelian.
