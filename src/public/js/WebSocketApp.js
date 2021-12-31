const msgList = document.querySelector('ul');
const nickForm = document.querySelector('#nick');
const msgForm = document.querySelector('#message');

const socket = new WebSocket(`ws://${window.location.host}`);

socket.onopen = () => {
  console.log('WebSocket connection established');
};

socket.onmessage = (msg) => {
  // msg가 blob type으로 들어와서 string으로 변환하기 위해 promise인 blob.text() 사용
  // 위 방법 이외에 FileReader 객체로 읽는 방법 || 서버(server.js)에서 msg.toString()값을 send하는 방법 등.
  // console.log('New message :', await msg.data.text());
  console.log('New message :', msg.data);
  const li = document.createElement('li');
  li.innerText = msg.data;
  msgList.appendChild(li);
};

socket.onclose = () => {
  console.log('WebSocket connection closed');
};

function makeMessage(type, payload) {
  const msg = { type, payload };
  return JSON.stringify(msg);
}

function handleSubmit(evt) {
  evt.preventDefault();
  const input = msgForm.querySelector('input');
  socket.send(makeMessage('message', input.value));
  input.value = '';
}

function handleNickSubmit(evt) {
  evt.preventDefault();
  const input = nickForm.querySelector('input');
  socket.send(makeMessage('nickname', input.value));
  input.value = '';
}

msgForm.addEventListener('submit', handleSubmit);
nickForm.addEventListener('submit', handleNickSubmit);
