const db = require('../db/db');
const mongoose = require('mongoose');
const chatModel = require('../models/chatModel');
var obj ={
    token: '123',
    record:obj.record
}
db(()=>{
    chatModel.findOneAndUpdate({token:obj.token},{$push:{record:obj.record}},{upsert: true})
    .then((data,err)=>{
        if(err) res.status(200).send('error when creating new record in chatModel');
        else res.status(200).send('success')
        mongoose.disconnect();
    })
},()=>{
      console.log('連接失敗');
      res.status(200).send('error when connecting in chatModel');
      mongoose.disconnect();
})