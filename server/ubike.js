const { default: axios } = require("axios");

// // ubike 2
// axios.get('https://apis.youbike.com.tw/json/station-yb2.json')
// .then(res=>console.log(res.data))

axios.get('https://apis.youbike.com.tw/json/area-all.json')
.then(res=>{
    //area_name_tw
    //area_code
    var output = res.data.map((item)=>{
        return {
            name : item['area_name_tw'],
            code : item['area_code']
        }
    })
    console.log(output)
})
/*
https://www.google.com.tw/maps/place/24.42041,120.77389
[
  { name: '台北市', code: '00' },
  { name: '新北市', code: '05' },
  { name: '桃園市', code: '07' },
  { name: '新竹縣', code: '0B' },
  { name: '新竹市', code: '09' },
  { name: '新竹科學工業園區', code: '10' },
  { name: '苗栗縣', code: '0A' },
  { name: '台中市', code: '01' },
  { name: '臺大專區', code: '81' },
  { name: '嘉義縣', code: '11' },
  { name: '嘉義市', code: '08' },
  { name: '臺南市', code: '13' },
  { name: '高雄市', code: '12' },
  { name: '屏東縣', code: '14' }
]

*/