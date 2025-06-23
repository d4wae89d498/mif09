// Turing machine primitives
// Tape is represented as { left: [], head: symbol, right: [] }

blankTape = (blank = '_') => ({ left: [], head: blank, right: [] });

moveLeft = (tape, blank = '_') => {
    const { left, head, right } = tape;
    if (left.length === 0) {
        return { left: [], head: blank, right: [head, ...right] };
    } else {
        return { left: left.slice(0, -1), head: left[left.length - 1], right: [head, ...right] };
    }
};

moveRight = (tape, blank = '_') => {
    const { left, head, right } = tape;
    if (right.length === 0) {
        return { left: [...left, head], head: blank, right: [] };
    } else {
        return { left: [...left, head], head: right[0], right: right.slice(1) };
    }
};

writeSymbol = (tape, symbol) => ({ ...tape, head: symbol });

readSymbol = (tape) => tape.head;

// A step: given a machine (transition function), state, and tape, returns new state and tape
step = (delta, state, tape, blank = '_') => {
    const symbol = readSymbol(tape);
    const action = delta[state] && delta[state][symbol];
    if (!action) throw new Error(`No transition for state ${state} and symbol ${symbol}`);
    const [newState, write, move] = action;
    let newTape = writeSymbol(tape, write);
    if (move === 'L') newTape = moveLeft(newTape, blank);
    else if (move === 'R') newTape = moveRight(newTape, blank);
    return [newState, newTape];
};

// Run the machine until it reaches a halting state
runMachine = (delta, startState, tape, haltingStates = ['HALT'], blank = '_', maxSteps = 10000) => {
    let state = startState;
    let currentTape = tape;
    let steps = 0;
    while (!haltingStates.includes(state) && steps < maxSteps) {
        [state, currentTape] = step(delta, state, currentTape, blank);
        steps++;
    }
    return { state, tape: currentTape, steps };
};

tapeFromString = (str, blank = '_') => {
    const arr = str.split("");
    return arr.length === 0
        ? blankTape(blank)
        : { left: [], head: arr[0], right: arr.slice(1) };
};

tapeToString = (tape, blank = '_', maxLen = 100) => {
    // Reconstruct tape as string (for testing)
    let l = tape.left.slice(-maxLen).join("");
    let h = tape.head;
    let r = tape.right.slice(0, maxLen).join("");
    return l + h + r;
};

module.exports = {
    blankTape,
    moveLeft,
    moveRight,
    writeSymbol,
    readSymbol,
    step,
    runMachine,
    tapeFromString,
    tapeToString
};
