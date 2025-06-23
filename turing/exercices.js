const { assert } = require("../common");
const { blankTape, moveLeft, moveRight, writeSymbol, readSymbol, step, runMachine, tapeFromString, tapeToString } = require("./primitives");

/////////////////////////////////////////
// Unary increment Turing machine
// Input: a tape with a sequence of '1's (unary number), terminated by blank '_'
// Output: the tape with one more '1' at the end

const unaryIncrementDelta = {
    q0: {
        '1': ['q0', '1', 'R'],
        '_': ['HALT', '1', 'N'] // Write '1' at the end, halt
    }
};

assert(tapeToString(runMachine(unaryIncrementDelta, 'q0', tapeFromString("111_"), ['HALT']).tape) === "1111");
assert(tapeToString(runMachine(unaryIncrementDelta, 'q0', tapeFromString("_"), ['HALT']).tape) === "1");
console.log("Unary increment done!");

/////////////////////////////////////////
// Palindrome recognition (binary alphabet: '0', '1', blank '_')
// Accepts if the input is a palindrome, rejects otherwise
// States: q0 (start), q1 (move right), q2 (move left), q_accept, q_reject
// This is a simple version for odd/even length palindromes

const palindromeDelta = {
    q0: {
        '0': ['q1_0', '_', 'R'],
        '1': ['q1_1', '_', 'R'],
        '_': ['ACCEPT', '_', 'N']
    },
    q1_0: {
        '0': ['q1_0', '0', 'R'],
        '1': ['q1_0', '1', 'R'],
        '_': ['q2_0', '_', 'L']
    },
    q1_1: {
        '0': ['q1_1', '0', 'R'],
        '1': ['q1_1', '1', 'R'],
        '_': ['q2_1', '_', 'L']
    },
    q2_0: {
        '0': ['q3', '_', 'L'],
        '1': ['REJECT', '1', 'N'],
        '_': ['ACCEPT', '_', 'N']
    },
    q2_1: {
        '1': ['q3', '_', 'L'],
        '0': ['REJECT', '0', 'N'],
        '_': ['ACCEPT', '_', 'N']
    },
    q3: {
        '0': ['q3', '0', 'L'],
        '1': ['q3', '1', 'L'],
        '_': ['q0', '_', 'R']
    }
};

assert(runMachine(palindromeDelta, 'q0', tapeFromString("_"), ['ACCEPT', 'REJECT']).state === 'ACCEPT');
assert(runMachine(palindromeDelta, 'q0', tapeFromString("0_"), ['ACCEPT', 'REJECT']).state === 'ACCEPT');
assert(runMachine(palindromeDelta, 'q0', tapeFromString("1_"), ['ACCEPT', 'REJECT']).state === 'ACCEPT');
assert(runMachine(palindromeDelta, 'q0', tapeFromString("00_"), ['ACCEPT', 'REJECT']).state === 'ACCEPT');
assert(runMachine(palindromeDelta, 'q0', tapeFromString("11_"), ['ACCEPT', 'REJECT']).state === 'ACCEPT');
assert(runMachine(palindromeDelta, 'q0', tapeFromString("010_"), ['ACCEPT', 'REJECT']).state === 'ACCEPT');
assert(runMachine(palindromeDelta, 'q0', tapeFromString("0110_"), ['ACCEPT', 'REJECT']).state === 'ACCEPT');
assert(runMachine(palindromeDelta, 'q0', tapeFromString("01110_"), ['ACCEPT', 'REJECT']).state === 'ACCEPT');
assert(runMachine(palindromeDelta, 'q0', tapeFromString("0110110_"), ['ACCEPT', 'REJECT']).state === 'ACCEPT');
assert(runMachine(palindromeDelta, 'q0', tapeFromString("01_"), ['ACCEPT', 'REJECT']).state === 'REJECT');
assert(runMachine(palindromeDelta, 'q0', tapeFromString("10_"), ['ACCEPT', 'REJECT']).state === 'REJECT');
assert(runMachine(palindromeDelta, 'q0', tapeFromString("011_"), ['ACCEPT', 'REJECT']).state === 'REJECT');
assert(runMachine(palindromeDelta, 'q0', tapeFromString("110_"), ['ACCEPT', 'REJECT']).state === 'REJECT');
console.log("Palindrome recognition done!");
