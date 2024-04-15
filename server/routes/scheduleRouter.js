const scheduleModel = require('../models/scheduleModel');

const express = require('express');
const router = express.Router();


//紀錄 
router.post('/schedule/record',(req, res) => {
  scheduleModel.findOneAndUpdate(
    { token: req.headers['user-token'] },
    { $set: { record: req.body.record } },
    { upsert: true }
  )
  .then((data)=>{
    res.status(200).send('success')
  })
  .catch(err=>{
    res.status(200).send('error when creating new record in scheduleModel');
  })
});

// 獲取
router.get('/schedule/get/:token', (req, res) => {
  scheduleModel.findOne({token:req.params.token})
  .then((data,err)=>{
    if (err) {
      console.log(err)
      res.status(200).send('error when finding record in scheduleModel')
    }
    else if (data==null) res.status(200).send('new');
    else res.status(200).send(data.record);
  })
  .catch(err=>{
    res.status(200).send('error when getting record in scheduleModel');
  })
});


module.exports = router;