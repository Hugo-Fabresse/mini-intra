<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="min-h-screen bg-gray-50 p-8">
	<div class="mb-6 flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold text-gray-900">Lyceens</h1>
			<p class="mt-1 text-sm text-gray-500">Campus {data.campus}</p>
		</div>
		<a href="/app/dashboard" class="text-sm text-blue-600 hover:underline">Retour au dashboard</a>
	</div>

	<form method="GET" class="mb-4">
		<input
			type="search"
			name="q"
			value={data.search}
			placeholder="Rechercher par nom ou prenom (min 2 caracteres)..."
			class="w-full max-w-md rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
		/>
	</form>

	{#if data.students.items.length === 0}
		<div class="rounded-lg bg-white p-8 text-center shadow">
			<p class="text-gray-500">
				{#if data.search}
					Aucun lyceen ne correspond a la recherche "{data.search}".
				{:else}
					Aucun lyceen inscrit sur ce campus.
				{/if}
			</p>
		</div>
	{:else}
		<div class="overflow-hidden rounded-lg bg-white shadow">
			<table class="min-w-full divide-y divide-gray-200">
				<thead class="bg-gray-50">
					<tr>
						<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Nom</th>
						<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Prenom</th>
						<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Email</th>
						<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Etablissement</th>
						<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Niveau</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200">
					{#each data.students.items as student}
						<tr class="transition-colors hover:bg-gray-50">
							<td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{student.nom}</td>
							<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{student.prenom}</td>
							<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{student.email}</td>
							<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{student.etablissement}</td>
							<td class="whitespace-nowrap px-6 py-4">
								<span class="inline-flex rounded-full px-2 text-xs font-semibold leading-5
									{student.niveau === 'terminale' ? 'bg-green-100 text-green-800' :
									 student.niveau === 'premiere' ? 'bg-blue-100 text-blue-800' :
									 'bg-gray-100 text-gray-800'}">
									{student.niveau}
								</span>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<div class="mt-4 text-sm text-gray-500">
			{data.students.total} lyceen(s) au total — Page {data.students.page}
		</div>
	{/if}
</div>
