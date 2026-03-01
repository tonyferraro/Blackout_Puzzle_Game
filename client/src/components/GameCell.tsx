import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GameCellProps {
  isOn: boolean;
  onClick: () => void;
  disabled: boolean;
  row?: number;
  col?: number;
}

export function GameCell({ isOn, onClick, disabled, row, col }: GameCellProps) {
  return (
    <motion.button
      whileTap={!disabled ? { scale: 0.92 } : {}}
      onClick={onClick}
      disabled={disabled}
      initial={false}
      animate={{
        backgroundColor: isOn ? "#ffffff" : "#111111",
        borderColor: isOn ? "#ffffff" : "#222222",
      }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        "relative aspect-square w-full border outline-none",
        "transition-shadow duration-300",
        isOn ? "glow-white z-10" : "z-0",
        disabled && "cursor-default"
      )}
      aria-label={isOn ? "Light is ON" : "Light is OFF"}
      data-testid={`cell-${row}-${col}`}
    />
  );
}
