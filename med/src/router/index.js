import Vue from 'vue'
import VueRouter from 'vue-router'
import jsCookie from 'js-cookie'

import Main from '../pages/Main/Main.vue'
import Navigator from '../pages/Navigator/Navigator.vue'
import MedNews from '../pages/MedNews/MedNews.vue'
import Personal from '../pages/Personal/Personal.vue'
import Ai from '../pages/Ai/Ai.vue'
import EachMedNews from '../pages/MedNews/EachMedNews/EachMedNews.vue'
import MainMedNews from '../pages/MedNews/MainMedNews/MainMedNews.vue'
import NavDetail from '../pages/Navigator/NavDetail/NavDetail.vue'
import NavMain from '../pages/Navigator/NavMain/NavMain.vue'
import NavFilter from '../pages/Navigator/NavFilter/NavFilter.vue'
import Register from '../pages/Verify/register.vue'
import Login from '../pages/Verify/login.vue'
import Add from '../pages/Main/Add/Add.vue'
import List from '../pages/Main/List/List.vue'
import Revise from '../pages/Main/Revise/Revise.vue'
import Schedule from '../pages/Schedule/Schedule.vue'
import More from '../pages/More/More.vue'
import Weather from '../pages/Weather/Weather.vue'
import AiSetting from '../pages/Ai/Setting/AiSetting.vue'
import ImageGenerator from '../pages/ImageGenerator/ImageGenerator.vue'
import ImageHistory from '../pages/ImageGenerator/ImageHistory/ImageHistory'
import News from '../pages/News/News.vue'
import Stock from '../pages/Stock/Stock.vue'
import StockInfo from '../pages/Stock/StockInfo/StockInfo.vue'
import Word from '../pages/Word/Word.vue'
import WordTest from '../pages/Word/WordTest/WordTest.vue'
import WordOption from '../pages/Word/WordOption/WordOption.vue'
import Movie from '../pages/Movie/Movie.vue'
import SecondHand from '../pages/SecondHand/SecondHand.vue'
import Calendar from '../pages/Main/Calendar/Calendar.vue'
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
            },
            {
                path:'calendar',
                component: Calendar
            }]
        },
        {
            path:'/schedule',
            component:Schedule
        },
        {
            path:'/navigator',
            component:Navigator,
            children:[{
                path:'',
                component:NavMain,
                meta: { keepAlive: true }
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
            path:'/more',
            component:More,
        },
        {
            path:'/weather',
            component:Weather,
        },
        {
            path:'/medNews',
            component:MedNews,
            children:[{
                path:'',
                component:MainMedNews,
            },
            {
                path:'detail',
                component:EachMedNews,
            }]
        },
        {
            path:'/ai',
            component:Ai
        },
        {
            path:'/aiSetting',
            component:AiSetting
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
            path:'/imageGenerator',
            component:ImageGenerator
        },
        {
            path:'/imageHistory',
            component:ImageHistory
        },
        {
            path:'/news',
            component:News
        },
        {
            path:'/stock',
            component:Stock
        },
        {
            path:'/stockInfo',
            component:StockInfo
        },
        {
            path:'/word',
            component:Word
        },
        {
            path:'/word/test',
            component:WordTest
        },
        {
            path:'/word/option',
            component:WordOption
        },
        {
            path:'/movie',
            component:Movie
        },
        {
            path:'/secondHand',
            component:SecondHand
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