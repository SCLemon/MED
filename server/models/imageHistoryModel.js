//导入 mongoose
const mongoose = require('mongoose');

// 创建文档结构
const imageHistorySchema = new mongoose.Schema({
    token:String,
    datas:[{
        date:String,
        genId:String,
        record:JSON
    }]
});

//创建模型对象
const imageHistoryModel = mongoose.model('imageHistory', imageHistorySchema);

//暴露
module.exports = imageHistoryModel;