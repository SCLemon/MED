const AiSettingModel = require('../models/AiSettingModel');

const express = require('express');
const router = express.Router();
// 完成優化
//紀錄
router.post('/aiSetting/record',(req, res) => {
  var obj ={
    token: req.headers['user-token'],
    record:req.body.record
  }
  AiSettingModel.findOneAndUpdate({token:obj.token},{$set:{record:obj.record}},{upsert: true})
  .then((data,err)=>{
      if(err) res.status(200).send('error when creating new record in AiSettingModel');
      else res.status(200).send('success')
  }).catch(e=>{
    res.status(200).send('error when creating new record in filterModel');
  })
});

// 獲取
router.get('/aiSetting/get/:token', (req, res) => {
  AiSettingModel.findOne({token:req.params.token})
  .then((data,err)=>{
    if (err) res.status(200).send('error when finding record in AiSettingModel')
    else if (data==null) res.status(200).send('new');
    else res.status(200).send(data.record);
  }).catch(e=>{
    res.status(200).send('error when finding record in AiSettingModel')
  })
});


module.exports = router;