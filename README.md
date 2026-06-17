# Kalkulator Webapp

Kalkulator sederhana berbasis web (HTML, CSS, JavaScript murni — tanpa dependency).

## Fitur

- Operasi dasar: tambah (+), kurang (−), kali (×), bagi (÷)
- Persen (%), hapus satu digit (⌫), dan reset (AC)
- Dukungan keyboard (angka, operator, Enter/=, Backspace, Escape)
- Penanganan pembagian dengan nol (menampilkan "Error")
- Format ribuan otomatis & pembatasan presisi floating point
- Desain responsif dan dark mode

## Cara Menjalankan

Cukup buka `index.html` di browser. Atau jalankan server statis lokal:

```bash
python3 -m http.server 8000
# lalu buka http://localhost:8000
```

## Struktur

| File         | Keterangan                       |
| ------------ | -------------------------------- |
| `index.html` | Struktur halaman & tombol        |
| `style.css`  | Tampilan dan layout              |
| `script.js`  | Logika kalkulator & input        |

## Keyboard Shortcut

| Tombol         | Aksi              |
| -------------- | ----------------- |
| `0`–`9`        | Input angka       |
| `+ - * /`      | Operator          |
| `.`            | Desimal           |
| `Enter` / `=`  | Hitung hasil      |
| `Backspace`    | Hapus satu digit  |
| `Escape`       | Reset (AC)        |
| `%`            | Persen            |
