import type { PageServerLoad } from './$types';
import { requireAuth } from '$lib/server/auth/guards';
import { createAuthenticatedPb } from '$lib/server/db/index';

export const load: PageServerLoad = async (event) => {
	requireAuth(event);

	const pb = createAuthenticatedPb(event.locals.token!);

	// Compter les students du campus de l'utilisateur
	const students = await pb.collection('students').getList(1, 1, {
		filter: `campus = '${event.locals.user!.campus}'`
	});

	const events = await pb.collection('events').getList(1, 1, {
		filter: `campus = '${event.locals.user!.campus}'`
	});

	const participations = await pb.collection('participations').getList(1, 1);

	return {
		user: event.locals.user,
		stats: {
			students: students.totalItems,
			events: events.totalItems,
			participations: participations.totalItems
		}
	};
};
