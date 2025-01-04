const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static(__dirname));

const messages = [];

io.on('connection', (socket) => {
    console.log('Пользователь подключился');
    
    // Отправляем историю сообщений новому пользователю
    socket.emit('load messages', messages);
    
    socket.on('new message', (message) => {
        messages.push(message);
        // Отправляем сообщение всем подключенным клиентам
        io.emit('chat message', message);
    });

    socket.on('disconnect', () => {
        console.log('Пользователь отключился');
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
}); 