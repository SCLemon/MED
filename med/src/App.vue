<template>
  <div id="app" class="app" v-cloak>
    <router-view></router-view>
    <FooterGuide class="footer" v-if="!$route.path.includes('/verify')"></FooterGuide>
  </div>
</template>

<script>
import FooterGuide from './components/FooterGuide.vue'
export default {
  name: 'App',
  components: {
    FooterGuide
  }
}
</script>

<style>
    [v-cloak]{
      display: none;
    }
    input:hover{
      outline: 0;
    }
    ::-webkit-scrollbar{
      display: none;
    }
    .app {
      width:100%;
      margin: 0 auto;
    }
    .footer{
      width:100%;
      position: fixed;
      bottom: 0;
      border-top: 0.1px solid rgb(210, 210, 210);
    }
</style>
