const socket = io();

const welcome = document.getElementById('welcome');
const roomForm = welcome.querySelector('#room');
const nickForm = welcome.querySelector('#nick');
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
  const input = nickForm.querySelector('input');
  const value = input.value;
  socket.emit('nickname', value);
  input.value = '';
}

function handleRoomExit() {
  welcome.hidden = false;
  roomMsg.hidden = true;
  socket.emit('exit_room', roomName);
}

function showRoomMsg(userCount) {
  welcome.hidden = true;
  roomMsg.hidden = false;

  const h3 = roomMsg.querySelector('h3');
  h3.textContent = `Room ${roomName} (${userCount})`;

  const msgForm = roomMsg.querySelector('#msg');
  const exitBtn = roomMsg.querySelector('#roomExit');
  msgForm.addEventListener('submit', handleMessageSubmit);
  exitBtn.addEventListener('click', handleRoomExit);
}

function handleRoomSubmit(evt) {
  evt.preventDefault();
  const input = roomForm.querySelector('input');

  // send socket message
  socket.emit('enter_room', input.value, showRoomMsg);
  roomName = input.value;
  input.value = '';
}

nickForm.addEventListener('submit', handleNicknameSubmit);
roomForm.addEventListener('submit', handleRoomSubmit);

socket.on('welcome', (user, userCount) => {
  const h3 = roomMsg.querySelector('h3');
  h3.textContent = `Room ${roomName} (${userCount})`;
  addMessage(`${user} join!`);
});

socket.on('leave', (user, userCount) => {
  const h3 = roomMsg.querySelector('h3');
  h3.textContent = `Room ${roomName} (${userCount})`;
  addMessage(`${user} left`);
});

socket.on('message', (msg) => {
  addMessage(msg);
});

socket.on('room_change', (rooms) => {
  const roomList = welcome.querySelector('ul');

  roomList.innerHTML = '';
  if (rooms.length === 0) {
    return;
  }

  rooms.forEach((room) => {
    const li = document.createElement('li');
    li.innerText = room;
    roomList.appendChild(li);
  });
});
