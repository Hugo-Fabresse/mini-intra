/**
 * Utilitaires de gestion des dates.
 * Toutes les dates sont traitees en Europe/Paris.
 */

const TIMEZONE = 'Europe/Paris';

export function formatDate(date: string | Date): string {
	const d = typeof date === 'string' ? new Date(date) : date;
	return d.toLocaleDateString('fr-FR', { timeZone: TIMEZONE });
}

export function formatDateTime(date: string | Date): string {
	const d = typeof date === 'string' ? new Date(date) : date;
	return d.toLocaleString('fr-FR', { timeZone: TIMEZONE });
}

export function isInFuture(date: string | Date): boolean {
	const d = typeof date === 'string' ? new Date(date) : date;
	return d.getTime() > Date.now();
}

export function isInPast(date: string | Date): boolean {
	return !isInFuture(date);
}

export function daysBetween(start: string | Date, end: string | Date): number {
	const s = typeof start === 'string' ? new Date(start) : start;
	const e = typeof end === 'string' ? new Date(end) : end;
	const diffMs = e.getTime() - s.getTime();
	return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}
