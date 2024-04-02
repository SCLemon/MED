const db = require('../db/db');
const mongoose = require('mongoose');
const userModel = require('../models/userModel');
db(()=>{
    userModel.create({
        user:'123',
        password:'123',
    }).then((data,err)=>{
        if(err) console.log(err);
        else console.log('完成')
        mongoose.disconnect();
    })
},()=>{
    console.log('連接失敗');
})