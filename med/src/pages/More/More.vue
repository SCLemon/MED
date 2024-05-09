<template>
  <div>
    <div class="header">
        <div class="second">More Features</div>
    </div>
    <div class="main">
        <div class="row">
            <div class="block c1" @click="goTo('news')">
                <img src="../../../public/images/news.png" alt="">
                <div class="text">即時新聞</div>
            </div>
            <div class="block c2" @click="goTo('/weather')">
                <img src="../../../public/images/weather.png" alt="">
                <div class="text">天氣預報</div>
            </div>
        </div>
        <div class="row">
            <div class="block c2" @click="goTo('/medNews')">
                <img src="../../../public/images/pills.png" alt="">
                <div class="text">醫學知識</div>
            </div>
            <div class="block c1" @click="goTo('/imageGenerator')">
                <img src="../../../public/images/pictures.png" alt="">
                <div class="text">AI 圖片生成</div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
export default {
    name:'More',
    methods:{
        goTo(url){
            if(url=='') this.$bus.$emit('handleAlert','The function will be released soon','warning')
            else this.$router.replace(url);
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
    }
    .main{
        width: 100%;
        height: calc(100vh - 130px);
        overflow: scroll;
        padding-bottom: 20px;
    }
    .row{
        display: flex;
        justify-content: space-evenly;
        margin-top: 15px;
    }
    .block{
        width: 45vw;
        height: 45vw;
        border-radius: 15px;
        float: left;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }
    .c1{
        background: #fcf4e8;
    }
    .c2{
        background: #fffaf4;
    }
    .block>img{
        width:90px;
        height: 90px;
    }
    .text{
        font-size: 18px;
        margin-top: 15px;
        color: gray;
    }
</style>