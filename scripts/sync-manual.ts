import { scrapeAndSyncIBB } from "../src/lib/ibb-scraper";

async function main() {
  console.log("GitHub Action tetiklendi, veri çekiliyor...");
  try {
    await scrapeAndSyncIBB();
    console.log("✅ Başarıyla tamamlandı.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Hata oluştu:", error);
    process.exit(1);
  }
}

main();