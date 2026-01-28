export const dynamic = 'force-dynamic';

import { auth } from "@/auth/authSetup";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Calendar, Heart, MapPin, Ticket } from "lucide-react";
import FavoriteButton from "@/components/FavoriteButton";
import { Button } from "@/components/ui/button";
import FavoritesList from "@/components/FavoritesList";

export default async function FavoritePage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  // Kullanıcının favorilediği etkinlikleri getir
  const favorites = await prisma.favorite.findMany({
    where: {
      user: {
        email: session.user.email,
      },
    },
    include: {
      event: true, 
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl min-h-[calc(100vh-200px)]">
      <div className="flex items-center gap-3 mb-8">
        <div>
            <h1 className="text-3xl font-bold text-gray-900">Beğendiğim Etkinlikler</h1>
        </div>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Henüz Favoriniz Yok</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            İlginizi çeken etkinlikleri kalp ikonuna tıklayarak buraya ekleyebilirsiniz.
          </p>
          <Button asChild size="lg">
            <Link href="/">Etkinlikleri Keşfet</Link>
          </Button>
        </div>
      ) : (
        <FavoritesList initialFavorites={favorites} />
      )}
    </div>
  );
}