const { assert } = require("../common.js")

p1_2 = x => y => x
p2_2 = x => y => y

p1_3 = x => y => z => x
p2_3 = x => y => z => y
p3_3 = x => y => z => z

pair = x => y => f => f(x)(y)

letv = v => f => f(v)

vrai = p1_2
faux = p2_2

and = a => b => a(b)(a)
assert(and(vrai)(vrai) == vrai)
assert(and(faux)(vrai) == faux)
assert(and(vrai)(faux) == faux)
assert(and(faux)(faux) == faux)

or = a => b => a(vrai)(b)
assert(or(vrai)(vrai) == vrai)
assert(or(faux)(vrai) == vrai)
assert(or(vrai)(faux) == vrai)
assert(or(faux)(faux) == faux)

module.exports = {
    p1_2,
    p2_2,
    p1_3,
    p2_3,
    p3_3,
    vrai,
    faux,
    pair,
    letv
}

{
    assert(p1_2(1)(2) == 1)
    assert(p2_2(1)(2) == 2)

    assert(p1_3(1)(2)(3) == 1)
    assert(p2_3(1)(2)(3) == 2)
    assert(p3_3(1)(2)(3) == 3)

    assert(1 == vrai(1)(2))
    assert(2 == faux(1)(2))

    assert(2 == pair(1)(2)(p2_2))

    assert(5 == letv(4)(x => x + 1))
    assert(9 == letv(4)(x => letv(5)(y => x + y)))

    assert(and(vrai)(vrai) == vrai)
    assert(and(faux)(vrai) == faux)
    assert(and(vrai)(faux) == faux)
    assert(and(faux)(faux) == faux)

    assert(or(vrai)(vrai) == vrai)
    assert(or(faux)(vrai) == vrai)
    assert(or(vrai)(faux) == vrai)
    assert(or(faux)(faux) == faux)
}