# Starlight Beauty Studio

Original kid-friendly beauty salon, makeup, hairstyling, dress-up, and photo booth game — 100% original artwork, characters, sound synthesis, and code (default English UI with instant Vietnamese toggle).

## Project Structure

- **`android/`** — **100% Native Android (Kotlin + Jetpack Compose + Android Canvas & AudioTrack)**
  - Open `android/` directly in Android Studio or build via Gradle (`assembleDebug`).
  - Zero WebView / zero third-party ads / 100% offline.
- **`ios/`** — **100% Native iOS (Swift + SwiftUI + GraphicsContext Canvas & AVAudioEngine)**
  - Open `ios/StarlightBeautyStudio.xcodeproj` in Xcode 15+ (iOS 16+) and run on iPhone, iPad, or Simulator.
  - Supports interactive finger makeup painting, Magic Fill, Surprise Makeover, Photo Booth PNG export (`ImageRenderer`), Lookbook gallery, and native `ShareLink`.
- **`src/`** — **Web Preview (React + TypeScript + Vite)**
  - Run `npm run dev` to preview immediately in any desktop or mobile browser.
