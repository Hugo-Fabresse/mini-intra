import { describe, it, expect, vi, afterEach } from 'vitest';
import { formatDate, isInFuture, isInPast, daysBetween } from '$lib/utils/date';

describe('formatDate', () => {
	it('should format a date string in French locale', () => {
		const result = formatDate('2026-03-15T10:00:00Z');
		expect(result).toMatch(/15/);
		expect(result).toMatch(/03|mars/i);
		expect(result).toMatch(/2026/);
	});

	it('should format a Date object', () => {
		const result = formatDate(new Date('2026-01-01'));
		expect(result).toMatch(/01|janvier/i);
	});
});

describe('isInFuture', () => {
	afterEach(() => {
		vi.useRealTimers();
	});

	it('should return true for a future date', () => {
		vi.setSystemTime(new Date('2026-01-01'));
		expect(isInFuture('2026-06-01')).toBe(true);
	});

	it('should return false for a past date', () => {
		vi.setSystemTime(new Date('2026-06-01'));
		expect(isInFuture('2026-01-01')).toBe(false);
	});
});

describe('isInPast', () => {
	afterEach(() => {
		vi.useRealTimers();
	});

	it('should return true for a past date', () => {
		vi.setSystemTime(new Date('2026-06-01'));
		expect(isInPast('2026-01-01')).toBe(true);
	});

	it('should return false for a future date', () => {
		vi.setSystemTime(new Date('2026-01-01'));
		expect(isInPast('2026-06-01')).toBe(false);
	});
});

describe('daysBetween', () => {
	it('should calculate days between two dates', () => {
		expect(daysBetween('2026-01-01', '2026-01-10')).toBe(9);
	});

	it('should return negative for inverted dates', () => {
		expect(daysBetween('2026-01-10', '2026-01-01')).toBe(-9);
	});

	it('should return 0 for the same date', () => {
		expect(daysBetween('2026-01-01', '2026-01-01')).toBe(0);
	});
});
