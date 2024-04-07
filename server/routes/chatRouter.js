const db = require('../db/db');
const mongoose = require('mongoose');
const chatModel = require('../models/chatModel');

const express = require('express');
const router = express.Router();

//紀錄
router.post('/chat/record',(req, res) => {
  console.log(req.body.record)
  var obj ={
    token: req.headers['user-token'],
    record:req.body.record
  }
  db(()=>{
    chatModel.findOneAndUpdate({token:obj.token},{$set:{record:obj.record}},{upsert: true})
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
});

//刪除
router.delete('/chat/delete/:token', (req, res) => {
  db(()=>{
    chatModel.deleteOne({token:req.params.token})
    .then((data,err)=>{
      if (err) {
        console.log(err)
        res.status(200).send('error when deleting record in chatModel')
      }
      else {
        res.status(200).send('success');
      }
      mongoose.disconnect();
    })
  },()=>{
      console.log('連接失敗');
      res.status(200).send('error when deleting record in chatModel');
      mongoose.disconnect();
  })
});

// 獲取
router.get('/chat/get/:token', (req, res) => {
    db(()=>{
      chatModel.find({token:req.params.token})
      .then((data,err)=>{
        if (err) {
          console.log(err)
          res.status(200).send('error when finding record in chatModel')
        }
        else {
          if(data.length)
            res.status(200).send(data[0].record);
          else
            res.status(200).send('new')
        }
        mongoose.disconnect();
      })
    },()=>{
        console.log('連接失敗');
        res.status(200).send('error when finding record in chatModel');
        mongoose.disconnect();
    })
});


module.exports = router;