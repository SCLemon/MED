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

// 任務列表
const taskRouter = require('./routes/taskRouter');
app.use(taskRouter);

// 篩選器列表
const filterRouter = require('./routes/filterRouter');
app.use(filterRouter);

// 課程列表
const scheduleRouter = require('./routes/scheduleRouter');
app.use(scheduleRouter);

app.listen(3007, () => {
    console.log('服务已经启动, 端口 3007 正在监听中....')
})