//导入 mongoose
const mongoose = require('mongoose');

// 创建文档结构
const filterSchema = new mongoose.Schema({
    token:String,
    record:JSON,
});

//创建模型对象
const filterModel = mongoose.model('filter', filterSchema);

//暴露
module.exports = filterModel;