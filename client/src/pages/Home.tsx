import { useState, useEffect } from "react";
import { useGameStore } from "@/store/game-store";
import { GameBoard } from "@/components/GameBoard";
import { LevelComplete } from "@/components/LevelComplete";
import { LevelSelect } from "@/components/LevelSelect";
import { Tutorial } from "@/components/Tutorial";
import { RefreshCw, ArrowLeft, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";

const TUTORIAL_KEY = "lux-tutorial-seen";

export default function Home() {
  const { screen, moves, resetLevel, getStars, currentLevel, levelConfig, goToLevels } = useGameStore();
  const stars = getStars();
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem(TUTORIAL_KEY);
    if (!seen) {
      setShowTutorial(true);
    }
  }, []);

  if (screen === "levels") {
    return (
      <div className="h-full bg-background flex flex-col overflow-hidden">
        <div className="absolute top-3 right-3 z-10">
          <button
            onClick={() => setShowTutorial(true)}
            className="p-2 text-white/40 active:text-white transition-colors"
            data-testid="button-show-tutorial"
            aria-label="Show tutorial"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>
        <LevelSelect />
        <Tutorial forceShow={showTutorial} onClose={() => setShowTutorial(false)} />
      </div>
    );
  }

  return (
    <div className="h-full bg-background flex flex-col overflow-hidden">
      <header className="shrink-0 flex items-center justify-between px-4 pt-3 pb-2">
        <button
          onClick={goToLevels}
          className="flex items-center gap-2 text-white/50 active:text-white transition-colors font-mono text-xs tracking-widest"
          data-testid="button-back-levels"
        >
          <ArrowLeft className="w-4 h-4" />
          LEVELS
        </button>
        <span className="text-white/40 font-mono text-[10px] tracking-[0.3em]" data-testid="text-level-number">
          LEVEL {currentLevel}
        </span>
        <button
          onClick={() => setShowTutorial(true)}
          className="p-2 text-white/40 active:text-white transition-colors"
          data-testid="button-show-tutorial-game"
          aria-label="Show tutorial"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-4 min-h-0">
        <div className="w-full max-w-[340px] flex justify-between items-end mb-4 px-1 font-mono">
          <div className="flex flex-col">
            <span className="text-[10px] text-white/40 tracking-widest mb-1">MOVES</span>
            <span className="text-2xl font-bold leading-none text-white" data-testid="text-moves">
              {moves.toString().padStart(2, "0")}
            </span>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-[10px] text-white/40 tracking-widest mb-1.5">RATING</span>
            <div className="flex gap-1" data-testid="status-stars">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`w-2 h-2 transition-colors duration-300 ${
                    s <= stars ? "bg-white" : "bg-white/20"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <GameBoard />

        <div className="mt-2 text-[9px] text-white/25 font-mono tracking-widest text-center">
          {levelConfig.threeStarMax} moves for 3 stars
        </div>
      </div>

      <nav className="shrink-0 flex items-center justify-center px-4 py-3 border-t border-white/10 bg-[#060606]">
        <button
          onClick={resetLevel}
          className="flex flex-col items-center gap-1 px-6 py-1 text-white/60 active:text-white transition-colors"
          data-testid="button-restart"
        >
          <RefreshCw className="w-5 h-5" />
          <span className="text-[10px] font-mono tracking-widest">RESET</span>
        </button>
      </nav>

      <LevelComplete />
      <Tutorial forceShow={showTutorial} onClose={() => setShowTutorial(false)} />
    </div>
  );
}
