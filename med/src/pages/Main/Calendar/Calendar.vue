<template>
  <div class="calendarBox">
    <el-calendar>
        <template slot="dateCell" slot-scope="{date, data}">
            <p :class="data.isSelected ? 'is-selected' : ''">{{ data.day.split('-')[2] }}</p>
            <div class="contentBox">
              <template v-for="(obj,id) in list">
                <span @click="openDetail(obj.date,obj.todo)" class="content" v-if="handleTimeFormat(obj.date,'yyyy-MM-dd') == data.day" :key="id">
                  <div v-for="(item,id) in obj.todo" :key="id"> {{ item.title }}</div>
                </span>
              </template>
            </div>
        </template>
    </el-calendar>
    <el-dialog :title="openDetailDate" :visible.sync="dialogTableVisible">
      <el-table :data="gridData">
        <el-table-column property="period" label="時間" width="150"></el-table-column>
        <el-table-column property="title" label="代辦事項" width="200"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios';
import { host } from '@/serverPath';
import jsCookie from 'js-cookie';
import {format} from 'date-fns'
export default {
    name:'Calendar',
    data(){
      return {
        list:{},
        dialogTableVisible: false,
        openDetailDate:'',
        gridData: [],
      }
    },
    mounted(){
      this.changeBtnText();
      this.getData();
    },
    methods:{
      getData(){
        axios.get(`${host}/reminder/get/${jsCookie.get('token')}`)
        .then(res=>{
          this.$bus.$emit('setRemindStatus',res.data.remind);
          if(Array.isArray(res.data.data)){
            this.handleData(res.data.data)
          }
          else if(res.data=='new'){}
          else this.$bus.$emit('handleAlert','Failed To Getting TodoList','error');
        })
        .catch(e=>{
          this.$bus.$emit('handleAlert','Getting TodoList Error When Connecting Server','error');
        })
      },
      changeBtnText(){
        var el = document.querySelectorAll('.el-button--mini')
        el[0].innerText = '上個月'
        el[1].innerText = '今天'
        el[2].innerText = '下個月'
      },
      handleTimeFormat(date,type){
        return format(date,type);
      },
      openDetail(date,data){
        data.sort((a,b)=>{
          return this.handleSort(a.period)-this.handleSort(b.period)
        })
        this.gridData = data.map((item)=>{
          return {
            period : item.period,
            title : item.title
          }
        })
        this.dialogTableVisible = true;
        this.openDetailDate = date;

      },
      handleData(obj){
        obj.sort((a,b)=>{
          return this.handleSort(a.todo.period)-this.handleSort(b.todo.period)
        })
        this.list = obj.reduce((acc, curr) => {
          const foundIndex = acc.findIndex(item => item.date === curr.date);
          if (foundIndex !== -1) {
            acc[foundIndex].todo.push(curr.todo);
          } else {
            acc.push({ date: curr.date, todo: [curr.todo] });
          }
          acc.sort((a,b)=>{
            return new Date(a.date).getTime()- new Date(b.date).getTime()
          })
          return acc;
        }, []);
      },
      handleSort(period){
        switch(period) {
          case 'morning':
            return 1;
          case 'noon':
            return 2;
          case 'afternoon':
            return 3;
          case 'night':
            return 4;
        }
      },
    },
}
</script>

<style scoped>
  .is-selected {
    color: #1989FA;
  }
  .calendarBox{
    width: 100%;
    height: calc(100vh - 130px);
    overflow-y: scroll;
  }
  .contentBox{
    width: 100%;
    height: 40px;
    overflow-x: hidden;
    overflow-y: scroll;
  }
  .content{
    width: 100%;
    text-wrap: nowrap;
    font-size: 10px;
    line-height: 1.75;
  }
</style>
<!--
 "data": [
        {
            "todo": {
                "title": "工數複習",
                "period": "noon",
                "content": "如題",
                "status": true,
                "taskId": "15e83f7f-b4a0-4dff-8528-1440771c4b3d"
            },
            "date": "2024/04/30",
            "_id": "6630b70dba2914f9403bb379"
        }]
-->