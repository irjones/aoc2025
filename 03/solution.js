const data = require('fs').readFileSync('./input.txt').toString().split('\n').filter(line => !!line);

function joltageFrom(digits, k) {
    const n = digits.length;

    let removals = n - k;
    const stack = [];
    const remove = () => {
        stack.pop();
        removals -= 1;
    }
    const last = () => stack[stack.length - 1];

    for (const digit of digits.split('')) {
        while (stack.length && removals > 0 && last() < digit) {
            remove();
        }
        stack.push(digit);
    }

    while (removals > 0) {
        remove();
    }
    return parseInt(stack.slice(0, k).join(''));
}

function getHighestJoltage(str) {
  const digits = str.split('').map(d => parseInt(d));
  let highest = digits[0];
  let highestIndex = 0;
  let nextHighest = digits[digits.length - 1];
  let nextHighestIndex = digits.length - 1;

  // assumes highest is first number and lowest is last number
  for (let i = highestIndex; i < digits.length - 1; i += 1) {
      if (digits[i] > highest) {
          highest = digits[i];
          highestIndex = i;
      }
      if (highest === 9) break;
  }
  for (let j = nextHighestIndex; j > highestIndex; j -= 1) {
      if (digits[j] > nextHighest) {
          nextHighest = digits[j];
          nextHighestIndex = j;
      }
      if (nextHighest === 9) break;
  }
  
  return parseInt(`${highest}${nextHighest}`);
}

console.log({
    partOne: data.map(getHighestJoltage).reduce((acc, next) => acc + next),
    partTwo: data.map((d) => joltageFrom(d, 12)).reduce((acc, next) => acc + next),
});
