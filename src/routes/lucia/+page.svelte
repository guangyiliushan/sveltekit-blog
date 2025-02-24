<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();
	let showVerification = $state(false);
	let verificationType = $state<'email' | 'phone'>();
</script>

<svelte:head>
	<title>{data.user.nickname}设置页面</title>
</svelte:head>

<main class="max-w-2xl mx-auto p-6 space-y-6">
	<div class="bg-[var(--color-bg-2)] rounded-lg shadow-md p-6">
		<h1 class="text-3xl font-bold text-[var(--color-theme-2)] mb-4">{data.user.username}</h1>
		<div class="space-y-3 text-gray-700">
			<p class="text-lg">用户ID：{data.user.id}</p>
			<p class="text-lg">昵称：{data.user.nickname}</p>
		</div>
	</div>

	{#if data.user.email}
	<div class="bg-white/50 p-4 rounded-md shadow-sm">
		<div class="flex items-center justify-between">
			<span class="text-gray-600">
				邮箱：{data.user.email} 
				<span class="text-sm">({data.user.email_verified ? '✅ 已认证' : '❌ 未认证'})</span>
			</span>
			{#if !data.user.email_verified}
			<button 
				class="px-4 py-2 bg-[var(--color-theme-1)] text-white rounded-md hover:opacity-90 transition-opacity"
				onclick={() => {
					showVerification = true;
					verificationType = 'email';
				}}>
				立即验证
			</button>
			{/if}
		</div>
	</div>
	{/if}

	{#if data.user.phone}
	<div class="bg-white/50 p-4 rounded-md shadow-sm">
		<div class="flex items-center justify-between">
			<span class="text-gray-600">
				手机：{data.user.phone} 
				<span class="text-sm">({data.user.phone_verified ? '✅ 已认证' : '❌ 未认证'})</span>
			</span>
			{#if !data.user.phone_verified}
			<button 
				class="px-4 py-2 bg-[var(--color-theme-1)] text-white rounded-md hover:opacity-90 transition-opacity"
				onclick={() => {
					showVerification = true;
					verificationType = 'phone';
				}}>
				立即验证
			</button>
			{/if}
		</div>
	</div>
	{/if}

	{#if showVerification}
	<form method="post" action="?/verify" use:enhance class="bg-[var(--color-bg-1)] p-4 rounded-md space-y-3">
		<h2 class="text-2xl font-bold text-[var(--color-theme-2)]">{verificationType}</h2>
		<input type="hidden" name="verifyType" value={verificationType} />
		<div class="flex gap-2">
			<input 
				type="text" 
				name="code" 
				required
				class="flex-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-[var(--color-theme-2)]"
				placeholder="输入验证码" />
			<button 
				type="submit"
				class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
				提交验证
			</button>
			<button 
				type="button" 
				name="resend" 
				formaction="?/resend"
				class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
				重新发送
			</button>
		</div>
	</form>
	{/if}

	<form method="post" action="?/logout" use:enhance>
		<button class="w-full py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
			退出登录
		</button>
	</form>
</main>
