import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { createHtmlPlugin } from 'vite-plugin-html'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // OWASP A05:2021 - Security Misconfiguration
    // Content Security Policy headers for production
    // NOTE: frame-ancestors and X-Frame-Options must be set via HTTP headers (Nginx/Cloudflare)
    createHtmlPlugin({
      minify: true,
      inject: {
        tags: [
          {
            tag: 'meta',
            attrs: {
              'http-equiv': 'Content-Security-Policy',
              content: [
                "default-src 'self'",
                "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Required for Vite HMR and React
                "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
                "font-src 'self' https://fonts.gstatic.com",
                "img-src 'self' data: blob: https:",
                "connect-src 'self' ws: wss: https://polygon-rpc.com https://*.infura.io https://*.alchemy.com",
                "worker-src 'self' blob:", // Required for Web Workers
                "base-uri 'self'",
                "form-action 'self'",
              ].join('; ')
            }
          },
          // X-Content-Type-Options
          {
            tag: 'meta',
            attrs: {
              'http-equiv': 'X-Content-Type-Options',
              content: 'nosniff'
            }
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@games': path.resolve(__dirname, './src/games'),
      '@constants': path.resolve(__dirname, './src/constants'),
    }
  }
})

