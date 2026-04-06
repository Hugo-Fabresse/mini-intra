<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	function formatDate(dateStr: string): string {
		return new Date(dateStr).toLocaleDateString('fr-FR', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
	}

	const typeLabels: Record<string, string> = {
		stage: 'Stage',
		evenement: 'Evenement',
		coding_club: 'Coding Club'
	};

	const typeColors: Record<string, string> = {
		stage: 'bg-orange-100 text-orange-800',
		evenement: 'bg-blue-100 text-blue-800',
		coding_club: 'bg-purple-100 text-purple-800'
	};
</script>

<div class="min-h-screen bg-gray-50 p-8">
	<div class="mb-6 flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold text-gray-900">Evenements</h1>
			<p class="mt-1 text-sm text-gray-500">Campus {data.campus}</p>
		</div>
		<a href="/app/dashboard" class="text-sm text-blue-600 hover:underline">Retour au dashboard</a>
	</div>

	{#if data.events.items.length === 0}
		<div class="rounded-lg bg-white p-8 text-center shadow">
			<p class="text-gray-500">Aucun evenement programme sur ce campus.</p>
		</div>
	{:else}
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
			{#each data.events.items as evt}
				<div class="rounded-lg bg-white p-6 shadow transition-shadow hover:shadow-md">
					<div class="mb-3 flex items-center justify-between">
						<span class="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium {typeColors[evt.type] ?? 'bg-gray-100 text-gray-800'}">
							{typeLabels[evt.type] ?? evt.type}
						</span>
						<span class="text-xs text-gray-400">{evt.places_max} places</span>
					</div>
					<h2 class="text-lg font-semibold text-gray-900">{evt.titre}</h2>
					<p class="mt-2 line-clamp-2 text-sm text-gray-600">{evt.description}</p>
					<div class="mt-4 border-t border-gray-100 pt-3 text-xs text-gray-500">
						{formatDate(evt.date_debut)} — {formatDate(evt.date_fin)}
					</div>
				</div>
			{/each}
		</div>

		<div class="mt-4 text-sm text-gray-500">
			{data.events.total} evenement(s) au total
		</div>
	{/if}
</div>
