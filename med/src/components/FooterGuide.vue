<template>
    <div class="footer" v-if="!$route.path.includes('/secondHand')">
      <div class="list" :class="{on: $route.path.includes('/main')||$route.path.includes('/schedule')||$route.path.includes('/weather')}" @click="goTo('/main')"><i class="fa-solid fa-house"></i></div>
      <div class="list" :class="{on: $route.path.includes('/navigator')}" @click="goTo('/navigator')"><i class="fa-solid fa-location-dot"></i></div>
      <div class="list" :class="{on: $route.path.includes('/ai') || $route.path.includes('/image')}" @click="goTo('/ai')"><i class="fa-solid fa-message"></i></div>
      <div class="list" :class="{on: !$route.path.includes('/schedule') && !$route.path.includes('/main') && !$route.path.includes('/navigator') && !$route.path.includes('/ai') && !$route.path.includes('/image') && !$route.path.includes('/weather') && !$route.path.includes('/personal')}" @click="goTo('/more')"><i class="fa-solid fa-layer-group"></i></div>
      <div class="list" :class="{on: $route.path.includes('/personal')}" @click="goTo('/personal')"><i class="fa-solid fa-user"></i></div>
    </div>
</template>

<script>
export default {
  methods:{
      goTo(path){
          this.$router.replace(path).catch(()=>{});
      }
  }
}
</script>

<style scoped>
    .footer{
      width: 100%;
      position: fixed;
      bottom: 0;
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      height: 70px;
      font-size: 20px;
      background-color: white;
    }
    .list{
      width:20%;
      line-height: 70px;
      text-align: center;
    }
    .on{
      color: rgb(247, 143, 105);
      border-bottom: 5px solid rgb(247, 143, 105);
      transition: 0.15s all;
    }
</style>