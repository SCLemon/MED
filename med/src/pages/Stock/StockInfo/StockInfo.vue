<template>
  <div class="all">
    <div class="top">
        <i class="fa-solid fa-chevron-left back"  @click="$router.back()"></i> {{datas.name}} ({{ datas.symbol }})
        <div class="changeChart" v-if="chartType=='history'" @click="changeChart('price')">日內行情</div>
        <div class="changeChart" v-else @click="changeChart('history')">歷史行情</div>
    </div>
    <div class="price">
        <div class="left">
           <div class="box">
                <div class="left-title">Current Price</div>
                <div :class="`currentPrice ${showColor}`">
                    <div class="lastPrice">{{datas.lastPrice}}</div>
                    <div class="delta">
                        <div :class="`del1`">
                            <span v-text="showColor=='red'?'+':''"></span>
                            {{datas.change}}
                        </div>
                        <div :class="`del2`">
                            <span v-text="showColor=='red'?'+':''"></span>
                            {{datas.changePercent}}%
                        </div>
                    </div>
                </div>
           </div>
        </div>
        <div class="right">
            <div class="cp">
                <div class="cp-title">Buy</div>
                <div :class="`cp-price ${datas.lastTrade?comparePrice(datas.lastTrade.bid):''}`">{{ datas.lastTrade?datas.lastTrade.bid:'' }}</div>
            </div>
            <div class="cp">
                <div class="cp-title">Sell</div>
                <div :class="`cp-price ${datas.lastTrade?comparePrice(datas.lastTrade.ask):''}`">{{ datas.lastTrade?datas.lastTrade.ask:'' }}</div>
            </div>
        </div>
    </div>
    <div class="main">
        <div class="limit">
            <div class="limit-content o">Open: <span :class="`open ${comparePrice(datas.openPrice)}`">{{datas.openPrice}}</span></div>
            <div class="limit-content h">Highest: <span :class="`highest ${comparePrice(datas.highPrice)}`">{{datas.highPrice}}</span></div>
            <div class="limit-content l">Lowest: <span :class="`lowest ${comparePrice(datas.lowPrice)}`">{{datas.lowPrice}}</span></div>
        </div>
        <div class="option" v-if="chartType!='history'">
            <div v-for="(obj,id) in timeframes" :key="id" :class="`option-select ${timeframe == obj?'selected':''} ${chartType!='today'?'disabled':''}`" @click="select(obj)">{{ obj }} 分</div>
            <div class="stock" @click="togglePriceChart()"><i class="fa-solid fa-arrow-trend-up"></i></div>
        </div>
        <div class="chart" ref="chart" v-show="chartType=='today'"></div>
        <div class="h-chart" id="h-chart" v-show="chartType=='history'"></div>
        <div class="p-chart" id="p-chart" v-show="chartType=='price'"></div>
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
import { host } from '@/serverPath'
export default {
    name:'StockInfo',
    data(){
        return{
            stock:this.$route.query.stock,
            datas:{},
            candles:[],
            chart:{},
            pChart:{},
            history:{},
            price:[],
            priceTimes:0,
            chartType:'price',
            times:0,
            dataTimer:0,
            priceTimer:0,
            candleTimer:0,
            timeframes:[5,10,15,30,60],
            timeframe:30,
        }
    },
    mounted(){
        this.getData();
        this.getPrice();
        this.dataTimer = setInterval(()=>{
            this.getData();
            this.getPrice();
        },5000);
        const script = document.createElement('script');
        script.src = 'https://www.gstatic.com/charts/loader.js';
        script.onload = () => {
            google.charts.load('current', { packages: ['corechart'] });
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
        clearInterval(this.dataTimer);
        clearInterval(this.priceTimer);
        clearInterval(this.candleTimer);
    },
    methods:{
        select(timeframe){
           if(this.chartType=='today'){
            this.timeframe = timeframe;
            this.getCandle();
           }
           else this.$bus.$emit('handleAlert','These options only apply to specific charts.','warning')
        },
        // 第一張圖
        getPrice(){
            axios.get(`${host}/stock/price?symbol=${this.stock.symbol}`)
            .then(res=>{
                this.price = res.data;
                this.drawPrice();
            })
        },
        drawPrice(){
            var color =this.showColor=='red'?'rgb(249, 75, 75)':'rgba(39,222,39,1)';
            var color2 = this.showColor == 'red'? 'rgba(255, 0, 0, 0)':'rgba(0,255, 0, 0)'
            this.pChart = Highcharts.stockChart('p-chart', {
                plotOptions:{
                    series:{
                        animation:{
                            duration:this.priceTimes>0?0:1000,
                        }
                    }
                },
                time: {
                    timezone: 'Asia/Taipei'
                },
                title: {
                    text: `${this.stock.name} (${this.stock.symbol})`
                },
                xAxis: {
                    gapGridLineWidth: 0
                },
                navigator: {
                    enabled: false // 禁用工具提示
                },
                rangeSelector: {
                    buttons: [{
                        type: 'all',
                        count: 1,
                        text: 'All'
                    }],
                    selected: 1,
                    inputEnabled: false
                },
                series: [{
                    name: `${this.stock.name} (${this.stock.symbol})`,
                    type: 'area',
                    data: this.price,
                    color: this.showColor,
                    tooltip: {
                        valueDecimals: 2
                    },
                    fillColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        
                        stops: [
                            [0, color],
                            [1, color2]
                        ]
                    },
                    threshold: null
                }]
            });
            this.priceTimes++;
        },
        // 第二張圖
        getData(){
            axios.get(`${host}/stock/getInfo?symbol=${this.stock.symbol}`)
            .then(res=>{
                this.datas = res.data;
            })
        },
        getCandle(){
            axios.get(`/stock/candles?symbol=${this.stock.symbol}&timeframe=${this.timeframe}`)
            .then(res=>{
                this.candles = res.data;
                google.charts.setOnLoadCallback(this.drawChart);
            })
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
                    chartArea:{width:'80%',height:'70%'},
                    hAxis: {
                        viewWindowMode: 'auto',
                    },
                    vAxis: {
                        minValue:this.datas.lowPrice*0.998,
                        maxValue:this.datas.lowPrice*1.002
                    },
                    width: this.$refs.chart.clientWidth+65,
                };
                if(this.times){
                    this.chart.clearChart()
                }
                this.chart = new google.visualization.CandlestickChart(this.$refs.chart);
                this.chart.draw(data, options);
                this.times++;
            }catch(e){
                console.log(e)
            }
        },
        // 第三張圖
        getHistory(){
            var url =`${host}/stock/history?symbol=${this.stock.symbol}`
            axios.get(url)
            .then(res=>{
                this.history=res.data;
                this.drawHistory();
            })
        },
        drawHistory(){
            const  groupingUnits = [['day',[1]],['week',[1]], ['month',[1, 2, 3, 4, 6]]];
            const ohlc = []
            const volume = [];
            var d =this.history;
            for(var i=0; i<d.length;i++){
                ohlc.push([d[i][0],d[i][1],d[i][2],d[i][3],d[i][4]])
                volume.push([d[i][0],d[i][5]])
            };
            Highcharts.stockChart('h-chart',{
                rangeSelector: {
                    selected: 0
                },
                yAxis: [{
                    labels: {
                        align: 'right',
                        x: -3
                    },

                    height: '200px',
                    lineWidth: 1,
                    resize: {
                        enabled: true
                    }
                }, {
                    labels: {
                        align: 'right',
                        x: -3
                    },
                    top: '200px',
                    height: '100px',
                    offset: 0,
                    lineWidth: 1,
                },
                {
                    labels: {
                        align: 'right',
                        x: -3
                    },
                    top: '300px',
                    height: '100px',
                    offset: 0,
                    lineWidth: 1,
                }],
                tooltip: {
                    split: true
                },
                series: [{
                    type: 'candlestick',
                    name: `${this.stock.name} (${this.stock.symbol})`,
                    id:`${this.stock.name} (${this.stock.symbol})`,
                    data: ohlc,
                    dataGrouping: {
                        units: groupingUnits
                    },
                    color: '#27de27',    
                    upColor: '#f94b4b',
                }, {
                    type: 'column',
                    name: 'Volume',
                    data: volume,
                    yAxis: 1,
                    dataGrouping: {
                        units: groupingUnits
                    }
                },
                // {
                //     type: 'sma',
                //     linkedTo: `${this.stock.name} (${this.stock.symbol})`,
                //     params: {
                //         period: 5
                //     },
                //     lineWidth: 1,
                //     marker: {
                //         enabled: false
                //     }
                // },{
                //     type: 'sma',
                //     linkedTo: `${this.stock.name} (${this.stock.symbol})`,
                //     params: {
                //         period: 20
                //     },
                //     lineWidth: 1,
                //     marker: {
                //         enabled: false
                //     }
                // },{
                //     type: 'sma',
                //     linkedTo: `${this.stock.name} (${this.stock.symbol})`,
                //     params: {
                //         period: 60
                //     },
                //     lineWidth: 1,
                //     marker: {
                //         enabled: false
                //     }
                // }, 
                {
                    type: 'bb',
                    name:'BBand',
                    linkedTo: `${this.stock.name} (${this.stock.symbol})`,
                    params: {
                        period: 20,
                        standardDeviation: 2
                    },
                    lineWidth: 1,
                    marker: {
                        enabled: false
                    }
                },{
                    type: 'macd',
                    name:'MACD',
                    yAxis: 2,
                    params: {
                        shortPeriod: 3,
                        longPeriod: 15,
                        signalPeriod: 6
                    },
                    linkedTo: `${this.stock.name} (${this.stock.symbol})`
                }]
            })
        },
        // 其他
        comparePrice(price){
            var refer = this.datas.referencePrice;
            if(price<refer) return 'green'
            else if(price == refer) return 'black'
            else return 'red'
        },
        togglePriceChart(){
            this.chartType == 'today'? this.changeChart('price'): this.changeChart('today');
        },
        changeChart(type){
            this.chartType=type;
            this.priceTimes=0;
            clearInterval(this.priceTimer);
            clearInterval(this.candleTimer);
            if(type=='today'){
                this.getCandle();
                this.candleTimer = setInterval(() => {
                    this.getCandle();
                }, 5000);
            }
            else if(type!='today'){
                if(this.chart.clearChart) this.chart.clearChart();
                if(type=='history') this.getHistory();
                else{
                    this.getPrice();
                    this.priceTimer = setInterval(() => {
                        this.getPrice();
                    }, 5000);
                }
            }
        }
    }
}
</script>

<style scoped>
    .disabled{
        cursor: not-allowed !important;
        border: 1px solid rgb(230,230,230) !important;
    }
    .all{
        -webkit-user-select: none;
    }
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
    .changeChart{
        position: absolute;
        right: 20px;
        text-align: center;
        line-height: 60px;
        top: 0px;
        font-size: 12px;
        height: 60px;
        z-index:999;
    }
    .changeChart{
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
    .right{
        justify-content: space-evenly;
    }
    .cp{
        width: 45%;
        height: 60px;
        border: 1px solid rgb(240,240,240);
        border-radius: 3px;
        padding-left: 5px;
        padding-right: 5px;
        padding-top: 3px;
        padding-bottom: 3px;
    }
    .cp-title{
        font-size: 12px;
        color: rgb(190, 190, 190);
        height: 20px;
        line-height: 20px;
    }
    .cp-price{
        width: 100%;
        font-size: 22px;
        text-align: center;
        height: 34px;
        line-height: 34px;
        font-weight: bolder;
    }
    .box{
        width:100%;
        height: 60px;
        padding-left: 20px;
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
        display: flex;
    }
    .lastPrice{
        width: 50%;
        height: 40px;
    }
    .delta{
        width: 50%;
        height: 40px;
        position: relative;
    }
    .del1{
        position: absolute;
        top:5px;
        right: 30px;
        line-height: 1;
        font-weight: normal;
        font-size: 12px;
    }
    .del2{
        position: absolute;
        top:25px;
        line-height: 1;
        right: 30px;
        font-weight: normal;
        font-size: 12px;
    }
    .main{
        width: 100%;
        height: calc(100vh - 210px);
        overflow-y: scroll;
    }
    .limit{
        width: 100%;
        height: 40px;
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
    .option{
        width: 100%;
        height: 30px;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        margin-bottom: 5px;
    }
    .option-select{
        width: calc((90vw - 40px) / 5);
        height: 30px;
        line-height: 30px;
        text-align: center;
        border-radius: 8px;
        border: 1px solid rgb(230,230,230);
        font-size: 12px;
    }
    .option-select:hover{
        cursor: pointer;
    }
    .selected{
        border: 1px solid black;
    }
    .stock{
        width: 30px;
        height: 30px;
        text-align: center;
        line-height: 30px;
        border-radius: 3px;
        background: rgb(51, 51, 51);
        color: white;

    }
    .chart{
        width: calc(100vw - 40px);
        height: 195px;
    }
    .p-chart{
        width: calc(100vw);
        height: 405px;
    }
    .h-chart{
        width: calc(100vw);
        height: 500px;
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
        background-color: #27de27;
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