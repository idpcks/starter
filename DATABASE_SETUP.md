# Database Setup - PostgreSQL

Proyek ini menggunakan PostgreSQL sebagai database utama. Ikuti langkah-langkah berikut untuk mengatur database.

## Prerequisites

1. **Install PostgreSQL**
   - Download dan install PostgreSQL dari [postgresql.org](https://www.postgresql.org/download/)
   - Pastikan PostgreSQL service berjalan
   - Catat username dan password yang Anda buat saat instalasi

## Setup Database

### 1. Buat Database

Buka PostgreSQL command line atau pgAdmin dan jalankan:

```sql
CREATE DATABASE starter_db;
```

### 2. Konfigurasi Environment Variables

Update file `.env.local` dengan konfigurasi database Anda:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=starter_db
DB_USER=postgres
DB_PASSWORD=your_password_here
```

### 3. Inisialisasi Schema Database

Ada dua cara untuk menginisialisasi database:

#### Opsi A: Menggunakan API Endpoint (Recommended)

1. Jalankan aplikasi Next.js:
   ```bash
   npm run dev
   ```

2. Buka browser dan akses:
   ```
   http://localhost:3001/api/db/init
   ```
   
   Atau gunakan curl:
   ```bash
   curl -X POST http://localhost:3001/api/db/init
   ```

#### Opsi B: Manual SQL Execution

1. Buka file `database/schema.sql`
2. Copy semua isi file
3. Jalankan di PostgreSQL command line atau pgAdmin

### 4. Verifikasi Setup

Untuk memverifikasi bahwa database telah disetup dengan benar:

```bash
curl http://localhost:3001/api/db/init
```

Atau buka di browser untuk melihat status koneksi dan tabel yang tersedia.

## Default User

Setelah inisialisasi database, akan tersedia user default:

- **Email**: admin@example.com
- **Password**: admin123
- **Role**: ADMIN

## Database Schema

Database ini memiliki tabel-tabel berikut:

### Core Tables
- `users` - Data pengguna
- `sessions` - Session NextAuth
- `accounts` - Account OAuth NextAuth
- `verification_tokens` - Token verifikasi NextAuth

### Permission System
- `permissions` - Daftar permission
- `role_permissions` - Permission per role
- `user_permissions` - Permission individual user

## API Endpoints

Setelah database disetup, Anda dapat menggunakan API endpoints berikut:

### Database Management
- `GET /api/db/init` - Cek status database
- `POST /api/db/init` - Inisialisasi database

### User Management
- `GET /api/users` - Get all users (with pagination)
- `POST /api/users` - Create new user
- `GET /api/users/[id]` - Get user by ID
- `PUT /api/users/[id]` - Update user
- `DELETE /api/users/[id]` - Delete user

## Troubleshooting

### Connection Issues

1. **"Connection refused"**
   - Pastikan PostgreSQL service berjalan
   - Cek port 5432 tidak diblokir firewall

2. **"Authentication failed"**
   - Verifikasi username dan password di `.env.local`
   - Pastikan user memiliki akses ke database

3. **"Database does not exist"**
   - Buat database manual: `CREATE DATABASE starter_db;`

### Permission Issues

1. **"Permission denied"**
   - Pastikan user PostgreSQL memiliki privilege yang cukup
   - Grant privileges: `GRANT ALL PRIVILEGES ON DATABASE starter_db TO your_user;`

## Production Considerations

1. **Environment Variables**
   - Gunakan environment variables yang aman untuk production
   - Jangan commit `.env.local` ke repository

2. **SSL Connection**
   - Aktifkan SSL untuk production
   - Update konfigurasi di `src/lib/db.ts`

3. **Connection Pooling**
   - Konfigurasi connection pool sesuai kebutuhan
   - Monitor koneksi database

4. **Backup**
   - Setup backup otomatis untuk database production
   - Test restore procedure secara berkala