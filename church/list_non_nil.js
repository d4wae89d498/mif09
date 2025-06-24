const {assert} = require("../common")
const {Y} = require("./combinators")
const {lt} = require("./int_native")

fix = Y

cons = e => r => fs => fc => fc(e)(r)
sig = e => fs => fc => fs(e)

min = fix (f => l => l(x => x)(e => r => lt(e)(f(r))(e)(f(r))))

head = l => l(x => x)(e => r => e)

{
    assert(1 == min(cons(4)(cons(3)(sig(1)))));
    assert(3 == head(cons(3)(cons(2)(sig(2)))));
    console.log("tests done")
}