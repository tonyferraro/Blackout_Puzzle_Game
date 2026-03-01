import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const games = pgTable("games", {
  id: serial("id").primaryKey(),
  playerName: text("player_name").notNull(),
  score: integer("score").notNull().default(0),
  stars: integer("stars").notNull().default(0),
  playedAt: timestamp("played_at").defaultNow(),
});

export const insertGameSchema = createInsertSchema(games).omit({
  id: true,
  playedAt: true
});

export type Game = typeof games.$inferSelect;
export type InsertGame = z.infer<typeof insertGameSchema>;
