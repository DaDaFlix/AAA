// Підключення необхідних модулів
const crypto = require('crypto');
const readline = require('readline');

// Отримання аргументів командного рядка без "minimist"
const args = process.argv.slice(2);
let name = 'Anonymous';
let sessionId = 'defaultSession';
let secretKey = 'defaultKey';

args.forEach((arg, index) => {
  if (arg === '--name' && args[index + 1]) name = args[index + 1];
  if (arg === '--sessionId' && args[index + 1]) sessionId = args[index + 1];
  if (arg === '--key' && args[index + 1]) secretKey = args[index + 1];
});

// Функція для створення шифру
function encryptMessage(message, key) {
  const cipher = crypto.createCipher('aes-256-cbc', key);
  let encrypted = cipher.update(message, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

// Функція для дешифрування
function decryptMessage(encryptedMessage, key) {
  const decipher = crypto.createDecipher('aes-256-cbc', key);
  let decrypted = decipher.update(encryptedMessage, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// Підключення до "чату" (імітація)
console.log(`\nПідключення до чату...`);
console.log(`Користувач: ${name}`);
console.log(`Session ID: ${sessionId}`);
console.log(`Секретний ключ отримано.`);

// Інтерфейс для введення повідомлень
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\nВведіть повідомлення для шифрування:');
rl.on('line', (input) => {
  const encrypted = encryptMessage(input, secretKey);
  console.log(`\nЗашифроване повідомлення: ${encrypted}`);

  const decrypted = decryptMessage(encrypted, secretKey);
  console.log(`Розшифроване повідомлення: ${decrypted}`);

  console.log('\nВведіть наступне повідомлення:');
});
