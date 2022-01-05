const socket = io();

const myFace = document.getElementById('myFace');
const muteBtn = document.getElementById('mute');
const cameraBtn = document.getElementById('camera');

let myStream;

const constraints = {
  video: true,
  audio: true,
};

async function getMedia() {
  try {
    myStream = await navigator.mediaDevices.getUserMedia(constraints);
    myFace.srcObject = myStream;
  } catch (error) {
    console.log('Error accessing media devices.', error);
  }
}

getMedia();
