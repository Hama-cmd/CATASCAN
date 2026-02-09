import { pgTable, text, serial, integer, boolean, timestamp, jsonb, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./models/auth";

export * from "./models/auth";

export const screenings = pgTable("screenings", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  imageUrl: text("image_url").notNull(),
  analysis: jsonb("analysis").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertScreeningSchema = createInsertSchema(screenings).omit({ 
  id: true, 
  createdAt: true 
});

export type Screening = typeof screenings.$inferSelect;
export type InsertScreening = z.infer<typeof insertScreeningSchema>;

export type AnalyzeImageRequest = {
  image: string; // Base64
};

export type AnalysisResult = {
  condition: string;
  confidence: string;
  description: string;
  recommendation: string;
  disclaimer: string;
};
