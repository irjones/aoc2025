const inputText = require('fs').readFileSync('./input.txt').toString();

const table = rotate(inputText.split('\n').filter(l => !!l).map((line) => line.split(/\s+/).filter(s => !!s)));

let total = 0;
for (const row of table) {
    const opSymbol = row.pop();
    const { initializer, operator } = {
        '*': { operator: (acc, next) => acc * parseInt(next), initializer: 1 },
        '+': { operator: (acc, next) => acc + parseInt(next), initializer: 0 }
    }[opSymbol];
    total += row.reduce(operator, initializer);
}

console.log({
    partOne: total,
    partTwo: "Need to re-work to read input as right-to-left columns. Reduction logic can stay, rotation is now superfluous"
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