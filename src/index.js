import "./css/style.less";

import day1 from "./days/1";
import day2 from "./days/2";
import day3 from "./days/3";
import day4 from "./days/4";
import day5 from "./days/5";

function getSolution(day) {
  switch (day) {
    case 1:
      return day1();
    case 2:
      return day2();
    case 3:
      return day3();
    case 4:
      return day4();
    case 5:
      return day5();
    default:
      return "shrug...";
  }
}

async function run(day) {
  const result = await getSolution(day);
  const output = document.querySelector(".output");
  output.innerHTML = result.replace("\n", "<br />");
}

function setupButtons() {
  const days = [1, 2, 3, 4, 5];
  days.forEach(day => {
    const button = document.createElement("button");
    button.innerHTML = `Day ${day}`;
    button.onclick = () => run(day);

    const solutions = document.querySelector(".solutions");
    solutions.append(button);
    solutions.append(document.createElement("br"));
  });
}

setupButtons();
