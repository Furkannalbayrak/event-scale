import Link from "next/link";
import { Ticket, Github, Twitter, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Marka Alanı */}
          <div className="col-span-1 md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Ticket className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                Event Scale
              </span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed">
              Şehrin en iyi etkinliklerini keşfetmeniz için tasarlanmış modern bir platform. Eğlenceyi kaçırmayın!
            </p>
          </div>

          {/* Hızlı Linkler */}
          <div className="md:ml-auto">
            <h3 className="font-semibold text-gray-900 mb-4">Platform</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/" className="hover:text-primary transition-colors">Etkinlikler</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">Hakkımızda</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">İletişim</Link></li>
            </ul>
          </div>

          {/* Kategoriler (Temsili) */}
          <div className="md:ml-auto">
            <h3 className="font-semibold text-gray-900 mb-4">Keşfet</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="#" className="hover:text-primary transition-colors">Konserler</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Tiyatrolar</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Festivaller</Link></li>
            </ul>
          </div>

          {/* Sosyal Medya ve Copyright */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Bizi Takip Edin</h3>
            <div className="flex gap-4 mb-6">
              <Link href="#" className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors text-gray-600">
                <Twitter className="w-4 h-4" />
              </Link>
              <Link href="#" className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors text-gray-600">
                <Instagram className="w-4 h-4" />
              </Link>
              <Link href="#" className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors text-gray-600">
                <Github className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 gap-4">
          <p>&copy; {new Date().getFullYear()} Event Scale. Tüm hakları saklıdır.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-gray-900">Gizlilik Politikası</Link>
            <Link href="#" className="hover:text-gray-900">Kullanım Şartları</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}