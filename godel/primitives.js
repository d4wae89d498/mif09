Zero = () => 0

Succ = (x) => x + 1;

Proj = (i) => (...x) => x[i - 1];

Composition = (g, ...h) => (...x) => g(...h.map(f => f(...x)));

Rec = (b, h) => (...args) => {
    const n = args[args.length - 1]; // n = dernière valeur
    const rest = args.slice(0, -1);  // rest = [args_1, args_2, .... ,args_n-1]

    if (n === 0) {
        return b(...rest);
    } else {
        const prev = Rec(b,h)(...rest, n - 1);
        return h(...rest, n - 1, prev);
    }
};

Minimisation = (g) => (...args) => {
    let k = 0;
    while (g(...args, k) !== 0)
        k += 1;
    return k;
};

module.exports = {
    Zero,
    Succ,
    Proj,
    Composition,
    Rec,
    Minimisation
}