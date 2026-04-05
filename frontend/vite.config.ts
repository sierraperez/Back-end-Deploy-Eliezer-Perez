import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

function securityHeaders() {
  const addHeaders = (server: any) => {
    server.middlewares.use((req: any, res: any, next: any) => {
      const isDev = server.config.command === 'serve';
      const csp = "default-src 'self'; " +
        `script-src 'self' ${isDev ? "'unsafe-inline' 'unsafe-eval'" : ""}; ` +
        `script-src-elem 'self' ${isDev ? "'unsafe-inline'" : ""}; ` +
        "script-src-attr 'none'; " +
        "style-src 'self' 'unsafe-inline'; " +
        "img-src 'self' data: https://grainy-gradients.vercel.app https://images.unsplash.com; " +
        "font-src 'self' https://fonts.gstatic.com; " +
        "connect-src 'self' ws: localhost:* http: https:; " +
        "frame-ancestors 'none'; " +
        `${!isDev ? "upgrade-insecure-requests; " : ""}` +
        "base-uri 'self'; " +
        "form-action 'self';";

      res.setHeader('Content-Security-Policy', csp);
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
      res.setHeader('X-Frame-Options', 'DENY');
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
      res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()');
      next();
    });
  };

  return {
    name: 'vite-plugin-security-headers',
    configureServer: addHeaders,
    configurePreviewServer: addHeaders,
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 5173,
      host: '0.0.0.0',
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          secure: false,
        }
      }
    },
    plugins: [react(), securityHeaders()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
