import { describe, it, expect, beforeEach } from 'vitest';
import { StudentService } from '$lib/server/services/student.service';
import { MemoryAdapter } from '$lib/server/db/memory.adapter';
import { ServiceError } from '$lib/types/errors';

describe('StudentService', () => {
	let db: MemoryAdapter;
	let service: StudentService;

	beforeEach(() => {
		db = new MemoryAdapter();
		service = new StudentService(db);
	});

	const validStudent = {
		nom: 'Dupont',
		prenom: 'Jean',
		email: 'jean.dupont@email.com',
		etablissement: 'Lycee Victor Hugo',
		niveau: 'terminale' as const,
		campus: 'paris'
	};

	describe('create', () => {
		it('should create a student with normalized email', async () => {
			const student = await service.create({
				...validStudent,
				email: 'Jean.DUPONT@Email.com'
			});

			expect(student.id).toBeDefined();
			expect(student.email).toBe('jean.dupont@email.com');
			expect(student.nom).toBe('Dupont');
		});

		it('should reject duplicate email', async () => {
			await service.create(validStudent);

			await expect(service.create(validStudent)).rejects.toThrow(ServiceError);
			await expect(service.create(validStudent)).rejects.toThrow(
				'Un etudiant avec cet email existe deja'
			);
		});
	});

	describe('getById', () => {
		it('should return a student when ID exists', async () => {
			const created = await service.create(validStudent);
			const found = await service.getById(created.id);

			expect(found).not.toBeNull();
			expect(found?.nom).toBe('Dupont');
		});

		it('should return null when ID does not exist', async () => {
			const found = await service.getById('nonexistent');
			expect(found).toBeNull();
		});
	});

	describe('update', () => {
		it('should update student data', async () => {
			const created = await service.create(validStudent);
			const updated = await service.update(created.id, { nom: 'Martin' });

			expect(updated.nom).toBe('Martin');
		});

		it('should throw ServiceError when student not found', async () => {
			await expect(service.update('nonexistent', { nom: 'Martin' })).rejects.toThrow(
				ServiceError
			);
		});

		it('should normalize email on update', async () => {
			const created = await service.create(validStudent);
			const updated = await service.update(created.id, {
				email: 'NEW.Email@Test.COM'
			});

			expect(updated.email).toBe('new.email@test.com');
		});
	});

	describe('delete', () => {
		it('should delete an existing student', async () => {
			const created = await service.create(validStudent);
			await service.delete(created.id);

			const found = await service.getById(created.id);
			expect(found).toBeNull();
		});

		it('should throw ServiceError when student not found', async () => {
			await expect(service.delete('nonexistent')).rejects.toThrow(ServiceError);
		});
	});

	describe('search', () => {
		it('should reject queries shorter than 2 characters', async () => {
			await expect(service.search('paris', 'a')).rejects.toThrow(
				'La recherche doit contenir au moins 2 caracteres'
			);
		});

		it('should reject queries longer than 100 characters', async () => {
			const longQuery = 'a'.repeat(101);
			await expect(service.search('paris', longQuery)).rejects.toThrow(
				'La recherche ne peut pas depasser 100 caracteres'
			);
		});

		it('should accept valid search queries', async () => {
			const result = await service.search('paris', 'Dupont');
			expect(result).toBeDefined();
			expect(result.items).toBeInstanceOf(Array);
		});
	});
});
