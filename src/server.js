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

server.listen(3000, () => {
  console.log('Listening on http://localhost:3000');
});
