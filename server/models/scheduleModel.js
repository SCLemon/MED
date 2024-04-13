//导入 mongoose
const mongoose = require('mongoose');

// 创建文档结构
const scheduleSchema = new mongoose.Schema({
    token:String,
    record:JSON,
});

//创建模型对象
const scheduleModel = mongoose.model('schedule', scheduleSchema);

//暴露
module.exports = scheduleModel;