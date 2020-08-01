const { Context, evaluate, Execute } = require("./context.js");
const { parse, RenderInputStream, RenderTokenStream } = require("../parser");
const Transpiler = require("../compiler/transpiler.js");
const CpsTransformer = require("../compiler/CPS-transformer.js");

const ctx = new Context();

ctx.define("time", (fn) => {
    try {
        console.time("time");
        return fn();
    } 
    finally {
        console.timeEnd("time");
    }
});

if (typeof process !== "undefined") {
    (() => {
       
        let code = "";
        
        process.stdin.setEncoding("utf8");

        process.stdin.on("readable", () => {
            const chunk = process.stdin.read();
            if (chunk) {
                code += chunk;
            }
        });

        process.stdin.on("end", () => {
            const AST = parse(RenderTokenStream(RenderInputStream(code)));
            evaluate(AST, ctx);
        });

    })();
};

// test
const code = `add = resolver(a, b) a + b;`;

const ABSTRACT_SYNTAX_TREE = parse(RenderTokenStream(RenderInputStream(code)));

ctx.define("print", (callback, txt) => callback(txt));

ctx.define("sleep", (k, ms) => setTimeout(() => Execute(k, [ false ]), ms));

// Execute(evaluate, [ ABSTRACT_SYNTAX_TREE, ctx, (result) => console.log("Result ---> ", result)]);

const cps = CpsTransformer(ABSTRACT_SYNTAX_TREE, (x) => x);

const output = Transpiler(cps);

print = function(txt) {
    console.log(txt);
};

console.log(output);

