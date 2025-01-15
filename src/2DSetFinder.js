function find2DSets(board, width, height, exclusionCondition) {
  const sets = [];
  for (let i = 0; i <= board.size - width; i++) {
    const rows = [];
    const columns = [];
    for (let j = 0; j < board.size; j++) {
      rows.push(createXComponent(j, i, width));
      if (width !== height) columns.push(createYComponent(j, i, width));
    }
    sets.push(
      ...findSetsFromComponents(rows, height, exclusionCondition),
      ...findSetsFromComponents(columns, height, exclusionCondition) // empty array if width === height
    );
  }
  if (sets.length === 0) throw new Error('No sets found with given parameters');
  return sets;
}

function createXComponent(fixed, variable, length) {
  const component = [];
  for (let idx = 0; idx < length; idx++) {
    component.push([variable + idx, fixed]);
  }
  return component;
}

function createYComponent(fixed, variable, length) {
  const component = [];
  for (let idx = 0; idx < length; idx++) {
    component.push([fixed, variable + idx]);
  }
  return component;
}

function findSetsFromComponents(components, length, exclusionCondition) {
  const sets = [];
  for (let i = 0; i <= components.length - length; i++) {
    const candidateSet = components.slice(i, i + length).flat();
    if (!exclusionCondition(candidateSet)) {
      sets.push(candidateSet);
    }
  }
  return sets;
}

export { find2DSets };
