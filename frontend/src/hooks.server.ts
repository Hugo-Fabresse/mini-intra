/**
 * Hook serveur SvelteKit.
 * Execute sur chaque requete : auth, securite headers.
 */

import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { getSessionToken } from '$lib/server/auth/session';
import PocketBase from 'pocketbase';
import { env as privateEnv } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';

const PB_URL = privateEnv.PB_INTERNAL_URL ?? publicEnv.PUBLIC_POCKETBASE_URL ?? 'http://localhost:8090';

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
			const pb = new PocketBase(PB_URL);
			pb.authStore.save(token);

			if (pb.authStore.isValid) {
				const authData = await pb.collection('users').authRefresh();
				const record = authData.record;

				event.locals.token = pb.authStore.token;
				event.locals.user = {
					id: record.id,
					email: (record.email as string) ?? '',
					name: (record.name as string) ?? '',
					campus: (record.campus as string) ?? '',
					role: ((record.role as string) ?? 'staff') as 'admin' | 'staff',
					avatar: (record.avatar as string) ?? '',
					created: (record.created as string) ?? '',
					updated: (record.updated as string) ?? ''
				};
			} else {
				event.locals.user = null;
				event.locals.token = null;
			}
		} catch {
			event.locals.user = null;
			event.locals.token = null;
		}
	} else {
		event.locals.user = null;
		event.locals.token = null;
	}

	return resolve(event);
};

export const handle = sequence(securityHeaders, authHook);
