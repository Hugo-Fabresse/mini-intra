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
</script>

<div class="min-h-screen bg-blue-50">
	<!-- Header -->
	<header class="border-b-2 border-blue-600 bg-white px-8 py-4">
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-6">
				<h1 class="text-lg font-bold uppercase tracking-wider text-blue-600">Mini Intra</h1>
				<nav class="flex gap-4">
					<a href="/app/dashboard" class="pb-1 text-xs font-medium uppercase tracking-wider text-blue-400 hover:text-blue-600">
						Dashboard
					</a>
					<a href="/app/students" class="pb-1 text-xs font-medium uppercase tracking-wider text-blue-400 hover:text-blue-600">
						Lyceens
					</a>
					<a href="/app/events" class="border-b-2 border-blue-600 pb-1 text-xs font-medium uppercase tracking-wider text-blue-600">
						Evenements
					</a>
				</nav>
			</div>
			<form method="POST" action="/auth/logout">
				<button
					type="submit"
					class="border-2 border-blue-200 px-3 py-1 text-xs font-medium uppercase tracking-wider text-blue-400 transition-colors hover:border-blue-600 hover:text-blue-600"
				>
					Deconnexion
				</button>
			</form>
		</div>
	</header>

	<!-- Content -->
	<main class="p-8">
		<div class="mb-6">
			<h2 class="text-2xl font-bold uppercase tracking-tight text-blue-900">Evenements</h2>
			<div class="mt-2 h-1 w-10 bg-blue-600"></div>
			<p class="mt-2 text-xs uppercase tracking-wider text-blue-400">Campus {data.campus}</p>
		</div>

		{#if data.events.items.length === 0}
			<div class="border-2 border-blue-200 bg-white p-12 text-center">
				<p class="text-sm text-blue-400">Aucun evenement programme sur ce campus</p>
			</div>
		{:else}
			<div class="grid grid-cols-1 gap-0 md:grid-cols-2 lg:grid-cols-3">
				{#each data.events.items as evt, i}
					<div class="group border-2 border-blue-600 bg-white p-6 transition-colors hover:bg-blue-600
						{i % 3 !== 0 ? 'lg:border-l-0' : ''}
						{i % 2 !== 0 ? 'max-lg:border-l-0' : ''}
						{i >= 3 ? 'border-t-0' : ''}
						{i >= 2 && i < 3 ? 'max-lg:border-t-0' : ''}">
						<div class="mb-3 flex items-center justify-between">
							<span class="border border-blue-600 px-2 py-0.5 text-xs font-medium uppercase tracking-wider text-blue-600 group-hover:border-white group-hover:text-white">
								{typeLabels[evt.type] ?? evt.type}
							</span>
							<span class="text-xs text-blue-300 group-hover:text-blue-200">{evt.places_max} places</span>
						</div>
						<h3 class="text-lg font-bold text-blue-900 group-hover:text-white">{evt.titre}</h3>
						<p class="mt-2 line-clamp-2 text-sm text-blue-400 group-hover:text-blue-100">{evt.description}</p>
						<div class="mt-4 border-t border-blue-100 pt-3 text-xs text-blue-300 group-hover:border-blue-400 group-hover:text-blue-200">
							{formatDate(evt.date_debut)} — {formatDate(evt.date_fin)}
						</div>
					</div>
				{/each}
			</div>

			<div class="mt-4 text-xs uppercase tracking-wider text-blue-400">
				{data.events.total} evenement(s)
			</div>
		{/if}
	</main>
</div>
