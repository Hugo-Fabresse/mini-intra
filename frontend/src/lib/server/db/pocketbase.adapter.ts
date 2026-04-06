/**
 * Adaptateur PocketBase implementant IDatabase.
 * Encapsule tous les appels au SDK PocketBase.
 */

import PocketBase from 'pocketbase';
import type { IDatabase, QueryOptions } from './interface';
import type { PaginatedResult } from '$lib/types/entities';
import { ServiceError } from '$lib/types/errors';

export class PocketBaseAdapter implements IDatabase {
	constructor(private readonly pb: PocketBase) {}

	async getOne<T>(collection: string, id: string): Promise<T | null> {
		try {
			const record = await this.pb.collection(collection).getOne(id);
			return record as T;
		} catch (err: unknown) {
			if (isPocketBaseNotFound(err)) return null;
			throw ServiceError.internal('Erreur lors de la lecture');
		}
	}

	async getList<T>(collection: string, options?: QueryOptions): Promise<PaginatedResult<T>> {
		const page = options?.offset ? Math.floor(options.offset / (options?.limit ?? 50)) + 1 : 1;
		const perPage = options?.limit ?? 50;

		const result = await this.pb.collection(collection).getList(page, perPage, {
			filter: options?.filter,
			sort: options?.sort,
			expand: options?.expand?.join(','),
			fields: options?.fields?.join(',')
		});

		return {
			items: result.items as T[],
			total: result.totalItems,
			page: result.page,
			perPage: result.perPage
		};
	}

	async getFirstMatch<T>(collection: string, filter: string): Promise<T | null> {
		try {
			const record = await this.pb.collection(collection).getFirstListItem(filter);
			return record as T;
		} catch (err: unknown) {
			if (isPocketBaseNotFound(err)) return null;
			throw ServiceError.internal('Erreur lors de la recherche');
		}
	}

	async create<T>(collection: string, data: Partial<T>): Promise<T> {
		const record = await this.pb.collection(collection).create(data);
		return record as T;
	}

	async update<T>(collection: string, id: string, data: Partial<T>): Promise<T> {
		const record = await this.pb.collection(collection).update(id, data);
		return record as T;
	}

	async delete(collection: string, id: string): Promise<void> {
		await this.pb.collection(collection).delete(id);
	}

	async authWithPassword(
		collection: string,
		email: string,
		password: string
	): Promise<{ token: string; record: Record<string, unknown> }> {
		const result = await this.pb.collection(collection).authWithPassword(email, password);
		return {
			token: result.token,
			record: result.record as Record<string, unknown>
		};
	}

	isAuthenticated(): boolean {
		return this.pb.authStore.isValid;
	}
}

function isPocketBaseNotFound(err: unknown): boolean {
	return (
		typeof err === 'object' &&
		err !== null &&
		'status' in err &&
		(err as { status: number }).status === 404
	);
}
