/**
 * Adaptateur en memoire pour les tests.
 * Implemente la meme interface IDatabase que PocketBase.
 */

import type { IDatabase, QueryOptions } from './interface';
import type { PaginatedResult } from '$lib/types/entities';
import { ServiceError } from '$lib/types/errors';

interface StoredRecord {
	id: string;
	[key: string]: unknown;
}

export class MemoryAdapter implements IDatabase {
	private collections: Map<string, StoredRecord[]> = new Map();
	private authenticated = false;
	private idCounter = 0;

	private getCollection(name: string): StoredRecord[] {
		if (!this.collections.has(name)) {
			this.collections.set(name, []);
		}
		return this.collections.get(name)!;
	}

	private generateId(): string {
		this.idCounter++;
		return `test_${this.idCounter.toString().padStart(6, '0')}`;
	}

	async getOne<T>(collection: string, id: string): Promise<T | null> {
		const items = this.getCollection(collection);
		const found = items.find((item) => item.id === id);
		return (found as T) ?? null;
	}

	async getList<T>(collection: string, options?: QueryOptions): Promise<PaginatedResult<T>> {
		const items = this.getCollection(collection);
		const limit = options?.limit ?? 50;
		const offset = options?.offset ?? 0;
		const page = Math.floor(offset / limit) + 1;

		const sliced = items.slice(offset, offset + limit);

		return {
			items: sliced as T[],
			total: items.length,
			page,
			perPage: limit
		};
	}

	async getFirstMatch<T>(collection: string, _filter: string): Promise<T | null> {
		const items = this.getCollection(collection);
		return (items[0] as T) ?? null;
	}

	async create<T>(collection: string, data: Partial<T>): Promise<T> {
		const items = this.getCollection(collection);
		const now = new Date().toISOString();
		const record = {
			id: this.generateId(),
			...data,
			created: now,
			updated: now
		} as StoredRecord;
		items.push(record);
		return record as T;
	}

	async update<T>(collection: string, id: string, data: Partial<T>): Promise<T> {
		const items = this.getCollection(collection);
		const index = items.findIndex((item) => item.id === id);
		if (index === -1) {
			throw ServiceError.notFound(collection, id);
		}
		const updated = {
			...items[index],
			...data,
			updated: new Date().toISOString()
		};
		items[index] = updated;
		return updated as T;
	}

	async delete(collection: string, id: string): Promise<void> {
		const items = this.getCollection(collection);
		const index = items.findIndex((item) => item.id === id);
		if (index === -1) {
			throw ServiceError.notFound(collection, id);
		}
		items.splice(index, 1);
	}

	async authWithPassword(
		_collection: string,
		_email: string,
		_password: string
	): Promise<{ token: string; record: Record<string, unknown> }> {
		this.authenticated = true;
		return {
			token: 'test_token_' + this.generateId(),
			record: { id: this.generateId(), email: _email }
		};
	}

	isAuthenticated(): boolean {
		return this.authenticated;
	}

	/** Reset toutes les donnees (utile entre les tests) */
	reset(): void {
		this.collections.clear();
		this.authenticated = false;
		this.idCounter = 0;
	}
}
