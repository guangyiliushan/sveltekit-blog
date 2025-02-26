<script lang="ts">
	import { page } from '$app/state';
	import type { LayoutServerData } from './$types';
	import logo from '$lib/images/svelte-logo.svg';
	import avatar from '$lib/images/default.svg';
	import { IconHome, IconBook, IconLogin, IconRocket, IconUsers } from '@tabler/icons-svelte';
    export let data: LayoutServerData;
</script>

<header>
	<div class="corner">
		<a href="https://svelte.dev/docs/kit">
			<img src={logo} alt="SvelteKit" />
		</a>
	</div>

	<nav>
		<svg viewBox="0 0 2 3" aria-hidden="true">
			<path d="M0,0 L1,2 C1.5,3 1.5,3 2,3 L2,0 Z" />
		</svg>
		<ul>
			<li aria-current={page.url.pathname === '/' ? 'page' : undefined}>
				<a href="/">
					<IconHome size={20} />
					<span class="ml-2">首页</span>
				</a>
			</li>
			<li aria-current={page.url.pathname.startsWith('/blog') ? 'page' : undefined}>
				<a href="/blog">
					<IconBook size={20} />
					<span class="ml-2">博客</span>
				</a>
			</li>
			<li>
				<a href="https://www.foreverblog.cn/go.html">
					<IconRocket size={20} />
					<span class="ml-2">虫洞</span>
				</a>
			</li>
			<li>
				<a href="https://www.travellings.cn/go">
					<IconUsers size={20} />
					<span class="ml-2">友链</span>
				</a>
			</li>
			{#if data?.user}
				<li aria-current={page.url.pathname === '/lucia' ? 'page' : undefined}>
					<a href="/lucia">
						<img 
							src= {avatar} 
							alt="avatar" 
							class="w-6 h-6 rounded-full mr-2" 
						/>
						<span class="align-middle">{data.user.nickname}</span>
					</a>
				</li>
			{:else}
				<li aria-current={page.url.pathname === '/login' ? 'page' : undefined}>
					<a href="/login">
						<IconLogin size={20} />
						<span class="ml-2">登录</span>
					</a>
				</li>
			{/if}
		</ul>
		<svg viewBox="0 0 2 3" aria-hidden="true">
			<path d="M0,0 L0,3 C0.5,3 0.5,3 1,2 L2,0 Z" />
		</svg>
	</nav>

	<div class="corner">
		<a href="/lucia"><img src={avatar} alt="avatar"></a>
	</div>
</header>

<style>
	header {
		display: flex;
		justify-content: space-between;
	}

	.corner {
		width: 3em;
		height: 3em;
	}

	.corner a {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}

	.corner img {
		width: 2em;
		height: 2em;
		object-fit: contain;
	}

	nav {
		display: flex;
		justify-content: center;
		--background: rgba(255, 255, 255, 0.7);
	}

	svg {
		width: 2em;
		height: 3em;
		display: block;
	}

	path {
		fill: var(--background);
	}

	ul {
		position: relative;
		padding: 0;
		margin: 0;
		height: 3em;
		display: flex;
		justify-content: center;
		align-items: center;
		list-style: none;
		background: var(--background);
		background-size: contain;
	}

	li {
		position: relative;
		height: 100%;
	}

	li[aria-current='page']::before {
		--size: 6px;
		content: '';
		width: 0;
		height: 0;
		position: absolute;
		top: 0;
		left: calc(50% - var(--size));
		border: var(--size) solid transparent;
		border-top: var(--size) solid var(--color-theme-1);
	}

	nav a {
		display: flex;
		height: 100%;
		align-items: center;
		padding: 0 0.5rem;
		color: var(--color-text);
		font-weight: 700;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		text-decoration: none;
		transition: color 0.2s linear;
	}

	a:hover {
		color: var(--color-theme-1);
	}
</style>
