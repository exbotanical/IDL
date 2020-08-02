const { parse, RenderInputStream, RenderTokenStream } = require("../parser");
const { Transpiler, CpsTransformer } = require("../compiler");

// test
const code = `fib = resolver(n) if n < 2 do n else fib(n - 1) + fib(n - 2);`;

const ABSTRACT_SYNTAX_TREE = parse(RenderTokenStream(RenderInputStream(code)));

const cps = CpsTransformer(ABSTRACT_SYNTAX_TREE, (x) => x);

const output = Transpiler(cps);

print = function(txt) {
    console.log(txt);
};

console.log(output);
// eval(output)
