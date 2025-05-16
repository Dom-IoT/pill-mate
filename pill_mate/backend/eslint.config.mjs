import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';

export default tseslint.config(
    { ignores: ['build'] },
    {
        extends: [
            js.configs.recommended,
            ...tseslint.configs.recommended,
            importPlugin.flatConfigs.recommended,
        ],
        files: ['**/*.{js,cjs,mjs,ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.node,
        },
        rules: {
            'no-console': 'error',
            'max-len': ['error', { code: 100 }],
            indent: ['error', 4],
            semi: ['error', 'always'],
            quotes: ['error', 'single'],
            'comma-dangle': ['error', 'always-multiline'],
            'no-trailing-spaces': ['error'],
            'eqeqeq': ['error', 'always'],
            'import/order': 'error',
            'import/no-unresolved': 'off',
            '@typescript-eslint/no-require-imports': 'off',
            '@typescript-eslint/no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
        },
    },
);
