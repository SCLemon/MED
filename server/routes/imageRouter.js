const imageHistoryModel = require('../models/imageHistoryModel');
const { v4: uuidv4 } =require('uuid')
const express = require('express');
const router = express.Router();
const key  = require('../apiKey.js');
const OpenAI = require('openai');
const openai = new OpenAI({
  apiKey: key.openaiKey,
});

// 完成優化
//紀錄
router.post('/imageHistory/record',(req, res) => {
  imageHistoryModel.findOneAndUpdate(
  {token:req.headers['user-token']},
  {$push:{
    datas:{
      date: req.body.date,
      genId:uuidv4(),
      record:req.body.record
    }
  }},
  {upsert: true})
  .then((data,err)=>{
      if(err) res.status(200).send('error when creating new record in imageHistoryModel');
      else res.status(200).send('success')
  }).catch(e=>{
    res.status(200).send('error when creating new record in imageHistoryModel');
  })
});

// 獲取
router.get('/imageHistory/get/:token', (req, res) => {
  imageHistoryModel.findOne({token:req.params.token})
  .then((data,err)=>{
    if (err) res.status(200).send('error when finding record in imageHistoryModel')
    else if (data==null) res.status(200).send('new');
    else res.status(200).send(data.datas);
  }).catch(e=>{
    res.status(200).send('error when finding record in imageHistoryModel')
  })
});


// 生成
router.post('/imageHistory/generate',(req,res)=>{
  var config = req.body.config;
  openai.images.generate(config)
  .then(response=>{
      res.send({
        status:'success',
        message:'Success To Generate Image',
        data:response.data,
      })
  })
  .catch(e=>{
    console.log(e)
    res.send({
      status:'error',
      message:'Failed To Generate Image',
      data:'',
    })
  })
})

module.exports = router;