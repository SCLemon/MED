<template>
  <div>
    <div class="top">
      <i class="fa-solid fa-hand-holding-medical"></i> Smart Assistant <i class="fa-solid fa-eraser eraser" @click="confirmForm('確認刪除？',deleteData)"></i>
    </div>
    <div class="chat">
      <div class="list" ref="list">
        <div class="conversation" v-for="(obj,id) in totalMsg" :key="id">
          <img :src="(obj.role!='user')?'/images/robot.jpeg':userImg" alt="" class="user-icon">
          <div class="conversation-content">
            <div class="name">{{ obj.role=='user'?'You':'Lemon AI' }}</div>
            <div class="text" v-text="obj.content"></div>
            <div class="icoBlock">
              <i class="fa-solid fa-file-arrow-down ico" @click="generatePDF(obj.content)"></i>
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
          <i class="fa-solid fa-paper-plane icon-out" @click="sendChatGPT()"></i>
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
          <div class="func" @click="generatePDF()">
            <div class="func-icon">
              <i class="fa-solid fa-file-pdf icon"></i>
              <div class="icon-title">匯出資料</div>
            </div>
          </div>
          <div class="func"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { format } from 'date-fns'
import OpenAI from "openai";
import jsCookie from 'js-cookie';
import Tesseract from 'tesseract.js'
import { jsPDF } from "jspdf";
const apiKey = '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';
const openai = new OpenAI({apiKey:apiKey,dangerouslyAllowBrowser: true});

export default {
  name:'Ai',
  mounted(){
    // 初始化使用者資料
    this.setWindowScroll();
    this.getData();

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
    getData(){
      axios.get(`/chat/get/${jsCookie.get('token')}`)
      .then(res=>{
        if(res.data == 'new') this.totalMsg = [{role:'system',content:'hello! how can I help you?'}];
        else this.totalMsg =res.data;
      }).catch(e=>{
        this.$bus.$emit('handleAlert','Getting Message Error','error');
      })
    },
    deleteData(){
      this.input='';
      axios.delete(`/chat/delete/${jsCookie.get('token')}`)
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
      axios.post('/chat/record',{
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
      if(this.input.trim()!=''){
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
          max_tokens:1000
        })
        for await (const chunk of response) {
          const data = chunk.choices[0].delta.content;
          if(data==undefined) this.recordData();
          else this.totalMsg[this.totalMsg.length-1].content+=data;
        }
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
    generatePDF(content){
      if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i)
          || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i)|| navigator.userAgent.match(/Windows Phone/i))
        {
          this.$bus.$emit('handleAlert','Mobile phones currently do not support PDF export.','error');
          return;
        }
      try{
        const pageSize = 'a4'; 
        const marginLeft = 20;
        const marginRight = 20;
        var lineCount=1;
        const doc = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: pageSize,
          marginLeft: marginLeft,
          marginRight: marginRight,
          lineHeight: 1.5,
        });
        doc.addFont('ttf/TaipeiSansTCBeta-Regular.ttf','TaipeiSans','normal');
        doc.setFont('TaipeiSans')
        console.log('here')
        if(content){
          var text = doc.splitTextToSize(content,235-marginLeft-marginRight);
          doc.text(text, 10, 15);
        }
        else{
          for(var obj of this.totalMsg){
            var text = doc.splitTextToSize(`${obj.role}: ${obj.content}`,235-marginLeft-marginRight)
            if(lineCount+text.length>34){
              doc.addPage('a4','p');
              lineCount=1;
            }
            doc.text(text, 10, 15+10*(lineCount-1),{});
            lineCount+=(text.length==1?text.length:text.length-1);
          }
        }
        doc.save(`${format(new Date(),'yyyy-MM-dd')}-chatRecord.pdf`);
        this.$bus.$emit('handleAlert','Export Data into PDF Successfully','success');
      }catch(e){
        this.$bus.$emit('handleAlert','Failed To Export Data into PDF','error');
      }
    }
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
  .chat{
    position: relative;
    width:100%;
    height: calc(100vh - 130px);
  }
  .eraser{
    position: absolute;
    right: 20px;
    top:20px;
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