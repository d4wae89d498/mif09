const {assert} = require("../common")
const {Y} = require("./combinators")
const {lt} = require("./int_native")

fix = Y

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
    "error"
)(
    e => r => e
)
assert(7 == phd(cons(7)(cons(3)(cons(5)(cons(6)(sing(5)))))))
assert(3 == phd(sing(3)))
assert("error" == phd(nil))

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

console.log("tests done")