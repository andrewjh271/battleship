import { on } from './observer';

const soundToggle = document.querySelector('input[name="sound-toggle"]');
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// Create a GainNode for volume control
const sfxGain = audioContext.createGain();
sfxGain.gain.value = 0.7; // Default volume
sfxGain.connect(audioContext.destination);

const audioFiles = {
  hit: './audio/Sound Effects/hit.mp3',
  miss: './audio/Sound Effects/miss.mp3',
  explosion1: './audio/Sound Effects/explosion1.mp3',
  explosion2: './audio/Sound Effects/explosion2.mp3',
  explosion3: './audio/Sound Effects/explosion3.mp3',
  explosion4: './audio/Sound Effects/explosion4.mp3',
};

const audioBuffers = {};

function subscribeToEvents() {
  on('hit', playHit);
  on('miss', playMiss);
  on('sunk', playExplosion);
}

async function loadAudioBuffer(name, url) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  audioBuffers[name] = await audioContext.decodeAudioData(arrayBuffer);
}

// Preload all sounds
Promise.all(Object.entries(audioFiles).map(([name, url]) => loadAudioBuffer(name, url)));

function playBuffer(buffer) {
  if (!soundToggle.checked) return;
  // iOS: resume context if needed
  if (audioContext.state === 'suspended') audioContext.resume();
  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.connect(sfxGain); // Connect to gain node instead of destination
  source.start(0);
}

function playHit() {
  if (audioBuffers.hit) playBuffer(audioBuffers.hit);
}

function playMiss() {
  if (audioBuffers.miss) playBuffer(audioBuffers.miss);
}

function playExplosion() {
  const idx = Math.floor(Math.random() * 4) + 1;
  const buffer = audioBuffers[`explosion${idx}`];
  if (buffer) playBuffer(buffer);
}

const sfxSlider = document.getElementById('sfx-volume');
if (sfxSlider) {
  sfxSlider.addEventListener('input', (e) => {
    sfxGain.gain.value = parseFloat(e.target.value);
  });
}

export { subscribeToEvents };
