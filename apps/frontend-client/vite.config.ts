/// <reference types='vitest' />
import { defineConfig } from 'vite';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/frontend-client',
  base: '/client',

  server: {
    port: 4300,
    host: true,
  },

  logLevel: 'warn',

  preview: {
    port: 4300,
    host: 'localhost',
  },

  plugins: [nxViteTsPaths()],

  build: {
    outDir: '../../dist/apps/frontend-client',
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
});
