const { WebSocketServer } = require('ws');
const { v4: uuidv4 } = require('uuid'); // Для унікальних ідентифікаторів сесій

const wss = new WebSocketServer({ port: 8080 });

const clients = new Map(); // Зберігаємо інформацію про клієнтів

wss.on('connection', function connection(ws) {
  const clientId = uuidv4(); // Унікальний ідентифікатор для кожного клієнта
  clients.set(ws, { id: clientId, name: null });

  console.log(`New connection: ${clientId}`);

  ws.send(JSON.stringify({ type: 'session', id: clientId }));

  ws.on('message', function message(data) {
    const parsedData = JSON.parse(data);

    // Обробка типів повідомлень
    switch (parsedData.type) {
      case 'name':
        clients.get(ws).name = parsedData.name;
        console.log(`Client ${clientId} set name: ${parsedData.name}`);
        break;

      case 'message':
        const senderName = clients.get(ws).name || 'Anonymous';
        const messageToBroadcast = JSON.stringify({
          type: 'message',
          sender: senderName,
          text: parsedData.text,
        });

        wss.clients.forEach(function each(client) {
          if (client.readyState === WebSocket.OPEN) {
            client.send(messageToBroadcast);
          }
        });
        break;

      default:
        console.log('Unknown message type:', parsedData.type);
    }
  });

  ws.on('close', () => {
    clients.delete(ws);
    console.log(`Client ${clientId} disconnected`);
  });

  ws.on('error', console.error);
});
