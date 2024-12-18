import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-plugin-prettier'
import prettierConfig from 'eslint-plugin-prettier/recommended'
import importPlugin from 'eslint-plugin-import'

export default tseslint.config(
    { ignores: ['build'] },
    {
        extends: [
            js.configs.recommended,
            ...tseslint.configs.recommended,
            prettierConfig,
            importPlugin.flatConfigs.recommended,
        ],
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.node,
        },
        plugins: {
            prettier,
        },
        rules: {
            'import/order': 'error'
        },
    },
)
