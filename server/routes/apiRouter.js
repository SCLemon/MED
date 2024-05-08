const express = require('express');
const router = express.Router();
const axios = require('axios');
const newsKey = '571cbe97efd64baaac6ab5595d8f7796'
router.get('/api/news',(req, res) => {
    axios.get(`https://newsapi.org/v2/top-headlines?q=${req.query.q}&category=${req.query.category}&country=${req.query.country}&page=${req.query.page}&apiKey=${newsKey}`)
    .then(data=>{
        res.send(JSON.stringify(data.data));
    })
    .catch(e=>{
        res.send('error');
    })
});
module.exports = router;