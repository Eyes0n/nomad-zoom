const socket = io();

const welcome = document.getElementById('welcome');
const roomForm = welcome.querySelector('form');
const roomMsg = document.getElementById('roomMsg');

roomMsg.hidden = true;

let roomName;

function addMessage(message) {
  const ul = roomMsg.querySelector('ul');
  const li = document.createElement('li');

  li.innerText = message;
  ul.appendChild(li);
}

function handleMessageSubmit(evt) {
  evt.preventDefault();
  const msgForm = roomMsg.querySelector('#msg');
  const input = msgForm.querySelector('input');
  const value = input.value;
  socket.emit('message', value, roomName, () => addMessage(`You: ${value}`));
  input.value = '';
}

function handleNicknameSubmit(evt) {
  evt.preventDefault();
  const nickForm = roomMsg.querySelector('#nick');
  const input = nickForm.querySelector('input');
  const value = input.value;
  socket.emit('nickname', value);
  input.value = '';
}

function showRoomMsg() {
  welcome.hidden = true;
  roomMsg.hidden = false;

  const h3 = roomMsg.querySelector('h3');
  h3.textContent = `Room ${roomName}`;

  const msgForm = roomMsg.querySelector('#msg');
  const nickForm = roomMsg.querySelector('#nick');

  msgForm.addEventListener('submit', handleMessageSubmit);
  nickForm.addEventListener('submit', handleNicknameSubmit);
}

function handleRoomSubmit(evt) {
  evt.preventDefault();
  const input = roomForm.querySelector('input');

  // send socket message
  socket.emit('enter_room', input.value, showRoomMsg);
  roomName = input.value;
  input.value = '';
}

roomForm.addEventListener('submit', handleRoomSubmit);

socket.on('welcome', (user) => {
  addMessage(`${user} join!`);
});

socket.on('leave', (user) => {
  addMessage(`${user} left`);
});

socket.on('message', (msg) => {
  addMessage(msg);
});
