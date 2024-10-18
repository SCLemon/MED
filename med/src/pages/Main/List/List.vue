<template>
  <div class="box">
    <div class="add">
      <router-link class="school" :to="{path:'/main/calendar',query:{'mail':mail}}"><div>查看行事曆</div></router-link> 
      <router-link class="title-add" :to="{path:'/main/add',query:{'mail':mail}}">
          <div class="btn"><i class="fa-solid fa-address-book add-icon"></i>Add</div>
      </router-link>
    </div>
    <div class="list">
      <div class="list-content" v-for="(obj, id) in activeList" :key="id">
          <div class="title">
            <div class="title-name">{{ obj.date }}（{{ handleDayOfWeek(obj.date) }}）</div>
            <div class="title-edit" @click="openEdit(obj.date)" v-if="obj.date != editTime">Edit</div>
            <div class="title-edit" @click="editTime=''" v-else>Close</div>
          </div>
          <div class="todo">
          <div class="todo-main">
            <div class="todo-each" v-for="(t, id) in obj.todo" :key="id">
              <router-link :to="{
                  path:'/main/revise',
                  query:{'todoListContent':t,'todoListDate':obj.date}}" :class="`link ${t.status?'finish':''}`">
                <div class="task">
                  <i :class="`fa-solid fa-circle circle`" :style="{color:drawColor(t.period)}"></i>
                  {{ t.title }}
                </div>
              </router-link>
                <i class="fa-solid fa-xmark marks" @click="deleteData(t.taskId)" v-if="obj.date == editTime"></i>
            </div>
            </div>
          </div>
      </div>
    </div>
    <div class="note" @click="recordNote()" v-if="!showNote"><i class="fa-solid fa-pen-to-square"></i></div>
    <div class="notebook" v-else>
      <div class="note-head">
        <div class="note-head-text">Freehand Notes</div>
        <div class="note-revise" @click="editNote()" v-text="isNoteWrite?'預覽':'編輯'"></div>
        <div class="note-close" @click="recordNote()">完成</div>
      </div>
      <div class="note-body">
        <div class="note-show" v-if="!isNoteWrite" v-html="noteShow==''?'Looking forward to what you will jot down.':noteShow"></div>
        <textarea class="note-text" ref="noteText" v-model="note" v-else placeholder="You can input using Markdown syntax."></textarea>
      </div>
    </div>
  </div>
</template>

<script>
import {host} from '../../../serverPath'
import axios from 'axios';
import jsCookie from 'js-cookie';
import { format, isBefore , parse} from 'date-fns';
import markdownit from 'markdown-it'
export default {
  name: "List",
  mounted() {
    this.getData();
    this.getUserInfo();
  },
  computed:{
    activeList:function(){
      return this.list.filter(obj=>{
        return !isBefore(new Date(format(obj.date,'yyyy-MM-dd')),new Date(format(new Date(),'yyyy-MM-dd'))) 
      })
    },
  },
  methods: {
    getUserInfo(){
      axios.get(`${host}/userInfo/get/${jsCookie.get('token')}`)
      .then(res=>{
        if(res.data) this.mail = res.data.mail;
        else this.$bus.$emit('handleAlert','Failed To Getting UserInfo','error');
      }).catch(e=>{
        this.$bus.$emit('handleAlert','Getting UserInfo Error','error');
      })
    },
    getData(){
      axios.get(`${host}/reminder/get/${jsCookie.get('token')}`)
      .then(res=>{
        this.$bus.$emit('setRemindStatus',res.data.remind);
        if(Array.isArray(res.data.data)){
          this.note = res.data.note;
          this.noteShow = markdownit().render(res.data.note);
          this.handleData(res.data.data)
        }
        else if(res.data=='new'){}
        else this.$bus.$emit('handleAlert','Failed To Getting TodoList','error');
      })
      .catch(e=>{
        this.$bus.$emit('handleAlert','Getting TodoList Error When Connecting Server','error');
      })
    },
    handleDayOfWeek(date){
      return format(date,'EEE')
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
    deleteData(id){
      this.$confirm('確認是否刪除？', '提示', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
          axios.delete(`${host}/reminder/delete/${id}`,{
          headers:{
            'user-token':jsCookie.get('token')
          }
          }).then(res=>{
            if(res.data=='success') this.$bus.$emit('handleAlert','Delete TodoList Success','success');
            else this.$bus.$emit('handleAlert','Failed To Delete TodoList','error');
            this.getData();
          }).catch(e=>{
            this.$bus.$emit('handleAlert','Delete TodoList Error When Connecting Server','error');
          })
      }).catch(() => {
        this.$bus.$emit('handleAlert','Delete TodoList Canceled','error');
      });          
    },
    openEdit(time){
      this.editTime=time;
    },
    editNote(){
      this.isNoteWrite=!this.isNoteWrite;
      if(this.isNoteWrite){
        this.$nextTick(()=>{
          this.$refs.noteText.focus();
        })
      }
      else{
        this.noteShow = markdownit().render(this.note);
      }
    },
    recordNote(){
      this.isNoteWrite = false;
      if(this.showNote){
        this.noteShow = markdownit().render(this.note);
        axios.put(`${host}/reminder/note`,{
        note:this.note
        },{
          headers:{
            'user-token':jsCookie.get('token')
          }
        })
        .then(res=>{
          if(res.data=='success'){}
          else this.$bus.$emit('handleAlert','Failed To Record Note','error');
        })
        .catch(e=>{
          this.$bus.$emit('handleAlert','Record Note Error By Server Connection','error')
        })
      }
      this.showNote=!this.showNote;
    },
    drawColor(period){
      var hour = Number.parseInt(period.split(":")[0])
      if (hour < 10) return 'lightgreen';
      else if (hour < 14) return 'lightpink';
      else if (hour < 18) return 'lightsalmon';
      else return 'purple';
    },
  },
  data() {
    return {
      list:[],
      editTime:'',
      mail:'',
      note:'',
      noteShow:'',
      isNoteWrite:false,
      showNote:false,
    };
  },
};
</script>

<style scoped>
.link{
  color: black;
  text-decoration: none;
}
.box {
  width: 100%;
  height: calc(100vh - 130px);
}
.add {
  position: relative;
  width: 100%;
  height: 70px;
  display: flex;
  justify-content: space-between;  
  align-items: center;
  padding-right: 20px;
  padding-left: 25px;
}
.school{
  text-decoration: none;
  font-size:16px;

}
.btn {
  padding: 8px;
  background-color: #97bf5f;
  color: white;
  font-size: 16px;
}
.btn{
  cursor: pointer;
}
.add-icon {
  margin-right: 7px;
}
.list {
  overflow: scroll;
  width: 100%;
  height: calc(100vh - 200px);
  position: relative;
}
.finish{
  color: rgba(195,195,195);
  text-decoration: line-through;
}
.list-content {
  width: calc(100vw - 40px);
  min-height: 150px;
  border: 1px solid red;
  border-radius: 5px;
  margin: 0 auto;
  margin-bottom: 15px;
  border: 0.1px solid rgb(210, 210, 210);
}
.title {
  width: 100%;
  height: 40px;
  border-bottom: 0.1px solid rgb(210, 210, 210);
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  line-height: 40px;
}
.title-name {
  width: 80%;
  padding-left: 15px;
  letter-spacing: 1.5px;
  font-weight: bold;
}
.title-edit {
  width: 20%;
  text-align: right;
  color: #1677ff;
  padding-right: 15px;
  text-decoration: none;
}
.title-edit:hover{
  cursor: pointer;
}
.todo {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 15px;
  padding-right: 15px;
  margin-top: 10px;
  margin-bottom: 10px;
}
.todo-main {
  width: 100%;
  min-height: 90px;
  overflow: scroll;
}
.todo-each {
  width: 100%;
  height: 28px;
  line-height: 28px;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  font-size: 15px;
  position: relative;
}
.todo-each:hover,.todo-each:active{
  border-bottom: 0.1px solid rgb(203, 203, 203);
}
.task{
  width:88%;
}
.circle {
  font-size: 9px;
  margin-right: 5px;
}
.marks{
  position: absolute;
  top:0px;
  right: 0px;
  width: 40px;
  height: 28px;
  line-height: 28px;
  text-align: center;
}
.marks:hover{
  cursor: pointer;
}
.morning {
  color: lightgreen;
}
.noon {
  color: lightpink;
}
.afternoon {
  color: lightsalmon;
}
.night {
  color: purple;
}
.note{
  position: fixed;
  width: 65px;
  height: 65px;
  background-color: rgba(0,0,0,0.6);
  color: white;
  border-radius: 5px;
  bottom: 85px;
  right: 15px;
  text-align: center;
  line-height: 65px;
  font-size: 28px;
}
.note:hover{
  cursor: pointer;
}
.notebook{
  position: absolute;
  border: 1px solid rgb(227, 227, 227);
  left: 0;
  right: 0;
  top:0;
  bottom: 0;
  width: 95vw;
  height: 70vh;
  margin: auto;
  background: white;
  display: flex;
  flex-direction: column;
  border-radius: 5px;
}
.note-head{
  width: 100%;
  height: 50px;
  line-height: 50px;
  padding-left: 10px;
  border-bottom: 1px solid rgb(227, 227, 227);
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  padding-right: 5px;
}
.note-head-text{
  width: calc(95vw - 100px);
  font-weight: bolder;
}
.note-close{
  height: 50px;
  width: 50px;
  text-align: center;
  color: #1677ff;
}
.note-revise{
  height: 50px;
  width: 50px;
  text-align: center;
  color: #1677ff;
}
.note-revise:hover{
  cursor: pointer;
}
.note-close:hover{
  cursor: pointer;
}
.note-body{
  width: 100%;
  height: calc(50vh - 51px);
}
.note-text{
  width: 100%;
  height: calc(70vh - 55px);
  border: 0;
  padding: 10px;
}
.note-text:focus{
  outline: none;
}
.note-show{
  width: 100%;
  height: calc(50vh - 51px);
  overflow-y: scroll;
  padding: 10px;
}
</style>