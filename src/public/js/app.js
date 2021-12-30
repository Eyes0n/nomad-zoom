const socket = new WebSocket(`ws://${window.location.host}`);

socket.onopen = () => {
  console.log('WebSocket connection established');
};

socket.onmessage = (msg) => {
  console.log('New message : ', msg.data, ' from the server');
};

socket.onclose = () => {
  console.log('WebSocket connection closed');
};

setTimeout(() => {
  socket.send('hello from the browser');
}, 3000);
