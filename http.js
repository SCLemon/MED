const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4040;

// 配置代理
app.use('/chat/', createProxyMiddleware({
    target: 'http://127.0.0.1:3007/chat/',
    changeOrigin: true
  }));
  
  app.use('/verify/', createProxyMiddleware({
    target: 'http://localhost:3007/verify/',
    changeOrigin: true,
  }));
  
  app.use('/userInfo/', createProxyMiddleware({
    target: 'http://localhost:3007/userInfo/',
    changeOrigin: true,
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
    changeOrigin: true
  }));


// 服务静态文件
app.use(express.static(path.join(__dirname, 'dist')));

// 捕获所有其他路由并返回前端应用
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// 错误处理
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Server is running on  http://127.0.0.1:${PORT}`);
});
