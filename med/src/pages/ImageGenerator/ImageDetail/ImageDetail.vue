<template>
    <div>
      <div class="top">
          <i class="fa-solid fa-chevron-left back"  @click="$router.replace('/more')"></i>
          <i class="fa-regular fa-images"></i> Image Generator <i class="fa-solid fa-clock-rotate-left history" @click="$router.replace('/imageHistory')"></i>
      </div>
      <div class="main">
          <div class="block">
              <div class="title">尺寸</div>
              <el-radio-group v-model="setting.size" class="group">
                  <el-radio-button class="checkbox" label="256x256"></el-radio-button>
                  <el-radio-button class="checkbox" label="512x512"></el-radio-button>
                  <el-radio-button class="checkbox" label="1024x1024"></el-radio-button>
              </el-radio-group>
          </div>
          <div class="block">
              <div class="title">品質</div>
              <el-radio-group v-model="quality" class="group">
                  <el-radio-button class="checkbox" label="Standard"></el-radio-button>
                  <el-radio-button class="checkbox" label="HD"></el-radio-button>
              </el-radio-group>
          </div>
          <div class="block">
              <div class="title">風格</div>
              <el-radio-group v-model="style" class="group">
                  <el-radio-button class="checkbox" label="Natural"></el-radio-button>
                  <el-radio-button class="checkbox" label="Vivid"></el-radio-button>
              </el-radio-group>
          </div>
          <div class="block">
              <div class="title">張數</div>
              <el-slider v-model="setting.n" class="slider" :min="0" :max="10" :step="1"></el-slider>
          </div>
          <el-input
              class="textarea"
              type="textarea"
              :autosize="{ minRows: 5, maxRows: 11}"
              placeholder="Input Your Prompt Text"
              v-model="setting.prompt">
          </el-input>
          <div class="block block2">
              <el-button type="primary" class="send" @click="optimization()" :loading="gen.isLoading">{{gen.status}}</el-button>
          </div>
          <div :class="`output output-${setting.size}`" v-if="gen.isFinish">
              <img v-for="(obj,id) in output" :key="id" :src="obj.url" alt="" :class="`img size-${setting.size}`">
          </div>
      </div>
    </div>
  </template>
  
  <script>
  import OpenAI from "openai";
  import {openaiKey} from '../../../apiKey'
  import axios from 'axios';
  import jsCookie from 'js-cookie'
  import {host} from '../../../serverPath'
  import {format} from 'date-fns'
  const openai = new OpenAI({apiKey:openaiKey,dangerouslyAllowBrowser: true});
  export default {
      name:'ImageDetail',
      mounted(){
        console.log()
      },
      data(){
          return{
              gen:{
                  isFinish:false,
                  isLoading:false,
                  status:'Start To Generate'
              },
              output:[],
              compressOutput:[],
              quality:'Standard',
              style:'Vivid',
              setting:{
                  model: "dall-e-2",
                  response_format:'url',
                  n:1,
                  quality:'standard',
                  size:'1024x1024',
                  prompt: '',
                  style:'vivid',
              },
          }
      },
      methods:{
          optimization(){
              if(this.setting.prompt.trim()==''){
                  this.$bus.$emit('handleAlert','Blank are not Allowed','error');
                  return;
              }
              this.$confirm('是否自動優化提示文字？', '提示', {
                  distinguishCancelAndClose: true,
                  confirmButtonText: '優化並生成',
                  cancelButtonText: '直接生成',
                  type: 'warning'
              }).then(() => {
                  this.$bus.$emit('handleAlert','Start To Optimize Your Prompt Text','warning');
                  openai.chat.completions.create({
                      messages: [{
                          role:'system',
                          content:'Please assist in optimizing the text for generating images and reply with the optimized English text only. Ensure to exclude any unrelated content, and refrain from asking questions or engaging in additional dialogue. If the provided text is less than 200 words, please help me by adding creative and vivid elements to exceed 200 words while enhancing realism. Below is the provided text for reference.'
                      },{
                          role:'user',
                          content:this.setting.prompt
                      }],
                      model: "gpt-3.5-turbo"
                  })
                  .then(res=>{
                      this.setting.prompt = res.choices[0].message.content;
                      this.$bus.$emit('handleAlert','Success To Optimize Your Prompt Text','success');
                      setTimeout(()=>{
                          this.generate();
                      },1500)
                  })
                  .catch(e=>{
                      this.$bus.$emit('handleAlert','Failed To Optimize Your Prompt Text','error');
                  })
              })
              .catch((action) => {
                  if(action=='cancel') this.generate();
                  else this.$bus.$emit('handleAlert','Cancel To Generate Image','error');
              });          
          },
          generate(){
              this.$bus.$emit('handleAlert','Start To Generating Image','warning');
              this.setting.style = this.style.toLowerCase();
              this.setting.quality = this.quality.toLowerCase();
              this.gen.isLoading=true;
              this.gen.isFinish=false;
              this.gen.status='Generating...'
              openai.images.generate(this.setting)
              .then(res=>{
                  this.output=res.data;
                  this.recordData();
                  this.$bus.$emit('handleAlert','Success To Generate Image','success')
              })
              .catch(e=>{
                  this.$bus.$emit('handleAlert','Failed To Generate Image','error')
              })
              .finally(()=>{
                  this.gen.isLoading=false;
                  this.gen.isFinish=true;
                  this.gen.status='Start To Generate'
              })
          },
          recordData(){
              axios.post(`${host}/imageHistory/record`,{
                  date:format(new Date(),'yyyy-MM-dd'),
                  record:{
                      output:this.output,
                      quality:this.quality,
                      style:this.style,
                      setting:this.setting,
                  }
              },{
                  headers:{
                      'user-token':jsCookie.get('token')
                  }
              })
              .then(res=>{
                  console.log(res.data)
              })
              .catch(e=>{
                  console.log(e)
              })
          },
      }
  }
  </script>
  
  <style scoped>
      .top{
          top:0;
          width:100%;
          height: 60px;
          text-align: center;
          line-height: 60px;
          font-size: 20px;
          font-weight: bold;
          position: relative;
          border-bottom:0.1px solid rgb(210, 210, 210);
      }
      .back{
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
      .main{
          width: 100%;
          height: calc(100vh - 130px);
          overflow-y: scroll;
          overflow-x: hidden;
      }
      .output{
          width: 100%;
          max-height: 90vw;
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          padding-bottom: 30px;
          overflow: scroll;
      }
      .output-256x256{
          height: 300px;
      }
      .output-512x512{
          height: 600px;
      }
      .output-1024x1024{
          height: 1200px;
      }
      .block{
          width: 100%;
          padding-left: 20px;
          padding-right: 16px;
          height: 80px;
          margin: 0 auto;
          display: flex;
          justify-content: space-evenly;
          align-items: center;
      }
      .title{
          width: 15%;
          font-weight: bold;
      }
      .slider{
          width: 85%;
      }
      .group{
          width: 100% !important;
          margin-left: 6px;
      }
      .textarea{
          width: 92%;
          margin-left: 4.5%;
          margin-right: 3.75%;
      }
      .block2{
          margin-top: 10px;
      }
      .send{
          width:100%;
          margin: 0 auto;
      }
      .img{
          margin: 0 auto;
          margin-top: 15px;
          max-width: 80vw;
          max-height: 80vw;
      }
      .size-256x256{
          width: 256px;
          height: 256px;
      }
      .size-512x512{
          width: 512px;
          height: 512px;
      }
      .size-1024x1024{
          width: 1024px;
          height: 1024px;
      }
      .history{
          position: absolute;
          right:5px;
          height: 60px;
          line-height: 60px;
          width: 60px;
      }
  </style>