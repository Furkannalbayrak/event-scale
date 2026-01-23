import { Button } from '@/components/ui/button';
import { prisma } from '@/lib/prisma';
import { Banknote, Calendar, ChevronLeft, Clock, Edit, Mail, MapPin, Users } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react'

interface DetailEventProps {
    params: Promise<{ id: string }>
}

export default async function DetailEvent({ params }: DetailEventProps) {

    const { id } = await params;

    const event = await prisma.event.findUnique({
        where: { id: id },
        include: {
            tickets: {
                include: {
                    user: true // bilet sahibi kullanıcı bilgileri
                }
            }
        }
    })

    if (!event) {
        redirect("/admin");
    }

    // Tarih ve saat formatlama (Türkiye saatiyle uyumlu)
    const eventDate = new Date(event.date).toLocaleDateString("tr-TR", {
        day: "numeric", month: "long", year: "numeric"
    });
    const eventTime = new Date(event.date).toLocaleTimeString("tr-TR", {
        hour: "2-digit", minute: "2-digit"
    });

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-12">
            <div className="max-w-5xl mx-auto">
                {/* Üst Menü / Navigasyon */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <Link href="/admin/events" className="flex items-center text-sm text-gray-500 hover:text-blue-600 transition-colors">
                        <ChevronLeft size={18} /> Etkinlik Paneline Dön
                    </Link>
                    <div className="flex gap-2">
                        <Link href={`/admin/events/${id}/edit`}>
                            <Button variant="outline" className="flex gap-2">
                                <Edit size={16} /> Düzenle
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* SOL KOLON: Etkinlik Detayları */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border p-8">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider">
                                    {event.category}
                                </span>
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.title}</h1>
                            <p className="text-gray-600 leading-relaxed mb-8">
                                {event.description}
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t">
                                <div className="flex items-center gap-3 text-gray-700">
                                    <div className="p-2 bg-gray-100 rounded-lg"><Calendar size={20} /></div>
                                    <div>
                                        <p className="text-xs text-gray-400">Tarih</p>
                                        <p className="font-medium">{eventDate}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-gray-700">
                                    <div className="p-2 bg-gray-100 rounded-lg"><Clock size={20} /></div>
                                    <div>
                                        <p className="text-xs text-gray-400">Saat</p>
                                        <p className="font-medium">{eventTime}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-gray-700">
                                    <div className="p-2 bg-gray-100 rounded-lg"><MapPin size={20} /></div>
                                    <div>
                                        <p className="text-xs text-gray-400">Mekan</p>
                                        <p className="font-medium">{event.location}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-gray-700">
                                    <div className="p-2 bg-gray-100 rounded-lg"><Banknote size={20} /></div>
                                    <div>
                                        <p className="text-xs text-gray-400">Bilet Fiyatı</p>
                                        <p className="font-medium text-green-600">₺{event.price}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Katılımcı Tablosu */}
                        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                            <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
                                <h2 className="font-bold text-gray-900 flex items-center gap-2">
                                    <Users size={18} /> Katılımcı Listesi
                                </h2>
                                <span className="text-sm font-medium text-gray-500">
                                    {event.tickets.length} Kayıt
                                </span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold">
                                        <tr>
                                            <th className="px-6 py-4">Kullanıcı</th>
                                            <th className="px-6 py-4">E-posta</th>
                                            <th className="px-6 py-4 text-right">Alım Tarihi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {event.tickets.length > 0 ? (
                                            event.tickets.map((ticket) => (
                                                <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 font-medium text-gray-900">
                                                        {ticket.user.name || "İsimsiz Kullanıcı"}
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-600 text-sm">
                                                        <div className="flex items-center gap-1">
                                                            <Mail size={14} /> {ticket.user.email}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-right text-gray-500 text-xs">
                                                        {new Date(ticket.purchaseDate).toLocaleDateString("tr-TR")}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={3} className="px-6 py-12 text-center text-gray-400 italic">
                                                    Henüz bilet alan katılımcı bulunmuyor.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* SAĞ KOLON: İstatistik Özetleri */}
                    <div className="space-y-6">
                        <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-100">
                            <p className="text-blue-100 text-sm mb-1 uppercase tracking-wider font-semibold">Toplam Hasılat</p>
                            <h3 className="text-3xl font-bold">₺{(event.tickets.length * event.price).toLocaleString("tr-TR")}</h3>
                            <div className="mt-4 pt-4 border-t border-blue-500/50 text-xs text-blue-100">
                                * Bilet başına ₺{event.price} üzerinden hesaplanmıştır.
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 border shadow-sm">
                            <p className="text-gray-400 text-xs mb-1 uppercase tracking-wider font-semibold">Doluluk Oranı</p>
                            <div className="flex items-end gap-2">
                                <h3 className="text-2xl font-bold">{((event.tickets.length / event.capacity) * 100).toFixed(1)}%</h3>
                                <p className="text-sm text-gray-500 pb-1">/ {event.capacity} Kapasite</p>
                            </div>
                            {/* İlerleme Çubuğu */}
                            <div className="w-full bg-gray-100 h-2 mt-4 rounded-full overflow-hidden">
                                <div
                                    className="bg-blue-500 h-full rounded-full transition-all duration-1000"
                                    style={{ width: `${(event.tickets.length / event.capacity) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
