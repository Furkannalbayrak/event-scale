import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  CalendarCheck, 
  Wallet, 
  TrendingUp, 
  ArrowRight, 
  Ticket,
  LayoutDashboard
} from "lucide-react";

export default async function AdminDashboard() {
  // 1. Verileri Paralel Olarak Çekiyoruz (Performans için)
  const [userCount, events, tickets] = await Promise.all([
    prisma.user.count(),
    prisma.event.findMany({
      include: { _count: { select: { tickets: true } } }
    }),
    prisma.ticket.findMany({
      include: { event: true, user: true },
      orderBy: { purchaseDate: 'desc' },
      take: 5 // Son 5 bilet alımı
    })
  ]);

  // 2. İstatistikleri Hesaplıyoruz
  const activeEventsCount = events.filter(e => new Date(e.date) >= new Date()).length;
  
  const totalEarnings = events.reduce((acc, event) => {
    return acc + (event._count.tickets * event.price);
  }, 0);

  // En çok bilet satan etkinlik
  const bestSellingEvent = [...events].sort((a, b) => b._count.tickets - a._count.tickets)[0];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <LayoutDashboard className="text-blue-600" /> Yönetim Paneli
        </h1>
        <p className="text-gray-500">Platformun genel durumuna ve performansına göz atın.</p>
      </div>

      {/* Üst Kartlar: Temel İstatistikler */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-2">
          <div className="p-2 bg-green-50 w-fit rounded-lg text-green-600"><Wallet size={24} /></div>
          <p className="text-sm text-gray-500 font-medium">Toplam Kazanç</p>
          <h3 className="text-2xl font-bold text-gray-900">₺{totalEarnings.toLocaleString("tr-TR")}</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-2">
          <div className="p-2 bg-blue-50 w-fit rounded-lg text-blue-600"><Users size={24} /></div>
          <p className="text-sm text-gray-500 font-medium">Toplam Kullanıcı</p>
          <h3 className="text-2xl font-bold text-gray-900">{userCount}</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-2">
          <div className="p-2 bg-purple-50 w-fit rounded-lg text-purple-600"><CalendarCheck size={24} /></div>
          <p className="text-sm text-gray-500 font-medium">Aktif Etkinlikler</p>
          <h3 className="text-2xl font-bold text-gray-900">{activeEventsCount}</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-2">
          <div className="p-2 bg-orange-50 w-fit rounded-lg text-orange-600"><TrendingUp size={24} /></div>
          <p className="text-sm text-gray-500 font-medium">En Çok Satan</p>
          <h3 className="text-lg font-bold text-gray-900 truncate">
            {bestSellingEvent?.title || "Yok"}
          </h3>
        </div>
      </div>

      {/* Navigasyon Alanı */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/admin/events" className="group">
          <div className="bg-white p-8 rounded-2xl border shadow-sm hover:border-blue-500 transition-all flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-100"><Ticket size={32} /></div>
              <div>
                <h4 className="text-xl font-bold text-gray-900">Etkinlikleri Yönet</h4>
                <p className="text-sm text-gray-500">Düzenle, sil veya yeni etkinlik oluştur.</p>
              </div>
            </div>
            <ArrowRight className="text-gray-300 group-hover:text-blue-600 group-hover:translate-x-2 transition-all" />
          </div>
        </Link>

        <Link href="/admin/users" className="group">
          <div className="bg-white p-8 rounded-2xl border shadow-sm hover:border-purple-500 transition-all flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-purple-600 text-white rounded-xl shadow-lg shadow-purple-100"><Users size={32} /></div>
              <div>
                <h4 className="text-xl font-bold text-gray-900">Kullanıcıları Yönet</h4>
                <p className="text-sm text-gray-500">Kayıtlı kullanıcıları gör ve rollerini ayarla.</p>
              </div>
            </div>
            <ArrowRight className="text-gray-300 group-hover:text-purple-600 group-hover:translate-x-2 transition-all" />
          </div>
        </Link>
      </div>

      {/* Son Bilet Alımları */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <h4 className="font-bold text-gray-900">Son Bilet Alımları</h4>
        </div>
        <div className="divide-y">
          {tickets.length > 0 ? (
            tickets.map((t) => (
              <div key={t.id} className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-sm font-bold text-gray-600">
                    {t.user.name?.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{t.user.name}</p>
                    <p className="text-xs text-gray-500">{t.event.title}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-green-600">₺{t.event.price}</p>
                  <p className="text-[10px] text-gray-400">
                    {new Date(t.purchaseDate).toLocaleDateString("tr-TR")}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="p-10 text-center text-gray-400 italic">Henüz bir satış gerçekleşmedi.</p>
          )}
        </div>
      </div>
    </div>
  );
}