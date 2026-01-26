import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { 
  Users, 
  CalendarCheck, 
  Heart, 
  TrendingUp, 
  ArrowRight, 
  Ticket,
  LayoutDashboard,
  Globe,
  UserCog
} from "lucide-react";

export default async function AdminDashboard() {
  const [userCount, events, recentFavorites] = await Promise.all([
    prisma.user.count(),
    prisma.event.findMany({
      include: { _count: { select: { favorites: true } } }
    }),
    prisma.favorite.findMany({
      include: { event: true, user: true },
      orderBy: { createdAt: 'desc' },
      take: 5 
    })
  ]);

  const activeEventsCount = events.filter(e => new Date(e.date) >= new Date()).length;
  const totalFavorites = events.reduce((acc, event) => acc + event._count.favorites, 0);
  const mostFavoritedEvent = [...events].sort((a, b) => b._count.favorites - a._count.favorites)[0];
  const ibbEventsCount = events.filter(e => e.source === "IBB").length;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* HEADER */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <LayoutDashboard className="text-blue-600" /> Yönetim Paneli
          </h1>
          <p className="text-gray-500">Kullanıcı etkileşimlerini ve şehir verilerini buradan yönetin.</p>
        </div>
      </div>

      {/* İSTATİSTİK KARTLARI */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-2">
          <div className="p-2 bg-pink-50 w-fit rounded-lg text-pink-600"><Heart size={24} fill="currentColor" /></div>
          <p className="text-sm text-gray-500 font-medium">Toplam Etkileşim</p>
          <h3 className="text-2xl font-bold text-gray-900">{totalFavorites}</h3>
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
          <div className="p-2 bg-orange-50 w-fit rounded-lg text-orange-600"><Globe size={24} /></div>
          <p className="text-sm text-gray-500 font-medium">İBB Veri Oranı</p>
          <h3 className="text-2xl font-bold text-gray-900">%{Math.round((ibbEventsCount / events.length) * 100) || 0}</h3>
        </div>
      </div>

      {/* NAVİGASYON - ANA KONTROLLER */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Etkinlik Yönetimi */}
        <Link href="/admin/events" className="group">
          <div className="bg-white p-8 rounded-2xl border shadow-sm hover:border-blue-500 transition-all flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-100"><Ticket size={32} /></div>
              <div>
                <h4 className="text-xl font-bold text-gray-900">Etkinlik & Veri</h4>
                <p className="text-sm text-gray-500">İBB senkronizasyonu ve içerik yönetimi.</p>
              </div>
            </div>
            <ArrowRight className="text-gray-300 group-hover:text-blue-600 group-hover:translate-x-2 transition-all" />
          </div>
        </Link>

        {/* Kullanıcı Yönetimi - İŞTE BURADA! */}
        <Link href="/admin/users" className="group">
          <div className="bg-white p-8 rounded-2xl border shadow-sm hover:border-purple-500 transition-all flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-purple-600 text-white rounded-xl shadow-lg shadow-purple-100"><UserCog size={32} /></div>
              <div>
                <h4 className="text-xl font-bold text-gray-900">Kullanıcı Kontrolü</h4>
                <p className="text-sm text-gray-500">Üyeleri yönet, rolleri ve yetkileri ayarla.</p>
              </div>
            </div>
            <ArrowRight className="text-gray-300 group-hover:text-purple-600 group-hover:translate-x-2 transition-all" />
          </div>
        </Link>
      </div>

      {/* TREND ANALİZİ VE AKIŞ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Popüler Etkinlik Kartı */}
        <div className="lg:col-span-1 bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl border shadow-lg text-white flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-blue-400">
              <TrendingUp size={20} />
              <span className="text-xs font-bold uppercase tracking-widest">En Popüler</span>
            </div>
            <h4 className="text-xl font-bold leading-tight">
              {mostFavoritedEvent?.title || "Veri Bekleniyor..."}
            </h4>
          </div>
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <Heart size={16} className="text-pink-500" fill="currentColor" /> 
              <strong>{mostFavoritedEvent?._count.favorites || 0}</strong> kullanıcı listesine ekledi
            </div>
          </div>
        </div>

        {/* Son Favori İşlemleri */}
        <div className="lg:col-span-2 bg-white rounded-2xl border shadow-sm overflow-hidden">
          <div className="p-6 border-b bg-gray-50/50 flex justify-between items-center">
            <h4 className="font-bold text-gray-900 flex items-center gap-2">
              <Heart size={18} className="text-pink-500" /> Son Favori İşlemleri
            </h4>
          </div>
          <div className="divide-y max-h-[300px] overflow-y-auto">
            {recentFavorites.length > 0 ? (
              recentFavorites.map((f) => (
                <div key={f.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-sm font-bold text-gray-600">
                      {f.user.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{f.user.name}</p>
                      <p className="text-xs text-gray-500">Beğendi: {f.event.title}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-400">
                    {new Date(f.createdAt).toLocaleDateString("tr-TR")}
                  </span>
                </div>
              ))
            ) : (
              <p className="p-10 text-center text-gray-400 italic">Henüz etkileşim yok.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}