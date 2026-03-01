## Packages
zustand | Fast, unopinionated state management for complex game logic
framer-motion | Essential for buttery smooth puzzle interactions and victory animations
clsx | Utility for conditional class joining
tailwind-merge | Utility to cleanly merge tailwind classes for the grid cells

## Notes
- Game uses standard REST API for submission and highscore retrieval.
- Date parsing in API responses includes a fallback in case Zod fails to coerce JSON strings into Date objects.
