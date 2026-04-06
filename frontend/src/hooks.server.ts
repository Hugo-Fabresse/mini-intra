/**
 * Hook serveur SvelteKit.
 * Execute sur chaque requete : auth, securite headers.
 */

import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { getSessionToken } from '$lib/server/auth/session';
import { createRawPb } from '$lib/server/db/index';

const securityHeaders: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);

	response.headers.set('X-Frame-Options', 'DENY');
	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
	response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

	if (event.url.protocol === 'https:') {
		response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
	}

	return response;
};

const authHook: Handle = async ({ event, resolve }) => {
	const token = getSessionToken(event.cookies);

	if (token) {
		try {
			const pb = createRawPb();
			pb.authStore.save(token);

			// Valider et rafraichir le token
			const authData = await pb.collection('users').authRefresh();
			const record = authData.record;

			event.locals.user = {
				id: record.id,
				email: record.email ?? '',
				name: (record.name as string) ?? '',
				campus: (record.campus as string) ?? '',
				role: (record.role as 'admin' | 'staff') ?? 'staff',
				avatar: (record.avatar as string) ?? '',
				created: record.created ?? '',
				updated: record.updated ?? ''
			};
		} catch {
			// Token invalide ou expire — on nettoie
			event.locals.user = null;
		}
	} else {
		event.locals.user = null;
	}

	return resolve(event);
};

export const handle = sequence(securityHeaders, authHook);
