import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';

export default [
  {
    ignores: ['vite.config.js'],
  },
  js.configs.recommended,
  importPlugin.flatConfigs.recommended,
  prettierConfig,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      'no-unused-vars': [1, { argsIgnorePattern: 'res|next|^err' }],
      'arrow-body-style': [2, 'as-needed'],
      'no-param-reassign': [2, { props: false }],
      'no-console': 0,
      quotes: ['error', 'single', { allowTemplateLiterals: true }],
      'space-unary-ops': 2,
      'space-in-parens': 'error',
      'space-infix-ops': 'error',
      'func-names': 0,
      'comma-dangle': 0,
      'max-len': 0,
      'no-shadow': [
        2,
        {
          hoist: 'all',
          allow: ['resolve', 'reject', 'done', 'next', 'err', 'error'],
        },
      ],
      'no-unused-expressions': 'off',
    },
  },
];
