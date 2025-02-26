import { db } from '$lib/server/db'
import { posts } from '$lib/server/db/schema'
import { fail } from '@sveltejs/kit'
import type { Actions } from './$types'

export const load = async ({ url }) => {
    return {
        props: {}
    };
}

export const actions: Actions = {
    default: async ({ request }) => {
        const formData = await request.formData()
        const title = formData.get('title')
        const content = formData.get('content')

        if (!title || !content) {
            return fail(400, { message: '标题和内容不能为空' })
        }

        await db.insert(posts).values({
            title: title.toString(),
            content: content.toString()
        })

        return { success: true }
    }
}