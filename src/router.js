import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/songs',
      name: 'songs',
      component: () => import('./views/List.vue')
    },
    {
      path: '/artist',
      name: 'artis',
      component: () => import('./views/Bands.vue')
    },
    {
      path: '/songs/:id',
      name: 'song',
      component: () => import('./views/Details.vue')
    },
    {
      path: '/songs/tags/:tag',
      name: 'taglist',
      component: () => import('./views/Tags.vue')
    },
    {
      path: '/download',
      name: 'download',
      component: () => import('./views/Download.vue')
    },
  ]
})
