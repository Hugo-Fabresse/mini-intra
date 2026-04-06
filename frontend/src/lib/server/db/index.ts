/**
 * Point d'entree du wrapper DB.
 * Cree une instance PocketBase connectee au backend.
 */

import PocketBase from 'pocketbase';
import { PocketBaseAdapter } from './pocketbase.adapter';
import { env } from '$env/dynamic/public';

const PB_URL = env.PUBLIC_POCKETBASE_URL ?? 'http://localhost:8090';

/** Cree un nouveau client PocketBase (1 par requete serveur) */
export function createDb(): PocketBaseAdapter {
	const pb = new PocketBase(PB_URL);
	return new PocketBaseAdapter(pb);
}

/** Cree un client PocketBase avec le token d'auth d'un utilisateur */
export function createAuthenticatedDb(token: string): PocketBaseAdapter {
	const pb = new PocketBase(PB_URL);
	pb.authStore.save(token);
	return new PocketBaseAdapter(pb);
}

/** Client PocketBase brut pour les cas speciaux (auth) */
export function createRawPb(): PocketBase {
	return new PocketBase(PB_URL);
}
