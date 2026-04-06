import type { PageServerLoad } from './$types';
import { requireAuth } from '$lib/server/auth/guards';
import { createAuthenticatedPb } from '$lib/server/db/index';

export const load: PageServerLoad = async (event) => {
	requireAuth(event);

	const pb = createAuthenticatedPb(event.locals.token!);
	const campus = event.locals.user!.campus;

	const events = await pb.collection('events').getList(1, 50, {
		filter: `campus = '${campus}'`,
		sort: '-date_debut'
	});

	return {
		events: {
			items: events.items,
			total: events.totalItems,
			page: events.page,
			perPage: events.perPage
		},
		campus
	};
};
