const socket = io();

const myFace = document.getElementById('myFace');
const muteBtn = document.getElementById('mute');
const cameraBtn = document.getElementById('camera');
const camerasSelect = document.getElementById('cameras');

const call = document.getElementById('call');

call.hidden = true;

let myStream;
let isMuted = true;
let isCameraOff = false;

let roomName;
let myPeerConnection;

async function getCameras() {
  try {
    // enumerateDevices(): 사용 가능한 미디어 입력 및 출력 장치에 대한 정보 배열
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter((device) => device.kind === 'videoinput');
    const currentCamera = myStream.getVideoTracks()[0];

    cameras.forEach((camera) => {
      const option = document.createElement('option');
      option.value = camera.deviceId;
      option.textContent = camera.label;
      if (currentCamera.label === camera.label) {
        option.selected = true;
      }
      camerasSelect.appendChild(option);
    });
  } catch (error) {
    console.log(error);
  }
}

async function getMedia(deviceId) {
  const initalConstrains = {
    audio: true,
    // 모바일에서 후면 카메라 사용 설정
    video: { facingMode: 'user' },
  };

  const cameraConstraints = {
    audio: true,
    // mediaDevices.enumerateDevices()로부터 얻은 deviceId로 카메라 설정
    video: { deviceId: { exact: deviceId } },
  };

  try {
    // getUserMedia(constraints): 사용자에게 미디어 입력 장치 사용 권한 요청하여 기기의 MediaStream을 반환
    // constraints: 미디어 유형과 각각에 대한 요구사항(사용 권한)을 지정하는 MediaStreamConstraints 객체
    // return: 비디오 트랙과 오디오 트랙으로 구성된 MediaStream
    myStream = await navigator.mediaDevices.getUserMedia(
      deviceId ? cameraConstraints : initalConstrains
    );
    myFace.srcObject = myStream;
    if (!deviceId) {
      await getCameras();
    }
  } catch (error) {
    console.log('Error accessing media devices.', error);
  }
}

function handleMuteClick() {
  //  getAudioTracks()
  const myAudioTracks = myStream.getAudioTracks();
  myAudioTracks.forEach((track) => {
    track.enabled = !track.enabled;
  });

  if (isMuted) {
    isMuted = false;
    muteBtn.innerText = 'Unmuted';
  } else {
    isMuted = true;
    muteBtn.innerText = 'muted';
  }
}

function handleCameraClick() {
  //  getVideoTracks()
  const myVidoeTracks = myStream.getVideoTracks();
  myVidoeTracks.forEach((track) => (track.enabled = !track.enabled));

  if (isCameraOff) {
    isCameraOff = false;
    cameraBtn.innerText = 'Turn camera on';
  } else {
    isCameraOff = true;
    cameraBtn.innerText = 'Turn camera off';
  }
}

async function handleCameraChange() {
  // camera.value is deviceId
  await getMedia(camerasSelect.value);
}

muteBtn.addEventListener('click', handleMuteClick);
cameraBtn.addEventListener('click', handleCameraClick);
camerasSelect.addEventListener('input', handleCameraChange);

// ********** Welcome (join a room) Code **********
const welcome = document.getElementById('welcome');
const welcomeForm = welcome.querySelector('form');

async function initRTC() {
  welcome.hidden = true;
  call.hidden = false;
  await getMedia();
  makeRtcConnection();
}

async function handleWelcomeSubmit(evt) {
  evt.preventDefault();
  const input = welcomeForm.querySelector('input');
  await initRTC();
  socket.emit('join_room', input.value);
  roomName = input.value;
  input.value = '';
}
welcomeForm.addEventListener('submit', handleWelcomeSubmit);

// ********** Socket Code **********
socket.on('join_room', async (msg) => {
  // Peer Connection 1. Caller create and send offer to Callee
  const offer = await myPeerConnection.createOffer(); // return RTCSessionDescription obj
  myPeerConnection.setLocalDescription(offer);
  socket.emit('offer', offer, roomName);
});

socket.on('offer', async (offer) => {
  // Peer Connection 2. Callee register the caller's offer and send callee's answer
  myPeerConnection.setRemoteDescription(offer);
  const answer = await myPeerConnection.createAnswer(); // return RTCSessionDescription obj
  myPeerConnection.setLocalDescription(answer);
  socket.emit('answer', answer, roomName);
});

socket.on('answer', (answer) => {
  // Peer Connection 3. Caller register callee's answer
  myPeerConnection.setRemoteDescription(answer);
});

// ********** RTC Code **********
function makeRtcConnection() {
  myPeerConnection = new RTCPeerConnection();
  myStream
    .getTracks()
    .forEach((track) => myPeerConnection.addTrack(track, myStream));
}
