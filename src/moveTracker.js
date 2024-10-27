export function moveTrackerFactory(id) {
  const tracker = document.getElementById(id);
  tracker.moves = [];

  let current = 0;

  function hide() {
    tracker.classList.add('hidden');
  }

  function show() {
    tracker.classList.remove('hidden');
    tracker.moves.forEach(move => {
      move.classList.remove('moved');
    });
    current = 0;
  }

  function reset(n) {
    current = 0;
    tracker.innerHTML = '';
    tracker.moves = [];
    for(let i = 0; i < n; i++) {
      const move = document.createElement('span');
      move.classList.add('move');
      tracker.moves[i] = move;
      tracker.appendChild(move);
    }
  }

  function increment() {
    tracker.moves[current].classList.add('moved');
    current++;
  }


  return {
    hide,
    show,
    reset,
    increment
  }
}