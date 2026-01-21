import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Save, Calendar, MapPin, Tag, Users, Banknote, Image as ImageIcon } from "lucide-react";

export default function AddEventPage() {
    // Veritabanına kayıt işlemini yapan Server Action
    async function createEventAction(formData: FormData) {
        "use server";

        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const date = new Date(formData.get("date") as string);
        const location = formData.get("location") as string;
        const category = formData.get("category") as string;
        const image = formData.get("image") as string;
        const capacity = parseInt(formData.get("capacity") as string);
        const price = parseFloat(formData.get("price") as string);

        // Prisma 6 ile doğrudan kayıt
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
            },
        });

        // Kayıt bitince ana admin sayfasına yönlendir
        redirect("/admin");
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-12">
            <div className="max-w-3xl mx-auto">
                {/* Geri Dön Butonu */}
                <Link href="/admin" className="flex items-center text-sm text-gray-500 hover:text-blue-600 mb-6 transition-colors">
                    <ChevronLeft size={18} /> Admin Paneline Dön
                </Link>

                <div className="bg-white rounded-2xl shadow-sm border p-8">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">Yeni Etkinlik Oluştur</h1>
                        <p className="text-gray-500">Etkinlik detaylarını doldurarak bilet satışını başlatabilirsin.</p>
                    </div>

                    <form action={createEventAction} className="space-y-6">
                        {/* Etkinlik Başlığı */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Etkinlik Adı</label>
                            <input
                                name="title"
                                type="text"
                                required
                                placeholder="Örn: Modern Next.js Workshop"
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <ImageIcon size={16} /> Etkinlik Görsel URL'i
                            </label>
                            <input
                                name="image"
                                type="url"
                                placeholder="https://example.com/gorsel.jpg"
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                            <p className="text-xs text-gray-400 mt-1 italic">
                                Şimdilik internetteki bir görselin linkini yapıştırabilirsin.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Tarih */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <Calendar size={16} /> Tarih ve Saat
                                </label>
                                <input
                                    name="date"
                                    type="datetime-local"
                                    required
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                />
                            </div>

                            {/* Lokasyon */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <MapPin size={16} /> Mekan / Lokasyon
                                </label>
                                <input
                                    name="location"
                                    type="text"
                                    required
                                    placeholder="Örn: İstanbul Kongre Merkezi"
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Kategori */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <Tag size={16} /> Kategori
                                </label>
                                <select name="category" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white">
                                    <option value="Teknoloji">Teknoloji</option>
                                    <option value="Müzik">Müzik</option>
                                    <option value="Spor">Spor</option>
                                    <option value="Eğitim">Eğitim</option>
                                </select>
                            </div>

                            {/* Kapasite */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <Users size={16} /> Kapasite
                                </label>
                                <input
                                    name="capacity"
                                    type="number"
                                    required
                                    min="1"
                                    placeholder="Örn: 100"
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                />
                            </div>

                            {/* Fiyat */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <Banknote size={16} /> Fiyat (₺)
                                </label>
                                <input
                                    name="price"
                                    type="number"
                                    required
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Açıklama */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Etkinlik Açıklaması</label>
                            <textarea
                                name="description"
                                rows={4}
                                required
                                placeholder="Etkinlik hakkında detaylı bilgi verin..."
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                            ></textarea>
                        </div>

                        {/* Kaydet Butonu */}
                        <div className="pt-4">
                            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-xl flex items-center justify-center gap-2 text-lg font-semibold shadow-lg shadow-blue-100 transition-all">
                                <Save size={20} /> Etkinliği Kaydet ve Yayınla
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}