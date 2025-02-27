import type { LayoutServerLoad } from './$types';

export const load = (async (event) => {
    return { 
        user: event.locals.user,
        isAdmin: event.locals.user?.username === "guangyiliushan",  
     };
}) satisfies LayoutServerLoad;