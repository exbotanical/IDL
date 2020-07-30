const { Context, evaluate } = require("./context.js");
const { parse, RenderInputStream, RenderTokenStream } = require("../parser");

const exeCtx = new Context();

exeCtx.define("time", (fn) => {
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

        exeCtx.define("println", (val) => util.puts(val));

        exeCtx.define("print", (val) => util.print(val));

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
            evaluate(AST, exeCtx);
        });

    })();
};

// test
const code = "let (x = 2, y = 3, z = x + y) print(x + y + z);";

const ast = parse(RenderTokenStream(RenderInputStream(code)));

exeCtx.define("print", (txt) => console.log(txt));

evaluate(ast, exeCtx); 