import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/store/game-store";
import { Star, ChevronRight } from "lucide-react";

export function LevelComplete() {
  const { isWon, moves, getStars, completeLevel, currentLevel, totalLevels, startLevel, goToLevels } = useGameStore();
  const [show, setShow] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (isWon && !completed) {
      completeLevel();
      setCompleted(true);
      const timer = setTimeout(() => setShow(true), 600);
      return () => clearTimeout(timer);
    }
    if (!isWon) {
      setShow(false);
      setCompleted(false);
    }
  }, [isWon, completed, completeLevel]);

  const stars = getStars();
  const hasNextLevel = currentLevel < totalLevels;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/85 backdrop-blur-sm"
          data-testid="level-complete-overlay"
        >
          <motion.div
            initial={{ y: 20, scale: 0.95 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 20, scale: 0.95 }}
            className="w-full max-w-sm p-8 flex flex-col items-center border border-white/15 bg-[#0a0a0a]"
          >
            <span className="text-white/40 font-mono text-[10px] tracking-[0.3em] mb-1">
              LEVEL {currentLevel}
            </span>
            <h2 className="text-2xl font-bold tracking-[0.2em] text-white font-mono mb-6">
              CLEARED
            </h2>

            <div className="flex gap-3 mb-6">
              {[1, 2, 3].map((s) => (
                <motion.div
                  key={s}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: s * 0.2, type: "spring" }}
                >
                  <Star
                    className={`w-8 h-8 ${
                      s <= stars ? "fill-white text-white" : "text-white/20"
                    }`}
                  />
                </motion.div>
              ))}
            </div>

            <div className="w-full flex justify-between px-4 py-3 mb-6 border border-white/10 bg-white/5 font-mono text-sm">
              <span className="text-white/50 tracking-widest">MOVES</span>
              <span className="text-white font-bold" data-testid="text-level-moves">{moves}</span>
            </div>

            <div className="w-full flex flex-col gap-2">
              {hasNextLevel && (
                <button
                  onClick={() => startLevel(currentLevel + 1)}
                  className="w-full py-3 bg-white text-black font-mono font-bold text-sm tracking-[0.2em] active:bg-neutral-200 transition-colors flex items-center justify-center gap-2"
                  data-testid="button-next-level"
                >
                  NEXT LEVEL
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={goToLevels}
                className="w-full py-3 border border-white/20 text-white/70 font-mono text-sm tracking-[0.2em] active:bg-white/10 transition-colors"
                data-testid="button-back-to-levels"
              >
                ALL LEVELS
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
