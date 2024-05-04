<template>
  <div>
    <div class="top">
      <i class="fa-solid fa-hand-holding-medical"></i> Smart Assistant 
      <el-dropdown class="setting">
        <span class="el-dropdown-link">
          <i class="fa-solid fa-bars"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item><router-link :to="{path:'/aiSetting'}" class="link">參數配置</router-link></el-dropdown-item>
          <el-dropdown-item><div @click="toggleUploadBox()">匯入資料</div></el-dropdown-item>
          <el-dropdown-item><div @click="confirmForm('確認刪除？',deleteData)">刪除紀錄</div></el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="chat">
      <div class="list" ref="list">
        <div class="conversation" v-for="(obj,id) in totalMsg" :key="id">
          <img :src="(obj.role!='user')?'/images/robot.jpeg':userImg" alt="" class="user-icon">
          <div class="conversation-content">
            <div class="name">{{ obj.role=='user'?'You':'Lemon AI' }}</div>
            <div class="text" v-html="convertIntoHTML(obj.content)"></div>
            <div class="icoBlock">
              <i class="fa-solid fa-share ico" @click="shareData(obj.content)"></i>
              <i class="fa-solid fa-headphones ico" @click="textSpeech(obj.content)" v-if="!synthStatus"></i>
              <i class="fa-regular fa-circle-stop ico" @click="stopSpeech()" v-else></i>
              <i class="fa-regular fa-copy ico" @click="copyText(obj.content)"></i></div>
          </div>
        </div>
      </div>
      <div class="searchBox">
        <div class="search">
          <input type="file" @change="handleImg()" accept="image/*" ref="imgOrigin" class="img_original"/>
          <i class="fa-solid fa-plus icon-out moreIcon" ref="moreIcon" @click="toggleMore()"></i>
          <el-input class="input" type="textarea" :autosize="{ minRows: 1, maxRows: 4}" :placeholder="placeholder" v-model="input"></el-input>
          <i v-if="!isStillOutput" class="fa-solid fa-feather icon-out" @click="sendChatGPT()"></i>
          <i v-else class="fa-solid fa-hourglass-start fa-spin-pulse icon-out"></i>
        </div>
        <div class="more" ref="more">
          <div class="func">
            <div class="func-icon">
              <i :class="`fa-solid fa-microphone icon ${startVoice?'fa-fade on':''}`" @click="voiceRecognition()"></i>
              <div class="icon-title">語音辨識</div>
            </div>
          </div>
          <div class="func" @click="openOrigin()">
            <div class="func-icon">
              <i class="fa-solid fa-image icon"></i>
              <div class="icon-title">圖片辨識</div>
            </div>
          </div>
          <div class="func" @click="shareData()">
            <div class="func-icon">
              <i class="fa-solid fa-share-from-square icon"></i>
              <div class="icon-title">匯出文字</div>
            </div>
          </div>
          <div class="func" @click="exportJSON()">
            <div class="func-icon">
              <i class="fa-solid fa-arrow-right-arrow-left icon"></i>
              <div class="icon-title">數據交互</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="uploadBox" ref="uploadBox">
      <div class="uploadToggle" @click="toggleUploadBox()"><i class="fa-solid fa-xmark xmark"></i></div>
      <div class="uploadMain" @click="$refs.uploadFile.click()"><i class="fa-solid fa-cloud-arrow-up uploadIcon"></i><div class="uploadText">Upload File</div></div>
      <input type="file" style="display: none;" accept=".json"  ref="uploadFile" @change="importJSON()">
    </div>
  </div>
</template>

<script>
import {host} from '../../serverPath'
import axios from 'axios';
import { format } from 'date-fns'
import OpenAI from "openai";
import {openaiKey} from '../../apiKey'
import jsCookie from 'js-cookie';
import Tesseract from 'tesseract.js'
import markdownit from 'markdown-it'
const openai = new OpenAI({apiKey:openaiKey,dangerouslyAllowBrowser: true});

export default {
  name:'Ai',
  mounted(){
    // 初始化使用者資料
    this.setWindowScroll();
    this.getData();
    this.getSetting();
    // 創建文字轉語音
    this.utterance.rate = 1.05;
    this.utterance.lang = 'auto';
    this.utterance.onend = () => {
      this.synthStatus = !this.synthStatus;
    };

    // 創建語音辨識
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.onstart = (event)=>{
      this.startVoice =true;
      this.placeholder='Sound Recognition Start ...'
      this.$bus.$emit('handleAlert','Sound Recognition Start','success');
    }
    this.recognition.onresult = (event) => {
      var result = event.results[this.outputIndex][0].transcript;
      this.outputIndex++;
      if(result == '發送' || result == '傳送') {
        this.sendChatGPT();
        this.voiceRecognition();
      }
      else if(result =='停止錄音' || result == '結束錄音' || result == '終止錄音' || result == '中止錄音') this.voiceRecognition();
      else if(result =='清除聊天記錄'||result =='刪除聊天記錄') this.deleteData();
      else if(result =='清空輸入' || result =='清除輸入') this.input ='';
      else this.input += result;
    };
    this.recognition.onend = (event)=>{
      this.outputIndex=0;
      this.startVoice=false;
      this.placeholder='Send Your Questions';
      this.$bus.$emit('handleAlert','Sound Recognition Stop','success');
    }
  },
  data(){
    return{
      input:'',
      outputIndex:0,
      setting:{
        temperature:1,
        max_tokens:1000,
        frequency_penalty:0,
        presence_penalty:0,
      },
      isStillOutput:false,
      // synth
      synth:window.speechSynthesis,
      synthStatus:false,
      utterance:new SpeechSynthesisUtterance(),
      // recognition
      startVoice:false,
      recognition:{},
      placeholder:'Send Your Questions',
      totalMsg:[{role:'system',content:'hello! how can I help you?'}],
      userImg:(localStorage.getItem('userImg')==''||localStorage.getItem('userImg')==undefined)?'/images/1.jpeg':localStorage.getItem('userImg')
    }
  },
  watch:{
        totalMsg:{
            deep:true,
            handler(value){
                this.setWindowScroll();
            }
        }
  },
  beforeDestroy(){
    this.recognition={};
  },
  methods:{
    confirmForm(msg,func) {
      this.$confirm(msg, '提示', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        func();
      }).catch(() => {
        this.$bus.$emit('handleAlert','Delete Message Canceled','error');
      });          
    },
    toggleMore(){
      this.$refs.more.classList.toggle('showMore');
      this.$refs.moreIcon.classList.toggle('showMark');
    },
    getSetting(){
      axios.get(`${host}/aiSetting/get/${jsCookie.get('token')}`)
      .then(res=>{
        if(res.data!='new'){
          this.setting = res.data;
        }
        else if(res.data=='new'){}
        else this.$bus.$emit('handleAlert','Failed To Getting Adjust Setting','error');
      })
      .catch(e=>{
        this.$bus.$emit('handleAlert','Getting Setting Error When Connecting Server','error');
      })
    },
    getData(){
      axios.get(`${host}/chat/get/${jsCookie.get('token')}`)
      .then(res=>{
        if(res.data == 'new') this.totalMsg = [{role:'system',content:'hello! how can I help you?'}];
        else this.totalMsg =res.data;
      }).catch(e=>{
        this.$bus.$emit('handleAlert','Getting Message Error','error');
      })
    },
    deleteData(){
      this.input='';
      axios.delete(`${host}/chat/delete/${jsCookie.get('token')}`)
      .then(res=>{
        if(res.data == 'success') {
          this.$bus.$emit('handleAlert','Delete Message Success','success');
          this.getData();
        }
        else this.$bus.$emit('handleAlert','Delete Message Error','error')
      }).catch(e=>{
        this.$bus.$emit('handleAlert','Delete Message Error','error');
      })
    },
    recordData(){
      axios.post(`${host}/chat/record`,{
        record: this.totalMsg
      },{
        headers: {
          'user-token': jsCookie.get('token'),
        }
      }).then(res=>{
        if(res.data=='success'){
          this.input=''
          this.getData();
        }
        else{
          this.$bus.$emit('handleAlert','Record Message Error','error')
        }
      }).catch(e=>{
        this.$bus.$emit('handleAlert','Recording Message Error','error');
      })
    },
    async sendChatGPT(){
      if(this.input.trim()!='' && !this.isStillOutput){
        this.isStillOutput=true;
        this.$refs.moreIcon.classList.remove('showMark');
        this.$refs.more.classList.remove('showMore');
        this.totalMsg.push({
          role:'user',
          content:this.input
        },{
          role:'assistant',
          content:''
        });
        this.input=''
        const response = await openai.chat.completions.create({
          messages: this.totalMsg,
          model: "gpt-3.5-turbo",
          stream:true,
          max_tokens:this.setting.max_tokens,
          temperature:this.setting.temperature,
          frequency_penalty:this.setting.frequency_penalty,
          presence_penalty:this.setting.presence_penalty
        })
        for await (const chunk of response) {
          const data = chunk.choices[0].delta.content;
          if(data==undefined){
            this.recordData();
            this.isStillOutput=false;
          }
          else this.totalMsg[this.totalMsg.length-1].content+=data;
        }
      }
      else if (this.isStillOutput){
        this.$bus.$emit('handleAlert','Please Wait For Text Generating','error');
      }
      else this.$bus.$emit('handleAlert','Blank are Not Allowed','error');
    },
    setWindowScroll(){
      var el = this.$refs.list;
      this.$nextTick(function(){
        el.scrollTop = el.scrollHeight;
      })
    },
    voiceRecognition(){
      if(this.startVoice){
        this.recognition.stop();
      }
      else this.recognition.start();
      // 開始錄音轉為 true
      this.startVoice = !this.startVoice; 
    },
    handleImg(){
      this.$bus.$emit('handleAlert','Image Recognize Start','success');
      try{
        const languages = ['eng', 'chi_tra', 'chi_sim'];
        const file = event.target.files[0];
        if (!file) return;
        this.placeholder='Image Recognizing ...'
        const imageURL = URL.createObjectURL(file);
        Tesseract.recognize(imageURL,languages.join('+'))
        .then((d) => {
          this.$bus.$emit('handleAlert','Success To Recognize Image','success');
          this.placeholder = 'Send Your Questions',
          this.input += d.data.text;
        })
      }catch(e){
        this.$bus.$emit('handleAlert','Failed To Start Image Recognizer','error');
      }
    },
    openOrigin(){
      this.$refs.imgOrigin.click();
    },
    copyText(text){
      try{
        navigator.clipboard.writeText(text)
        this.$bus.$emit('handleAlert','Copy Text Successfully','success');
      }
      catch(e){
        this.$bus.$emit('handleAlert','Failed To Copy Text','error');
      }
    },
    textSpeech(text){
      this.synthStatus = true;
      this.utterance.text = text;
      this.synth.speak(this.utterance);
    },
    stopSpeech(){
      this.synthStatus = false;
      this.synth.cancel();
    },
    getVoiceList(){ // 之後可以用來創建客製化列表
      var voices;
      window.speechSynthesis.addEventListener('voiceschanged', function(){
        voices = this.getVoices();
        console.log(voices);
      });
    },
    isMobile(){
      if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i)
          || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i)|| navigator.userAgent.match(/Windows Phone/i))
        {
          return true;
        }
      else return false;
    },
    shareData(content){
      try{
        var output;
        if(content) output=`<meta charset="utf-8"><div style='line-height:2'>${content}</div>`;
        else output = `<meta charset="utf-8">`+this.totalMsg.map((item)=>{
          return `<div style='line-height:2'>${item.role} : ${item.content}</div>`
        }).join('<br>');
        const blob = new Blob([output], { type: 'text/html' });

        if(navigator.share){
          const file = new File([blob],`${format(new Date(),'yyyy-MM-dd')}-chatRecord.html`)
          navigator.share({
            files:[file],
            title:`${format(new Date(),'yyyy-MM-dd')}-chatRecord.html`
          })
          .then(res=>{
            this.$bus.$emit('handleAlert','Success To Share Data','success');
          })
          .catch(e=>{
            this.$bus.$emit('handleAlert','Share Data Canceled','error');
          });
        }
        else{
          let fileName = `${format(new Date(),'yyyy-MM-dd')}-chatRecord.html`
          var href = URL.createObjectURL(blob);
          var link = document.createElement("a");
          document.body.appendChild(link);
          link.href = href;
          link.download = fileName;
          link.click();
          document.body.removeChild(link);
          this.$bus.$emit('handleAlert','Success To Share Data','success');
        }
      }catch(e){
        this.$bus.$emit('handleAlert','Failed To Share Data','error');
      }
    },
    exportJSON(){
     try{
      const blob = new Blob([JSON.stringify(this.totalMsg)], { type: 'text/json' });
      const file = new File([blob],`${format(new Date(),'yyyy-MM-dd')}-chatRecord.json`)
      if(navigator.share){ 
        navigator.share({
          files:[file],
          title:`${format(new Date(),'yyyy-MM-dd')}-chatRecord.json`
        })
        .then(res=>{
          this.$bus.$emit('handleAlert','Success To Share Data','success');
        })
        .catch(e=>{
          this.$bus.$emit('handleAlert','Share Data Canceled','error');
        });
      }
      else{
        let fileName = `${format(new Date(),'yyyy-MM-dd')}-chatRecord.json`
        var href = URL.createObjectURL(blob);
        var link = document.createElement("a");
        document.body.appendChild(link);
        link.href = href;
        link.download = fileName;
        link.click();
        document.body.removeChild(link);
        this.$bus.$emit('handleAlert','Success To Export Data','success');
      }
     }catch(e){
      this.$bus.$emit('handleAlert','Failed To Export Data','error');
     }
    },
    importJSON(){
     try{
      var file = this.$refs.uploadFile.files[0];
      var fileReader = new FileReader();
      fileReader.onload = (e)=>{
        this.totalMsg = JSON.parse(e.target.result);
        this.$refs.uploadFile.value='';
        this.toggleUploadBox();
        this.recordData();
        this.$bus.$emit('handleAlert','Success To Import Data','success');
      }
      fileReader.readAsText(file);
     }
     catch(e){
      this.$bus.$emit('handleAlert','Failed To Import Data','error');
     }
    },
    toggleUploadBox(){
      var target = this.$refs.uploadBox;
      target.classList.toggle('uploadShow')
    },
    convertIntoHTML(text){
      const md = markdownit();
      return md.render(text);
    }
  }
}
</script>

<style scoped>
  .link{
    text-decoration: none;
    color: #606266;
  }
  .uploadBox{
    position: absolute;
    top:0;
    left:0;
    bottom: 0;
    right:0;
    margin: auto;
    width:100vw;
    height:100vh;
    z-index:1001;
    background-color: rgba(0,0,0,0.4);
    display: none;
    justify-content: center;
    align-items: center;
  }
  .uploadShow{
    display: flex;
  }
  .uploadToggle{
    position: absolute;
    top:10px;
    left:10px;
    width: 40px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    color: white;
    font-size: 24px;
  }
  .uploadMain{
    width: 90%;
    color: rgba(255,255,255,0.9);
    text-align: center;
  }
  .uploadIcon{
    font-size: 100px;
  }
  .uploadText{
    margin-top: 20px;
    font-size: 24px;
  }
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
  .chat{
    position: relative;
    width:100%;
    height: calc(100vh - 130px);
  }
  .text{
    line-height: 1.6;
  }
  .el-dropdown-link {
    cursor: pointer;
    color: black;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
  .setting{
    position: absolute;
    right: 0px;
    top:0px;
    width: 70px;
    height: 60px;
    font-size: 20px;
  }
  .searchBox{
    position: absolute;
    bottom:0;
    width:100%;
    background: white;
  }
  .search{
    width:100%;
    height: auto;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    font-size: 17px;
    padding-left: 10px;
    padding-right: 10px;
  }
  .icon-out{
    width: 10%;
    font-size: 20px;
    line-height: 60px;
    text-align: center;
  }
  .more{
    width: 100%;
    height: auto;
    display: none;
    justify-content: space-evenly;
    flex-wrap: wrap;
  }
  .moreIcon{
    transform: rotate(0deg);
    transition: 0.25s;
  }
  .showMore{
    display: flex;
  }
  .showMark{
    transform: rotate(225deg);
    transition: 0.25s;
  }
  .func{
    width: 25vw;
    height: 25vw;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .icon{
    width: 100%;
    text-align: center;
    font-size: 20px;
  }
  .icon-title{
    margin-top: 8px;
    font-size: 14px;
    color: gray;
  }
  .list{
    width: 100%;
    height: calc(100% - 60px);
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
    padding-top: 10px;
  }
  .conversation{
    display: flex;
    justify-content: space-evenly;
    padding: 10px;
    padding-left: 5px;
    padding-right: 12px;
    width: 100%;
  }
  .user-icon{
    width: 40px;
    height: 40px;
    border-radius: 40px;
  }
  .conversation-content{
    width:80%;
    text-align: justify;
  }
  .name{
    margin-bottom: 3px;
    font-weight: bolder;
  }
  .on{
    color: red;
  }
  .input{
    width: 70%;
    padding:3px;
    margin-left: 8px;
    margin-right: 8px;
  }
  .img_original{
    display: none;
  }
  .icoBlock{
    width: 100%;
    height: 25px;
    margin-top: 7px;
    display: flex;
    color: rgba(205,205,205);
    justify-content: right;
  }
  .ico{
    padding-left: 8px;
  }
  .ico:active,.ico:hover{
    color: black;
    cursor: pointer;
  }
</style>