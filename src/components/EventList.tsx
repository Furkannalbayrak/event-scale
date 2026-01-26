"use client";

import { useRouter } from "next/navigation";

// Define the shape of the Event assuming what comes from Prisma
// We make date strings because they will be serialized when passed from Server to Client component
interface Event {
  id: string;
  title: string;
  description: string;
  date: Date | string; 
  location: string;
  category: string;
  image: string | null;
  capacity: number;
  price: number;
}

interface EventListProps {
  events: Event[];
  isLoggedIn: boolean;
}

export default function EventList({ events, isLoggedIn }: EventListProps) {
  const router = useRouter();

  const handleEventClick = (eventId: string) => {
    if (!isLoggedIn) {
      // Prompt the user to login if they are not authenticated
      alert("Lütfen google ile giriş yapın");
      return;
    }

    // Logic for logged in users (e.g., navigate to details)
    // For now, allow the click or navigate if a detail page exists
    console.log("User logged in, clicked event:", eventId);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <div
          key={event.id}
          onClick={() => handleEventClick(event.id)}
          className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col h-full"
        >
          {event.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-48 object-cover"
            />
          ) : (
            <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400">
              Görsel Yok
            </div>
          )}
          
          <div className="p-4 flex flex-col flex-grow">
            <div className="flex justify-between items-start mb-2">
               <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{event.title}</h3>
               <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded">
                 {event.category}
               </span>
            </div>
            
            <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow">
              {event.description}
            </p>
            
            <div className="space-y-1 text-sm text-gray-500 border-t pt-2 mt-auto">
              <div className="flex items-center gap-2">
                <span>📅</span>
                <span>{new Date(event.date).toLocaleDateString("tr-TR")}</span>
              </div>
              <div className="flex items-center gap-2">
                 <span>📍</span>
                 <span className="truncate">{event.location}</span>
              </div>
              <div className="flex items-center gap-2 font-medium text-gray-900">
                 <span>💰</span>
                 <span>{event.price > 0 ? `${event.price} ₺` : "Ücretsiz"}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}