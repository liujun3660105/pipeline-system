import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/views/main'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path:'/login',
      name:'login',
      component:()=>import('@/views/login')
    },
    {
      path: '/',
      redirect:'/home',
      component:Main,
      children:[
        {
          path:'/home',
          name:'home',
          component:()=>import('@/views/home')
        }
      ]
    }
  ]
})
