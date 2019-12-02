import "./css/style.less";

import day1 from "./days/1";

function getSolution(day) {
  switch (day) {
    case 1:
      return day1();
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
