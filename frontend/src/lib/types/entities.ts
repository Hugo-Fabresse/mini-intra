/**
 * Types des entites metier du Mini Intra.
 * Voir docs/glossaire.md pour les definitions fonctionnelles.
 */

export interface Student {
	id: string;
	nom: string;
	prenom: string;
	email: string;
	etablissement: string;
	niveau: 'seconde' | 'premiere' | 'terminale';
	campus: string;
	created: string;
	updated: string;
}

export interface Event {
	id: string;
	titre: string;
	description: string;
	date_debut: string;
	date_fin: string;
	campus: string;
	places_max: number;
	type: 'stage' | 'evenement' | 'coding_club';
	created_by: string;
	created: string;
	updated: string;
}

export interface Participation {
	id: string;
	student_id: string;
	event_id: string;
	statut: 'inscrit' | 'present' | 'absent' | 'annule';
	note: string;
	xp: number;
	created: string;
	updated: string;
}

export interface User {
	id: string;
	email: string;
	name: string;
	campus: string;
	role: 'admin' | 'staff';
	avatar: string;
	created: string;
	updated: string;
}

export interface AuthResult {
	token: string;
	user: User;
}

export interface PaginatedResult<T> {
	items: T[];
	total: number;
	page: number;
	perPage: number;
}
