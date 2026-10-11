# 🤖 Robotun Alternatif Rotası

60–72 aylık okul öncesi çocuklar için geliştirilmiş, tarayıcıda oynanan eğitsel bir web oyunudur.
Çocuk; **planlama, rota oluşturma, strateji geliştirme, engelleri analiz etme, değişen koşullara uyum sağlama ve hata düzeltme** becerilerini oyun içinde dener.

> Düşünme süreci: **Hedefi Belirle → Planla → Uygula → Kontrol Et → Değiştir → Yeniden Dene**

## Oyunu çalıştırma

Kurulum gerekmez. Tüm oyun tek bir dosyadadır (`index.html`), internet bağlantısı istemez.

- Dosyaya çift tıklayıp tarayıcıda açın **ya da**
- GitHub Pages ile yayınlayın (aşağıya bakın).

## GitHub'a yükleme ve GitHub Pages ile yayınlama

1. github.com'da **New repository** ile yeni bir depo oluşturun (ör. `robotun-alternatif-rotasi`).
2. **Add file → Upload files** ile `index.html` ve `README.md` dosyalarını yükleyip **Commit changes** deyin.
3. **Settings → Pages** bölümünde *Source* olarak **Deploy from a branch**, branch olarak **main** ve klasör olarak **/ (root)** seçip **Save** deyin.
4. Bir iki dakika sonra oyun `https://KULLANICI_ADINIZ.github.io/robotun-alternatif-rotasi/` adresinde açılır.

Komut satırı ile yüklemek isterseniz:

```bash
git init
git add index.html README.md
git commit -m "Robotun Alternatif Rotası"
git branch -M main
git remote add origin https://github.com/KULLANICI_ADINIZ/robotun-alternatif-rotasi.git
git push -u origin main
```

## Oyun yapısı

| Düzey | Görevler | Beceri | Rozet |
|---|---|---|---|
| 1 – Robotun İlk Görevi | 1–2 | Rota planlama, komut sıralama | Plan Ustası |
| 2 – Değişen Yol | 3–4 | Engel değişince planı yeniden düzenleme | Engel Kaşifi |
| 3 – Strateji Laboratuvarı | 5–6 | Alternatif rotaları ölçüte göre karşılaştırma | Alternatif Rota Uzmanı |
| 4 – Robot Programcısı | 7–8 | Başka robotun hatalı komutunu bulma ve düzeltme | Robot Programcısı |

Toplam 8 görev vardır. Hepsi tamamlanınca **USTA ROBOT PLANLAYICISI** ödülü verilir.

### Komutlar
`⬆️ İLERİ`, `⬇️ GERİ` (robotun baktığı yöne göre), `↩️ SOLA DÖN`, `↪️ SAĞA DÖN` (yalnızca yön değiştirir, robotu yerinden oynatmaz).
Komutlar önce plana eklenir; robot yalnızca **PLANI UYGULA** düğmesine basılınca hareket eder.

### Öne çıkan özellikler
- Mouse ve dokunmatik ekran desteği; bilgisayar, tablet ve telefona uyumlu tasarım
- Robotun bakış yönüne göre dönen SVG karakter
- Başarısız planda ceza yok: **Planı yeniden düzenle** / **Rotayı incele** (doğru rota gösterilmez)
- Rotalar yalnızca renkle değil çizgi biçimi, ok ve harflerle de ayırt edilir
- Birden fazla rota ölçüte uyuyorsa hepsi doğru kabul edilir
- İpucu sistemi (cevabı vermez, soru sorarak yönlendirir)
- Tarayıcı sesli anlatımı (desteklenmiyorsa oyun sessiz çalışır; ses kapatılabilir)

## Görev eklemek veya değiştirmek

Görevler `index.html` içindeki `MISSIONS` dizisinde tutulur. Harita simgeleri:

| Simge | Anlamı |
|---|---|
| `.` | Geçilebilir yol |
| `#` | Sabit engel |
| `X` | Yer değiştirebilen engel (`type:'change'` görevlerinde) |
| `S` | Başlangıç |
| `G` | Enerji istasyonu (hedef) |

Komut kodları: `F` ileri, `B` geri, `L` sola dön, `R` sağa dön. Yön: `0` kuzey, `1` doğu, `2` güney, `3` batı.

Sayfa açıldığında `selfTest()` her görevin çözülebilir olduğunu (çözüm hedefe ulaşıyor mu, engel taşınınca eski plan geçersiz mi, hatalı plan gerçekten hatalı mı vb.) otomatik doğrular. Sorun bulunursa tarayıcı konsolunda uyarı görünür.

## Lisans
Eğitim amaçlı serbestçe kullanılabilir ve geliştirilebilir.
