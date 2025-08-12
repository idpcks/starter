# Database Scripts

Script-script ini membantu Anda mengelola database PostgreSQL untuk proyek Next.js starter.

## Prerequisites

1. PostgreSQL sudah terinstall dan berjalan
2. Database `starter_nextjs` sudah dibuat
3. File `.env.local` sudah dikonfigurasi dengan benar

## Available Commands

### 1. Migration (Membuat Tabel)
```bash
npm run db:migrate
```

**Fungsi:**
- Membaca file `database/schema.sql`
- Membuat semua tabel yang diperlukan
- Menambahkan indexes untuk performa
- Membuat permissions dan role permissions
- Membuat user admin default

### 2. Seeding (Menambah Data Sample)
```bash
npm run db:seed
```

**Fungsi:**
- Menambahkan user sample (manager dan user biasa)
- Hanya menambah data jika belum ada
- Tidak menimpa data yang sudah ada

### 3. Reset Database
```bash
npm run db:reset
```

**Fungsi:**
- Menghapus semua tabel yang ada
- Membersihkan database sepenuhnya
- **HATI-HATI: Semua data akan hilang!**

### 4. Fresh Install (Reset + Migrate + Seed)
```bash
npm run db:fresh
```

**Fungsi:**
- Menjalankan reset, migrate, dan seed secara berurutan
- Memberikan database yang bersih dengan data sample
- **HATI-HATI: Semua data akan hilang!**

## Default Users

Setelah migration dan seeding, tersedia user berikut:

| Role    | Email                | Password   |
|---------|---------------------|------------|
| ADMIN   | admin@example.com   | admin123   |
| MANAGER | manager@example.com | manager123 |
| USER    | user@example.com    | user123    |

## Troubleshooting

### Error: "Connection refused"
- Pastikan PostgreSQL service berjalan
- Cek konfigurasi di `.env.local`

### Error: "Database does not exist"
```sql
CREATE DATABASE starter_nextjs;
```

### Error: "Permission denied"
```sql
GRANT ALL PRIVILEGES ON DATABASE starter_nextjs TO your_user;
```

## File Structure

```
scripts/
├── migrate.js     # Script migration
├── seed.js        # Script seeding
├── reset-db.js    # Script reset database
└── README.md      # Dokumentasi ini
```

## Environment Variables

Pastikan file `.env.local` berisi:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=starter_nextjs
DB_USER=postgres
DB_PASSWORD=your_password
```