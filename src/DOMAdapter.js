function getShipData(DOMboard) {
  const result = Array.from(DOMboard.children)
    .filter((element) => element.classList.contains('placed-img-wrapper'))
    .map((element) => {
      const [rowStart, colStart, rowSpan, colSpan] = element.style.gridArea
        .match(/\d+/g)
        .map(Number);
      const yStart = rowStart - 1;
      const yEnd = yStart + rowSpan - 1;
      const xStart = colStart - 1;
      const xEnd = xStart + colSpan - 1;
      const name = element.firstChild.type;
      const object = {};
      object[name] = getCoordinates(xStart, xEnd, yStart, yEnd);
      return object;
    })
    .reduce((object, entry) => ({ ...object, ...entry }), {});

  // console.log(result);
  return result;
}

function getCoordinates(xStart, xEnd, yStart, yEnd) {
  const set = [];
  for (let x = xStart; x <= xEnd; x++) {
    for (let y = yStart; y <= yEnd; y++) {
      set.push([x, y]);
    }
  }
  return set;
}

export { getShipData };
