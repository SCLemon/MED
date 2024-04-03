const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 驗證
const verifyRouter = require('./routes/verifyRouter');
app.use(verifyRouter);

// AI 聊天
const chatRouter = require('./routes/chatRouter');
app.use(chatRouter);

// 個人資訊
const userInfoRouter = require('./routes/userInfoRouter');
app.use(userInfoRouter);

app.listen(3005, () => {
    console.log('服务已经启动, 端口 3005 正在监听中....')
})