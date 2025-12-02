const testdata = `L68
L30
R48
L5
R60
L55
L1
L99
R14
L82`;
const real = require('fs').readFileSync('./aoc_day1.txt').toString();

const turns = real.split('\n').filter(l => !!l).map(t => t.split(''));

let currentDialPosition = 50;
const dial = new Dial(currentDialPosition);

for (const turn of turns) {
    dial.turn(turn);
}

console.log({
  label: 'day1',
  ...dial.getZeroCount(),
});

function Dial(initial = 0) {
    const self = this;

    self._endZeroCount = 0;
    self._zeroCount = 0;
    self._position = initial;
    self._left = function() {
        if (self._position - 1 === -1) {
            self._position = 99;
        } else {
            self._position -= 1;
        }
    }
    self._right = function() {
        if (self._position + 1 === 100) {
            self._position = 0;
        } else {
            self._position += 1;
        }
    }
    self._times = function(task, iterations, afterEach, afterAll) {
        for (let i = 0; i < iterations; i += 1) {
            task();
            afterEach();
        }
        afterAll();
    }

    self.turn = function(cmd) {
        const direction = cmd.shift();
        const amount = parseInt(cmd.join(''));

        const afterEach = () => {
            if (self._position === 0) self._zeroCount += 1;
        }

        const afterAll = () => {
            if (self._position === 0) self._endZeroCount += 1;
        }

        if (direction === 'L') {
            self._times(self._left, amount, afterEach, afterAll);
        } else {
            self._times(self._right, amount, afterEach, afterAll);
        }
    }

    self.getZeroCount = function() {
        return { endZeros: self._endZeroCount, allZeros: self._zeroCount };
    }
}