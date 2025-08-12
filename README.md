# NextJS Starter Kit

Sebuah starter kit lengkap untuk aplikasi NextJS dengan fitur autentikasi, dashboard, manajemen pengguna, dan banyak lagi.

## Fitur

- 🔐 Autentikasi dengan NextAuth.js
- 👤 Manajemen pengguna dan peran
- 📊 Dashboard interaktif
- 🖥️ Profil pengguna
- ⚙️ Halaman pengaturan
- 🎨 UI yang responsif dengan Tailwind CSS
- 🔔 Notifikasi dengan React Toastify
- 📱 Layout dengan sidebar dan navbar
- 🔄 Navigasi tanpa reload halaman (SPA)

## Teknologi yang Digunakan

- [Next.js](https://nextjs.org/) - Framework React untuk produksi
- [TypeScript](https://www.typescriptlang.org/) - JavaScript dengan sintaks tipe
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS utility-first
- [NextAuth.js](https://next-auth.js.org/) - Autentikasi untuk Next.js
- [React Toastify](https://fkhadra.github.io/react-toastify/) - Notifikasi toast
- [React Icons](https://react-icons.github.io/react-icons/) - Ikon populer untuk React
- [Zustand](https://github.com/pmndrs/zustand) - Manajemen state
- [Headless UI](https://headlessui.dev/) - Komponen UI yang dapat diakses

## Memulai

### Prasyarat

- Node.js 18.0.0 atau lebih baru
- npm atau yarn

### Instalasi

1. Clone repositori ini

```bash
git clone https://github.com/yourusername/nextjs-starter.git
cd nextjs-starter
```

2. Instal dependensi

```bash
npm install
# atau
yarn install
```

3. Salin file `.env.local.example` ke `.env.local` dan sesuaikan variabel lingkungan

```bash
cp .env.local.example .env.local
```

4. Jalankan server pengembangan

```bash
npm run dev
# atau
yarn dev
```

5. Buka [http://localhost:3000](http://localhost:3000) di browser Anda

## Struktur Folder

```
├── public/             # Aset statis
├── src/
│   ├── app/            # Rute aplikasi
│   │   ├── (auth)/     # Halaman autentikasi
│   │   ├── (dashboard)/ # Halaman dashboard
│   │   └── api/        # API routes
│   ├── components/     # Komponen React
│   │   ├── layout/     # Komponen layout
│   │   └── ui/         # Komponen UI
│   ├── lib/            # Utilitas dan konfigurasi
│   │   ├── auth/       # Konfigurasi autentikasi
│   │   └── hooks/      # Custom hooks
│   ├── types/          # Definisi tipe TypeScript
│   └── utils/          # Fungsi utilitas
├── .env.local          # Variabel lingkungan lokal
└── next.config.js      # Konfigurasi Next.js
```

## Kredensial Demo

- **Admin:**
  - Email: admin@example.com
  - Password: password123

- **User:**
  - Email: user@example.com
  - Password: password123

## Lisensi

Proyek ini dilisensikan di bawah Lisensi MIT - lihat file [LICENSE](LICENSE) untuk detailnya.
