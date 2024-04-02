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
      height: 57.5px;
      line-height: 57.5px;
      text-align: center;
      font-weight: bolder;
      font-style: italic;
      border-bottom:0.1px solid rgb(210, 210, 210);
      font-size: 20px;
      position: sticky;
      top:0;
      background-color: white;
    }
    .back{
      position: absolute;
      left:16px;
      top:19px;
    }
</style>