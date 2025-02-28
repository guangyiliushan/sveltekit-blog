<script lang="ts">
    import type { PageData } from '../[post_id]/$types';

    import SvelteMarkdown from '@humanspeak/svelte-markdown';

    let { data }: { data: PageData } = $props();
</script>

<main class="article-container">
    <h1>{data.post.title}</h1>
    <div class="meta-info">
        <time datetime={data.post.createdAt}>
            {new Date(data.post.createdAt).toLocaleDateString('zh-CN')}
        </time>
        <span>分类：{data.post.category}</span>
        <div class="stats">
            <span>阅读量：{data.post.views}</span>
            <span>点赞数：{data.post.likes}</span>
        </div>
    </div>
    <article class="markdown-content">
        <SvelteMarkdown source={data.post.content} />
    </article>
</main>

<style>
    .article-container {
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem;
    }

    .markdown-content {
        margin-top: 2rem;
        line-height: 1.6;
    }

    .meta-info {
        color: #666;
        font-size: 0.9rem;
        border-bottom: 1px solid #eee;
        padding-bottom: 1rem;
        margin-bottom: 1.5rem;
    }
</style>