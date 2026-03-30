// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  ssr: false,
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      title: 'EstudiaUni.cl - Preparación PAES Inteligente'
    }
  },
  components: {
    dirs: []
  },
  vite: {
    build: {
      modulePreload: {
        polyfill: false
      }
    }
  }
})
