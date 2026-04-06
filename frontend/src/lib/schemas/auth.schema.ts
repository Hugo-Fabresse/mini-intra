import { z } from 'zod';

export const loginSchema = z.object({
	email: z.string().email('Adresse email invalide').toLowerCase().trim(),
	password: z
		.string()
		.min(12, 'Le mot de passe doit contenir au moins 12 caracteres')
		.max(128, 'Le mot de passe ne peut pas depasser 128 caracteres')
});

export type LoginInput = z.infer<typeof loginSchema>;
