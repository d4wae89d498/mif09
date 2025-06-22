Y1 = f => x => f(v => x(x)(v))
Y = f => Y1(f)(Y1(f))


Z1  = z => x => x (gel => z(z)(x))
Z = builder => Z1(Z1)(self => builder(arg => self("deg")(arg)))

module.exports = {Y, Z}