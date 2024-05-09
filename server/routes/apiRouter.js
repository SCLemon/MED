const express = require('express');
const router = express.Router();
const axios = require('axios');

// 即時新聞
// const newsKey = '571cbe97efd64baaac6ab5595d8f7796'
const newsKey = '4bb0b5c8581e4a92a4ac2fa8529ad977';
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


