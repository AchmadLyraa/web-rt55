# Deployment Checklist

Sebelum go live, pastikan semua item ini sudah dikerjakan!

## Development Phase

- [x] Database schema created dengan Prisma
- [x] NextAuth authentication setup
- [x] All CRUD operations tested
- [x] File upload tested
- [x] Protected routes verified
- [x] UI/UX responsive pada mobile & desktop
- [x] Navigation tested
- [x] Default admin account created

## Pre-Production

### Environment Variables
- [ ] Update `NEXTAUTH_SECRET` dengan secure random string (32+ chars)
  ```bash
  # Generate secure secret
  openssl rand -base64 32
  ```
- [ ] Setup PostgreSQL server (cloud atau self-hosted)
- [ ] Update `DATABASE_URL` dengan production connection string
- [ ] Verify `NEXTAUTH_URL` = production domain (no localhost)

### Database
- [ ] Run migrations di production: `prisma migrate deploy`
- [ ] Seed default data: `prisma db seed`
- [ ] Verify admin account exists
- [ ] Test database backups
- [ ] Create database user dengan limited permissions (optional but recommended)

### Security
- [ ] Change default admin password immediately after first login
- [ ] Enable HTTPS on production domain
- [ ] Add Content Security Policy headers (optional)
- [ ] Test SQL injection prevention (Prisma parameterized queries)
- [ ] Verify file upload restrictions working

### File Storage
- [ ] Create folder `/public/files/` dengan permissions 755
- [ ] Add `.gitignore` rule untuk `/public/files/` ✓
- [ ] Consider cloud storage (Vercel Blob, AWS S3) untuk scale
- [ ] Setup automated backup untuk uploaded files

### Performance
- [ ] Enable image optimization (Next.js Image component)
- [ ] Test Prisma query performance
- [ ] Monitor database connection pool
- [ ] Cache strategy untuk public pages (optional)

### Monitoring
- [ ] Setup error logging (Sentry, LogRocket, etc)
- [ ] Monitor authentication attempts
- [ ] Track file upload errors
- [ ] Monitor database performance

## Post-Deployment

### First Week
- [ ] Monitor error logs daily
- [ ] Verify all features working
- [ ] Test on various devices & browsers
- [ ] Check database size growing normally
- [ ] Verify automated backups running

### Ongoing
- [ ] Regular database backups (daily minimum)
- [ ] Monitor disk space for uploads
- [ ] Update dependencies monthly
- [ ] Review security patches
- [ ] Monitor authentication logs for suspicious activity

## Production Deployment Steps

### Option 1: Vercel (Recommended for Next.js)

1. Connect GitHub repository ke Vercel
2. Set environment variables di Vercel Dashboard:
   ```
   DATABASE_URL=your_production_postgres_url
   NEXTAUTH_SECRET=your_secure_secret
   NEXTAUTH_URL=https://yourdomain.com
   ```
3. Deploy:
   ```bash
   git push
   ```
4. Vercel automatically runs build & deployment

### Option 2: Self-Hosted (VPS/Dedicated Server)

1. Setup Node.js & PostgreSQL di server
2. Clone repository:
   ```bash
   git clone https://github.com/your-repo/rt-website.git
   cd rt-website
   ```
3. Install dependencies:
   ```bash
   pnpm install
   ```
4. Setup .env.production:
   ```bash
   cp .env.local .env.production
   # Edit dengan production values
   ```
5. Run migrations:
   ```bash
   pnpm exec prisma migrate deploy
   pnpm exec prisma db seed
   ```
6. Build & start:
   ```bash
   pnpm build
   pnpm start
   ```
7. Setup reverse proxy (Nginx) + SSL (Let's Encrypt)

### Option 3: Docker (Scalable)

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --prod

COPY . .

RUN pnpm build

ENV NODE_ENV=production

EXPOSE 3000

CMD ["pnpm", "start"]
```

## Common Production Issues & Solutions

### Issue: File uploads not persisting
**Solution**: Configure cloud storage (Vercel Blob, S3) atau ensure `/public/files/` has correct permissions

### Issue: Database connection timeout
**Solution**: Check connection pool settings, may need to increase for production load

### Issue: NextAuth session not persisting
**Solution**: Verify `NEXTAUTH_URL` matches your production domain exactly

### Issue: Files showing 404
**Solution**: Check `public/files/` folder exists with correct permissions, verify relative paths in database

### Issue: Slow queries
**Solution**: Add database indexes, monitor with `prisma studio`, consider caching strategy

## Rollback Plan

If something goes wrong:

1. Keep previous version deployed
2. Have database backup from before deployment
3. Can revert git commit: `git revert <commit-hash>`
4. Restore database from backup: `psql < backup.sql`

## Useful Commands

```bash
# Monitor logs (if using Vercel)
vercel logs

# Database shell
psql $DATABASE_URL

# Check Prisma schema
prisma db push --skip-generate

# Reset database (⚠️ WARNING: deletes all data)
prisma migrate reset

# Generate Prisma client
prisma generate

# Interactive database GUI
prisma studio
```

## Support & Maintenance

- Monitor daily untuk first week post-deployment
- Check error logs weekly after stabilization
- Update dependencies monthly
- Test backup restoration quarterly
- Review security patches immediately

Good luck with your RT 55 website! 🚀
