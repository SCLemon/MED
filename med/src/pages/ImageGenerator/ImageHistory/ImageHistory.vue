<template>
  <div>
    <div class="top">
        <i class="fa-solid fa-chevron-left back"  @click="$router.replace('/imageGenerator')"></i>
        <i class="fa-regular fa-images"></i> Image Generator History
    </div>
    <div class="main">
      <router-link :to="{path:'/imageGenerator',query:{'ImageDetail':obj}}" class="block" v-for="(obj,id) in list" :key="id">
        <div class="title">{{obj.record.setting.prompt}}</div>
        <i class="fa-solid fa-chevron-right right"></i>
        <div class="date">{{obj.date}}</div>
      </router-link>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { host } from '../../../serverPath';
import jsCookie from 'js-cookie';
export default {
    name:'ImageHistory',
    data(){
      return{
        list:[]
      }
    },
    mounted(){
      this.getData();
    },
    methods:{
      getData(){
        axios.get(`${host}/imageHistory/get/${jsCookie.get('token')}`)
        .then(res=>{
          if(res.data=='new'){}
          else{
            this.list = res.data.reverse();
          }
        })
        .catch(e=>{
          console.log(e)
          this.$bus.$emit('handleAlert','Getting Image History Error','error')
        })
      }
    }
}
</script>

<style scoped>
  .top{
        top:0;
        width:100%;
        height: 60px;
        text-align: center;
        line-height: 60px;
        font-size: 20px;
        font-weight: bold;
        position: relative;
        border-bottom:0.1px solid rgb(210, 210, 210);
    }
    .back{
      position: absolute;
      left: 0px;
      text-align: center;
      line-height: 60px;
      top: 0px;
      font-size: 20px;
      height: 60px;
      z-index:999;
      width: 60px;
    }
    .back:hover{
      cursor: pointer;
    }
    .main{
      width: 100%;
      height: calc(100vh - 130px);
      overflow-y: scroll;
    }
    .block{
      width: 100%;
      height: calc((100vh - 130px) / 7);
      text-decoration: none;
      color: black;
      border-bottom: 1px solid rgba(240,240,240);
      display: flex;
      align-items: center;
      padding-left: 20px;
      justify-content: space-evenly;
      position: relative;
    }
    .title{
      width: 85%;
      font-size: 18px;
      word-break: break-all;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
    }
    .right{
      width: 15%;
      text-align: center;
      font-size: 18px;
    }
    .date{
      position: absolute;
      top: 10px;
      left: 10px;
      font-size: 12px;
      color: rgba(190,190,190);
    }
</style>