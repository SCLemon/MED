const chatModel = require('../models/chatModel');

const express = require('express');
const router = express.Router();
// 完成優化

//紀錄 
router.post('/chat/record',(req, res) => {
  var obj ={
    token: req.headers['user-token'],
    record:req.body.record
  }
  chatModel.findOneAndUpdate({token:obj.token},{$set:{record:obj.record}},{upsert: true})
  .then((data,err)=>{
    if(err) res.status(200).send('error when creating new record in chatModel');
    else res.status(200).send('success')
  }).catch(e=>{
    res.status(200).send('error when creating new record in chatModel');
  })
});

//刪除
router.delete('/chat/delete/:token', (req, res) => {
  chatModel.deleteOne({token:req.params.token})
  .then((data,err)=>{
    if (err) res.status(200).send('error when deleting record in chatModel')
    else res.status(200).send('success');
  }).catch(e=>{
    res.status(200).send('error when deleting record in chatModel')
  })
});

// 獲取
router.get('/chat/get/:token', (req, res) => {
  chatModel.findOne({token:req.params.token})
  .then((data,err)=>{
    if (err) res.status(200).send('error when finding record in chatModel')
    else if (data==null) res.status(200).send('new');
    else res.status(200).send(data.record);
  }).catch(e=>{
    res.status(200).send('error when finding record in chatModel')
  })
});


module.exports = router;