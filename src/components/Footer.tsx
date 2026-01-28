import Link from "next/link";
import { Ticket, Github, Twitter, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t mt-auto">
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          
          {/* Marka Alanı */}
          <div className="space-y-4 max-w-md">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Ticket className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                Event Scale
              </span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed">
              Şehrin en iyi etkinliklerini bulabileceğiniz modern etkinlik platformu.
            </p>
          </div>

          {/* Sosyal Medya */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Bizi Takip Edin</h3>
            <div className="flex gap-4">
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
        </div>
      </div>
    </footer>
  );
}