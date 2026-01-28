import { Button } from '@/components/ui/button';
import { prisma } from '@/lib/prisma';
import { Banknote, Calendar, ChevronLeft, Clock, Edit, Mail, MapPin, Heart, Globe, Info } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react'

interface DetailEventProps {
    params: Promise<{ id: string }>
}

export default async function DetailEvent({ params }: DetailEventProps) {
    const { id } = await params;

    // Yeni şemaya göre 'favorites' ilişkisini çekiyoruz
    const event = await prisma.event.findUnique({
        where: { id: id },
        include: {
            favorites: {
                include: {
                    user: true // Etkinliği favorileyen kullanıcı bilgileri
                },
                orderBy: { createdAt: 'desc' }
            }
        }
    })

    if (!event) {
        redirect("/admin/events");
    }

    const eventDate = new Date(event.date).toLocaleDateString("tr-TR", {
        day: "numeric", month: "long", year: "numeric"
    });
    const eventTime = new Date(event.date).toLocaleTimeString("tr-TR", {
        hour: "2-digit", minute: "2-digit"
    });

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-12">
            <div className="max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <Link href="/admin/events" className="flex items-center text-sm text-gray-500 hover:text-blue-600 transition-colors font-medium">
                        <ChevronLeft size={18} /> Etkinlik Paneline Dön
                    </Link>
                    <div className="flex gap-2">
                        <Link href={`/admin/events/${id}/edit`}>
                            <Button variant="outline" className="flex gap-2 rounded-xl border-blue-200 text-blue-700 hover:bg-blue-50">
                                <Edit size={16} /> Düzenle
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* SOL KOLON: Detaylar */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-3xl shadow-sm border p-8">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-bold uppercase tracking-widest">
                                    {event.category}
                                </span>
                                {event.source === "IBB" && (
                                    <span className="flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-[10px] font-bold uppercase tracking-widest">
                                        <Globe size={10} /> İBB Verisi
                                    </span>
                                )}
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">{event.title}</h1>
                            <p className="text-gray-600 leading-relaxed mb-8">
                                {event.description}
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
                                <div className="flex items-center gap-3 text-gray-700">
                                    <div className="p-3 bg-gray-50 rounded-2xl text-blue-600"><Calendar size={20} /></div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase">Tarih</p>
                                        <p className="font-semibold">{eventDate}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-gray-700">
                                    <div className="p-3 bg-gray-50 rounded-2xl text-blue-600"><Clock size={20} /></div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase">Saat</p>
                                        <p className="font-semibold">{eventTime}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-gray-700">
                                    <div className="p-3 bg-gray-50 rounded-2xl text-blue-600"><MapPin size={20} /></div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase">Mekan</p>
                                        <p className="font-semibold">{event.location}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-gray-700">
                                    <div className="p-3 bg-gray-50 rounded-2xl text-green-600"><Banknote size={20} /></div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase">Bilet Fiyatı</p>
                                        <p className="font-semibold text-green-600">₺{event.price}</p>
                                    </div>
                                </div>
                            </div>

                            {event.externalUrl && (
                                <div className="mt-8 p-4 bg-blue-50 rounded-2xl flex items-center justify-between">
                                    <div className="flex items-center gap-3 text-blue-800">
                                        <Info size={20} />
                                        <span className="text-sm font-medium">Bu etkinlik dış kaynağa yönlendirilmiştir.</span>
                                    </div>
                                    <a href={event.externalUrl} target="_blank" className="text-xs font-bold text-blue-600 hover:underline">Kaynağı Gör →</a>
                                </div>
                            )}
                        </div>

                        {/* Favorileyenler Tablosu */}
                        <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">
                            <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
                                <h2 className="font-bold text-gray-900 flex items-center gap-2">
                                    <Heart size={18} className="text-pink-500" fill="currentColor" /> İlgilenen Kullanıcılar
                                </h2>
                                <span className="text-xs font-bold text-gray-500 bg-white px-3 py-1 rounded-full border">
                                    {event.favorites.length} Favori
                                </span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 text-[10px] uppercase text-gray-400 font-bold tracking-widest">
                                        <tr>
                                            <th className="px-6 py-4">Kullanıcı</th>
                                            <th className="px-6 py-4">İletişim</th>
                                            <th className="px-6 py-4 text-right">Favorileme Tarihi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {event.favorites.length > 0 ? (
                                            event.favorites.map((fav) => (
                                                <tr key={fav.id} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <Link href={`/admin/users/${fav.user.id}`}>
                                                            <div className="flex items-center gap-3 group cursor-pointer">
                                                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                                                                    {fav.user.name?.charAt(0)}
                                                                </div>
                                                                <span className="font-semibold text-gray-900 text-sm group-hover:text-blue-600 transition-colors underline-offset-4 group-hover:underline">
                                                                    {fav.user.name}
                                                                </span>
                                                            </div>
                                                        </Link>
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-500 text-sm">
                                                        <div className="flex items-center gap-1">
                                                            <Mail size={14} className="text-gray-300" /> {fav.user.email}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-right text-gray-400 text-xs">
                                                        {new Date(fav.createdAt).toLocaleDateString("tr-TR")}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={3} className="px-6 py-16 text-center">
                                                    <Heart size={32} className="mx-auto text-gray-100 mb-3" />
                                                    <p className="text-gray-400 text-sm italic">Henüz bu etkinliği favorileyen kimse yok.</p>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* SAĞ KOLON: İstatistikler */}
                    <div className="space-y-6">
                        <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-3xl p-8 text-white shadow-xl shadow-pink-100 relative overflow-hidden">
                            <Heart className="absolute -right-4 -bottom-4 w-24 h-24 text-white/10 -rotate-12" fill="currentColor" />
                            <p className="text-pink-100 text-[10px] mb-1 uppercase tracking-widest font-bold">Popülerlik Skoru</p>
                            <h3 className="text-4xl font-bold">{event.favorites.length}</h3>
                            <p className="mt-2 text-sm text-pink-100">Kişi bu etkinliği takip ediyor.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}