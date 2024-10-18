<template>
  <div class="main">
    <div class="title">Title</div>
    <el-input placeholder="Please Input Your Title" class="input" v-model="title" clearable ></el-input>
    <div class="eachBox">
        <div class="time time1">
            <div class="title">Date</div>
            <el-date-picker v-model="date" type="date" placeholder="Please Select the Date" class="picker"
                :picker-options="pickOptions" @focus="preventKeyboard" ref="datePicker"
            ></el-date-picker>
        </div>
        <div class="time">
            <div class="title">Period</div>
            <el-time-select class="picker"
                v-model="period" :picker-options="{ start: '00:00',step: '00:30',end: '23:30' }" placeholder="Please Select the Time"
                @focus="preventKeyboard" ref="timePicker">
            </el-time-select>
        </div>
    </div>
    <div class="title">Content</div>
    <el-input
        type="textarea"
        :autosize="{ minRows: 5, maxRows: 11}"
        placeholder="请输入内容"
        v-model="content">
    </el-input>
    <div class="switch">
        <el-switch
            v-model="status"
            active-text="已完成"
            inactive-text="尚未完成">
        </el-switch>
    </div>
    <div class="btn" @click="sendData($route.query.todoListContent.taskId)">Update</div>
  </div>
</template>

<script>
import {host} from '../../../serverPath'
import jsCookie from 'js-cookie';
import axios from 'axios';
import { format } from "date-fns";
export default {
    name:'Revise',
    mounted(){
        this.title = this.$route.query.todoListContent.title;
        this.content = this.$route.query.todoListContent.content;
        this.period = this.$route.query.todoListContent.period;
        this.status = this.$route.query.todoListContent.status
        this.date = this.$route.query.todoListDate;
    },
    data(){
        return{
            title:'',
            date:'',
            period: '',
            content:'',
            status:false,
            pickOptions:{
                disabledDate(time){
                    return time.getTime() < Date.now()-86400*1000
                }
            }
        }
    },
    methods:{
        preventKeyboard() {
            this.$refs.datePicker.blur(); // 讓選擇器失去焦點
            this.$refs.timePicker.blur();
        },
        sendData(taskId){
            if(this.title.trim()=='' || this.date=='' || this.date == null || this.period.trim()=='' || this.content.trim()=='') this.$bus.$emit('handleAlert','Blank are not Allowed','error')
            else{
                var upload = {
                    taskId:taskId,
                    date:format(new Date(this.date),'yyyy/MM/dd'),
                    todo:{
                        title:this.title,
                        period:this.period,
                        content:this.content,
                        status:this.status,
                    }
                }
                axios.put(`${host}/reminder/update`,upload,{
                    headers:{
                        'user-token':jsCookie.get('token')
                    }
                })
                .then(res=>{
                    if(res.data=='success') {
                        this.title='';
                        this.date='';
                        this.period='';
                        this.content='';
                        this.status='',
                        this.$bus.$emit('handleAlert','Update Reminder Success','success');
                        this.$router.back();
                    }
                    else this.$bus.$emit('handleAlert','The existing data has not been changed.','warning');
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
        margin-top: 10px;
        background-color: #97bf5f;
        color: white;
    }
    .switch{
        margin-top: 8px;
        padding-left: 5px;
        height: 40px;
        line-height: 40px;
    }
</style>
