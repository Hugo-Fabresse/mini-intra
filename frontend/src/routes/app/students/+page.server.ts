import type { PageServerLoad } from './$types';
import { requireAuth } from '$lib/server/auth/guards';
import { createAuthenticatedPb } from '$lib/server/db/index';

export const load: PageServerLoad = async (event) => {
	requireAuth(event);

	const pb = createAuthenticatedPb(event.locals.token!);
	const campus = event.locals.user!.campus;
	const page = Number(event.url.searchParams.get('page') ?? '1');
	const search = event.url.searchParams.get('q') ?? '';

	let filter = `campus = '${campus}'`;
	if (search.length >= 2) {
		filter += ` && (nom ~ '${search}' || prenom ~ '${search}')`;
	}

	const students = await pb.collection('students').getList(page, 50, {
		filter,
		sort: 'nom'
	});

	return {
		students: {
			items: students.items,
			total: students.totalItems,
			page: students.page,
			perPage: students.perPage
		},
		search,
		campus
	};
};
