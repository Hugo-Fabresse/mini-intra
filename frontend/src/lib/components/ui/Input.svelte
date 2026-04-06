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
	<label for={inputId} class="block text-sm font-medium text-blue-900 mb-1">
		{label}
	</label>
	<input
		id={inputId}
		class="w-full border-2 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 {error
			? 'border-red-600 text-red-900'
			: 'border-blue-200 text-blue-900 focus:border-blue-600'}"
		aria-invalid={error ? 'true' : undefined}
		aria-describedby={error ? `${inputId}-error` : undefined}
		{...rest}
	/>
	{#if error}
		<p id="{inputId}-error" class="mt-1 text-sm text-red-600">{error}</p>
	{/if}
</div>
