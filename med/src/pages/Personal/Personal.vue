<template>
  <div class="main">
    <div class="top">
      <div class="title">Your Profile</div>
      <div class="out" @click="logout()">Sign Out</div>
    </div>
    <div class="box">
      <div class="userIcon">
        <img :src="update.userImg.src" alt="" class="img">
      </div>
      <div class="imgListBox">
        <div class="imgList"><img src="/images/1.jpeg" ref="img1" alt="" @click="handleUserImg('img1',1)"><div class="check" v-if="update.userImg.checkIndex==1"><i class="fa-solid fa-check"></i></div></div>
        <div class="imgList"><img src="/images/2.jpeg" ref="img2" alt="" @click="handleUserImg('img2',2)"><div class="check" v-if="update.userImg.checkIndex==2"><i class="fa-solid fa-check"></i></div></div>
        <div class="imgList"><img src="/images/3.jpeg" ref="img3" alt="" @click="handleUserImg('img3',3)"><div class="check" v-if="update.userImg.checkIndex==3"><i class="fa-solid fa-check"></i></div></div>
        <div class="imgList"><img src="/images/4.jpeg" ref="img4" alt="" @click="handleUserImg('img4',4)"><div class="check" v-if="update.userImg.checkIndex==4"><i class="fa-solid fa-check"></i></div></div>
        <div class="imgList"><img src="/images/5.jpeg" ref="img5" alt="" @click="handleUserImg('img5',5)"><div class="check" v-if="update.userImg.checkIndex==5"><i class="fa-solid fa-check"></i></div></div>
        <div class="imgList"><img src="/images/6.jpeg" ref="img6" alt="" @click="handleUserImg('img6',6)"><div class="check" v-if="update.userImg.checkIndex==6"><i class="fa-solid fa-check"></i></div></div>
        <div class="imgList"><img src="/images/7.jpeg" ref="img7" alt="" @click="handleUserImg('img7',7)"><div class="check" v-if="update.userImg.checkIndex==7"><i class="fa-solid fa-check"></i></div></div>
        <div class="imgList"><img src="/images/8.jpeg" ref="img8" alt="" @click="handleUserImg('img8',8)"><div class="check" v-if="update.userImg.checkIndex==8"><i class="fa-solid fa-check"></i></div></div>
        <div class="imgList"><img src="/images/9.jpeg" ref="img9" alt="" @click="handleUserImg('img9',9)"><div class="check" v-if="update.userImg.checkIndex==9"><i class="fa-solid fa-check"></i></div></div>
        <div class="imgList"><img src="/images/10.jpeg" ref="img10" alt="" @click="handleUserImg('img10',10)"><div class="check" v-if="update.userImg.checkIndex==10"><i class="fa-solid fa-check"></i></div></div>
      </div>
      <div class="form">
        <div class="form-div">
          <div class="text">Username</div>
          <input type="text" name="" id="" class="input" v-model="update.user">
        </div>
        <div class="form-div">
          <div class="text">Password</div>
          <input type="text" name="" id="" class="input" v-model="update.password">
        </div>
        <div class="form-div">
            <div class="text">Email</div>
            <input type="text" name="" id="" class="input" v-model="update.mail">
          </div>
        <div class="form-div">
          <div class="btn" @click="updateData()">Update Profile</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import jsCookie from 'js-cookie';
export default {
  name:'Personal',
  mounted(){
    this.getUserInfo();
  },
  data(){
    return {
      update:{
        user:'',
        password:'',
        mail:'',
        userImg:{
          checkIndex:1,
          src:''
        }
      }
    }
  },
  methods:{
    getUserInfo(){
      axios.get(`/userInfo/get/${jsCookie.get('token')}`)
      .then(res=>{
        if(Array.isArray(res.data)){
          this.$bus.$emit('handleAlert','Getting UserInfo Success','success');
          this.update.user = res.data[0].user;
          this.update.password = res.data[0].password;
          this.update.mail = res.data[0].mail;
          this.update.userImg.src = res.data[0].userImg;
          this.update.userImg.checkIndex = (res.data[0].userImg).match(/\d+/g)[0];
          localStorage.setItem('userImg',this.update.userImg.src)
        }
        else this.$bus.$emit('handleAlert','Failed To Getting UserInfo','error');
      })
    },
    logout(){
      this.$confirm('確認是否登出？', '提示', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$bus.$emit('handleAlert','Log Out Success','success');
        jsCookie.set('token','');
        this.$router.replace('/verify/login')
      }).catch(() => {
        this.$bus.$emit('handleAlert','Log Out Canceled','error');
      });          
    },
    handleUserImg(id,checkIndex){
      this.update.userImg.src = `/${this.$refs[id].src.split('/')[3]}/${this.$refs[id].src.split('/')[4]}`;
      this.update.userImg.checkIndex=checkIndex;
    },
    updateData(){
      if(!new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).test(this.update.mail)) this.$bus.$emit('handleAlert','Invalid Mail Format','error');
      else if(this.update.user.trim()=='' || this.update.password.trim()=='' || this.update.mail.trim()=='') this.$bus.$emit('handleAlert','Blank Not Allowed','error');
      else{
        axios.put('/userInfo/update',this.update,{
          headers:{
            'user-token':jsCookie.get('token')
          }
        })
        .then(res=>{
          if(res.data=='success') {
            this.$bus.$emit('handleAlert','Success Updating UserInfo','success');
            this.getUserInfo();
          }
          else this.$bus.$emit('handleAlert','Failed To Update UserInfo','error');
          
        })
      }
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
  .top{
    width: 100%;
    height: 60px;
    position: absolute;
    top:0;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
  }
  .title{
    width: 75%;    
    line-height: 60px;
    font-size: 18px;
    padding-left: 22.5px;
    font-weight: bolder;
  }
  .out{
    font-size: 16px;
    width: 25%;
    height: 47px;
    line-height: 47px;
    border-radius: 5px 0 0 5px;
    background-color: rgb(220, 220, 220);
    text-align: center;
  }
  .box{
    width: 85%;
    height: calc(100vh - 110px);
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
  .imgListBox{
    width: 271px;
    margin: 0 auto;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    flex-wrap: wrap;
  }
  .imgList{
    width: 46px;
    height: 46px;
    border: 1px solid white;
    border-radius: 2px;
    margin-bottom: 5px;
    position: relative;
  }
  .imgList>img{
    width: 100%;
    border-radius: 2px;
  }
  .check{
    position: absolute;
    width: 46px;
    height: 46px;
    background-color: rgba(0,0,0,0.7);
    top:0;
    left:0;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: 20px;
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
    margin-top: 30px;
    background-color: #97bf5f;
    color: white;
  }
</style>