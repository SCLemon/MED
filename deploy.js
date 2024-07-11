const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();
const PORT = 4040;

app.use(express.static(path.join(__dirname, 'dist')));

const apiProxy = createProxyMiddleware({
    target: 'http://localhost:3007',
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

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Proxy server is running on http://localhost:${PORT}`);
});
