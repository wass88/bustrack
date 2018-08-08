import Vue from 'vue'
import Router from 'vue-router'
import Vuetify from 'vuetify'
import Tracker from '@/components/Tracker'
import User from '@/components/User'
import Log from '@/components/Log'
import Target from '@/components/Target'
import Map from '@/components/Map'

Vue.use(Router)
Vue.use(Vuetify, { iconfont: 'mdi' })

import 'vuetify/dist/vuetify.min.css'
import '@mdi/font/css/materialdesignicons.css'

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Tracker',
      component: Tracker
    },
    {
      path: '/user',
      name: 'User',
      component: User
    },
    {
      path: '/log',
      name: 'Log',
      component: Log
    },
    {
      path: '/target',
      name: 'Target',
      component: Target
    },
    {
      path: '/map',
      name: 'Map',
      component: Map
    }
  ]
})

import {init} from '@/firebase.js'
init();