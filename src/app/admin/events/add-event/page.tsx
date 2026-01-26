import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    ChevronLeft,
    Save,
    Calendar,
    MapPin,
    Tag,
    Users,
    Banknote,
    Image as ImageIcon,
    Globe,
    Edit
} from "lucide-react";
import { SubmitButton } from "./SubmitButton";

export default function AddEventPage() {
    async function createEventAction(formData: FormData) {
        "use server";

        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const dateStr = formData.get("date") as string;
        const date = new Date(`${dateStr}:00.000+03:00`);

        const location = formData.get("location") as string;
        const category = formData.get("category") as string;
        const image = formData.get("image") as string;

        const capacityInput = formData.get("capacity") as string;
        const capacity = capacityInput ? parseInt(capacityInput) : null;

        const price = parseFloat(formData.get("price") as string);

        const externalUrl = formData.get("externalUrl") as string;

        await prisma.event.create({
            data: {
                title,
                description,
                date,
                location,
                category,
                image,
                capacity,
                price,
                externalUrl: externalUrl || null,
                source: "MANUAL", // Manuel eklenenleri bu şekilde işaretliyoruz
            },
        });

        redirect("/admin/events");
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-12">
            <div className="max-w-3xl mx-auto">
                <Link href="/admin/events" className="flex items-center text-sm text-gray-500 hover:text-blue-600 mb-6 transition-colors font-medium">
                    <ChevronLeft size={18} /> Etkinlik Paneline Dön
                </Link>

                <div className="bg-white rounded-3xl shadow-sm border p-8 md:p-10">
                    <div className="mb-10">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                <Edit size={24} />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900">Yeni Etkinlik Oluştur</h1>
                        </div>
                        <p className="text-gray-500">Sistem için manuel bir etkinlik kaydı oluşturun.</p>
                    </div>

                    <form action={createEventAction} className="space-y-8">
                        {/* Etkinlik Başlığı */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Etkinlik Adı</label>
                            <input
                                name="title"
                                type="text"
                                required
                                placeholder="Örn: Modern Tiyatro Gösterisi"
                                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50/50"
                            />
                        </div>

                        {/* Görsel ve Dış Bağlantı */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <ImageIcon size={16} className="text-blue-500" /> Görsel URL'i
                                </label>
                                <input
                                    name="image"
                                    type="url"
                                    placeholder="https://images.unsplash.com/..."
                                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <Globe size={16} className="text-blue-500" /> Dış Bilet Linki (Opsiyonel)
                                </label>
                                <input
                                    name="externalUrl"
                                    type="url"
                                    placeholder="https://biletix.com/..."
                                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50/50"
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
                                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <MapPin size={16} className="text-blue-500" /> Mekan / Lokasyon
                                </label>
                                <input
                                    name="location"
                                    type="text"
                                    required
                                    placeholder="Örn: Harbiye Muhsin Ertuğrul Sahnesi"
                                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50/50"
                                />
                            </div>
                        </div>

                        {/* Detaylar */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <Tag size={16} className="text-blue-500" /> Kategori
                                </label>
                                <select name="category" className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white border-gray-200 shadow-sm">
                                    <option value="Tiyatro">Tiyatro</option>
                                    <option value="Konser">Konser</option>
                                    <option value="Sergi">Sergi</option>
                                    <option value="Workshop">Workshop</option>
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
                                    min="1"
                                    placeholder="Örn: 250"
                                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50/50"
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
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50/50"
                                />
                            </div>
                        </div>

                        {/* Açıklama */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Etkinlik Açıklaması</label>
                            <textarea
                                name="description"
                                rows={4}
                                required
                                placeholder="Etkinlik içeriği hakkında detaylı bilgi giriniz..."
                                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none bg-gray-50/50"
                            ></textarea>
                        </div>

                        <div className="pt-6">
                            <SubmitButton />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}