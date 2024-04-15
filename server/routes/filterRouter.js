const db = require('../db/db');
const mongoose = require('mongoose');
const filterModel = require('../models/filterModel');

const express = require('express');
const router = express.Router();
// 完成優化
//紀錄
router.post('/filter/record',(req, res) => {
  var obj ={
    token: req.headers['user-token'],
    record:req.body.record
  }
  filterModel.findOneAndUpdate({token:obj.token},{$set:{record:obj.record}},{upsert: true})
  .then((data,err)=>{
      if(err) res.status(200).send('error when creating new record in filterModel');
      else res.status(200).send('success')
  }).catch(e=>{
    res.status(200).send('error when creating new record in filterModel');
  })
});

// 獲取
router.get('/filter/get/:token', (req, res) => {
  filterModel.findOne({token:req.params.token})
  .then((data,err)=>{
    if (err) res.status(200).send('error when finding record in filterModel')
    else if (data==null) res.status(200).send('new');
    else res.status(200).send(data.record);
  }).catch(e=>{
    res.status(200).send('error when finding record in filterModel')
  })
});


module.exports = router;