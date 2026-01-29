"use client";

import { useState } from "react";
import { Heart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toggleFavoriteAction } from "@/app/favorite/favorite";
import { useRouter } from "next/navigation";

interface FavoriteButtonProps {
  eventId: string;
  initialIsFavorite?: boolean;
}

export default function FavoriteButton({ eventId, initialIsFavorite = false }: FavoriteButtonProps) {
  const [loading, setLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const router = useRouter();

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (loading) return;

    const newState = !isFavorite;
    setIsFavorite(newState);
    setLoading(true);

    try {
      await toggleFavoriteAction(eventId);
      
      router.refresh(); 
    } catch (error) {
      // Hata olursa geri al
      setIsFavorite(!newState);
      console.error("Hata:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleToggle}
      disabled={loading}
      className={cn(
        "rounded-full w-12 h-12 border-2 shadow-sm transition-all duration-300 group",
        isFavorite
          ? "border-red-200 bg-red-50 hover:bg-red-100 hover:border-red-300"
          : "border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300",
        loading && "opacity-70"
      )}
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin text-red-400" />
      ) : (
        <Heart
          className={cn(
            "w-5 h-5 transition-transform duration-300",
            isFavorite
              ? "fill-red-500 text-red-500 scale-110"
              : "text-gray-400 group-hover:text-red-400 scale-100"
          )}
        />
      )}
    </Button>
  );
}