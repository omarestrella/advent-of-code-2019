import { last, slice } from "ramda";
import input from "./inputs/2.txt";

function getList() {
  return input.split(",").map(n => parseInt(n, 10));
}

function processList(list, pointer) {
  if (pointer > list.length) {
    return list;
  }
  const program = slice(pointer, pointer + 4, list);
  if (program.length < 4) {
    return list;
  }
  const [opcode, pos1, pos2, location] = program;
  if (opcode === 1) {
    list[location] = list[pos1] + list[pos2];
    return processList(list, pointer + 4);
  } else if (opcode === 2) {
    list[location] = list[pos1] * list[pos2];
    return processList(list, pointer + 4);
  } else if (opcode === 99) {
    return list;
  } else {
    throw new Error(list);
  }
}

function findInputs() {
  for (let i = 1; i <= 99; i++) {
    for (let j = 1; j <= 99; j++) {
      const list = getList();
      list[1] = i;
      list[2] = j;
      const result = processList(list, 0);
      if (result[0] === 19690720) {
        return [i, j];
      }
    }
  }
  return [0, 0];
}

export default function run() {
  const list = getList();

  list[1] = 12;
  list[2] = 2;
  const part1 = processList(list, 0);

  const [noun, verb] = findInputs();

  return [part1[0], 100 * noun + verb].join("\n");
}
