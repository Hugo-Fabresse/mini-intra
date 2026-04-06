import type { User } from '$lib/types/entities';

declare global {
	namespace App {
		interface Locals {
			user: User | null;
			token: string | null;
		}
		interface Error {
			code?: string;
			message: string;
		}
	}
}

export {};
