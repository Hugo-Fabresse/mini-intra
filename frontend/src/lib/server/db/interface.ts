/**
 * Interface abstraite de la base de donnees.
 *
 * Tout le code applicatif utilise cette interface, jamais l'adaptateur concret.
 * Cela permet de :
 * - Tester avec un adaptateur mock en memoire
 * - Migrer de PocketBase vers Supabase sans toucher au code metier
 * - Faire coexister les deux pendant la migration
 */

import type { PaginatedResult } from '$lib/types/entities';

export interface QueryOptions {
	filter?: string;
	sort?: string;
	limit?: number;
	offset?: number;
	expand?: string[];
	fields?: string[];
}

export interface IDatabase {
	// Lecture
	getOne<T>(collection: string, id: string): Promise<T | null>;
	getList<T>(collection: string, options?: QueryOptions): Promise<PaginatedResult<T>>;
	getFirstMatch<T>(collection: string, filter: string): Promise<T | null>;

	// Ecriture
	create<T>(collection: string, data: Partial<T>): Promise<T>;
	update<T>(collection: string, id: string, data: Partial<T>): Promise<T>;
	delete(collection: string, id: string): Promise<void>;

	// Auth
	authWithPassword(
		collection: string,
		email: string,
		password: string
	): Promise<{ token: string; record: Record<string, unknown> }>;
	isAuthenticated(): boolean;
}
