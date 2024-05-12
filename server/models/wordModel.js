//导入 mongoose
const mongoose = require('mongoose');

// 创建文档结构
const wordSchema = new mongoose.Schema({
    token:String,
    status:JSON
});

//创建模型对象
const wordModel = mongoose.model('word', wordSchema);

//暴露
module.exports = wordModel;