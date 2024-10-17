const WebSocket = require('ws');
const OpenAI = require('openai');
const key  = require('../../apiKey.js');
const openai = new OpenAI({
  apiKey: key.openaiKey,
});


function startAIWebSocketServer(port) {
  const wss = new WebSocket.Server({ port });

  wss.on('connection', (ws) => {

    ws.on('message', async(message) => {

      var config = JSON.parse(message);
      const response = await openai.chat.completions.create(config)
      for await (const chunk of response) {
        const data = chunk.choices[0].delta.content;
        if(data==undefined) ws.send(JSON.stringify({ msg:data, isComplete: true }));
        else ws.send(JSON.stringify({msg:data , isComplete:false}));
      }
    });

    ws.on('close', () => {});
  });

  console.log(`WebSocket server is listening on ws://localhost:${port}`);
}

module.exports = { startAIWebSocketServer };
