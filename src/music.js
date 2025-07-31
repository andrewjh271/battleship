/* eslint-disable no-param-reassign */
import { getEnsemble, getEnsembleName } from './ensemble';

const musicToggle = document.querySelector('input[name="music-toggle"]');
const ENSEMBLES_WITH_PERCUSSION = ['brass', 'strings', 'chamber'];
const boardSetupContainer = document.querySelector('.board-setup-container');

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
  // only start/stop music if in gameplay mode
  if (!boardSetupContainer.classList.contains('hidden')) return;

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
  path = `./audio/Music/${getEnsembleName()}`;
}

function setInstruments() {
  instruments = Object.keys(getEnsemble());

  if (ENSEMBLES_WITH_PERCUSSION.includes(getEnsembleName())) {
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
    const fadeTime = 0.4;
    const stopAt = audioContext.currentTime + fadeTime;
    entry.gain.gain.linearRampToValueAtTime(0.0001, stopAt);
    entry.source.stop(stopAt);
    entry.source.onended = () => {
      entry.gain.disconnect();
      delete musicSources[key];
    };
  }
}

function stopMusic() {
  Object.values(musicSources).forEach(({ source, gain }) => {
    const fadeTime = .5;
    const stopAt = audioContext.currentTime + fadeTime;
    gain.gain.linearRampToValueAtTime(0.0001, stopAt);
    source.stop(stopAt);
    source.onended = () => {
      gain.disconnect();
    };
  });
  musicSources = {};
}

function resetRemovedInstruments() {
  removedInstruments.clear();
}

export { startMusic, stopMusic, removeInstrument, resetRemovedInstruments };
