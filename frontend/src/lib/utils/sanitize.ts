/**
 * Fonctions de sanitisation pour la securite.
 */

/** Echappe les caracteres HTML pour prevenir le XSS */
export function escapeHtml(str: string): string {
	const htmlEntities: Record<string, string> = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#x27;',
		'/': '&#x2F;'
	};
	return str.replace(/[&<>"'/]/g, (char) => htmlEntities[char] ?? char);
}

/**
 * Echappe une valeur pour un filtre PocketBase.
 * Utilise des guillemets simples et echappe les caracteres speciaux PocketBase.
 */
export function escapePbFilter(value: string): string {
	return value.replace(/['\\]/g, '\\$&');
}

/** Construit un filtre PocketBase securise avec echappement */
export function pbFilter(field: string, operator: string, value: string): string {
	const escaped = escapePbFilter(value);
	return `${field} ${operator} '${escaped}'`;
}

/** Sanitise un nom de fichier pour empecher les injections de path */
export function sanitizeFilename(name: string): string {
	return name.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 200);
}

/** Normalise un email (lowercase + trim) */
export function normalizeEmail(email: string): string {
	return email.toLowerCase().trim();
}
