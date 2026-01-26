// src/lib/ibb-sync.ts
import axios from 'axios';
import { prisma } from '@/lib/prisma';

export async function syncIbbTheater() {
    const RESOURCE_ID = "79465ce9-8755-4b57-8e6c-def0c0caadc8";
    const URL = `https://data.ibb.gov.tr/api/3/action/datastore_search?resource_id=${RESOURCE_ID}&limit=10&sort=PLAY_DATE%20desc`;

    try {
        const response = await axios.get(URL);
        const records = response.data.result.records;

        for (const record of records) {
            // Veri Temizleme: "HAMLET" -> "Hamlet"
            const formattedTitle = record.PLAY_NAME.toLocaleLowerCase('tr-TR')
                .replace(/(^\w|\s\w)/g, (m: string) => m.toUpperCase());

            await prisma.event.upsert({
                where: {
                    source_externalId: {
                        source: "IBB",
                        externalId: String(record._id),
                    },
                },
                update: {
                    title: formattedTitle,
                    location: record.THEATER_NAME,
                    date: new Date(record.PLAY_DATE),
                },
                create: {
                    source: "IBB",
                    externalId: String(record._id),
                    title: formattedTitle,
                    description: `${record.PLAY_CATEGORY} türünde şahane bir oyun.`,
                    date: new Date(record.PLAY_DATE),
                    location: record.THEATER_NAME,
                    category: "Tiyatro",
                    image: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=1000",
                    price: 0,
                    externalUrl: "https://sehirtiyatrolari.ibb.istanbul",
                },
            });
        }
        return { success: true, count: records.length };
    } catch (error) {
        console.error("IBB Sync Hatası:", error);
        throw error;
    }
}