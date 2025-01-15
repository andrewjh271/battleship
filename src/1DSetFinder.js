function find1DSets(board, length, exclusionCondition) {
  if (length === 1) return board.emptySquares();
  const sets = [];
  for (let i = 0; i < board.size; i++) {
    const horizontal = [];
    const vertical = [];
    for (let j = 0; j < board.size; j++) {
      horizontal.push([j, i]);
      vertical.push([i, j]);
    }
    sets.push(
      ...findSetsFromLine(horizontal, length, exclusionCondition),
      ...findSetsFromLine(vertical, length, exclusionCondition),
    );
  }
  if (sets.length === 0) throw new Error('No sets found with given parameters');
  return sets;
}

function findSetsFromLine(line, length, exclusionCondition) {
  let lft = 0;
  let rt = 1;
  const sets = [];

  while (rt < line.length) {
    if (exclusionCondition([line[lft]])) {
      lft = rt;
      rt += 1;
    } else if (exclusionCondition([line[rt]])) {
      lft = rt + 1;
      rt += 2;
    } else if (rt - lft + 1 === length) {
      const set = [];
      for (let j = lft; j <= rt; j++) {
        set.push(line[j]);
      }
      sets.push(set);
      lft++;
      rt++;
    } else {
      rt++;
    }
  }
  return sets;
}

export { find1DSets };
