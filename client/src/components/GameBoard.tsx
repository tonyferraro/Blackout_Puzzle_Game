import { useGameStore } from "@/store/game-store";
import { GameCell } from "./GameCell";
import { motion } from "framer-motion";

export function GameBoard() {
  const { grid, toggleCell, isWon } = useGameStore();

  return (
    <div className="relative p-1 bg-[#080808] border border-white/10 w-full max-w-[340px] mx-auto">
      <div className="grid grid-cols-5 gap-1">
        {grid.map((row, r) =>
          row.map((isOn, c) => (
            <GameCell
              key={`${r}-${c}`}
              isOn={isOn}
              onClick={() => toggleCell(r, c)}
              disabled={isWon}
              row={r}
              col={c}
            />
          ))
        )}
      </div>
      
      {isWon && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute inset-0 pointer-events-none bg-white/5 z-20"
        />
      )}
    </div>
  );
}
