import { pgTable, text, timestamp, pgEnum } from 'drizzle-orm/pg-core';

export const leadStatusEnum = pgEnum('lead_status', ['new', 'contacted', 'closed']);

export const leads = pgTable('leads', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  email: text('email').notNull(),
  budgetRange: text('budget_range').notNull(),
  message: text('message').notNull(),
  status: leadStatusEnum('status').default('new').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const adminUsers = pgTable('admin_users', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;
export type AdminUser = typeof adminUsers.$inferSelect;
export type NewAdminUser = typeof adminUsers.$inferInsert;
