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

const One = Composition(Succ, Zero)

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



const Or = Composition(Norm, Add); // Or logique
assert(Or(0, 0) == 0);
assert(Or(0, 1) == 1);
assert(Or(1, 0) == 1);
assert(Or(4, 4) == 1);
console.log("Or ok!")


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


let IfThenElse = Composition(
    Add, 
    Composition(Mult, Proj(1), Proj(2)), 
    Composition(Mult, Composition(Not, Proj(1)), Proj(3))
);
assert(IfThenElse(1, 4, 0) == 4) 
assert(IfThenElse(1, 0, 0) == 0) 
assert(IfThenElse(0, 0, 0) == 0) 
assert(IfThenElse(0, 0, 4) == 4) 
console.log("IfThenElse ok!")


let Max = Composition(
    IfThenElse,
    Composition(GreaterThan, Proj(1), Proj(2)),
    Proj(1),
    Proj(2)
)
assert(Max(3, 4) == 4) 
assert(Max(4, 3) == 4) 
assert(Max(0, 0) == 0) 
assert(Max(10, 5) == 10) 
console.log("Max ok!")


const Min = Composition(
    IfThenElse,
    Composition(LessThanOrEqual, Proj(1), Proj(2)),  // condition a ≤ b
    Proj(1),                                         // alors a
    Proj(2)                                          // sinon b
);
assert(Min(3,5) === 3);
assert(Min(7,2) === 2);
console.log("Min ok!");

const IsZero = Composition(Equal, Proj(1), Composition(Zero)); // Vérifie si un nombre est égal à zéro
assert(IsZero(3) === 0);
assert(IsZero(0) === 1);
assert(IsZero(1) === 0);
console.log("IsZero ok!");

const EitherIsZero = Composition(
    Or,
    Composition(IsZero, Proj(1)), // Vérifie si a == 0
    Composition(IsZero, Proj(2))  // Vérifie si b == 0
);
assert(EitherIsZero(0, 1) === 1);
assert(EitherIsZero(3, 0) === 1);
assert(EitherIsZero(0, 0) === 1);
assert(EitherIsZero(1, 1) === 0);
console.log("EitherIsZero ok!");


const DividesBoth = Composition(
    And,
    Composition(Divides, Proj(1), Proj(3)), // Divise(d, a)
    Composition(Divides, Proj(1), Proj(2))  // Divise(d, b)
);
assert(DividesBoth(4, 12, 24) == 1)
assert(DividesBoth(5, 100, 10) == 1)
assert(DividesBoth(6, 12, 48) == 1)
assert(DividesBoth(3, 7, 5) == 0)
console.log("DividesBoth ok!")


let GCD;
{
    const AccumulateMax = Rec(
        Composition(One, Proj(1), Proj(2)), // Cas de base : retourne 1
        Composition(
            IfThenElse,
            Composition(
                DividesBoth,
                Composition(Succ, Proj(3)), // d = k
                Proj(1), // a
                Proj(2), // b
            ),
            Composition(Succ, Proj(3)), // Si oui, retourne d
            Proj(4) // Sinon, garde la valeur précédente
        )
    );

    GCD = Composition(
        IfThenElse,
        Composition(
            Or, 
            Composition(IsZero, Proj(1)),
            Composition(IsZero, Proj(2)),
        ),
        (Composition,
            IfThenElse,
            Composition(
                And, 
                Composition(IsZero, Proj(1)),
                Composition(IsZero, Proj(2)),
            ),
            Zero,
            Max
        ),
        Composition(
            AccumulateMax,
            Proj(1),
            Proj(2),
            Min, 
        )
    );
    
}

// Tests
assert(GCD(2, 2) == 2);
assert(GCD(2, 4) == 2);
assert(GCD(2, 2) == 2);
assert(GCD(7, 5) === 1);
assert(GCD(0, 5) === 5);
assert(GCD(5, 0) === 5);
assert(GCD(0, 0) === 0);
assert(GCD(9, 3) === 3);
assert(GCD(14, 21) === 7);
assert(GCD(12,18) === 6);
assert(GCD(18,12) === 6);
assert(GCD(7,4)  === 1);
assert(GCD(9,6)  === 3);
assert(GCD(0,3)  === 3);
console.log(GCD(12,18), GCD(12,18), GCD(9,6))

const PPCM = Composition(
    Div,
    Composition(Mult, Proj(1), Proj(2)),
    Composition(GCD, Proj(1), Proj(2))
)
assert(PPCM(4, 6) === 12);
assert(PPCM(6, 4) === 12);
assert(PPCM(3, 7) === 21);
assert(PPCM(5, 10) === 10);
assert(PPCM(8, 12) === 24);
assert(PPCM(1, 1) === 1);
console.log("PPCM ok !");


console.log("TODO: minimisation")
