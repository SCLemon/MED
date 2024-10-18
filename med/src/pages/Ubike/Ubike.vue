<template>
  <div>123</div>
</template>

<script>
export default {
    name:'Ubike',
    mounted(){
      navigator.geolocation.getCurrentPosition((position)=>{
        console.log(position.coords.latitude,position.coords.longitude)
      },(error)=>{});
    }
}
</script>

<style scoped>

</style>