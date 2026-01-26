import { prisma } from "@/lib/prisma";
import { auth } from "@/auth/authSetup";
import EventList from "@/components/EventList";

export default async function Home() {
  const session = await auth();
  
  const events = await prisma.event.findMany({
    orderBy: {
      date: 'asc'
    }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800">Etkinlik Platformu</h1>
        {!session && (
          <p className="text-gray-600 mt-2">
            Etkinlik detaylarını görmek için lütfen yukarıdan giriş yapın.
          </p>
        )}
      </div>

      <EventList events={events} isLoggedIn={!!session} />
    </div>
  );
}