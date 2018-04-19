// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'leaflet/dist/leaflet.css'

import '../static/app.scss'

import Vue from 'vue'
import { mapActions } from 'vuex'

import axios from 'axios'
import VueAxios from 'vue-axios'

import App from './App'
import router from './router'
import store from './store'
import { getItems, getProperties } from './services/hior'

Vue.use(VueAxios, axios)
Vue.config.productionTip = false

/* eslint-disable no-new */
let vueApp = new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>',
  methods: {
    ...mapActions({
      setItems: 'setItems',
      setProperties: 'setProperties'
    }),
    async init () {
      const items = await getItems()
      const properties = await getProperties()

      this.setItems(items)
      this.setProperties(properties)
    }
  }
})

vueApp.init()
