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

module.exports = router;


