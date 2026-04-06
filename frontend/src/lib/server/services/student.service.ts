/**
 * Service metier pour la gestion des etudiants.
 * Utilise le wrapper DB abstrait (jamais d'appel direct a PocketBase).
 */

import type { IDatabase, QueryOptions } from '$lib/server/db/interface';
import type { Student, PaginatedResult } from '$lib/types/entities';
import type { StudentInput } from '$lib/schemas/student.schema';
import { ServiceError } from '$lib/types/errors';
import { pbFilter, normalizeEmail } from '$lib/utils/sanitize';

const COLLECTION = 'students';

export class StudentService {
	constructor(private readonly db: IDatabase) {}

	async getById(id: string): Promise<Student | null> {
		return this.db.getOne<Student>(COLLECTION, id);
	}

	async list(campus: string, options?: QueryOptions): Promise<PaginatedResult<Student>> {
		const campusFilter = pbFilter('campus', '=', campus);
		const combinedFilter = options?.filter
			? `${campusFilter} && ${options.filter}`
			: campusFilter;

		return this.db.getList<Student>(COLLECTION, {
			...options,
			filter: combinedFilter,
			sort: options?.sort ?? '-created'
		});
	}

	async search(campus: string, query: string): Promise<PaginatedResult<Student>> {
		if (query.length < 2) {
			throw ServiceError.validation('La recherche doit contenir au moins 2 caracteres');
		}
		if (query.length > 100) {
			throw ServiceError.validation('La recherche ne peut pas depasser 100 caracteres');
		}

		const campusFilter = pbFilter('campus', '=', campus);
		const nomFilter = pbFilter('nom', '~', query);
		const prenomFilter = pbFilter('prenom', '~', query);

		return this.db.getList<Student>(COLLECTION, {
			filter: `${campusFilter} && (${nomFilter} || ${prenomFilter})`,
			limit: 20,
			sort: 'nom'
		});
	}

	async create(data: StudentInput): Promise<Student> {
		const normalizedData = {
			...data,
			email: normalizeEmail(data.email)
		};

		const existing = await this.db.getFirstMatch<Student>(
			COLLECTION,
			pbFilter('email', '=', normalizedData.email)
		);

		if (existing) {
			throw ServiceError.validation('Un etudiant avec cet email existe deja');
		}

		return this.db.create<Student>(COLLECTION, normalizedData);
	}

	async update(id: string, data: Partial<StudentInput>): Promise<Student> {
		const existing = await this.db.getOne<Student>(COLLECTION, id);
		if (!existing) {
			throw ServiceError.notFound('Etudiant', id);
		}

		const normalizedData = data.email
			? { ...data, email: normalizeEmail(data.email) }
			: data;

		return this.db.update<Student>(COLLECTION, id, normalizedData);
	}

	async delete(id: string): Promise<void> {
		const existing = await this.db.getOne<Student>(COLLECTION, id);
		if (!existing) {
			throw ServiceError.notFound('Etudiant', id);
		}
		await this.db.delete(COLLECTION, id);
	}
}
