import { sql } from "drizzle-orm";
import { pgTable, text, varchar, real, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Product schema for grocery store items
export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ean: text("ean").notNull().unique(),
  name: text("name").notNull(),
  price: real("price").notNull(),
  category: text("category").notNull(),
  aisle: text("aisle").notNull(),
  shelf: text("shelf").notNull(),
  mapX: real("map_x").notNull(), // X coordinate on store map (0-100)
  mapY: real("map_y").notNull(), // Y coordinate on store map (0-100)
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
});

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

// Search history schema
export const searchHistory = pgTable("search_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ean: text("ean").notNull(),
  productName: text("product_name").notNull(),
  timestamp: integer("timestamp").notNull(), // Unix timestamp
});

export const insertSearchHistorySchema = createInsertSchema(searchHistory).omit({
  id: true,
});

export type InsertSearchHistory = z.infer<typeof insertSearchHistorySchema>;
export type SearchHistory = typeof searchHistory.$inferSelect;
