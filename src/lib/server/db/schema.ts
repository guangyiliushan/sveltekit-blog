import { pgTable, serial, text, boolean, timestamp ,uuid, inet } from 'drizzle-orm/pg-core';
import { availableMemory } from 'process';

export const users = pgTable('users', {
	id: text('id').primaryKey(),
	username: text('username').notNull().unique(),
	password: text('password').notNull(),
	phone: text('phone'),
	email: text('email'),
    email_verified: boolean('email_verified').default(false),
    phone_verified: boolean('phone_verified').default(false),
	nickname: text('nickname').notNull(),
    avatar: text('avatar').default('default.svg'),
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
    id: text('id').primaryKey().notNull(),
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
