// nuxt.config.ts
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  // Disable SSR if you only need an SPA
  ssr: false,

  // Auto-import your components
  components: true,

  // Expose an API base URL to both server & client
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8000'
    }
  },

  // Load your client‐only Highcharts plugin
  plugins: [
    { src: '~/plugins/highcharts.client.js', mode: 'client' }
  ],

  // If you have any global CSS
  css: [
    // '~/assets/css/main.css',
  ],

  // Ensure Highcharts ESM modules get transpiled by Vite
  // (so that the “.src.js” imports work correctly)
  build: {
    transpile: [
      'highcharts',
      'highcharts/modules/exporting',
      'highcharts/highcharts-3d',
      'highcharts/modules/variable-pie',
      'highcharts/modules/heatmap'
    ]
  },

  // (optional) TypeScript strictness
  typescript: {
    strict: true
  }
})
