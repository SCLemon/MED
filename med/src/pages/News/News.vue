<template>
  <div>
    <div class="header">
        <i class="fa-solid fa-chevron-left back" v-if="$route.path == '/news/detail'" @click="$router.back()"></i>
        <div class="second">Health Medical News</div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name:'News',
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
</style>