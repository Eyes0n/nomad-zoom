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

function publicRooms() {
  const {
    sockets: {
      adapter: { sids, rooms },
    },
  } = io;

  const publics = [];

  rooms.forEach((_value, key) => {
    if (sids.get(key) === undefined) {
      publics.push(key);
    }
  });

  return publics;
}

function countRoom(roomName) {
  return io.sockets.adapter.rooms.get(roomName)?.size;
}

io.on('connection', (socket) => {
  console.log('Connected to Browser');
  socket['nickname'] = 'Anon';

  socket.onAny((event) => {
    console.log(`Socket Event: ${event}`);
  });

  io.sockets.emit('room_change', publicRooms());

  socket.on('enter_room', (roomName, done) => {
    // join room
    socket.join(roomName);

    done(countRoom(roomName));

    // Broadcasting to others in room
    socket.to(roomName).emit('welcome', socket.nickname, countRoom(roomName));

    // Broadcast to all sockets
    io.sockets.emit('room_change', publicRooms());
  });

  socket.on('nickname', (nickname) => (socket['nickname'] = nickname));

  socket.on('message', (msg, room, done) => {
    // Broadcasting to others in room
    socket.to(room).emit('message', `${socket['nickname']}: ${msg}`);
    done();
  });

  socket.on('exit_room', (room) => {
    // leave room
    socket.leave(room);
    socket.to(room).emit('message', `${socket.nickname} exited the room`);
  });

  socket.on('disconnecting', () => {
    socket.rooms.forEach((room) =>
      socket.to(room).emit('leave', socket.nickname, countRoom(room) - 1)
    );
  });

  socket.on('disconnect', () => {
    console.log(`Disconnected`);
    io.sockets.emit('room_change', publicRooms());
  });
});

httpServer.listen(3000, () => {
  console.log('Listening on http://localhost:3000');
});
