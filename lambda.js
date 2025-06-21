function assert(condition) {
    if (!condition) {
        const err = new Error();
        const stackLine = err.stack.split('\n')[2]; // The third line of the stack trace (where the assert was called)
        console.error("Assertion failure " + stackLine.trim())
    }
}

/////////////////////////////////////////
// Projections :


p1 = x => y => x
p2 = x => y => y

assert(p1(1)(2) == 1)
assert(p2(1)(2) == 2)
console.log("px tests ok")


/////////////////////////////////////////
// Point fix 
const Y = f =>
  (x => f(v => x(x)(v)))
  (x => f(v => x(x)(v)));

const fix = Y;

{
    factorial = fix(f => n => (n === 0 ? 1 : n * f(n - 1)));
    assert(factorial(4) == 4*3*2)
}


