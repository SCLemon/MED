<template>
    <div>
      <GmapMap ref="mapRef"
        :center="center"
        :zoom="zoom"
        map-type-id="terrain"
        style="width: 100%; height: 335px"
      >
        <GmapMarker
          v-for="(place, index) in nearbyPlaces"
          :key="index"
          :position="place.geometry.location"
          :clickable="true"
        />
      </GmapMap>
      <div class="searchInput">
        <div class="inputBox">
          <input type="text" v-model="keyword" placeholder="Search nearby places" @change="findNearBy()">
          <i class="fa-solid fa-magnifying-glass glass"></i>
        </div>
        <router-link class="slider" :to="{path:'/navigator/filter'}"><i class="fa-solid fa-sliders"></i></router-link>
      </div>
        <div class="listBox">
          <div v-if="!loadingFinish" class="loader"></div>
          <div v-else>
            <div v-for="place in nearbyPlaces" :key="place.id">
              <router-link v-if="Number.parseFloat(place.rating).toFixed(1) >= filter.score" class="link list" :to="{
                    path:'/navigator/detail',
                    query:{'placeId':place.place_id}}"
              >
                <div class="intro">
                  <div class="title">{{ place.name }}</div>
                  <div class="rate">{{ Number.parseFloat(place.rating).toFixed(1) }} <i class="fa-solid fa-star star"></i> ({{ place.user_ratings_total }}) · $$</div>
                  <div class="type">{{ place.types[0] }}</div>
                </div>
                <div class="intro-img" :style="{backgroundImage:`url( ${place.photos!=undefined?place.photos[0].getUrl():''} )`}">
              </div>
            </router-link>
            </div>
          </div>
        </div>
      
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import jsCookie from 'js-cookie';
  export default {
    name:'Navigator',
    data() {
      return {
        filter:{
          distance:7000,
          score:3,
          option:'hospital',
          hospitalSelectTypes:'關閉',
          isOpen:'關閉'
        },
        center: { lat: 0, lng: 0 },
        zoom: 15,
        nearbyPlaces:[],
        keyword:'',
        map:{},
        loadingFinish:false,
        filterGet:false,
      }
    },
    mounted() {
      this.getCurrentLocation();
      setTimeout(() => {
        this.getFilter();
      }, 500);
      this.$bus.$on('findDetail',async (id)=>{
        var result = await this.findDetail(id);
        this.$bus.$emit('setNavContent',result);
      })
    },
    methods: {
      getCurrentLocation() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(position => {
            this.center = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
            this.waitForMap().then(map => {
              this.map=map;
              this.findNearBy();
            }).catch(error => {
              this.$bus.$emit('handleAlert','Map Loading Error','error');
            });
          },(error)=>{
            switch(error.code) {
              case error.PERMISSION_DENIED:
                this.$bus.$emit('handleAlert','User denied the request for Geolocation.','error');
                break;
              case error.POSITION_UNAVAILABLE:
                this.$bus.$emit('handleAlert','Location information is unavailable.','error');
                break;
              case error.TIMEOUT:
                this.$bus.$emit('handleAlert','The request to get user location timed out.','error');
                break;
              case error.UNKNOWN_ERROR:
                this.$bus.$emit('handleAlert','An unknown error occurred.','error');
                break;
            }
          })
        } else {
          this.$bus.$emit('handleAlert','Geolocation is not supported by this browser.','error');
        }
      },
      waitForMap() {
        return new Promise((resolve, reject) => {
          const interval = setInterval(() => {
            try{
              if (this.$refs.mapRef.$mapObject && this.filterGet) {
                clearInterval(interval);
                resolve(this.$refs.mapRef.$mapObject);
              }
            }catch(e){
              clearInterval(interval);
            }
          }, 500);
        })
      },
      findNearBy(){
        const service = new window.google.maps.places.PlacesService(this.map);
        const request = { 
          location: this.center,
          radius: this.filter.distance, 
          types: [`${this.filter.option}`],
          keyword:this.keyword
        };
        service.nearbySearch(request, (results, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            if(this.filter.option == 'hospital') this.nearbyPlaces = results.filter(obj=>obj.name.includes('醫') || obj.name.includes('牙')||obj.name.includes('藥'));
            else this.nearbyPlaces =results;
            this.nearbyPlaces = this.nearbyPlaces.filter(obj=>obj.business_status=='OPERATIONAL').sort((a,b)=>b.rating-a.rating)
            try{
              if(this.filter.isOpen!='關閉') this.nearbyPlaces = this.nearbyPlaces.filter(obj=>{
                if(obj.opening_hours) return obj.opening_hours.open_now
                else if(this.filter.isOpen=='嚴格') return false;
                else return true;
              })
            }catch(e){
              this.$bus.$emit('handleAlert','Some stores do not support filtering by operating hours.','warning');
            }
            this.loadingFinish=true;
          }
        });
      },
      findDetail(placeId){
        const service = new window.google.maps.places.PlacesService(this.map);
        const request = { 
          placeId: placeId
        };
        var result = new Promise((resolve,reject)=>{
          service.getDetails(request, (place, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            return resolve(place);
          }
          else {
            console.error('Error fetching place details:', status);
          }
          });
        })
        return result;
      },
      getFilter(){
            axios.get(`/filter/get/${jsCookie.get('token')}`)
            .then(res=>{
                if(res.data!='new'){
                  // option
                  if(res.data.option== '醫院'){
                    if(res.data.hospitalSelectTypes=='開啟') res.data.option='veterinary_care'
                    else res.data.option ='hospital'
                  }
                  else if(res.data.option == '餐廳') res.data.option = 'restaurant'
                  else if(res.data.option == '超商') res.data.option = 'convenience_store'
                  else res.data.option=''
                  this.filter = res.data
                }
                else if(res.data=='new'){}
                else this.$bus.$emit('handleAlert','Failed To Getting Adjust Filter','error');
                this.filterGet=true;
            })
            .catch(e=>{
                this.filterGet=true;
                this.$bus.$emit('handleAlert','Getting Filter Error When Connecting Server','error');
            })
        }
    },
  }
  </script>
  <style scoped>
    .link{
      text-decoration: none;
      color: black;
    }
    .listBox{
      width: 100%;
      height: calc(100vh - 460px);
      overflow: scroll;
    }
    .loader{
      width: 100%;
      height: 230px;
      background-image: url(./image/loader.gif);
      background-position: center;
      background-repeat: no-repeat;
      background-size: contain;
    }
    .list{
      width: 100%;
      height: 90px;
      border-bottom: 0.1px solid rgb(204, 204, 204);
      padding:15px;
      padding-top: 10px;
      padding-bottom: 10px;
      display: flex;
      align-content: center;
      justify-content: space-evenly;
    }
    .intro{
      width: 75%;
    }
    .title{
      font-size: 16px;
      font-weight: bold;
      white-space: nowrap;
      overflow: scroll;
      width: 80%;
    }
    .rate{
      line-height: 2;
      color: gray;
    }
    .type{
      color: gray;
    }
    .star{
      color: rgb(241, 184, 78);
    }
    .intro-img{
      width:70px;
      height: 70px;
      background-position: left;
      background-size: cover;
      background-repeat: no-repeat;
      border-radius: 5px;
    }
    .searchInput{
      width: 100%;
      height: 55px;
      display: flex;
      justify-content: center;
      align-items: center;
      padding-left: 15px;
      padding-right: 5px;
    }
    .inputBox{
      border: 0.1px solid rgb(190,190,190);
      width: 85%;
      border-radius: 5px;
      display: flex;
      justify-content: space-evenly;
      align-items: center;
    }
    .inputBox>input{
      height: 35px;
      width: 100%;
      border: 0;
      padding-left: 10px;
      border-radius: 5px;
    }
    .slider{
      width:15%;
      text-align: center;
      font-size: 18px;
      color: black;
      text-decoration: none;
    }
    .glass{
      width:7.5%;
    }
  </style>