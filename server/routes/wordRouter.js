const wordModel = require('../models/wordModel');

const express = require('express');
const router = express.Router();

//紀錄 
router.post('/word/record',(req, res) => {
  var obj ={
    token: req.headers['user-token'],
    status:req.body.status
  }
  wordModel.findOneAndUpdate({token:obj.token},{$set:{status:obj.status}},{upsert: true})
  .then((data,err)=>{
    if(err) res.status(200).send('error when creating new record in wordModel');
    else res.status(200).send('success')
  }).catch(e=>{
    res.status(200).send('error when creating new record in wordModel');
  })
});

// 獲取
router.get('/word/status/:token', (req, res) => {
  wordModel.findOne({token:req.params.token})
  .then((data,err)=>{
    if (err) res.status(200).send('error when finding record in wordModel')
    else if (data==null) res.status(200).send('new');
    else res.status(200).send(data.status);
  }).catch(e=>{
    res.status(200).send('error when finding record in wordModel')
  })
});


module.exports = router;