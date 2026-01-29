import Link from "next/link";
import { Ticket } from "lucide-react";

export default function Footer() {
  return (
    // mt-auto: Üstteki içerik kısa olsa bile beni en alta it
    <footer className="bg-white border-t mt-auto">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Marka Alanı - Artık TIKLANABİLİR */}
          <Link 
            href="/" 
            className="flex items-center gap-2 group hover:opacity-80 transition-opacity"
          >
            <div className="bg-primary/10 p-2 rounded-lg">
              <Ticket className="w-5 h-5 text-primary" />
            </div>
            <span className="text-lg font-bold text-gray-900">
              Event Scale
            </span>
          </Link>

          {/* Copyright */}
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Event Scale. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
}