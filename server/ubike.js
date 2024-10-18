const { default: axios } = require("axios");

// ubike 2
axios.get('https://apis.youbike.com.tw/json/station-yb2.json')
.then(res=>console.log(res.data))

// ubike 1
axios.get('https://apis.youbike.com.tw/json/station-yb1.json')
.then(res=>console.log(res.data))