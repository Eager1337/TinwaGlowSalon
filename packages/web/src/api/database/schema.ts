import { sqliteTable, text } from "drizzle-orm/sqlite-core";
export * from './auth-schema';

export const enquiries = sqliteTable('enquiries', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  service: text('service').notNull(),
  date: text('date').notNull(),
  time: text('time').notNull(),
  notes: text('notes').notNull().default(''),
  status: text('status').notNull().default('New'),
  createdAt: text('created_at').notNull(),
});

/**
 * Define your database schema here, then apply it with `bun run db:push`
 * (from packages/web). Re-export any generated schema from this file
 * (e.g. Better Auth's auth-schema.ts) so drizzle generates complete migrations.
 * Table patterns and conventions: skills/app/references/api.md
 */
