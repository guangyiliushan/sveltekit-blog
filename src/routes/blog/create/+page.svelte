<script lang="ts">
	import SvelteMarkdown from '@humanspeak/svelte-markdown';
	import type { Token, TokensList, SvelteMarkdownOptions } from '@humanspeak/svelte-markdown';
	import { onMount } from 'svelte';

	let ogText = ``;

	let source = $state(ogText);
	let value = $state(ogText);
	let browser = $state(false);

	const onKeyupTextArea = async () => {
		source = value;
	};

	const showParsed = async (parsedTokens: Token[] | TokensList) => {
		console.log('displaying tokens', parsedTokens);
	};

	onMount(() => {
		browser = true;
	});
</script>

<div class="editor-container">
	<div class="editor-pane">
		<form method="post" action="?/createPost">
			<input type="text" name="title" placeholder="输入文章标题..." />
			<textarea
				bind:value
				onkeyup={onKeyupTextArea}
				name="content"
				class="markdown-editor"
				placeholder="输入Markdown内容..."
			></textarea>
			<button type="submit">保存文章</button>
		</form>
	</div>
	<div class="preview-pane">
		{#if browser}
			<SvelteMarkdown {source} parsed={showParsed} />
		{/if}
	</div>
</div>

<style>
	.editor-container {
		display: flex;
		gap: 2rem;
		height: 80vh;
		padding: 1rem;
	}

	.editor-pane {
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.markdown-editor {
		flex: 1;
		background: #f9fafb;
		width: 100%;
		padding: 1rem;
		border: 1px solid #e5e7eb;
		border-radius: 0.5rem;
		resize: none;
		font-family: monospace;
		min-height: 300px;
	}

	.preview-pane {
		flex: 1;
		background: #f9fafb;
		overflow-y: auto;
		padding: 1rem;
		border: 1px solid #e5e7eb;
		border-radius: 0.5rem;
	}

	button {
		margin-top: 1rem;
		padding: 0.5rem 1rem;
		background: #3b82f6;
		color: white;
		border: none;
		border-radius: 0.25rem;
		cursor: pointer;
	}
</style>
