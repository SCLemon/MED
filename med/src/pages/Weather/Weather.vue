<template>
  <div class="main" :style="{backgroundImage}">
    <div class="data">
        <div class="imgIcon"><img :src="getIcon(data.currentConditions?data.currentConditions.conditions:'')" alt="" class="weatherIcon"></div>
        <div class="degree">{{data.currentConditions?data.currentConditions.temp:''}}&#176;</div>
        <div class="location">緯度 {{lat}}&#176;, 經度 {{ lon }}&#176;</div>
        <div class="future">
            <div class="list" v-for="(obj,id) in data.days" :key="id">
                <img :src="getIcon(obj.conditions)" alt="" class="icon">
                <div class="detail">
                    <div class="time">{{obj.datetime}}</div>
                    <div class="some">最高溫度 : {{ obj.tempmax }}&#176;、最低溫度 : {{ obj.tempmin }}&#176;<br>降雨機率：{{ obj.precipprob }}%</div>
                </div>
                <div class="preDeg">{{obj.temp}}&#176;</div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
    name:'Weather',
    mounted(){
        this.getLocation()
    },
    data(){
        return {
            lat:0,
            lon:0,
            data:{},
            backgroundImage:(new Date().getHours()>5 && new Date().getHours()<18)?"url('images/sun.jpg')":"url('images/moon.webp')"
        }
    },
    methods:{
        getLocation(){
            navigator.geolocation.getCurrentPosition(position=>{
                this.lat = Number(position.coords.latitude).toFixed(2);
                this.lon = Number(position.coords.longitude).toFixed(2);
                this.getWeatherInfo(position.coords.latitude,position.coords.longitude)
            })
        },
        getWeatherInfo(latitude,longitude){
            axios.get(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${latitude}%2C${longitude}?unitGroup=metric&key=L44KD95MNYTRNHK4P8VJQTDCB&contentType=json`)
            .then(res=>{
                console.log(res.data)
                this.data=res.data;
            }).catch(e=>{
                this.$bus.$emit('handleAlert','Failed To Get Weather Info','error');
            })
        },
        getIcon(target){
            switch(target){
                case 'Clear':
                    return 'images/weather/weather_1.png';
                case 'Rain, Overcast':
                    return 'images/weather/weather_2.png';
                case 'Rain':
                    return 'images/weather/weather_2.png';
                case 'Rain, Partially cloudy':
                    return 'images/weather/weather_3.png';
                case 'Partially cloudy':
                    return 'images/weather/weather_4.png';
                case 'Overcast':
                    return 'images/weather/weather_5.png';
                default:
                    return ''
            }  
        }
    }
}
</script>

<style scoped>
    .main{
        width: 100%;
        height: calc(100vh - 70px);
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        position: relative;
    }
    .data{
        width: 100%;
        height: calc(100vh - 70px);
        margin: 0 auto;
        padding-top:40px;
        color: white;
        overflow: scroll;
    }
    .imgIcon{
        width: 90px;
        height: 90px;
        margin: 0 auto;
    }
    .imgIcon>img{
        width:100%;
    }
    .degree{
        text-align: center;
        font-size: 90px;
        font-weight: lighter;
    }
    .location{
        text-align: center;
        font-size: 24px;
    }
    .future{
        width: 90%;
        margin: 0 auto;
        padding-top: 15px;
        padding-bottom: 15px;
        margin-top: 15px;
        height: calc(100vh - 390px);
        overflow: scroll;
    }
    .list{
        width: 100%;
        height: 90px;
        margin-top: 15px;
        border-radius: 10px;
        background-color: rgba(255,255,255,0.1);
        display: flex;
        justify-content: space-evenly;
        align-items: center;
    }
    .icon{
        width: 50px;
        height: 50px;
    }
    .detail{
        width: 55%;
        height: 100%;
        padding-top: 15px;
        margin-left: 10px;
    }
    .time{
        width: 100%;
        font-size: 16px;
        line-height: 1.5;
    }
    .some{
        margin-top: 3px;
        font-size: 12px;
        line-height: 1.5;
    }
    .preDeg{
        width: 15%;
        text-align: center;
        font-size: 24px;
    }
</style>