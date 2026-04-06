import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { loginSchema } from '$lib/schemas/auth.schema';
import { setSessionCookie } from '$lib/server/auth/session';
import { createRawPb } from '$lib/server/db/index';

export const load: PageServerLoad = async ({ locals }) => {
	// Deja connecte ? Rediriger vers le dashboard
	if (locals.user) {
		throw redirect(303, '/app/dashboard');
	}
	return {};
};

export const actions: Actions = {
	default: async ({ request, cookies, url }) => {
		const formData = await request.formData();
		const email = formData.get('email');
		const password = formData.get('password');

		const result = loginSchema.safeParse({ email, password });
		if (!result.success) {
			const firstError = result.error.errors[0]?.message ?? 'Donnees invalides';
			return fail(400, { error: firstError });
		}

		try {
			const pb = createRawPb();
			await pb.collection('users').authWithPassword(result.data.email, result.data.password);

			const token = pb.authStore.token;
			setSessionCookie(cookies, token, {
				secure: url.protocol === 'https:'
			});

			throw redirect(303, '/app/dashboard');
		} catch (err) {
			// SvelteKit redirect throws — on le laisse passer
			if (err && typeof err === 'object' && 'status' in err && (err as { status: number }).status === 303) {
				throw err;
			}
			// Ne jamais reveler si c'est l'email ou le mot de passe qui est faux
			return fail(401, { error: 'Identifiants invalides' });
		}
	}
};
