import * as R from "ramda";

const input = "197487-673251";

const toNumbers = n => parseInt(n, 10);

const digitsToPairs = digits =>
  digits.reduce((numbers, number) => {
    if (numbers.length === 0) {
      return [number];
    }
    const last = numbers.pop();

    if (last === number) {
      const joined = Number(last.toString() + number.toString());
      return [...numbers, joined];
    }
    return [...numbers, last, number];
  }, []);

const isIncreasingDigits = digits => {
  if (digits.length === 0) {
    return true;
  }
  const head = R.head(digits);
  const rest = R.tail(digits);
  const nextDigit = R.head(rest);

  if (nextDigit < head) {
    return false;
  }
  return isIncreasingDigits(rest);
};

const isIncreasing = number => {
  const digits = number
    .toString()
    .split("")
    .map(toNumbers);
  return isIncreasingDigits(digits);

  // This is probably faster than the recursive method above:
  // for (var i = 0; i < digits.length - 1; i++) {
  //   if (digits[i] > digits[i + 1]) {
  //     return false;
  //   }
  // }
  // return true;
};

const meetsDoubleRestriction = number => {
  const digits = number
    .toString()
    .split("")
    .map(toNumbers);
  const pairs = digitsToPairs(digits);
  return pairs.length === 3 || pairs.length === 4 || pairs.length === 5;
};

const meetsStricterDoubleRestriction = number => {
  const digits = number
    .toString()
    .split("")
    .map(toNumbers);

  let counter = 1;
  let previous = digits[0];
  for (let i = 1; i < digits.length; i++) {
    const current = digits[i];
    if (current === previous) {
      counter++;
    } else {
      if (counter === 2) {
        return true;
      }
      counter = 1;
    }
    previous = current;
  }
  return counter === 2;
};

export default function run() {
  const [low, high] = input.split("-").map(toNumbers);
  const numbers = R.range(low, high);

  const increasingNumbers = numbers.filter(isIncreasing);
  const matches = increasingNumbers.filter(meetsDoubleRestriction);

  const secondMatches = increasingNumbers.filter(
    meetsStricterDoubleRestriction
  );

  return [`Part 1: ${matches.length}`, `Part 2: ${secondMatches.length}`].join(
    "\n"
  );
}
