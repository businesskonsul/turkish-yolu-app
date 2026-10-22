# Turkish Yolu — Android

Курс турецкого для русскоговорящих: путь из 16 юнитов (A1.1 → B2.1), котик-тамагочи Tarçın, работает без интернета.
Приложение — `index.html`, картинки — в `images.json`. Android-проект Capacitor 7 создаётся при каждой сборке в Codemagic.

Сборки в Codemagic (`codemagic.yaml`):
- **android-test** — APK для установки прямо на телефон, ключи не нужны. Запускается сама при каждом изменении файлов.
- **android-release** — подписанные AAB (для Google Play) и APK. Нужен ключ `turkish_yolu_keystore`
  (Teams → Code signing identities → Android keystores).

ID приложения: `com.turkishyolu.app`.
