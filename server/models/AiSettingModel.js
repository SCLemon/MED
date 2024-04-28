//导入 mongoose
const mongoose = require('mongoose');

// 创建文档结构
const AiSettingSchema = new mongoose.Schema({
    token:String,
    record:JSON,
});

//创建模型对象
const AiSettingModel = mongoose.model('AiSetting', AiSettingSchema);

//暴露
module.exports = AiSettingModel;