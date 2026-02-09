import { db } from "./db";
import { screenings, type InsertScreening, type Screening } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  createScreening(screening: InsertScreening): Promise<Screening>;
  getScreeningsByUser(userId: string): Promise<Screening[]>;
  getScreening(id: number): Promise<Screening | undefined>;
}

export class DatabaseStorage implements IStorage {
  async createScreening(screening: InsertScreening): Promise<Screening> {
    const [result] = await db.insert(screenings).values(screening).returning();
    return result;
  }

  async getScreeningsByUser(userId: string): Promise<Screening[]> {
    return db
      .select()
      .from(screenings)
      .where(eq(screenings.userId, userId))
      .orderBy(desc(screenings.createdAt));
  }

  async getScreening(id: number): Promise<Screening | undefined> {
    const [result] = await db
      .select()
      .from(screenings)
      .where(eq(screenings.id, id));
    return result;
  }
}

export const storage = new DatabaseStorage();
