import { defineConfig } from 'vitest/config';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  publicDir: false, // Prevent copying `logo.png` to dist
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'AlugardDrop',
      formats: ['es', 'cjs', 'umd'],
      fileName: (format) => {
        if (format === 'es') return 'alugard-drop.js';
        if (format === 'cjs') return 'alugard-drop.cjs';
        return 'alugard-drop.umd.js';
      },
    },
    rollupOptions: {
      output: {
        exports: 'named',
      }
    },
    sourcemap: true,
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    include: ['tests/**/*.test.ts'],
  },
});
