# Buku Tamu Cloud

| | |
|---|---|
| **Nama** | RIZA BADRUZ ZAMAN |
| **NIM** | 202311018 |
| **Semester** | 7 |
| **Repositori** | <https://github.com/rizapatiid/BukuTamu-Cloud> |

Aplikasi web buku tamu sederhana. Data tamu yang diisi lewat form disimpan di **Firebase Realtime Database** dan **tampil secara realtime** di semua browser yang membuka halaman, tanpa perlu *refresh*.

## Fitur

- Form buku tamu: nama lengkap, instansi/asal, email, no. telepon, keperluan, bertemu dengan, serta pesan & kesan.
- Validasi input di sisi klien dan di sisi server (Firebase Security Rules).
- Daftar tamu diperbarui otomatis secara realtime (listener `onValue`).
- Ringkasan jumlah tamu (total dan hari ini).
- Pencarian tamu berdasarkan nama, instansi, keperluan, atau orang yang dituju.
- Indikator status koneksi (Online / Offline).
- Tampilan responsif untuk desktop dan perangkat mobile.

## Teknologi

- HTML, CSS, JavaScript (ES Module) tanpa framework
- Firebase JavaScript SDK v10 (modular)
- Firebase Realtime Database
- Firebase Hosting (opsional)

## Struktur File

| File | Fungsi |
|------|--------|
| `index.html` | Halaman utama (form dan daftar tamu) |
| `style.css` | Tampilan dan layout responsif |
| `app.js` | Logika aplikasi: simpan data (`push`), baca realtime (`onValue`), validasi, pencarian |
| `firebase-config.js` | Konfigurasi project Firebase |
| `database.rules.json` | Security Rules Realtime Database |
| `firebase.json`, `.firebaserc` | Konfigurasi Firebase CLI untuk deploy |
| `RINGKASAN.md` | Ringkasan 1 halaman tentang karakteristik cloud |

## Cara Menjalankan

### 1. Siapkan project Firebase
1. Buka <https://console.firebase.google.com> lalu buat project (contoh: `bukutamu-cloud`).
2. Buka **Build → Realtime Database → Create Database**, pilih lokasi, lalu **Start in test mode**.
3. Buka tab **Rules**, tempel isi `database.rules.json`, lalu klik **Publish**.

### 2. Daftarkan Web App
1. Buka **Project settings → General → Your apps**, klik ikon Web `</>`.
2. Salin objek `firebaseConfig` ke file `firebase-config.js`.

### 3. Jalankan secara lokal
Aplikasi memakai ES Module, jadi harus dibuka lewat web server (tidak bisa dengan klik ganda file HTML):

```bash
python -m http.server 8000
# atau
npx serve .
```

Buka `http://localhost:8000`. Untuk melihat efek realtime, buka di dua tab atau dua perangkat lalu kirim data dari salah satunya.

### 4. Deploy ke Firebase Hosting (opsional)
```bash
npm install -g firebase-tools
firebase login
firebase deploy
```

## Struktur Data

```json
{
  "bukutamu": {
    "-NxAbc123": {
      "nama": "Budi Santoso",
      "instansi": "Universitas Indonesia",
      "email": "budi@email.com",
      "telepon": "081234567890",
      "keperluan": "Kunjungan",
      "bertemu": "Bagian Akademik",
      "pesan": "Pelayanannya ramah.",
      "waktu": 1730302800000
    }
  }
}
```

Setiap data disimpan dengan ID unik dari `push()`, dan kolom `waktu` diisi otomatis oleh server (`serverTimestamp`).

## Security Rules

- Semua orang boleh **membaca** data buku tamu.
- Data hanya boleh **ditambah**; data yang sudah ada tidak bisa diubah atau dihapus dari aplikasi.
- Kolom wajib: `nama`, `instansi`, `keperluan`, `pesan`, `waktu`.
- Panjang setiap kolom dibatasi, dan kolom di luar daftar akan ditolak.

---

&copy; 2026 RIZA PROJECTS — RIZAPATIID
