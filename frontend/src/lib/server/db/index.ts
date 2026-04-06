/**
 * Point d'entree du wrapper DB.
 *
 * Cote serveur (Docker) on utilise PB_INTERNAL_URL (reseau interne Docker).
 * Cote client (navigateur) on utilise PUBLIC_POCKETBASE_URL (localhost).
 */

import PocketBase from 'pocketbase';
import { PocketBaseAdapter } from './pocketbase.adapter';
import { env as privateEnv } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';

const PB_URL = privateEnv.PB_INTERNAL_URL ?? publicEnv.PUBLIC_POCKETBASE_URL ?? 'http://localhost:8090';

/** Cree un nouveau client PocketBase (1 par requete serveur) */
export function createDb(): PocketBaseAdapter {
	const pb = new PocketBase(PB_URL);
	return new PocketBaseAdapter(pb);
}

/** Cree un client PocketBase authentifie avec un token utilisateur */
export function createAuthenticatedPb(token: string): PocketBase {
	const pb = new PocketBase(PB_URL);
	pb.authStore.save(token);
	return pb;
}

/** Client PocketBase brut sans auth */
export function createRawPb(): PocketBase {
	return new PocketBase(PB_URL);
}
