import { pgTable, uuid, text, timestamp, date, time, pgEnum } from "drizzle-orm/pg-core";

export const statusEnum = pgEnum("status", ["draft", "review", "approved", "published", "archived"]);
export const plateformeEnum = pgEnum("plateforme", ["linkedin", "instagram", "x", "facebook", "tiktok", "youtube"]);
export const tonEnum = pgEnum("ton", ["pro", "punchy", "fun", "communautaire", "pedagogique"]);
export const formatEnum = pgEnum("format", ["post", "carrousel", "thread", "reel", "short", "video", "article"]);
export const sourceEnum = pgEnum("source", ["blog", "cas_client", "veille", "interview", "actu", "manuel"]);
export const planningStatusEnum = pgEnum("planning_status", ["planned", "published", "failed"]);

export const cartridges = pgTable("cartridges", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  source: sourceEnum("source").notNull(),
  source_url: text("source_url"),
  source_title: text("source_title"),
  status: statusEnum("status").default("draft").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const versions = pgTable("versions", {
  id: uuid("id").defaultRandom().primaryKey(),
  cartridge_id: uuid("cartridge_id").references(() => cartridges.id, { onDelete: "cascade" }).notNull(),
  plateforme: plateformeEnum("plateforme").notNull(),
  format: formatEnum("format").notNull(),
  ton: tonEnum("ton").notNull(),
  content_text: text("content_text"),
  image_url: text("image_url"),
  image_prompt: text("image_prompt"),
  image_style: text("image_style").default("Ligne Claire"),
  hashtags: text("hashtags").array(),
  status: statusEnum("status").default("draft").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const planning = pgTable("planning", {
  id: uuid("id").defaultRandom().primaryKey(),
  version_id: uuid("version_id").references(() => versions.id, { onDelete: "cascade" }).notNull(),
  date: date("date").notNull(),
  time_slot: time("time_slot"),
  plateforme: plateformeEnum("plateforme").notNull(),
  status: planningStatusEnum("status").default("planned").notNull(),
});
