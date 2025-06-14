let currentAudio;
let progressRAF;
const audioButton = document.querySelector('.inst-sample');
const audioButtonIcon = audioButton.querySelector('span');
const boardSetup = document.querySelector('.board-setup-container');

audioButton.addEventListener('click', handleAudio);

function disableAudioButton() {
  if (!currentAudio || currentAudio.paused) {
    audioButton.disabled = true;
    audioButton.removeAttribute('data-inst');
  } else {
    currentAudio.addEventListener('ended', () => {
      audioButton.disabled = true;
      audioButton.removeAttribute('data-inst');
    });
  }
}

function enableAudioButton() {
  audioButton.disabled = false;
}

function setAudio(inst) {
  audioButton.setAttribute('data-inst', inst);
}

function handleAudio() {
  if (audioButtonIcon.textContent === 'music_note') {
    playAudio();
  } else {
    stopAudio();
  }
}

function playAudio() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }
  const inst = audioButton.getAttribute('data-inst');
  if (!inst) {
    console.warn('No instrument selected for audio playback.');
    return;
  }
  currentAudio = new Audio(`./audio/${inst}.mp3`);

  boardSetup.style.setProperty('--audio-progress', '0%');
  boardSetup.style.setProperty('--audio-progress-opacity', '1');

  function updateProgressBar() {
    if (currentAudio.duration) {
      const percent = (currentAudio.currentTime / currentAudio.duration) * 100;
      boardSetup.style.setProperty('--audio-progress', `${percent}%`);
    }
    progressRAF = requestAnimationFrame(updateProgressBar);
  }

  progressRAF = requestAnimationFrame(updateProgressBar);

  currentAudio.addEventListener('pause', () => {
    cancelAnimationFrame(progressRAF);
  });

  currentAudio.addEventListener('ended', () => {
    cancelAnimationFrame(progressRAF);
    audioButtonIcon.textContent = 'music_note';
    setTimeout(() => boardSetup.style.setProperty('--audio-progress-opacity', '0'), 800);
    setTimeout(() => boardSetup.style.setProperty('--audio-progress', '0%'), 1200);
  });

  currentAudio.play().catch((error) => {
    console.error('Error playing audio:', error);
    boardSetup.style.setProperty('--audio-progress-opacity', '0');
    boardSetup.style.setProperty('--audio-progress', '0%');
  });
  audioButtonIcon.textContent = 'stop_circle';
}

function stopAudio() {
  if (currentAudio) {
    boardSetup.style.setProperty('--audio-progress-opacity', '0');
    boardSetup.style.setProperty('--audio-progress', '0%');
    cancelAnimationFrame(progressRAF);
    // Smoother fade out
    const fadeStep = 0.008;
    const fadeInterval = 1;
    const fadeOut = setInterval(() => {
      if (currentAudio.volume > fadeStep) {
        currentAudio.volume = Math.max(0, currentAudio.volume - fadeStep);
      } else {
        clearInterval(fadeOut);
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio.volume = 1.0; // Reset for next play
        audioButtonIcon.textContent = 'music_note';
      }
    }, fadeInterval);
  }
}

export { disableAudioButton, enableAudioButton, setAudio };
