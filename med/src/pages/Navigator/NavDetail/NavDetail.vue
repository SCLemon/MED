<template>
  <div>
    <div class="top">
        <div class="back" @click="$router.back()">
            <i class="fa-solid fa-chevron-left back"></i> Back
        </div>
    </div>
        <el-carousel indicator-position="outside" height=200px>
            <div v-if="content && content.photos">
                <el-carousel-item v-for="(item,id) in content.photos.slice(0,8)" :key="id">
                    <div class="banner" :style="{backgroundImage:`url( ${item.getUrl()} )`}"></div>
                </el-carousel-item>
            </div>
        </el-carousel>
        <div class="title">
            <div class="intro">
                <div class="name">{{content.name}}</div>
                <div class="rate">{{Number.parseFloat(content.rating).toFixed(1)}} <i class="fa-solid fa-star star"></i> ({{content.user_ratings_total}}) · $$</div>
                <div class="type">{{content.types[0]}}</div>
            </div>
            <div class="go" @click="goTo(content.url)">
                <i class="fa-regular fa-compass btn"></i>
                規劃路線
            </div>
        </div>
        <div class="detail">
            <div class="subtitle">
                <div class="sub-list" v-if="content.formatted_address"><i class="fa-solid fa-location-dot"></i><span class="subText">{{ content.formatted_address }}</span></div>
                <div class="sub-list" v-if="content.website"><i class="fa-solid fa-earth-americas"></i><a class="subText" :href="content.website">{{ content.website }}</a></div>
                <div class="sub-list" v-if="content.formatted_phone_number"><i class="fa-solid fa-phone"></i><span class="subText">{{ content.formatted_phone_number }}</span></div>
                <div class="sub-list sub-list2" v-if="content.current_opening_hours"><i class="fa-regular fa-clock"></i>
                    <div class="hours">
                        <div class="hour" v-for="(t,id) in content.current_opening_hours.weekday_text" :key="id">{{t}}</div>    
                    </div>
                </div>   
            </div>
            <div class="reviews">
                <div class="reviewList" v-for="(r,id) in content.reviews" :key="id">
                    <div class="reviewHeader">
                        <div class="img"><img :src="r.profile_photo_url" alt=""></div>
                        <div class="authorName">{{r.author_name}}</div>
                        <div class="review_rate">
                            {{ Number.parseFloat(r.rating).toFixed(1) }}
                            <i class="fa-solid fa-star star"></i>
                        </div>
                    </div>
                    <div class="reviewText">{{ r.text }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name:'NavDetail',
    mounted(){
        this.getData();
        this.$bus.$on('setNavContent',(result)=>{
            this.setNavContent(result);
        })
    },
    data(){
        return {
            content:{}
        }
    },
    methods:{
        getData(){
            this.$bus.$emit('findDetail',this.$route.query.placeId);
        },
        setNavContent(result){
            this.content = result;
        },
        goTo(url){
            location.href=url;
        }
    }
}
</script>

<style scoped>
    .top{
        position: absolute;
        color: gray;
        width:100%;
        height: 60px;
        display: flex;
        align-items: center;
        padding-left: 15px;
        font-size: 18px;
        z-index: 1000;
    }
    .banner{
        width:100%;
        height: 200px;
        background-repeat: no-repeat;
        object-fit: cover;
        background-size: cover;
        background-position: center;
    }
    .detail{
        width:100%;
        height: 300px;
        overflow-y: scroll;
    }
    .title{
        width:100%;
        height: 120px;
        display: flex;
        align-items: center;
        padding: 15px;
        padding-left: 25px;
        border-bottom: 0.1px solid rgb(190,190,190);
    }
    .intro{
        width:70%; 
    }
    .go{
       width: 30%;
       height: 90px;
       display: flex;
       justify-content: center;
       align-items: center;
       flex-direction: column;
    }
    .btn{
        font-size: 40px;
    }
    .name{
      font-size: 20px;
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
    .subtitle{
        padding-top: 5px;
        width: 100%;
        padding-left: 20px;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        border-bottom: 0.1px solid rgb(190,190,190);
        padding-bottom: 5px;
    }
    .sub-list{
        width: 100%;
        line-height: 30px;
        font-size: 18px;
    }
    .sub-list>i{
        margin-right: 10px;
    }
    .sub-list2{
        display: flex;
        justify-content:left;
        align-items: center;
    }
    .subText{
        font-size: 16px;
    }
    .hour{
        font-size: 12px;
    }
    .reviews{
        width: 100%;
        padding-bottom: 15px;
    }
    .reviewList{
        width: 100%;
        height: 140px;
    }
    .reviewHeader{
        width:100%;
        height: 40px;
        display: flex;
        align-items: center;
        padding-left: 10px;
        position: relative;
    }
    .img{
        width: 25px;
        height: 25px;
        border-radius: 25px;
    }
    .img>img{
        width: 100%;
    }
    .authorName{
        margin-left: 10px;
    }
    .review_rate{
        position: absolute;
        right:10px;
        top:9px;
        width: 50px;
        text-align: center;
    }
    .reviewText{
        width:100%;
        text-align: justify;
        padding: 10px;
        height: 90px;
        overflow: scroll;
    }
</style>