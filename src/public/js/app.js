const socket = io();

const myFace = document.getElementById('myFace');
const muteBtn = document.getElementById('mute');
const cameraBtn = document.getElementById('camera');
const camerasSelect = document.getElementById('cameras');

let myStream;
let isMuted = true;
let isCameraOff = false;

const constraints = {
  video: true,
  audio: true,
};

async function getCameras() {
  try {
    // enumerateDevices(): 사용 가능한 미디어 입력 및 출력 장치에 대한 정보 배열
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter((device) => device.kind === 'videoinput');

    cameras.forEach((camera) => {
      const option = document.createElement('option');
      option.value = camera.deviceId;
      option.textContent = camera.label;
      camerasSelect.appendChild(option);
    });
  } catch (error) {
    console.log(error);
  }
}

async function getMedia() {
  try {
    // getUserMedia(constraints): 사용자에게 미디어 입력 장치 사용 권한 요청하여 기기의 MediaStream을 반환
    // constraints: 미디어 유형과 각각에 대한 요구사항(사용 권한)을 지정하는 MediaStreamConstraints 객체
    // return: 비디오 트랙과 오디오 트랙으로 구성된 MediaStream
    myStream = await navigator.mediaDevices.getUserMedia(constraints);
    myFace.srcObject = myStream;
    await getCameras();
  } catch (error) {
    console.log('Error accessing media devices.', error);
  }
}

getMedia();

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

muteBtn.addEventListener('click', handleMuteClick);
cameraBtn.addEventListener('click', handleCameraClick);
