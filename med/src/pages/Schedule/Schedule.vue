<template>
  <div class="mainBox">
    <div class="main">
      <div class="title">School Schedule</div>
      <div class="table">
        <div class="col">
          <div class="t">Class</div>
          <div class="t">Mon</div>
          <div class="t">Tue</div>
          <div class="t">Wed</div>
          <div class="t">Thu</div>
          <div class="t">Fri</div>
          <div class="t">Sat</div>
          <div class="t">Sun</div>
        </div>
        <div v-for="(column, columnName) in list" :key="columnName" class="col">
          <div class="rows">{{ columnName.split('c')[1] }}</div>
          <div v-for="(value, key) in column" :key="key" class="rows">
            <input type="text" v-model="list[columnName][key]">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {host} from '../../serverPath'
import axios from 'axios'
import jsCookie from 'js-cookie';
export default {
    name:'Schedule',
    data(){
      return{
        list:{
          'c1':{'v1':'','v2':'','v3':'','v4':'','v5':'','v6':'','v7':''},
          'c2':{'v1':'','v2':'','v3':'','v4':'','v5':'','v6':'','v7':''},
          'c3':{'v1':'','v2':'','v3':'','v4':'','v5':'','v6':'','v7':''},
          'c4':{'v1':'','v2':'','v3':'','v4':'','v5':'','v6':'','v7':''},
          'cn':{'v1':'','v2':'','v3':'','v4':'','v5':'','v6':'','v7':''},
          'c5':{'v1':'','v2':'','v3':'','v4':'','v5':'','v6':'','v7':''},
          'c6':{'v1':'','v2':'','v3':'','v4':'','v5':'','v6':'','v7':''},
          'c7':{'v1':'','v2':'','v3':'','v4':'','v5':'','v6':'','v7':''},
          'c8':{'v1':'','v2':'','v3':'','v4':'','v5':'','v6':'','v7':''},
          'c9':{'v1':'','v2':'','v3':'','v4':'','v5':'','v6':'','v7':''},
          'c10':{'v1':'','v2':'','v3':'','v4':'','v5':'','v6':'','v7':''},
          'c11':{'v1':'','v2':'','v3':'','v4':'','v5':'','v6':'','v7':''},
          'c12':{'v1':'','v2':'','v3':'','v4':'','v5':'','v6':'','v7':''},
        }
      }
    },
    mounted(){
      this.getData();
    },
    beforeDestroy(){
      this.record();
    },
    methods:{
      getData(){
        axios.get(`${host}/schedule/get/${jsCookie.get('token')}`)
        .then(res=>{
          if(res.data=='new'){}
          else if(!(res.data).toString().includes('error')) this.list = res.data;
          else this.$bus.$emit('handleAlert','Failed To getting Schedule','error');
        })
        .catch(e=>{
          this.$bus.$emit('handleAlert','Getting Schedule Error When Connecting Server','error');
        })
      },
      record(){
        axios.post(`${host}/schedule/record`,{
          record:this.list
        },{
          headers:{
            'user-token':jsCookie.get('token')
          }
        }).then(res=>{
          if(res.data!='success') this.$bus.$emit('handleAlert','Failed To record Schedule','error');
        })
        .catch(e=>{
          this.$bus.$emit('handleAlert','Recording Schedule Error When Connecting Server','error');
        })
      }
    }
}
</script>

<style scoped>
.title {
  color: white;
  text-shadow: 2px 2px 3px gray;
  height: 60px;
  line-height: 60px;
  font-size: 24px;
  font-weight: bolder;
  text-align: center;
}
.main{
  padding-top: 10px;
  width: 100%;
  height: calc(100vh - 70px);
  background-image: url('../../../public/images/schedule.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}
.table{
  width:95%;
  margin: 0 auto;
  color: white;
  background-color: rgba(0,0,0,0.1);
}
.col{
  width: 100%;
  display: flex;
  justify-content: space-evenly;
}
.t{
  height: 35px;
  line-height: 35px;
  width: 12vw;
  text-align: center;
  border: 0.1px solid white;
  border-collapse:collapse;
}
.rows{
  width: 12vw;
  height: calc((100vh - 240px) / 13);
  line-height: calc((100vh - 240px) / 13);
  text-align: center;
  border-bottom: 0.1px solid white;
  border-right: 0.1px solid white;
  border-left: 0.1px solid white;
  border-collapse: collapse;
}
.rows>input{
  width: 100%;
  height: calc((100vh - 240px) / 13);
  line-height: calc((100vh - 240px) / 13);
  text-align: center;
  border-radius: 0;
  border: 0;
  background: transparent;
}
</style>