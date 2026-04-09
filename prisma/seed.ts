import { PrismaClient } from "@/prisma/generated/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // Create default admin user
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@rt.local" },
    update: {},
    create: {
      name: "Admin RT",
      email: "admin@rt.local",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("Admin user created/updated:", admin);

  // Create default homepage
  const homepage = await prisma.homepage.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      rtName: "RT 55",
      sambutan:
        "Selamat datang di website resmi RT 55. Website ini dibuat untuk memudahkan komunikasi dan berbagi informasi antar warga.",
      visi: "Menjadi komunitas RT yang solid, transparan, dan sejahtera",
      misi: "Membangun komunikasi yang baik, transparansi dalam keuangan, dan kepedulian antar warga",
      bannerUrl: null,
      heroImageUrl: null, // Akan diupload melalui admin panel
      ketuaRtName: "Budi Santoso",
      ketuaRtPhotoUrl: null, // Akan diupload melalui admin panel
    },
  });

  // Create sample household data
  const households = await Promise.all([
    prisma.household.upsert({
      where: { id: "kk-001" },
      update: {},
      create: {
        id: "kk-001",
        kepalaKeluargaNama: "Budi Santoso",
        nomorRumah: "No. 1",
        noTelepon: "081234567890",
        totalLakiLaki: 2,
        totalPerempuan: 2,
        totalKendaraan: 1,
      },
    }),
    prisma.household.upsert({
      where: { id: "kk-002" },
      update: {},
      create: {
        id: "kk-002",
        kepalaKeluargaNama: "Siti Nurhaliza",
        nomorRumah: "No. 2",
        noTelepon: "081234567891",
        totalLakiLaki: 1,
        totalPerempuan: 3,
        totalKendaraan: 2,
      },
    }),
    prisma.household.upsert({
      where: { id: "kk-003" },
      update: {},
      create: {
        id: "kk-003",
        kepalaKeluargaNama: "Ahmad Wijaya",
        nomorRumah: "No. 3",
        noTelepon: "081234567892",
        totalLakiLaki: 3,
        totalPerempuan: 1,
        totalKendaraan: 1,
      },
    }),
  ]);

  console.log("Sample households created:", households.length);

  console.log("Homepage created/updated:", homepage);
  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
