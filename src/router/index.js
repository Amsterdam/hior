import Vue from 'vue'
import Router from 'vue-router'
import Home from '../components/Home/Home'
import Search from '../components/Search/Search'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: '/hior',
  routes: [
    {
      path: '/',
      redirect: '/home'
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
