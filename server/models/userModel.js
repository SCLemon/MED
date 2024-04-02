//导入 mongoose
const mongoose = require('mongoose');

// 创建文档结构
const userSchema = new mongoose.Schema({
    token:String,
    user: {
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
    mail:{
        type: String,
        required: true,
    },
});

//创建模型对象
const userModel = mongoose.model('users', userSchema);

//暴露
module.exports = userModel;