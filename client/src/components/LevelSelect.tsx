import { useGameStore, getHighestUnlockedLevel, getTotalStars } from "@/store/game-store";
import { Star, Lock } from "lucide-react";
import { motion } from "framer-motion";

export function LevelSelect() {
  const { progress, startLevel, totalLevels } = useGameStore();
  const highestUnlocked = getHighestUnlockedLevel(progress);
  const totalStarsEarned = getTotalStars(progress);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <header className="shrink-0 flex flex-col items-center pt-8 pb-4 px-4">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold tracking-[0.3em] text-white font-mono mb-1"
        >
          LUX
        </motion.h1>
        <p className="text-white/40 font-mono tracking-widest text-[10px] uppercase mb-4">
          Extinguish the void
        </p>
        <div className="flex items-center gap-2 text-white/50 font-mono text-xs">
          <Star className="w-3 h-3 fill-white text-white" />
          <span data-testid="text-total-stars">{totalStarsEarned} / {totalLevels * 3}</span>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 pb-8">
        <div className="grid grid-cols-5 gap-2 max-w-[340px] mx-auto">
          {Array.from({ length: totalLevels }, (_, i) => i + 1).map((level) => {
            const isUnlocked = level <= highestUnlocked;
            const starsEarned = progress[level] || 0;

            return (
              <motion.button
                key={level}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: level * 0.02 }}
                onClick={() => isUnlocked && startLevel(level)}
                disabled={!isUnlocked}
                className={`aspect-square flex flex-col items-center justify-center border font-mono transition-colors ${
                  isUnlocked
                    ? "border-white/20 text-white active:bg-white/10"
                    : "border-white/5 text-white/15 cursor-not-allowed"
                }`}
                data-testid={`button-level-${level}`}
              >
                {isUnlocked ? (
                  <>
                    <span className="text-sm font-bold">{level}</span>
                    <div className="flex gap-px mt-1">
                      {[1, 2, 3].map((s) => (
                        <div
                          key={s}
                          className={`w-1 h-1 ${
                            s <= starsEarned ? "bg-white" : "bg-white/20"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  <Lock className="w-3 h-3" />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
