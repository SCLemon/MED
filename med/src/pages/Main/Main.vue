<template>
  <div class="mainBox">
    <i class="fa-solid fa-chevron-left back" v-if="$route.path != '/main'" @click="$router.back()"></i>
    <div class="top">TodoList Reminder</div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "Main",
};
</script>

<style scoped>
.top {
  width: 100%;
  height: 60px;
  line-height: 60px;
  text-align: center;
  font-weight: bolder;
  border-bottom: 0.1px solid rgb(210, 210, 210);
  font-size: 20px;
  position: sticky;
  top: 0;
  background-color: white;
}
.back {
  position: absolute;
  left: 16px;
  top: 20px;
  font-size: 20px;
  z-index:999;
}
.back:hover{
  cursor: pointer;
}
</style>