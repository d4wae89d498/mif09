function assert(condition) {
    if (!condition) {
        const err = new Error();
        const stackLine = err.stack.split('\n')[2]; // The third line of the stack trace (where the assert was called)
        console.error("Assertion failure " + stackLine.trim())
    }
}

/////////////////////////////////////////
// Les primitives :

const Zero = () => 0

const Succ = (x) => x + 1;

const Proj = (i) => (...x) => x[i - 1];

const Composition = (g, ...h) => (...x) => g(...h.map(f => f(...x)));

const Rec = (g, h) => (...args) => {
    const n = args[args.length - 1]; // n = args[n]
    const rest = args.slice(0, -1);  // rest = [args_1, args_2, .... ,args_n-1]

    if (n === 0) {
        return g(...rest);
    } else {
        const prev = Rec(g,h)(...rest, n - 1);
        return h(...rest, n - 1, prev);
    }
};


/////////////////////////////////////////
// Exercices :

const Add = Rec(
    Proj(1),
    Composition(Succ, Proj(3))
);  
assert(Add(3, 2) == 5);
assert(Add(0, 0) == 0);
assert(Add(7, 4) == 11);
console.log("Add ok!")


const Mult = Rec(
    Zero, 
    Composition(Add, Proj(3), Proj(1))
);
assert(Mult(3, 2) == 6);
assert(Mult(0, 0) == 0);
assert(Mult(7, 4) == 28);
console.log("Mult ok!")


const Norm = Rec(
    Zero,
    Composition(Succ, Zero)
);
assert(Norm(4) == 1);
assert(Norm(1) == 1);
assert(Norm(0) == 0);
console.log("Norm ok!")


const Not = Rec(
    Composition(Succ, Zero),
    Composition(Zero, Proj(1))
);
assert(Not(4) == 0);
assert(Not(1) == 0);
assert(Not(0) == 1);
console.log("Not ok!")


const And = Composition(Norm, Mult);
assert(And(0, 1) == 0);
assert(And(1, 0) == 0);
assert(And(4, 4) == 1);
console.log("And ok!")


const Pred = Rec(
    Zero,  
    Proj(1)
);
assert(Pred(4) == 3);
assert(Pred(1) == 0);
assert(Pred(0) == 0);
console.log("Pred ok!")


const Sub = Rec(
    Proj(1),
    Composition(Pred, Proj(3))
);
assert(Sub(3, 2) == 1);
assert(Sub(4, 2) == 2);
assert(Sub(4, 4) == 0);
assert(Sub(2, 4) == 0);
console.log("Sub ok!");


const Equal = Composition(
    Not,
    Composition(Add, 
        Composition(Sub, Proj(1), Proj(2)),
        Composition(Sub, Proj(2), Proj(1))
    )
);
assert(Equal(3, 3) == 1);
assert(Equal(3, 2) == 0);
assert(Equal(0, 0) == 1);
console.log("Equal ok!");


const GreaterThan = Composition(Norm, Sub);
assert(GreaterThan(3, 2) == 1);  // 3 > 2, donc vrai
assert(GreaterThan(2, 3) == 0);  // 2 < 3, donc faux
assert(GreaterThan(4, 4) == 0);  // 4 == 4, donc faux
console.log("GreaterThan ok!");


const LessThan = Composition(
    And,
    Composition(Not, GreaterThan),   // ¬(a > b)
    Composition(Not, Equal)          // ¬(a == b)
);
assert(LessThan(3, 2) == 0);  // 3 > 2, donc faux
assert(LessThan(2, 3) == 1);  // 2 < 3, donc vrai
assert(LessThan(4, 4) == 0);  // 4 == 4, donc faux
console.log("LessThan ok!");

const LessThanOrEqual = Composition(Not, GreaterThan); // a <= b iff Not(a > b)
assert(LessThanOrEqual(3, 2) == 0);  // 3 > 2, donc faux
assert(LessThanOrEqual(2, 3) == 1);  // 2 <= 3, donc vrai
assert(LessThanOrEqual(4, 4) == 1);  // 4 <= 4, donc vrai
console.log("LessThanOrEqual ok!");

const Double = Composition(Add, Proj(1), Proj(1));
assert(Double(3) == 6);
assert(Double(0) == 0);
assert(Double(7) == 14);
console.log("Double ok!");


const Square = Composition(Mult, Proj(1), Proj(1));
assert(Square(3) == 9);  // 3 squared is 9
assert(Square(1) == 1); // 4 squared is 16
assert(Square(0) == 0);  // 0 squared is 0
console.log("Square ok!")


const Cube = Composition(
    Mult,
    Composition(Square, Proj(1), Proj(1)),
    Proj(1)
);
assert(Cube(3) == 27);
assert(Cube(0) == 0);
assert(Cube(2) == 8);
console.log("Cube ok!");


const SumSquares = Rec(
    Zero, // Base case: SumSquares(0) = 0
    Composition(
        Add,
        Proj(2), // prev_sum = SumSquares(k)
        Composition(
            Square,
            Composition(Succ, Proj(1)) // (k + 1)^2
        )
    )
);
assert(SumSquares(4) == 4*4 + 3*3 + 2*2 + 1*1)
assert(SumSquares(3) == 3*3 + 2*2 + 1*1)
assert(SumSquares(2) == 2*2 + 1*1)
assert(SumSquares(1) == 1*1)
console.log("SumSquares ok!")

let Rem
{
    // Fonction StepRem(a, b) = a si a < b, sinon a - b
    const StepRem = Composition(
        Add,
        Composition(
        Mult,
        Composition(LessThan, Proj(1), Proj(2)), // Condition : a < b
        Proj(1) // Si oui, retourne a
        ),
        Composition(
        Mult,
        Composition(Not, Composition(LessThan, Proj(1), Proj(2))), // Non (a >= b)
        Composition(Sub, Proj(1), Proj(2)) // Si non, retourne a - b
        )
    );

    // Fonction itérative qui applique StepRem n fois
    const IterateStepRem = Rec(
        Proj(1), // Cas de base : n = 0 → retourne a
        Composition(StepRem, Proj(4), Proj(2)) // Appelle StepRem(prev, b)
    );

    // Fonction finale : reste de la division euclidienne
    Rem = Composition(IterateStepRem, Proj(1), Proj(2), Proj(1));
}
assert(Rem(5, 3) === 2);     // 5 ÷ 3 = 1, reste 2
assert(Rem(7, 5) === 2);     // 7 ÷ 5 = 1, reste 2
assert(Rem(10, 3) === 1);    // 10 ÷ 3 = 3, reste 1
assert(Rem(0, 5) === 0);     // 0 ÷ 5 = 0, reste 0
assert(Rem(3, 10) === 3);    // 3 ÷ 10 = 0, reste 3
console.log("Reminder (fr: reste de la division euclidienne, ou modulo) ok!")

// Divides a n : retourne 1 si a est un diviseur de n
const Divides = Composition(
    Equal,                // Compare...
    Composition(Rem, Proj(2), Proj(1)), // Rem(x, a)
    Zero                  // ...to zero
);
assert(Divides(3, 3) == 1)
assert(Divides(3, 9) == 1)
assert(Divides(10, 100) == 1)
assert(Divides(10, 3) == 0)
assert(Divides(3, 10) == 0)
assert(Divides(9, 3) == 0)
console.log("Divides ok!")


// BothDivide(N, a, b) : retourne 1 si a et b divisent tout les deux N
const BothDivide = Composition(
    And,
    Composition(Divides, Proj(2), Proj(1)), // Divides(a, x)
    Composition(Divides, Proj(3), Proj(1))  // Divides(b, x)
);
assert(BothDivide(12, 3, 4) == 1)
assert(BothDivide(100, 10, 5) == 1)
assert(BothDivide(12, 3, 7) == 0)
console.log("BothDivides ok!")

let Div
{
    // Test(q, m, n) = 1 if q * n <= m
    const Test = Composition(
        LessThanOrEqual,
        Composition(Mult, Proj(1), Proj(3)),
        Proj(2)
    );

    // CountQuot(k, m, n) = max q ≤ k such that q * n <= m
    const cond = Composition(
        Test,
        Composition(Succ, Proj(3)),
        Proj(1),
        Proj(2)
    );

    const succK = Composition(Succ, Proj(3));
    const prevVal = Proj(4);

    const thenBranch = Composition(Mult, cond, succK);
    const elseBranch = Composition(Mult, Composition(Not, cond), prevVal);

    const h = Composition(Add, thenBranch, elseBranch);

    const CountQuot = Rec(
        Composition(Zero), // base case: 0
        h
    );

    // Final Division Function
    Div = Composition(
        CountQuot,
        Proj(1), // m
        Proj(2), // n
        Proj(1)  // k = m
    );
}
assert(Div(9, 3) == 3)
assert(Div(12, 3) == 4)
assert(Div(12, 10) == 1)
assert(Div(0, 10) == 0)
console.log("Division ok!")




console.log("TODO: implement GCD (fr: PGCD : plus grand commun diviseur)")
console.log("TODO: Implement LCM (fr: PPCM : plus petit commun diviseur)")
