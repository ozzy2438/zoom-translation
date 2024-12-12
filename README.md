# Zoom Translation System

Real-time English to Turkish translation system for Zoom meetings using Google Cloud Translation API.

## Kurulum

1. Bu repoyu klonlayın
2. `.env.example` dosyasını `.env` olarak kopyalayın
3. `.env` dosyasındaki değişkenleri kendi Zoom API bilgilerinizle güncelleyin
4. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```
5. Sunucuyu başlatın:
   ```bash
   npm start
   ```

## Güvenlik

- `.env` dosyası Git geçmişinde yer almaz ve GitHub'a gönderilmez
- Hassas bilgilerinizi (API anahtarları, tokenlar vb.) asla direkt olarak kodun içine yazmayın
- Her zaman `.env` dosyasını kullanın