const taskModel = require('../models/taskModel');

const express = require('express');
const router = express.Router();

const { v4: uuidv4 } = require('uuid');

//獲取 -> 完成
router.get('/reminder/get/:token', (req, res) => {
  taskModel.findOne({token:req.params.token})
  .then((data,err)=>{
    if (err) res.status(200).send('error when finding record in taskModel')
    else {
      if(data==null) res.status(200).send('new')
      else res.status(200).send(data);
    }
  })
  .catch(e=>{
    res.status(200).send('error when finding record in taskModel')
  })
});

//紀錄 ->完成
router.post('/reminder/add',(req, res) => {
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
  }).catch(e=>{
    res.status(200).send('error when finding record in taskModel')
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
  taskModel.updateOne(
    { "token": req.headers['user-token'], "data.todo.taskId": taskId },
    { $set: { "data.$.date": obj.data.date,"data.$.todo": obj.data.todo } }
  )
  .then((result)=>{
    if (result.modifiedCount > 0) res.status(200).send('success');
    else res.status(200).send('Failed To updating record in taskModel');
  }).catch(e=>{
    res.status(200).send('Failed To updating record in taskModel');
  })
});

//刪除 ->完成
router.delete('/reminder/delete/:taskId', (req, res) => {
  taskModel.updateOne(
    { token: req.headers['user-token'] },
    { $pull: { "data": { "todo.taskId": req.params.taskId } } }
  )
  .then((result)=>{
    if (result.modifiedCount > 0) res.status(200).send('success');
    else res.status(200).send('Failed To Delete record in taskModel');
  })
  .catch(e=>{
    res.status(200).send('Failed To Delete record in taskModel');
  })
});




module.exports = router;