<template>
    <div>
      <div class="main">
        <div class="searchBar">
          <input type="text" class="search" placeholder="Search for News" v-model="keyword" @change="getData()">
          <i class="fa-solid fa-magnifying-glass glass"></i>
        </div>
        <div class="title">Results</div>
        <div class="listBox">
            <div class="box" v-for="(obj,id) in list" :key="id">
              <router-link :to="{
                  path:'/news/detail',
                  query:{'NewsContent':obj}}"
              >
                <div class="img">
                  <img src="../../../assets/news.png" alt="">
                  <div class="hover">
                    <i class="fa-solid fa-rocket rocket"></i>
                  </div>
                </div>
              </router-link>
              <div class="content">
                <div class="cTitle" v-text="obj['標題']"></div>
                <div class="overview" v-text="obj['內容']"></div>
              </div>
            </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { format } from "date-fns";
  export default {
    name:'MainNews',
    data(){
      return{
        keyword:'',
        list:{}
      }
    },
    mounted(){
      this.getData();
    },
    methods:{
      getData(){
        var query = `https://www.hpa.gov.tw/wf/newsapi.ashx?keyword=${this.keyword}`;
        if(this.keyword=='') query+=`&startDate=${format(new Date()-86400*1000*30,'yyyy/MM/dd')}`;
        axios.get(query)
        .then(res=>{
          this.list=res.data;
        })
        .catch(res=>{
          console.log(res);
          this.getData();
        })
      },
    }
  }
  </script>
  
  <style scoped>
    .main{
      width: 85%;
      margin: 0 auto;
    }
    .title{
      font-size: 18px;
      line-height: 2.5;
    }
    .searchBar{
      margin-top: 20px;
      width:100%;
      border-radius: 7px;
      border: 0.1px solid rgb(190,190,190);
      display: flex;
      align-items: center;
      justify-content: space-evenly;
    }
    .search{
      width: 80%;
      height: 35px;
      border-radius: 7px;
      border: 0;
    }
    .listBox{
      width:100%;
      height: 475px;
      overflow-y: scroll;
      padding-bottom: 15px;
    }
    .box{
      width:100%;
      height: 100px;
      border-radius: 8px;
      margin-bottom: 15px;
      background: rgb(240, 240, 240);
      display: flex;
      justify-content: space-evenly;
      align-items: center;
    }
    .img{
      width: 80px;
      height: 80px;
      background-color: white;
      position: relative;
    }
    .hover{
      position: absolute;
      width: 80px;
      height: 80px;
      top:0;
      left:0;
      display: none;
      background-color: rgba(0,0,0, 0.8);
    }
    .rocket{
      line-height: 80px;
      font-size: 30px;
      color: rgba(255,255,255,0.9);
    }
    .img:active,.img:hover > .hover{
      display: flex;
      justify-content: center;
      align-content: center;
    }
    .img>img{
      width: 100%;
    }
    .content{
      width:210px;
      height: 80px;
      padding-left: 5px;
      padding-right: 5px;
    }
    .cTitle{
      width: 100%;
      line-height: 1.75;
      font-weight: bolder;
      font-size: 16px; 
      white-space: nowrap;
      overflow: scroll;
    }
    .overview{
      color: rgb(158, 158, 158);
      font-size: 12px;
      text-align: justify;
      word-break: break-all;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;
    }
  </style>