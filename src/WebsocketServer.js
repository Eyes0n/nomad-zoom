import express from 'express';
import http from 'http';
import WebSocket from 'ws';

const app = express();

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

// routes
app.use('/public', express.static(__dirname + '/public'));

// api
app.get('/', (_req, res) => res.render('WebSocketHome'));
app.get('/*', (_req, res) => res.redirect('/'));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Broadcast 1: 배열로 client 관리
const sockets = [];

wss.on('connection', (socket) => {
  console.log('Connected to Browser');
  // Broadcast 1
  sockets.push(socket);

  // 임의로 유저 닉네임 설정
  socket['nickname'] = 'Anon';

  socket.on('message', (msg) => {
    console.log('msg: %s', msg);
    const parsedMsg = JSON.parse(msg);

    switch (parsedMsg.type) {
      case 'message':
        // Broadcast 1
        sockets.forEach((socketClient) =>
          socketClient.send(`${socket.nickname}: ${parsedMsg.payload}`)
        );
        // Broadcast 2: websocket.clients 사용
        // wss.clients.forEach((socketClient) =>
        //   socketClient.send(`${socket.nickname}: ${parsedMsg.payload}`)
        // );
        break;

      case 'nickname':
        // 닉네임 설정
        socket['nickname'] = parsedMsg.payload;
        break;

      default:
        break;
    }
  });

  socket.on('close', () => {
    console.log('Disconnected from the Browser');
  });
});

server.listen(3000, () => {
  console.log('Listening on http://localhost:3000');
});
