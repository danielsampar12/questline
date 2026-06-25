<div align="center">

# Questline

<p>
  <img src="https://img.shields.io/badge/React%20Native-0.79-61DAFB?style=flat-square&logo=react" />
  <img src="https://img.shields.io/badge/Expo-53-000020?style=flat-square&logo=expo" />
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript" />
  <img src="https://img.shields.io/badge/platform-iOS%20%7C%20Android-lightgrey?style=flat-square" />
  <img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" />
</p>

**A location-based quest game built with React Native & Expo.**
*Solve riddles, follow GPS clues, and find the spot.*

</div>

---

> Originally built as a gift for my girlfriend — inspired by Five Feet Apart — and grown into a small
> React Native project I'm very fond of.

## What it is

Questline turns the real world into a treasure hunt. Each quest gives you a riddle and
a hint; solve it, walk to the right place, and the app uses high-accuracy GPS to confirm
you've arrived before unlocking the next step. Progress, points, and streaks are tracked
locally as you go.

## Features

- 🎯 **Riddle-driven quests** — each step is a puzzle that points to a real location
- 📍 **High-accuracy GPS** — proximity detection with real-time distance to the target
- 🏆 **Progress tracking** — points, streaks, and quest completion persisted on-device
- 🔄 **Quest progression** — steps unlock in sequence as locations are reached
- 🎨 **Clean mobile UI** — built with React Native Paper, Material-style components
- ⚡ **Custom hooks** — location and quest logic isolated behind reusable hooks

## Getting started

> Requires [Node.js](https://nodejs.org), the [Expo](https://docs.expo.dev/get-started/installation/)
> tooling, and the **Expo Go** app on your phone (or an iOS/Android simulator).

```bash
git clone https://github.com/danielsampar12/questline.git
cd questline
npm install
npx expo start
```

Scan the QR code with Expo Go, or press `i` / `a` to launch an iOS / Android simulator.

> **Location permissions:** the app requests foreground location access on first launch —
> grant it so GPS proximity detection works.

## Tech stack

| Layer | Tools |
|---|---|
| Framework | React Native 0.79, Expo 53, React 19 |
| Language | TypeScript 5.8 |
| UI | React Native Paper |
| Location | Expo Location (high-accuracy GPS) |
| Persistence | AsyncStorage |

## Architecture

The app keeps game logic out of the UI and behind small, focused hooks:

- **`QuestScreen`** — main game interface; renders the active quest, riddle, and distance
- **`useLocation`** — wraps Expo Location: permissions, high-accuracy watch, and live coordinates
- **`useQuest`** — quest state machine: current step, progression, points, and streaks
- **`locationUtils`** — distance calculation (haversine) and proximity helpers

```
src/
├── screens/      # QuestScreen and UI
├── hooks/        # useLocation, useQuest
├── utils/        # locationUtils — distance & proximity
└── data/         # quest definitions (riddles, hints, coordinates)
```

## Configuring your own quest

Quests are plain data — add riddles, hints, and target coordinates in `src/data` and they
appear in the app. No code changes needed to build a new hunt.

## Roadmap

- [ ] Multiple quest packs / selectable hunts
- [ ] Photo proof at each checkpoint
- [ ] Shareable custom quests
- [ ] Offline map tiles

## License

MIT — see [LICENSE](LICENSE).

---

<div align="center">
<sub>Built with React Native + Expo. Best played on foot. 🧭</sub>
</div>
