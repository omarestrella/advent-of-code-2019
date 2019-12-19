import input from "./inputs/6.txt";

// eslint-disable-next-line no-unused-vars
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
K)L
K)YOU
I)SAN`;

function parseInput(str) {
  return str.split("\n").map(pair => pair.trim().split(")"));
}

function makePlanet(name, parent) {
  return {
    name,
    parent,
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

function countToRoot(head, name, count = 0) {
  if (!head) {
    return null;
  }

  if (head.name === name) {
    return count;
  }

  const first = countToRoot(head.orbits[0], name, count + 1);
  if (first) {
    return first;
  }

  return countToRoot(head.orbits[1], name, count + 1);
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
          orbits: [],
          parent: head
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
    planet.orbits.push(makePlanet(orbit, planet));

    buildPlanets(nodes, head, orbit);
  }
  if (second) {
    const [planetName, orbit] = second;
    const planet = findPlanet(head, planetName);
    planet.orbits.push(makePlanet(orbit, planet));

    buildPlanets(nodes, head, orbit);
  }
}

function commonOrbit(head, planetA, planetB) {
  if (!head) {
    return null;
  }
  if (head === planetA || head === planetB) {
    return head;
  }

  const leftRoot = commonOrbit(head.orbits[0], planetA, planetB);
  const rightRoot = commonOrbit(head.orbits[1], planetA, planetB);

  if (leftRoot && rightRoot) {
    return head;
  }

  return leftRoot || rightRoot;
}

function distanceBetween(head, planetAName, planetBName) {
  const planetA = findPlanet(head, planetAName);
  const planetB = findPlanet(head, planetBName);
  const orbit = commonOrbit(head, planetA, planetB);

  const countA = countToRoot(orbit, planetAName);
  const countB = countToRoot(orbit, planetBName);

  return countA + countB - 2;
}

export default function run() {
  // const data = parseInput(TEST_INPUT);
  const data = parseInput(input);
  const head = buildPlanets(data);

  const count = countOrbits(head) - 1; // Subtract for COM
  const distance = distanceBetween(head.orbits[0], "YOU", "SAN");

  return [`Part 1: ${count}`, `Part 2: ${distance}`].join("\n");
}
