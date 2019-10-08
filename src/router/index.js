import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/views/main'
import store from '@/store'
import iView from 'iview'
import {getToken, setToken} from "../api/user";
Vue.use(Router)
const router=new Router({
  base:'/pipeline-system',
  mode:'history',
  routes: [
    {
      path: '/',
      redirect:'/home',
    },
    {
      path:'/home',
      name:'home',
      component:Main
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login')
    }
  ]
});
const LOGIN_PAGE_NAME = 'login'
router.beforeEach((to,from,next)=>{
  iView.LoadingBar.start();
  const token=getToken();
  if(!token&&to.name!==LOGIN_PAGE_NAME){
    //未登录且要跳转的页面不是登录页
    next({
      name:LOGIN_PAGE_NAME //跳转到登录页面
    })
  }
  else if(!token&&to.name===LOGIN_PAGE_NAME){
    //未登录且要跳转的页面是登录页面
    next() // 跳转
  }
  else if(token&&to.name===LOGIN_PAGE_NAME){
    //已登录且要跳转的页面是登录页面
    next({
      name:'home'
    })
  }
  else{
    //已经登录且要跳转的不是登录界面
    if(store.state.user.hasGetInfo){
      //已经存在用户信息
      next()
    }
    else{
      store.dispatch('getUserInfo').then((res)=>{
        //成功拉取信息
        if(res.data.access){
          next()
        }
        else{
          setToken('')
          next({
            name:LOGIN_PAGE_NAME
          })
        }
      })
    }
  }

});
router.afterEach(to => {
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})
export default router
