/**
 * Types d'erreurs applicatives.
 * Chaque couche transforme les erreurs avant de les propager.
 */

export class ServiceError extends Error {
	constructor(
		public readonly code: string,
		message: string,
		public readonly statusCode: number = 500
	) {
		super(message);
		this.name = 'ServiceError';
	}

	static notFound(entity: string, id: string): ServiceError {
		return new ServiceError('NOT_FOUND', `${entity} avec l'id ${id} introuvable`, 404);
	}

	static unauthorized(message = 'Acces non autorise'): ServiceError {
		return new ServiceError('UNAUTHORIZED', message, 401);
	}

	static forbidden(message = 'Acces interdit'): ServiceError {
		return new ServiceError('FORBIDDEN', message, 403);
	}

	static validation(message: string): ServiceError {
		return new ServiceError('VALIDATION', message, 400);
	}

	static internal(message = 'Erreur interne du serveur'): ServiceError {
		return new ServiceError('INTERNAL', message, 500);
	}
}
