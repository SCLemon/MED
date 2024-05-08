<template>
  <div>
    <div class="header">
        <div :class="`searchBar ${changelang?'':'open'}`">
            <div v-if="!changelang" :class="`searchInput`">
                <i class="fa-solid fa-magnifying-glass glass"></i>
                <input type="text" class="input" v-model="q" placeholder="Search news,media,topic, and etc.">
            </div>
            <el-select v-model="country" placeholder="请選擇地區" v-else>
                <el-option v-for="item in cities" :key="item.value" :label="item.label" :value="item.value">
                <span style="float: left">{{ item.label }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
            </el-option>
        </el-select>
            
        </div>
        <i class="fa-solid fa-globe globe" @click="changelang=!changelang"></i>
    </div>
    <div class="category">
        <div  v-for="cat in categories" :key="cat" :class="['cat-select', {'selected': category === cat}]" @click="category = cat">{{ cat }}</div>
    </div>
    <div class="main">
        <div class="headline">Curated For You</div>
        <div class="listBox" ref="listBox" @scroll="scrolling()">
            <a :href="obj.url" target="bd" v-for="(obj,id) in articles" :key="id" class="link">
                <div class="list">
                    <div class="artist"><i class="fa-solid fa-database pen"></i>{{ obj.source.name }}</div>
                    <div class="title">
                        <div :class="`text ${country=='us'?'':'text-open'}`">{{ obj.title }}</div>
                        <img class="img" :src="obj.urlToImage" alt="" v-if="country=='us'">
                    </div>
                    <div class="date">
                        <i class="fa-solid fa-calendar-days calendar"></i> {{ handleDate(obj.publishedAt) }}
                        <i class="fa-solid fa-palette clock"></i> {{ obj.author }}
                    </div>
                </div>
            </a>
        </div>
    </div>
  </div>
</template>

<script>
import {format} from 'date-fns'
import axios from 'axios'
export default {
    name:'News',
    data(){
        return{
            final:false,
            changelang:false,
            categories: ['business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology'],
            category: 'business',
            q:'',
            articles:[],
            page:1,
            country:'us',
            cities: [
                {value: 'ae',label: '阿聯'}, {value: 'ar',label: '阿根廷'}, {value: 'at',label: '奧地利'},
                {value: 'au',label: '澳洲'}, {value: 'be',label: '比利時'}, {value: 'bg',label: '保加利亞'},
                {value: 'br',label: '巴西'}, {value: 'ca',label: '加拿大'}, {value: 'ch',label: '瑞士'},
                {value: 'cn',label: '中國'}, {value: 'co',label: '哥倫比亞'}, {value: 'cu',label: '古巴'},
                {value: 'cz',label: '捷克'}, {value: 'de',label: '德國'}, {value: 'eg',label: '埃及'},
                {value: 'fr',label: '法國'}, {value: 'gb',label: '英國'}, {value: 'gr',label: '希臘'},
                {value: 'hk',label: '香港'}, {value: 'hu',label: '匈牙利'}, {value: 'id',label: '印度尼西亞'},
                {value: 'ie',label: '愛爾蘭'}, {value: 'il',label: '以色列'}, {value: 'in',label: '印度'},
                {value: 'it',label: '義大利'}, {value: 'jp',label: '日本'}, {value: 'kr',label: '南韓'},
                {value: 'lt',label: '立陶宛'}, {value: 'lv',label: '拉脫維亞'}, {value: 'ma',label: '摩洛哥'},
                {value: 'mx',label: '墨西哥'}, {value: 'my',label: '馬來西亞'}, {value: 'ng',label: '奈及利亞'},
                {value: 'nl',label: '荷蘭'}, {value: 'no',label: '挪威'}, {value: 'nz',label: '紐西蘭'},
                {value: 'ph',label: '菲律賓'}, {value: 'pl',label: '波蘭'}, {value: 'pt',label: '葡萄牙'},
                {value: 'ro',label: '羅馬尼亞'}, {value: 'rs',label: '塞爾維亞'}, {value: 'ru',label: '俄羅斯'},
                {value: 'sa',label: '沙烏地阿拉伯'}, {value: 'se',label: '瑞典'}, {value: 'sg',label: '新加坡'},
                {value: 'si',label: '斯洛維尼亞'}, {value: 'sk',label: '斯洛伐克'}, {value: 'th',label: '泰國'},
                {value: 'tr',label: '土耳其'}, {value: 'tw',label: '臺灣'}, {value: 'ua',label: '烏克蘭'},
                {value: 'us',label: '美國'}, {value: 've',label: '委內瑞拉'}, {value: 'za',label: '南非'},
            ],
        }
    },
    mounted(){
       this.getData();
    },
    watch:{
        category:{
            deep:true,
            handler:function(){
                this.page=1;
                this.final=false,
                this.getData();
            }
        },
        country:{
            deep:true,
            handler:function(){
                this.page=1;
                this.final=false,
                this.getData();
            }
        },
        q:{
            deep:true,
            handler:function(){
                this.page=1;
                this.final=false,
                this.getData();
            }
        },
    },
    methods:{
        handleDate(date){
            return format(new Date(date),'yyyy-MM-dd')
        },
        getData(){
            if(!this.final){
                axios.get(`/api/news?country=${this.country}&q=${this.q}&category=${this.category}&page=${this.page}`)
                .then(res=>{
                    if(res.data.articles.length){
                        if(this.page==1) {
                            var el = this.$refs.listBox;
                            el.scrollTop=0;
                            this.articles = res.data.articles;
                        }
                        else this.articles = this.articles.concat(res.data.articles);
                    }
                    else {
                        this.final = true;
                        this.$bus.$emit('handleAlert','This is the last page of the news.','warning');
                    }
                })
                .catch(e=>{
                    this.$bus.$emit('handleAlert','Failed To Get Breaking News','error');
                })
            }
        },
        scrolling(){
            var el = this.$refs.listBox;
            if(el.offsetHeight+el.scrollTop>=el.scrollHeight-5){
                this.page++;
                this.getData();
            }
        }
    }
}
</script>

<style scoped>
    .header{
        padding-top: 30px;
        width:100%;
        height: 80px;
        display: flex;
        align-items: center;
    }
    .searchBar{
        width: 80%;
        height: 50px;
        margin: 0 auto;
        border-radius: 5px;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        color: rgba(190,190,190);
    }
    .open{
        background-color: rgba(240,240,240);
    }
    .searchInput{
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        width: 100%;
    }
    .globe{
        width: 10%;
        font-size: 20px;
    }
    .glass{
        width: 10%;
        text-align: center;
    }
    .input{
        width: 80%;
        border: 0;
        background: transparent;
        font-size: 16px;
    }
    .category{
        width:90%;
        margin: 0 auto;
        margin-top: 10px;
        height: 60px;
        overflow-y: scroll;
        white-space: nowrap;
        display: flex;
        align-items: center;
        padding-right: 5px;

    }
    .cat-select{
        display: inline-block;
        margin-right: 7px;
        border: 1px solid rgba(235,235,235);
        padding-top: 5px;
        padding-bottom: 5px;
        padding-left: 10px;
        padding-right: 10px;
        border-radius: 15px;
        color: rgba(190,190,190);

    }
    .cat-select:hover{
        cursor: pointer;
    }
    .selected{
        background-color: black;
        color: white;
        border: 1px solid black;
    }
    .main{
        width: 100%;
    }
    .headline{
        width: 90%;
        font-size: 24px;
        margin: 0 auto;
        height: 40px;
        line-height: 40px;
        font-weight: bolder;   
    }
    .listBox{
        width: 100%;
        height: calc(100vh - 270px);
        margin-top: 10px;
        overflow-y: scroll;
    }
    .list{
        width: 100%;
        height: calc((100vh - 270px) / 3);
        border-bottom: 1px solid rgba(230,230,230);
        text-decoration: none;
        color: black;
    }
    .artist{
        width:95%;
        height: calc((100% - 75px) / 2);
        display: flex;
        align-items: center;
        padding-left: 10px;
        color: rgba(190,190,190);
        white-space: nowrap;
        overflow-x: hidden;
    }
    .pen{
        margin-right: 10px;
    }
    .title{
        width:100%;
        height: 75px;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
    }
    .text{
        width: 60%;
        height: 100%;
        font-weight: bolder;
        font-size: 16.5px;
        line-height: 25px;
        text-align: left;
        word-break: break-all;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        overflow: hidden;
    }
    .text-open{
        width:90%;
    }
    .img{
        width: 30%;
    }
    .date{
        width:100%;
        height: calc((100% - 75px) / 2);
        display: flex;
        align-items: center;
        padding-left: 10px;
        color: rgba(190,190,190);
    }
    .calendar{
        margin-right: 10px;
    }
    .clock{
        margin-left: 15px;
        margin-right: 10px;
    }
    .link{
        text-decoration: none;
    }
</style>