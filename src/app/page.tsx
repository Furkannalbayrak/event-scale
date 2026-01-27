import { prisma } from "@/lib/prisma";
import { auth } from "@/auth/authSetup";
import EventsFilterContainer from "@/components/EventsFilterContainer";

export default async function Home() {
  const session = await auth();
  
  // Tarih sıralamasına göre tüm etkinlikleri çekiyoruz
  const events = await prisma.event.findMany({
    orderBy: {
      date: 'asc'
    }
  });

  return (
    <div className="container mx-auto px-4 py-8 pb-32">
      {!session && (
          <div className="text-center mb-6">
             <p className="text-gray-600">
               Etkinlik detaylarını görmek için lütfen yukarıdan giriş yapın.
             </p>
          </div>
      )}

      {/* Filtreleme ve Listeleme Bileşeni */}
      <EventsFilterContainer 
        initialEvents={JSON.parse(JSON.stringify(events))} // Date objelerini güvenli geçirmek için
        isLoggedIn={!!session} 
      />
    </div>
  );
}