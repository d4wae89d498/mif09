const {assert} = require("../common")
const {Y} = require("./combinators")
const {lt} = require("./int_native")

fix = Y

nil = fn => fs => fc => fn
cons = e => r => fn => fs => fc => fc(e)(r)
sig = e => fn => fs => fc => fs(e)

min = fix(f => l => l("error")(x => x)(e => r => lt(e)(f(r))(e)(f(r))))

assert(1 == min(cons(4)(cons(3)(sig(1)))));
assert("error" == min(nil));
console.log("tests done")