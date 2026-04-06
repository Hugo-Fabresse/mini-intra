<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const statutLabels: Record<string, string> = {
		inscrit: 'Inscrit',
		present: 'Present',
		absent: 'Absent',
		annule: 'Annule'
	};

	const statutColors: Record<string, string> = {
		inscrit: 'border-blue-600 text-blue-600',
		present: 'border-green-600 text-green-600 bg-green-50',
		absent: 'border-red-600 text-red-600 bg-red-50',
		annule: 'border-blue-300 text-blue-300'
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
					<a href="/app/events" class="pb-1 text-xs font-medium uppercase tracking-wider text-blue-400 hover:text-blue-600">
						Evenements
					</a>
					<a href="/app/participations" class="border-b-2 border-blue-600 pb-1 text-xs font-medium uppercase tracking-wider text-blue-600">
						Participations
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
			<h2 class="text-2xl font-bold uppercase tracking-tight text-blue-900">Participations</h2>
			<div class="mt-2 h-1 w-10 bg-blue-600"></div>
		</div>

		{#if data.participations.items.length === 0}
			<div class="border-2 border-blue-200 bg-white p-12 text-center">
				<p class="text-sm text-blue-400">Aucune participation enregistree</p>
			</div>
		{:else}
			<div class="border-2 border-blue-600 bg-white">
				<table class="min-w-full">
					<thead>
						<tr class="border-b-2 border-blue-600 bg-blue-600">
							<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white">Lyceen</th>
							<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white">Evenement</th>
							<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white">Statut</th>
							<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white">XP</th>
							<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white">Note</th>
						</tr>
					</thead>
					<tbody>
						{#each data.participations.items as p, i}
							{@const student = data.studentsMap[p.student_id]}
							{@const evt = data.eventsMap[p.event_id]}
							<tr class="border-b border-blue-100 transition-colors hover:bg-blue-50 {i % 2 === 0 ? 'bg-white' : 'bg-blue-50/30'}">
								<td class="whitespace-nowrap px-6 py-3 text-sm font-medium text-blue-900">
									{student ? `${student.prenom} ${student.nom}` : '—'}
								</td>
								<td class="whitespace-nowrap px-6 py-3 text-sm text-blue-900">
									{evt ? evt.titre : '—'}
								</td>
								<td class="whitespace-nowrap px-6 py-3">
									<span class="border px-2 py-0.5 text-xs font-medium uppercase {statutColors[p.statut] ?? 'border-blue-200 text-blue-400'}">
										{statutLabels[p.statut] ?? p.statut}
									</span>
								</td>
								<td class="whitespace-nowrap px-6 py-3 text-sm font-medium text-blue-600">
									{p.xp > 0 ? `${p.xp} XP` : '—'}
								</td>
								<td class="max-w-xs truncate px-6 py-3 text-sm text-blue-400">
									{p.note || '—'}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			<div class="mt-4 text-xs uppercase tracking-wider text-blue-400">
				{data.participations.total} participation(s)
			</div>
		{/if}
	</main>
</div>
