const express = require('express');
const router = express.Router();
const key  = require('../apiKey');

const { RestClient } = require('@fugle/marketdata');
const apiKey = key.FugleAPIKey;
const client = new RestClient({ apiKey: apiKey });
const stock = client.stock;

const {format} = require('date-fns');

router.get('/stock/getInfo',(req,res)=>{
    var symbol = req.query.symbol;
    stock.intraday.quote({symbol:symbol})
    .then(data =>{
        res.send(data);
    });
})

router.get('/stock/candles',(req,res)=>{
    var symbol = req.query.symbol;
    var timeframe = req.query.timeframe;
    client.stock.intraday.candles({ symbol: symbol, timeframe: timeframe })
    .then(data => {
        try{
            var result = data.data.map(item => [format(item.date,'HH'), item.low, item.open, item.close, item.high,`color:${item.close>item.open?'red':item.close<item.open?'#27de27':'gray'}`]);
            res.send(result);
        }catch(e){}
    })
    .catch(e=>{
        res.send('error')
    })
})

router.get('/stock/list',(req,res)=>{
    client.stock.intraday
    .tickers({ type: "EQUITY", exchange: req.query.exchange, isNormal: true })
    .then((data) =>{
        data.data.sort((a,b)=>{
            return parseInt(a.symbol) - parseInt(b.symbol);
        })
        res.send(data)
    }).catch(e=>{
        res.send('error')
    })
})

router.get('/stock/history',(req,res)=>{
    var date = format(new Date()-365*86400*1000,'yyyy-MM-dd')
    var symbol = req.query.symbol;
    stock.historical.candles({
        symbol:symbol,
        from:date,
        fields:'open,high,low,close,volume',
    })
    .then(data=>{
        var output = data.data.map(item => [new Date(item.date).getTime(),item.open, item.high, item.low, item.close,item.volume]).reverse();
        res.send(output)
    })
    .catch(e=>{
        console.log(e)
        res.send('error')
    })
})
module.exports = router;