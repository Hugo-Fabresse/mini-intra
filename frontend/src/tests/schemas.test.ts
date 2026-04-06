import { describe, it, expect } from 'vitest';
import { studentSchema } from '$lib/schemas/student.schema';
import { eventSchema } from '$lib/schemas/event.schema';
import { loginSchema } from '$lib/schemas/auth.schema';

describe('studentSchema', () => {
	const validStudent = {
		nom: 'Dupont',
		prenom: 'Jean',
		email: 'jean@email.com',
		etablissement: 'Lycee Victor Hugo',
		niveau: 'terminale',
		campus: 'paris'
	};

	it('should accept valid student data', () => {
		const result = studentSchema.safeParse(validStudent);
		expect(result.success).toBe(true);
	});

	it('should reject missing nom', () => {
		const result = studentSchema.safeParse({ ...validStudent, nom: '' });
		expect(result.success).toBe(false);
	});

	it('should reject invalid email', () => {
		const result = studentSchema.safeParse({ ...validStudent, email: 'not-an-email' });
		expect(result.success).toBe(false);
	});

	it('should reject invalid niveau', () => {
		const result = studentSchema.safeParse({ ...validStudent, niveau: 'bac+1' });
		expect(result.success).toBe(false);
	});

	it('should normalize email to lowercase', () => {
		const result = studentSchema.safeParse({ ...validStudent, email: 'Jean@Email.COM' });
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.email).toBe('jean@email.com');
		}
	});

	it('should trim whitespace from fields', () => {
		const result = studentSchema.safeParse({ ...validStudent, nom: '  Dupont  ' });
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.nom).toBe('Dupont');
		}
	});

	it('should reject nom exceeding 100 characters', () => {
		const result = studentSchema.safeParse({ ...validStudent, nom: 'a'.repeat(101) });
		expect(result.success).toBe(false);
	});
});

describe('eventSchema', () => {
	const validEvent = {
		titre: 'Stage decouverte',
		description: 'Un stage de decouverte',
		date_debut: '2026-06-01T09:00:00Z',
		date_fin: '2026-06-05T17:00:00Z',
		campus: 'paris',
		places_max: 20,
		type: 'stage'
	};

	it('should accept valid event data', () => {
		const result = eventSchema.safeParse(validEvent);
		expect(result.success).toBe(true);
	});

	it('should reject end date before start date', () => {
		const result = eventSchema.safeParse({
			...validEvent,
			date_debut: '2026-06-05T17:00:00Z',
			date_fin: '2026-06-01T09:00:00Z'
		});
		expect(result.success).toBe(false);
	});

	it('should reject 0 places', () => {
		const result = eventSchema.safeParse({ ...validEvent, places_max: 0 });
		expect(result.success).toBe(false);
	});

	it('should reject more than 500 places', () => {
		const result = eventSchema.safeParse({ ...validEvent, places_max: 501 });
		expect(result.success).toBe(false);
	});

	it('should reject invalid type', () => {
		const result = eventSchema.safeParse({ ...validEvent, type: 'workshop' });
		expect(result.success).toBe(false);
	});
});

describe('loginSchema', () => {
	it('should accept valid credentials', () => {
		const result = loginSchema.safeParse({
			email: 'user@epitech.eu',
			password: 'monmotdepasse12'
		});
		expect(result.success).toBe(true);
	});

	it('should reject password shorter than 12 characters', () => {
		const result = loginSchema.safeParse({
			email: 'user@epitech.eu',
			password: 'short'
		});
		expect(result.success).toBe(false);
	});

	it('should reject invalid email', () => {
		const result = loginSchema.safeParse({
			email: 'not-an-email',
			password: 'monmotdepasse12'
		});
		expect(result.success).toBe(false);
	});

	it('should normalize email to lowercase', () => {
		const result = loginSchema.safeParse({
			email: 'User@Epitech.EU',
			password: 'monmotdepasse12'
		});
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.email).toBe('user@epitech.eu');
		}
	});
});
