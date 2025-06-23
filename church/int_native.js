const {vrai, faux} = require("./basics.js")

lt = x => y => x < y ? vrai : faux
gt = x => y => x > y ? vrai : faux
eq = x => y => x == y ? vrai : faux
add = x => y => x + y
mult = x => y => x * y 

fromInt = n => n;

toInt = n => n;

module.exports = {
    lt,
    gt,
    eq,
    add,
    mult
}