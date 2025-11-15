import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import { auth } from '@/util/auth_util/auth_util'
import { message } from '@/util/message_util/message_util'

const routes = [
  {
    path:'/',
    component:()=>import('@/page/tourist_page/tourist_root.vue'),
    children:[
      {
        path:'',
        component:()=>import('@/page/tourist_page/home/home_page.vue'),
      },
      {
        path:'about',
        component:()=>import('@/page/tourist_page/about/about_page.vue')
      },
      {
        path:'article',
        component:()=>import('@/page/tourist_page/article/article_show_page.vue')
      }
    ] 
  },
  {
    path:'/admin',
    component:()=>import('@/page/admin_page/admin_root.vue'),
    meta:{
      requiresAuth: true  // 需要登录才能访问
    },
    children:[
      {
        path:'',
        component:()=>import('@/page/admin_page/home/admin_home.vue')
      },
      {
        path:'article',
        component:()=>import('@/page/admin_page/article/article_page.vue')
      },
      {
        path:'category',
        component:()=>import('@/page/admin_page/category/category_page.vue')
      },
      {
        path:'tag',
        component:()=>import('@/page/admin_page/tag/tag_page.vue')
      },
      {
        path:'data',
        component:()=>import('@/page/admin_page/data_statistics/data_statistics_page.vue')
      }
    ]
  },
  {
    path:'/login',
    component:()=>import('@/page/login_page/login_page.vue'),
    meta: {
      requiresGuest: true  // 只有未登录用户才能访问
      }
  },
  {
    path:'/article/detail',
    component:()=>import('@/page/common/article_detail.vue'),//切换到文章页
  }
]
const router = createRouter({
  history: createWebHashHistory(),
  routes: routes,
})
router.beforeEach(async(to,from,next)=>{
    if(to.meta.requiresAuth){
      try{
        const response = await auth();
        if(response.data.code===0){//请求成功的状态
          next();
        }else{//负责页面跳转的鉴权
          console.log(response);
          message('error',response.data.message);
          next('/login')
        }
      }catch(error){
        console.log('前置路由守卫的鉴权接口出错',error);
        next('/login');
      }
    }else{
      next();
    }
})

export default router
