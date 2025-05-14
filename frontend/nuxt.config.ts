import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  ssr: false,           // SPA mode
  components: true,     // auto import your components

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8000'
    }
  },

  plugins: [
    { src: '~/plugins/highcharts.client.js', mode: 'client' }
  ],

  build: {
    // Make sure Vite bundles the UMD files correctly
    transpile: [
      'highcharts', 
      'highcharts/modules', 
      'highcharts/highcharts-3d'
    ]
  }
})
