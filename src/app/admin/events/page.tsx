import { Button } from '@/components/ui/button';
import { prisma } from '@/lib/prisma';
import { ArrowLeft, Calendar, Clock, Edit, MapPin, Heart, Globe, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import React from 'react'
import { DeleteButton } from './DeleteButton';
import { SyncButton } from './SyncButton';

async function page() {
    const events = await prisma.event.findMany({
        include: {
            _count: {
                select: { favorites: true }
            }
        },
        orderBy: { date: "asc" },
    })

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <Link href="/admin" className="text-sm text-gray-500 hover:text-blue-600 flex items-center gap-1 mb-2 transition-colors font-medium">
                        <ArrowLeft size={16} /> Dashboard'a Dön
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">Etkinlik Yönetimi</h1>
                    <p className="text-gray-500 font-medium">İstanbul Şehir Tiyatroları ve yerel etkinlikleri yönetin.</p>
                </div>

                <div className="flex gap-3">
                    <SyncButton />
                    <Link href="/admin/events/add-event">
                        <Button className="bg-blue-600 hover:bg-blue-700 shadow-sm">
                            + Manuel Ekle
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid gap-6">
                {events.length === 0 ? (
                    <div className="text-center p-20 border-2 border-dashed rounded-3xl bg-gray-50/50">
                        <p className="text-gray-500 font-medium text-lg">Henüz hiç etkinlik bulunmuyor.</p>
                    </div>
                ) : (
                    events.map((event) => (
                        /* Kartın kendisini 'relative' yapıyoruz */
                        <div key={event.id} className="group bg-white border rounded-2xl p-6 shadow-sm hover:border-blue-200 hover:shadow-md transition-all relative overflow-hidden">

                            {/* OVERLAY LINK: Tüm kartı kaplayan hayali link */}
                            <Link
                                href={`/admin/events/${event.id}`}
                                className="absolute inset-0 z-0"
                                aria-label={`${event.title} detaylarını gör`}
                            />

                            <div className="flex justify-between items-start relative z-10 pointer-events-none">
                                {/* pointer-events-none ile tıklamanın alttaki overlay linke geçmesini sağlıyoruz */}
                                <div className="flex-1 space-y-3">
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                            {event.title}
                                        </h2>

                                        {/* TÜKENDİ BADGE - İBB stili */}
                                        {event.capacity === 0 && (
                                            <span className="flex items-center gap-1 px-2.5 py-1 bg-rose-100 text-rose-600 text-[10px] font-black rounded-lg border border-rose-200 uppercase tracking-wider animate-pulse">
                                                <AlertCircle size={12} /> TÜKENDİ
                                            </span>
                                        )}
                                        
                                        {event.source === "IBB" && (
                                            <span className="flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full uppercase tracking-tighter border border-blue-100">
                                                <Globe size={10} /> İBB
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                        <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-lg">
                                            <Calendar size={14} className="text-blue-500" /> {new Date(event.date).toLocaleDateString("tr-TR")}
                                        </span>
                                        <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-lg">
                                            <Clock size={14} className="text-blue-500" />
                                            {new Date(event.date).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
                                        </span>
                                        <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-lg">
                                            <MapPin size={14} className="text-blue-500" /> {event.location}
                                        </span>
                                    </div>
                                </div>

                                {/* BUTONLAR: z-20 ve pointer-events-auto ile linkin üstünde çalışmasını sağlıyoruz */}
                                <div className="flex gap-2 ml-4 relative z-20 pointer-events-auto">
                                    <Link href={`/admin/events/${event.id}/edit`}>
                                        <Button variant="outline" size="icon" className="rounded-xl"><Edit size={18} /></Button>
                                    </Link>
                                    <DeleteButton id={event.id} />
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between relative z-10 pointer-events-none">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-pink-50 text-pink-600 rounded-xl border border-pink-100">
                                        <Heart size={16} fill="currentColor" className="opacity-80" />
                                        <span className="text-sm font-bold">{event._count.favorites} Favori</span>
                                    </div>
                                    <span className="text-xs text-gray-400">Kategori: <strong>{event.category}</strong></span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default page