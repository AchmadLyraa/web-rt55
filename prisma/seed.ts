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
      sambutan: "Selamat datang di website resmi RT 55. Website ini dibuat untuk memudahkan komunikasi dan berbagi informasi antar warga.",
      visi: "Menjadi komunitas RT yang solid, transparan, dan sejahtera",
      misi: "Membangun komunikasi yang baik, transparansi dalam keuangan, dan kepedulian antar warga",
      bannerUrl: null,
    },
  });

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

