const schedule = require('node-schedule');
const taskModel = require('../models/taskModel');
const axios =require('axios');
const { connectToDatabase } = require('../db/db');
connectToDatabase();

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
    }).catch(e=>{
      console.log('Failed to send Email To Appscript')
    })
}