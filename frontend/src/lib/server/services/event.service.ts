/**
 * Service metier pour la gestion des evenements.
 */

import type { IDatabase, QueryOptions } from '$lib/server/db/interface';
import type { Event, PaginatedResult } from '$lib/types/entities';
import type { EventInput } from '$lib/schemas/event.schema';
import { ServiceError } from '$lib/types/errors';
import { pbFilter } from '$lib/utils/sanitize';

const COLLECTION = 'events';

export class EventService {
	constructor(private readonly db: IDatabase) {}

	async getById(id: string): Promise<Event | null> {
		return this.db.getOne<Event>(COLLECTION, id);
	}

	async list(campus: string, options?: QueryOptions): Promise<PaginatedResult<Event>> {
		const campusFilter = pbFilter('campus', '=', campus);
		const combinedFilter = options?.filter
			? `${campusFilter} && ${options.filter}`
			: campusFilter;

		return this.db.getList<Event>(COLLECTION, {
			...options,
			filter: combinedFilter,
			sort: options?.sort ?? '-date_debut'
		});
	}

	async create(data: EventInput, createdBy: string): Promise<Event> {
		return this.db.create<Event>(COLLECTION, {
			...data,
			created_by: createdBy
		});
	}

	async update(id: string, data: Partial<EventInput>): Promise<Event> {
		const existing = await this.db.getOne<Event>(COLLECTION, id);
		if (!existing) {
			throw ServiceError.notFound('Evenement', id);
		}
		return this.db.update<Event>(COLLECTION, id, data);
	}

	async delete(id: string): Promise<void> {
		const existing = await this.db.getOne<Event>(COLLECTION, id);
		if (!existing) {
			throw ServiceError.notFound('Evenement', id);
		}
		await this.db.delete(COLLECTION, id);
	}
}
