import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Jails from './views/Jails.vue'
import JailDetail from './views/JailDetail.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/jails',
      name: 'jails',
      component: Jails
    },
    {
      path: '/jail/:jailname',
      name: 'jaildetail',
      component: JailDetail,
      props: true
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    }
  ]
})
