const express = require('express');
const cors = require('cors');
const app = express();

// 轉換
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 開放跨域
app.use(cors({
    origin: '*' 
}))
app.set('trust proxy', 'loopback, 192.168.0.1'); 

// 初始化資料庫
const { connectToDatabase, disconnectFromDatabase } = require('./db/db.js');
connectToDatabase();
process.on('SIGINT', function() {
    disconnectFromDatabase();
    // 這裡可以進行其他的清理操作，例如關閉伺服器
    process.exit(0);
});

const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 分鐘
    max: 100, // 限制每個 IP 最多 100 次請求
    message: 'Too many requests from this IP, please try again after a minute.',
});

app.use(limiter);

// api router
const apiRouter = require('./routes/apiRouter.js');
app.use(apiRouter);
// 驗證
const verifyRouter = require('./routes/verifyRouter.js');
app.use(verifyRouter);

// AI 聊天
const chatRouter = require('./routes/chatRouter.js');
app.use(chatRouter);

// AI 設置
const aiSettingRouter = require('./routes/AiSettingRouter.js');
app.use(aiSettingRouter);

// 個人資訊
const userInfoRouter = require('./routes/userInfoRouter.js');
app.use(userInfoRouter);

// 任務列表
const taskRouter = require('./routes/taskRouter.js');
app.use(taskRouter);

// 篩選器列表
const filterRouter = require('./routes/filterRouter.js');
app.use(filterRouter);

// 圖片生成紀錄
const imageRouter = require('./routes/imageRouter.js');
app.use(imageRouter);

// 證券資訊
const stockRouter = require('./routes/stockRouter.js');
app.use(stockRouter);

// 單字卡資訊
const wordRouter = require('./routes/wordRouter.js');
app.use(wordRouter);

app.listen(3007, () => {
    console.log('PORT 3007 is listening')
})

// AI socket
const { startAIWebSocketServer } = require('./routes/ws/aiHttpsSocket.js');
startAIWebSocketServer(3000)

// 避免系統中斷
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});
