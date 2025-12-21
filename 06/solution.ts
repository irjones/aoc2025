// NOTE: run with the --experimental-strip-types option

const inputText = require('fs').readFileSync('./input.txt').toString();

function partOne(text) {
    const table = rotate(
        text.split('\n')
            .filter(l => !!l)
            .map((line) => line.split(/\s+/).filter(s => !!s))
    );
    let total = 0;
    for (const row of table) {
        const opSymbol = row.pop();
        const { initializer, operator } = {
            '*': { operator: (acc, next) => acc * parseInt(next), initializer: 1 },
            '+': { operator: (acc, next) => acc + parseInt(next), initializer: 0 }
        }[opSymbol];
        total += row.reduce(operator, initializer);
    }
    return total;
}

function partTwo(text: string) {
    const grid: string[][] = rotate(text.split('\n').filter(l => !!l).map((line) => line.split('')));
    const queue = grid.reduce((acc, next) => acc.concat(next), []);
    const groups = [];
    let currentGroup = [];
    let currentNumber = [];

    while (queue.length) {
        const next = queue.shift();
        // filter out the spaces, use to end numbers
        if (next === ' ') {
            if (currentNumber.length) {
                currentGroup.push(currentNumber);
                currentNumber = [];
            }
            continue;
        }
        // if operator, put at beginning of series and log the group
        if (next === '+' || next === '*') {
            if (currentNumber.length) currentGroup.push(currentNumber);
            currentNumber = [];
            currentGroup.unshift(next);
            groups.push(currentGroup);
            currentGroup = [];
            continue;
        }

        currentNumber.push(next);
    }
    let total = 0;
    const toSum = (acc, next) => acc + next;
    const toProduct = (acc, next) => acc * next;

    for (const group of groups) {
        const operator = {
            '+': toSum,
            '*': toProduct
        }[group.shift()];

        total += group.map((g) => parseInt(g.join(''))).reduce(operator);
    }

    return total;
}

console.log({
    partOne: partOne(inputText),
    partTwo: partTwo(inputText),
})

/**
 * Assumes non-square table
 * @param table
 * @returns the table rotated counter-clockwise 90º
 */
function rotate(table) {
    const rowCount = table.length;
    const colCount = table[0].length;
    // new all-nulls table with length of row length on original
    const rotated = Array.from({ length: colCount }, () => Array.from({ length: rowCount }, () => null));

    for (let i = 0; i < rowCount; i += 1) {
        for (let j = 0; j < colCount; j += 1) {
            const row = colCount - 1 - j;
            const col = i;

            rotated[row][col] = table[i][j];
        }
    }

    return rotated;
}