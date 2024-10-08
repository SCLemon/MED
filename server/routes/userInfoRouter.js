const userModel = require('../models/userModel');

const express = require('express');
const router = express.Router();

// 獲取個人資料
router.get('/userInfo/get/:token',(req,res)=>{
  var token = req.params.token
  userModel.findOne({token:token})
  .then((data,err)=>{
    if(data){
      res.status(200).send(data);
    }
    else {
      res.status(200).send('Failed When Getting UserInfo');
    }
  })
  .catch(e=>{
    res.status(200).send('Failed When Getting UserInfo');
  })
})
// 修改個人資料
router.put('/userInfo/update',(req, res) => {
  var user = req.body.user;
  var password = req.body.password;
  var mail = req.body.mail;
  var token = req.headers['user-token'];
  if(!new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).test(mail)) res.status(200).send('Invalid Mail');
  else if(user.trim()=='' || password.trim()=='' || mail.trim()=='') res.status(200).send('blank');
  else{
    userModel.replaceOne({token:token},{
      token:token,
      user:user,
      password:password,
      mail:mail,
      userImg:req.body.userImg.src
    })
    .then((data,err)=>{
      if(data.modifiedCount) res.status(200).send('success');
      else res.status(200).send('Failed When Updating UserInfo');
    })
    .catch(e=>{
      res.status(200).send('Failed When Updating UserInfo');
    })
  }
});

module.exports = router;