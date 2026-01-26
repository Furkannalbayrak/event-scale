import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  ChevronLeft, 
  Calendar, 
  MapPin, 
  Tag, 
  Users, 
  Banknote, 
  Image as ImageIcon, 
  Globe, 
  Info 
} from "lucide-react";
import { SubmitButton } from "../../add-event/SubmitButton";

interface EditEventProps {
    params: Promise<{ id: string }>
}

export default async function EditEventPage({ params }: EditEventProps) {
    const { id } = await params;

    const event = await prisma.event.findUnique({
        where: { id: id }
    });

    if (!event) {
        redirect("/admin/events");
    }

    // HTML datetime-local inputu için tarih formatlama
    const trOffset = 3 * 60 * 60 * 1000;
    const localDate = new Date(event.date.getTime() + trOffset);
    const formattedDate = localDate.toISOString().slice(0, 16);

    async function updateEventAction(formData: FormData) {
        "use server";

        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const dateStr = formData.get("date") as string;
        const date = new Date(`${dateStr}:00.000+03:00`);

        const location = formData.get("location") as string;
        const category = formData.get("category") as string;
        const image = formData.get("image") as string;
        const externalUrl = formData.get("externalUrl") as string;
        
        const capacityInput = formData.get("capacity") as string;
        const capacity = capacityInput ? parseInt(capacityInput) : null;
        
        const price = parseFloat(formData.get("price") as string);

        await prisma.event.update({
            where: { id: id },
            data: {
                title,
                description,
                date,
                location,
                category,
                image,
                externalUrl: externalUrl || null,
                capacity,
                price,
                // Source alanını değiştirmiyoruz, IBB ise IBB kalmalı.
            },
        });

        redirect(`/admin/events/${id}`);
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-12 font-sans">
            <div className="max-w-3xl mx-auto">
                {/* Geri Dön Butonu */}
                <Link href="/admin/events" className="flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 mb-6 transition-colors">
                    <ChevronLeft size={18} /> Etkinlik Paneline Dön
                </Link>

                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 md:p-10">
                    <div className="mb-10">
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-2xl font-bold text-gray-900">Etkinliği Düzenle</h1>
                            {event.source === "IBB" && (
                                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full uppercase tracking-widest border border-blue-100">
                                    <Globe size={10} className="inline mr-1" /> IBB Kaynağı
                                </span>
                            )}
                        </div>
                        <p className="text-gray-500 text-sm">Mevcut etkinlik bilgilerini güncelleyin.</p>
                    </div>

                    <form action={updateEventAction} className="space-y-8">
                        {/* Etkinlik Başlığı */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Etkinlik Adı</label>
                            <input
                                name="title"
                                type="text"
                                required
                                defaultValue={event.title}
                                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50/50 border-slate-200"
                            />
                        </div>

                        {/* Görsel ve Dış Bağlantı */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <ImageIcon size={16} className="text-blue-500" /> Görsel URL
                                </label>
                                <input
                                    name="image"
                                    type="url"
                                    defaultValue={event.image || ""}
                                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50/50 border-slate-200"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <Globe size={16} className="text-blue-500" /> Dış Link (Bilet/Bilgi)
                                </label>
                                <input
                                    name="externalUrl"
                                    type="url"
                                    defaultValue={event.externalUrl || ""}
                                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50/50 border-slate-200"
                                />
                            </div>
                        </div>

                        {/* Tarih ve Lokasyon */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <Calendar size={16} className="text-blue-500" /> Tarih ve Saat
                                </label>
                                <input
                                    name="date"
                                    type="datetime-local"
                                    required
                                    defaultValue={formattedDate}
                                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50/50 border-slate-200"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <MapPin size={16} className="text-blue-500" /> Mekan
                                </label>
                                <input
                                    name="location"
                                    type="text"
                                    required
                                    defaultValue={event.location}
                                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50/50 border-slate-200"
                                />
                            </div>
                        </div>

                        {/* Detaylar */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <Tag size={16} className="text-blue-500" /> Kategori
                                </label>
                                <select 
                                    name="category" 
                                    defaultValue={event.category}
                                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white border-slate-200"
                                >
                                    <option value="Tiyatro">Tiyatro</option>
                                    <option value="Konser">Konser</option>
                                    <option value="Teknoloji">Teknoloji</option>
                                    <option value="Eğitim">Eğitim</option>
                                    <option value="Spor">Spor</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <Users size={16} className="text-blue-500" /> Kapasite
                                </label>
                                <input
                                    name="capacity"
                                    type="number"
                                    defaultValue={event.capacity || ""}
                                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50/50 border-slate-200"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <Banknote size={16} className="text-blue-500" /> Fiyat (₺)
                                </label>
                                <input
                                    name="price"
                                    type="number"
                                    required
                                    step="0.01"
                                    defaultValue={event.price}
                                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50/50 border-slate-200"
                                />
                            </div>
                        </div>

                        {/* Açıklama */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Açıklama</label>
                            <textarea
                                name="description"
                                rows={5}
                                required
                                defaultValue={event.description}
                                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none bg-gray-50/50 border-slate-200 text-sm leading-relaxed"
                            ></textarea>
                        </div>

                        {/* Uyarı Notu (Sadece IBB verileri için) */}
                        {event.source === "IBB" && (
                            <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100 text-amber-800 text-xs">
                                <Info size={16} className="shrink-0" />
                                <p>Bu etkinlik İBB üzerinden senkronize edilmiştir. Yaptığınız manuel değişiklikler, bir sonraki senkronizasyonda üzerine yazılabilir.</p>
                            </div>
                        )}

                        <div className="pt-6">
                            <SubmitButton /> 
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}