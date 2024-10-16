<template>
  <div class="main">
    <div class="title">Title</div>
    <el-input placeholder="Please Input Your Title" class="input" v-model="title" clearable ></el-input>
    <div class="eachBox">
        <div class="time time1">
            <div class="title">Date</div>
            <el-date-picker v-model="date" type="date" placeholder="Please Select the Date" class="picker"
                :picker-options="pickOptions"
            ></el-date-picker>
        </div>
        <div class="time">
            <div class="title">Period</div>
            <el-select v-model="period" placeholder="请选择" class="select">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
        </div>
    </div>
    <div class="title">Content</div>
    <el-input
        type="textarea"
        :autosize="{ minRows: 5, maxRows: 11}"
        placeholder="请输入内容"
        v-model="content">
    </el-input>
    <div class="btn" @click="sendData()">Add</div>
  </div>
</template>

<script>
import {host} from '../../../serverPath'
import jsCookie from 'js-cookie';
import axios from 'axios';
import { format } from "date-fns";
export default {
    name:'Add',
    data(){
        return{
            title:'',
            date:'',
            period: '',
            status:false,
            content:'',
            mail:this.$route.query.mail,
            options: [{
                value: 'morning',
                label: '早晨'
                }, {
                value: 'noon',
                label: '中午'
                }, {
                value: 'afternoon',
                label: '晚間'
                }, {
                value: 'night',
                label: '睡前'
            }],
            pickOptions:{
                disabledDate(time){
                    return time.getTime() < Date.now()-86400*1000
                }
            }
        }
    },
    methods:{
        sendData(){
            if(this.title.trim()=='' || this.date=='' || this.date == null || this.period.trim()=='') this.$bus.$emit('handleAlert','Blank are not Allowed','error')
            else{
                var upload = {
                    date:format(new Date(this.date),'yyyy/MM/dd'),
                    todo:{
                        title:this.title,
                        period:this.period,
                        content:this.content.trim() != ''? this.content:'-',
                        status:this.status,
                    }
                }
                axios.post(`${host}/reminder/add`,upload,{
                    headers:{
                        'user-token':jsCookie.get('token'),
                        'user-mail':this.mail
                    }
                })
                .then(res=>{
                    if(res.data=='success') {
                        this.title='';
                        this.date='';
                        this.period='';
                        this.content='';
                        this.status='';
                        this.mail='';
                        this.$bus.$emit('handleAlert','Add Reminder Success','success');
                        this.$router.back();
                    }
                    else this.$bus.$emit('handleAlert','Failed To Add Reminder','error');
                })
                .catch(e=>{
                    this.$bus.$emit('handleAlert','Add Reminder Error By Server Connection','error')
                })
            }
        }
    }
}
</script>

<style scoped>
    .main{
        width:90%;
        margin: 0 auto;
        padding-top: 20px;
        padding-bottom: 20px;
    }
    .title{
        line-height: 2.5;
        font-size: 16px;
    }
    .input{
        width: 100%;
    }
    .eachBox{
        display: flex;
        justify-content: space-around;
    }
    .time{
        width: 50%;
    }
    .time1{
        margin-right: 10px;
    }
    .picker{
        width: 100% !important;
    }
    .btn{
        width: 100%;
        height: 40px;
        border: 0.1px solid rgb(190,190,190);
        border-radius: 5px;
        font-size: 17px;
        margin-top: 17px;
        background-color: #97bf5f;
        color: white;
    }
</style>
