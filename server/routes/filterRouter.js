const db = require('../db/db');
const mongoose = require('mongoose');
const filterModel = require('../models/filterModel');

const express = require('express');
const router = express.Router();

//紀錄
router.post('/filter/record',(req, res) => {
  var obj ={
    token: req.headers['user-token'],
    record:req.body.record
  }
  db(()=>{
    filterModel.findOne({token:obj.token})
    .then((data,err)=>{
      if(err) res.status(200).send('error when finding in filterModel')
      if(data){
        updateRecord(obj,res)
      }
      else{
        createNewRecord(obj,res);
      }
    })
  },()=>{
      console.log('連接失敗');
      res.status(200).send('error when connecting in filterModel');
      mongoose.disconnect();
  })
});

function createNewRecord(obj,res){
  filterModel.create(obj)
  .then((data,err)=>{
      if (err) {
        console.log(err)
        res.status(200).send('error when creating new record in filterModel')
      }
      else {
        console.log('完成')
        res.status(200).send('success')
      }
      mongoose.disconnect();
  })
}
function updateRecord(obj,res){
  filterModel.updateOne({token:obj.token},{record:obj.record})
  .then((data,err)=>{
      if (err) {
        console.log(err)
        res.status(200).send('error when updating new record in filterModel')
      }
      else {
        console.log('完成')
        res.status(200).send('success')
      }
      mongoose.disconnect();
  })
}

// 獲取
router.get('/filter/get/:token', (req, res) => {
    db(()=>{
      filterModel.find({token:req.params.token})
      .then((data,err)=>{
        if (err) {
          console.log(err)
          res.status(200).send('error when finding record in filterModel')
        }
        else {
          if(data[0])
            res.status(200).send(data[0].record);
          else
            res.status(200).send('new')
        }
        mongoose.disconnect();
      })
    },()=>{
        console.log('連接失敗');
        res.status(200).send('error when finding record in filterModel');
        mongoose.disconnect();
    })
});


module.exports = router;