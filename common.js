function assert(condition) {
    if (!condition) {
        const err = new Error();
        const stackLine = err.stack.split('\n')[2]; // The third line of the stack trace (where the assert was called)
        console.error("Assertion failure " + stackLine.trim())
    }
}

module.exports = {assert}