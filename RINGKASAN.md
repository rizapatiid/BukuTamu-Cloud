# Ringkasan: Karakteristik Cloud pada Aplikasi "Buku Tamu Cloud"

**Nama:** RIZA BADRUZ ZAMAN  **NIM:** 202311018  **Semester:** 7

## Deskripsi Singkat
"Buku Tamu Cloud" adalah aplikasi web sederhana yang memungkinkan pengunjung mengisi buku tamu (nama, instansi, keperluan, serta pesan dan kesan). Data tidak disimpan di komputer lokal, melainkan di **Firebase Realtime Database**, layanan basis data NoSQL milik Google Cloud yang menyimpan data dalam format JSON dan menyinkronkannya ke seluruh klien secara *realtime*. Aplikasi hanya terdiri dari file HTML, CSS, dan JavaScript; seluruh fungsi *backend* (penyimpanan, sinkronisasi, keamanan) disediakan oleh cloud.

## Karakteristik Cloud yang Terlihat (mengacu definisi NIST)

1. **On-Demand Self-Service** – Database dibuat sendiri melalui Firebase Console hanya dengan beberapa klik, tanpa perlu menghubungi penyedia layanan, membeli server, atau memasang perangkat lunak database.

2. **Broad Network Access** – Data dapat diakses dari perangkat apa pun (laptop, HP, tablet) melalui internet menggunakan browser biasa. Aplikasi cukup memanggil URL `databaseURL` milik Firebase.

3. **Resource Pooling** – Database berjalan di infrastruktur bersama milik Google (*multi-tenant*). Pengguna hanya memilih lokasi umum (mis. `asia-southeast1`), tanpa mengetahui server fisik mana yang digunakan.

4. **Rapid Elasticity / Skalabilitas** – Jumlah pengunjung dan pesan dapat bertambah tanpa perlu mengatur ulang server; kapasitas ditangani otomatis oleh Firebase.

5. **Measured Service** – Pada menu **Usage** di Firebase Console terlihat statistik jumlah koneksi, penyimpanan (GB), dan *download* data. Penggunaan ini diukur dan menjadi dasar penagihan (paket gratis *Spark* / bayar sesuai pemakaian *Blaze*).

## Karakteristik Tambahan
- **Realtime Synchronization** – Dengan *listener* `onValue()`, setiap pesan baru langsung tampil di semua browser yang terbuka tanpa *refresh*.
- **Model Layanan BaaS/PaaS** – Firebase termasuk *Backend-as-a-Service*: pengembang fokus pada kode aplikasi, sementara server, *patching*, dan *backup* dikelola Google.
- **Keamanan Terkelola** – Akses data diatur lewat *Security Rules* (validasi panjang nama/pesan, pesan tidak dapat diubah/dihapus), dan koneksi dienkripsi melalui HTTPS.
- **Ketersediaan Tinggi** – Data direplikasi oleh Google sehingga tetap tersedia walau perangkat pengguna mati.
- **Indikator koneksi** – Status "Online / Offline" dari node `.info/connected` menunjukkan aplikasi bergantung pada koneksi jaringan ke layanan cloud.

## Kesimpulan
Aplikasi Buku Tamu Cloud menunjukkan bahwa dengan layanan cloud, sebuah aplikasi yang dapat diakses bersama secara realtime dapat dibangun tanpa mengelola server sendiri. Kelima karakteristik esensial cloud computing — *on-demand self-service, broad network access, resource pooling, rapid elasticity,* dan *measured service* — terlihat langsung melalui Firebase Console dan perilaku aplikasi.

**Tautan repositori:** https://github.com/rizapatiid/BukuTamu-Cloud
