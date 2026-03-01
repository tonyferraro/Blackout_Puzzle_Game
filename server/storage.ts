import { db } from "./db";
import { games, type Game, type InsertGame } from "@shared/schema";
import { desc } from "drizzle-orm";

export interface IStorage {
  submitGame(game: InsertGame): Promise<Game>;
  getHighScores(): Promise<Game[]>;
}

export class DatabaseStorage implements IStorage {
  async submitGame(game: InsertGame): Promise<Game> {
    const [newGame] = await db.insert(games).values(game).returning();
    return newGame;
  }

  async getHighScores(): Promise<Game[]> {
    return await db.select().from(games).orderBy(desc(games.score)).limit(10);
  }
}

export const storage = new DatabaseStorage();