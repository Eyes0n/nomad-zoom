import express from 'express';
import http from 'http';
import WebSocket from 'ws';

const app = express();

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

// routes
app.use('/public', express.static(__dirname + '/public'));

// api
app.get('/', (_req, res) => res.render('home'));
app.get('/*', (_req, res) => res.redirect('/'));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Broadcast 1: 배열로 client 관리
const sockets = [];

wss.on('connection', (socket) => {
  console.log('Connected to Browser');
  sockets.push(socket);

  socket.on('message', (msg) => {
    console.log('msg: %s', msg);

    // Broadcast 1
    sockets.forEach((socket) => socket.send(msg));
    // Broadcast 2: websocket.clients 사용
    // wss.clients.forEach((socketClient) => socketClient.send(msg));
  });

  socket.on('close', () => {
    console.log('Disconnected from the Browser');
  });
});

server.listen(3000, () => {
  console.log('Listening on http://localhost:3000');
});
