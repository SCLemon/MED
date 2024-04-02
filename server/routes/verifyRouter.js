const { v4: uuidv4 } = require('uuid');
const db = require('../db/db');
const mongoose = require('mongoose');
const userModel = require('../models/userModel');

const express = require('express');
const router = express.Router();

// 註冊
router.post('/verify/register',(req, res) => {
  var user = req.body.user;
  var password = req.body.password;
  var mail = req.body.mail;
  if(!new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).test(mail)) return res.status(200).send('Invalid Mail');
  else if(user.trim()=='' || password.trim()=='' || mail.trim()=='') return res.status(200).send('blank');
  else{
    req.body.token = uuidv4();
    db(()=>{
      userModel.find({user:user})
      .then((data,err)=>{
        if(!data.length){
          userModel.create(req.body)
          .then((data, err) => {
            if (err) res.status(200).send('error when creating')
            else {
              console.log('完成')
              res.status(200).send('success')
            }
            mongoose.disconnect();
          })
        }
        else res.status(200).send('User Existed');
      })
    },()=>{
        console.log('連接失敗');
        res.status(500).send('error when connecting');
    })
  }
});

//登入
router.post('/verify/login',(req, res) => {
  var user = req.body.user;
  var password = req.body.password;
  if(user.trim()=='' || password.trim()=='') return res.status(200).send('blank');
  else{
    db(()=>{
      userModel.find({$and:[{user:user},{password:password}]})
      .then((data,err)=>{
          if(!data.length) res.status(200).send('User Not Exists')
          else {
            res.status(200).send(data)
          }
          mongoose.disconnect();
      })
    },()=>{
        console.log('連接失敗');
        res.status(500).send('error when connecting');
    })
  }
});


module.exports = router;