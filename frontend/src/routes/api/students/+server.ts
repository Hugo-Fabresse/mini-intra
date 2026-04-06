/**
 * API endpoint pour la recherche d'etudiants.
 * Protege par authentification, campus-scoped, avec validation d'entree.
 */

import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const MAX_QUERY_LENGTH = 100;
const MIN_QUERY_LENGTH = 2;

export const GET: RequestHandler = async ({ locals, url }) => {
	// Verification auth cote serveur
	if (!locals.user) {
		throw error(401, { message: 'Non authentifie' });
	}

	const query = url.searchParams.get('q') ?? '';

	// Validation de la longueur de la requete
	if (query.length > 0 && query.length < MIN_QUERY_LENGTH) {
		throw error(400, { message: `La recherche doit contenir au moins ${MIN_QUERY_LENGTH} caracteres` });
	}
	if (query.length > MAX_QUERY_LENGTH) {
		throw error(400, { message: `La recherche ne peut pas depasser ${MAX_QUERY_LENGTH} caracteres` });
	}

	// TODO: Implementer la recherche reelle via StudentService
	// const service = new StudentService(db);
	// const results = await service.search(locals.user.campus, query);

	return json({
		items: [],
		total: 0,
		page: 1,
		perPage: 20
	});
};
