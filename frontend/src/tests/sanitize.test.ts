import { describe, it, expect } from 'vitest';
import {
	escapeHtml,
	escapePbFilter,
	pbFilter,
	sanitizeFilename,
	normalizeEmail
} from '$lib/utils/sanitize';

describe('escapeHtml', () => {
	it('should escape HTML special characters', () => {
		expect(escapeHtml('<script>alert("xss")</script>')).toBe(
			'&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;'
		);
	});

	it('should escape single quotes', () => {
		expect(escapeHtml("l'apostrophe")).toBe('l&#x27;apostrophe');
	});

	it('should return empty string for empty input', () => {
		expect(escapeHtml('')).toBe('');
	});

	it('should not modify safe strings', () => {
		expect(escapeHtml('Hello World 123')).toBe('Hello World 123');
	});

	it('should handle all entity types', () => {
		expect(escapeHtml('&<>"\'/')).toBe('&amp;&lt;&gt;&quot;&#x27;&#x2F;');
	});
});

describe('escapePbFilter', () => {
	it('should escape single quotes', () => {
		expect(escapePbFilter("O'Brien")).toBe("O\\'Brien");
	});

	it('should escape backslashes', () => {
		expect(escapePbFilter('path\\to\\file')).toBe('path\\\\to\\\\file');
	});

	it('should handle combined escaping', () => {
		expect(escapePbFilter("test\\'value")).toBe("test\\\\\\'value");
	});

	it('should not modify safe strings', () => {
		expect(escapePbFilter('hello world')).toBe('hello world');
	});
});

describe('pbFilter', () => {
	it('should build a safe filter with escaped value', () => {
		expect(pbFilter('nom', '=', 'Dupont')).toBe("nom = 'Dupont'");
	});

	it('should escape dangerous values', () => {
		expect(pbFilter('nom', '=', "O'Brien")).toBe("nom = 'O\\'Brien'");
	});

	it('should work with the ~ operator', () => {
		expect(pbFilter('nom', '~', 'Dup')).toBe("nom ~ 'Dup'");
	});
});

describe('sanitizeFilename', () => {
	it('should remove special characters', () => {
		expect(sanitizeFilename('hello world!@#$.pdf')).toBe('hello_world_____pdf');
	});

	it('should keep alphanumeric, hyphens and underscores', () => {
		expect(sanitizeFilename('my-file_name-123')).toBe('my-file_name-123');
	});

	it('should truncate to 200 characters', () => {
		const longName = 'a'.repeat(300);
		expect(sanitizeFilename(longName).length).toBe(200);
	});

	it('should handle empty string', () => {
		expect(sanitizeFilename('')).toBe('');
	});
});

describe('normalizeEmail', () => {
	it('should lowercase the email', () => {
		expect(normalizeEmail('Jean.Dupont@Epitech.EU')).toBe('jean.dupont@epitech.eu');
	});

	it('should trim whitespace', () => {
		expect(normalizeEmail('  test@email.com  ')).toBe('test@email.com');
	});

	it('should handle already normalized email', () => {
		expect(normalizeEmail('test@email.com')).toBe('test@email.com');
	});
});
