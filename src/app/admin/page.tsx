import { Button } from '@/components/ui/button';
import { prisma } from '@/lib/prisma';
import { Calendar, Edit, MapPin, Trash2, Users } from 'lucide-react';
import Link from 'next/link';
import React from 'react'

async function page() {

    const events = await prisma.event.findMany({
        include: {
            tickets: {
                include: {
                    user: true
                },
            },
        },
        orderBy: { date: "asc" },
    })

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Etkinlik Yönetimi</h1>
                    <p className="text-gray-500">Tüm etkinlikleri buradan kontrol edebilirsin.</p>
                </div>
                <Link href="/admin/add-event">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                        + Yeni Etkinlik Ekle
                    </Button>
                </Link>
            </div>

            <div className="grid gap-6">
                {events.length === 0 ? (
                    <div className="text-center p-20 border-2 border-dashed rounded-xl">
                        <p className="text-gray-500">Henüz hiç etkinlik eklenmemiş.</p>
                    </div>
                ) : (
                    events.map((event) => (
                        <div key={event.id} className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start">
                                <div className="space-y-2">
                                    <h2 className="text-xl font-bold text-blue-900">{event.title}</h2>
                                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                        <span className="flex items-center gap-1">
                                            <Calendar size={16} /> {new Date(event.date).toLocaleDateString("tr-TR")}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <MapPin size={16} /> {event.location}
                                        </span>
                                        <span className="flex items-center gap-1 font-semibold text-green-600">
                                            ₺{event.price}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="icon"><Edit size={18} /></Button>
                                    <Button variant="destructive" size="icon"><Trash2 size={18} /></Button>
                                </div>
                            </div>

                            {/* Katılımcı Durumu ve Bilet Alanlar */}
                            <div className="mt-6 pt-4 border-t border-gray-100">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-sm font-bold flex items-center gap-2">
                                        <Users size={16} /> Katılımcı Listesi
                                        <span className="text-xs font-normal text-gray-500">
                                            ({event.tickets.length} / {event.capacity})
                                        </span>
                                    </h3>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {event.tickets.length > 0 ? (
                                        event.tickets.map((ticket) => (
                                            <div key={ticket.id} title={ticket.user.email} className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-700 border">
                                                {ticket.user.name}
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs text-gray-400 italic">Henüz satış yapılmadı.</p>
                                    )}
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