<template>
  <div>
    <div class="top">
        <i class="fa-solid fa-chevron-left back"  @click="$router.back()"></i> {{datas.name}} ({{ datas.symbol }})
    </div>
    <div class="price">
        <div class="left">
           <div class="box">
                <div class="left-title">Current Price</div>
                <div :class="`currentPrice ${showColor}`">{{datas.lastPrice}}</div>
           </div>
        </div>
        <div class="right">
            <div class="box2">
                <div :class="`delta ${showColor}`">{{datas.change}}</div>
                <div :class="`percent ${showColor}`">{{datas.changePercent}}%</div>
           </div>
        </div>
    </div>
    <div class="main">
        <div class="limit">
            <div class="limit-content o">Open: <span :class="`open ${comparePrice(datas.openPrice)}`">{{datas.openPrice}}</span></div>
            <div class="limit-content h">Highest: <span :class="`highest ${comparePrice(datas.highPrice)}`">{{datas.highPrice}}</span></div>
            <div class="limit-content l">Lowest: <span :class="`lowest ${comparePrice(datas.lowPrice)}`">{{datas.lowPrice}}</span></div>
        </div>
        <div class="chart" ref="chart"></div>
        <div class="detail">
            <div class="detail-top">Overview
                <div :class="`avg`">Average: <span :class="`${comparePrice(datas.avgPrice)}`">{{datas.avgPrice}}</span></div>
            </div>
            <div class="detail-two">
                <div class="dt1">Average:</div><div :class="`dt-text1 ${comparePrice(datas.avgPrice)}`">{{datas.avgPrice}}</div>
                <div class="dt1">LastSize:</div><div class="dt-text2">{{datas.lastSize}}</div>
                <div class="dt1">Amplitude:</div><div class="dt-text1">{{datas.amplitude}}</div>
                <div class="dt1">TradeVolume:</div><div class="dt-text2">{{datas.total?datas.total.tradeVolume:''}}</div>
            </div>
            <div class="compare">
                <div class="sell" :style="{width:bidP+'%'}">{{bidP}}%</div>
                <div class="buy"  :style="{width:askP+'%'}">{{askP}}%</div>
            </div>
            <div class="five">
                <div class="bid">
                    <div class="bid-c" v-for="(obj,id) in datas.bids" :key="id">
                        <div class="price-size">{{obj.size}}</div>
                        <div :class="`price-bid ${comparePrice(obj.price)}`">{{obj.price}}</div>
                    </div>
                    <div class="bid-c bid-f">
                        <div class="price-size">{{ bids }}</div>
                        <div class="price-size"></div>
                    </div>
                </div>
                <div class="ask">
                    <div class="bid-c" v-for="(obj,id) in datas.asks" :key="id">
                        <div :class="`price-ask ${comparePrice(obj.price)}`">{{obj.price}}</div>
                        <div class="price-size">{{obj.size}}</div>
                    </div>
                    <div class="bid-c bid-f">
                        <div class="price-size"></div>
                        <div class="price-size">{{ asks }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import {format} from 'date-fns'
export default {
    name:'StockInfo',
    data(){
        return{
            stock:this.$route.query.stock,
            datas:{},
            candles:[],
            chart:{},
            times:0,
            timer:0,
        }
    },
    mounted(){
        const script = document.createElement('script');
        script.src = 'https://www.gstatic.com/charts/loader.js';
        script.onload = () => {
            google.charts.load('current', { packages: ['corechart'] });
            this.getData();
            this.timer = setInterval(()=>{
                this.getData();
            },20000);
        };
        document.head.appendChild(script);
    },
    computed:{
        bids(){
            if(this.datas.bids){
                return this.datas.bids.reduce((acc, bid) => acc + bid.size, 0);
            }
            else return
        },
        asks(){
            if(this.datas.asks){
                return this.datas.asks.reduce((acc, bid) => acc + bid.size, 0);
            }
            else return
        },
        showColor(){
            if(this.datas.change<0) return 'green'
            else if(this.datas.change==0) return 'black'
            else return 'red'
        },
        bidP(){
            if(this.datas.total){
                return (((this.datas.total.tradeVolumeAtBid/(this.datas.total.tradeVolumeAtBid+this.datas.total.tradeVolumeAtAsk)).toFixed(4))*100).toFixed(2)
            }
            else return
        },
        askP(){
            if(this.datas.total){
                return (((1-((this.datas.total.tradeVolumeAtBid/(this.datas.total.tradeVolumeAtBid+this.datas.total.tradeVolumeAtAsk)).toFixed(4))).toFixed(4))*100).toFixed(2)
            }
            else return
        }
    },
    beforeDestroy(){
        clearInterval(this.timer)
    },
    methods:{
        getData(){
            axios.get(`/stock/getInfo?symbol=${this.stock.symbol}`)
            .then(res=>{
                this.datas = res.data;
                this.getCandle();
            })
        },
        getCandle(){
            axios.get(`/stock/candles?symbol=${this.stock.symbol}&timeframe=5`)
            .then(res=>{
                this.candles = res.data;
                google.charts.setOnLoadCallback(this.drawChart);
            })
        },
        comparePrice(price){
            var refer = this.datas.referencePrice;
            if(price<refer) return 'green'
            else if(price == refer) return 'black'
            else return 'red'
        },
        drawChart() {
            try{
                var data = new google.visualization.DataTable();
                data.addColumn('string', 'Time');
                data.addColumn('number', 'Low');
                data.addColumn('number', 'Open');
                data.addColumn('number', 'Close');
                data.addColumn('number', 'High');
                data.addColumn({role:'style'});
                data.addRows(this.candles);
                const options = {
                    title: format(new Date(),'yyyy-MM-dd HH:mm:ss'),
                    legend:'none',
                    chartArea:{width:'80%',height:'80%'},
                    hAxis: {
                        viewWindowMode: 'auto',
                    },
                    vAxis: {
                        minValue:this.datas.lowPrice*0.998,
                        maxValue:this.datas.lowPrice*1.002
                    },
                    width: this.$refs.chart.clientWidth+30
                };
                if(this.times){
                    this.chart.clearChart()
                }
                this.chart = new google.visualization.CandlestickChart(this.$refs.chart);
                this.chart.draw(data, options);
                this.times++;
            }catch(e){}
        },
    }
}
</script>

<style scoped>
    .top{
        top:0;
        width:100%;
        height: 60px;
        text-align: center;
        line-height: 60px;
        font-size: 18px;
        font-weight: bold;
        position: relative;
        border-bottom:0.1px solid rgb(230,230,230);
        letter-spacing: 1px;
    }
    .back{
      position: absolute;
      left: 0px;
      text-align: center;
      line-height: 60px;
      top: 0px;
      font-size: 20px;
      height: 60px;
      z-index:999;
      width: 60px;
    }
    .back:hover{
      cursor: pointer;
    }
    .price{
        width: 100%;
        height: 80px;
        border-bottom:0.1px solid rgb(230,230,230);
        display: flex;
    }
    .left,.right{
        width: 50%;
        height: 80px;
        display: flex;
        align-items: center;
    }
    .box{
        width:100%;
        height: 60px;
        padding-left: 20px;
    }
    .box2{
        width:100%;
        height: 60px;
        padding-right: 20px;
    }
    .delta,.percent{
        height: 30px;
        line-height: 30px;
        text-align: right;
    }
    .left-title{
        height: 20px;
        line-height: 20px;
        color: rgb(190,190,190);
    }
    .currentPrice{
        height: 40px;
        line-height: 40px;
        font-weight: bolder;
        font-size: 24px;
    }
    .main{
        width: 100%;
        height: calc(100vh - 210px);
    }
    .limit{
        width: 100%;
        height: 30px;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        padding-left: 20px;
        padding-right: 20px;
    }
    .limit-content{
        width:calc((100vw - 40px) / 3);
        height: 30px;
        line-height: 30px;
        color: rgb(190,190,190);
    }
    .o{
        text-align: left;
    }
    .h{
        text-align: center;
    }
    .l{
        text-align: right;
    }
    .chart{
        width: calc(100vw - 40px);
        margin-left: 20px;
        margin-right: 20px;
        height: 230px;
        margin-bottom: 10px;
    }
    .detail{
        width: calc(100vw);
        margin: 0 auto;
        height: calc(100vh - 480px);
        border-top: 1px solid rgb(230,230,230);
        overflow-y: scroll;
    }
    .detail-top{
        position: relative;
        width: 100%;
        height: 40px;
        line-height: 40px;
        padding-left: 20px;
        border-bottom: 1px solid rgb(230,230,230);
    }
    .avg{
        position: absolute;
        right: 20px;
        top:0px;
        height: 40px;
        line-height: 40px;
    }
    .detail-two{
        width: 100%;
        height: 60px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        padding-left: 20px;
        padding-right: 20px;
        margin-top: 5px;
        margin-bottom: 5px;
    }
    .dt1{
        width: calc((100% - 45px) / 4);
        height: 30px;
        line-height: 30px;
    }
    .dt-text1{
        width: calc((100vw - 45px) / 4);
        height: 30px;
        text-align: center;
        line-height: 30px;
    }
    .dt-text2{
        width: calc((100vw - 45px) / 4);
        height: 30px;
        text-align: right;
        line-height: 30px;
    }
    .compare{
        width: calc(100% - 30px);
        margin: 0 auto;
        border-radius: 5px;
        height: 20px;
        display: flex;
        margin-bottom: 10px;
    }
    .sell{
        height: 20px;
        line-height: 20px;
        padding-left: 10px;
        text-align: left;
        color: white;
        width: 50%;
        border-radius: 5px 0 0 5px;
        background-color: rgb(39, 222, 39);
    }
    .buy{
        height: 20px;
        line-height: 20px;
        width: 50%;
        padding-right: 10px;
        text-align: right;
        color: white;
        border-radius: 0 5px 5px 0;
        background-color: #f94b4b;
    }
    .five{
        width: calc(100% - 30px);
        height: calc(100vh - 635px);
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
    }
    .bid,.ask{
        width: 45%;
    }
    .bid-c{
        height: calc((100vh - 635px)/6);
        line-height: calc((100vh - 635px)/6);
        display: flex;
        justify-content: space-evenly;
    }
    .bid-f{
        margin-top: 5px;
        border-top: 1px dashed rgb(230,230,230);
    }
    .price-size{
        width: 50%;
        text-align: center;
    }
    .price-bid{
        width: 50%;
        text-align: right;
    }
    .price-ask{
        width: 50%;
        text-align: left;
    }
    .green{
        color: #27de27;
    }
    .red{
        color: rgb(249, 75, 75);
    }
    .black{
        color:black;
    }
</style>