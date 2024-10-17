const WebSocket = require('ws');
const OpenAI = require('openai');
const key = require('../../apiKey.js');
const openai = new OpenAI({
  apiKey: key.openaiKey,
});
const https = require('https');
const fs = require('fs');
const path = require('path');

// 加载 SSL 憑證
const {keyForWss , pemForWss} = require('../../../sslPath.js')
const options = {
  key: fs.readFileSync(path.resolve(__dirname, keyForWss)),
  cert: fs.readFileSync(path.resolve(__dirname, pemForWss))
};

// 創建 HTTPS 伺服器
const server = https.createServer(options);

function startAIWebSocketServer(port) {
  // 使用 WSS 並附加到 HTTPS 伺服器
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {

    ws.on('message', async (message) => {
      var config = JSON.parse(message);
      const response = await openai.chat.completions.create(config);
      for await (const chunk of response) {
        const data = chunk.choices[0].delta.content;
        if (data == undefined) ws.send(JSON.stringify({ msg: data, isComplete: true }));
        else ws.send(JSON.stringify({ msg: data, isComplete: false }));
      }
    });

    ws.on('close', () => {});
  });

  // 讓 HTTPS 伺服器監聽指定的端口
  server.listen(port, () => {
    console.log(`WebSocket server is listening on wss://localhost:${port}`);
  });
}

module.exports = { startAIWebSocketServer };
