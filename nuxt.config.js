module.exports = {
  mode: 'universal',

  /*
   ** Headers of the page
   */
  head: {
    title: 'TCL开单平台',
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content:
          'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0, viewport-fit=cover'
      },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-touch-fullscreen', content: 'yes' },
      {
        hid: 'description',
        name: 'description',
        content: 'TCL,TCL大国品牌,TCL移动开单平台'
      }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: '/css/index.css' }
    ]
  },

  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#1989fa' },

  /*
   ** Global CSS
   */
  css: [
    // 'ant-design-vue/dist/antd.css',
    // 'vant/lib/index.css',
    '@/assets/less/main.less'
  ],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: ['@/plugins/index', '@/plugins/axios'],
  router: {
    middleware: 'check-auth'
  },
  /*
   ** Nuxt.js modules
   */
    modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios'
    ],
    /*
    ** Axios module configuration
    */
    axios: {
        proxy: true,
        credentials: true
        // See https://github.com/nuxt-community/axios-module#options
    },
    proxy: [
        [
        '/api',
        {
            target: 'http://10.73.129.246:8570',
            changeOrigin: true,
            pathRewrite: {
                '/api': ''
            }
        }
        ]
        // [
        //   '/service',
        //   {
        //     target: 'https://cvd.xiaoduoai.com',
        //     changeOrigin: true,
        //     pathRewrite: {
        //       '/service': ''
        //     }
        //   }
        // ]
    ],
  /*
   ** Build configuration
   */
  build: {
    vendor: ['axios'],
    postcss: [
      require('postcss-px2rem')({
        remUnit: 100
      })
    ],
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        // config.module.rules.push({
        //   enforce: 'pre',
        //   test: /\.(js|vue)$/,
        //   loader: 'eslint-loader',
        //   exclude: /(node_modules)/
        // })
      }
    }
  }
}
