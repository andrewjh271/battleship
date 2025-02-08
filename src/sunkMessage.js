export default function message(player, inst) {
  return `${player}'s ${instName(inst)} ${verb(inst)} been sunk!`;
}

function instName(inst) {
  switch (inst) {
    case 'bass':
      return 'double bass';
    case 'bassdrum':
      return 'bass drum';
    case 'horn':
      return 'french horn';
    case 'snare':
      return 'snare drum';
    default:
      return inst;
  }
}

function verb(inst) {
  return inst === 'cymbals' ? 'have' : 'has';
}
