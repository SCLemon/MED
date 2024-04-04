const db = require('../db/db');
const mongoose = require('mongoose');
const taskModel = require('../models/taskModel');

const express = require('express');
const router = express.Router();

const { v4: uuidv4 } = require('uuid');

//紀錄
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
    taskModel.create(obj)
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

//修改
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
    taskModel.replaceOne({$and:[{token:obj.token},{"data.todo.taskId":taskId}]},obj)
    .then((data,err)=>{
      if (err) res.status(200).send('error when updating record in taskModel')
      else res.status(200).send('success')
      mongoose.disconnect();
    })
  },()=>{
      console.log('連接失敗');
      res.status(200).send('error when updating record (post) in taskModel');
      mongoose.disconnect();
  })
});

//刪除
router.delete('/reminder/delete/:taskId', (req, res) => {
  db(()=>{
    taskModel.deleteOne({$and:[{token:req.headers['user-token']},{"data.todo.taskId":req.params.taskId}]})
    .then((data,err)=>{
      if (err) {
        res.status(200).send('error when deleting record in taskModel')
      }
      else {
        console.log(data)
        res.status(200).send('success');
      }
      mongoose.disconnect();
    })
  },()=>{
      console.log('連接失敗');
      res.status(200).send('error when deleting record in taskModel');
      mongoose.disconnect();
  })
});

// 獲取
router.get('/reminder/get/:token', (req, res) => {
    db(()=>{
      taskModel.find({token:req.params.token})
      .then((data,err)=>{
        if (err) {
          res.status(200).send('error when finding record in taskModel')
        }
        else {
          res.status(200).send(data);
        }
        mongoose.disconnect();
      })
    },()=>{
        console.log('連接失敗');
        res.status(200).send('error when finding record in taskModel');
        mongoose.disconnect();
    })
});


module.exports = router;