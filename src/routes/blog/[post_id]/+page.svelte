<script lang="ts">
    import type { PageData } from '../[post_id]/$types';

    import SvelteMarkdown from '@humanspeak/svelte-markdown';

    let { data }: { data: PageData } = $props();
</script>

<main class="container mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold">{data.post.title}</h1>
    <div class="flex justify-between text-gray-600 mb-4">
        <time datetime={data.post.createdAt}>
            {new Date(data.post.createdAt).toLocaleDateString('zh-CN')}
        </time>
        <span>分类：{data.post.category}</span>
    </div>
    <div class="flex text-gray-500 mb-4">
        <span>阅读量：{data.post.views}</span>
        <span class="ml-4">点赞数：{data.post.likes}</span>
    </div>
    <article class="prose">
        <SvelteMarkdown source={data.post.content} />
    </article>
</main>