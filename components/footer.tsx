import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">RT 55</h3>
            <p className="text-sm leading-relaxed">
              Platform komunikasi dan transparansi untuk membangun komunitas
              yang solid dan sejahtera.
            </p>
          </div>

          {/* Menu */}
          <div>
            <h4 className="text-white font-bold mb-4">Menu</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  href="/galeri"
                  className="hover:text-white transition-colors"
                >
                  Galeri
                </Link>
              </li>
              <li>
                <Link
                  href="/pengumuman"
                  className="hover:text-white transition-colors"
                >
                  Pengumuman
                </Link>
              </li>
              <li>
                <Link
                  href="/laporan"
                  className="hover:text-white transition-colors"
                >
                  Laporan Kas
                </Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-white font-bold mb-4">Informasi</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/login"
                  className="hover:text-white transition-colors"
                >
                  Admin Login
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Kebijakan Privasi
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Syarat & Ketentuan
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-4">Hubungi Kami</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="mailto:info@rt55.local"
                  className="hover:text-white transition-colors"
                >
                  info@rt55.local
                </a>
              </li>
              <li>
                <a
                  href="tel:+62812345678"
                  className="hover:text-white transition-colors"
                >
                  +62 812-3456-78
                </a>
              </li>
              <li className="text-xs">
                Jl. Sejahtera, RT 55, Kelurahan Maju, Kota Besar
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm">
            <p>&copy; {currentYear} RT 55. Semua hak dilindungi.</p>
            <p>Dibuat dengan penuh dedikasi untuk komunitas yang lebih baik.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
