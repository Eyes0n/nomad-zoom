import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { instrument } from '@socket.io/admin-ui';

const app = express();

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

// routes
app.use('/public', express.static(__dirname + '/public'));

// api
app.get('/', (_req, res) => res.render('home'));
app.get('/*', (_req, res) => res.redirect('/'));

const httpServer = http.createServer(app);

// Socket.Io
const io = new Server(httpServer, {
  cors: {
    origin: ['https://admin.socket.io'],
    credentials: true,
  },
});

instrument(io, {
  auth: false,
});

io.on('connection', (socket) => {
  socket.on('join_room', (roomName) => {
    socket.join(roomName);
    socket.to(roomName).emit('join_room', 'someone joined');
  });

  socket.on('offer', (offer, room) => {
    socket.to(room).emit('offer', offer);
  });

  socket.on('answer', (answer, room) => {
    socket.to(room).emit('answer', answer);
  });

  socket.on('iceCandidate', (ice, room) => {
    socket.to(room).emit('iceCandidate', ice);
  });
});

httpServer.listen(3000, () => {
  console.log('Listening on http://localhost:3000');
});
