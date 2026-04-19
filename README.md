# Event Scale 🎟️

Event Scale, hem yerleşik olarak İBB (İstanbul Büyükşehir Belediyesi) etkinliklerini otomatik olarak çeken hem de platform üzerinden manuel olarak etkinlik yaratmanıza olanak tanıyan, modern bir etkinlik takip ve yönetim platformudur. Kullanıcılar etkinlikleri listeleyebilir, filtreleyebilir ve favorilerine ekleyerek kendi takvimlerini oluşturabilirler.

## 🚀 Özellikler

- **Yetkilendirme (Authentication):** NextAuth.js ile güvenli giriş (Google Provider destekli) ve oturum yönetimi.
- **Rol Yönetimi:** Normal Kullanıcı (`USER`) ve Yönetici (`ADMIN`) rolleri.
- **İBB Etkinlik Senkronizasyonu:** Cheerio ile İBB etkinlik sitelerinden verileri kazıma (scraping) ve veritabanına aktarma.
- **Etkinlik Yönetimi:** 
  - Admin panelinden etkinlik oluşturma, düzenleme ve silme.
  - Etkinlikleri kategori, tarih ve konuma göre filtreleme.
- **Favori Sistemi:** Kullanıcıların beğendikleri etkinlikleri favoriye ekleyebilmesi ve "Favorilerim" sayfasından takip edebilmesi.
- **Modern Arayüz:** Tailwind CSS ve Radix UI bileşenleri kullanılarak hazırlanmış duyarlı (responsive) ve şık tasarım.
- **Performans:** React Query ile optimize edilmiş veri istekleri.

## 🛠️ Kullanılan Teknolojiler

- **Frontend:** [Next.js 16](https://nextjs.org/) (App Directory), React 19, Tailwind CSS v4, Radix UI.
- **State Yönetimi:** [Zustand](https://github.com/pmndrs/zustand) (Global State) & [TanStack React Query](https://tanstack.com/query/latest) (Server State).
- **Backend:** Next.js Route Handlers.
- **Veritabanı & ORM:** PostgreSQL, [Prisma ORM](https://www.prisma.io/).
- **Kimlik Doğrulama:** [NextAuth.js (v5 Beta)](https://authjs.dev/) (@auth/prisma-adapter).
- **Web Scraping:** Cheerio.
- **Form & Validasyon:** Zod.

## 📂 Proje Yapısı

```bash
├── prisma/                 # Veritabanı şeması ve migrasyon dosyaları
├── public/                 # Statik dosyalar
├── scripts/                # Utility scriptleri (örn: Data sync)
├── src/
│   ├── app/                # Next.js App Router (Sayfalar ve Layoutlar)
│   │   ├── admin/          # Yönetici paneli (Kullanıcı ve etkinlik yönetimi)
│   │   ├── api/            # Route Handlers (Senkronizasyon, Auth vb.)
│   │   ├── events/         # Etkinlik detay sayfaları
│   │   └── favorite/       # Kullanıcı favoriler sayfası
│   ├── auth/               # NextAuth yapılandırmaları
│   ├── components/         # Tekrar kullanılabilir React/UI bileşenleri
│   ├── lib/                # Yardımcı fonksiyonlar, Prisma Client, İBB Scraper
│   ├── tests/              # Jest ile yazılmış test dosyaları testleri
│   └── types/              # TypeScript tip tanımlamaları
```

## ⚙️ Kurulum ve Çalıştırma

### Gereksinimler
- Node.js (v18+)
- PostgreSQL

### Adımlar

1. **Repoyu Klonlayın:**
   ```bash
   git clone https://github.com/kullaniciadiniz/event-scale.git
   cd event-scale
   
2. **Bağımlılıkları Yükleyin:**
    ```bash
    npm install

3. **Çevre Değişkenlerini Ayarlayın:**
    ```bash
    .env dosyası oluşturun ve .env.example içindeki gerekli şifreleri giriniz

4. **Veritabanı Senkronizasyonu:**    
    ```
    npx prisma db push
    veya npx prisma migrate dev

5. **Geliştirme Sunucusunu Başlatın:**
    ```bash
    npm run dev