declare module 'mdsvex' {
  export default function (options?: any): Promise<{ code: string }>;
}
declare module '*.md' {
    import { SvelteComponentTyped } from'svelte';
    const component: SvelteComponentTyped<{ [key: string]: any }, {}, {}>;
    export default component;
}