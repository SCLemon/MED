<template>
  <div class="main">
    <el-alert v-if="alertMsg.show" :title="alertMsg.msg" :type="alertMsg.type" class="alert"></el-alert>
    <div class="box">
      <div class="title">Welcome To Use</div>
      <div class="userIcon">
        <div class="img"><i class="fa-solid fa-user"></i></div>
      </div>
      <div class="form">
        <div class="form-div">
          <div class="text">Username</div>
          <input type="text" name="" id="" class="input" v-model="user">
        </div>
        <div class="form-div">
          <div class="text">Password</div>
          <input type="text" name="" id="" class="input" v-model="password">
        </div>
        <div class="form-div">
          <div class="btn" @click="sendData()">Login</div>
        </div>
      </div>
    </div>
    <div class="otherForm" @click="$router.replace('/verify/register')">
      Register <i class="fa-solid fa-arrow-right right"></i>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name:'Register',
  mounted(){},
  data(){
    return {
      user:'',
      password:'',
      alertMsg:{
        msg:'',
        type:'',
        show:true,
      }
    }
  },
  methods:{
    handleAlert(msg,type){
      this.alertMsg.show=true;
      this.alertMsg.msg=msg;
      this.alertMsg.type=type;
      setTimeout(() => {
        this.alertMsg.show=false;
      }, 500);
    },
    sendData(){
      if(this.user.trim()!=='' && this.password.trim()!=''){
        axios.post('/verify/login',{
          user: this.user,
          password: this.password,
        }).then(res=>{
          if(Array.isArray(res.data)){
            document.cookie=`token=${res.data[0].token};expires=${(new Date(new Date().getTime()+86400*1000*14)).toUTCString()}`
            this.handleAlert('Success To Login！！','success');
            this.user='';
            this.password='';
            setTimeout(()=>{
              this.$router.replace('/');
            },500)
          }
          else this.handleAlert('Failed To Login！！','error')
        })
      }
      else this.handleAlert('Blanks are not allowed！！','warning')
    }
  }
}
</script>

<style scoped>
  .main{
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }
  .alert{
      position: absolute;
      margin: 0 auto;
      top:15px;
      width: 250px;
    }
  .otherForm{
    position: absolute;
    bottom:15px;
    right:15px;
    font-size: 20px;
  }
  .right{
    margin-left: 5px;
  }
  .box{
    width: 85%;
    height: 560px;
  }
  .title{
    width: 100%;
    height: 50px;
    line-height: 50px;
    font-size: 24px;
    font-weight: bolder;
    text-align: center;
  }
  .userIcon{
    width: 100%;
    height: 110px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .img{
    width: 80px;
    height: 80px;
    border-radius: 80px;
    background-color: rgb(243, 243, 243);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 34px;
  }
  .form{
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .form-div{
    width: 90%;
  }
  .text{
    line-height: 2.5;
    font-size: 16px;
  }
  .input{
    width: 100%;
    height: 40px;
    border: 0.1px solid rgb(190,190,190);
    border-radius: 5px;
    padding-left: 10px;
    font-size: 17px;
  }
  .btn{
    width: 100%;
    height: 40px;
    border: 0.1px solid rgb(190,190,190);
    border-radius: 5px;
    font-size: 17px;
    margin-top: 40px;
    background-color: #97bf5f;
    color: white;
  }
</style>