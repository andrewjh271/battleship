import { on } from './observer';

const soundToggle = document.querySelector('input[name="sound-toggle"]');

on('hit', playHit);
on('miss', playMiss);
on('sunk', playExplosion);

function playHit() {
  if (!soundToggle.checked) return;

  const audio = new Audio('./audio/Sound Effects/hit1.mp3');
  audio.play();
}

function playMiss() {
  if (!soundToggle.checked) return;

  const audio = new Audio('./audio/Sound Effects/miss.mp3');
  audio.play();
}

function playExplosion() {
  if (!soundToggle.checked) return;

  const randomIndex = Math.floor(Math.random() * 4) + 1;
  const audio = new Audio(`./audio/Sound Effects/explosion${randomIndex}.mp3`);
  audio.play();
}
