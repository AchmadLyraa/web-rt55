requirements:
- postgresql
- pnpm

## Yang harus dilakukan saat pertama kali clone project:

### 1. install dependencies menggunakan pnpm
```
pnpm install
```

### 2. copy .env.example dan ubah menjadi .env
sesuaikan database url dan secret key, buat database di postgresql dengan nama web_rt55

### 3. push model database ke dalam host/laptop
```
npx prisma db push
```

### 4. generate seed data
```
npx prisma db seed
```

### 5. coba jalankan mode development
```
pnpm dev
```
