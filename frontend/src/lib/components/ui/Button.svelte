<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	interface Props extends HTMLButtonAttributes {
		variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
		size?: 'sm' | 'md' | 'lg';
		children: Snippet;
	}

	let { variant = 'primary', size = 'md', children, ...rest }: Props = $props();

	const baseClasses = 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

	const variantClasses: Record<string, string> = {
		primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-600',
		secondary: 'bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50 focus:ring-blue-600',
		danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-600',
		ghost: 'bg-transparent text-blue-600 hover:bg-blue-50 focus:ring-blue-600'
	};

	const sizeClasses: Record<string, string> = {
		sm: 'px-3 py-1.5 text-sm',
		md: 'px-4 py-2 text-sm',
		lg: 'px-6 py-3 text-base'
	};
</script>

<button class="{baseClasses} {variantClasses[variant]} {sizeClasses[size]}" {...rest}>
	{@render children()}
</button>
