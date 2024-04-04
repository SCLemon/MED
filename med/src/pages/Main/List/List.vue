<template>
  <div class="box">
    <div class="add">
    <router-link
        class="title-add"
            :to="'/main/add'"
        >
        <div class="btn">
            <i class="fa-solid fa-address-book add-icon"></i>Add
        </div>
    </router-link>
    </div>
    <div class="list">
      <div class="list-content" v-for="(obj, id) in list" :key="id">
          <div class="title">
            <div class="title-name">{{ obj.date }}</div>
            <div class="title-edit" @click="openEdit(obj.date)" v-if="obj.date != editTime">Edit</div>
            <div class="title-edit" @click="editTime=''" v-else>Close</div>
          </div>
          <div class="todo">
          <div class="todo-main">
            <div class="todo-each" v-for="(t, id) in obj.todo" :key="id">
              <router-link :to="{
                  path:'/main/revise',
                  query:{'todoListContent':t,'todoListDate':obj.date}}" class="link">
                <div class="task">
                  <i :class="`fa-solid fa-circle circle ${t.period}`"></i>
                  {{ t.title }}
                </div>
              </router-link>
                <i class="fa-solid fa-xmark marks" @click="deleteData(t.taskId)" v-if="obj.date == editTime"></i>
            </div>
            </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import jsCookie from 'js-cookie';
export default {
  name: "List",
  mounted() {
   this.getData();
  },
  methods: {
    getData(){
      axios.get(`/reminder/get/${jsCookie.get('token')}`)
      .then(res=>{
        if(Array.isArray(res.data)){
          this.handleData(res.data)
        }
        else this.$bus.$emit('handleAlert','Failed To Getting TodoList','error');
      })
      .catch(e=>{
        this.$bus.$emit('handleAlert','Getting TodoList Error When Connecting Server','error');
      })
    },
    handleData(obj){
      for(var i=0;i<obj.length;i++){
        obj.sort((a,b)=>{
          return this.handleSort(a.data.todo.period)-this.handleSort(b.data.todo.period)
        })
      }
      this.list = obj.reduce((acc, curr) => {
        const foundIndex = acc.findIndex(item => item.date === curr.data.date);
        if (foundIndex !== -1) {
          acc[foundIndex].todo.push(curr.data.todo);
        } else {
          acc.push({ date: curr.data.date, todo: [curr.data.todo] });
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
    }
  },
  data() {
    return {
      list:[],
      editTime:''
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
  width: 100%;
  height: 70px;
  display: flex;
  justify-content: right;
  align-items: center;
  padding-right: 20px;
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
}
.list-content {
  width: calc(100vw - 40px);
  height: 150px;
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
  height: 110px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 15px;
  padding-right: 15px;
}
.todo-main {
  width: 100%;
  height: 90px;
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
</style>