# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start       # Start development server
npm test        # Run tests
npm run build   # Production build
```

To run a single test file:
```bash
npm test -- --testPathPattern="ComponentName"
```

No separate lint script is configured; ESLint runs via `react-scripts` (extends `react-app` and `react-app/jest`).

## Architecture

A React 18 + TypeScript scorekeeping web app built with Create React App. Supports three game types: **Basic** (generic), **Progressive Rook** (card game), and **Mahjong**.

**Stack**: React Router DOM v6, React Context API for state, Jest + React Testing Library, localStorage for persistence.

### State Management

Two layers of context:

1. **GameContext** (`src/contexts/GameContext.tsx`) — global state for all games. Holds `currentGame` and `games[]`, exposes `addGame/updateGame/deleteGame`. Auto-persists to `localStorage` on every change.

2. **Game-type-specific settings contexts** — each game type has its own context (`BasicSettingsContext`, `ProgSettingsContext`, `MahjongSettingsContext`) that manages that game's display/rule settings. Settings are serialized into the `Game.settings` string field when saved.

### Core Data Model

```typescript
interface Game {
  id: string;
  title: string;
  gameType: GameType;           // Basic | Progressive Rook | Mahjong
  currRound: number;
  players: string[];
  scores: (string | number)[][]; // [player index][round index]
  currDealer: string;
  currLeader: string;
  isGameOver: boolean;
  settings: string;             // JSON-serialized game-type-specific settings
}
```

### Routing

```
/                           → Start (create new game)
/basic-settings             → BasicSettings
/basic-scoresheet           → BasicScoresheet
/prog-settings              → ProgSettings
/prog-scoresheet            → ProgScoresheet
/mahjong-settings-players   → MahjongSettingsPlayers
/mahjong-scoresheet         → MahjongScoresheet
/load-games                 → LoadGames
```

### Adding a New Game Type

1. Create a settings context in `src/contexts/`
2. Create settings and scoresheet components in `src/components/`
3. Add routes in `src/App.tsx`
4. Add the new `GameType` value to the type/enum
5. Handle the new type in `GameContext` serialization/deserialization if needed
