const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');
const https = require('https');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 443;

// 加载 SSL 憑證
const {keyForHttps , pemForHttps} = require('./sslPath.js')
const options = {
  key: fs.readFileSync(path.resolve(__dirname, keyForHttps)),
  cert: fs.readFileSync(path.resolve(__dirname, pemForHttps))
};

// 配置代理
app.use('/chat/', createProxyMiddleware({
  target: 'http://127.0.0.1:3007/chat/',
  changeOrigin: true
}));

app.use('/verify/', createProxyMiddleware({
  target: 'http://localhost:3007/verify/',
  changeOrigin: true,
  logger: console
}));

app.use('/userInfo/', createProxyMiddleware({
  target: 'http://localhost:3007/userInfo/',
  changeOrigin: true
}));

app.use('/reminder/', createProxyMiddleware({
  target: 'http://127.0.0.1:3007/reminder/',
  changeOrigin: true
}));

app.use('/filter/', createProxyMiddleware({
  target: 'http://127.0.0.1:3007/filter/',
  changeOrigin: true
}));

app.use('/aiSetting/', createProxyMiddleware({
  target: 'http://127.0.0.1:3007/aiSetting/',
  changeOrigin: true
}));

app.use('/schedule/', createProxyMiddleware({
  target: 'http://127.0.0.1:3007/schedule/',
  changeOrigin: true
}));

app.use('/imageHistory/', createProxyMiddleware({
  target: 'http://127.0.0.1:3007/imageHistory/',
  changeOrigin: true
}));

app.use('/stock/', createProxyMiddleware({
  target: 'http://127.0.0.1:3007/stock/',
  changeOrigin: true
}));

app.use('/word/', createProxyMiddleware({
  target: 'http://127.0.0.1:3007/word/',
  changeOrigin: true
}));

app.use('/api/', createProxyMiddleware({
  target: 'http://127.0.0.1:3007/api/',
  changeOrigin:true
}));

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

https.createServer(options, app).listen(PORT, () => {
  console.log(`HTTPS Server is running on https://127.0.0.1:${PORT}`);
});
