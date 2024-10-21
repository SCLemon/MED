const schedule = require('node-schedule');
const taskModel = require('../models/taskModel');
const axios =require('axios');
const { connectToDatabase } = require('../db/db');
const { parse, format } = require('date-fns');
const nodemailer = require("nodemailer");
const { mailConfig } = require('../apiKey');
connectToDatabase();

try{
    const dailyJob = schedule.scheduleJob('0 8 * * *', function() {
        taskModel.find({})
        .then((res,err)=>{
            res = res.filter(obj => obj.remind && obj.data.length);
            for(var i=0;i<res.length;i++){
                res[i].data 
                = res[i].data.filter(obj => obj.date == format(new Date(),'yyyy/MM/dd'))
                    .sort((a,b) => {
                        return parse(a.todo.period,'HH:mm',new Date()).getTime() - parse(b.todo.period,'HH:mm',new Date()).getTime()
                    })
                send(res[i])
            }
            
        })
        .catch(e=>{
            console.log(`Failed To execute sendMailer at ${format(new Date(),'yyyy/MM/dd')}.`)
        })
        .finally(()=>{
            console.log(`sendMailer has been excuted at ${format(new Date(),'yyyy/MM/dd')} successfully.`)
        })
    });
}
catch(e){
    console.log('Send Email Error in System Process!!')
}
function send(data){
    var date = format(new Date(),'yyyy/MM/dd');
    var insert='';
    for(var i =0;i<data.data.length;i++){
        insert+=`<tr style="height:50px; line-height:50px">
                  <td colspan="2">${data.data[i].todo.period}</td>
                  <td colspan="2">${data.data[i].todo.title}</td>
                </tr>`
    }
    var str =`
         <div style="margin-bottom: 10px;">早安親愛的使用者，以下是今日的代辦事項！</div>
        <table border="1" style="border-collapse: collapse; text-align: center; width: 335px;">
            <tr style="height:50px; line-height:50px"> 
                <th colspan="4">MED 智能小助手</th>
            </tr>
            <tr style="height:50px; line-height:50px"> 
                <th>日期</th>
                <th colspan="3">${date}</th>
            </tr>
            <tr style="height:50px; line-height:50px">
                <td colspan="2">時段</td>
                <td colspan="2">標題</td>
            </tr>
            ${insert}
        </table>
        <div style="margin-top: 10px;">敬祝您有個愉快的一天！</div>
    `

    const transporter = nodemailer.createTransport(mailConfig)

    const mailOptions = {
        to: data.mail,
        subject: 'MED小精靈 - 今日計畫通知',
        html: str
    }
    transporter.sendMail(mailOptions, (err, info) => {})
}
console.log('sendMailer is running!');