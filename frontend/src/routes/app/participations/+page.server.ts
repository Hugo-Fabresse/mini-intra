import type { PageServerLoad } from './$types';
import { requireAuth } from '$lib/server/auth/guards';
import { createAuthenticatedPb } from '$lib/server/db/index';

export const load: PageServerLoad = async (event) => {
	requireAuth(event);

	const pb = createAuthenticatedPb(event.locals.token!);

	const participations = await pb.collection('participations').getList(1, 50);

	const items = participations.items.map((p) => ({
		id: p.id as string,
		student_id: p.student_id as string,
		event_id: p.event_id as string,
		statut: p.statut as string,
		note: (p.note as string) ?? '',
		xp: (p.xp as number) ?? 0
	}));

	// Recuperer les noms des etudiants et evenements
	const studentIds = [...new Set(items.map((p) => p.student_id).filter(Boolean))];
	const eventIds = [...new Set(items.map((p) => p.event_id).filter(Boolean))];

	const studentsMap: Record<string, { nom: string; prenom: string }> = {};
	for (const id of studentIds) {
		try {
			const s = await pb.collection('students').getOne(id);
			studentsMap[id] = { nom: s.nom as string, prenom: s.prenom as string };
		} catch {
			studentsMap[id] = { nom: '?', prenom: '?' };
		}
	}

	const eventsMap: Record<string, { titre: string }> = {};
	for (const id of eventIds) {
		try {
			const e = await pb.collection('events').getOne(id);
			eventsMap[id] = { titre: e.titre as string };
		} catch {
			eventsMap[id] = { titre: '?' };
		}
	}

	return {
		participations: {
			items,
			total: participations.totalItems,
			page: participations.page,
			perPage: participations.perPage
		},
		studentsMap,
		eventsMap
	};
};
