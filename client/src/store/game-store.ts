import { create } from "zustand";

const GRID_SIZE = 5;
const PROGRESS_KEY = "lux-progress";
const TOTAL_LEVELS = 30;
const MAX_OPTIMAL_MOVES = 15;

export interface LevelConfig {
  level: number;
  optimalMoves: number;
  threeStarMax: number;
  twoStarMax: number;
}

function getLevelConfig(level: number): LevelConfig {
  const optimalMoves = Math.min(level, MAX_OPTIMAL_MOVES);
  const threeStarMax = optimalMoves;
  const twoStarMax = optimalMoves + Math.max(Math.ceil(optimalMoves * 0.5), 2);
  return { level, optimalMoves, threeStarMax, twoStarMax };
}

function generateSolvableGrid(optimalMoves: number): boolean[][] {
  const grid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(false));
  const dirs = [[0, 0], [0, 1], [0, -1], [1, 0], [-1, 0]];

  const allCells: [number, number][] = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      allCells.push([r, c]);
    }
  }

  for (let i = allCells.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allCells[i], allCells[j]] = [allCells[j], allCells[i]];
  }

  const chosen = allCells.slice(0, optimalMoves);

  for (const [r, c] of chosen) {
    dirs.forEach(([dr, dc]) => {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE) {
        grid[nr][nc] = !grid[nr][nc];
      }
    });
  }

  if (grid.every(row => row.every(cell => !cell))) {
    return generateSolvableGrid(optimalMoves);
  }
  return grid;
}

export interface LevelProgress {
  [level: number]: number;
}

function loadProgress(): LevelProgress {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveProgress(progress: LevelProgress) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

export function getHighestUnlockedLevel(progress: LevelProgress): number {
  let highest = 1;
  for (let i = 1; i <= TOTAL_LEVELS; i++) {
    if (progress[i] && progress[i] > 0) {
      highest = Math.max(highest, i + 1);
    }
  }
  return Math.min(highest, TOTAL_LEVELS);
}

export function getTotalStars(progress: LevelProgress): number {
  return Object.values(progress).reduce((sum, s) => sum + s, 0);
}

type Screen = "levels" | "game";

interface GameState {
  screen: Screen;
  currentLevel: number;
  levelConfig: LevelConfig;
  grid: boolean[][];
  moves: number;
  isWon: boolean;
  hasStarted: boolean;
  progress: LevelProgress;
  totalLevels: number;

  setScreen: (screen: Screen) => void;
  startLevel: (level: number) => void;
  toggleCell: (r: number, c: number) => void;
  resetLevel: () => void;
  getStars: () => number;
  completeLevel: () => void;
  goToLevels: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  screen: "levels",
  currentLevel: 1,
  levelConfig: getLevelConfig(1),
  grid: generateSolvableGrid(getLevelConfig(1).optimalMoves),
  moves: 0,
  isWon: false,
  hasStarted: false,
  progress: loadProgress(),
  totalLevels: TOTAL_LEVELS,

  setScreen: (screen) => set({ screen }),

  startLevel: (level) => {
    const config = getLevelConfig(level);
    set({
      screen: "game",
      currentLevel: level,
      levelConfig: config,
      grid: generateSolvableGrid(config.optimalMoves),
      moves: 0,
      isWon: false,
      hasStarted: false,
    });
  },

  getStars: () => {
    const { moves, levelConfig } = get();
    if (moves <= levelConfig.threeStarMax) return 3;
    if (moves <= levelConfig.twoStarMax) return 2;
    return 1;
  },

  toggleCell: (r, c) => {
    set((state) => {
      if (state.isWon) return state;
      const newGrid = state.grid.map((row) => [...row]);
      const dirs = [[0, 0], [0, 1], [0, -1], [1, 0], [-1, 0]];
      dirs.forEach(([dr, dc]) => {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE) {
          newGrid[nr][nc] = !newGrid[nr][nc];
        }
      });
      const isWon = newGrid.every((row) => row.every((cell) => !cell));
      return {
        grid: newGrid,
        moves: state.moves + 1,
        isWon,
        hasStarted: true,
      };
    });
  },

  resetLevel: () => {
    const { levelConfig } = get();
    set({
      grid: generateSolvableGrid(levelConfig.optimalMoves),
      moves: 0,
      isWon: false,
      hasStarted: false,
    });
  },

  completeLevel: () => {
    const { currentLevel, getStars, progress } = get();
    const earned = getStars();
    const prev = progress[currentLevel] || 0;
    if (earned > prev) {
      const updated = { ...progress, [currentLevel]: earned };
      saveProgress(updated);
      set({ progress: updated });
    }
  },

  goToLevels: () => {
    set({ screen: "levels", isWon: false });
  },
}));
