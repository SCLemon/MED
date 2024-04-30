const { v4: uuidv4 } = require('uuid');
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
    userModel.findOne({mail:mail})
    .then((data,err)=>{
      if(!data){
        userModel.create(req.body)
        .then((data, err) => {
          if (err) res.status(200).send('error when creating')
          else {
            res.status(200).send('success')
          }
        })
      }
      else res.status(200).send('User Existed');
    })
    .catch(e=>{
      res.status(200).send('Failed To register');
    })
  }
});

//登入
router.post('/verify/login',(req, res) => {
  var mail = req.body.mail;
  var password = req.body.password;
  if(mail.trim()=='' || password.trim()=='') return res.status(200).send('blank');
  else{
    userModel.findOne({$and:[{mail:mail},{password:password}]})
    .then((data,err)=>{
        if(!data) res.status(200).send('User Not Exists')
        else res.status(200).send(data)
    })
    .catch(e=>{
      res.status(200).send('Failed when connecting to server')
    })
  }
});

module.exports = router;