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

export default function run() {
  const data = parseInput();
  const image = buildLayers(data);
  const layer = layerWithLeastZeros(image);

  console.log("image", image);
  console.log("layer", layer);

  return [`Day 1: ${countOnes(layer) * countTwos(layer)}`].join("\n");
}
