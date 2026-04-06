import { describe, it, expect } from 'vitest';
import { ServiceError } from '$lib/types/errors';

describe('ServiceError', () => {
	it('should create a not found error', () => {
		const err = ServiceError.notFound('Student', '123');
		expect(err.code).toBe('NOT_FOUND');
		expect(err.statusCode).toBe(404);
		expect(err.message).toContain('123');
		expect(err.name).toBe('ServiceError');
	});

	it('should create an unauthorized error', () => {
		const err = ServiceError.unauthorized();
		expect(err.code).toBe('UNAUTHORIZED');
		expect(err.statusCode).toBe(401);
	});

	it('should create a forbidden error', () => {
		const err = ServiceError.forbidden();
		expect(err.code).toBe('FORBIDDEN');
		expect(err.statusCode).toBe(403);
	});

	it('should create a validation error', () => {
		const err = ServiceError.validation('Email invalide');
		expect(err.code).toBe('VALIDATION');
		expect(err.statusCode).toBe(400);
		expect(err.message).toBe('Email invalide');
	});

	it('should create an internal error', () => {
		const err = ServiceError.internal();
		expect(err.code).toBe('INTERNAL');
		expect(err.statusCode).toBe(500);
	});

	it('should be an instance of Error', () => {
		const err = ServiceError.notFound('Test', '1');
		expect(err).toBeInstanceOf(Error);
		expect(err).toBeInstanceOf(ServiceError);
	});
});
