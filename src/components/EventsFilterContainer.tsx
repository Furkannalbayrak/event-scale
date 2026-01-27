"use client";

import { useState } from "react";
import EventList from "./EventList";
import { Search } from "lucide-react";
import { Event } from "@/types";

interface EventsFilterContainerProps {
  initialEvents: Event[];
  isLoggedIn: boolean;
}

export default function EventsFilterContainer({ initialEvents, isLoggedIn }: EventsFilterContainerProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Filtreleme Mantığı: Başlık (title) içinde arama terimi geçiyor mu?
  const filteredEvents = initialEvents.filter((event) =>
    event.title.toLocaleLowerCase("tr-TR").includes(searchTerm.toLocaleLowerCase("tr-TR"))
  );

  return (
    <div>
      {/* Arama Input Alanı */}
      <div className="flex justify-center mb-10">
        <div className="relative w-full max-w-xl">
           <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <Search className="w-5 h-5" />
           </div>
           <input
             type="text"
             placeholder="Etkinlik ara..."
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-800 placeholder:text-gray-400"
           />
        </div>
      </div>

      {/* Sonuç Listesi */}
      {filteredEvents.length > 0 ? (
        <EventList events={filteredEvents} isLoggedIn={isLoggedIn} />
      ) : (
        <div className="text-center py-20 text-gray-500">
           <p className="text-lg">Aradığınız kriterlere uygun etkinlik bulunamadı.</p>
        </div>
      )}
    </div>
  );
}