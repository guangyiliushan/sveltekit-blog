import { pgTable, text, boolean, timestamp, uuid, inet ,integer} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const users = pgTable('users', {
    id: uuid('id').primaryKey().$default(() => sql`uuid_generate_v4()`),
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
    id: text('id').primaryKey().notNull(),
    title: text('title').notNull(),
    content: text('content').notNull(),
    published: boolean('published').default(false).notNull(),
    authorId: uuid('author_id').references(() => users.id),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    views: integer('views').default(0),
    likes: integer('likes').default(0),
    category: text('category'),
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

export const verification_codes = pgTable('verification_codes', {
    id: uuid('id').primaryKey(),
    verification_code: text('verification_code').notNull(),
    target: text('target').notNull(),
    code_type: text('code_type').notNull().$type<'email' | 'sms'>(),
    expires_at: timestamp('expires_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
    is_used: boolean('is_used').default(false).notNull(),
    created_at: timestamp('created_at', { withTimezone: true })
        .defaultNow()
        .notNull()
});

export type User = typeof users.$inferSelect;
export type Session = typeof session.$inferSelect;
export type VerificationCode = typeof verification_codes.$inferSelect;
export type Post = typeof posts.$inferSelect;
