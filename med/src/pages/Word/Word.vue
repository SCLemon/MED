<template>
    <div>
        <div class="header">
            <div class="searchBar">
                <div :class="`searchInput`">
                    <i class="fa-solid fa-magnifying-glass glass"></i>
                    <input type="text" class="input" v-model="q" placeholder="Search the meanings of the words">
                </div>
            </div>
            <router-link class="globe" :to="{
                path:'/word/option',
                query:{category:this.category,status:this.status,list:this.list}
            }"><i class="fa-solid fa-pen"></i></router-link>
        </div>
        <div class="category">
            <div  v-for="cat in categories" :key="cat" :class="['cat-select', {'selected': category === cat}]" @click="changeCat(cat)">{{ cat }}</div>
        </div>
        <div class="main" ref="main">
            <div class="each" v-for="(obj,id) in list" :key="id" v-show="obj.word.includes(q.toLowerCase())">
                <div :class="`color ${colorStatus(id)}`"></div>
                <div class="text">{{obj.word}}</div>
                <div class="mean">{{obj.definitions[0].partOfSpeech=='片'?'phrase':obj.definitions[0].partOfSpeech}}. {{obj.definitions[0].text}}</div>
            </div>
        </div>
        <div class="pro">
            <el-progress :percentage="percent"></el-progress>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import jsCookie from 'js-cookie'
export default {
    name:'Word',
    data(){
        return{
            categories: ['Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5', 'Level 6', 'Level 7', 'Level 8','Level 9'],
            category: 'Level 1',
            q:'',
            list:[],
            status:{
                'Level 1':[],
                'Level 2':[],
                'Level 3':[],
                'Level 4':[],
                'Level 5':[],
                'Level 6':[],
                'Level 7':[],
                'Level 8':[],
                'Level 9':[],
            }
        }
    },
    mounted(){
        this.getData();
        setTimeout(() => {
            this.getStatus();
        }, 250);
    },
    computed:{
        percent(){
            if(this.list.length){
                var count =this.status[this.category].filter((x)=> x >= 2).length;
                return +((count / this.list.length)*100).toFixed(0);
            }
            else return 0;
        },
    },
    watch:{
        category:{
            deep:true,
            handler(){
                this.$nextTick(()=>{
                    this.$refs.main.scrollTop = 0;
                })
            }
        }
    },
    methods:{
        getData(){
            axios.get(`/json/${this.category}.json`)
            .then(res=>{
                res.data.forEach((obj,id)=>{obj.index = id;})
                this.list = res.data
            })
        },
        getStatus(){
            axios.get(`/word/status/${jsCookie.get('token')}`)
            .then(res=>{
                this.status = res.data
            })
        },
        changeCat(cat){
            this.category = cat;
            this.getData();
        },
        colorStatus(id){
            try{
                var status = this.status[this.category][id];
                if(status<0) return 'red'
                else if (status == 0 || status==undefined) return ''
                else if (status == 1) return 'yellow'
                else if (status >= 2) return 'green'
            }
            catch(e){}
        }
    }
}
</script>

<style scoped>
    .header{
        padding-top: 30px;
        width:100%;
        height: 80px;
        display: flex;
        align-items: center;
    }
    .searchBar{
        width: 80%;
        height: 50px;
        margin: 0 auto;
        border-radius: 5px;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        color: rgba(190,190,190);
        background-color: rgba(240,240,240);
    }
    .searchInput{
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        width: 100%;
    }
    .globe{
        width: 10%;
        font-size: 20px;
        text-decoration: none;
        color: black;
    }
    .glass{
        width: 10%;
        text-align: center;
    }
    .input{
        width: 80%;
        border: 0;
        background: transparent;
        font-size: 16px;
    }
    .category{
        width:90%;
        margin: 0 auto;
        margin-top: 10px;
        height: 60px;
        overflow-y: scroll;
        white-space: nowrap;
        display: flex;
        align-items: center;
        padding-right: 5px;
    }
    .cat-select{
        display: inline-block;
        margin-right: 7px;
        border: 1px solid rgba(235,235,235);
        padding-top: 5px;
        padding-bottom: 5px;
        padding-left: 10px;
        padding-right: 10px;
        border-radius: 15px;
        color: rgba(190,190,190);

    }
    .cat-select:hover{
        cursor: pointer;
    }
    .selected{
        background-color: black;
        color: white;
        border: 1px solid black;
    }
    .main{
        margin-top: 5px;
        width: 100%;
        height: calc(100vh - 265px);
        overflow-y:scroll;
    }
    .each{
        text-decoration: none;
        width: 100%;
        height: calc((100vh - 265px) / 10);
        border-bottom: 1px solid rgb(245,245,245);
        line-height: calc((100vh - 265px) / 10);
        padding-left: 20px;
        padding-right: 20px;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        position: relative;
    }
    .pro{
        height: 40px;
        padding-top: 12.21px;
        padding-left: 20px;
        padding-right: 10px;
    }
    .color{
        width: 5px;
        height: calc((100vh - 265px) / 10);
        position: absolute;
        left: 0;
    }
    .text{
        width: 50%;
        overflow-x:scroll;
        white-space: nowrap;
        font-size: 16px;
    }
    .mean{
        width: 50%;
        overflow-x:scroll;
        white-space: nowrap;
        text-align: right;
        color: rgb(190,190,190);
    }
    .red{
        background: red;
    }
    .yellow{
        background: yellow;
    }
    .green{
        background: greenyellow;
    }
</style>