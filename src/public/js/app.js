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

function showRoomMsg() {
  welcome.hidden = true;
  roomMsg.hidden = false;
  const h3 = roomMsg.querySelector('h3');
  h3.textContent = `Room ${roomName}`;
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

socket.on('welcome', () => {
  addMessage('someone joined!');
});
