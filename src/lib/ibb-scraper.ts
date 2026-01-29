import { prisma } from "./prisma";
import * as cheerio from "cheerio";

/* ---------------------------------- */
/* 💰 AKILLI FİYAT HESABI */
/* ---------------------------------- */
export const calculateSmartPrice = (title: string, location: string): number => {
  const t = title.toLowerCase();
  const l = location.toLowerCase();

  if (l.includes("harbiye cemil topuzlu")) {
    if (t.includes("müzikal")) return 4500;
    if (t.includes("çocuk")) return 80;
    return 400;
  }

  if (t.includes("çocuk")) return 48;
  if (t.includes("müzikal")) return 208;
  return 160;
};

/* ---------------------------------- */
/* 🚀 SCRAPER FONKSİYONU */
/* ---------------------------------- */
export async function scrapeAndSyncIBB() {
  console.log("🚀 İBB ŞEHİR TİYATROLARI | DİNAMİK SCRAPER BAŞLADI");

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(today);
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + 7);
    endDate.setHours(23, 59, 59, 999);

    const monthsToFetch = new Set<number>();
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      monthsToFetch.add(d.getMonth());
    }

    const sources = Array.from(monthsToFetch).map((monthIndex, i) => ({
      monthIndex,
      url:
        i === 0
          ? "https://sehirtiyatrolari.ibb.istanbul/takvim"
          : `https://sehirtiyatrolari.ibb.istanbul/takvim?addMount=${i}`,
    }));

    const events: any[] = [];

    for (const { url, monthIndex } of sources) {
      console.log(`📅 Ay index taranıyor: ${monthIndex}`);

      const res = await fetch(url, {
        cache: "no-store",
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
          "Accept-Language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7"
        }
      });

      const html = await res.text();
      const $ = cheerio.load(html);

      const sahneIsimleri: string[] = [];
      $("tr:contains('Saat') th, tr:contains('Saat') td").each((_, el) => {
        sahneIsimleri.push($(el).text().trim().replace(/\s+/g, " "));
      });

      let lastSeenDay: number | null = null;

      $("table tbody tr").each((_, row) => {
        const cells = $(row).find("td");
        if (!cells.length) return;

        let timeText = "";
        let dataStartIdx = 0;
        let isFullRow = false;

        const firstCellText = $(cells[0]).text().trim();

        if (/^\d+$/.test(firstCellText) && cells.length > 5) {
          lastSeenDay = parseInt(firstCellText, 10);
          timeText = $(cells[2]).text().trim();
          dataStartIdx = 3;
          isFullRow = true;
        } else {
          if (!lastSeenDay) return;
          timeText = $(cells[0]).text().trim();
          dataStartIdx = 1;
          isFullRow = false;
        }

        if (!timeText.includes(":")) return;

        const [hour, minute] = timeText.split(":").map(Number);

        cells.each((idx, cell) => {
          if (idx < dataStartIdx) return;

          const cellEl = $(cell);
          const link = cellEl.find("strong a");
          const title = link.text().trim();
          if (!title) return;

          const sahneIdx = isFullRow ? idx : idx + 2;
          const sahneAdi = sahneIsimleri[sahneIdx] || "Genel Sahne";

          const eventDate = new Date(
            today.getFullYear(),
            monthIndex,
            lastSeenDay!,
            hour,
            minute
          );

          if (eventDate < startDate || eventDate > endDate) return;

          const isSoldOut = cellEl.text().includes("TÜKENDİ");
          const relativeUrl = link.attr("href");

          events.push({
            title,
            description: `${title} oyunu, ${sahneAdi} sahnesinde.${isSoldOut ? " (TÜKENDİ)" : ""}`,
            date: eventDate,
            location: sahneAdi,
            category: title.toLowerCase().includes("çocuk")
              ? "Çocuk Tiyatrosu"
              : "Tiyatro",
            image: "https://images.unsplash.com/photo-1503095396549-807a8bc36675?q=80&w=2070&auto=format&fit=crop",
            source: "IBB",
            externalId: Buffer.from(`${title}-${eventDate.getTime()}-${sahneAdi}`).toString("base64"),
            price: calculateSmartPrice(title, sahneAdi),
            externalUrl: relativeUrl
              ? `https://sehirtiyatrolari.ibb.istanbul${relativeUrl}`
              : "",
            capacity: isSoldOut ? 0 : 100,
          });
        });
      });
    }

    console.log(`✅ ${events.length} adet GELECEK SEANS bulundu`);

    if (events.length > 0) {
      console.log("🗑️ Veritabanı temizleniyor...");
      await prisma.event.deleteMany({});
    }

    for (const event of events) {
      await prisma.event.upsert({
        where: {
          source_externalId: {
            source: "IBB",
            externalId: event.externalId,
          },
        },
        update: {
          date: event.date,
          price: event.price,
          capacity: event.capacity,
          location: event.location,
          externalUrl: event.externalUrl,
        },
        create: event,
      });
    }

    return { success: true, count: events.length };
  } catch (err: any) {
    console.error("❌ SCRAPER HATASI:", err.message);
    throw err;
  }
}