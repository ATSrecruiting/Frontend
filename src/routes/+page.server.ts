import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';





export const load: PageServerLoad = async ({ locals }) => {
    if (locals.user?.isAuthenticated) {
        throw redirect(303, '/dashboard');
    } else {
        throw redirect(303, '/login');
    }
}