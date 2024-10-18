<template>
  <div>
    <div class="header">
        <div :class="`searchBar ${changelang?'':'open'}`">
            <div v-if="!changelang" :class="`searchInput`">
                <i class="fa-solid fa-magnifying-glass glass"></i>
                <input type="text" class="input" v-model="q" placeholder="Search for station status in this city">
            </div>
            <el-select v-model="county" placeholder="请選擇地區" v-else>
                <el-option v-for="item in counties" :key="item.value" :label="item.label" :value="item.value">
                <span style="float: left">{{ item.label }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
            </el-option>
        </el-select>
        </div>
        <i class="fa-solid fa-globe globe" @click="changelang=!changelang"></i>
    </div>
    <div class="category">
      <div  v-for="cat in activeRegion" :key="cat" :class="['cat-select', {'selected': region === cat}]" @click="region = cat">{{ cat }}</div>
    </div>
    <div class="main">
        <div class="headline">Search For You</div>
        <div class="listBox" ref="listBox" v-show="isLoaded">
          <a :href="`https://www.google.com.tw/maps/place/${obj.lat},${obj.lng}`" target="bd" v-for="(obj,id) in filterStations" :key="id" class="link">
            <div class="list">
              <div class="artist"><i class="fa-solid fa-map-location-dot pen"></i>{{ obj.name_tw }}</div>
              <div class="title"></div>
              <div class="status">
                <div class="statusBox">
                  <div class="statusTitle">可借數量</div>
                  <div :class="`statusNum ${obj.available_spaces>4?'statusPass':'statusFailed'}`">
                    {{obj.available_spaces}}
                  </div>
                </div>
                <div class="statusBox">
                  <div class="statusTitle">空位數量</div>
                  <div :class="`statusNum ${obj.empty_spaces>4?'statusPass':'statusFailed'}`">
                    {{obj.empty_spaces}}
                  </div>
                </div>
              </div>
              <div class="date">
                <i class="fa-solid fa-clock calendar"></i> {{ handleDate(obj.updated_at) }}
                <i class="fa-solid fa-location-dot clock"></i> <div class="author">{{ obj.address_tw }}</div> 
              </div>
            </div>
          </a>
        </div>
        <div class="loading" v-show="!isLoaded"></div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { format } from 'date-fns';

export default {
    name:'Ubike',
    mounted(){
      this.getPosition();
      this.timer = setInterval(() => {
        this.getPosition();
      }, 15000);
    },
    data(){
      return {
        q:'',
        stations:[],
        isLoaded:false,
        changelang:false,
        counties:[],
        county:'09',
        region:'東區',
        lat:'',
        long:'',
        timer:0,
      }
    },
    watch:{
      'county':{
        deep:true,
        handler(){
          this.region = this.activeRegion[0]
        }
      }
    },
    computed:{
      activeStations(){ // 找出選取縣市中的所有站名
        return this.stations.filter(item => item['area_code'] == this.county)
      },
      activeRegion(){ // 找出選取縣市中的所有區名
        return Array.from(new Set(this.activeStations.map(item=>item['district_tw'])));
      },
      filterStations(){ // 找出符合選取縣市與區域的站名且由距離近至遠排序
        return this.activeStations.filter(item =>{
          return item['district_tw'] == this.region && item['name_tw'].includes(this.q);
        }).sort((a,b)=>{
          return Math.abs(Math.sqrt(Math.pow((a.lat-this.lat),2)+Math.pow((a.lng-this.long),2))) - Math.abs(Math.sqrt(Math.pow((b.lat-this.lat),2)+Math.pow((b.lng-this.long),2)))
        })
      }
    },
    methods:{
      getPosition(){
        navigator.geolocation.getCurrentPosition((position)=>{
          this.lat = position.coords.latitude
          this.long = position.coords.longitude;
          this.getCounty();
          this.getStations();
        },(error)=>{
          this.$bus.$emit('handleAlert','Failed To Getting Location Information','error');
        });
      },
      getStations(){
        axios.get('/api/ubike/station')
        .then(res=>{
          this.stations = res.data
        })
        .catch(e=>{
          this.$bus.$emit('handleAlert','Failed To Get Info of Ubike!','error');
        })
      },
      getCounty(){
        axios.get('/api/ubike/county')
        .then(res=>{
          this.counties = res.data
        })
        .catch(e=>{
          this.$bus.$emit('handleAlert','Failed To Get Info of Ubike!','error');
        })
        .finally(()=>{
          this.isLoaded = true;
        })
      },
      handleDate(time){
        return format(time,'HH:mm:ss')
      }
    },
    beforeDestroy(){
      clearInterval(this.timer);
    }
}
</script>

<style scoped>
  .header{
    padding-top: 30px;
    width:100%;
    height: 80px;
    display: flex;
    align-items: center;
  }
  .searchBar{
    width: 80%;
    height: 50px;
    margin: 0 auto;
    border-radius: 5px;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    color: rgba(190,190,190);
  }
  .open{
    background-color: rgba(240,240,240);
  }
  .searchInput{
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    width: 100%;
  }
  .globe{
    width: 10%;
    font-size: 20px;
  }
  .glass{
    width: 10%;
    text-align: center;
  }
  .input{
    width: 80%;
    border: 0;
    background: transparent;
    font-size: 16px;
  }
  .category{
    width:90%;
    margin: 0 auto;
    margin-top: 10px;
    height: 60px;
    overflow-y: scroll;
    white-space: nowrap;
    display: flex;
    align-items: center;
    padding-right: 5px;
  }
  .cat-select{
    display: inline-block;
    margin-right: 7px;
    border: 1px solid rgba(235,235,235);
    padding-top: 5px;
    padding-bottom: 5px;
    padding-left: 10px;
    padding-right: 10px;
    border-radius: 15px;
    color: rgba(190,190,190);
  }
  .cat-select:hover{
    cursor: pointer;
  }
  .selected{
    background-color: black;
    color: white;
    border: 1px solid black;
  }
  .main{
    width: 100%;
  }
  .headline{
    width: 90%;
    font-size: 24px;
    margin: 0 auto;
    height: 40px;
    line-height: 40px;
    font-weight: bolder;   
  }
  .listBox{
    width: 100%;
    height: calc(100vh - 270px);
    margin-top: 10px;
    overflow-y: scroll;
  }
  .list{
    width: 100%;
    height: calc((100vh - 270px) / 4);
    border-bottom: 1px solid rgba(230,230,230);
    text-decoration: none;
    color: black;
    position: relative;
  }
  .status{
    width: 50%;
    height: calc(100% - calc((100% - 45px) / 2));
    position: absolute;
    top: 0px;
    right: 10px;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
  }
  .statusBox{
    width: 50%;
    height: 100%;
  }
  .statusTitle{
    height: 40px;
    text-align: center;
    line-height: 40px;
    color: rgba(190,190,190);
  }
  .statusNum{
    height: calc(100% - 40px);
    width: 90%;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    color: white;
    border-radius: 17px;
  }
  .statusPass{
    background: lightgreen;
  }
  .statusFailed{
    background: rgb(248, 96, 96);
  }
  .artist{
    width:45%;
    height: calc((100% - 45px) / 2);
    display: flex;
    align-items: center;
    padding-left: 10px;
    color: rgba(190,190,190);
    white-space: nowrap;
    overflow-x: hidden;
  }
  .pen{
    margin-right: 10px;
  }
  .title{
    width:100%;
    height: 45px;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
  }
  .text{
    width: 60%;
    height: 100%;
    font-weight: bolder;
    font-size: 16.5px;
    line-height: 25px;
    text-align: left;
    word-break: break-all;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
  }
  .text-open{
    width:90%;
  }
  .img{
    width: 30%;
  }
  .date{
    width:100%;
    height: calc((100% - 45px) / 2);
    display: flex;
    align-items: center;
    padding-left: 10px;
    color: rgba(190,190,190);
  }
  .calendar{
    margin-right: 10px;
  }
  .clock{
    margin-left: 15px;
    margin-right: 10px;
  }
  .link{
    text-decoration: none;
  }
  .author{
    width: 240px;
    white-space:nowrap;
    overflow-x: scroll ;
  }
  .loading{
    width: 100%;
    height: calc((100vh - 270px) / 3);
    background-image: url(./image/loader.gif);
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
  }
</style>