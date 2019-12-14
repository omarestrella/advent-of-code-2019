import input from "./inputs/5.txt";
import { Computer } from "../intcode";

function getList() {
  return input.split(",").map(n => parseInt(n, 10));
}

export default function run() {
  const computer = new Computer(getList());
  computer.run();
  console.log(computer.output);
  return "...";
}
