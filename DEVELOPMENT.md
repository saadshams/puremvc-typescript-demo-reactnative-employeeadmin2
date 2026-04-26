# 🛠 Development Guide

This guide helps you set up, run, and develop the project locally.

---

## 📋 Prerequisites

Make sure you have the following installed:

### 🧰 Core Tools
- 🐳 Docker (for API services)
- 🟢 Node.js (LTS recommended)
- 📦 npm or yarn
- 🔧 Git

### 📱 React Native / Expo
- 📦 Expo CLI (via `npx expo`)
- 📱 Expo Go (on your mobile device)

### 🤖 Android Development (if using Android)
- Java Development Kit (Azul Zulu)
- Android Studio
- Android SDK
- Android Emulator (configured via Android Studio)
- [Reference](https://reactnative.dev/docs/set-up-your-environment?platform=android)

### 🍎 iOS Development (Mac only)
- Xcode
- Xcode Command Line Tools
- iOS Simulator
- [Reference](https://reactnative.dev/docs/set-up-your-environment?platform=ios)

### 🔌 Optional but Recommended
- 🧪 Watchman (macOS) → improves file watching performance
- 🧠 VS Code / WebStorm (IDE)

---

## ✅ Environment Check

Run the following to verify your setup:

```bash
npx expo doctor
```
---

## 🚀 Project Setup

### 🟢 Managed (Recommended)

```bash
npx create-expo-app EmployeeAdmin --template blank-typescript
npx expo install react-native-gesture-handler react-native-screens react-native-safe-area-context @react-native-masked-view/masked-view
```

* Easy setup, fast development
* Works with Expo Go
* Best for API + Redux apps

---

### 🔴 Bare (Full Native Control)

```bash
npx create-expo-app EmployeeAdmin --template expo-template-bare-typescript
```

* Full access to iOS/Android code
* Supports native modules, TurboModules
* More setup required

---

### 🟡 Dev Build (Hybrid)

```bash
npx expo prebuild
npx expo run:ios
```

* Start Managed → add native later

---

### 🍎 **Run on iOS**
Press **Shift + I** to list simulators, then select one (e.g., iPhone 17 Pro).

### 🤖 **Run on Android**
Press **Shift + A** to list emulators/phones, then select a device (e.g., Pixel 9 Pro).
