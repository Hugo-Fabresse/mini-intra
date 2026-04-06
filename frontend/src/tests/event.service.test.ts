import { describe, it, expect, beforeEach } from 'vitest';
import { EventService } from '$lib/server/services/event.service';
import { MemoryAdapter } from '$lib/server/db/memory.adapter';
import { ServiceError } from '$lib/types/errors';

describe('EventService', () => {
	let db: MemoryAdapter;
	let service: EventService;

	beforeEach(() => {
		db = new MemoryAdapter();
		service = new EventService(db);
	});

	const validEvent = {
		titre: 'Stage Decouverte',
		description: 'Un stage de decouverte de la programmation',
		date_debut: '2026-06-01T09:00:00Z',
		date_fin: '2026-06-05T17:00:00Z',
		campus: 'paris',
		places_max: 20,
		type: 'stage' as const
	};

	describe('create', () => {
		it('should create an event with created_by', async () => {
			const event = await service.create(validEvent, 'user_123');

			expect(event.id).toBeDefined();
			expect(event.titre).toBe('Stage Decouverte');
			expect(event.created_by).toBe('user_123');
		});
	});

	describe('getById', () => {
		it('should return an event when ID exists', async () => {
			const created = await service.create(validEvent, 'user_123');
			const found = await service.getById(created.id);

			expect(found).not.toBeNull();
			expect(found?.titre).toBe('Stage Decouverte');
		});

		it('should return null when ID does not exist', async () => {
			const found = await service.getById('nonexistent');
			expect(found).toBeNull();
		});
	});

	describe('update', () => {
		it('should update event data', async () => {
			const created = await service.create(validEvent, 'user_123');
			const updated = await service.update(created.id, { titre: 'Stage Avance' });

			expect(updated.titre).toBe('Stage Avance');
		});

		it('should throw ServiceError when event not found', async () => {
			await expect(
				service.update('nonexistent', { titre: 'test' })
			).rejects.toThrow(ServiceError);
		});
	});

	describe('delete', () => {
		it('should delete an existing event', async () => {
			const created = await service.create(validEvent, 'user_123');
			await service.delete(created.id);

			const found = await service.getById(created.id);
			expect(found).toBeNull();
		});

		it('should throw ServiceError when event not found', async () => {
			await expect(service.delete('nonexistent')).rejects.toThrow(ServiceError);
		});
	});

	describe('list', () => {
		it('should return events for a campus', async () => {
			await service.create(validEvent, 'user_1');
			await service.create({ ...validEvent, titre: 'Event 2' }, 'user_2');
			await service.create({ ...validEvent, campus: 'lyon', titre: 'Event Lyon' }, 'user_3');

			const result = await service.list('paris');
			expect(result).toBeDefined();
			expect(result.items).toBeInstanceOf(Array);
		});
	});
});
