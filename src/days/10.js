import input from "./inputs/10.txt";
import * as R from "ramda";

// eslint-disable-next-line no-unused-vars
const TEST_INPUT = `.#..#..###
####.###.#
....###.#.
..###.##.#
##.##.#.#.
....###..#
..#.#..#.#
#..#.#.###
.##...##.#
.....#.#..`;

function parseInput(inp) {
  return inp.split("\n").map(row => row.split(""));
}

function getAsteroids(data) {
  return data
    .map((row, y) =>
      row.map((v, x) => (v === "#" ? { x, y } : null)).filter(v => !!v)
    )
    .flat();
}

function angleToAsteroid(ast1, ast2) {
  const x = ast2.x - ast1.x;
  const y = ast2.y - ast1.y;
  return Math.atan2(y, x) + Math.PI / 2;
}

function asteroidCounts(asteroids) {
  const counts = [];
  asteroids.forEach(asteroid => {
    const data = asteroids.reduce(
      (data, otherAsteroid) => {
        if (otherAsteroid.x === asteroid.x && otherAsteroid.y === asteroid.y) {
          return data;
        }
        const angle = angleToAsteroid(asteroid, otherAsteroid);
        if (data.anglesSeen.indexOf(angle) === -1) {
          data.count += 1;
          data.anglesSeen.push(angle);
        }
        return data;
      },
      { count: 0, anglesSeen: [], asteroid }
    );
    counts.push(data);
  });
  return counts;
}

function maxCountData(counts) {
  const first = R.head(counts);
  const rest = R.tail(counts);
  return rest.reduce((current, next) => {
    if (current.count > next.count) {
      return current;
    } else {
      return next;
    }
  }, first);
}

export default function run() {
  const data = parseInput(input);
  const asteroids = getAsteroids(data);
  const counts = asteroidCounts(asteroids);
  const max = maxCountData(counts);
  return [`Part 1: ${max.count}`].join("\n");
}
