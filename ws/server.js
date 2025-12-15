import { WebSocketServer } from 'ws';

const PORT = 8080;
const wss = new WebSocketServer({ port: PORT });

wss.on('connection', (ws) => {
  console.log('Клиент подключён');

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data);
      // Транслируем сообщение всем клиентам
      wss.clients.forEach((client) => {
        if (client.readyState === 1) {
          client.send(JSON.stringify(message));
        }
      });
      console.log('Сообщение:', message);
    } catch (err) {
      console.error('Ошибка парсинга:', err);
    }
  });

  ws.on('close', () => console.log('Клиент отключён'));
});

console.log(`WebSocket сервер запущен на ws://localhost:${PORT}`);
