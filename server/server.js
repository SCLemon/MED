const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 防止惡意攻擊
const requestCounts = new Map();
const blacklist = [];
const limitRequests = (req, res, next) => {
    const clientIP = req.ip;
    const currentTime = Date.now();
    if (blacklist.includes(clientIP)) return res.status(403).send('Forbidden'); 
    if (requestCounts.has(clientIP)) {
        const { count, timestamp } = requestCounts.get(clientIP);
        if (currentTime - timestamp > 1000) {
            requestCounts.set(clientIP, { count: 1, timestamp: currentTime });
        } 
        else {
            if (count >= 5) {
                blacklist.push(clientIP);
                return res.status(403).send('Forbidden');
            }
            else requestCounts.set(clientIP, { count: count + 1, timestamp: timestamp });
        }
    } else requestCounts.set(clientIP, { count: 1, timestamp: currentTime });
    next();
};
app.use(limitRequests);

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

// 避免系統中斷
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});