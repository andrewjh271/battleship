let currentAudio;
const audioButton = document.querySelector('.inst-sample');
const audioButtonIcon = audioButton.querySelector('span');

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
  currentAudio.play().catch((error) => {
    console.error('Error playing audio:', error);
  });
  audioButtonIcon.textContent = 'stop_circle';
  currentAudio.addEventListener('ended', () => {
    audioButtonIcon.textContent = 'music_note';
  });
}

function stopAudio() {
  if (currentAudio) {
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
