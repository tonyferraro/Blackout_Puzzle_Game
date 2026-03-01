import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post(api.games.submit.path, async (req, res) => {
    try {
      const input = api.games.submit.input.parse(req.body);
      const game = await storage.submitGame(input);
      res.status(201).json(game);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.get(api.games.highscores.path, async (req, res) => {
    const scores = await storage.getHighScores();
    res.json(scores);
  });

  // Optional: seed database
  app.post('/api/seed', async (req, res) => {
    const existing = await storage.getHighScores();
    if (existing.length === 0) {
      await storage.submitGame({ playerName: 'Alice', score: 1000, stars: 3 });
      await storage.submitGame({ playerName: 'Bob', score: 850, stars: 2 });
      await storage.submitGame({ playerName: 'Charlie', score: 400, stars: 1 });
      res.json({ message: 'Seeded' });
    } else {
      res.json({ message: 'Already seeded' });
    }
  });

  return httpServer;
}