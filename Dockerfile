# 1. İşletim sistemi ve Node sürümü seçiyoruz (Hafif bir sürüm: Alpine)
FROM node:20-alpine

# 2. Konteyner içinde çalışacağımız klasör
WORKDIR /app

# 3. Bağımlılık listelerini kopyala
COPY package*.json ./

# 4. Bağımlılıkları yükle (Konteynerin kendi node_modules'ü oluşur)
RUN npm install

# 5. Prisma şemasını kopyala ve client'ı üret
# Bu adım Prisma kullandığın için hayati önem taşır!
COPY prisma ./prisma/
RUN npx prisma generate

# 6. Tüm kodları içeri kopyala
COPY . .

# 7. Next.js projesini build et
RUN npm run build

# 8. Uygulama hangi portu kullanacak?
EXPOSE 3000

# 9. Çalıştırma komutu
CMD ["npm", "start"]