<template>
  <div id="app" class="app" v-cloak>
    <router-view></router-view>
    <FooterGuide class="footer" v-if="!$route.path.includes('/verify')"></FooterGuide>
  </div>
</template>

<script>
import FooterGuide from './components/FooterGuide.vue'
import jsCookie from 'js-cookie';
import axios from 'axios';
import {format} from 'date-fns'
import { host } from './serverPath';
export default {
  name: 'App',
  components: {
    FooterGuide
  },
  data(){
    return{
      dailyJob:0,
      text:'',
      text2:'',
      list:[],
      remind:true,
    }
  },
  mounted(){
    this.$bus.$on('handleAlert',(msg,type)=>this.handleAlert(msg,type));
    // 防止惡意攻擊
    window.addEventListener('click',()=>{
      if(jsCookie.get('token')!='' && jsCookie.get('token')){}
      else if(this.$route.path.includes('/verify')){}
      else location.reload();
    })
    // 每天提醒
    this.dailyJob = setInterval(() => {
      var now = new Date();
      var hours = now.getHours();
      if (hours === 8) this.morningAlert();
      else if(hours === 12) this.moonAlert();
      else if(hours === 17) this.eveningAlert();
      else if(hours === 22) this.nightAlert();
    }, 60*60*1000);
  },
  beforeDestroy(){
    clearInterval(this.dailyJob)
  },
  methods:{
    handleAlert(msg,type){
      this.$message({
          message: msg,
          type: type
      });  
    },
    getData(){
      axios.get(`${host}/reminder/get/${jsCookie.get('token')}`)
      .then(res=>{
        var date = format(new Date(),'yyyy/MM/dd');
        if(Array.isArray(res.data.data)){
          this.remind = res.data.remind;
          this.list = (res.data.data).filter(todo => (todo.date === date && todo.todo.status === false));
          if(this.remind){
            this.text2 = this.list.length? `今日尚有 ${this.list.length} 個事項待完成！點擊查看詳情。`: `恭喜您今日事項已全數完成！別忘了為明天得自己訂定一下目標！`
            this.handleNotification();
          }
        }
        else if(res.data=='new'){}
      })
    },
    handleNotification(){
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          // 第一則推播
          var notification = new Notification('Med Reminder', {
            body: this.text,
            icon: '/logo.png',
            requireInteraction:true,
          });
          notification.onclick = (event) => { 
            event.preventDefault();
            this.$router.replace('/').catch(()=>{})
          };
          // 第二則推播
          var notification2 = new Notification('Med Reminder', {
            body: this.text2,
            icon: '/logo.png',
            requireInteraction:true,
          });
          notification2.onclick = (event) => { 
            event.preventDefault();
            this.$router.replace('/').catch(()=>{})
          };
        } 
        else this.$bus.$emit('handleAlert','Notification Not Allowed By User Permission','error')
      });
    },
    morningAlert(){
      this.text = '早安，親愛的用戶您好，請記得查看今日代辦事項！ 祝您有個愉快的一天。';
      this.getData();
    },
    moonAlert(){
      this.text = '午安，親愛的用戶您好，除了勤奮工作以及享用午餐外，也別忘了查看下午的代辦事項唷！';
      this.getData();
    },
    eveningAlert(){
      this.text = '晚安，親愛的用戶您好，今日工作辛苦了，享受下班後時光的同時，也別忘了要查看晚間任務哦！';
      this.getData();
    },
    nightAlert(){
      this.text = '一天的結束即將來臨，不知是否已經完成了今日所有的事項呢！不管如何，希望今天的你擁有著美好的一天。';
      this.getData();
    }
  }
}
</script>

<style>
    html{
      overflow: hidden;
    }
    [v-cloak]{
      display: none;
    }
    input:focus{
      outline: 0;
    }
    ::placeholder{
      font-size: 14px;
    }
    ::-webkit-scrollbar{
      display: none;
    }
    .el-message-box {
      width: 300px !important;
    }
    .el-message{
      top:0 !important;
      height: 60px !important;
      width:100% !important;
    }
    .el-select{
        width:100% !important;
    }
    .app {
      width:100%;
      margin: 0 auto;
      position: relative;
      height: 100vh;
      padding-bottom: 50px;
    }
    .alert{
      position: absolute !important;
      top:15px;
      left: 0 !important;
      right: 0 !important;
      margin: 0 auto !important;
      width: 250px !important;
      z-index: 1000;
    }
    .footer{
      width:100%;
      position: fixed;
      bottom: 0;
      border-top: 0.1px solid rgb(210, 210, 210);
    }
    .el-progress__text{
      margin-left: 15px !important;
    }
</style>