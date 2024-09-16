function find1DSets(board, length) {
  if (length === 1) return board.emptySquares();
  let sets = [];
  for (let i = 0; i < board.size; i++) {
    const horizontal = [];
    const vertical = [];
    for (let j = 0; j < board.size; j++) {
      horizontal.push([j, i]);
      vertical.push([i, j]);
    }
    sets = [
      ...sets,
      ...findSetsFromRow(horizontal, length, board),
      ...findSetsFromRow(vertical, length, board),
    ];
  }
  return sets;
}

function findSetsFromRow(row, length, board) {
  let lft = 0;
  let rt = 1;
  const sets = [];

  while (rt < row.length) {
    if (board.isOccupied([row[lft][0], row[lft][1]])) {
      lft = rt;
      rt += 1;
    } else if (board.isOccupied([row[rt][0], row[rt][1]])) {
      lft = rt + 1;
      rt += 2;
    } else if (rt - lft + 1 === length) {
      const set = [];
      for (let j = lft; j <= rt; j++) {
        set.push(row[j]);
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

export { find1DSets }