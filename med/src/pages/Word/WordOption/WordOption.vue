<template>
  <div class="all">
    <div class="top">
        <div class="back" @click="$router.back()"><i class="fa-solid fa-chevron-left left"></i>back</div>
        Exam Options
    </div>
    <div class="main">
        <div class="questionBox">
            <div class="chapter">Options</div>
            <div class="section">
               <span>Category</span><el-input :placeholder="category" :disabled="true"></el-input>
            </div>
            <div class="degree">
                <el-radio class="check" v-model="options.degree" label="-1">Wrong</el-radio>
                <el-radio class="check" v-model="options.degree" label="1">Basic</el-radio>
                <el-radio class="check" v-model="options.degree" label="2">A++</el-radio>
                <el-radio class="check" v-model="options.degree" label="all">All</el-radio>
            </div>
            <div class="section">
               <span class="text"> Range </span><el-slider v-model="options.range" range show-stops :min="1" :max="list.length"></el-slider>
            </div>
            <div class="section">
               <span class="text"> Quantity </span><el-input-number v-model="options.quantity" :min="1" :max="options.range[1]-options.range[0]+1" label="描述文字"></el-input-number>
            </div>
            <div class="section">
                <el-button type="primary" class="btn" @click="start()">Start Exam</el-button>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
export default {
    name:'WordOption',
    data(){
        return {
            options:{
                range:[1,100],
                degree:'1',
                quantity:20,
            },
            status:this.$route.query.status,
            category:this.$route.query.category,
            list:this.$route.query.list,
        }
    },
    watch:{
        options:{
            deep:true,
            handler(){
                var limit = this.options.range[1]-this.options.range[0]
                if(this.options.quantity > limit){
                    this.options.quantity = limit+1
                }
            }
        }
    },
    methods:{
        start(){
            this.$router.push({
                path:'/word/test',
                query:{
                    list:this.list,
                    category:this.category,
                    status:this.status,
                    options:this.options
                }
            })
        }
    }
}
</script>

<style scoped>
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
    .chapter{
        width: 100%;
        height: 80px;
        line-height: 80px;
    }
    .section{
        width: 90%;
        height: 80px;
        line-height: 80px;
        display: flex;
        justify-content:left;
        align-items: center;
        font-size: 16px;
        padding-left: 40px;
    }
    .text{
        margin-right: 20px;
        width: 20%;
        text-align: left;
    }
    .el-slider{
        width: 70%;
    }
    .degree{
        width: 90%;
        height: 80px;
        line-height: 80px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .el-input{
        width: 75% !important;
        margin-left: 15px;
    }
    .btn{
        width: 100%;
    }
</style>