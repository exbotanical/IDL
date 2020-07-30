const { ERRORS, KEYWORDS, PRECEDENCE, TYPES, TOKENS } = require("../constants");


let STACK_LEN;

function STACK_GUARD(f, args) {
    if (--STACK_LEN < 0) {
        throw new Continuation(f, args);
    }
};

function Continuation(f, args) {
    this.f = f;
    this.args = args;
};

function Execute(f, args) {
    while (true) {
        try {
            STACK_LEN = 200;
            return f.apply(null, args);
        }
        catch(err) {
            if (err instanceof Continuation) {
                f = ex.f;
                args = ex.args;
            }
            else {
                throw err;
            }
        }
    }
};

function Context(parent) {
    this.vars = Object.create(parent ? parent.vars : null);
    this.parent = parent;
};

Context.prototype = {
    extend: function() {
        return new Context(this);
    },
    lookup: function(name) {
        let scope = this;
        while (scope) {
            if (Object.prototype.hasOwnProperty.call(scope.vars, name)) {
                return scope;
            }
            scope = scope.parent;
        }
    },
    get: function(name) {
        if (name in this.vars) {
            return this.vars[name];
        }
        throw new Error(`${ERRORS.UNDEFINED_VAR} ${name}`);
    },
    set: function(name, value) {
        const scope = this.lookup(name);
        if (!scope && this.parent) {
            throw new Error(`${ERRORS.UNDEFINED_VAR} ${name}`);
        }
        return (scope || this).vars[name] = value;
    },
    define: function(name, value) {
        return this.vars[name] = value;
    }
};

function evaluate(expr, env, callback) {
    STACK_GUARD(evaluate, arguments);
    switch (expr.type) {
        case TYPES.INTEGER: case TYPES.STRING: case TYPES.BOOLEAN:
            callback(expr.value);
            return;
        case TYPES.VARIABLE:
            callback(env.get(expr.value));
            return;

        case TYPES.ASSIGNMENT:
            if (expr.left.type !== TYPES.VARIABLE) {
                throw new Error(`${ERRORS.EXPECT_VAR} ${JSON.stringify(expr.left)}`);
            }
            evaluate(expr.right, env, function CC(right) {
                STACK_GUARD(CC, arguments);
                callback(env.set(expr.left.value, right));
            });
            return;

        case TYPES.BINARY:
            evaluate(expr.left, env, function CC(left) {
                STACK_GUARD(CC, arguments);
                evaluate(expr.right, env, function CC(right) {
                    STACK_GUARD(CC, arguments);
                    callback(applyOperator(expr.operator, left, right));
                });
            });
            return;

        case KEYWORDS.FUNCTION:
            callback(constructResolver(env, expr));
            return;

        case KEYWORDS.CONDITIONAL:
            evaluate(expr.condition, env, function CC(cond) {
                STACK_GUARD(CC, arguments);
                if (cond !== false) {
                    evaluate(expr.do, env, callback);
                }
                else if (expr.else) {
                    evaluate(expr.else, env, callback);
                }
                else {
                    callback(false);
                }
            });
            return;
            
        case TYPES.SEQUENCE:
            (function loop(last, i) {
                STACK_GUARD(loop, arguments);
                if (i < expr.seq.length) {
                    evaluate(expr.seq[i], env, function CC(val) {
                        STACK_GUARD(CC, arguments);
                        loop(val, i + 1);
                    });
                } 
                else {
                    callback(last);
                }
            })(false, 0);
            return;

        case TYPES.CALL:
            evaluate(expr.func, env, function CC(fn) {
                STACK_GUARD(CC, arguments);
                (function loop(args, i) {
                    STACK_GUARD(loop, arguments);
                    if (i < expr.args.length) {
                        evaluate(expr.args[i], env, function CC(arg) {
                            STACK_GUARD(CC, arguments);
                            args[i + 1] = arg;
                            loop(args, i + 1);
                        }); 
                    } 
                    else {
                        fn.apply(null, args);
                    }
                })([ callback ], 0);
            });
            return;

        case KEYWORDS.DECLARATION:
            (function loop(env, i) {
                STACK_GUARD(loop, arguments);
                if (i < expr.vars.length) {
                    const v = expr.vars[i];
                    if (v.def) {
                        evaluate(v.def, env, function CC(value) {
                            STACK_GUARD(CC, arguments);
                            const scope = env.extend();
                            scope.define(v.name, value);
                            loop(scope, i + 1);
                        });
                    }
                    else {
                        const scope = env.extend();
                        scope.define(v.name, false);
                        loop(scope, i + 1);
                    }
                } 
                else {
                    evaluate(expr.body, env, callback);
                }
            })(env, 0);
            return;

        default:
            throw new Error(`${ERRORS.EVAL} ${expr.type}`);
    }
};

function applyOperator(op, a, b) {

    const enforceInteger = prospect => {
        if (typeof prospect !== "number") {
            throw new Error(`${ERRORS.NAN} ${prospect}`);
        }
        return prospect;
    };

    const enforceLeftRing = prospect => {
        if (enforceInteger(prospect) === 0) {
            throw new Error(ERRORS.ZERO_DIVISION);
        }
        return prospect;
    };

    switch (op) {
        case "+": 
            return enforceInteger(a) + enforceInteger(b);
        case "-": 
            return enforceInteger(a) - enforceInteger(b);
        case "*": 
            return enforceInteger(a) * enforceInteger(b);
        case "/": 
            return enforceInteger(a) / enforceLeftRing(b);
        case "%": 
            return enforceInteger(a) % enforceLeftRing(b);
        case "&&": 
            return a !== false && b;
        case "||": 
            return a !== false ? a : b;
        case "<": 
            return enforceInteger(a) < enforceInteger(b);
        case ">": 
            return enforceInteger(a) > enforceInteger(b);
        case "<=": 
            return enforceInteger(a) <= enforceInteger(b);
        case ">=": 
            return enforceInteger(a) >= enforceInteger(b);
        case "==": 
            return a === b;
        case "!=": 
            return a !== b;
    }
    throw new Error(`${ERRORS.UNKNOWN_OP} ${op}`);
};

function constructResolver(env, expr) {
    // if func name is extant, extend the scope, pointing said name at closure created herein
    // this is how we handle `{{KEYWORDS.VAR}}`
    if (expr.name) {                    
        env = env.extend();            
        env.def(expr.name, resolver); 
    }           
    function resolver(callback) {
        STACK_GUARD(resolver, arguments);
        const variables = expr.vars,
            context = env.extend();
        for (let i = 0; i < variables.length; ++i) {
            context.define(
                variables[i], 
                i + 1 < arguments.length 
                ? arguments[i + 1]
                : false
            );
        }
        evaluate(expr.body, context, callback);
    }
    return resolver;
};

module.exports = {
    Context,
    evaluate,
    Execute
};
