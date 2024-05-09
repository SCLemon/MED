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
            var result = data.data.map(item => [format(item.date,'HH:mm'), item.low, item.open, item.close, item.high,`color:${item.close>item.open?'red':item.close<item.open?'#27de27':'gray'}`]);
            res.send(result);
        }catch(e){}
    })
    .catch(e=>{
        res.send('error')
    })
})

router.get('/stock/list',(req,res)=>{
    client.stock.intraday
    .tickers({ type: "EQUITY", exchange: "TWSE", isNormal: true })
    .then((data) =>{
        res.send(data)
    }).catch(e=>{
        res.send('error')
    })
})

// router.get('/stock/getInfo',(req,res)=>{
//     var list = ['00679B','00939','00940','00941'];
//     var output =[];
//     var flag = 0;
//     if(list.length){
//         for(var i =0; i<list.length ;i++){
//             stock.intraday.quote({symbol:list[i]})
//             .then(data =>{
//                 output.push(data)
//                 flag++;
//                 if(flag == list.length) res.send(output);
//             });
//         }
//     }
//     else res.send(output);
// })
module.exports = router;