<script lang="ts">
	import { page } from '$app/state';
	import type { LayoutServerData } from './$types';
	import logo from '$lib/images/svelte-logo.svg';
	import avatar from '$lib/images/default.svg';
	import { IconHome, IconBook, IconLogin, IconRocket, IconUsers } from '@tabler/icons-svelte';
	export let showUserMenu = false;
	export let data: LayoutServerData;
</script>

<header class="flex justify-between">
	<div class="w-12 h-12">
		<a class="flex items-center justify-center w-full h-full" href="https://svelte.dev/docs/kit">
			<img class="w-8 h-8 object-contain" src={logo} alt="SvelteKit" />
		</a>
	</div>

	<nav class="flex justify-center [--background:rgba(255,255,255,0.7)] mx-auto">
		<svg class="w-8 h-12 block" viewBox="0 0 2 3" aria-hidden="true"> 
			<path fill="var(--background)" d="M0,0 L1,2 C1.5,3 1.5,3 2,3 L2,0 Z" />
		</svg>
		<ul class="relative p-0 m-0 h-12 flex justify-center items-center list-none bg-[var(--background)] bg-contain"> 
			<li class="relative h-full" aria-current={page.url.pathname === '/' ? 'page' : undefined}>
				<a class="flex h-full items-center px-2 text-current font-bold text-xs uppercase tracking-wide no-underline transition-colors" href="/">
					<IconHome size={20} />
					<span class="ml-2">首页</span>
				</a>
			</li>
			<li class="relative h-full" aria-current={page.url.pathname.startsWith('/blog') ? 'page' : undefined}>
				<a href="/blog">
					<IconBook size={20} />
					<span class="ml-2">博客</span>
				</a>
			</li>
			<li class="relative h-full">
				<a href="https://www.foreverblog.cn/go.html">
					<IconRocket size={20} />
					<span class="ml-2">虫洞</span>
				</a>
			</li>
			<li class="relative h-full">
				<a href="https://www.travellings.cn/go.html">
					<IconUsers size={20} />
					<span class="ml-2">友链</span>
				</a>
			</li>
		</ul>
		<svg class="w-8 h-12 block" viewBox="0 0 2 3" aria-hidden="true"> 
			<path fill="var(--background)" d="M0,0 L0,3 C0.5,3 0.5,3 1,2 L2,0 Z" />
		</svg>
	</nav>

	<div class="user mt-2 mr-4">
		{#if data?.user}
		<button 
		type="button" 
		class="user-info flex items-center" 
		onclick={() => showUserMenu = !showUserMenu}
		tabindex="0"
		>
				<span class="align-middle">{data.user.nickname}</span>
				<img src={avatar} alt="avatar" class="mr-2 h-6 w-6 rounded-full" />
			</button>
			<div class="user-menu" class:open={showUserMenu}>
				<ul>
					<li><a href="/lucia">用户信息</a></li>
					{#if data.isAdmin === true}
						<li><a href="/blog/create">新建文章</a></li>
						<li><a href="/blog">博客管理</a></li>
						<li><a href="/#">用户管理</a></li>
						<li><a href="/#">仪表盘</a></li>
					{/if}
				</ul>
			</div>
		{:else}
			<a href="/login">
				<IconLogin size={20} />
				<span class="ml-2">登录</span>
			</a>
		{/if}
	</div>
</header>

<style>
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
	.user-menu {
		position: absolute;
		right: 1rem;
		top: 3.5rem;
		background: white;
		border-radius: 0.5rem;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
		opacity: 0;
		transform: translateY(-10px);
		transition: all 0.2s ease;
		pointer-events: none;
	}

	.user-menu.open {
		opacity: 1;
		transform: translateY(0);
		pointer-events: auto;
	}

	.user-menu ul {
		display: flex;
		flex-direction: column;
		padding: 0.5rem 0;
		min-width: 160px;
	}

	.user-menu li {
		padding: 0.5rem 1rem;
	}

	.user-menu li:hover {
		background: rgba(0, 0, 0, 0.05);
	}
</style>
