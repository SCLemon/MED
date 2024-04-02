<template>
  <div>ai</div>
</template>

<script>
import axios from 'axios';
export default {
  name:'Ai',
  mounted(){
   
  },
  methods:{
    sendData(){
      axios.post('/chat/record',{
        user: 'John',
        password: '123'
      })
    }
  }
}
</script>

<style>

</style>