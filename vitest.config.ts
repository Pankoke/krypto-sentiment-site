import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    globals: true,
  },
  resolve: {
    alias: {
      lib: path.resolve(__dirname, 'lib'),
      components: path.resolve(__dirname, 'components'),
    },
  },
});


