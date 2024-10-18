<template>
  <div class="mainBox">
    <i class="fa-solid fa-chevron-left back" v-if="$route.path != '/main'" @click="$router.back()"></i>
    <i class="fa-solid fa-cloud-sun back2" v-else @click="$router.replace('/weather')"></i>
    
    <div class="top">TodoList Reminder</div>
      <i :class="`fa-solid fa-bell${remind?'':'-slash'} bell`" @click="changeRemind()" v-if="$route.path=='/main'"></i>
      <i class="fa-solid fa-circle-question bell" slot="reference" @click="test()" v-if="$route.path=='/main/calendar'"></i>
    <router-view></router-view>
  </div>
</template>

<script>
import {host} from '../../serverPath'
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
    test(){
      this.$bus.$emit('handleAlert','If no data exists for the selected date, add it on the previous page before returning here to view and edit.','warning')
    },
    changeRemind(){
      this.remind=!this.remind;
      axios.put(`${host}/reminder/remind`,{
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
.back2 {
  position: absolute;
  left: 12px;
  text-align: center;
  line-height: 60px;
  top: 0px;
  font-size: 20px;
  height: 60px;
  z-index:999;
  width: 60px;
}
.back2:hover{
  cursor: pointer;
}
.bell{
  position: absolute;
  right:  10px;
  text-align: center;
  line-height: 60px;
  top: 0px;
  font-size: 20px;
  height: 60px;
  z-index:999;
  width: 60px;
}
</style>