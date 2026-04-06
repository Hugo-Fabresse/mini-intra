import { z } from 'zod';

export const eventSchema = z
	.object({
		titre: z
			.string()
			.min(1, 'Le titre est requis')
			.max(200, 'Le titre ne peut pas depasser 200 caracteres')
			.trim(),
		description: z.string().max(2000, 'La description ne peut pas depasser 2000 caracteres').trim(),
		date_debut: z.string().refine((val) => !isNaN(Date.parse(val)), {
			message: 'Date de debut invalide'
		}),
		date_fin: z.string().refine((val) => !isNaN(Date.parse(val)), {
			message: 'Date de fin invalide'
		}),
		campus: z.string().min(1, 'Le campus est requis').trim(),
		places_max: z
			.number()
			.int('Le nombre de places doit etre un entier')
			.min(1, 'Il faut au moins 1 place')
			.max(500, 'Maximum 500 places'),
		type: z.enum(['stage', 'evenement', 'coding_club'], {
			errorMap: () => ({ message: 'Le type doit etre stage, evenement ou coding_club' })
		})
	})
	.refine((data) => new Date(data.date_fin) > new Date(data.date_debut), {
		message: 'La date de fin doit etre apres la date de debut',
		path: ['date_fin']
	});

export type EventInput = z.infer<typeof eventSchema>;
