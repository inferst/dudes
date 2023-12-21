/// <reference types='vitest' />
import { defineConfig } from 'vite';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/client',
  base: '/user',

  server: {
    port: 4300,
    host: 'localhost',
  },

  preview: {
    port: 4400,
    host: 'localhost',
  },
  plugins: [nxViteTsPaths()],
  build: {
    outDir: '../../dist/apps/client',
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
});
