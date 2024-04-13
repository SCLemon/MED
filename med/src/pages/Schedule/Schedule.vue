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
        <div class="col">
          <div class="rows">1</div>
          <div class="rows"><input type="text" v-model="list.c1.v1"></div>
          <div class="rows"><input type="text" v-model="list.c1.v2"></div>
          <div class="rows"><input type="text" v-model="list.c1.v3"></div>
          <div class="rows"><input type="text" v-model="list.c1.v4"></div>
          <div class="rows"><input type="text" v-model="list.c1.v5"></div>
          <div class="rows"><input type="text" v-model="list.c1.v6"></div>
          <div class="rows"><input type="text" v-model="list.c1.v7"></div>
        </div>
        <div class="col">
          <div class="rows ">2</div>
          <div class="rows"><input type="text" v-model="list.c2.v1"></div>
          <div class="rows"><input type="text" v-model="list.c2.v2"></div>
          <div class="rows"><input type="text" v-model="list.c2.v3"></div>
          <div class="rows"><input type="text" v-model="list.c2.v4"></div>
          <div class="rows"><input type="text" v-model="list.c2.v5"></div>
          <div class="rows"><input type="text" v-model="list.c2.v6"></div>
          <div class="rows"><input type="text" v-model="list.c2.v7"></div>
        </div>
        <div class="col">
          <div class="rows ">3</div>
          <div class="rows"><input type="text" v-model="list.c3.v1"></div>
          <div class="rows"><input type="text" v-model="list.c3.v2"></div>
          <div class="rows"><input type="text" v-model="list.c3.v3"></div>
          <div class="rows"><input type="text" v-model="list.c3.v4"></div>
          <div class="rows"><input type="text" v-model="list.c3.v5"></div>
          <div class="rows"><input type="text" v-model="list.c3.v6"></div>
          <div class="rows"><input type="text" v-model="list.c3.v7"></div>
        </div>
        <div class="col">
          <div class="rows ">4</div>
          <div class="rows"><input type="text" v-model="list.c4.v1"></div>
          <div class="rows"><input type="text" v-model="list.c4.v2"></div>
          <div class="rows"><input type="text" v-model="list.c4.v3"></div>
          <div class="rows"><input type="text" v-model="list.c4.v4"></div>
          <div class="rows"><input type="text" v-model="list.c4.v5"></div>
          <div class="rows"><input type="text" v-model="list.c4.v6"></div>
          <div class="rows"><input type="text" v-model="list.c4.v7"></div>
        </div>
        <div class="col">
          <div class="rows ">5</div>
          <div class="rows"><input type="text" v-model="list.c5.v1"></div>
          <div class="rows"><input type="text" v-model="list.c5.v2"></div>
          <div class="rows"><input type="text" v-model="list.c5.v3"></div>
          <div class="rows"><input type="text" v-model="list.c5.v4"></div>
          <div class="rows"><input type="text" v-model="list.c5.v5"></div>
          <div class="rows"><input type="text" v-model="list.c5.v6"></div>
          <div class="rows"><input type="text" v-model="list.c5.v7"></div>
        </div>
        <div class="col">
          <div class="rows ">6</div>
          <div class="rows"><input type="text" v-model="list.c6.v1"></div>
          <div class="rows"><input type="text" v-model="list.c6.v2"></div>
          <div class="rows"><input type="text" v-model="list.c6.v3"></div>
          <div class="rows"><input type="text" v-model="list.c6.v4"></div>
          <div class="rows"><input type="text" v-model="list.c6.v5"></div>
          <div class="rows"><input type="text" v-model="list.c6.v6"></div>
          <div class="rows"><input type="text" v-model="list.c6.v7"></div>
        </div>
        <div class="col">
          <div class="rows ">7</div>
          <div class="rows"><input type="text" v-model="list.c7.v1"></div>
          <div class="rows"><input type="text" v-model="list.c7.v2"></div>
          <div class="rows"><input type="text" v-model="list.c7.v3"></div>
          <div class="rows"><input type="text" v-model="list.c7.v4"></div>
          <div class="rows"><input type="text" v-model="list.c7.v5"></div>
          <div class="rows"><input type="text" v-model="list.c7.v6"></div>
          <div class="rows"><input type="text" v-model="list.c7.v7"></div>
        </div>
        <div class="col">
          <div class="rows ">8</div>
          <div class="rows"><input type="text" v-model="list.c8.v1"></div>
          <div class="rows"><input type="text" v-model="list.c8.v2"></div>
          <div class="rows"><input type="text" v-model="list.c8.v3"></div>
          <div class="rows"><input type="text" v-model="list.c8.v4"></div>
          <div class="rows"><input type="text" v-model="list.c8.v5"></div>
          <div class="rows"><input type="text" v-model="list.c8.v6"></div>
          <div class="rows"><input type="text" v-model="list.c8.v7"></div>
        </div>
        <div class="col">
          <div class="rows ">9</div>
          <div class="rows"><input type="text" v-model="list.c9.v1"></div>
          <div class="rows"><input type="text" v-model="list.c9.v2"></div>
          <div class="rows"><input type="text" v-model="list.c9.v3"></div>
          <div class="rows"><input type="text" v-model="list.c9.v4"></div>
          <div class="rows"><input type="text" v-model="list.c9.v5"></div>
          <div class="rows"><input type="text" v-model="list.c9.v6"></div>
          <div class="rows"><input type="text" v-model="list.c9.v7"></div>
        </div>
        <div class="col">
          <div class="rows ">a</div>
          <div class="rows"><input type="text" v-model="list.c10.v1"></div>
          <div class="rows"><input type="text" v-model="list.c10.v2"></div>
          <div class="rows"><input type="text" v-model="list.c10.v3"></div>
          <div class="rows"><input type="text" v-model="list.c10.v4"></div>
          <div class="rows"><input type="text" v-model="list.c10.v5"></div>
          <div class="rows"><input type="text" v-model="list.c10.v6"></div>
          <div class="rows"><input type="text" v-model="list.c10.v7"></div>
        </div>
        <div class="col">
          <div class="rows ">b</div>
          <div class="rows"><input type="text" v-model="list.c11.v1"></div>
          <div class="rows"><input type="text" v-model="list.c11.v2"></div>
          <div class="rows"><input type="text" v-model="list.c11.v3"></div>
          <div class="rows"><input type="text" v-model="list.c11.v4"></div>
          <div class="rows"><input type="text" v-model="list.c11.v5"></div>
          <div class="rows"><input type="text" v-model="list.c11.v6"></div>
          <div class="rows"><input type="text" v-model="list.c11.v7"></div>
        </div>
        <div class="col">
          <div class="rows ">c</div>
          <div class="rows"><input type="text" v-model="list.c12.v1"></div>
          <div class="rows"><input type="text" v-model="list.c12.v2"></div>
          <div class="rows"><input type="text" v-model="list.c12.v3"></div>
          <div class="rows"><input type="text" v-model="list.c12.v4"></div>
          <div class="rows"><input type="text" v-model="list.c12.v5"></div>
          <div class="rows"><input type="text" v-model="list.c12.v6"></div>
          <div class="rows"><input type="text" v-model="list.c12.v7"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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
        axios.get(`/schedule/get/${jsCookie.get('token')}`)
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
        axios.post('/schedule/record',{
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
  color: rgb(166, 89, 89);
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
  color: rgb(166, 89, 89);
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
  border-bottom: 0.1px solid white;
  border-collapse:collapse;
}
.rows{
  width: 50px;
  height: calc((100vh - 250px) / 12);
  line-height: calc((100vh - 250px) / 12);
  text-align: center;
  border-bottom: 0.1px solid white;
  border-right: 0.1px solid white;
  border-left: 0.1px solid white;
  border-collapse: collapse;
}
.rows>input{
  width: 100%;
  height: calc((100vh - 250px) / 12);
  line-height: calc((100vh - 250px) / 12);
  text-align: center;
  border-radius: 0;
  border: 0;
  background: transparent;
}
</style>