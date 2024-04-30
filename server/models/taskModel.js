//导入 mongoose
const mongoose = require('mongoose');

// 创建文档结构
const taskSchema = new mongoose.Schema({
    token:String,
    data:[{
        date:String,
        todo:{
            title:String,
            period:String,
            content:String,
            status:Boolean,
            taskId:String
        }
    }]
});

//创建模型对象
const taskModel = mongoose.model('task', taskSchema);

//暴露
module.exports = taskModel;

