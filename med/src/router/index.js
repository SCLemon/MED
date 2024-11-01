import Vue from 'vue'
import VueRouter from 'vue-router'
import jsCookie from 'js-cookie'
import axios from 'axios'

Vue.use(VueRouter)

const router = new VueRouter({
    routes:[
        {
            path:'/main',
            component: () => import('../pages/Main/Main.vue'),
            children:[
            {
                path:'',
                component: () => import('../pages/Main/List/List.vue')
            },
            {
                path:'add',
                component: () => import('../pages/Main/Add/Add.vue')
            },
            {
                path:'revise',
                component: () => import('../pages/Main/Revise/Revise.vue')
            },
            {
                path:'calendar',
                component: () => import('../pages/Main/Calendar/Calendar.vue')
            }]
        },
        {
            path:'/navigator',
            component: () => import('../pages/Navigator/Navigator.vue'),
            children:[
            {
                path:'',
                component: () => import('../pages/Navigator/NavMain/NavMain.vue'),
                meta: { keepAlive: true }
            },
            {
                path:'detail',
                component: () => import('../pages/Navigator/NavDetail/NavDetail.vue'),
                meta: { keepAlive: true }
            },
            {
                path:'filter',
                component: () => import('../pages/Navigator/NavFilter/NavFilter.vue'),
                meta: { keepAlive: false }
            }]
        },
        {
            path:'/ubike',
            component: () => import('../pages/Ubike/Ubike.vue')
        },
        {
            path:'/more',
            component: () => import('../pages/More/More.vue')
        },
        {
            path:'/weather',
            component: () => import('../pages/Weather/Weather.vue')
        },
        {
            path:'/ai',
            component: () => import('../pages/Ai/Ai.vue')
        },
        {
            path:'/aiSetting',
            component: () => import('../pages/Ai/Setting/AiSetting.vue')
        },
        {
            path:'/personal',
            component: () => import('../pages/Personal/Personal.vue')
        },
        {
            path:'/verify/register',
            component: () => import('../pages/Verify/register.vue')
        },
        {
            path:'/verify/login',
            component: () => import('../pages/Verify/login.vue')
        },
        {
            path:'/imageGenerator',
            component: () => import('../pages/ImageGenerator/ImageGenerator.vue')
        },
        {
            path:'/imageHistory',
            component: () => import('../pages/ImageGenerator/ImageHistory/ImageHistory.vue')
        },
        {
            path:'/news',
            component: () => import('../pages/News/News.vue')
        },
        {
            path:'/stock',
            component: () => import('../pages/Stock/Stock.vue')
        },
        {
            path:'/stockInfo',
            component: () => import('../pages/Stock/StockInfo/StockInfo.vue')
        },
        {
            path:'/word',
            component: () => import('../pages/Word/Word.vue')
        },
        {
            path:'/word/test',
            component: () => import('../pages/Word/WordTest/WordTest.vue')
        },
        {
            path:'/word/option',
            component: () => import('../pages/Word/WordOption/WordOption.vue')
        },
        {
            path:'/movie',
            component: () => import('../pages/Movie/Movie.vue')
        },
        {
            path:'/secondHand',
            component: () => import('../pages/SecondHand/SecondHand.vue')
        },
        {
            path:'/',
            redirect:'/main'
        }
    ]
});
router.beforeEach((to, from, next) => {
    const token = jsCookie.get('token');
    axios.get(`/userInfo/get/${token?token:undefined}`)
    .then(res=>{
        if (to.path !== '/verify/register' && to.path !== '/verify/login' && typeof res.data != 'object') {
            next('/verify/login')
        }
        else next()
    })
})
export default router