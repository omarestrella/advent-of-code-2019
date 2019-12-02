import input from "./inputs/1.txt";

function reducer(sum, number) {
  const result = Math.floor(number / 3) - 2;
  if (result <= 0) {
    return sum;
  }
  return reducer(sum + result, result);
}

export default async function run() {
  const masses = input
    .split("\n")
    .map(mass => parseInt(mass, 10))
    .filter(mass => !isNaN(mass));

  const part1 = masses
    .map(mass => Math.floor(mass / 3) - 2)
    .reduce((acc, num) => (isNaN(num) ? acc : acc + num));

  const part2 = masses
    .map(mass => reducer(0, mass))
    .reduce((acc, num) => (isNaN(num) ? acc : acc + num));

  return [part1, part2].join("\n");
}
