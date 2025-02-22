<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	type PostType = 'login' | 'register';
	let postType = $state<PostType>('login');
	type LoginType = 'phone' | 'email' | 'username';
	let { form }: { form: ActionData } = $props();
	let loginType = $state<LoginType>('username');

	function validateForm(event: Event) {
		const form = event.target as HTMLFormElement;
		const email = form.email.value.trim();
		const phone = form.phone.value.trim();

		if (!email && !phone) {
			event.preventDefault();
			alert('请填写邮箱或手机号码中的至少一个。');
		}
	}
</script>

<svelte:head>
	<title>Login</title>
</svelte:head>

<main>
	<div class="auth-type-toggle">
		<button type="button" class:active={postType === 'login'} onclick={() => (postType = 'login')}>登录</button>
		<button type="button" class:active={postType === 'register'} onclick={() => (postType = 'register')}>注册</button>
	</div>
	{#if postType === 'login'}
		<div class="auth-container">
			<div class="login-type-toggle">
				<button
					type="button"
					class:active={loginType === 'username'}
					onclick={() => (loginType = 'username')}>用户名</button
				>
				<button
					type="button"
					class:active={loginType === 'phone'}
					onclick={() => (loginType = 'phone')}>手机</button
				>
				<button
					type="button"
					class:active={loginType === 'email'}
					onclick={() => (loginType = 'email')}>邮箱</button
				>
			</div>
			<form method="post" action="?/login" use:enhance>
				<input type="hidden" name="logintype" value={loginType} />
				{#if loginType === 'phone'}
					<label>
						Phone
						<input type="tel" name="phone" pattern="^1[3456789]\d{9}$" required />
					</label>
				{:else if loginType === 'email'}
					<label>
						Email
						<input type="email" name="email" required />
					</label>
				{:else}
					<label>
						Username
						<input type="text" name="username" required />
					</label>
				{/if}

				<label>
					Password
					<input name="password" type="password" required />
				</label>
				<button type="submit" class="btn btn-primary">Login</button>
				{#if form?.message}
					<p class="error-message">{form.message}</p>
				{/if}
			</form>
		</div>
	{:else if postType === 'register'}
		<div class="auth-container">
			<form method="post" action="?/register" use:enhance onsubmit={validateForm}>
				<label>
					Username
					<input type="text" name="username" required />
				</label>
				<label>
					Email
					<input type="email" name="email" />
				</label>
				<label>
					Phone
					<input type="tel" name="phone" />
				</label>
				<label>
					Password
					<input name="password" type="password" required />
				</label>
				<button type="submit" class="btn btn-primary">Register</button>
				{#if form?.message}
					<p class="error-message">{form.message}</p>
				{/if}
			</form>
		</div>
	{/if}
</main>

<style>
	.auth-type-toggle {
		display: flex;
		justify-content: center;
		margin-bottom: 2rem;
	}
	.auth-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 2rem;
		background-color: var(--color-bg-2);
	}

	form {
		background: rgba(255, 255, 255, 0.9);
		padding: 2.5rem;
		border-radius: 12px;
		box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
		width: 100%;
		max-width: 400px;
	}

	label {
		color: var(--color-text);
		font-size: 0.9rem;
		margin-bottom: 0.5rem;
	}

	input {
		background: var(--color-bg-2);
		border: 2px solid var(--color-bg-1);
		border-radius: 6px;
		padding: 0.75rem;
		transition: border-color 0.3s ease;
	}

	input:focus {
		border-color: var(--color-theme-1);
		box-shadow: 0 0 0 3px rgba(255, 62, 0, 0.1);
	}

	button[type='submit'] {
		background: var(--color-theme-1);
		color: white;
		padding: 1rem;
		width: 100%;
		border-radius: 6px;
		font-weight: 600;
		letter-spacing: 0.5px;
		transition: transform 0.2s ease;
	}

	.error-message {
		color: var(--color-theme-2);
		background: rgba(64, 117, 166, 0.1);
		padding: 1rem;
		border-radius: 6px;
		margin-top: 1.5rem;
	}

	.login-type-toggle button.active {
		background: var(--color-theme-1);
		color: white;
	}
</style>
