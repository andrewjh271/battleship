function find2DSets(board, width, height) {
  let sets = [];
  for (let i = 0; i <= board.size - width; i++) {
    const horizontal = [];
    const vertical = [];
    for (let j = 0; j < board.size; j++) {
      horizontal.push(createXComponent(j, i, width));
      if (width !== height) vertical.push(createYComponent(j, i, width));
    }
    const rotated = width === height ? [] : findSetsFrom2DRow(vertical, height, board);
    sets = [...sets, ...findSetsFrom2DRow(horizontal, height, board), ...rotated];
  }
  if (sets.length === 0) throw new Error('No sets found with given parameters')
  return sets;
}

function createXComponent(fixed, variable, length) {
  const component = [];
  for (let idx = 0; idx < length; idx++) {
    component.push([fixed, variable + idx]);
  }
  return component;
}

function createYComponent(fixed, variable, length) {
  const component = [];
  for (let idx = 0; idx < length; idx++) {
    component.push([variable + idx, fixed]);
  }
  return component;
}

function findSetsFrom2DRow(row, length, board) {
  const sets = [];
  for (let i = 0; i <= row.length - length; i++) {
    const candidateSet = row.slice(i, i + length).flat();
    if (!board.isOccupied(candidateSet)) {
      sets.push(candidateSet);
    }
  }
  return sets;
}

export { find2DSets };
