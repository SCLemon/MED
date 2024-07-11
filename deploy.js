const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const https = require('https');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 443; // 使用 HTTPS 的標準端口

// 讀取 SSL 憑證和私鑰
const privateKeyPath = path.join(__dirname, '..', 'private.key');
const certificatePath = path.join(__dirname, '..', 'certificate.crt');

const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
const certificate = fs.readFileSync(certificatePath, 'utf8');

const credentials = { key: privateKey, cert: certificate };

// 設置靜態檔案目錄
app.use(express.static(path.join(__dirname, 'dist')));

// 設置 API 反向代理
const apiProxy = createProxyMiddleware({
    target: 'http://localhost:3007', // 請替換為你的 API 伺服器地址
    changeOrigin: true,
});

const paths = [
    '/chat',
    '/verify',
    '/userInfo',
    '/reminder',
    '/filter',
    '/aiSetting',
    '/schedule',
    '/imageHistory',
    '/stock',
    '/word',
    '/api',
];

paths.forEach(path => {
    app.use(path, apiProxy);
});

// 所有其他路由都返回前端應用的 index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// 創建 HTTPS 伺服器
const httpsServer = https.createServer(credentials, app);

// 監聽 443 端口
httpsServer.listen(PORT, () => {
    console.log(`HTTPS Server is running on port ${PORT}`);
});
