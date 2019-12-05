import "./css/style.less";

import day1 from "./days/1";
import day2 from "./days/2";
import day3 from "./days/3";

function getSolution(day) {
  switch (day) {
    case 1:
      return day1();
    case 2:
      return day2();
    case 3:
      return day3();
    default:
      return "shrug...";
  }
}

async function run(day) {
  const result = await getSolution(day);
  const output = document.querySelector(".output");
  output.innerHTML = result;
}

window.run = run;
