<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface Props extends HTMLInputAttributes {
		label: string;
		error?: string;
	}

	let { label, error, id, ...rest }: Props = $props();

	const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-');
</script>

<div>
	<label for={inputId} class="block text-sm font-medium text-gray-700">
		{label}
	</label>
	<input
		{id}
		id={inputId}
		class="mt-1 w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1 {error
			? 'border-red-300 focus:border-red-500 focus:ring-red-500'
			: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}"
		aria-invalid={error ? 'true' : undefined}
		aria-describedby={error ? `${inputId}-error` : undefined}
		{...rest}
	/>
	{#if error}
		<p id="{inputId}-error" class="mt-1 text-sm text-red-600">{error}</p>
	{/if}
</div>
