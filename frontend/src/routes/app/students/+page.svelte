<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
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
					<a href="/app/students" class="border-b-2 border-blue-600 pb-1 text-xs font-medium uppercase tracking-wider text-blue-600">
						Lyceens
					</a>
					<a href="/app/events" class="pb-1 text-xs font-medium uppercase tracking-wider text-blue-400 hover:text-blue-600">
						Evenements
					</a>
					<a href="/app/participations" class="pb-1 text-xs font-medium uppercase tracking-wider text-blue-400 hover:text-blue-600">
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
			<h2 class="text-2xl font-bold uppercase tracking-tight text-blue-900">Lyceens</h2>
			<div class="mt-2 h-1 w-10 bg-blue-600"></div>
			<p class="mt-2 text-xs uppercase tracking-wider text-blue-400">Campus {data.campus}</p>
		</div>

		<!-- Search -->
		<form method="GET" class="mb-6">
			<input
				type="search"
				name="q"
				value={data.search}
				placeholder="Rechercher par nom ou prenom..."
				class="w-full max-w-md border-2 border-blue-200 bg-white px-4 py-2 text-sm text-blue-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
			/>
		</form>

		{#if data.students.items.length === 0}
			<div class="border-2 border-blue-200 bg-white p-12 text-center">
				<p class="text-sm text-blue-400">
					{#if data.search}
						Aucun lyceen ne correspond a "{data.search}"
					{:else}
						Aucun lyceen inscrit sur ce campus
					{/if}
				</p>
			</div>
		{:else}
			<div class="border-2 border-blue-600 bg-white">
				<table class="min-w-full">
					<thead>
						<tr class="border-b-2 border-blue-600 bg-blue-600">
							<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white">Nom</th>
							<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white">Prenom</th>
							<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white">Email</th>
							<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white">Etablissement</th>
							<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white">Niveau</th>
						</tr>
					</thead>
					<tbody>
						{#each data.students.items as student, i}
							<tr class="border-b border-blue-100 transition-colors hover:bg-blue-50 {i % 2 === 0 ? 'bg-white' : 'bg-blue-50/30'}">
								<td class="whitespace-nowrap px-6 py-3 text-sm font-medium text-blue-900">{student.nom}</td>
								<td class="whitespace-nowrap px-6 py-3 text-sm text-blue-900">{student.prenom}</td>
								<td class="whitespace-nowrap px-6 py-3 text-sm text-blue-400">{student.email}</td>
								<td class="whitespace-nowrap px-6 py-3 text-sm text-blue-400">{student.etablissement}</td>
								<td class="whitespace-nowrap px-6 py-3">
									<span class="border border-blue-600 px-2 py-0.5 text-xs font-medium uppercase text-blue-600">
										{student.niveau}
									</span>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			<div class="mt-4 text-xs uppercase tracking-wider text-blue-400">
				{data.students.total} lyceen(s) — Page {data.students.page}
			</div>
		{/if}
	</main>
</div>
