<template>
  <div>
    <div class="top">
      <i class="fa-solid fa-chevron-left back" @click="$router.back()"></i>
      <i class="fa-solid fa-hand-holding-medical"></i> Smart Assistant 
    </div>
    <div class="main">
        <div class="block">
            <div class="title">隨機度</div>
            <el-slider v-model="setting.temperature" class="slider" :min="0" :step="0.1" :max="2"></el-slider>
        </div>
        <div class="block">
            <div class="title">創意性</div>
            <el-slider v-model="setting.presence_penalty" class="slider" :min="-2" :max="2" :step="0.1"></el-slider>
        </div>
        <div class="block">
            <div class="title">詞彙量</div>
            <el-slider v-model="setting.frequency_penalty" class="slider" :min="-2" :max="2" :step="0.1"></el-slider>
        </div>
        <div class="block">
            <div class="title">輸出量</div>
            <el-slider v-model="setting.max_tokens" class="slider" :min="0" :max="2000" :step="100"></el-slider>
        </div>
    </div>
  </div>
</template>

<script>
import {host} from '../../../serverPath.js'
import jsCookie from 'js-cookie';
import axios from 'axios';
export default {
    name:'AiSetting',
    data(){
        return {
            setting:{
                temperature:1,
                max_tokens:1000,
                frequency_penalty:0,
                presence_penalty:0,
            },
        }
    },
    mounted(){
        this.getData();
    },
    beforeDestroy(){
        this.sendData();
    },
    methods:{
        sendData(){
            axios.post(`${host}/aiSetting/record`,{
                record:this.setting
            },
            {
                headers:{
                    'user-token':jsCookie.get('token')
                }
            })
            .then(res=>{
                if(res.data=='success'){}
                else this.$bus.$emit('handleAlert','Failed To Adjust Setting','error');
            })
            .catch(e=>{
                this.$bus.$emit('handleAlert','Adjust Setting Error When Connecting Server','error');
            })
        },
        getData(){
            axios.get(`${host}/aiSetting/get/${jsCookie.get('token')}`)
            .then(res=>{
                if(res.data!='new'){
                    this.setting = res.data;
                }
                else if(res.data=='new'){}
                else this.$bus.$emit('handleAlert','Failed To Getting Adjust Setting','error');
            })
            .catch(e=>{
                this.$bus.$emit('handleAlert','Getting Setting Error When Connecting Server','error');
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
        overflow: scroll;
    }
    .block{
        width: 100%;
        padding-left: 25px;
        padding-right: 25px;
        height: 80px;
        margin: 0 auto;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
    }
    .title{
        width: 15%;
        font-weight: bold;
    }
    .title2{
        width: 30%;
        font-weight: bold;
    }
    .slider{
        width: 85%;
    }
    .group{
        width: 100% !important;
        margin-left: 6px;
    }
</style>