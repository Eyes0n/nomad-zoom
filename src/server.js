import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

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
const io = new Server(httpServer);

io.on('connection', (socket) => {
  console.log('Connected to Browser');

  socket.on('enter_room', (roomName, done) => {
    // join room
    socket.join(roomName);

    done();

    // Broadcasting to others in room
    socket.to(roomName).emit('welcome');
  });
});

httpServer.listen(3000, () => {
  console.log('Listening on http://localhost:3000');
});
