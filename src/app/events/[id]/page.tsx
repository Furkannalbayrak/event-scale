import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import FavoriteButton from "@/components/FavoriteButton";
import { auth } from "@/auth/authSetup";

interface EventPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EventPage(props: EventPageProps) {
    const params = await props.params;
    const session = await auth();

    const event = await prisma.event.findUnique({
        where: {
            id: params.id,
        },
    });

    if (!event) {
        notFound();
    }

    let isFavorite = false;
    if (session?.user?.email) {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (user) {
            const favorite = await prisma.favorite.findUnique({
                where: {
                    userId_eventId: {
                        userId: user.id,
                        eventId: event.id,
                    },
                },
            });
            isFavorite = !!favorite; // Eğer kayıt varsa true döner
        }
    }

    const eventDate = new Date(event.date);
    const isSoldOut = (event.capacity !== null && event.capacity === 0);

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <Link href="/" className="inline-block mb-6 text-gray-600 hover:text-gray-900">
                &larr; Etkinliklere Dön
            </Link>

            <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
                <div className="p-5 md:p-8">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6 md:mb-8">
                        <div className="w-full md:flex-1">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-xs md:text-sm font-semibold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full border border-blue-100">
                                        {event.category}
                                    </span>
                                    {isSoldOut && (
                                        <span className="text-xs md:text-sm font-bold bg-red-100 text-red-600 px-2.5 py-1 rounded-full border border-red-200">
                                            Tükendi
                                        </span>
                                    )}
                                </div>
                                <div className="md:ml-4">
                                    <FavoriteButton eventId={event.id} initialIsFavorite={isFavorite} />
                                </div>
                            </div>

                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-2">
                                {event.title}
                            </h1>
                        </div>

                        <div className="w-full md:w-auto flex md:flex-col justify-between items-center md:items-end gap-2 border-t md:border-0 pt-4 md:pt-0 mt-2 md:mt-0">
                            <span className="text-sm text-gray-500 font-medium md:hidden">Bilet Fiyatı</span>
                            <div className="text-2xl md:text-3xl font-bold text-gray-900">
                                {event.price > 0 ? `${event.price} ₺` : "Ücretsiz"}
                            </div>
                        </div>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-8 text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <div className="space-y-3 p-2">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-white rounded-lg shadow-sm text-xl border border-gray-100">📅</div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Tarih</p>
                                    <p className="font-semibold text-gray-900">
                                        {eventDate.toLocaleDateString("tr-TR", { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-white rounded-lg shadow-sm text-xl border border-gray-100">⏰</div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Saat</p>
                                    <p className="font-semibold text-gray-900">
                                        {eventDate.toLocaleTimeString("tr-TR", { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 p-2">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-white rounded-lg shadow-sm text-xl border border-gray-100">📍</div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Konum</p>
                                    <p className="font-semibold text-gray-900">{event.location}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="prose max-w-none">
                        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                            Etkinlik Detayları
                        </h3>
                        <div className="text-gray-600 leading-relaxed text-sm md:text-base whitespace-pre-line">
                            {event.description}
                        </div>
                    </div>

                    {/* CTA Section - Sticky on Mobile */}
                    <div className="mt-8 pt-6 border-t md:flex justify-end sticky bottom-0 bg-white md:static p-4 md:p-0 -mx-5 md:mx-0 border-t-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] md:shadow-none z-10">
                        {event.externalUrl ? (
                            <Button size="lg" className="w-full md:w-auto rounded-xl text-base h-12 md:h-11" disabled={isSoldOut} asChild>
                                <a href={event.externalUrl} target="_blank" rel="noopener noreferrer">
                                    {isSoldOut ? "Biletler Tükendi" : "Etkinlik Sayfasına Git"}
                                </a>
                            </Button>
                        ) : (
                            <Button size="lg" className="w-full md:w-auto rounded-xl h-12 md:h-11" disabled>
                                Bağlantı Yok
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}