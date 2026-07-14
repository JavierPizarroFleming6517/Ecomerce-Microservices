import nest from '@retail/eslint-config/nest';

export default [
  ...nest,
  {
    ignores: ['eslint.config.mjs'],
  },
];
