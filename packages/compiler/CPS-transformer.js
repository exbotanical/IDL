const { TYPES, KEYWORDS, ERRORS } = require("../constants");

let GENSYM = 0;
const computeNewSymbol = (name) => {
    if (!name) {
        name = "";
    }
    name = KEYWORDS.SYMBOL + name;
    return name + (++GENSYM);
};

const computeContinuation = (k) => {
    const continuation = computeNewSymbol("R");
    return { type : KEYWORDS.FUNCTION,
             vars : [ continuation ],
             body : k({ type  : TYPES.VARIABLE, value : continuation }) 
    };
};

function CpsTransformer(expr, k) {
    return cps(expr, k);
    function cps(expr, k) {
        switch (expr.type) {
            case TYPES.INTEGER: case TYPES.STRING: case TYPES.BOOLEAN: case TYPES.VARIABLE:
                return cpsAtomic(expr, k);
            case TYPES.ASSIGNMENT: case TYPES.BINARY: 
                return cpsBinary(expr, k);
            case KEYWORDS.DECLARATION: 
                return cpsNamedLet(expr, k);
            case KEYWORDS.FUNCTION: 
                return cpsResolver(expr, k);
            case KEYWORDS.CONDITIONAL:  
                return cpsConditional(expr, k);
            case TYPES.SEQUENCE: 
                return cpsSequence(expr, k);
            case TYPES.CALL: 
                return cpsCall(expr, k);
            default:
                throw new Error(ERRORS.TRANSFORM_ERR + JSON.stringify(expr));
        }
    }

    function cpsAtomic(expr, k) { 
        return k(expr);
    };

    // here, we invoke the continuation only after having compiled the left and right rings 
    // of the given expression, subsequently invoking sequence-remainder `k` 
    function cpsBinary(expr, k) {
        return cps(expr.left, (left) => 
            cps(expr.right, (right) => 
                k({
                    type: expr.type,
                    operator: expr.operator,
                    left,
                    right
                })
            )
        );
    };

    // handle `let` nodes
    // conversion to IIFE, CPS transform - this nullifies `let` nodes
    // ergo, the namedLet JS compiler is no longer imperative
    function cpsNamedLet(expr, k) {
        if (expr.vars.length === 0) {
            return cps(expr.body, k);
        }
        return cps({
            type: TYPES.CALL,
            args: [expr.vars[0].def || { type: TYPES.BOOLEAN, value: false }],
            func: {
                type: KEYWORDS.FUNCTION,
                vars: [ expr.vars[0].name ],
                body: {
                    type: KEYWORDS.DECLARATION,
                    vars: expr.vars.slice(1),
                    body: expr.body
                }
            }
        }, k);
    };

    function cpsResolver(expr, k) {
        const continuation = computeNewSymbol("K");
        const body = cps(expr.body, (body) => 
            ({ 
                type: TYPES.CALL,
                func: { type: TYPES.VARIABLE, value: continuation },
                args: [ body ] 
            })
        );
        // invoke own continuation given Resolvers are atomic
        return k({ 
            type: KEYWORDS.FUNCTION,
            name: expr.name,
            vars: [continuation].concat(expr.vars),
            body
        });
    };

    function cpsConditional(expr, k) {
        return cps(expr.condition, (condition) => 
            ({
                type: KEYWORDS.CONDITIONAL,
                condition,
                do: cps(expr.do, k),
                else: cps(expr.else || { type: TYPES.BOOLEAN, value: false }, k),
            })
        );
    };
    
    function cpsSequence(expr, k) {
        return (function loop(body) {
            // call remainder of sequence w/FALSE node
            if (body.length == 0) {
                return k({ type: TYPES.BOOLEAN, value: false });
            }
            // call remainder of sequence w/ expression's resolved value
            if (body.length == 1) {
                return cps(body[0], k);
            }
            // expressions > 1, compile first and recurse remainder thereof
            return cps(body[0], (first) => 
                ({
                    type: TYPES.SEQUENCE,
                    seq: [ first, loop(body.slice(1)) ]
                })
            );
        })(expr.seq);
    };

    function cpsCall(expr, k) {
        return cps(expr.func, (func) => {
            return (function loop(args, i) {
                if (i == expr.args.length) {
                    return {
                        type : TYPES.CALL,
                        func,
                        args
                    };
                }
                return cps(expr.args[i], (value) => {
                    args[i + 1] = value;
                    return loop(args, i + 1);
                });
            })([ computeContinuation(k) ], 0);
        });
    };



};

module.exports = CpsTransformer;