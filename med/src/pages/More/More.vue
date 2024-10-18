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
            <div class="block c2" @click="goTo('/ubike')">
                <img src="../../../public/images/bike.png" alt="">
                <div class="text">共享單車</div>
            </div>
        </div>
        <div class="row">
            <div class="block c2" @click="goTo('/stock')">
                <img src="../../../public/images/stock.png" alt="">
                <div class="text">市場行情</div>
            </div>
            <div class="block c1" @click="goTo('/secondHand')">
                <img src="../../../public/images/shop.png" alt="">
                <div class="text">二手拍賣</div>
            </div>
        </div>
        <div class="row">
            <div class="block c1" @click="goTo('movie')">
                <img src="../../../public/images/video.png" alt="">
                <div class="text">電影娛樂</div>
            </div>
            <div class="block c2" @click="goTo('/word')">
                <img src="../../../public/images/word.png" alt="">
                <div class="text">單字學習卡</div>
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