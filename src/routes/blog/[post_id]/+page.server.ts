import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { posts } from '$lib/server/db/schema';
import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const entries = async () => {
  const poster = await db.select({ id: posts.id }).from(posts);
  return poster.map(post => ({ post_id: post.id }));
};

export const load = async ({ params }) => {
    const post_id = params.post_id;
    const result = await db
      .select({
        id: posts.id,
        title: posts.title,
        content: posts.content,
        createdAt: posts.createdAt,
        views: posts.views,
        likes: posts.likes,
        category: posts.category
      })
      .from(posts)
      .where(eq(posts.id, post_id))
      .limit(1);
  
    if (!result[0]) throw error(404, '文章未找到');
    
    return {
      post: {
        ...result[0],
        createdAt: result[0].createdAt.toISOString()
      }
    };
  };