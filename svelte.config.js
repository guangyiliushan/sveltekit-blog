import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: [vitePreprocess(), mdsvex()],

	kit: {
		adapter: adapter(
			{
				fallback: '200.html'
			}
		),
		prerender: {
			// 排除包含表单操作的页面
			entries: [ '/login','/lucia','/blog', '/blog/create'],
			handleHttpError: ({ path, referrer, message }) => {
				// 处理错误，例如记录日志
				console.error(`Error prerendering ${path} (linked from ${referrer}): ${message}`);
				// 可以选择忽略错误，继续构建
				return;
			}
		}
	},

	extensions: ['.svelte', '.svx']
};

export default config;
