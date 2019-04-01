import Vue from 'vue'

import promise from 'es6-promise'
import 'normalize.css/normalize.css'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import vuescroll from 'vuescroll/dist/vuescroll-native'
import 'vuescroll/dist/vuescroll.css'

// import '@/utils/ddfreelogin' //钉钉免登

import App from './App'
import router from './router'
import store from './store'

import '@/permission'

promise.polyfill()
Vue.use(ElementUI)
Vue.use(vuescroll)
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
