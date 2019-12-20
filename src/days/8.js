import input from "./inputs/8.txt";
import * as R from "ramda";

const WIDTH = 25;
const HEIGHT = 6;

function parseInput() {
  return input
    .split("")
    .map(num => parseInt(num, 10))
    .filter(num => !isNaN(num));
}

function buildLayer(chunk) {
  const image = [];
  let pointer = 0;
  for (let i = 0; i < HEIGHT; i++) {
    const layer = [];
    for (let j = 0; j < WIDTH; j++) {
      layer.push(chunk[pointer]);
      pointer += 1;
    }
    image.push(layer);
  }
  return image;
}

function buildLayers(data) {
  const chunks = R.splitEvery(WIDTH * HEIGHT, data);
  return chunks.map(buildLayer);
}

function countZeros(layer) {
  return R.flatten(layer).filter(n => n === 0).length;
}

function countOnes(layer) {
  return R.flatten(layer).filter(n => n === 1).length;
}

function countTwos(layer) {
  return R.flatten(layer).filter(n => n === 2).length;
}

function layerWithLeastZeros(image) {
  let layer;
  image.forEach(l => {
    if (!layer || countZeros(l) < countZeros(layer)) {
      layer = l;
    }
  });
  return layer;
}

function getStacks(layers) {
  const stacks = [];
  for (let i = 0; i < layers.length; i++) {
    const layer = layers[i];
    for (let j = 0; j < HEIGHT; j++) {
      const layerRow = layer[j];
      for (let k = 0; k < WIDTH; k++) {
        if (!stacks[j]) {
          stacks[j] = [];
        }
        if (!stacks[j][k]) {
          stacks[j][k] = [];
        }
        stacks[j][k].push(layerRow[k]);
      }
    }
  }
  return stacks;
}

function joinLayers(layers) {
  const stacks = getStacks(layers);
  const image = [];
  for (let i = 0; i < stacks.length; i++) {
    const stack = stacks[i];
    const row = [];
    for (let j = 0; j < stack.length; j++) {
      const positionData = stack[j];
      const value = R.find(v => v === 1 || v === 0, positionData);
      row.push(value);
    }

    image.push(row);
  }
  return image;
}

export default function run() {
  const data = parseInput();
  const layers = buildLayers(data);
  const layer = layerWithLeastZeros(layers);
  const image = joinLayers(layers);

  const imageString = image
    .map(row => row.map(value => (value === 0 ? "⬜️" : "⬛️")).join(""))
    .join("\n");

  return [
    `Day 1: ${countOnes(layer) * countTwos(layer)}`,
    "Day 2:",
    imageString
  ].join("\n");
}
