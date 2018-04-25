import Vue from 'vue'
import Router from 'vue-router'
import Home from '../components/Home/Home'
import Search from '../components/Search/Search'
import Sources from '../components/Sources'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/sources',
      name: 'Sources',
      component: Sources
    },
    {
      path: '/home',
      name: 'Home',
      component: Home
    },
    {
      path: '/search',
      name: 'Search',
      component: Search
    }
  ]
})
