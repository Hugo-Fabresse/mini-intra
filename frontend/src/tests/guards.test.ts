import { describe, it, expect, vi } from 'vitest';

// Mock SvelteKit redirect
vi.mock('@sveltejs/kit', () => ({
	redirect: (status: number, location: string) => {
		throw { status, location };
	}
}));

import { requireAuth, requireAdmin, requireCampusAccess } from '$lib/server/auth/guards';

function createMockEvent(user: Record<string, unknown> | null) {
	return {
		locals: { user },
		url: new URL('http://localhost/test'),
		cookies: {},
		request: new Request('http://localhost/test')
	} as unknown as Parameters<typeof requireAuth>[0];
}

describe('requireAuth', () => {
	it('should not throw when user is authenticated', () => {
		const event = createMockEvent({ id: '1', role: 'staff', campus: 'paris' });
		expect(() => requireAuth(event)).not.toThrow();
	});

	it('should redirect to login when user is null', () => {
		const event = createMockEvent(null);
		try {
			requireAuth(event);
			expect.unreachable('should have thrown');
		} catch (e) {
			const err = e as { status: number; location: string };
			expect(err.status).toBe(303);
			expect(err.location).toBe('/auth/login');
		}
	});
});

describe('requireAdmin', () => {
	it('should not throw for admin users', () => {
		const event = createMockEvent({ id: '1', role: 'admin', campus: 'paris' });
		expect(() => requireAdmin(event)).not.toThrow();
	});

	it('should redirect for staff users', () => {
		const event = createMockEvent({ id: '1', role: 'staff', campus: 'paris' });
		try {
			requireAdmin(event);
			expect.unreachable('should have thrown');
		} catch (e) {
			const err = e as { status: number; location: string };
			expect(err.status).toBe(303);
			expect(err.location).toBe('/');
		}
	});

	it('should redirect for unauthenticated users', () => {
		const event = createMockEvent(null);
		try {
			requireAdmin(event);
			expect.unreachable('should have thrown');
		} catch (e) {
			const err = e as { status: number; location: string };
			expect(err.status).toBe(303);
			expect(err.location).toBe('/auth/login');
		}
	});
});

describe('requireCampusAccess', () => {
	it('should allow access to matching campus', () => {
		const event = createMockEvent({ id: '1', role: 'staff', campus: 'paris' });
		expect(() => requireCampusAccess(event, 'paris')).not.toThrow();
	});

	it('should allow admin to access any campus', () => {
		const event = createMockEvent({ id: '1', role: 'admin', campus: 'paris' });
		expect(() => requireCampusAccess(event, 'lyon')).not.toThrow();
	});

	it('should redirect staff from wrong campus', () => {
		const event = createMockEvent({ id: '1', role: 'staff', campus: 'paris' });
		try {
			requireCampusAccess(event, 'lyon');
			expect.unreachable('should have thrown');
		} catch (e) {
			const err = e as { status: number; location: string };
			expect(err.status).toBe(303);
			expect(err.location).toBe('/');
		}
	});
});
