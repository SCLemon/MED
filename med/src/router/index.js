import Vue from 'vue'
import VueRouter from 'vue-router'
import jsCookie from 'js-cookie'

import Main from '../pages/Main/Main.vue'
import Navigator from '../pages/Navigator/Navigator.vue'
import News from '../pages/News/News.vue'
import Personal from '../pages/Personal/Personal.vue'
import Ai from '../pages/Ai/Ai.vue'
import EachNews from '../pages/News/EachNews/EachNews.vue'
import MainNews from '../pages/News/MainNews/MainNews.vue'
import NavDetail from '../pages/Navigator/NavDetail/NavDetail.vue'
import NavMain from '../pages/Navigator/NavMain/NavMain.vue'
import NavFilter from '../pages/Navigator/NavFilter/NavFilter.vue'
import Register from '../pages/Verify/register.vue'
import Login from '../pages/Verify/login.vue'
import Add from '../pages/Main/Add/Add.vue'
import List from '../pages/Main/List/List.vue'
import Revise from '../pages/Main/Revise/Revise.vue'
Vue.use(VueRouter)
const router = new VueRouter({
    routes:[
        {
            path:'/main',
            component:Main,
            children:[
            {
                path:'',
                component:List
            },
            {
                path:'add',
                component:Add
            },
            {
                path:'revise',
                component:Revise
            }]
        },
        {
            path:'/navigator',
            component:Navigator,
            children:[{
                path:'',
                component:NavMain,
            },
            {
                path:'detail',
                component:NavDetail,
            },
            {
                path:'filter',
                component:NavFilter,
            }]
        },
        {
            path:'/news',
            component:News,
            children:[{
                path:'',
                component:MainNews,
            },
            {
                path:'detail',
                component:EachNews,
            }]
        },
        {
            path:'/ai',
            component:Ai
        },
        {
            path:'/personal',
            component:Personal
        },
        {
            path:'/verify/register',
            component:Register
        },
        {
            path:'/verify/login',
            component:Login
        },
        {
            path:'/',
            redirect:'/main'
        }
    ]
})
router.beforeEach((to, from, next) => {
    const token = jsCookie.get('token');
    if (to.path !== '/verify/register' && to.path !== '/verify/login' && !token) {
      next('/verify/login')
    } else {
      next()
    }
})
export default router