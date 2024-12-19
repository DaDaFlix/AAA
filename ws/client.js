const WebSocket = require('ws');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ws = new WebSocket('ws://localhost:8080');

let sessionId = null;
let clientName = null;

// Обробка повідомлень із сервера
ws.on('message', (data) => {
  const message = JSON.parse(data);

  switch (message.type) {
    case 'session':
      sessionId = message.id;
      console.log(`Your session ID: ${sessionId}`);
      askName();
      break;

    case 'message':
      console.log(`${message.sender}: ${message.text}`);
      break;

    default:
      console.log('Unknown message type:', message.type);
  }
});

// Введення імені
function askName() {
  rl.question('Enter your name: ', (name) => {
    clientName = name;
    ws.send(JSON.stringify({ type: 'name', name }));
    askMessage();
  });
}

// Введення повідомлення
function askMessage() {
  rl.question('Enter your message: ', (text) => {
    if (text) {
      ws.send(JSON.stringify({ type: 'message', text }));
    }
    askMessage(); // Повторний виклик для введення наступного повідомлення
  });
}

// Обробка закриття WebSocket-з'єднання
ws.on('close', () => {
  console.log('Connection closed.');
  rl.close();
});

// Обробка помилок
ws.on('error', (error) => {
  console.error('WebSocket error:', error);
});
