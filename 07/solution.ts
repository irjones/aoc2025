// NOTE: run with the --experimental-strip-types option

const inputText = require('fs').readFileSync('./input.txt').toString();

const startNode = gridToGraph(toGrid(inputText));

console.log({
    partOne: startNode.traceBeam(),
    partTwo: partTwo(inputText),
});

function toGrid(text: string): string[][] {
    const table = text.split('\n')
        .filter((line) => !!line)
        .map((line) => line.split(''));
    return table.map((y, yi) => y.map((x, xi) => new GraphNode(x, { x: xi, y: yi })));
}

function GraphNode(value: string, coords: { x: number, y: number }) {
    const self = this;
    self.value = value;
    self.activated = false;
    self.id = `${coords.y}-${coords.x}`;

    // right now only need south, southeast and southwest
    self.southEast = null;
    self.southWest = null;
    self.south = null;

    Object.defineProperty(self, 'edges', {
        get: () => {
            const edges = [];
            if (self.southEast) edges.push(self.southEast);
            if (self.south) edges.push(self.south);
            if (self.southWest) edges.push(self.southWest);
            return edges;
        }
    });

    self.traceBeam = function(isQuantum = false) {
        if (self.activated) return 0;
        if (!isQuantum) self.activated = true;

        if (self.value === '^') {
            return 1 + (self.southEast?.traceBeam(isQuantum) ?? 0) + (self.southWest?.traceBeam(isQuantum) ?? 0);
        }

        return self.south?.traceBeam(isQuantum) ?? 0;
    }
}


function orNull(arr: string[], inx: number) {
    return arr?.[inx] ?? null;
}

function gridToGraph(nodes: GraphNode[][]) {
    let startNode = null;
    for (let y = 0; y < nodes.length; y += 1) {
        const row = nodes[y];
        for (let x = 0; x < row.length; x += 1) {
            const node = nodes[y][x];

            node.south = orNull(nodes[y + 1], x);
            node.southEast = orNull(nodes[y + 1], x + 1);
            node.southWest = orNull(nodes[y + 1], x - 1);

            if (node.value === 'S') {
                startNode = node;
            }
        }
    }

    return startNode;
}

type RowMap = Map<number, GraphNode[]>;

function partTwo(inputText: string) {
    const grid = toGrid(inputText);
    const findNodebyId = (id) => {
        const [y, x] = id.split('-').map((x) => parseInt(x));
        return grid[y][x];
    }
    const startNode = gridToGraph(grid);
    return countPaths(startNode, findNodebyId);
}

function countPaths(startNode: GraphNode, findNodeById: (string) => GraphNode): number {
    // explicitly order topology
    const rows = collectByRow(startNode);
    const sortedYs = [...rows.keys()].sort((a, b) => a - b);

    const ways = new Map<string, number>();
    ways.set(startNode.id, 1);

    for (const y of sortedYs) {
        for (const node of rows.get(y)) {
            const count = ways.get(node.id) ?? 0;
            if (count === 0) continue;

            // Split or continue
            if (node.value === "^") {
                if (node.southEast) {
                    ways.set(
                        node.southEast.id,
                        (ways.get(node.southEast.id) ?? 0) + count
                    );
                }
                if (node.southWest) {
                    ways.set(
                        node.southWest.id,
                        (ways.get(node.southWest.id) ?? 0) + count
                    );
                }
            } else {
                if (node.south) {
                    ways.set(
                        node.south.id,
                        (ways.get(node.south.id) ?? 0) + count
                    );
                }
            }
        }
    }

    // End nodes = nodes with no outgoing edges
    let total = 0;
    for (const [id, count] of ways) {
        const node = findNodeById(id);
        if (node.edges.length === 0) {
            total += count;
        }
    }

    return total;
}

function collectByRow(start: GraphNode): RowMap {
    const rows = new Map<number, GraphNode[]>();
    const visited = new Set<string>();
    const stack = [start];

    while (stack.length > 0) {
        const node = stack.pop()!;
        if (visited.has(node.id)) continue;
        visited.add(node.id);

        const y = Number(node.id.split("-")[0]);
        if (!rows.has(y)) rows.set(y, []);
        rows.get(y)!.push(node);

        for (const child of node.edges) {
            stack.push(child);
        }
    }

    return rows;
}