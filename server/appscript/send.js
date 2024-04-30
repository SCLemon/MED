const schedule = require('node-schedule');
const taskModel = require('../models/taskModel');
const axios =require('axios');
const { connectToDatabase } = require('../db/db');
connectToDatabase();

const job = schedule.scheduleJob('*/1 * * * *', function() {
    console.log('正常運行中，目前時間為：', new Date());
});
const dailyJob = schedule.scheduleJob('0 8 * * *', function() {
    taskModel.find()
    .then((res,err)=>{
        for(var i=0;i<res.length;i++){
            res[i].data = res[i].data.filter(obj=>{
                return new Date(obj.date).getDate() == new Date().getDate();
            })
        }
        send(res);
    })
});

function send(data){
    axios.post('https://script.google.com/macros/s/AKfycbwL_FzBjtVrK4hoivhXjtWKaY6FLwhXofQxsJZw-IoCy0H4tRdhqPAxihIXlyvk5DUR/exec',{
        contents:data
    }).then(res=>{
      console.log(res.data)
      process.exit(0);
    }).catch(e=>{
      console.log('Failed to send Email To Appscript')
      process.exit(0);
    })
}