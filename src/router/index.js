import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/user/Login'
import Panel from '@/views/panel/Panel'

Vue.use(Router)

var router = new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/panel',
      name: 'Panel',
      component: Panel
    }
  ]
})

router.beforeEach((to, from, next) => {
  const isLogin = !!localStorage.token
  console.log(to.path)

  if (to.path === '/login') {
    next()
  } else {
    isLogin ? next() : next('/login') /* 真跳转  假登录 */
  }
})

export default router
