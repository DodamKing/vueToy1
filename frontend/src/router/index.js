import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/index'
import test from '@/components/test'
import History from '@/components/history'

Vue.use(Router)

export default new Router({
  mode : 'history',
  routes: [
    { path: '/', name: 'index', component: Index },
    { path: '/test', name: 'test', component: test },
    { path : '/history', component : History },
  ]
})
