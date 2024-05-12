const schedule = require('node-schedule');
const taskModel = require('../models/taskModel');
const axios =require('axios');
const { connectToDatabase } = require('../db/db');
connectToDatabase();
const url = 'https://script.google.com/macros/s/AKfycbwL_FzBjtVrK4hoivhXjtWKaY6FLwhXofQxsJZw-IoCy0H4tRdhqPAxihIXlyvk5DUR/exec' // appscript

const dailyJob = schedule.scheduleJob('0 8 * * *', function() {
    taskModel.find()
    .then((res,err)=>{
        res = res.filter(obj => obj.remind && obj.data.length);
        for(var i=0;i<res.length;i++){
            res[i].data = res[i].data.filter(obj => new Date(obj.date).getDate() == new Date().getDate())
                        .sort((a,b) => compare(a.todo.period) - compare(b.todo.period))
        }
    send(res);
    })
});

function compare(period){
    switch(period){
        case 'morning':
            return 1;
        case 'noon':
            return 2;
        case 'afternoon':
            return 3;
        case 'night':
            return 4;
        default:
            return 5;
    }
}
function send(data){
    axios.post(url,{
        contents:data
    }).then(res=>{
      console.log(res.data)
    }).catch(e=>{
      console.log('Failed to send Email To Appscript')
    })
}