const input = require('fs').readFileSync('./input.txt').toString().split('\n').filter(l => !!l).map(l => l.split(''));

function atOrNull(arr, idx) {
    return arr?.[idx] ?? null;
}

function findAccessibleRolls(plane, adjacencyConstraint) {
    let accessibleRoles = [];
    for (let y = 0; y < plane.length; y += 1) {
        const row = plane[y];
        for (let x = 0; x < row.length; x += 1) {
            if (row[x] !== '@') continue;
            const neighbors = [
                atOrNull(plane[y-1], x-1),
                atOrNull(plane[y-1], x),
                atOrNull(plane[y-1], x + 1),
                atOrNull(row, x-1),
                atOrNull(row, x + 1),
                atOrNull(plane[y + 1], x - 1),
                atOrNull(plane[y + 1], x),
                atOrNull(plane[y + 1], x + 1)
            ];
            const occupiedNeighbors = neighbors.filter((symbol) => symbol === '@');
            if (occupiedNeighbors.length < adjacencyConstraint) {
                accessibleRoles.push({ y, x });
            }
        }
    }
    return accessibleRoles.length;
}

function findAndRemoveAccessibleRoll(plane, adjacencyConstraint = 4) {
    const modifiedPlane = [];
    let removedRolls = 0;
    for (let y = 0; y < plane.length; y += 1) {
        const row = plane[y];
        modifiedPlane.push([]);
        for (let x = 0; x < row.length; x += 1) {
            modifiedPlane[y].push(row[x]);
            if (row[x] !== '@') continue;
            const neighbors = [
                atOrNull(plane[y-1], x-1),
                atOrNull(plane[y-1], x),
                atOrNull(plane[y-1], x + 1),
                atOrNull(row, x-1),
                atOrNull(row, x + 1),
                atOrNull(plane[y + 1], x - 1),
                atOrNull(plane[y + 1], x),
                atOrNull(plane[y + 1], x + 1)
            ];
            const occupiedNeighbors = neighbors.filter((symbol) => symbol === '@');
            if (occupiedNeighbors.length < adjacencyConstraint) {
                removedRolls += 1;
                modifiedPlane[y][x] = '.';
            }
        }
    }
    return { modifiedPlane, removedRolls };
}

console.log({
    partOne: findAccessibleRolls(input, 4),
    partTwo: (() => {
        let plane = input;
        let totalRemoved = 0;
        let isDone = false;
        while (!isDone) {
            const { modifiedPlane, removedRolls } = findAndRemoveAccessibleRoll(plane);
            totalRemoved += removedRolls;
            isDone = removedRolls === 0;
            plane = modifiedPlane;
        }
        return { totalRemoved };
    })()
});
