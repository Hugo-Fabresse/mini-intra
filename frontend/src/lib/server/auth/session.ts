/**
 * Gestion des sessions via cookies HTTPOnly.
 */

import type { Cookies } from '@sveltejs/kit';

const SESSION_COOKIE = 'session_token';
const SESSION_MAX_AGE = 14 * 24 * 60 * 60; // 14 jours

interface SessionOptions {
	secure: boolean;
}

export function setSessionCookie(cookies: Cookies, token: string, options: SessionOptions): void {
	cookies.set(SESSION_COOKIE, token, {
		path: '/',
		httpOnly: true,
		secure: options.secure,
		sameSite: options.secure ? 'strict' : 'lax',
		maxAge: SESSION_MAX_AGE
	});
}

export function getSessionToken(cookies: Cookies): string | undefined {
	return cookies.get(SESSION_COOKIE);
}

export function clearSession(cookies: Cookies): void {
	cookies.delete(SESSION_COOKIE, { path: '/' });
}
