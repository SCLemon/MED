<template>
  <div class="main">
    <el-dialog
      title="安裝提示"
      :visible.sync="dialogVisible"
      width="90%"
      :before-close="handleClose">
      <div class="hintText">因本頁面採用 PWA 漸進式網頁應用程式技術開發而成。為確保良好的使用者體驗，請務必先將本頁面 <span style="font-weight: bolder;">「新增至主畫面」</span>，再從主畫面中點擊圖標進入應用程式！</div>
      <div class="check"><el-checkbox v-model="checked" @change="handleCheck()">下次不再顯示</el-checkbox></div>
      <div class="author">SCLemon <i class="fa-solid fa-paw"></i></div>
    </el-dialog>
    <div class="box">
      <div class="title">Welcome To Use</div>
      <div class="userIcon">
        <div class="img"><i class="fa-solid fa-user"></i></div>
      </div>
      <div class="form">
        <div class="form-div">
          <div class="text">Email</div>
          <input type="email" name="" id="" class="input" v-model="mail">
        </div>
        <div class="form-div">
          <div class="text">Password</div>
          <input type="password" name="" id="" class="input" v-model="password">
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
import {host} from '../../serverPath'
import axios from 'axios';
export default {
  name:'Register',
  mounted(){
    if(localStorage.getItem('newUser')==undefined || localStorage.getItem('newUser')=='true') this.dialogVisible = true;
  },
  data(){
    return {
      mail:'',
      password:'',
      dialogVisible:false,
    }
  },
  methods:{
    sendData(){
      if(this.mail.trim()!=='' && this.password.trim()!=''){
        axios.post(`${host}/verify/login`,{
          mail: this.mail,
          password: this.password,
        }).then(res=>{
          if(res.data!='User Not Exists'){
            document.cookie=`token=${res.data.token};expires=${(new Date(new Date().getTime()+86400*1000*14)).toUTCString()}`;
            this.$bus.$emit('handleAlert','Success To Login','success')
            this.mail='';
            this.password='';
            this.$router.replace('/');
          }
          else this.$bus.$emit('handleAlert','Failed To Login','error')
        }).catch(e=>{
          this.$bus.$emit('handleAlert','Login Error By Server Connection','error')
        })
      }
      else this.$bus.$emit('handleAlert','Blanks are not allowed','warning')
    },
    handleCheck(){
      localStorage.setItem('newUser',!this.checked)
    }
  },
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
  .otherForm{
    position: absolute;
    bottom:25px;
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
  .hintText{
    line-height: 2;
    text-align: justify;
  }
  .check{
    margin-top: 15px;
    margin-bottom: 5px;
    text-align: left;
  }
  .author{
    text-align: right;
  }
</style>