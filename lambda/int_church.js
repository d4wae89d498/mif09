const { assert } = require("../common");
const {and, not, or} = require("./basics")

zero = f => x => x;
succ = n => f => x => f(n(f)(x));
one   = succ(zero);
two   = succ(one);
three = succ(two);

add   = m => n => f => x => m(f)(n(f)(x));
mult  = m => n => f => m(n(f));
pred  = n => f => x => n(g => h => h(g(f)))(u => x)(u => u);
minus = m => n => n(pred)(m);

isZero = n => n(_ => faux)(vrai);
leq    = m => n => isZero(minus(m)(n));
lt     = m => n => not(leq(n)(m));
gt     = m => n => lt(n)(m);
eq     = m => n => and(leq(m)(n))(leq(n)(m));

fromInt = n => {
  let result = zero;
  for (let i = 0; i < n; i++) 
    result = succ(result);
  return result;
};

toInt = n => n(x => x + 1)(0);

module.exports = {
  // Numerals
  zero, succ, one, two, three,
  // Arithmetic
  add, mult, pred, minus,
  // Comparisons
  isZero, leq, lt, gt, eq,
  // Conversions
  fromInt, toInt
};


{
  assert(toInt(zero) === 0);
  assert(toInt(one) === 1);
  assert(toInt(two) === 2);
  assert(toInt(three) === 3);

  assert(toInt(add(one)(two)) === 3);
  assert(toInt(add(two)(three)) === 5);

  assert(toInt(mult(one)(three)) === 3);
  assert(toInt(mult(two)(three)) === 6);

  assert(toInt(pred(one)) === 0);
  assert(toInt(pred(three)) === 2);

  assert(toInt(minus(three)(one)) === 2);
  assert(toInt(minus(two)(three)) === 0);

  assert(isZero(zero) === vrai);
  assert(isZero(one) === faux);

  assert(leq(one)(two) === vrai);
  assert(leq(two)(one) === faux);

  assert(lt(one)(two) === vrai);
  assert(lt(two)(one) === faux);

  assert(gt(two)(one) === vrai);
  assert(gt(one)(two) === faux);

  assert(eq(one)(one) === vrai);
  assert(eq(one)(two) === faux);

  assert(toInt(fromInt(0)) === 0);
  assert(toInt(fromInt(5)) === 5);
}