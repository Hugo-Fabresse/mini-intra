<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="min-h-screen bg-gray-50 p-8">
	<div class="mb-8 flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold text-gray-900">Tableau de bord</h1>
			<p class="mt-1 text-gray-600">
				Bienvenue, {data.user?.name} — Campus {data.user?.campus}
			</p>
		</div>
		<form method="POST" action="/auth/logout">
			<button
				type="submit"
				class="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-300"
			>
				Se deconnecter
			</button>
		</form>
	</div>

	<div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
		<div class="rounded-lg bg-white p-6 shadow">
			<p class="text-sm font-medium text-gray-500">Lyceens</p>
			<p class="mt-2 text-3xl font-bold text-blue-600">{data.stats.students}</p>
			<p class="mt-1 text-xs text-gray-400">sur votre campus</p>
		</div>
		<div class="rounded-lg bg-white p-6 shadow">
			<p class="text-sm font-medium text-gray-500">Evenements</p>
			<p class="mt-2 text-3xl font-bold text-green-600">{data.stats.events}</p>
			<p class="mt-1 text-xs text-gray-400">sur votre campus</p>
		</div>
		<div class="rounded-lg bg-white p-6 shadow">
			<p class="text-sm font-medium text-gray-500">Participations</p>
			<p class="mt-2 text-3xl font-bold text-purple-600">{data.stats.participations}</p>
			<p class="mt-1 text-xs text-gray-400">toutes confondues</p>
		</div>
	</div>

	<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
		<a
			href="/app/students"
			class="rounded-lg bg-white p-6 shadow transition-shadow hover:shadow-md"
		>
			<h2 class="text-lg font-semibold text-gray-900">Lyceens</h2>
			<p class="mt-2 text-gray-600">Gerer les lyceens inscrits sur votre campus</p>
		</a>

		<a
			href="/app/events"
			class="rounded-lg bg-white p-6 shadow transition-shadow hover:shadow-md"
		>
			<h2 class="text-lg font-semibold text-gray-900">Evenements</h2>
			<p class="mt-2 text-gray-600">Gerer les stages, evenements et coding clubs</p>
		</a>
	</div>
</div>
