import boardFactory from '../src/board';

describe('resolve', () => {
  test('marks sunk squares if able to deduce them in a simple context', () => {
    const id = 1;
    const board = boardFactory(id);

    board.placeShip(
      [
        [2, 3],
        [3, 3],
        [4, 3],
        [5, 3],
        [6, 3],
        [2, 4],
        [3, 4],
        [4, 4],
        [5, 4],
        [6, 4],
      ],
      'cello'
    );

    board.placeShip(
      [
        [4, 2],
        [5, 2],
        [6, 2],
      ],
      'violin'
    );

    board.receiveAttack({ id, coords: [4, 2] });
    board.receiveAttack({ id, coords: [2, 3] });
    board.receiveAttack({ id, coords: [3, 3] });
    board.receiveAttack({ id, coords: [4, 3] });
    board.receiveAttack({ id, coords: [5, 3] });
    board.receiveAttack({ id, coords: [2, 4] });
    board.receiveAttack({ id, coords: [3, 4] });
    board.receiveAttack({ id, coords: [4, 4] });
    board.receiveAttack({ id, coords: [5, 4] });
    board.receiveAttack({ id, coords: [6, 4] });
    board.receiveAttack({ id, coords: [6, 3] });

    const sunkSet = [
      [2, 3],
      [3, 3],
      [4, 3],
      [5, 3],
      [6, 3],
      [2, 4],
      [3, 4],
      [4, 4],
      [5, 4],
      [6, 4],
    ];

    expect(sunkSet.every((coords) => board.squares[coords[0]][coords[1]].sunk)).toBe(true);
    expect(board.squares[4][2].sunk).toBeFalsy();
    expect(board.squares[4][2].resolved).toBeFalsy();
  });

  test('marks sunk squares if able to deduce them in a complicated context', () => {
    const id = 1;
    const board = boardFactory(id);

    board.placeShip(
      [
        [2, 3],
        [3, 3],
        [4, 3],
        [5, 3],
        [6, 3],
        [2, 4],
        [3, 4],
        [4, 4],
        [5, 4],
        [6, 4],
      ],
      'cello'
    );

    board.placeShip(
      [
        [2, 0],
        [2, 1],
        [2, 2],
      ],
      'violin'
    );

    board.placeShip(
      [
        [3, 2],
        [4, 2],
        [5, 2],
      ],
      'flute'
    );

    board.placeShip(
      [
        [6, 1],
        [7, 1],
        [6, 2],
        [7, 2],
      ],
      'horn'
    );

    board.placeShip(
      [
        [7, 3],
        [8, 3],
      ],
      'piccolo'
    );

    board.placeShip(
      [
        [5, 5],
        [5, 6],
        [5, 7],
      ],
      'clarinet'
    );

    board.placeShip(
      [
        [6, 5],
        [6, 6],
        [6, 7],
      ],
      'trumpet'
    );

    board.receiveAttack({ id, coords: [5, 3] });
    board.receiveAttack({ id, coords: [6, 3] });
    board.receiveAttack({ id, coords: [5, 2] });
    board.receiveAttack({ id, coords: [6, 4] });
    board.receiveAttack({ id, coords: [6, 1] });
    board.receiveAttack({ id, coords: [7, 1] });
    board.receiveAttack({ id, coords: [6, 2] });
    board.receiveAttack({ id, coords: [7, 3] });
    board.receiveAttack({ id, coords: [7, 2] });

    // horn is sunk, but no way to deduce it yet. (however, the square that sank the ship is marked as sunk)
    let unsunkSet = [
      [5, 3],
      [6, 3],
      [5, 2],
      [6, 4],
      [6, 1],
      [7, 1],
      [6, 2],
      [7, 3],
    ];

    expect(unsunkSet.every((coords) => !board.squares[coords[0]][coords[1]].sunk)).toBe(true);
    expect(board.squares[7][2].sunk).toBe(true);
    expect(board.squares[7][2].sunkInstrument).toBe('horn');

    board.receiveAttack({ id, coords: [2, 3] });
    board.receiveAttack({ id, coords: [3, 3] });
    board.receiveAttack({ id, coords: [4, 3] });
    board.receiveAttack({ id, coords: [2, 4] });
    board.receiveAttack({ id, coords: [3, 4] });
    board.receiveAttack({ id, coords: [4, 4] });
    board.receiveAttack({ id, coords: [5, 5] });
    board.receiveAttack({ id, coords: [6, 5] });
    board.receiveAttack({ id, coords: [5, 6] });
    board.receiveAttack({ id, coords: [6, 6] });
    board.receiveAttack({ id, coords: [2, 2] });
    board.receiveAttack({ id, coords: [3, 2] });
    board.receiveAttack({ id, coords: [4, 2] });

    // flute is sunk, but no way to deduce it or any instrument yet

    unsunkSet.push(
      ...[
        [2, 3],
        [3, 3],
        [4, 3],
        [2, 4],
        [3, 4],
        [4, 4],
        [5, 5],
        [6, 5],
        [5, 6],
        [6, 6],
        [2, 2],
        [3, 2],
      ]
    );

    expect(unsunkSet.every((coords) => !board.squares[coords[0]][coords[1]].sunk)).toBe(true);
    expect(board.squares[4][2].sunk).toBe(true);
    expect(board.squares[4][2].sunkInstrument).toBe('flute');

    board.receiveAttack({ id, coords: [5, 4] });

    // cello is sunk, but no way to deduce it or any instrument yet

    expect(unsunkSet.every((coords) => !board.squares[coords[0]][coords[1]].sunk)).toBe(true);
    expect(board.squares[5][4].sunk).toBe(true);
    expect(board.squares[5][4].sunkInstrument).toBe('cello');

    board.receiveAttack({ id, coords: [8, 3] });

    // piccolo is sunk and its squares can be deduced; consequently...
    // horn's squares can be deduced; consequently...
    // cello's squares can be deduced
    // flute still has two possible sets

    const sunkSet = [
      [2, 3], // cello
      [3, 3],
      [4, 3],
      [5, 3],
      [6, 3],
      [2, 4],
      [3, 4],
      [4, 4],
      [5, 4],
      [6, 4],
      [7, 3], // piccolo
      [8, 3],
      [6, 1], // horn
      [7, 1],
      [6, 2],
      [7, 2],
      [4, 2], // flute (only the square that sank it)
    ];

    unsunkSet = [
      [2, 2],
      [3, 2],
      [5, 2],
      [5, 5],
      [5, 6],
      [6, 5],
      [6, 6],
    ];

    expect(sunkSet.every((coords) => board.squares[coords[0]][coords[1]].sunk)).toBe(true);
    expect(board.squares[8][3].sunkInstrument).toBe('piccolo');
    expect(unsunkSet.every((coords) => !board.squares[coords[0]][coords[1]].sunk)).toBe(true);

    board.receiveAttack({ id, coords: [2, 1] });
    board.receiveAttack({ id, coords: [2, 0] });
    sunkSet.push([2, 0]);

    // violin is sunk and its squares can be deduced; consequently...
    // flute's squares can be deduced

    sunkSet.push(
      ...[
        [2, 1],
        [2, 2],
        [3, 2],
        [5, 2],
      ]
    );

    unsunkSet = [
      [5, 5],
      [5, 6],
      [6, 5],
      [6, 6],
    ];

    expect(sunkSet.every((coords) => board.squares[coords[0]][coords[1]].sunk)).toBe(true);
    expect(board.squares[2][0].sunkInstrument).toBe('violin');
    expect(unsunkSet.every((coords) => !board.squares[coords[0]][coords[1]].sunk)).toBe(true);

    board.receiveAttack({ id, coords: [5, 7] });
    sunkSet.push([5, 7]);

    // clarinet is sunk and its squares can be deduced

    sunkSet.push(
      ...[
        [5, 5],
        [5, 6],
      ]
    );

    unsunkSet = [
      [6, 5],
      [6, 6],
    ];

    expect(sunkSet.every((coords) => board.squares[coords[0]][coords[1]].sunk)).toBe(true);
    expect(board.squares[5][7].sunkInstrument).toBe('clarinet');
    expect(unsunkSet.every((coords) => !board.squares[coords[0]][coords[1]].sunk)).toBe(true);
  });

  test('works alongside board.markSunkSquares', () => {
    const id = 1;
    const board = boardFactory(id);

    board.placeShip(
      [
        [1, 1],
        [2, 1],
        [3, 1],
      ],
      'violin'
    );

    board.placeShip(
      [
        [4, 1],
        [5, 1],
        [6, 1],
      ],
      'flute'
    );

    board.placeShip(
      [
        [1, 2],
        [2, 2],
        [1, 3],
        [2, 3],
      ],
      'horn'
    );

    board.placeShip(
      [
        [7, 4],
        [7, 5],
      ],
      'piccolo'
    );

    board.placeShip(
      [
        [6, 2],
        [6, 3],
        [6, 4],
      ],
      'clarinet'
    );

    board.placeShip(
      [
        [1, 4],
        [2, 4],
        [3, 4],
        [4, 4],
      ],
      'bassoon'
    );

    board.receiveAttack({ id, coords: [4, 1] });
    board.receiveAttack({ id, coords: [5, 1] });
    board.receiveAttack({ id, coords: [1, 1] });
    board.receiveAttack({ id, coords: [2, 1] });
    board.receiveAttack({ id, coords: [7, 4] });
    board.receiveAttack({ id, coords: [7, 5] });

    // piccolo is sunk, and its squares can be deduced
    const sunkSet = [
      [7, 4],
      [7, 5]
    ];

    let unsunkSet = [
      [4, 1],
      [5, 1],
      [1, 1],
      [2, 1]
    ]

    expect(unsunkSet.every((coords) => !board.squares[coords[0]][coords[1]].sunk)).toBe(true);
    expect(sunkSet.every((coords) => board.squares[coords[0]][coords[1]].sunk)).toBe(true);
    expect(board.squares[7][5].sunkInstrument).toBe('piccolo');

    board.receiveAttack({ id, coords: [3, 1] });

    // violin is sunk, but its squares cannot be deduced (other than the square that sunk it)

    sunkSet.push([3, 1]);

    expect(unsunkSet.every((coords) => !board.squares[coords[0]][coords[1]].sunk)).toBe(true);
    expect(sunkSet.every((coords) => board.squares[coords[0]][coords[1]].sunk)).toBe(true);
    expect(board.squares[3][1].sunkInstrument).toBe('violin');
    expect(board.hasUnresolvedHits()).toBe(true);

    board.receiveAttack({ id, coords: [6, 1] });


    // flute is sunk; there are no unresolved hits so the simpler board.markSunkSquares() is used

    sunkSet.push(...unsunkSet, [6, 1]);

    expect(sunkSet.every((coords) => board.squares[coords[0]][coords[1]].sunk)).toBe(true);
    expect(board.hasUnresolvedHits()).toBe(false);

    board.receiveAttack({ id, coords: [1, 4] });
    board.receiveAttack({ id, coords: [2, 4] });
    board.receiveAttack({ id, coords: [1, 3] });
    board.receiveAttack({ id, coords: [2, 3] });
    board.receiveAttack({ id, coords: [1, 2] });
    board.receiveAttack({ id, coords: [2, 2] });

    // horn is sunk, and its squares can be deduced

    sunkSet.push([1, 2], [2, 2], [1, 3], [2, 3]);
    unsunkSet = [[1, 4], [2, 4]];

    expect(unsunkSet.every((coords) => !board.squares[coords[0]][coords[1]].sunk)).toBe(true);
    expect(sunkSet.every((coords) => board.squares[coords[0]][coords[1]].sunk)).toBe(true);
    expect(board.squares[2][2].sunkInstrument).toBe('horn');
    expect(board.hasUnresolvedHits()).toBe(true);

    board.receiveAttack({ id, coords: [6, 2] });
    board.receiveAttack({ id, coords: [6, 3] });
    board.receiveAttack({ id, coords: [3, 4] });
    board.receiveAttack({ id, coords: [4, 4] });

    // bassoon is sunk, and its squares can be deduced

    sunkSet.push([1, 4], [2, 4], [3, 4], [4, 4]);
    unsunkSet = [[6, 2], [6, 3]];

    expect(sunkSet.every((coords) => board.squares[coords[0]][coords[1]].sunk)).toBe(true);
    expect(unsunkSet.every((coords) => !board.squares[coords[0]][coords[1]].sunk)).toBe(true);
    expect(board.squares[4][4].sunkInstrument).toBe('bassoon');
    expect(board.hasUnresolvedHits()).toBe(true);

    board.receiveAttack({ id, coords: [6, 4] });

    // clarinet is sunk; there are no unresolved hits so the simpler board.markSunkSquares() is used

    sunkSet.push(...unsunkSet);

    expect(sunkSet.every((coords) => board.squares[coords[0]][coords[1]].sunk)).toBe(true);
    expect(board.hasUnresolvedHits()).toBe(false);
  });
});
