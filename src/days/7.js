import input from "./inputs/7.txt";
import permute from "../permute";
import { Computer } from "../intcode";
import * as R from "ramda";

const TEST_INPUT =
  "3,31,3,32,1002,32,10,32,1001,31,-2,31,1007,31,0,33,1002,33,7,33,1,33,31,31,1,32,31,31,4,31,99,0,0,0";

function getInstructions(inp) {
  return inp
    .split(",")
    .map(n => parseInt(n, 10))
    .filter(n => !isNaN(n));
}

function testPhaseSetting(instructions, phaseSettings) {
  const rest = R.tail(phaseSettings);
  const firstComputer = new Computer(instructions, 0, phaseSettings[0]);
  firstComputer.run();
  const res = rest.reduce(
    (computers, phaseSetting) => {
      const lastComputer = R.last(computers);
      const output = lastComputer.getOutput();
      const nextComputer = new Computer(instructions, output, phaseSetting);
      nextComputer.run();
      return R.append(nextComputer, computers);
    },
    [firstComputer]
  );
  return res.map(computer => computer.getOutput());
}

export default function run() {
  const phaseSettingsList = permute([0, 1, 2, 3, 4]);
  const instructions = getInstructions(input);
  const phaseSettingsResults = phaseSettingsList
    .reduce((coll, phaseSettings) => {
      coll.push(testPhaseSetting(instructions, phaseSettings));
      return coll;
    })
    .flat()
    .filter(x => !!x);
  const sort = R.sort((a, b) => (a === b ? 0 : a > b ? 1 : -1));
  return [`Day 1: ${R.last(sort(phaseSettingsResults))}`].join("\n");
}
