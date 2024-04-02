<template>
    <div class="footer">
      <div class="list" :class="{on: $route.path.includes('/main')}" @click="goTo('/main')"><i class="fa-solid fa-house"></i></div>
      <div class="list" :class="{on: $route.path.includes('/navigator')}" @click="goTo('/navigator')"><i class="fa-solid fa-location-dot"></i></div>
      <div class="list" :class="{on: $route.path.includes('/ai')}" @click="goTo('/ai')"><i class="fa-solid fa-robot"></i></div>
      <div class="list" :class="{on: $route.path.includes('/news')}" @click="goTo('/news')"><i class="fa-solid fa-newspaper"></i></div>
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
      height: 50px;
      font-size: 18px;
      background-color: white;
    }
    .list{
      width:20%;
      line-height: 50px;
      text-align: center;
    }
    .on{
      color: rgb(247, 143, 105);
      border-bottom: 5px solid rgb(247, 143, 105);
      transition: 0.15s all;
    }
</style>