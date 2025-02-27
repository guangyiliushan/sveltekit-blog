<script lang="ts">
    import type { PageData } from './$types';
    let { data }: { data: PageData } = $props();
</script>

<svelte:head>
    <title>博客列表</title>
</svelte:head>

<main class="container">
    <h1>最新文章</h1>
    <ul class="post-list">
        {#each data.posts as post}
            <li class="post-item">
                <div class="post-header">
                    <h2>{post.title}</h2>
                    <time datetime={post.createdAt}>
                        {new Date(post.createdAt).toLocaleDateString('zh-CN')}
                    </time>
                </div>
            </li>
        {/each}
    </ul>
</main>

<style>
    .container {
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem;
    }

    .post-list {
        list-style: none;
        padding: 0;
        margin-top: 2rem;
    }

    .post-item {
        background: #fff;
        border-radius: 8px;
        padding: 1.5rem;
        margin-bottom: 1rem;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .post-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    h2 {
        margin: 0;
        font-size: 1.25rem;
        color: #1a1a1a;
    }

    time {
        color: #666;
        font-size: 0.9rem;
    }
</style>