const pkg = require('./package')
const bodyParser = require('body-parser')
const axios = require('axios')

module.exports = {
  mode: 'universal', // or 'spa'

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Open+Sans'
      }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fa923f', height: '4px', duration: 5000 },

  // if mode = 'spa'
  // loadingIndicator: /* spinner */ { name: 'circle', color: '#fa923f' }

  /*
  ** Global CSS
  */
  css: ['~assets/styles/main.css'],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: ['~plugins/core-components.js', '~plugins/date-filter.js'],

  /*
  ** Nuxt.js modules
  * for example '@nuxtjs/axios'
  * https://github.com/nuxt-community/awesome-nuxt#modules
  */
  modules: [],

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  },

  /*
  ** Your environment variables
  */
  env: {
    baseURL: process.env.BASE_URL || 'http://localhost:3001'
  },

  /*
  ** Router extra config
  */
  router: {
    // No 404 errors
    extendRoutes(routes, resolve) {
      routes.push({
        path: '*',
        component: resolve(__dirname, 'pages/index.vue')
      })
    },
    linkActiveClass: 'active' // to attach 'active' css class to active route
    // middleware: 'log'
  },

  transition: {
    name: 'fade',
    mode: 'out-in'
  },

  // Node/Express compatable middlewares prior to Nuxt rendering process
  serverMiddleware: [bodyParser.json(), '~/api'],

  generate: {
    routes: function() {
      return axios
        .get('http://localhost:3001/posts')
        .then(response =>
          response.data.map(p => ({ route: `/posts/${p.id}`, payload: { postData: p } }))
        )
    }
  }
}
