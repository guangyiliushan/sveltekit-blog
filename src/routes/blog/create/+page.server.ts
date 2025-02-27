import { db } from '$lib/server/db'
import { posts } from '$lib/server/db/schema'
import { fail } from '@sveltejs/kit'
import type { Actions } from './$types'
import { encodeBase32LowerCase } from '@oslojs/encoding';

export const actions: Actions = {
    createPost: async ({ request }) => {
        try {
            const formData = await request.formData();
            const title = formData.get('title');
            const content = formData.get('content');

            if (!title || !content) {
                return fail(400, { 
                    success: false,
                    message: '标题和内容不能为空' 
                });
            }

            const newPost = await db.insert(posts).values({
                id: generatePostId(),
                title: title.toString(),
                content: content.toString(),
                published: true
            }).returning();

            console.log('文章创建成功:', newPost);
            return {
                success: true,
                message: `《${title}》创建成功`,
                postId: newPost[0].id
            };
        } catch (error) {
            console.error('文章创建失败:', error);
            return fail(500, {
                success: false,
                message: error instanceof Error ? error.message : '服务器内部错误'
            });
        }
    }
}

function generatePostId() {
    // ID with 120 bits of entropy, or about the same as UUID v4.
    const bytes = crypto.getRandomValues(new Uint8Array(15));
    const id = encodeBase32LowerCase(bytes);
    return id;
}