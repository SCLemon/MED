<template>
  <div class="mainBox">
    <i class="fa-solid fa-chevron-left back" v-if="$route.path != '/main'" @click="$router.back()"></i>
    <div class="top">TodoList Reminder</div>
    <i :class="`fa-regular fa-bell${remind?'':'-slash'} bell`" @click="changeRemind()" v-if="$route.path=='/main'"></i>
    <router-view></router-view>
  </div>
</template>

<script>
import axios from 'axios';
import jsCookie from 'js-cookie';
export default {
  name: "Main",
  data(){
    return{
      remind:true
    }
  },
  mounted(){
    this.$bus.$on('setRemindStatus',(remind)=>{
      this.remind = remind == undefined? true: remind;
    })
  },
  methods:{
    changeRemind(){
      this.remind=!this.remind;
      axios.put('/reminder/remind',{
        remind:this.remind
      },{
        headers:{
          'user-token':jsCookie.get('token')
        }
      })
      .then(res=>{
        if(res.data=='success') this.$bus.$emit('handleAlert','Success To Change Reminder','success');
        else this.$bus.$emit('handleAlert','Failed To Change Status','error');
      })
      .catch(e=>{
        this.$bus.$emit('handleAlert','Change Status Error By Server Connection','error')
      })
    }
  }
};
</script>

<style scoped>
.top {
  width: 100%;
  height: 60px;
  line-height: 60px;
  text-align: center;
  font-weight: bolder;
  border-bottom: 0.1px solid rgb(210, 210, 210);
  font-size: 20px;
  position: sticky;
  top: 0;
  background-color: white;
}
.back {
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
.bell{
  position: absolute;
  right: 5px;
  text-align: center;
  line-height: 60px;
  top: 0px;
  font-size: 20px;
  height: 60px;
  z-index:999;
  width: 60px;
}
</style>