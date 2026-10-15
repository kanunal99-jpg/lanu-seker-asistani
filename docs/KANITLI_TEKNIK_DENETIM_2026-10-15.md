# lanu-seker-asistani — KANITLI TEKNİK DENETİM

**Tarih:** 15.10.2026  
**Kapsam:** GitHub dosya ağacı, seçili kaynak kodları, CI logları, Releases. Bu belge gerçek cihaz uçtan uca testi yerine geçmez.  
**Dosya sayısı (denetim anında):** 4  
**CI gözlemi:** GitHub Pages derlemesi en son 27.07.2026 başarılı; özelleştirilmiş CI/test workflow yok.  
**Anayasa:** [PROJE_ANAYASASI_VE_DUZELTILECEKLER.md](https://github.com/kanunal99-jpg/lanu-seker-asistani/blob/main/PROJE_ANAYASASI_VE_DUZELTILECEKLER.md)

## Kanıtlarla Düzeltilmesi Gerekenler

### 1. Eğitim videoları oynatılmıyor — P1 (DOĞRULANMIŞ İŞLEV EKSİĞİ)
- **Dosya/kanıt:** [index.html#L590-L599](https://github.com/kanunal99-jpg/lanu-seker-asistani/blob/main/index.html#L590-L599)
- **Gözlem:** Dört video kartı onclick=alert(...) kullanıyor; video player veya doğrulanmış yayın bağlantısı yok.
- **Somut örnek / etkisi:** 'İnsülin Enjeksiyon Tekniği' kartına dokunulunca eğitim videosu yerine yalnızca uyarı penceresi açılır.
- **Düzeltme öncesi kabul kriteri:** Gerçek ve erişilebilir eğitim içeriği/yayın hakları doğrulansın; mobil oynatma, erişim hatası ve çevrimdışı koşulları test edilsin.
- **Durum:** ARAŞTIRILDI — henüz kaynak kod düzeltmesi veya cihaz testi yapılmadı.

### 2. Service worker eski sürüm önbelleğini temizlemiyor — P2 (KOD KANITI)
- **Dosya/kanıt:** [sw.js#L1-L5](https://github.com/kanunal99-jpg/lanu-seker-asistani/blob/main/sw.js#L1-L5)
- **Gözlem:** activate yalnızca clients.claim() çalıştırıyor; eski cache anahtarlarını temizlemiyor.
- **Somut örnek / etkisi:** lanu-v2'ye geçildiğinde eski lanu-v1 cache'i tarayıcıda kalabilir.
- **Düzeltme öncesi kabul kriteri:** Sürüm tabanlı cache migration; eski cache temizleme; online/offline ve güncelleme smoke testi.
- **Durum:** ARAŞTIRILDI — henüz kaynak kod düzeltmesi veya cihaz testi yapılmadı.

### 3. İşlevsel test otomasyonu bulunmuyor — P2 (TEST AÇIĞI)
- **Dosya/kanıt:** [tree/main](https://github.com/kanunal99-jpg/lanu-seker-asistani/tree/main)
- **Gözlem:** Repo sadece index.html, manifest.json ve sw.js uygulama dosyalarına sahip; test ve .github/workflows kaynakları bulunamadı.
- **Somut örnek / etkisi:** Şeker, ilaç, randevu, kayıt ve veri saklama akışlarında regresyon otomatik yakalanamıyor.
- **Düzeltme öncesi kabul kriteri:** Playwright veya tarayıcı testleri ile giriş, veri kalıcılığı, veri sınırları, erişilebilirlik, PWA güncelleme senaryoları.
- **Durum:** ARAŞTIRILDI — henüz kaynak kod düzeltmesi veya cihaz testi yapılmadı.

### 4. Sağlık verilerinin gizliliği ve yedekleme — P1 (RİSK / CANLI TEST GEREK)
- **Dosya/kanıt:** [index.html#L116-L149](https://github.com/kanunal99-jpg/lanu-seker-asistani/blob/main/index.html#L116-L149)
- **Gözlem:** Uygulamada kimlik ve kişisel sağlık alanları var; istemci/veri saklama ve ağ modelinin güvenlik denetimi tamamlanmadı.
- **Somut örnek / etkisi:** Hesabı farklı bir kişiye ait verilerle değiştirmek veya aynı cihazda oturum değişimini test etmek.
- **Düzeltme öncesi kabul kriteri:** Oturum izolasyonu, güvenli yedekleme ve silme, hatalı giriş verisi ve paylaşılan cihaz smoke testi.
- **Durum:** ARAŞTIRILDI — henüz kaynak kod düzeltmesi veya cihaz testi yapılmadı.

## 4 Fazlı Geliştirme ve Doğrulama Kapıları

1. **Faz 1 — Araştır:** Tam modül/dosya ve bağımlılık envanteri, doğrulanmış/farklılaşmış hatalar, etki analizi. **Bu rapor ilk kaynak/CI kanıtıdır; bütün işlevlerin çalıştığını iddia etmez.**
2. **Faz 2 — Düzelt:** Önce P0/P1, en küçük güvenli kod değişimi, gizli anahtar/ücret/erişim izinlerini güvenli yöntemlerle ele al.
3. **Faz 3 — Uygulama ve test:** Unit, integrasyon, UI, offline, yetki reddi, yanlış veri, servis kesintisi, gerçek fallback, CI + Android gerçek cihaz varsa.
4. **Faz 4 — Yayın:** CI yeşil → Android ise SHA-256'lı indirilebilir Release APK → kullanıcı akışları smoke → kanıt linkleri.

## Kapatma Kriteri
Her bulgu için issue veya değişiklik ID'si, önce/sonra kanıtı, ilgili satır, test raporu, CI koşu bağlantısı, release/dağıtım bağlantısı, sonuç tarihi zorunludur. **Yalnızca belgenin eklenmiş olması sorun giderildi anlamına gelmez.**
