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
  },
  data(){
    return{}
  },
  mounted(){
    this.$bus.$on('handleAlert',(msg,type)=>this.handleAlert(msg,type));
  },
  methods:{
    handleAlert(msg,type){
      this.$message({
          message: msg,
          type: type
      });
    },
  }
}
</script>

<style>
    [v-cloak]{
      display: none;
    }
    input:focus{
      outline: 0;
    }
    ::-webkit-scrollbar{
      display: none;
    }
    .el-message-box {
      width: 300px !important;
    }
    .el-message{
      top:0 !important;
      height: 60px !important;
    }
    .app {
      width:100%;
      margin: 0 auto;
      position: relative;
      height: 100vh;
      padding-bottom: 50px;
    }
    .alert{
      position: absolute !important;
      top:15px;
      left: 0 !important;
      right: 0 !important;
      margin: 0 auto !important;
      width: 250px !important;
      z-index: 1000;
    }
    .footer{
      width:100%;
      position: fixed;
      bottom: 0;
      border-top: 0.1px solid rgb(210, 210, 210);
    }
</style>
