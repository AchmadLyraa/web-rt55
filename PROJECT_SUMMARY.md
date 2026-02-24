# RT 55 Website - Project Summary

## Apa yang Sudah Dibangun

Website professional untuk Rukun Tetangga 55 dengan fitur lengkap untuk komunikasi dan transparansi antar warga.

## Fitur Utama

### 1. Public Pages (Dapat diakses siapa saja tanpa login)

#### Home Page (`/`)
- Menampilkan Sambutan, Visi, Misi dari RT
- Quick links ke halaman lain (Galeri, Pengumuman, Laporan)
- Banner customizable yang bisa di-upload admin

#### Gallery (`/galeri`)
- Tampilkan koleksi foto kegiatan RT
- Admin bisa upload, edit metadata, dan hapus foto
- Responsive grid layout

#### Announcements (`/pengumuman`)
- List pengumuman terbaru untuk semua warga
- Detail view untuk baca pengumuman lengkap
- Support attachment file (PDF, dll)

#### Cash Reports (`/laporan`)
- Transparansi keuangan RT
- Summary saldo (Pemasukan, Pengeluaran, Saldo)
- Tabel transaksi dengan filter tipe
- Akurat hingga rupiah (Decimal 15,2)

### 2. Admin Dashboard (Protected - hanya ADMIN role)

#### Admin Home (`/admin/homepage`)
- Edit Nama RT, Sambutan, Visi, Misi
- Upload/change banner homepage
- Real-time preview

#### Admin Gallery (`/admin/galeri`)
- CRUD untuk galeri foto
- Upload foto dengan validasi (max 5MB, format img only)
- Delete dengan confirmation

#### Admin Announcements (`/admin/pengumuman`)
- Create, Read, Update, Delete pengumuman
- Support attachment file (PDF, docs, dll)
- Timestamp otomatis siapa yang buat dan kapan

#### Admin Cash Reports (`/admin/laporan`)
- Input transaksi PEMASUKAN / PENGELUARAN
- Set tipe, tanggal, judul, keterangan, jumlah
- Semua transaksi tersimpan di database
- Auto update summary balance

## Tech Stack

### Frontend
- **Next.js 16** (App Router)
- **React 19.2**
- **TailwindCSS 4**
- **shadcn/ui** - UI components
- **Zod** - Schema validation
- **React Hook Form** - Form handling
- **date-fns** - Date formatting

### Backend & Authentication
- **NextAuth.js v5** - Authentication & authorization
- **next-auth/providers/credentials** - Email/password login
- **bcryptjs** - Password hashing
- **Server Actions** - Data mutations (create, update, delete)
- **API Routes** - File upload handling

### Database & ORM
- **PostgreSQL** - Database
- **Prisma** - ORM
- **Prisma Client** - Type-safe queries

### Storage
- **Local filesystem** - File uploads ke `/public/files/`
- Support: JPEG, PNG, GIF, WebP, PDF
- Max file size: 5MB
- Organized by category (homepage, gallery, announcements)

## Database Schema

```
User (Admin & Warga accounts)
├── id, name, email, password (hashed)
├── role (ADMIN / WARGA)
└── timestamps

Homepage (Single RT info)
├── rtName, sambutan, visi, misi
├── bannerUrl
└── timestamps

Gallery
├── title, description, imageUrl
├── createdBy (User relation)
└── timestamps

Announcement
├── title, content, attachment
├── createdBy (User relation)
└── timestamps

CashTransaction
├── type (PEMASUKAN / PENGELUARAN)
├── title, description
├── amount (Decimal 15,2)
├── date
├── createdBy (User relation)
└── timestamps
```

## Security Features

✓ Password hashing dengan bcrypt (10 rounds)
✓ JWT session management dengan NextAuth
✓ Role-based access control (ADMIN vs WARGA)
✓ Protected admin routes dengan middleware
✓ Input validation dengan Zod schemas
✓ File upload validation (type & size)
✓ SQL injection prevention via Prisma
✓ CSRF protection via NextAuth

## Default Admin Account

```
Email: admin@rt.local
Password: admin123
```

⚠️ Change password setelah first login di production!

## Project Structure

```
/app
├── /api
│   ├── /auth/[...nextauth]     → NextAuth handler
│   └── /upload                 → File upload API
├── /admin
│   ├── /homepage               → Manage homepage
│   ├── /galeri                 → Manage gallery
│   ├── /pengumuman             → Manage announcements
│   └── /laporan                → Manage cash reports
├── /galeri                     → Public gallery view
├── /pengumuman/[id]            → Public announcement detail
├── /laporan                    → Public cash report view
├── /login                      → Login page
├── page.tsx                    → Home page
└── layout.tsx                  → Root layout with navigation

/components
├── navigation.tsx              → Top navbar (responsive)
└── ui/                         → shadcn UI components

/app/actions
├── auth.ts                     → Login/logout actions
├── homepage.ts                 → Homepage CRUD
├── gallery.ts                  → Gallery CRUD
├── announcement.ts             → Announcement CRUD
└── transaction.ts              → Cash transaction CRUD

/lib
├── prisma.ts                   → Prisma client singleton
└── utils.ts                    → Utility functions

/prisma
├── schema.prisma               → Database schema
└── seed.js                     → Seed script

/types
└── next-auth.d.ts              → NextAuth type extensions

/public/files
├── /homepage                   → Banner images
├── /gallery                    → Gallery photos
└── /announcements              → Announcement attachments
```

## Getting Started

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Setup database** (update DATABASE_URL in .env.local):
   ```bash
   pnpm exec prisma migrate dev --name init
   ```

3. **Seed data** (create admin account):
   ```bash
   pnpm exec prisma db seed
   ```

4. **Run dev server**:
   ```bash
   pnpm dev
   ```

5. **Access**:
   - Public: http://localhost:3000
   - Admin: http://localhost:3000/login

## Key Implementation Details

### Authentication Flow
1. User login dengan email & password di `/login`
2. Password di-verify dengan bcrypt
3. NextAuth create JWT session
4. Session tersimpan di cookie (HTTP-only untuk security)
5. Middleware protect `/admin/*` routes
6. Server actions check session sebelum execute

### File Upload Flow
1. User select file di admin page
2. POST ke `/api/upload` dengan FormData
3. API validate file type & size
4. Save ke `/public/files/[category]/[timestamp]-[random].ext`
5. Return fileUrl untuk disimpan di database
6. Client display upload progress

### Data Mutation Flow
1. User submit form di admin page
2. Client call server action (e.g., `createGallery()`)
3. Server action auth check (must be logged in & ADMIN)
4. Validate input dengan Zod schema
5. Execute Prisma create/update/delete
6. Revalidate ISR cache path
7. Return result ke client
8. Client update local state

## Deployment Notes

- Change `NEXTAUTH_SECRET` untuk production (use strong random string)
- Setup PostgreSQL di production environment
- Update `DATABASE_URL` dengan production connection string
- Upload file handling: consider cloud storage (Vercel Blob, S3, etc) untuk scale
- Enable HTTPS untuk production (NextAuth requirement)

## What's NOT Included

- Email notifications
- Advanced analytics
- User roles management UI (only seeded admin)
- Image optimization/CDN
- Rate limiting
- Backup/restore functionality

Semua fitur ini bisa ditambahkan kemudian sesuai kebutuhan RT.
