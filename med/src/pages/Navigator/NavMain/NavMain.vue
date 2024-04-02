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
      </div>
        <div class="listBox">
          <div v-if="!loadingFinish" class="loader"></div>
          <div v-else>
            <div v-for="place in nearbyPlaces" :key="place.id">
              <router-link class="link list" :to="{
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
  export default {
    name:'Navigator',
    data() {
      return {
        center: { lat: 0, lng: 0 },
        zoom: 15,
        nearbyPlaces:[],
        keyword:'',
        map:{},
        loadingFinish:false,
      }
    },
    mounted() {
      this.getCurrentLocation();
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
              console.error("地圖尚未加載完畢：", error);
            });
          },(error)=>{
            switch(error.code) {
              case error.PERMISSION_DENIED:
                alert("User denied the request for Geolocation.");
                break;
              case error.POSITION_UNAVAILABLE:
                alert("Location information is unavailable.");
                break;
              case error.TIMEOUT:
                alert("The request to get user location timed out.");
                break;
              case error.UNKNOWN_ERROR:
                alert("An unknown error occurred.");
                break;
              }
          })
        } else {
          alert("Geolocation is not supported by this browser.")
        }
      },
      waitForMap() {
        return new Promise((resolve, reject) => {
          const interval = setInterval(() => {
            try{
              if (this.$refs.mapRef.$mapObject) {
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
          radius: 7000, 
          types: ['hospital', 'pharmacy', 'doctor', 'dentist', 'drugstore'],
          keyword:this.keyword
        };
        service.nearbySearch(request, (results, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            this.nearbyPlaces = results.filter(obj=>obj.name.includes('醫') || obj.name.includes('牙')||obj.name.includes('藥'));
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
      height: 230px;
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
      padding-top: 5px;
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
    }
    .inputBox{
      border: 0.1px solid rgb(190,190,190);
      width: 95%;
      border-radius: 5px;
      display: flex;
      justify-content: space-evenly;
      align-items: center;
    }
    .inputBox>input{
      height: 35px;
      width: 91%;
      border: 0;
      padding-left: 10px;
      border-radius: 5px;
    }
    .glass{
      width:7.5%;
    }
  </style>