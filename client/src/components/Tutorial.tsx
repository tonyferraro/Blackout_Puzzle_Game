import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, ChevronLeft } from "lucide-react";

const TUTORIAL_KEY = "lux-tutorial-seen";

interface TutorialProps {
  forceShow?: boolean;
  onClose?: () => void;
}

const steps = [
  {
    title: "WELCOME",
    content: "Your mission is simple: extinguish every light on the grid.",
    visual: "goal",
  },
  {
    title: "TAP A CELL",
    content: "Tapping a cell toggles it and its four direct neighbors: up, down, left, and right.",
    visual: "tap",
  },
  {
    title: "THE CATCH",
    content: "Every tap affects multiple cells. Think carefully about which cells to press to clear the board.",
    visual: "pattern",
  },
  {
    title: "EARN STARS",
    content: "Solve in 20 moves or fewer for 3 stars. Under 30 gets 2 stars. Beat the puzzle in any number of moves for 1 star.",
    visual: "stars",
  },
  {
    title: "READY",
    content: "Submit your score to the global leaderboard and compete for the top spot. Good luck.",
    visual: "ready",
  },
];

function MiniGrid({ step }: { step: string }) {
  const size = 5;
  const [cells, setCells] = useState<boolean[][]>(
    Array(size).fill(null).map(() => Array(size).fill(false))
  );
  const [highlighted, setHighlighted] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (step === "goal") {
      const pattern = [
        [true, false, true, false, true],
        [false, true, false, true, false],
        [true, false, false, false, true],
        [false, true, false, true, false],
        [true, false, true, false, true],
      ];
      setCells(pattern);
      setHighlighted(new Set());
    } else if (step === "tap") {
      const grid = Array(size).fill(null).map(() => Array(size).fill(false));
      grid[2][2] = true;
      grid[1][2] = true;
      grid[3][2] = true;
      grid[2][1] = true;
      grid[2][3] = true;
      setCells(grid);
      setHighlighted(new Set(["2,2", "1,2", "3,2", "2,1", "2,3"]));
    } else if (step === "pattern") {
      const grid = Array(size).fill(null).map(() => Array(size).fill(false));
      grid[0][1] = true;
      grid[1][0] = true;
      grid[1][1] = true;
      grid[1][2] = true;
      grid[2][1] = true;
      setCells(grid);
      setHighlighted(new Set(["1,1"]));
    } else {
      setCells(Array(size).fill(null).map(() => Array(size).fill(false)));
      setHighlighted(new Set());
    }
  }, [step]);

  return (
    <div className="grid grid-cols-5 gap-1 mx-auto w-fit my-4">
      {cells.map((row, r) =>
        row.map((isOn, c) => {
          const key = `${r},${c}`;
          const isHL = highlighted.has(key);
          return (
            <motion.div
              key={key}
              animate={{
                backgroundColor: isOn ? "#ffffff" : "#111111",
                borderColor: isHL ? "#ffffff" : isOn ? "#ffffff" : "#222222",
              }}
              transition={{ duration: 0.3 }}
              className="w-8 h-8 border relative"
              data-testid={`tutorial-cell-${r}-${c}`}
            >
              {isHL && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute inset-0 border-2 border-white"
                />
              )}
            </motion.div>
          );
        })
      )}
    </div>
  );
}

function StarsVisual() {
  return (
    <div className="flex flex-col gap-3 my-4 mx-auto w-fit font-mono text-sm">
      <div className="flex items-center gap-3">
        <div className="flex gap-1">
          {[1, 2, 3].map((s) => (
            <div key={s} className="w-3 h-3 bg-white" />
          ))}
        </div>
        <span className="text-white/60">20 moves or fewer</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex gap-1">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`w-3 h-3 ${s <= 2 ? "bg-white" : "bg-white/20"}`} />
          ))}
        </div>
        <span className="text-white/60">21 - 30 moves</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex gap-1">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`w-3 h-3 ${s <= 1 ? "bg-white" : "bg-white/20"}`} />
          ))}
        </div>
        <span className="text-white/60">31+ moves</span>
      </div>
    </div>
  );
}

export function Tutorial({ forceShow, onClose }: TutorialProps) {
  const [visible, setVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (forceShow) {
      setVisible(true);
      setCurrentStep(0);
    }
  }, [forceShow]);

  const handleClose = () => {
    localStorage.setItem(TUTORIAL_KEY, "true");
    setVisible(false);
    setCurrentStep(0);
    onClose?.();
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    }
  };

  const step = steps[currentStep];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md"
          data-testid="tutorial-overlay"
        >
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-sm flex flex-col items-center"
          >
            <button
              onClick={handleClose}
              className="absolute top-6 right-6 text-white/40 active:text-white transition-colors p-2"
              data-testid="button-close-tutorial"
              aria-label="Close tutorial"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex gap-1.5 mb-8">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 w-6 transition-colors duration-300 ${
                    i === currentStep ? "bg-white" : i < currentStep ? "bg-white/40" : "bg-white/15"
                  }`}
                />
              ))}
            </div>

            <h2 className="text-2xl font-bold tracking-[0.3em] text-white mb-2 font-mono">
              {step.title}
            </h2>

            <p className="text-white/60 text-center text-sm leading-relaxed max-w-xs mb-4 font-mono">
              {step.content}
            </p>

            {(step.visual === "goal" || step.visual === "tap" || step.visual === "pattern") && (
              <MiniGrid step={step.visual} />
            )}

            {step.visual === "stars" && <StarsVisual />}

            {step.visual === "ready" && (
              <div className="my-6 w-16 h-16 border border-white/20 flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-6 h-6 bg-white"
                />
              </div>
            )}

            <div className="flex items-center gap-4 mt-6 w-full">
              {currentStep > 0 ? (
                <button
                  onClick={handlePrev}
                  className="flex-1 py-3 border border-white/20 text-white/60 font-mono text-sm tracking-widest active:bg-white/10 transition-colors flex items-center justify-center gap-2"
                  data-testid="button-tutorial-prev"
                >
                  <ChevronLeft className="w-4 h-4" />
                  BACK
                </button>
              ) : (
                <div className="flex-1" />
              )}
              <button
                onClick={handleNext}
                className="flex-1 py-3 bg-white text-black font-mono font-bold text-sm tracking-widest active:bg-neutral-200 transition-colors flex items-center justify-center gap-2"
                data-testid="button-tutorial-next"
              >
                {currentStep === steps.length - 1 ? "PLAY" : "NEXT"}
                {currentStep < steps.length - 1 && <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
