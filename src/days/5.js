import input from "./inputs/5.txt";
import * as R from "ramda";
import { Computer } from "../intcode";

function getList() {
  return input.split(",").map(n => parseInt(n, 10));
}

export default function run() {
  const instructions = getList();
  const computer1 = new Computer([...instructions], 1);
  computer1.run();

  const computer2 = new Computer(instructions, 5);
  computer2.run();

  return [R.last(computer1.output), R.last(computer2.output)].join("\n");
}
