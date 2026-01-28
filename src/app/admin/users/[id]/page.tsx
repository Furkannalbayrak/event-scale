import { prisma } from "@/lib/prisma";
import { auth } from "@/auth/authSetup";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
    ChevronLeft,
    Calendar,
    ShieldCheck,
    Heart,
    MapPin,
    ExternalLink,
    Mail,
    UserCircle
} from "lucide-react";
import { DeleteUserButton } from "../DeleteUserButton";
import { ToggleRoleButton } from "../ToggleRoleButton";

interface UserDetailProps {
    params: Promise<{ id: string }>;
}

export default async function UserDetailPage({ params }: UserDetailProps) {
    const { id } = await params;
    const session = await auth();

    // Favorilerle birlikte kullanıcıyı çekiyoruz
    const user = await prisma.user.findUnique({
        where: { id },
        include: {
            favorites: {
                include: { event: true },
                orderBy: { createdAt: 'desc' }
            }
        }
    });

    if (!user) return notFound();

    const isSelf = session?.user?.id === user.id;

    return (
        <div className="min-h-screen bg-gray-50/50 p-5 md:p-12 font-sans">
            <div className="max-w-5xl mx-auto">
                {/* Üst Navigasyon - Daha yumuşak */}
                <Link href="/admin/users" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 mb-8 transition-colors bg-white px-4 py-2 rounded-full shadow-sm hover:shadow-md">
                    <ChevronLeft size={16} className="mr-1" /> Kullanıcı Listesi
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* SOL PANEL: Profil Kartı - Yumuşatılmış */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-blue-900/5 border border-blue-50 relative overflow-hidden text-center">
                            {/* Arka plan dekorasyonu */}
                            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-50 to-transparent opacity-50 z-0"></div>
                            
                            <div className="relative z-10">
                                <div className="w-28 h-28 bg-white text-blue-600 rounded-full flex items-center justify-center text-4xl font-bold mx-auto mb-4 shadow-lg shadow-blue-100 border-4 border-white">
                                    {user.image ? (
                                        <img src={user.image} alt={user.name || ""} className="w-full h-full rounded-full object-cover" />
                                    ) : (
                                        user.name?.charAt(0) || <UserCircle size={40} />
                                    )}
                                </div>
                                <h1 className="text-2xl font-bold text-gray-800 mb-1">{user.name}</h1>
                                <p className="text-sm text-gray-500 font-medium mb-6 flex items-center justify-center gap-1">
                                    <Mail size={14} /> {user.email}
                                </p>

                                {/* Bilgi Hapları */}
                                <div className="flex flex-wrap justify-center gap-3 mb-8">
                                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-full text-sm font-medium border border-gray-100">
                                        <Calendar size={14} className="text-blue-500" />
                                        <span>{new Date(user.createdAt).toLocaleDateString("tr-TR")}</span>
                                    </div>
                                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border ${
                                        user.role === "ADMIN" ? "bg-red-50 text-red-600 border-red-100" : "bg-blue-50 text-blue-600 border-blue-100"
                                    }`}>
                                        <ShieldCheck size={14} />
                                        <span>{user.role === "ADMIN" ? "Yönetici" : "Kullanıcı"}</span>
                                    </div>
                                </div>

                                {/* Aksiyon Butonları */}
                                {!isSelf ? (
                                    <div className="space-y-3 pt-2">
                                        <ToggleRoleButton userId={user.id} currentRole={user.role || "USER"} />
                                        <DeleteUserButton userId={user.id} />
                                    </div>
                                ) : (
                                    <div className="p-4 bg-blue-50 rounded-2xl text-blue-700 text-sm font-medium">
                                        Kendi hesabınız üzerinde yetki değişikliği yapamazsınız.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* SAĞ PANEL: Favori Etkinlikler - Yumuşatılmış Liste */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white border border-gray-100 rounded-[2rem] p-4 shadow-sm">
                            <h2 className="text-xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                                <div className="p-3 bg-pink-50 text-pink-500 rounded-full">
                                    <Heart size={20} fill="currentColor" />
                                </div>
                                Favorilenen Etkinlikler
                            </h2>

                            <div className="grid gap-4">
                                {user.favorites.length > 0 ? (
                                    user.favorites.map((fav) => (
                                        /* Yumuşak Kart Yapısı */
                                        <div key={fav.id} className="group flex items-center justify-between p-5 bg-white border border-gray-100 rounded-3xl hover:shadow-md hover:border-blue-100 transition-all">
                                            <div className="flex items-center gap-5">
                                                {/* Etkinlik Tarihi Kutusu */}
                                                <div className="flex flex-col items-center justify-center w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl font-bold text-sm leading-tight">
                                                    <span>{new Date(fav.event.date).getDate()}</span>
                                                    <span className="text-[10px] uppercase">{new Date(fav.event.date).toLocaleString('tr-TR', { month: 'short' })}</span>
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-800 text-lg mb-1 group-hover:text-blue-600 transition-colors">{fav.event.title}</h3>
                                                    <div className="flex items-center gap-4 text-sm font-medium text-gray-500">
                                                        <span className="flex items-center gap-1.5"><MapPin size={14} /> {fav.event.location}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <Link href={`/admin/events/${fav.event.id}`} className="p-3 bg-gray-50 text-gray-400 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors">
                                                <ExternalLink size={20} />
                                            </Link>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-24 border-2 border-dashed border-gray-100 rounded-3xl bg-gray-50/30">
                                        <Heart size={48} className="mx-auto text-gray-200 mb-4" />
                                        <p className="text-gray-500 font-medium">Bu kullanıcı henüz bir etkinlik beğenmemiş.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}