<template>
    <div class="main">
      <div class="box">
        <div class="title">Create Your Account</div>
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
            <div class="text">Email</div>
            <input type="text" name="" id="" class="input" v-model="mail">
          </div>
          <div class="form-div">
            <div class="btn" @click="sendData()">Register</div>
          </div>
        </div>
      </div>
      <div class="otherForm" @click="$router.replace('/verify/login')">
        Login <i class="fa-solid fa-arrow-right right"></i>
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
        mail:'',
      }
    },
    methods:{
      sendData(){
        if(this.user.trim()!=='' && this.password.trim()!='' && this.mail.trim()!=''){
          axios.post('/verify/register',{
            user: this.user,
            password: this.password,
            mail:this.mail
          }).then(res=>{
            if(res.data=='success'){
              this.$bus.$emit('handleAlert','Success To Register','success')
              this.user='';
              this.password='';
              this.mail='';
              this.$router.replace('/verify/login');
            }
            else this.$bus.$emit('handleAlert','Failed To Register','error')
          }).catch(e=>{
            this.$bus.$emit('handleAlert','Register Error By Server Connection','error')
          })
        }
        else this.$bus.$emit('handleAlert','Blanks are not allowed','warning')
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
    }
    .alert{
      position: absolute;
      margin: 0 auto;
      top:15px;
      width: 250px;
    }
    .box{
      width: 85%;
      height: 560px;
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