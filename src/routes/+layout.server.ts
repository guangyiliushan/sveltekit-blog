import type { LayoutServerLoad } from './$types';

// export const prerender = true;
// export const trailingSlash = 'always';

export const load = (async (event) => {
    return { 
        user: event.locals.user,
        isAdmin: event.locals.user?.username === "guangyiliushan",  
     };
}) satisfies LayoutServerLoad;