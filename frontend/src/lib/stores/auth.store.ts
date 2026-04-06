/**
 * Store d'authentification.
 * Gere l'etat de connexion cote client.
 */

import { writable } from 'svelte/store';
import type { User } from '$lib/types/entities';

interface AuthState {
	user: User | null;
	loading: boolean;
	error: string | null;
}

function createAuthStore() {
	const { subscribe, set, update } = writable<AuthState>({
		user: null,
		loading: false,
		error: null
	});

	return {
		subscribe,
		setUser: (user: User | null) => {
			update((state) => ({ ...state, user, error: null }));
		},
		setLoading: (loading: boolean) => {
			update((state) => ({ ...state, loading }));
		},
		setError: (error: string) => {
			update((state) => ({ ...state, error, loading: false }));
		},
		reset: () => {
			set({ user: null, loading: false, error: null });
		}
	};
}

export const authStore = createAuthStore();
