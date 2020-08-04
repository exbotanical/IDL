const { parse, RenderInputStream, RenderTokenStream } = require("../parser");
const { Transpiler, CpsTransformer } = require("../compiler");
const { Execute, STACK_GUARD } = require("../interpreter/context.js");
const CpsOptimizer = require("../optimizer/CPS-optimizer.js");

if (typeof process != "undefined") (() => {
    const sys = require("util");

    const print = function(k) {
        console.log([].slice.call(arguments, 1).join(" "));
        k(false);
    };

    function readStdin(callback) {
        let text = "";
        process.stdin.setEncoding("utf8");
        process.stdin.on("readable", () => {
            const chunk = process.stdin.read();
            if (chunk) {
                text += chunk;
            }
        });
        process.stdin.on("end", () => callback(text));
    };

    readStdin((code) => {
        const ast = parse(RenderTokenStream(RenderInputStream(code)));
        const cps = CpsTransformer(ast, (x) => 
            ({
                type: "CALL",
                func: { type: "VARIABLE", value: "ε_TOPLEVEL" },
                args: [ x ]
            })
        );

        // console.log(cps);

        const opt = CpsOptimizer(cps);
        let jsc = Transpiler(opt);

        jsc = "var ε_TMP;\n\n" + jsc;

        if (opt.env) {
            const vars = Object.keys(opt.env.vars);
            if (vars.length > 0) {
                jsc = "var " + vars.map((name) =>
                    Transpiler({
                        type: "VARIABLE",
                        value: name
                    })
                ).join(", ") + ";\n\n" + jsc;
            }
        }

        jsc = '"use strict";\n\n' + jsc;
        // console.log(sys.inspect(jsc, { depth: null }));

        const func = new Function("ε_TOPLEVEL, STACK_GUARD, print, Execute", jsc);
        console.time("Runtime");
        Execute(func, [
            function(result) {
                console.timeEnd("Runtime");
                console.log("Final: ", result);
            },
            STACK_GUARD,
            print,
            Execute
        ]);
    });
})();

