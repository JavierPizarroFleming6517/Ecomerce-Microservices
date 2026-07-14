import globals from 'globals';

import base from './base.mjs';

export default [
  ...base,
  {
    files: ['**/*.{ts,mts,cts,js,mjs,cjs}'],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-extraneous-class': 'off',
      // Nest's DI resolves constructor params via emitted `design:paramtypes`
      // metadata, which requires a real (value) import of the injected class.
      // This rule cannot distinguish that from a genuine type-only usage, so
      // it is disabled to avoid silently breaking dependency injection.
      '@typescript-eslint/consistent-type-imports': 'off',
    },
  },
  {
    files: ['**/*.spec.ts', '**/*.e2e-spec.ts', '**/test/**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
  },
];
