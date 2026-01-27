import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface EventPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EventPage(props: EventPageProps) {
    const params = await props.params;
    const event = await prisma.event.findUnique({
        where: {
            id: params.id,
        },
    });

    if (!event) {
        notFound();
    }

    const eventDate = new Date(event.date);
    const isSoldOut = (event.capacity !== null && event.capacity === 0);

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <Link href="/" className="inline-block mb-6 text-gray-600 hover:text-gray-900">
                &larr; Etkinliklere Dön
            </Link>

            <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
                <div className="p-8">
                    <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-sm font-semibold bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                                    {event.category}
                                </span>
                                {isSoldOut && (
                                    <span className="text-sm font-bold bg-red-100 text-red-600 px-3 py-1 rounded-full">
                                        Tükendi
                                    </span>
                                )}
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
                        </div>

                        <div className="text-right">
                            <div className="text-2xl font-bold text-gray-900">
                                {event.price > 0 ? `${event.price} ₺` : "Ücretsiz"}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-gray-600">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <span className="text-xl">📅</span>
                                <div>
                                    <p className="font-medium text-gray-900">Tarih</p>
                                    <p>{eventDate.toLocaleDateString("tr-TR", { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className="text-xl">⏰</span>
                                <div>
                                    <p className="font-medium text-gray-900">Saat</p>
                                    <p>{eventDate.toLocaleTimeString("tr-TR", { hour: '2-digit', minute: '2-digit' })}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <span className="text-xl">📍</span>
                                <div>
                                    <p className="font-medium text-gray-900">Konum</p>
                                    <p>{event.location}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="prose max-w-none border-t pt-8">
                        <h3 className="text-xl font-semibold mb-4">Etkinlik Açıklaması</h3>
                        <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                            {event.description}
                        </p>
                    </div>

                    <div className="mt-8 pt-6 border-t flex justify-end">
                        {event.externalUrl ? (
                            <Button size="lg" disabled={isSoldOut} asChild>
                                <a href={event.externalUrl} target="_blank" rel="noopener noreferrer">
                                    {isSoldOut ? "Biletler Tükendi" : "Etkinlik Sayfasına Git"}
                                </a>
                            </Button>
                        ) : (
                            <Button size="lg" disabled>
                                Bağlantı Yok
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}