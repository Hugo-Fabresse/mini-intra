import { describe, it, expect, vi } from 'vitest';
import { setSessionCookie, getSessionToken, clearSession } from '$lib/server/auth/session';

function createMockCookies() {
	const store = new Map<string, string>();
	return {
		get: vi.fn((name: string) => store.get(name)),
		set: vi.fn((name: string, value: string) => {
			store.set(name, value);
		}),
		delete: vi.fn((name: string) => {
			store.delete(name);
		}),
		store
	};
}

describe('session', () => {
	describe('setSessionCookie', () => {
		it('should set a cookie with correct options in secure mode', () => {
			const cookies = createMockCookies();
			setSessionCookie(cookies as unknown as Parameters<typeof setSessionCookie>[0], 'test_token', { secure: true });

			expect(cookies.set).toHaveBeenCalledWith('session_token', 'test_token', {
				path: '/',
				httpOnly: true,
				secure: true,
				sameSite: 'strict',
				maxAge: 14 * 24 * 60 * 60
			});
		});

		it('should use lax sameSite when not secure', () => {
			const cookies = createMockCookies();
			setSessionCookie(cookies as unknown as Parameters<typeof setSessionCookie>[0], 'test_token', { secure: false });

			expect(cookies.set).toHaveBeenCalledWith('session_token', 'test_token', expect.objectContaining({
				secure: false,
				sameSite: 'lax'
			}));
		});
	});

	describe('getSessionToken', () => {
		it('should return the session token', () => {
			const cookies = createMockCookies();
			cookies.store.set('session_token', 'my_token');

			const token = getSessionToken(cookies as unknown as Parameters<typeof getSessionToken>[0]);
			expect(token).toBe('my_token');
		});

		it('should return undefined when no session', () => {
			const cookies = createMockCookies();

			const token = getSessionToken(cookies as unknown as Parameters<typeof getSessionToken>[0]);
			expect(token).toBeUndefined();
		});
	});

	describe('clearSession', () => {
		it('should delete the session cookie', () => {
			const cookies = createMockCookies();
			clearSession(cookies as unknown as Parameters<typeof clearSession>[0]);

			expect(cookies.delete).toHaveBeenCalledWith('session_token', { path: '/' });
		});
	});
});
