import vuePlugin from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'
import prettierPlugin from 'eslint-plugin-prettier'

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
    },
    plugins: {
      vue: vuePlugin,
      prettier: prettierPlugin,
    },
    rules: {
      ...vuePlugin.configs['vue3-essential'].rules,
      'prettier/prettier': 'error',
    },
  },
  {
    files: ['**/*.{js,cjs,mjs}'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        // browser & node globals similar to env settings in old .eslintrc
        window: 'readonly',
        document: 'readonly',
        module: 'readonly',
        process: 'readonly',
      },
    },
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      'no-console': 'warn',
      'no-unused-vars': 'warn',
      'prettier/prettier': 'error',
    },
  },
]
