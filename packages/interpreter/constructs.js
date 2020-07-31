const { Context, evaluate, Execute } = require("./context.js");
const { parse, RenderInputStream, RenderTokenStream } = require("../parser");

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
        const util = require("util");

        ctx.define("println", (val) => util.puts(val));

        ctx.define("print", (val) => util.print(val));

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
const code = "let (x = 2, y = 3, z = x + y) print(x + y + z);";

const ABSTRACT_SYNTAX_TREE = parse(RenderTokenStream(RenderInputStream(code)));

ctx.define("print", (callback, txt) => callback(txt));

Execute(evaluate, [ ABSTRACT_SYNTAX_TREE, ctx, (result) => console.log("Result ---> ", result)]);