const express = require('express');
const router = express.Router();
const axios = require('axios');
const key  = require('../apiKey');

// 即時新聞
const newsKey = key.NewsAPIKey;
router.get('/api/news/headline',(req, res) => {
    axios.get(`https://newsapi.org/v2/top-headlines?q=${req.query.q}&category=${req.query.category}&country=${req.query.country}&page=${req.query.page}&sortBy=publishedAt&apiKey=${newsKey}`)
    .then(data=>{
        res.send(JSON.stringify(data.data));
    })
    .catch(e=>{
        res.send('error');
    })
});
router.get('/api/news/everything',(req, res) => {
    axios.get(`https://newsapi.org/v2/everything?q=${req.query.q}&page=${req.query.page}&sortBy=publishedAt&apiKey=${newsKey}`)
    .then(data=>{
        res.send(JSON.stringify(data.data));
    })
    .catch(e=>{
        res.send('error');
    })
});

// weather API
const weatherKey = key.weatherKey;
router.post('/api/weather',(req,res)=>{
    axios.get(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${req.body.latitude}%2C${req.body.longitude}?unitGroup=metric&key=${weatherKey}&contentType=json`)
    .then(data=>{
        res.send(data.data);
    })
})

// Google API Key
const googleMapKey = key.googleMapKey
router.get('/api/google/auth',(req, res) => {
    res.send(googleMapKey);
});

router.post('/api/google/location',(req,res)=>{
    axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${req.body.lat},${req.body.long}&language=zh-TW&key=${googleMapKey}`)
    .then(response=>{
        res.send(response.data)
    })
    .catch((e)=>{
        res.send({})
    })
})



// Ubike
router.get('/api/ubike/county',(req,res)=>{
    axios.get('https://apis.youbike.com.tw/json/area-all.json')
    .then(response=>{
        var output = response.data.map((item)=>{
            return {
                label : item['area_name_tw'],
                value : item['area_code']
            }
        })
        res.send(output)
    })
    .catch(()=>{
        res.send([])
    })
})
router.get('/api/ubike/station',(req,res)=>{
    axios.get('https://apis.youbike.com.tw/json/station-yb2.json')
    .then(response=>{
        res.send(response.data)
    })
    .catch(()=>{
        res.send([])
    })
})

module.exports = router;


