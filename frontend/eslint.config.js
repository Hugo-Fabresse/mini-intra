import eslint from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import sveltePlugin from 'eslint-plugin-svelte';
import prettierConfig from 'eslint-config-prettier';

export default [
	eslint.configs.recommended,
	prettierConfig,
	{
		files: ['**/*.ts'],
		languageOptions: {
			parser: tsparser,
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module'
			}
		},
		plugins: {
			'@typescript-eslint': tseslint
		},
		rules: {
			// --- TypeScript strict ---
			'@typescript-eslint/no-explicit-any': 'error',
			'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

			// --- Securite ---
			'no-eval': 'error',
			'no-implied-eval': 'error',
			'no-new-func': 'error',

			// --- Qualite ---
			'no-console': ['error', { allow: ['warn', 'error'] }],
			'no-debugger': 'error',
			eqeqeq: ['error', 'always'],
			'no-var': 'error',
			'prefer-const': 'error',
			'no-throw-literal': 'error',
			'no-return-await': 'error',
			'no-shadow': 'error',
			'no-duplicate-imports': 'error',

			// --- Complexite ---
			complexity: ['warn', { max: 15 }],
			'max-depth': ['warn', { max: 4 }],
			'max-lines-per-function': ['warn', { max: 100, skipBlankLines: true, skipComments: true }],
			'max-params': ['warn', { max: 5 }]
		}
	},
	...sveltePlugin.configs['flat/recommended'],
	{
		ignores: [
			'.svelte-kit/',
			'build/',
			'node_modules/',
			'coverage/',
			'playwright-report/'
		]
	}
];
