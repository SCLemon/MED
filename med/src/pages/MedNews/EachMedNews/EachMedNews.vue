<template>
  <div class="main">
    <div class="title" v-text="news['標題']"></div>
    <div class="content" v-html="news['內容']"></div>
  </div>
</template>

<script>
export default {
    name:'EachMedNews',
    mounted(){},
    data(){
        return{
            news:this.$route.query.NewsContent
        }
    }
}
</script>

<style scoped>
    .main{
        height: calc(100vh - 130px);
        text-align: justify;
        padding: 17.5px;
        padding-bottom: 30px;
        overflow: scroll;
    }
    .title{
        font-size: 22px;
        font-weight: bolder;
        margin-bottom: 10px;
    }
    .content{
        margin-top: 20px;
        padding-bottom: 20px;
        overflow-x: hidden;
        overflow-y: scroll;
    }
</style>