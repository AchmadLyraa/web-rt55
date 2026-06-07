import { PrismaClient } from "@/prisma/generated/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.cashTransaction.deleteMany();
  await prisma.gallery.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.household.deleteMany();
  await prisma.homepage.deleteMany();
  await prisma.user.deleteMany();
  console.log("Seeding database...");

  // =====================
  // USER
  // =====================
  await prisma.user.upsert({
    where: { id: "cmm0mbnk10000bmoygee52rx1" },
    update: {},
    create: {
      id: "cmm0mbnk10000bmoygee52rx1",
      name: "Admin RT",
      email: "admin@rt.local",
      // password: admin123
      password: "$2a$10$KuZ.7opcHRPer7v6M9oD6.9ZEABDqgKDV0PUANpXO8Z7.1JFngfUG",
      role: "ADMIN",
      createdAt: new Date("2026-02-24T13:05:16.753Z"),
      updatedAt: new Date("2026-02-24T13:05:16.753Z"),
    },
  });

  // =====================
  // HOMEPAGE
  // =====================
  await prisma.homepage.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      rtName: "Website RT 55 ",
      sambutan:
        "Selamat datang di website resmi RT 55. Website ini dibuat untuk memudahkan komunikasi dan berbagi informasi antar warga.",
      visi: "Terwujudnya lingkungan RT yang Aman, Nyaman, Harmonis, Bersih, dan Sehat, serta Terwujudnya Kerukunan antarwarga yang dilandasi dengan semangat Gotong Royong.",
      misi: "Pelayanan Prima: Memberikan pelayanan administrasi kependudukan yang jujur, cepat, dan transparan.\nKeamanan & Ketertiban: Meningkatkan keamanan lingkungan melalui siskamling atau sistem keamanan terpadu.\nKebersihan & Kesehatan: Mengelola kebersihan lingkungan, pengelolaan sampah, dan menjaga kesehatan warga.",
      bannerUrl: "/files/homepage/1771940876009-nkzl14rs6.png",
      heroImageUrl: "/files/homepage/1776346328765-b86773tmx.jpg",
      ketuaRtName: "Johnson Daffa",
      ketuaRtPhotoUrl: "/files/homepage/1776346362182-nw7cn955t.jpg",
      updatedAt: new Date("2026-04-16T13:49:44.283Z"),
    },
  });

  // =====================
  // HOUSEHOLD
  // =====================
  const households = [
    {
      id: "kk-001",
      kepalaKeluargaNama: "Budi Santoso",
      nomorRumah: "No. 1",
      noTelepon: "081234567890",
      totalLakiLaki: 2,
      totalPerempuan: 2,
      totalKendaraan: 1,
      createdAt: new Date("2026-04-08T15:44:24.098Z"),
      updatedAt: new Date("2026-04-08T15:44:24.098Z"),
    },
    {
      id: "kk-002",
      kepalaKeluargaNama: "Siti Nurhaliza",
      nomorRumah: "No. 2",
      noTelepon: "081234567891",
      totalLakiLaki: 1,
      totalPerempuan: 3,
      totalKendaraan: 2,
      createdAt: new Date("2026-04-08T15:44:24.103Z"),
      updatedAt: new Date("2026-04-08T15:44:24.103Z"),
    },
    {
      id: "kk-003",
      kepalaKeluargaNama: "Ahmad Wijaya",
      nomorRumah: "No. 3",
      noTelepon: "081234567892",
      totalLakiLaki: 3,
      totalPerempuan: 1,
      totalKendaraan: 1,
      createdAt: new Date("2026-04-08T15:44:24.106Z"),
      updatedAt: new Date("2026-04-08T15:44:24.106Z"),
    },
    {
      id: "cmnq85kf20002taoypvg3hmld",
      kepalaKeluargaNama: "paman",
      nomorRumah: "21",
      noTelepon: "123123123",
      totalLakiLaki: 3,
      totalPerempuan: 1,
      totalKendaraan: 6,
      createdAt: new Date("2026-04-08T15:50:21.086Z"),
      updatedAt: new Date("2026-04-08T15:50:51.437Z"),
    },
  ];

  for (const h of households) {
    await prisma.household.upsert({
      where: { id: h.id },
      update: {},
      create: h,
    });
  }

  // =====================
  // ANNOUNCEMENT
  // =====================
  const announcements = [
    {
      id: "cmm0t3f6f0000wzoye086cap5",
      title: "vadasskudy",
      content: "mantap",
      attachment: "/files/announcements/1775742713736-l16ykuf1m.pdf",
      createdById: "cmm0mbnk10000bmoygee52rx1",
      createdAt: new Date("2026-02-24T16:14:49.988Z"),
      updatedAt: new Date("2026-04-09T13:51:56.418Z"),
    },
    {
      id: "cmo32ky690000btoy57mj30ll",
      title: "ini adalah pengumuman kedua",
      content: "kenpaa kita semua harus gotong royong? biar bersih",
      attachment: "/files/announcements/1776446733284-gmmm8q4ue.pdf",
      createdById: "cmm0mbnk10000bmoygee52rx1",
      createdAt: new Date("2026-04-17T15:35:21.329Z"),
      updatedAt: new Date("2026-04-17T17:25:35.075Z"),
    },
    {
      id: "cmo32ldlv0001btoyhjhu8cyd",
      title: "covid-19",
      content: "hati hati saat keluar rumah, gunakan masker",
      attachment: null,
      createdById: "cmm0mbnk10000bmoygee52rx1",
      createdAt: new Date("2026-04-17T15:35:41.331Z"),
      updatedAt: new Date("2026-04-17T15:35:41.331Z"),
    },
    {
      id: "cmo32lr5x0002btoyfcnki076",
      title: "Pengumuman penting",
      content: "jangan tidur di jalanan sembarangan",
      attachment: "/files/announcements/1776446830451-y998j7la7.pdf",
      createdById: "cmm0mbnk10000bmoygee52rx1",
      createdAt: new Date("2026-04-17T15:35:58.897Z"),
      updatedAt: new Date("2026-04-17T17:27:11.722Z"),
    },
    {
      id: "cmo32mfhe0003btoyw6me2z0p",
      title: "bagi bagi sembako",
      content: "silahkan kerumah pak rt untuk mengambil sembako",
      attachment: null,
      createdById: "cmm0mbnk10000bmoygee52rx1",
      createdAt: new Date("2026-04-17T15:36:30.412Z"),
      updatedAt: new Date("2026-04-17T15:36:30.412Z"),
    },
    {
      id: "cmo32o5q60004btoyxzcsv2v4",
      title: "vadas weh",
      content: "skidipadapudupadat!",
      attachment: "/files/announcements/1776446631171-q2l0limyp.pdf",
      createdById: "cmm0mbnk10000bmoygee52rx1",
      createdAt: new Date("2026-04-17T15:37:51.086Z"),
      updatedAt: new Date("2026-04-17T18:58:54.605Z"),
    },
  ];

  for (const a of announcements) {
    await prisma.announcement.upsert({
      where: { id: a.id },
      update: {},
      create: a,
    });
  }

  // =====================
  // GALLERY
  // =====================
  const galleries = [
    {
      id: "cmm0mq7h00000htoyis87vjxw",
      title: "Lomba Mewarnai",
      description: "semua warga rt 55",
      imageUrl: "/files/gallery/1771938991596-cj650qzje.jpeg",
      createdById: "cmm0mbnk10000bmoygee52rx1",
      createdAt: new Date("2026-02-24T13:16:35.777Z"),
      updatedAt: new Date("2026-02-24T13:16:35.777Z"),
    },
    {
      id: "cmo1je85z0000khoy2af4yfob",
      title: "Gotong Royong",
      description: "bangun bank sampah",
      imageUrl: "/files/gallery/1776347426931-3pap7svsb.png",
      createdById: "cmm0mbnk10000bmoygee52rx1",
      createdAt: new Date("2026-04-16T13:50:28.803Z"),
      updatedAt: new Date("2026-04-16T13:50:28.803Z"),
    },
    {
      id: "cmo1jfegw0001khoyq75a3bw5",
      title: "Jalan Jalan",
      description: "ke surabaya",
      imageUrl: "/files/gallery/1776347481202-h9aq3bo5a.JPG",
      createdById: "cmm0mbnk10000bmoygee52rx1",
      createdAt: new Date("2026-04-16T13:51:23.625Z"),
      updatedAt: new Date("2026-04-16T13:51:23.625Z"),
    },
    {
      id: "cmo1jg4wx0002khoyrk0ky2gt",
      title: "Buka puasa di mana aja",
      description: "di musholla al amin",
      imageUrl: "/files/gallery/1776347516777-cwxvt5wyt.png",
      createdById: "cmm0mbnk10000bmoygee52rx1",
      createdAt: new Date("2026-04-16T13:51:57.823Z"),
      updatedAt: new Date("2026-04-17T20:33:17.794Z"),
    },
    {
      id: "cmo1jgmvy0003khoy14ekoxu3",
      title: "lomba",
      description: "mewarnaiiiii",
      imageUrl: "/files/gallery/1776347539952-ndu8uz3xq.jpg",
      createdById: "cmm0mbnk10000bmoygee52rx1",
      createdAt: new Date("2026-04-16T13:52:21.185Z"),
      updatedAt: new Date("2026-04-17T20:33:06.548Z"),
    },
    {
      id: "cmo2vc8o90000ozoyng75tbf2",
      title: "liburan",
      description: "vadas",
      imageUrl: "/files/gallery/1776427956581-oh03l4msp.jpg",
      createdById: "cmm0mbnk10000bmoygee52rx1",
      createdAt: new Date("2026-04-17T12:12:37.711Z"),
      updatedAt: new Date("2026-04-17T12:12:37.711Z"),
    },
  ];

  for (const g of galleries) {
    await prisma.gallery.upsert({
      where: { id: g.id },
      update: {},
      create: g,
    });
  }

  // =====================
  // CASH TRANSACTION
  // =====================
  const transactions = [
    {
      id: "cmo3dadz70000dioyystyszsy",
      type: "PEMASUKAN" as const,
      title: "Iuran warga",
      description: "mantao",
      amount: 12000.0,
      date: new Date("2026-04-18T00:00:00Z"),
      createdById: "cmm0mbnk10000bmoygee52rx1",
      createdAt: new Date("2026-04-17T20:35:04.371Z"),
      updatedAt: new Date("2026-04-17T20:35:04.371Z"),
    },
    {
      id: "cmo3daqou0001dioyyhwlkndd",
      type: "PENGELUARAN" as const,
      title: "vadas",
      description: "gotong royong",
      amount: 10000.0,
      date: new Date("2026-04-18T00:00:00Z"),
      createdById: "cmm0mbnk10000bmoygee52rx1",
      createdAt: new Date("2026-04-17T20:35:20.845Z"),
      updatedAt: new Date("2026-04-17T20:35:20.845Z"),
    },
  ];

  for (const t of transactions) {
    await prisma.cashTransaction.upsert({
      where: { id: t.id },
      update: {},
      create: t,
    });
  }

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
