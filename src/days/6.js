import input from "./inputs/6.txt";
import * as R from "ramda";

const TEST_INPUT = `COM)B
B)C
C)D
D)E
E)F
B)G
G)H
D)I
E)J
J)K
K)L`;

function parseInput(str) {
  return str.split("\n").map(pair => pair.trim().split(")"));
}

function makePlanet(name) {
  return {
    name,
    orbits: []
  };
}

function findPlanet(head, name) {
  if (!head) {
    return null;
  }

  if (head.name === name) {
    return head;
  }

  return findPlanet(head.orbits[0], name) || findPlanet(head.orbits[1], name);
}

function countOrbits(head, seen = 0) {
  if (!head) {
    return 0;
  }

  return (
    1 +
    seen * head.orbits.length +
    (countOrbits(head.orbits[0], seen + 1) +
      countOrbits(head.orbits[1], seen + 1))
  );
}

function findOrbitNodes(nodes, find) {
  return nodes.filter(([name]) => name === find);
}

function buildPlanets(nodes, head = {}, nodeToFind = "COM") {
  if (nodeToFind === "COM") {
    const [, orbit] = findOrbitNodes(nodes, "COM")[0];
    head = {
      name: "COM",
      orbits: [
        {
          name: orbit,
          orbits: []
        }
      ]
    };
    buildPlanets(nodes, head, orbit);
    return head;
  }

  const data = findOrbitNodes(nodes, nodeToFind);
  if (!data) {
    return head;
  }
  const [first, second] = data;
  if (first) {
    const [planetName, orbit] = first;
    const planet = findPlanet(head, planetName);
    planet.orbits.push(makePlanet(orbit));

    buildPlanets(nodes, head, orbit);
  }
  if (second) {
    const [planetName, orbit] = second;
    const planet = findPlanet(head, planetName);
    planet.orbits.push(makePlanet(orbit));

    buildPlanets(nodes, head, orbit);
  }
}

export default function run() {
  // const data = parseInput(TEST_INPUT);
  const data = parseInput(input);
  const tree = buildPlanets(data);
  const count = countOrbits(tree) - 1; // Subtract for COM

  return [`Day 1: ${count}`].join("\n");
}
