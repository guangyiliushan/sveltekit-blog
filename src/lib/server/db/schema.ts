import { pgTable, serial, text, integer, timestamp ,uuid, inet } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
	id: text('id').primaryKey(),
	username: text('username').notNull().unique(),
	password: text('password').notNull(),
	phone: text('phone'),
	email: text('email'),
	nickname: text('nickname').notNull(),
});

export const posts = pgTable('posts', {
	id: text('id').primaryKey(),
	title: text('title').notNull(),
	content: text('content').notNull(),
	authorId: uuid('author_id').references(() => users.id),
	createdAt: timestamp('createdAt').defaultNow().notNull(),
	updatedAt: timestamp('updatedAt').defaultNow().notNull(),
});

export const session = pgTable('session', {
    id: uuid('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: uuid('user_id')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
    expiresAt: timestamp('expires_at', {
        withTimezone: true,
        mode: 'date'
    }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    userAgent: text('user_agent'),
    ipAddress: inet('ip_address')
});

export type Session = typeof session.$inferSelect;

export type User = typeof users.$inferSelect;
export type Post = typeof posts.$inferSelect;
