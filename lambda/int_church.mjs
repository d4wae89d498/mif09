zero = f => x => x;
one = f => x => f(x);
two = f => x => f(f(x));
three = f => x => f(f(f(x)));

succ = n => f => x => f(n(f)(x));

// TODO: ...