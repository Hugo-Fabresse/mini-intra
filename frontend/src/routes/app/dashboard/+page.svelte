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
					<a href="/app/dashboard" class="border-b-2 border-blue-600 pb-1 text-xs font-medium uppercase tracking-wider text-blue-600">
						Dashboard
					</a>
					<a href="/app/students" class="pb-1 text-xs font-medium uppercase tracking-wider text-blue-400 hover:text-blue-600">
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
			<div class="flex items-center gap-4">
				<span class="text-xs text-blue-400">{data.user?.name} — {data.user?.campus}</span>
				<form method="POST" action="/auth/logout">
					<button
						type="submit"
						class="border-2 border-blue-200 px-3 py-1 text-xs font-medium uppercase tracking-wider text-blue-400 transition-colors hover:border-blue-600 hover:text-blue-600"
					>
						Deconnexion
					</button>
				</form>
			</div>
		</div>
	</header>

	<!-- Content -->
	<main class="p-8">
		<div class="mb-8">
			<h2 class="text-2xl font-bold uppercase tracking-tight text-blue-900">Tableau de bord</h2>
			<div class="mt-2 h-1 w-10 bg-blue-600"></div>
		</div>

		<!-- Stats -->
		<div class="mb-8 grid grid-cols-1 gap-0 md:grid-cols-3">
			<div class="border-2 border-blue-600 bg-white p-6">
				<p class="text-xs font-medium uppercase tracking-wider text-blue-400">Lyceens</p>
				<p class="mt-3 text-4xl font-bold text-blue-600">{data.stats.students}</p>
				<p class="mt-1 text-xs text-blue-300">sur votre campus</p>
			</div>
			<div class="border-2 border-l-0 border-blue-600 bg-white p-6">
				<p class="text-xs font-medium uppercase tracking-wider text-blue-400">Evenements</p>
				<p class="mt-3 text-4xl font-bold text-blue-600">{data.stats.events}</p>
				<p class="mt-1 text-xs text-blue-300">sur votre campus</p>
			</div>
			<div class="border-2 border-l-0 border-blue-600 bg-white p-6">
				<p class="text-xs font-medium uppercase tracking-wider text-blue-400">Participations</p>
				<p class="mt-3 text-4xl font-bold text-blue-600">{data.stats.participations}</p>
				<p class="mt-1 text-xs text-blue-300">toutes confondues</p>
			</div>
		</div>

		<!-- Navigation cards -->
		<div class="grid grid-cols-1 gap-0 md:grid-cols-3">
			<a
				href="/app/students"
				class="group border-2 border-blue-600 bg-white p-8 transition-colors hover:bg-blue-600"
			>
				<h3 class="text-lg font-bold uppercase tracking-wider text-blue-600 group-hover:text-white">
					Lyceens
				</h3>
				<p class="mt-2 text-sm text-blue-400 group-hover:text-blue-100">
					Gerer les lyceens inscrits sur votre campus
				</p>
				<div class="mt-4 h-0.5 w-8 bg-blue-600 group-hover:bg-white"></div>
			</a>

			<a
				href="/app/events"
				class="group border-2 border-l-0 border-blue-600 bg-white p-8 transition-colors hover:bg-blue-600"
			>
				<h3 class="text-lg font-bold uppercase tracking-wider text-blue-600 group-hover:text-white">
					Evenements
				</h3>
				<p class="mt-2 text-sm text-blue-400 group-hover:text-blue-100">
					Gerer les stages, evenements et coding clubs
				</p>
				<div class="mt-4 h-0.5 w-8 bg-blue-600 group-hover:bg-white"></div>
			</a>

			<a
				href="/app/participations"
				class="group border-2 border-l-0 border-blue-600 bg-white p-8 transition-colors hover:bg-blue-600"
			>
				<h3 class="text-lg font-bold uppercase tracking-wider text-blue-600 group-hover:text-white">
					Participations
				</h3>
				<p class="mt-2 text-sm text-blue-400 group-hover:text-blue-100">
					Suivi des inscriptions et presences
				</p>
				<div class="mt-4 h-0.5 w-8 bg-blue-600 group-hover:bg-white"></div>
			</a>
		</div>
	</main>
</div>
