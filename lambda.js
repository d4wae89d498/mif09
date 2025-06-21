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
console.log("projections tests ok")


/////////////////////////////////////////
// Point fix 
Y = f =>
  (x => f(v => x(x)(v)))
  (x => f(v => x(x)(v)));

fix = Y;

{
    factorial = fix(f => n => (n === 0 ? 1 : n * f(n - 1)));
    assert(factorial(4) == 4*3*2)
}

vrai = p1
faux = p2
lt = x => y => x < y ? vrai : faux
add = x => y => x + y
mult = x => y => x * y 

pair = x => y => p => p(x)(y)
assert(1 == pair(1)(2)(vrai))
assert(2 == pair(1)(2)(faux))

sq = x => mult(x)(x)

nil = fs => fc => fs 


cons = e => r => f => g => g(e)(r)
sing = e => cons(e)(nil)


mini = fix(f => l => l(
    99999999999
)(
    e => r => lt(e)(f(r))(e)(f(r)))
)
assert(3 == mini(cons(7)(cons(3)(cons(5)(cons(6)(sing(5)))))))


phd = l => l(
    nil // error!
)(
    e => r => e
)
assert(7 == phd(cons(7)(cons(3)(cons(5)(cons(6)(sing(5)))))))
assert(3 == phd(sing(3)))

suml = fix(f => l => l(
    0
)(
    e => r => add(sq(e))(f(r))
))
assert(13 == suml(cons(2)(sing(3))))


long = fix(f => l => l(
    0
)(
    e => r => add(1)(f(r))
))
assert(1 == long(sing(3)))
assert(3 == long(cons(1)(cons(4)(sing(9)))))



assert(0 == long(nil))
assert(0 == suml(nil))