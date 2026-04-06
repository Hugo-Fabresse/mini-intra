/**
 * Gardes de route pour l'authentification.
 * Verifient les droits d'acces cote serveur sur chaque requete.
 */

import { redirect } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

/** Verifie que l'utilisateur est authentifie. Redirige vers /auth/login sinon. */
export function requireAuth(event: RequestEvent): void {
	const user = event.locals.user;
	if (!user) {
		throw redirect(303, '/auth/login');
	}
}

/** Verifie que l'utilisateur a le role admin. Redirige vers / sinon. */
export function requireAdmin(event: RequestEvent): void {
	requireAuth(event);
	const user = event.locals.user;
	if (user?.role !== 'admin') {
		throw redirect(303, '/');
	}
}

/** Verifie que l'utilisateur a acces au campus specifie. */
export function requireCampusAccess(event: RequestEvent, campus: string): void {
	requireAuth(event);
	const user = event.locals.user;
	if (user?.role !== 'admin' && user?.campus !== campus) {
		throw redirect(303, '/');
	}
}
