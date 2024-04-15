const db = require('../db/db');
const mongoose = require('mongoose');
const scheduleModel = require('../models/scheduleModel');

const express = require('express');
const router = express.Router();
// 完成優化

//紀錄 
router.post('/schedule/record',(req, res) => {
  db(()=>{
    scheduleModel.findOneAndUpdate({token:req.headers['user-token']},{$set:{record:req.body.record}},{upsert: true})
    .then((data,err)=>{
        if(err) res.status(200).send('error when creating new record in scheduleModel');
        else res.status(200).send('success')
        mongoose.disconnect();
    })
    },()=>{
        console.log('連接失敗');
        res.status(200).send('error when connecting in scheduleModel');
        mongoose.disconnect();
    })
});

// 獲取
router.get('/schedule/get/:token', (req, res) => {
    db(()=>{
      scheduleModel.findOne({token:req.params.token})
      .then((data,err)=>{
        if (err) {
          console.log(err)
          res.status(200).send('error when finding record in scheduleModel')
        }
        else if (data==null) res.status(200).send('new');
        else res.status(200).send(data.record);
        mongoose.disconnect();
      })
    },()=>{
        console.log('連接失敗');
        res.status(200).send('error when finding record in scheduleModel');
        mongoose.disconnect();
    })
});


module.exports = router;