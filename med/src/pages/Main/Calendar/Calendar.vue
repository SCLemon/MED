<template>
  <div class="calendarBox">
    <el-calendar>
        <template slot="dateCell" slot-scope="{date, data}">
            <p :class="`date ${data.isSelected ? 'is-selected' : ''}`">{{ data.day.split('-')[2] }}</p>
            <div class="contentBox" @click="openDetail(data.day)">
              <template v-for="(obj,id) in list">
                <span class="content" v-if="handleTimeFormat(obj.date,'yyyy-MM-dd') == data.day" :key="id">
                  <div v-for="(item,id) in obj.todo" :key="id"> {{ item.title }}</div>
                </span>
              </template>
            </div>
        </template>
    </el-calendar>
    <el-dialog :title="openDetailDate" :visible.sync="dialogTableVisible"  ref="table">
      <el-table :data="gridData" empty-text="暫無數據">
        <el-table-column property="period" label="時間" width="155.5"></el-table-column>
        <el-table-column property="title" label="待辦事項" width="120"></el-table-column>
        <el-table-column width="34"  align="center">
          <template v-slot="{ row }">
            <div class="delete" @click="deleteData(row.taskId)"><i class="fa-solid fa-x x"></i></div>
          </template>
        </el-table-column>
      </el-table>
      <div class="addRow">
        <div class="addBoxLeft">
          <div class="time">
          <el-time-select class="select"
            v-model="period" :picker-options="{ start: '00:00',step: '00:30',end: '23:30' }" placeholder="選擇時間"
            @focus="preventKeyboard" ref="datePicker">
          </el-time-select>
        </div>
        </div>
        <div class="addBoxRight">
          <div class="box">
            <el-input placeholder="Please Input Your Title" class="input" v-model="title" clearable ></el-input>
          </div>
          <div class="btn" @click="sendData()"><i class="fa-solid fa-plus"></i></div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios';
import { host } from '@/serverPath';
import jsCookie from 'js-cookie';
import {format, parse} from 'date-fns'
export default {
    name:'Calendar',
    data(){
      return {
        list:[],
        dialogTableVisible: false,
        openDetailDate:'',
        gridData: [],
        period: '',
        title:'',
        mail:this.$route.query.mail,
      }
    },
    mounted(){
      this.changeBtnText();
      this.getData();
    },
    methods:{
      preventKeyboard() {
        this.$refs.datePicker.blur(); // 讓選擇器失去焦點
      },
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
      openDetail(target){
        var date = format(target,'yyyy/MM/dd');
        var pass = this.list.filter((item)=>item.date == date)[0];
        this.gridData = pass?pass['todo']:[]     
        this.dialogTableVisible = true;
        this.openDetailDate = date;
      },
      handleData(obj){
        obj.sort((a,b)=>{
          return parse(a.todo.period, 'HH:mm', new Date()).getTime() - parse(b.todo.period, 'HH:mm', new Date()).getTime()
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
      sendData(){
        if(this.title.trim()=='' || this.period.trim()=='') this.$bus.$emit('handleAlert','Blank are not Allowed','error');
        else {
          var upload = {
            date:this.openDetailDate,
            todo:{
              title:this.title,
              period:this.period,
              content:'-',
              status:false,
            }
          }
          axios.post('/reminder/add',upload,{
            headers:{
              'user-token':jsCookie.get('token'),
              'user-mail':this.mail
            }
          })
          .then(res=>{
            if(res.data == 'success'){
              this.dialogTableVisible = false;
              this.$bus.$emit('handleAlert','Add Reminder Success','success');
              this.title = '';
              this.period = '';
            }
            else this.$bus.$emit('handleAlert','Failed To Add Reminder','error');
          })
          .catch(e=>{
            this.$bus.$emit('handleAlert','Add Reminder Error By Server Connection','error')
          })
          .finally(()=>{
            this.getData();
          })
        }
      },
      showAlert(msg,type){
        this.$bus.$emit('handleAlert',msg,type)
      },
      deleteData(id){
        this.$confirm('確認是否刪除？', '提示', {
          confirmButtonText: '確定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            axios.delete(`/reminder/delete/${id}`,{
            headers:{
              'user-token':jsCookie.get('token')
            }
            }).then(res=>{
              if(res.data=='success'){
                this.$bus.$emit('handleAlert','Delete TodoList Success','success');
                this.dialogTableVisible = false;
              }
              else this.$bus.$emit('handleAlert','Failed To Delete TodoList','error');
            })
            .catch(e=>{
              this.$bus.$emit('handleAlert','Delete TodoList Error When Connecting Server','error');
            })
            .finally(()=>{
              this.getData();
            })  
        })
        .catch(() => {
          this.$bus.$emit('handleAlert','Delete TodoList Canceled','error');
        })       
      },
    },
}
</script>

<style scoped>
  .date{
    margin-bottom: 5px;
  }
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
  .addRow{
    margin-top: 10px;
    width: 309.5px;
    height: 50px;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
  }
  .addBoxLeft{
    width: 155.5px;
    padding-right: 10px;
  }
  .addBoxRight{
    width: 50%;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
  }
  .input{
    width: 110px;
  }
  .btn{
    width: 34px;
  }
  .delete:hover{
    cursor: pointer;
  }
  .x{
    font-size: 12px;
  }
</style>