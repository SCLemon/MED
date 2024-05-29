<template>
    <div>
        <div class="header">
            <div v-if="!isSearch">Stock Watchlist</div>
            <input v-else type="text" class="input" v-model="input" ref="input" placeholder="Search Stock">
            <div class="icon" @click="search()">
                <i class="fa-solid fa-magnifying-glass"></i>
            </div>
            <div class="icon2" @click="changeExchange()">
                <i class="fa-solid fa-arrow-right-arrow-left"></i>
            </div>
        </div>
        <div class="listHeader">
            <div class="title title-extend">商品</div>
            <div class="title">代號</div>
        </div>
        <div class="listBox" ref="listBox">
            <router-link :to="{path:'/stockInfo',query:{'stock':obj}}" class="product" v-for="(obj,id) in findData" :key="id">
                <div class="title title-extend product-name">{{obj.name}}</div>
                <div class="title">{{ obj.symbol }}</div>
            </router-link>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    name:'Stock',
    data(){
        return{
            isSearch:false,
            list:[],
            input:'',
            market:'TWSE'
        }
    },
    computed:{
        findData(){
            return this.list.filter(obj=>{
                return obj.name.includes(this.input) || obj.symbol.includes(this.input);
            })
        }
    },
    mounted(){
       this.getData();
    },
    methods:{
        getData(){
            axios.get(`/stock/list?exchange=${this.market}`)
            .then(res=>{
                if(!res.data.data.length){
                    this.$bus.$emit('handleAlert',`Failed To Get Info of ${this.market} Market`,'error')
                }
                else {
                    this.list = res.data.data
                    this.$nextTick(()=>{
                        this.$refs.listBox.scrollTop = 0;
                    })
                }
            })
            .catch(e=>{
                this.$bus.$emit('handleAlert',`Failed To Get Info of ${this.market} Market`,'error')
            })
        },
        changeExchange(){
            this.market == 'TWSE'? this.market = 'TPEx': this.market = 'TWSE';
            this.getData();
        },
        search(){
            this.isSearch=!this.isSearch;
            this.$nextTick(()=>{
                if(this.isSearch) this.$refs.input.focus();
            })
        }
    }
}
</script>

<style scoped>
    .header{
      width:100%;
      height: 60px;
      line-height: 60px;
      text-align: center;
      font-weight: bolder;
      border-bottom:0.1px solid rgb(210, 210, 210);
      font-size: 20px;
      position: sticky;
      top:0;
      background-color: white;
      position: relative;
    }
    .icon{
        position: absolute;
        right:10px;
        top:0;
        width: 60px;
    }
    .icon2{
        position: absolute;
        left:10px;
        top:0;
        width: 60px;
    }
    .icon:hover{
        cursor: pointer;
    }
    .listHeader{
        display: flex;
        align-items: center;
        justify-content: center;
        height: calc((100vh - 130px) / 11);
        line-height: 60px;
        background-color: rgba(248,248,248);
    }
    .product{
        display: flex;
        align-items: center;
        justify-content: center;
        height: calc((100vh - 130px) / 11);
        line-height: 60px;
        text-decoration: none;
    }
    .product-name{
        white-space: nowrap;
        overflow-x: scroll;
    }
    .title{
        width: 30%;
        color:gray;
        text-align: center;
    }
    .title-extend{
        width: 70%;
    }
    .listBox{
        height: calc(100vh - 190px);
        overflow-y:scroll;
    }
    .input{
        height: 40px;
        border-radius: 0;
        border: 0;
        border-bottom: 1px solid rgba(210,210,210);
        font-size: 16px;
        font-weight: normal;
        width: 220px;
        padding-left: 10px;
        padding-right: 10px;
    }
</style>