# Copilot instructions for scoresheet-app

A React 18 + TypeScript scorekeeping PWA built with **Vite** and **Vitest**. Supports four game types: Basic, Progressive Rook, Mahjong, and Loony.

> Note: `CLAUDE.md` references Create React App / Jest / `react-scripts`. That is stale — the project was migrated to Vite + Vitest. Trust this file and `package.json` / `vite.config.ts`.

## Commands

```bash
npm start         # vite dev server
npm run build     # tsc && vite build (type-check is part of the build)
npm test          # vitest (watch mode)
npm test -- --run                          # single full pass, no watch
npm test -- --run src/App.test.tsx         # run a single test file
npm test -- -t "test name substring"       # run tests matching a name
npm run preview   # preview the production build
```

There is no separate lint script. Type errors surface via `npm run build` (or your editor's TS server).

## Architecture

### Routing & provider composition (`src/App.tsx`)
- Uses `HashRouter` (the app is deployed as a static site / PWA, so hash routing avoids server rewrites).
- Each route wraps its component in the providers it needs. `GameContextProvider` is mounted **per route**, not once at the app root. Any state inside `GameContext` that isn't persisted to `localStorage` will not survive navigation — keep persistent state in `localStorage`.

### State: two-layer context
1. **`GameContext`** (`src/contexts/GameContext.tsx`) — global game list and `currentGame`. Auto-persists `games` to `localStorage` under the key `games`. Exposes `addGame`, `updateGame`, `deleteGame`, `setCurrentGame`. Games with an empty `id` are filtered out on save (`cleanGames`) — a `Game` is only persisted once it has a non-empty `id`.
2. **Game-type settings contexts** — `BasicSettingsContext`, `ProgSettingsContext`, `MahjongSettingsContext`. Loony has no dedicated settings context. These hold display/rule settings for an in-progress game and are serialized into the `Game.settings` string field (JSON) when saved.

### Core data model
```ts
interface Game {
  id: string;                       // empty until the game is committed
  title: string;
  gameType: GameType;               // ProgressiveRook | Mahjong | Loony | Basic
  currRound: number;
  players: string[];
  scores: (string | number)[][];    // scores[playerIndex][roundIndex]
  currDealer: string;
  currLeader: string;
  isGameOver: boolean;
  settings: string;                 // JSON-serialized game-type-specific settings
}
```
`GameType` is a string enum in `GameContext.tsx`; `gameTypes` is `Object.values(GameType)`.

### Routes
```
/                           Start (new game)
/basic-settings             BasicSettings
/basic-scoresheet           BasicScoresheet
/prog-settings              ProgSettings
/prog-scoresheet            ProgScoresheet
/prog-rules                 ProgRules
/mahjong-settings-players   MahjongSettingsPlayers
/mahjong-scoresheet         MahjongScoresheet
/mahjong-rules              MahjongRules
/loony-settings             LoonySettings
/loony-scoresheet           LoonyScoresheet
/loony-rules                LoonyRules
/load-games                 LoadGames
```

### Components layout
`src/components/` is grouped by game type: `Basic/`, `ProgressiveRook/`, `Mahjong/`, `Loony/`, plus shared `Start.tsx`, `LoadGames.tsx`, `PrimaryButton.tsx`. Game-type-specific helpers live in `src/utils/` (e.g. `MahjongUtils.ts`).

### PWA
`vite-plugin-pwa` is configured in `vite.config.ts` with `registerType: 'autoUpdate'`. Manifest icons live in `public/`. Bumping app behavior that should invalidate the SW typically only requires a new build — autoUpdate handles the rest.

## Conventions

- **Vitest globals are enabled** (`test.globals: true` in `vite.config.ts`), so `describe`/`it`/`expect` do not need to be imported. `src/setupTests.ts` is the setup file.
- Test files use `.test.tsx` and live next to the code (see `src/App.test.tsx`).
- Persist via `localStorage` only — there is no backend.
- When adding a new `GameType`:
  1. Add the value to the `GameType` enum in `GameContext.tsx`.
  2. Create a settings context in `src/contexts/` (if the game has configurable settings).
  3. Add `Settings` and `Scoresheet` components in `src/components/<GameType>/`.
  4. Register routes in `src/App.tsx`, wrapping with `GameContextProvider` and the new settings provider.
  5. Serialize game-specific settings into `Game.settings` (JSON string).
- Use `HashRouter`-friendly links (`/path`, no leading `#`); `react-router-dom` v6 handles the rest.
