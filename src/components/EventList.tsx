"use client";

import { Event } from "@/types";
import { useRouter } from "next/navigation";

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

    router.push(`/events/${eventId}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => {
        const eventDate = new Date(event.date);
        const isSoldOut = event.capacity === 0;

        return (
          <div
            key={event.id}
            onClick={() => handleEventClick(event.id)}
            className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col h-full relative"
          >
            <div className="p-4 flex flex-col flex-grow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                  {event.title}
                </h3>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {event.category}
                  </span>
                  {isSoldOut && (
                    <span className="text-xs font-bold bg-red-100 text-red-600 px-2 py-1 rounded">
                      Tükendi
                    </span>
                  )}
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-grow">
                {event.description}
              </p>

              <div className="space-y-2 text-sm text-gray-500 border-t pt-2 mt-auto">
                <div className="flex items-center gap-2">
                  <span>📅</span>
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-700">
                      {eventDate.toLocaleDateString("tr-TR", {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                    <span className="text-xs text-gray-500">
                      Saat: {eventDate.toLocaleTimeString("tr-TR", { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
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
        );
      })}
    </div>
  );
}