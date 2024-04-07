const db = require('../db/db');
const mongoose = require('mongoose');
const taskModel = require('../models/taskModel');

const express = require('express');
const router = express.Router();

const { v4: uuidv4 } = require('uuid');

// 獲取 -> 完成
router.get('/reminder/get/:token', (req, res) => {
  db(()=>{
    taskModel.findOne({token:req.params.token})
    .then((data,err)=>{
      if (err) {
        res.status(200).send('error when finding record in taskModel')
      }
      else {
        if(data==null) res.status(200).send('new')
        else res.status(200).send(data);
      }
      mongoose.disconnect();
    })
  },()=>{
      console.log('連接失敗');
      res.status(200).send('error when finding record in taskModel');
      mongoose.disconnect();
  })
});

//紀錄 ->完成
router.post('/reminder/add',(req, res) => {
  db(()=>{
    req.body.todo.taskId= uuidv4();
    var obj ={
      token: req.headers['user-token'],
      data: {
        date:req.body.date,
        todo:req.body.todo
      }
    }
    taskModel.findOneAndUpdate({token:obj.token},{$push:{data:obj.data}},{upsert: true})
    .then((data,err)=>{
      if (err) res.status(200).send('error when finding record in taskModel')
      else res.status(200).send('success')
      mongoose.disconnect();
    })
  },()=>{
      console.log('連接失敗');
      res.status(200).send('error when finding record (post) in taskModel');
      mongoose.disconnect();
  })
});

//修改 ->完成
router.put('/reminder/update',(req, res) => {
  var taskId= req.body.taskId;
  req.body.todo.taskId=taskId;
  var obj ={
    token: req.headers['user-token'],
    data: {
      date:req.body.date,
      todo:req.body.todo
    }
  }
  db(()=>{
    taskModel.updateOne(
      { "token": req.headers['user-token'], "data.todo.taskId": taskId }, // 匹配条件
      { $set: { "data.$.todo": obj.data.todo } }
    )
    .then((result)=>{
      console.log(result)
      if (result.modifiedCount > 0) {
        res.status(200).send('success');
      } else {
        res.status(200).send('Failed To updating record in taskModel');
      }
      mongoose.disconnect();
    })
  },()=>{
      res.status(200).send('error when updating record (post) in taskModel');
      mongoose.disconnect();
  })
});

//刪除 -> debug
router.delete('/reminder/delete/:taskId', (req, res) => {
  db(()=>{
    taskModel.updateOne(
      { token: req.headers['user-token'] },
      { $pull: { "data": { "todo.taskId": req.params.taskId } } }
    )
    .then((result)=>{
      console.log(result);
      if (result.modifiedCount > 0) {
        res.status(200).send('success');
      } else {
        res.status(200).send('Failed To Delete record in taskModel');
      }
      mongoose.disconnect();
    })
  },()=>{
      console.log('連接失敗');
      res.status(200).send('error when deleting record in taskModel');
      mongoose.disconnect();
  })
});




module.exports = router;