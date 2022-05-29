import Vue from 'vue'
import VueRouter from 'vue-router'
const Login = ()=>import ('../views/Login/Login')
const resgister =()=>import('../views/resgister/resgister.vue')
const home = ()=>import ('../views/home/home.vue')
const admin = ()=>import ('../views/admin/admin.vue')
const room = ()=>import ('../views/room/room.vue')
const guest = ()=>import ('../views/guest/guest.vue')
const changepwd = ()=>import ('../views/user/changepwd')
const person = ()=>import  ('../views/user/person')

Vue.use(VueRouter)

const routes = [
  {//登录页
    path: '/',
    component: Login,
    title:'酒店管理系统'
  },
  {//登录页
    path: '/login',
    component: Login
  },
  {//注册页s
    path: '/resgister',
    component: resgister
  },
  //内容主页
  {
    path: '/home',
    component: home,
    children: [
      {
        path: 'admin',
        component: admin
      },
      {
        path: '',
        component: room
      },
      {
        path: 'room',
        component: room,
      },
      {
        path: 'guest',
        component: guest
      },
      {
        path: 'changepwd',
        component: changepwd,
      },
      {
        path: 'person',
        component: person
      },
    ]

  }
]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  //to 将要访问的路径
  //from 从哪个路径来的
  //next 函数，表示放行
  if (to.path === '/login' || to.path === '/resgister') return next();
  const tokenStr = window.sessionStorage.getItem('token');
  if (!tokenStr) return next('/login')
  next()
})
export default router
