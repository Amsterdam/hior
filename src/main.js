// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import '../static/app.scss'

import Vue from 'vue'
import { mapActions } from 'vuex'

import axios from 'axios'
import VueAxios from 'vue-axios'
import vSelect from 'vue-select'
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'

import App from './App'
import router from './router'
import store from './store'
import { getAttributes, getItems, getProperties, getFAQ, getMetadata } from './services/hior'

Vue.use(VueAxios, axios)
Vue.use(Viewer)
Vue.config.productionTip = false

Vue.component('v-select', vSelect)

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
      setProperties: 'setProperties',
      setAttributes: 'setAttributes',
      setFAQ: 'setFAQ',
      setMetadata: 'setMetadata'
    }),

    /**
     * Start by loading items and properties
     * @returns {Promise<void>}
     */
    async init () {
      window.hideIntro && window.hideIntro() // Hide any introduction message

      const items = await getItems()
      const properties = await getProperties()
      const attributes = await getAttributes()
      const faq = await getFAQ()
      const metadata = await getMetadata()

      this.setItems(items)
      this.setProperties(properties)
      this.setAttributes(attributes)
      this.setFAQ(faq)
      this.setMetadata(metadata)
    }
  }
})

vueApp.init()
