Zero = () => 0

Succ = (x) => x + 1;

Proj = (i) => (...x) => x[i - 1];

Composition = (g, ...h) => (...x) => g(...h.map(f => f(...x)));

Rec = (g, h) => (...args) => {
    const n = args[args.length - 1]; // n = args[n]
    const rest = args.slice(0, -1);  // rest = [args_1, args_2, .... ,args_n-1]

    if (n === 0) {
        return g(...rest);
    } else {
        const prev = Rec(g,h)(...rest, n - 1);
        return h(...rest, n - 1, prev);
    }
};

module.exports = {
    Zero,
    Succ,
    Proj,
    Composition,
    Rec
}