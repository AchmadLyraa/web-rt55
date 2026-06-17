import type { Metadata } from "next";
import AdminNavigation from "@/components/admin-navigation";

export const metadata: Metadata = {
  title: "Admin - RT 55",
  description: "Admin dashboard untuk mengelola website RT 55",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-950">
      <AdminNavigation />
      <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
