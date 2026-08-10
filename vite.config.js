import { defineConfig } from 'vite';
import { resolve } from 'path';
import { globSync } from 'fs';

export default defineConfig({
  base: '/',
  server: {
    port: 5173,
  },
  build: {
    rollupOptions: {
      input: Object.fromEntries(
        globSync('{index.html,src/**/*.html}', { cwd: resolve(__dirname) })
          .map(file => {
            const name = file.replace(/\.html$/, '').replace(/[\/\\]/g, '-');
            return [name, resolve(__dirname, file)];
          })
      )
    }
  }
});
