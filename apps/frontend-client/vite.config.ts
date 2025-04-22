import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

export default defineConfig({
  root: __dirname,
  base: '/client',

  server: {
    port: 4300,
    host: true,
  },

  // logLevel: 'warn',
  //
  // preview: {
  //   port: 4300,
  //   host: 'localhost',
  // },

  build: {
    // outDir: './dist/apps/frontend-client',
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },

  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
});
