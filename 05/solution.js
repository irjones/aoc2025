const [freshIdRanges, availableIds] = require('fs').readFileSync('./input.txt').toString().split('\n\n');

function InclusiveRange(start, end) {
    const self = this;

    self.start = parseInt(start);
    self.end = parseInt(end);

    self.includes = function (n) {
        return n <= self.end && n >= self.start;
    }
}

const ranges = freshIdRanges.split('\n').map((rangeLine) => rangeLine.split('-')).map(([start, end]) => new InclusiveRange(start, end));
const idsToCheck = availableIds.split('\n').filter((line) => !!line).map((id) => parseInt(id));

/**
 * Merge intervals to smooth out overlaps and do subtraction to get total elements per range
 *
 * @param ranges
 * @returns {number}
 */
function countTotalIds(ranges) {
    // sort by interval start
    const sortedRanges = ranges.toSorted((l, r) => l.start - r.start);

    let total = 0;
    let { start: currentStart, end: currentEnd } = sortedRanges.shift();

    // determine if they overlap or are exclusive
    for (const { start, end } of sortedRanges) {
        if (start <= currentEnd + 1) {
            // overlapping
            if (end > currentEnd) {
                currentEnd = end;
            }
        } else {
            // close current interval
            total += (currentEnd - currentStart + 1);
            currentStart = start;
            currentEnd = end;
        }
    }

    // add the rest
    total += (currentEnd - currentStart + 1);

    return total;
}

console.log({
    partOne: idsToCheck.filter((id) => ranges.some((range) => range.includes(id))).length,
    partTwo: countTotalIds(ranges),
});

// author's note: tried enumerating into sets, tried sharding the sets with a modulo key + buckets; there is not enough memory on this earth to do that
