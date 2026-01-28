"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Calendar, Heart, MapPin, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import FavoriteButton from "@/components/FavoriteButton";
import { useFavoriteStore } from "@/lib/store";
import { Prisma } from "@prisma/client";

type FavoriteWithEvent = Prisma.FavoriteGetPayload<{ include: { event: true } }>

interface FavoritesListProps {
  initialFavorites: FavoriteWithEvent[];
}

export default function FavoritesList({ initialFavorites }: FavoritesListProps) {
  const { favoriteIds, setFavorites } = useFavoriteStore();

  useEffect(() => {
    const ids = initialFavorites.map((fav) => fav.event.id);
    setFavorites(ids);
  }, [initialFavorites, setFavorites]);

  const visibleFavorites = initialFavorites.filter(fav => favoriteIds.includes(fav.event.id));

  if (visibleFavorites.length === 0) {
    return (
      <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Heart className="w-10 h-10 text-gray-400" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Listeniz Boş Görünüyor</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Favorilerden çıkardığınız etkinlikler buradan kaldırıldı. Yeni etkinlikler keşfetmek için ana sayfayı ziyaret edin.
        </p>
        <Button asChild size="lg">
          <Link href="/">Etkinlikleri Keşfet</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {visibleFavorites.map((fav) => {
        const event = fav.event;
        const eventDate = new Date(event.date);

        return (
          <div
            key={fav.id}
            className="group bg-white border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full"
          >
            <div className="p-6 flex flex-col flex-grow">
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-2 pr-2">
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full border border-blue-100">
                      {event.category}
                    </span>
                    {event.capacity === 0 && (
                      <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-red-50 text-red-600 px-2.5 py-1 rounded-full border border-red-100">
                        Tükendi
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-primary transition-colors">
                    <Link href={`/events/${event.id}`}>
                      {event.title}
                    </Link>
                  </h3>
                </div>

                {/* Favori butonu sağ üste yerleştirildi */}
                <div className="shrink-0 pt-1">
                  <FavoriteButton
                    eventId={event.id}
                    initialIsFavorite={true}
                  />
                </div>
              </div>

              <div className="space-y-3 mb-6 flex-grow">
                <div className="flex items-center text-gray-600 text-sm">
                  <Calendar className="w-4 h-4 mr-2 text-primary" />
                  <span>
                    {eventDate.toLocaleDateString("tr-TR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                  <MapPin className="w-4 h-4 mr-2 text-primary" />
                  <span className="line-clamp-1">{event.location}</span>
                </div>
              </div>

              <div className="pt-4 border-t flex items-center justify-between mt-auto">
                <div className="text-lg font-bold text-gray-900">
                  {event.price > 0 ? `${event.price} ₺` : "Ücretsiz"}
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/events/${event.id}`}>Detaylar</Link>
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}