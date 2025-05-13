import eslint from '@eslint/js';
import react from 'eslint-plugin-react';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const base = tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
);

export default {
  base,
  react: [
    ...base,
    react.configs.flat.recommended,
    react.configs.flat['jsx-runtime'],
    { languageOptions: { globals: globals.browser } },
  ],
};
