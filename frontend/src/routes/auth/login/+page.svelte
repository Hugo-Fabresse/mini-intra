<script lang="ts">
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-50">
	<div class="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
		<h1 class="mb-6 text-2xl font-bold text-gray-900">Connexion</h1>

		{#if form?.error}
			<div class="mb-4 rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700">
				{form.error}
			</div>
		{/if}

		<form method="POST" class="space-y-4">
			<div>
				<label for="email" class="block text-sm font-medium text-gray-700">Email</label>
				<input
					id="email"
					name="email"
					type="email"
					required
					autocomplete="email"
					class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
					placeholder="prenom.nom@epitech.eu"
				/>
			</div>

			<div>
				<label for="password" class="block text-sm font-medium text-gray-700">
					Mot de passe
				</label>
				<input
					id="password"
					name="password"
					type="password"
					required
					autocomplete="current-password"
					minlength={12}
					class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
				/>
			</div>

			<button
				type="submit"
				class="w-full rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
			>
				Se connecter
			</button>
		</form>
	</div>
</div>
