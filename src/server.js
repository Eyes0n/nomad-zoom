import express from 'express';

const app = express();

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

// routes
app.use('/public', express.static(__dirname + '/public'));

// api
app.get('/', (req, res) => res.render('home'));
app.get('/*', (req, res) => res.redirect('/'));

app.listen(3000, () => {
  console.log('Listening on http://localhost:3000');
});
