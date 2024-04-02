const db = require('../db/db');
const mongoose = require('mongoose');
const userModel = require('../models/userModel');

const express = require('express');
const router = express.Router();

//紀錄
router.post('/chat/record',(req, res) => {
  db(()=>{
    userModel.create(req.body)
    .then((data,err)=>{
        if(err) console.log(err);
        else {
          console.log('完成')
          res.status(200).send('success')
        }
        mongoose.disconnect();
    })
  },()=>{
      console.log('連接失敗');
      res.status(500).send('failed');
  })
});

//刪除
router.get('/chat/delete/:id', (req, res) => {
    console.log(req.params.id);
    res.send(req.params.id);
});


module.exports = router;