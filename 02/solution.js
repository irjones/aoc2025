const data = require('fs').readFileSync('./input.txt').toString().split('\n')[0].split(',').map(range => range.split('-').map(n => parseInt(n)));

let sumPtOne = 0;
let sumPtTwo = 0;
for (const [n, k] of data) {
    sumPtOne += from(n).to(k).withValidityCheck(isInvalidPtOne).sum();
    sumPtTwo += from(n).to(k).withValidityCheck(isInvalidPtTwo).sum();
}

console.log({
    label: 'day 2',
    data,
    sumPtOne,
    sumPtTwo
});

function isInvalidPtOne(n) {
    const nAsString = n.toString();
    // odd numbered digit counts cannot contain a repetition of sequences
    if (nAsString.length % 2 !== 0) return false;
    const midPoint = Math.floor(nAsString.length / 2);
    const firstHalf = nAsString.substring(0, midPoint);
    return firstHalf === nAsString.substring(midPoint, nAsString.length);
}

function isInvalidPtTwo(n) {
    const nAsString = n.toString();
    for (let i = 1; i < nAsString.length; i += 1) {
        const remainingDigits = nAsString.substring(i, nAsString.length);
        if (remainingDigits.split(nAsString.substring(0, i)).every((i) => !!!i)) return true; // all are empty
    }
}

function from(n) {
    const invalidNums = [];
    return {
        to: function(k) {
            return {
                withValidityCheck: function(fn, showWork = false) {
                    let i = n;
                    while (i <= k) {
                        if (fn(i)) {
                            if (showWork) {
                                console.log(`INVALID: ${i}`)
                            }
                            invalidNums.push(i);
                        }
                        i += 1;
                    }

                    return {
                        sum: function() {
                            if (showWork && invalidNums.length) {
                                console.log({ n, k, invalidNums });
                            }
                            return invalidNums.reduce((acc, next) => acc + next, 0);
                        }
                    }
                }
            }
        }
    }
}