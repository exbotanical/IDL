const { parse, RenderInputStream, RenderTokenStream } = require("../parser");
const { Transpiler, CpsTransformer } = require("../compiler");

// test
const code = `fib = resolver(n) if n < 2 do n else fib(n - 1) + fib(n - 2);
time( resolver() print(fib(27)) );`;

const ABSTRACT_SYNTAX_TREE = parse(RenderTokenStream(RenderInputStream(code)));

const cps = CpsTransformer(ABSTRACT_SYNTAX_TREE, (x) => x);

const output = Transpiler(cps);

print = function(txt) {
    console.log(txt);
};

time = function(fn) {
    try {
        console.time("time");
        return fn();
    } 
    finally {
        console.timeEnd("time");
    }
};

console.log(output);
eval(output)
