import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(async ({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const reactPlugin = (await import('@vitejs/plugin-react')).default;

  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [reactPlugin()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
  };
});
