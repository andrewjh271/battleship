import { getEnsemble, getEnsembleName } from './ensemble';

const musicToggle = document.querySelector('input[name="music-toggle"]');

let path;
let instruments;
const musicBuffers = {};
let musicSources = {};
const removedInstruments = new Set();

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const musicGain = audioContext.createGain();
musicGain.gain.value = 1;
musicGain.connect(audioContext.destination);

musicToggle.addEventListener('change', async () => {
  if (musicToggle.checked) {
    await startMusic();
  } else {
    stopMusic();
  }
});

const musicSlider = document.getElementById('music-volume');
musicSlider.addEventListener('input', (e) => {
  musicGain.gain.value = parseFloat(e.target.value);
});

function setPath() {
  path = `./audio/music/${getEnsembleName()}`;
}

function setInstruments() {
  instruments = Object.keys(getEnsemble());

  if (getEnsembleName() === 'brass') {
    instruments.push('percussion');
  }
}

async function loadMusicBuffer(url) {
  if (musicBuffers[url]) return musicBuffers[url];
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const buffer = await audioContext.decodeAudioData(arrayBuffer);
  musicBuffers[url] = buffer;
  return buffer;
}

async function startMusic() {
  if (!musicToggle.checked) return;

  setPath();
  setInstruments();
  stopMusic();

  // Load all buffers in parallel
  const urls = instruments.map((key) => `${path}/${key}.mp3`);
  await Promise.all(urls.map(loadMusicBuffer));

  // Start all at the same time, except removed instruments
  const now = audioContext.currentTime;
  instruments.forEach((key) => {
    if (removedInstruments.has(key)) return;

    const url = `${path}/${key}.mp3`;
    const source = audioContext.createBufferSource();
    source.buffer = musicBuffers[url];
    source.loop = true;
    const gain = audioContext.createGain();
    gain.gain.value = 1;
    source.connect(gain).connect(musicGain);
    source.start(now);
    musicSources[key] = { source, gain };
  });
}

function removeInstrument(data) {
  if (data.id !== 'board1') return;

  const key = data.inst;
  removedInstruments.add(key);
  const entry = musicSources[key];
  if (entry) {
    entry.gain.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.4);
    setTimeout(() => {
      entry.source.stop();
      entry.gain.disconnect();
      delete musicSources[key];
    }, 400);
  }
}

function stopMusic() {
  Object.values(musicSources).forEach(({ source, gain }) => {
    gain.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.4);
    setTimeout(() => {
      source.stop();
      gain.disconnect();
    }, 400);
  });
  musicSources = {};
}

function resetRemovedInstruments() {
  removedInstruments.clear();
}

export { startMusic, stopMusic, removeInstrument, resetRemovedInstruments };
