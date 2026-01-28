import { prisma } from "@/lib/prisma";
import {
  Users,
  ShieldCheck,
  User as UserIcon,
  Mail,
  ArrowLeft,
  CalendarDays
} from "lucide-react";
import Link from "next/link";

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Üst Başlık Alanı */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Link href="/admin" className="text-sm text-gray-500 hover:text-blue-600 flex items-center gap-1 mb-2 transition-colors">
            <ArrowLeft size={16} /> Dashboard'a Dön
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="text-purple-600" /> Kullanıcı Yönetimi
          </h1>
        </div>
        <div className="bg-purple-50 px-4 py-2 rounded-xl border border-purple-100 self-start md:self-auto">
          <span className="text-purple-700 font-bold">{users.length}</span> <span className="text-purple-600 text-sm">Toplam Üye</span>
        </div>
      </div>

      {/* Kullanıcı Tablosu */}
      <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b text-xs uppercase text-gray-500 font-bold tracking-wider">
                <th className="px-6 py-4">KULLANICI BİLGİLERİ</th>
                <th className="px-6 py-4">E-POSTA</th>
                <th className="px-6 py-4">MEVCUT ROL</th>
                <th className="px-6 py-4 text-right">KAYIT TARİHİ</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm text-gray-700">
              {users.map((user) => (
                /* 1. ADIM: Satıra 'relative' sınıfı ekleyerek linkin sınırlarını belirliyoruz */
                <tr key={user.id} className="relative hover:bg-gray-50 transition-all group cursor-pointer">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center font-bold group-hover:bg-purple-600 group-hover:text-white transition-colors">
                        {user.name?.charAt(0) || "U"}
                      </div>
                      <div>
                        {/* 2. ADIM: Link'e 'after:absolute after:inset-0' vererek tüm satırı kaplamasını sağlıyoruz */}
                        <Link href={`/admin/users/${user.id}`} className="after:absolute after:inset-0 outline-none">
                          <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{user.name}</p>
                          <p className="text-xs text-gray-400 font-normal">ID: #{user.id.slice(-6)}</p>
                        </Link>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 relative z-10 pointer-events-none">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Mail size={16} className="text-gray-300" /> {user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 relative z-10 pointer-events-none">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${user.role === "ADMIN"
                      ? "bg-red-50 text-red-600 border-red-100"
                      : "bg-blue-50 text-blue-600 border-blue-100"
                      }`}>
                      {user.role === "ADMIN" ? <ShieldCheck size={14} /> : <UserIcon size={14} />}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-gray-500 font-medium relative z-10 pointer-events-none">
                    <div className="flex items-center justify-end gap-2">
                      <CalendarDays size={16} className="text-gray-300" />
                      {/* Artık doğrudan createdAt değerini basıyoruz */}
                      {new Date(user.createdAt).toLocaleDateString("tr-TR")}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}