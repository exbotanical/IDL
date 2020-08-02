const { Context, evaluate, Execute } = require("./context.js");

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

ctx.define("print", (callback, txt) => callback(txt));

ctx.define("sleep", (k, ms) => setTimeout(() => Execute(k, [ false ]), ms));

module.exports = {
    Environment: ctx
};

// Execute(evaluate, [ ABSTRACT_SYNTAX_TREE, ctx, (result) => console.log("Result ---> ", result)]);
