import { z } from 'zod';

export const studentSchema = z.object({
	nom: z
		.string()
		.min(1, 'Le nom est requis')
		.max(100, 'Le nom ne peut pas depasser 100 caracteres')
		.trim(),
	prenom: z
		.string()
		.min(1, 'Le prenom est requis')
		.max(100, 'Le prenom ne peut pas depasser 100 caracteres')
		.trim(),
	email: z.string().email('Adresse email invalide').toLowerCase().trim(),
	etablissement: z.string().min(1, "L'etablissement est requis").max(200).trim(),
	niveau: z.enum(['seconde', 'premiere', 'terminale'], {
		errorMap: () => ({ message: 'Le niveau doit etre seconde, premiere ou terminale' })
	}),
	campus: z.string().min(1, 'Le campus est requis').trim()
});

export type StudentInput = z.infer<typeof studentSchema>;
