<script lang="ts">
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<div class="flex min-h-screen items-center justify-center bg-blue-50">
	<div class="w-full max-w-md border-2 border-blue-600 bg-white p-8">
		<div class="mb-8">
			<h1 class="text-2xl font-bold uppercase tracking-tight text-blue-600">Connexion</h1>
			<div class="mt-2 h-1 w-10 bg-blue-600"></div>
		</div>

		{#if form?.error}
			<div class="mb-6 border-2 border-red-600 bg-red-50 p-3 text-sm text-red-700">
				{form.error}
			</div>
		{/if}

		<form method="POST" class="space-y-5">
			<div>
				<label for="email" class="block text-xs font-medium uppercase tracking-wider text-blue-900 mb-1">
					Email
				</label>
				<input
					id="email"
					name="email"
					type="email"
					required
					autocomplete="email"
					class="w-full border-2 border-blue-200 px-3 py-2 text-blue-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
					placeholder="prenom.nom@epitech.eu"
				/>
			</div>

			<div>
				<label for="password" class="block text-xs font-medium uppercase tracking-wider text-blue-900 mb-1">
					Mot de passe
				</label>
				<input
					id="password"
					name="password"
					type="password"
					required
					autocomplete="current-password"
					minlength={12}
					class="w-full border-2 border-blue-200 px-3 py-2 text-blue-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
				/>
			</div>

			<button
				type="submit"
				class="w-full bg-blue-600 px-4 py-3 text-sm font-medium uppercase tracking-wider text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
			>
				Se connecter
			</button>
		</form>
	</div>
</div>
