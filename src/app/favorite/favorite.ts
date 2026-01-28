"use server";

import { auth } from "@/auth/authSetup";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleFavoriteAction(eventId: string) {
  try {
    const session = await auth();

    // Session kesin var varsayıyoruz ama type güvenliği için kontrol ederiz
    if (!session?.user?.email) return { error: "Yetkisiz erişim" };

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) return { error: "Kullanıcı bulunamadı" };

    // Favori kontrolü
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_eventId: {
          userId: user.id,
          eventId: eventId,
        },
      },
    });

    if (existingFavorite) {
      await prisma.favorite.delete({ where: { id: existingFavorite.id } });
      revalidatePath(`/events/${eventId}`);
      revalidatePath("/my-account");
      return { isFavorite: false };
    } else {
      await prisma.favorite.create({
        data: {
          userId: user.id,
          eventId: eventId,
        },
      });
      revalidatePath(`/events/${eventId}`);
      revalidatePath("/my-account");
      return { isFavorite: true };
    }
  } catch (error) {
    console.error("Favori işlemi hatası:", error);
    return { error: "İşlem başarısız" };
  }
}