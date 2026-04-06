import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { clearSession } from '$lib/server/auth/session';

export const actions: Actions = {
	default: async ({ cookies }) => {
		clearSession(cookies);
		throw redirect(303, '/auth/login');
	}
};
