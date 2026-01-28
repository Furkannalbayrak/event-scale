"use client";

import { useEffect, useRef } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toggleFavoriteAction } from "@/app/favorite/favorite";
import { useFavoriteStore } from "@/lib/store";

interface FavoriteButtonProps {
  eventId: string;
  initialIsFavorite?: boolean;
}

export default function FavoriteButton({ eventId, initialIsFavorite = false }: FavoriteButtonProps) {
  const { favoriteIds, addFavorite, removeFavorite, toggleFavorite } = useFavoriteStore();
  const isFavorite = favoriteIds.includes(eventId);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (initialIsFavorite) {
      addFavorite(eventId);
    }
  }, [eventId, initialIsFavorite, addFavorite]);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const wasFavorite = isFavorite;
    toggleFavorite(eventId);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(async () => {
      try {
        // Sadece son durumu sunucuya bildiriyoruz
        await toggleFavoriteAction(eventId);
        console.log("💾 Veritabanı başarıyla senkronize edildi.");
      } catch (error) {
        console.error("Senkronizasyon hatası:", error);
      }
    }, 1000);
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleToggle}
      className={cn(
        "rounded-full w-12 h-12 border-2 shadow-sm transition-all duration-300 group",
        isFavorite
          ? "border-red-200 bg-red-50 hover:bg-red-100 hover:border-red-300"
          : "border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300"
      )}
    >
      <Heart
        className={cn(
          "w-5 h-5 transition-transform duration-300",
          isFavorite
            ? "fill-red-500 text-red-500 scale-110"
            : "text-gray-400 group-hover:text-red-400 scale-100"
        )}
      />
    </Button>
  );
}