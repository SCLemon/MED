<template>
  <div class="all">
    <div class="top">
        <div class="back" @click="$router.replace('/word')"><i class="fa-solid fa-chevron-left left"></i>back</div>
        {{category}}
        <div class="interval">{{interval}}</div>
    </div>
    <div class="main">
        <div class="questionBox">
            <i class="fa-solid fa-volume-high volume" @click="speak()"></i>
            <div class="count">
                {{num+1}}/{{ shuffleIndex.length }}
            </div>
            <div class="input">
                <input type="text" :class="`each ${color}`" v-model="q" :placeholder="placeholder">
            </div>
            <div class="text-1">{{showQuestion.definitions?showQuestion.definitions[0].partOfSpeech:''}}.</div>
            <div class="text-2">{{showQuestion.definitions?showQuestion.definitions[0].text:''}}</div>
            <div class="btn-1" @click="check()" v-if="isChange==0">Show Answer</div>
            <div class="btn-1" @click="next()" v-if="isChange==0">Skip</div>
            <div class="btn-1" @click="next()" v-else>Next</div>
            <div class="scrollBar">
                <div class="scrollText">slow</div>
                <div class="scroll">
                    <input type="range" v-model="speed">
                </div>
                <div class="scrollText">quick</div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import jsCookie from 'js-cookie';
import {format} from 'date-fns'
export default {
    name:'WordTest',
    data(){
        return{
            category:this.$route.query.category,
            list:this.$route.query.list,
            options:this.$route.query.options,
            shuffleIndex:[],
            showQuestion:{},
            status:this.$route.query.status,
            q:'',
            num:0,
            color:'black',
            isChange:0,
            timer:0,
            second:0,
            interval:'00:00',
            speed:50,
            synth:window.speechSynthesis,
            utterance:new SpeechSynthesisUtterance(),
        }
    },
    mounted(){
        if(this.status[this.category].length == 0){
            this.status[this.category] = Array(this.list.length).fill(0);
        }
        this.shuffleArray();
        this.showQuestion = this.list[this.shuffleIndex[this.num]];
        this.timer = setInterval(()=>{
            this.second++;
            if(this.second >= 3600){
                clearInterval(this.timer);
                this.$bus.$emit('handleAlert',`Time's up.`,'success');
                setTimeout(() => {
                    this.$router.back(); 
                }, 1500);
            }
            else this.interval = format(new Date(this.second*1000),'mm:ss')
        },1000)
        this.utterance.lang = 'auto';
    },
    beforeDestroy(){
        clearInterval(this.timer);
        this.record();
    },
    computed:{
        question(){
            var original = this.status[this.category].map((obj,id)=>{return id})
            .filter(obj=>{
                return obj!=undefined && (obj>=(this.options.range[0]-1)) && (obj<=(this.options.range[1]-1))
            })
            if(this.options.degree == 'all') return original
            else{
                var after = this.status[this.category].map((obj,id)=>{
                    return obj<=+(this.options.degree) ? id:undefined
                }).filter(obj=>{
                    return obj!=undefined && (obj>=(this.options.range[0]-1)) && (obj<=(this.options.range[1]-1))
                })
                if(after.length == 0) return original
                else return after
            }
        },
        placeholder(){
            if(this.showQuestion.word){
                var str = this.showQuestion.word;
                var firstChar = str.charAt(0);
                var lastChar = str.charAt(str.length - 1);
                var middlePart = str.slice(1, -1).replace(/[^\s]/g, "_");
                return firstChar + middlePart + lastChar;
            }
           else return ''
        },
    },
    methods:{
        shuffleArray(){
            let shuffledArray = this.question.slice();
            for (let i = shuffledArray.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
            }
            this.shuffleIndex = shuffledArray.slice(0,this.options.quantity);
        },
        check(){
            this.isChange=1;
            if((this.q).toLowerCase() == (this.list[this.shuffleIndex[this.num]].word).toLowerCase()){
                this.status[this.category][this.shuffleIndex[this.num]]++;
                this.color='green'
            }
            else{
                this.status[this.category][this.shuffleIndex[this.num]]--;
                this.color='red'
            }
            this.q = this.showQuestion.word;
        },
        next(){
            this.isChange=0;
            this.num++;
            this.color='black'
            if(this.num == this.shuffleIndex.length){
                this.$bus.$emit('handleAlert','Congratulations on completing the answer.','success');
                this.$router.replace('/word');
            }
            else this.showQuestion = this.list[this.shuffleIndex[this.num]];
            this.q='';
        },
        record(){
            axios.post('/word/record',{status:this.status},{
                headers:{
                    'user-token':jsCookie.get('token')
                }
            })
            .then(res=>{})
            .catch(e=>{
                this.$bus.$emit('handleAlert','Failed To Record Your Test','error');
            })
        },
        speak(){
            this.utterance.rate = this.speed/50;
            this.utterance.text = this.showQuestion.word;
            this.synth.speak(this.utterance);
        }
    }
}
</script>

<style scoped>
    ::placeholder{
        font-size: 20px;
        color: rgb(210,210,210);
    }
    .all{
        background-color: rgb(236, 236, 236);
    }
    .top{
        width: 100%;
        padding-top: 15px;
        height: 90px;
        text-align: center;
        line-height: 90px;
        font-size: 24px;
        position: relative;
    }
    .back{
        position: absolute;
        left:20px;
    }
    .back:hover{
        cursor: pointer;
    }
    .left{
        margin-right: 10px;
    }
    .interval{
        position: absolute;
        right:20px;
        top:15px;
        height: 90px;
        line-height: 90px;
    }
    .main{
        width: 100%;
        height: calc(100vh - 160px);
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .questionBox{
        width: 90%;
        height: 70vh;
        background: white;
        box-shadow: 11px -11px 0px black;
        text-align: center;
        font-size: 20px;
        display: flex;
        flex-direction: column;
        position: relative;
    }
    .volume{
        position: absolute;
        top:40px;
        left:40px;
    }
    .volume:hover{
        cursor: pointer;
    }
    .count{
        width: 100%;
        line-height: 100px;
        height: 100px;
    }
    .input{
        width: 100%;
        height: 120px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .each{
        border: 0;
        border-radius: 0;
        border-bottom: 1px solid rgb(190,190,190);
        width: 60%;
        text-align: center;
    }
    .text-1{
        width: 100%;
        height: 40px;
        line-height: 40px;
    }
    .text-2{
        width: 100%;
        padding-left: 30px;
        padding-right: 30px;
        line-height: 2;
        margin-bottom: 20px;
    }
    .btn-1{
        width: 100%;
        height: 50px;
        line-height: 50px;
    }
    .btn-1:hover{
        cursor: pointer;
    }
    .black{
        color: black;
    }
    .red{
        color: red;
    }
    .green{
        color:lightgreen;
    }
    .scrollBar{
        height: 60px;
        margin-top: 20px;
        display: flex;
        margin-left: 20px;
        margin-right: 20px;
    }
    .scroll{
        width: 60%;
        display: flex;
        align-items: center;
    }
    input[type="range"] {
        height: 1px;
    }
    .scrollText{
        width: 20%;
        display: inline-block;
        line-height: 60px;
        padding-left: 10px;
        padding-right: 10px;
    }
</style>