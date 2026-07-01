import path from 'path';
import { loadEnv, defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import svgr from 'vite-plugin-svgr';
import checker from 'vite-plugin-checker';

// ----------------------------------------------------------------------

const PORT = 8083;

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      svgr(),
      ...(mode !== 'test'
        ? [
            checker({
              typescript: { tsconfigPath: './tsconfig.json' },
              eslint: {
                useFlatConfig: true,
                lintCommand: 'eslint "./src/**/*.{js,jsx,ts,tsx}"',
                dev: { logLevel: ['error'] },
              },
              overlay: {
                position: 'tl',
                initialIsOpen: false,
              },
            }),
          ]
        : []),
    ],
    resolve: {
      alias: [
        {
          find: /^src(.+)/,
          replacement: path.resolve(process.cwd(), 'src/$1'),
        },
      ],
    },
    // Expose all VITE_* env vars as process.env.VITE_* so both Vite and Jest can
    // share the same code path (Jest reads process.env natively; Vite replaces
    // these string literals at build time via this define map).
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
      ...Object.fromEntries(
        Object.entries(env)
          .filter(([key]) => key.startsWith('VITE_'))
          .map(([key, val]) => [`process.env.${key}`, JSON.stringify(val)])
      ),
    },
    server: {
      port: PORT,
      host: true,
      proxy:
        env.VITE_BACKEND_GRAPHQL_URL && env.VITE_ENV === 'local'
          ? {
              '/api/magento': {
                target: env.VITE_BACKEND_GRAPHQL_URL,
                changeOrigin: true,
                rewrite: (p) => p.replace(/^\/api\/magento/, ''),
              },
              '/rest': {
                target: new URL(env.VITE_BACKEND_GRAPHQL_URL).origin,
                changeOrigin: true,
              },
            }
          : undefined,
    },
    preview: { port: PORT, host: true },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router',
        '@mui/material',
        '@mui/material/styles',
        '@tanstack/react-query',
        'dayjs',
        'framer-motion',
        'minimal-shared/utils',
        'minimal-shared/hooks',
      ],
    },
  };
});
