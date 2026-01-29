jest.mock('cheerio', () => ({
  load: jest.fn(),
}));

import { calculateSmartPrice } from '../lib/ibb-scraper';

describe('Akıllı Fiyatlandırma Sistemi (Smart Pricing)', () => {
  
  // 1. Senaryo: Harbiye Sahnesi - Müzikal
  it('Harbiye sahnesindeki müzikaller 450 TL olmalı', () => {
    const fiyat = calculateSmartPrice('Güzel Bir Müzikal', 'Harbiye Cemil Topuzlu Açıkhava Tiyatrosu');
    expect(fiyat).toBe(450);
  });

  // 2. Senaryo: Harbiye Sahnesi - Standart Oyun
  it('Harbiye sahnesindeki standart oyunlar 400 TL olmalı', () => {
    const fiyat = calculateSmartPrice('Hamlet', 'Harbiye Cemil Topuzlu Açıkhava Tiyatrosu');
    expect(fiyat).toBe(400);
  });

  // 3. Senaryo: Çocuk Oyunları (Her yerde ucuz olmalı)
  it('Standart sahnelerde çocuk oyunları 48 TL olmalı', () => {
    const fiyat = calculateSmartPrice('Şirinler ve Çocuk', 'Fatih Reşat Nuri Sahnesi');
    expect(fiyat).toBe(48);
  });

  // 4. Senaryo: Harbiye - Çocuk Oyunu (Burası biraz daha pahalı olabilir)
  it('Harbiye sahnesindeki çocuk oyunları 80 TL olmalı', () => {
    const fiyat = calculateSmartPrice('Harbiye Çocuk Şenliği', 'Harbiye Cemil Topuzlu Açıkhava Tiyatrosu');
    expect(fiyat).toBe(80);
  });

  // 5. Senaryo: Standart Müzikal
  it('Standart sahnelerdeki müzikaller 208 TL olmalı', () => {
    const fiyat = calculateSmartPrice('Lüküs Hayat Müzikali', 'Ümraniye Sahnesi');
    expect(fiyat).toBe(208);
  });

  // 6. Senaryo: Varsayılan (Hiçbir kategoriye girmeyen)
  it('Hiçbir kategoriye girmeyen standart oyunlar 160 TL olmalı', () => {
    const fiyat = calculateSmartPrice('Sıradan Bir Dram', 'Gaziosmanpaşa Sahnesi');
    expect(fiyat).toBe(160);
  });
});