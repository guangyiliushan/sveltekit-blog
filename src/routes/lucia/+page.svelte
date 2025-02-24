<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();
</script>

<svelte:head>
	<title>{data.user.nickname}设置页面</title>
</svelte:head>

<main>
	<h1> {data.user.username} </h1>
	<p> {data.user.nickname} </p>
	<p> {data.user.id} </p>
	<p> {data.user.email} </p>
	<p> {data.user.phone} </p>
	<form method="post" action="?/logout" use:enhance>
	<button>Sign out</button>
	</form>
</main>
