import { describe, it, expect, beforeEach } from 'vitest';
import { MemoryAdapter } from '$lib/server/db/memory.adapter';
import { ServiceError } from '$lib/types/errors';

describe('MemoryAdapter (IDatabase)', () => {
	let db: MemoryAdapter;

	beforeEach(() => {
		db = new MemoryAdapter();
	});

	describe('create', () => {
		it('should create a record with auto-generated id', async () => {
			const record = await db.create<{ id: string; name: string }>('test', { name: 'Alice' });
			expect(record.id).toBeDefined();
			expect(record.id).toMatch(/^test_/);
			expect(record.name).toBe('Alice');
		});

		it('should add created and updated timestamps', async () => {
			const record = await db.create<{ id: string; created: string; updated: string }>('test', {});
			expect(record.created).toBeDefined();
			expect(record.updated).toBeDefined();
		});
	});

	describe('getOne', () => {
		it('should return a record by id', async () => {
			const created = await db.create<{ id: string; name: string }>('test', { name: 'Bob' });
			const found = await db.getOne<{ id: string; name: string }>('test', created.id);
			expect(found?.name).toBe('Bob');
		});

		it('should return null for nonexistent id', async () => {
			const found = await db.getOne('test', 'nonexistent');
			expect(found).toBeNull();
		});
	});

	describe('getList', () => {
		it('should return paginated results', async () => {
			for (let i = 0; i < 5; i++) {
				await db.create('test', { index: i });
			}
			const result = await db.getList('test', { limit: 2 });
			expect(result.items.length).toBe(2);
			expect(result.total).toBe(5);
			expect(result.perPage).toBe(2);
		});

		it('should return empty for nonexistent collection', async () => {
			const result = await db.getList('nonexistent');
			expect(result.items).toEqual([]);
			expect(result.total).toBe(0);
		});
	});

	describe('update', () => {
		it('should update a record', async () => {
			const created = await db.create<{ id: string; name: string }>('test', { name: 'Old' });
			const updated = await db.update<{ id: string; name: string }>('test', created.id, { name: 'New' });
			expect(updated.name).toBe('New');
		});

		it('should throw for nonexistent record', async () => {
			await expect(db.update('test', 'nonexistent', {})).rejects.toThrow(ServiceError);
		});
	});

	describe('delete', () => {
		it('should delete a record', async () => {
			const created = await db.create<{ id: string }>('test', {});
			await db.delete('test', created.id);
			const found = await db.getOne('test', created.id);
			expect(found).toBeNull();
		});

		it('should throw for nonexistent record', async () => {
			await expect(db.delete('test', 'nonexistent')).rejects.toThrow(ServiceError);
		});
	});

	describe('auth', () => {
		it('should not be authenticated by default', () => {
			expect(db.isAuthenticated()).toBe(false);
		});

		it('should be authenticated after authWithPassword', async () => {
			await db.authWithPassword('users', 'test@test.com', 'password');
			expect(db.isAuthenticated()).toBe(true);
		});

		it('should return a token', async () => {
			const result = await db.authWithPassword('users', 'test@test.com', 'password');
			expect(result.token).toBeDefined();
			expect(result.token).toMatch(/^test_token_/);
		});
	});

	describe('reset', () => {
		it('should clear all data', async () => {
			await db.create('test', { name: 'data' });
			await db.authWithPassword('users', 'test@test.com', 'password');
			db.reset();

			const result = await db.getList('test');
			expect(result.total).toBe(0);
			expect(db.isAuthenticated()).toBe(false);
		});
	});
});
