import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { posts } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load = (async () => {
    const publishedPosts = await db
        .select({
            id: posts.id,
            title: posts.title,
            createdAt: posts.createdAt
        })
        .from(posts)
        .where(eq(posts.published, true))
        .orderBy(posts.createdAt);

    return {
        posts: publishedPosts.map(post => ({
            ...post,
            createdAt: post.createdAt.toISOString()
        }))
    };
}) satisfies PageServerLoad;