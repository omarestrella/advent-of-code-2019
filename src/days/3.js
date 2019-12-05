import input from "./inputs/3.txt";
import { head, tail, last, subtract, add, map, prop } from "ramda";

// eslint-disable-next-line no-unused-vars
const testInput1 = [
  ["R8", "U5", "L5", "D3"],
  ["U7", "R6", "D4", "L4"]
];
// eslint-disable-next-line no-unused-vars
const testInput2 = [
  ["R75", "D30", "R83", "U83", "L12", "D49", "R71", "U7", "L72"],
  ["U62", "R66", "U55", "R34", "D71", "R55", "D58", "R83"]
];

function getWires() {
  return input.split("\n").map(str => str.split(","));
}

function wireToCoords(coordinates, path) {
  if (path.length < 1) {
    return coordinates;
  }
  const [movement, restOfPath] = [head(path), tail(path)];
  let lastCoordinate = last(coordinates);

  if (!lastCoordinate) {
    lastCoordinate = {
      point: [0, 0],
      previousPoint: [0, 0],
      allPoints: []
    };
  }

  let [x, y] = lastCoordinate.point;
  let [direction, amount] = [head(movement), parseInt(tail(movement), 10)];

  let operation = add;
  if (direction === "D" || direction === "L") {
    amount = amount * -1;
    operation = subtract;
  }

  let allPoints = [];
  let total = Math.abs(amount);
  if (direction === "D" || direction === "U") {
    for (let i = 0; i < total; i++) {
      let y2 = operation(y, i);
      if (y2 !== 0 && x !== 0) {
        allPoints.push([x, y2].toString());
      }
    }
    y = y + amount;
  } else {
    for (let i = 0; i <= total; i++) {
      let x2 = operation(x, i);
      if (x2 !== 0 && y !== 0) {
        allPoints.push([x2, y].toString());
      }
    }
    x = x + amount;
  }

  return wireToCoords(
    [
      ...coordinates,
      {
        allPoints,
        point: [x, y],
        previousPoint: lastCoordinate.point
      }
    ],
    restOfPath
  );
}

export default function run() {
  const [firstWire, secondWire] = getWires();
  const firstWireCoords = wireToCoords([], firstWire);
  const secondWireCoords = wireToCoords([], secondWire);

  const allPoints = prop("allPoints");
  const firstWirePoints = map(allPoints, firstWireCoords).flat();
  const secondWirePoints = map(allPoints, secondWireCoords).flat();
  const secondWireSet = new Set(secondWirePoints);
  const intersection = new Set(
    firstWirePoints.filter(x => secondWireSet.has(x))
  );

  const distances = [...intersection]
    .map(str => {
      let [x, y] = str.split(",");
      return Math.abs(0 - x) + Math.abs(0 - y);
    })
    .sort((a, b) => a - b);

  return distances[0];
}
