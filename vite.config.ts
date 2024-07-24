import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        // Ignore specific warnings
        if (warning.code === 'THIS_IS_UNDEFINED') {
          return;
        }
        // Use default for everything else
        warn(warning);
      }
    }
  },
  esbuild: {
    // Prevent esbuild from failing the build on certain TypeScript errors
    loader: 'ts',
    include: /.*\.(ts|tsx)$/, // All .ts and .tsx files
    logOverride: { 'tsc': 'silent' } // Silence TypeScript errors from esbuild
  }
});