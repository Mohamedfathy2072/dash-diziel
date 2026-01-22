import react from '@vitejs/plugin-react-swc';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, loadEnv } from "vite";
import viteCompression from 'vite-plugin-compression';
import svgr from 'vite-plugin-svgr';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");

  return {
    plugins: [
      react(),
      viteCompression({
        algorithm: 'gzip',
        ext: '.gz',
        threshold: 10240,
        deleteOriginFile: false
      }),
      viteCompression({
        algorithm: 'brotliCompress',
        ext: '.br',
        threshold: 10240,
        deleteOriginFile: false,
      }),
      svgr(),
      visualizer({ open: true })
    ],
    server: {
      proxy: {
        "/api": {
          target: env.VITE_BACKEND_URL || 'http://localhost:8000',
          changeOrigin: true,
          secure: false,
          rewrite: (path: string) => path,
          configure: (proxy, _options) => {
            proxy.on('error', (err, _req, _res) => {
              console.log('proxy error', err);
            });
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              console.log('Sending Request to the Target:', req.method, req.url);
            });
            proxy.on('proxyRes', (proxyRes, req, _res) => {
              console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
            });
          },
        }
      },
      cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
      },
    },
    esbuild: {
      legalComments: "none",
      drop: ["console", "debugger"],
    },
    optimizeDeps: {
      include: ["react", "react-dom", "react-router-dom"],
      force: true,
    },
    build: {
      modulePreload: {
        polyfill: false,
      },
      sourcemap: false,
      target: "esnext",
      minify: "esbuild",
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
      rollupOptions: {
        output: {
          treeshake: true,
          output: {
            manualChunks(id: string[]) {
              if (id.includes("node_modules")) {
                if (id.includes("react")) return "react-vendor";
                if (id.includes("@mui")) return "mui-vendor";
                if (id.includes("chart.js")) return "chart-vendor";
                if (id.includes("axios")) return "network-vendor";
                return "vendor";
              }
            },
          },
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
        },
      },
      cssCodeSplit: true,
      chunkSizeWarningLimit: 1500,
    },
  };
});
