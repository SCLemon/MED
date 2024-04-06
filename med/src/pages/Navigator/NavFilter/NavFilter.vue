<template>
  <div>
    <div class="header">
        <i class="fa-solid fa-chevron-left back" v-if="$route.path == '/navigator/filter'" @click="$router.back()"></i>
        <div class="second">Navigator Filter Parameter</div>
    </div>
    <div class="main">
        <div class="block">
            <div class="title">距離</div>
            <el-slider v-model="filter.distance" class="slider" :min="500" :step="500" :max="20000"></el-slider>
        </div>
        <div class="block">
            <div class="title">評分</div>
            <el-slider v-model="filter.score" class="slider" :min="1" :max="5" :step="1"></el-slider>
        </div>
        <div class="block">
            <div class="title">類別</div>
            <el-radio-group v-model="filter.option">
                <el-radio-button class="checkbox" label="醫院"></el-radio-button>
                <el-radio-button class="checkbox" label="餐廳"></el-radio-button>
                <el-radio-button class="checkbox" label="超商"></el-radio-button>
                <el-radio-button class="checkbox" label="其他"></el-radio-button>
            </el-radio-group>
        </div>
        <div class="block" v-if="filter.option=='醫院'">
            <div class="title">進階</div>
            <el-checkbox-group v-model="filter.hospitalSelectTypes">
                <el-checkbox-button  v-for="(t,id) in hospitalTypes" width=50% :label="t" :key="id">{{t}}</el-checkbox-button>
            </el-checkbox-group>
        </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import jsCookie from 'js-cookie';
export default {
    name:'NavFilter',
    data(){
        return {
            filter:{
                distance:7000,
                score:3,
                option:'醫院',
                hospitalSelectTypes:['一般','動物']
            },
            hospitalTypes:['一般','動物'],
        }
    },
    mounted(){
        this.getData();
    },
    methods: {
        sendData(){
            console.log(this.filter)
            axios.post('/filter/record',{
                record:this.filter
            },
            {
                headers:{
                    'user-token':jsCookie.get('token')
                }
            })
            .then(res=>{
                if(res.data=='success'){}
                else this.$bus.$emit('handleAlert','Failed To Adjust Filter','error');
            })
            .catch(e=>{
                this.$bus.$emit('handleAlert','Adjust Filter Error When Connecting Server','error');
            })
        },
        getData(){
            axios.get(`/filter/get/${jsCookie.get('token')}`)
            .then(res=>{
                if(res.data!='new'){
                    this.filter = res.data;
                }
                else if(res.data=='new'){}
                else this.$bus.$emit('handleAlert','Failed To Getting Adjust Filter','error');
            })
            .catch(e=>{
                this.$bus.$emit('handleAlert','Getting Filter Error When Connecting Server','error');
            })
        }
    },
    beforeDestroy(){
        this.sendData();
    }
}
</script>

<style scoped>
  .header{
      width:100%;
      height: 60px;
      line-height: 60px;
      text-align: center;
      font-weight: bolder;
      border-bottom:0.1px solid rgb(210, 210, 210);
      font-size: 20px;
      position: sticky;
      top:0;
      background-color: white;
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
    .slider{
        width: 85%;
    }
    .checkbox{
        width: 25%;
    }
    .el-checkbox-group{
        width: 85%;
    }
</style>