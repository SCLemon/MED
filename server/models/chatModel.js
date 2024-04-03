//导入 mongoose
const mongoose = require('mongoose');

// 创建文档结构
const chatSchema = new mongoose.Schema({
    token:String,
    record:Array,
});

//创建模型对象
const chatModel = mongoose.model('chat', chatSchema);

//暴露
module.exports = chatModel;