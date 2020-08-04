const { TYPES, KEYWORDS, ERRORS, OPERATORS } = require("../../constants");
const { Context } = require("../interpreter/context.js");
const computePurity = require("../compiler/compute-purity.js");

let SYNTHETIC_STACK_CTRL = 0;
const computeNewSymbol = (name) => {
    if (!name) {
        name = "";
    }
    name = KEYWORDS.SYMBOL + name;
    return `${name}${++SYNTHETIC_STACK_CTRL}`;
};

function CpsOptimizer(expr) {
    let changes, 
        defun;
    do {
        changes = 0;
        constructClosure(expr);
        expr = optimize(expr);
    } while (changes);
    constructClosure(expr);
    return expr;

    function optimize(expr) {
        if (changes) { 
            return expr;
        }
        switch (expr.type) {
            case TYPES.INTEGER: case TYPES.STRING: case TYPES.BOOLEAN: case TYPES.VARIABLE:
                return expr;
            case TYPES.BINARY:
                return procBinary(expr);
            case TYPES.ASSIGNMENT:
                return procAssignment(expr);
            case KEYWORDS.CONDITIONAL:
                return procConditional(expr);
            case TYPES.SEQUENCE:
                return procSequence(expr);
            case TYPES.CALL:
                return procCall(expr);
            case KEYWORDS.FUNCTION:
                return procResolver(expr);
            case TYPES.NEGATION:
                return procNegation(expr);
        }
        throw new Error(ERRORS.OPTIMIZATION_ERR + JSON.stringify(expr));
    };

    function changed() {
        ++changes;
    };

    /* Type Checking */

    function isConst(expr) {
        return expr.type === TYPES.INTEGER
            || expr.type === TYPES.STRING
            || expr.type === TYPES.BOOLEAN;
    };

    function isInt(expr) {
        if (expr.type !== TYPES.INTEGER) {
            throw new Error(`${ERRORS.NAN} ${JSON.stringify(expr)}`);
        }
        return expr.value;
    };

    function isDivisible(expr) {
        if (isInt(expr) === 0) {
            throw new Error(`${ERRORS.ZERO_DIVISION} See: ${JSON.stringify(expr)}`);
        }
        return expr.value;
    };

    /* Processors */

    function procNegation(expr) {
        expr.body = optimize(expr.body);
        return expr;
    };

    function procBinary(expr) {
        expr.left = optimize(expr.left);
        expr.right = optimize(expr.right);
        if (isConst(expr.left) && isConst(expr.right)) {
            switch (expr.operator) {
                case OPERATORS.ADD:
                    changed();
                    return {
                        type: TYPES.INTEGER,
                        value: isInt(expr.left) + isInt(expr.right)
                    };
            
                case OPERATORS.SUB:
                    changed();
                    return {
                        type: TYPES.INTEGER,
                        value: isInt(expr.left) - isInt(expr.right)
                    };
            
                case OPERATORS.MLT:
                    changed();
                    return {
                        type: TYPES.INTEGER,
                        value: isInt(expr.left) * isInt(expr.right)
                    };
            
                case OPERATORS.DIV:
                    changed();
                    return {
                        type: TYPES.INTEGER,
                        value: isInt(expr.left) / isDivisible(expr.right)
                    };
            
                case OPERATORS.MOD:
                    changed();
                    return {
                        type: TYPES.INTEGER,
                        value: isInt(expr.left) % isDivisible(expr.right)
                    };
            
                case OPERATORS.LT:
                    changed();
                    return {
                        type: TYPES.BOOLEAN,
                        value: isInt(expr.left) < isInt(expr.right)
                    };
            
                case OPERATORS.GT:
                    changed();
                    return {
                        type: TYPES.BOOLEAN,
                        value: isInt(expr.left) > isInt(expr.right)
                    };
            
                case OPERATORS.LTE:
                    changed();
                    return {
                        type: TYPES.BOOLEAN,
                        value: isInt(expr.left) <= isInt(expr.right)
                    };
            
                case OPERATORS.GTE:
                    changed();
                    return {
                        type: TYPES.BOOLEAN,
                        value: isInt(expr.left) >= isInt(expr.right)
                    };
            
                case OPERATORS.EQ:
                    changed();
                    if (expr.left.type != expr.right.type) {
                        return { type: TYPES.BOOLEAN, value: false };
                    }
                    return {
                        type: TYPES.BOOLEAN,
                        value: expr.left.value === expr.right.value
                    };
            
                case OPERATORS.IEQ:
                    changed();
                    if (expr.left.type != expr.right.type) {
                        return { type: TYPES.BOOLEAN, value: true };
                    }
                    return {
                        type: TYPES.BOOLEAN,
                        value: expr.left.value !== expr.right.value
                    };
            
                case OPERATORS.OR:
                    changed();
                    if (expr.left.value !== false)
                            return expr.left;
                    return expr.right;
            
                case OPERATORS.AND:
                    changed();
                    if (expr.left.value !== false) {
                        return expr.right;
                    }
                    return { type: TYPES.BOOLEAN, value: false };
                }
            }
        return expr;
    }

    function procAssignment(expr) {
        if (expr.left.type === TYPES.VARIABLE) {
            if (expr.right.type === TYPES.VARIABLE && expr.right.def.cont) {
                changed();
                expr.left.def.refs.forEach((node) => {
                    node.value = expr.right.value;
                });
                return optimize(expr.right); 
            }
            if (expr.left.def.refs.length === expr.left.def.assigned && expr.left.env.parent) {
                changed();
                return optimize(expr.right);
            }
        }
        expr.left = optimize(expr.left);
        expr.right = optimize(expr.right);
        return expr;
    }

    function procConditional(expr) {
        expr.condition = optimize(expr.condition);
        expr.do = optimize(expr.do);
        expr.else = optimize(expr.else || { type: TYPES.BOOLEAN, value: false });
        if (isConst(expr.condition)) {
            changed();
            if (expr.condition.value !== false)
                return expr.do;
            return expr.else;
        }
        return expr;
    }

    function procSequence(expr) {
        if (expr.seq.length === 0) {
            changed();
            return { type: TYPES.BOOLEAN, value: false };
        }
        if (expr.seq.length === 1) {
            changed();
            return optimize(expr.seq[0]);
        }
        if (!computePurity(expr.seq[0])) {
            changed();
            return optimize({
                type: TYPES.SEQUENCE,
                seq: expr.seq.slice(1)
            });
        }
        if (expr.seq.length === 2) {
            return {
                type: TYPES.SEQUENCE,
                seq: expr.seq.map(optimize)
            };
        };
        // normalize
        return optimize({
            type: TYPES.SEQUENCE,
            seq: [
                expr.seq[0],
                { type: TYPES.SEQUENCE, seq: expr.seq.slice(1) }
            ]
        });
    }

    function procCall(expr) {
        const func = expr.func;
        if (func.type === KEYWORDS.FUNCTION && !func.name) {
            if (func.env.parent.parent) {
                return procIIFE(expr);
            }
            func.unguarded = true;
        }
        return {
            type: TYPES.CALL,
            func: optimize(func),
            args: expr.args.map(optimize)
        };
    }

    function procResolver(fn) {
        TCO: if (fn.body.type === TYPES.CALL &&
                 fn.body.func.type === TYPES.VARIABLE &&
                 fn.body.func.def.assigned === 0 &&
                 fn.body.func.env.parent &&
                 fn.vars.indexOf(fn.body.func.value) < 0 &&
                 fn.vars.length === fn.body.args.length) {
            for (let i = 0; i < fn.vars.length; ++i) {
                const x = fn.body.args[i];
                if (x.type !== TYPES.VARIABLE || x.value !== fn.vars[i])
                    break TCO;
            }
            changed();
            return optimize(fn.body.func);
        }
        fn.locs = fn.locs.filter((name) => {
            const def = fn.env.get(name);
            return def.refs.length > 0;
        });
        const save = defun;
        defun = fn;
        fn.body = optimize(fn.body);
        if (fn.body.type === TYPES.CALL) {
            fn.unguarded = true;
        }
        defun = save;
        return fn;
    }

    function procIIFE(expr) {
        changed();
        const func = expr.func;
        const argValues = expr.args.map(optimize);
        const body = optimize(func.body);
        function computeNewName(name) {
            var sym = name in defun.env.vars ? computeNewSymbol(name + "$") : name;
            defun.locs.push(sym);
            defun.env.define(sym, true);
            func.env.get(name).refs.forEach((ref) => {
                ref.value = sym;
            });
            return sym;
        }
        const seq = func.vars.map((name, i) => 
            ({
                type: TYPES.ASSIGNMENT,
                operator: "=",
                left: { type: TYPES.VARIABLE, value: computeNewName(name) },
                right: argValues[i] || { type: TYPES.BOOLEAN, value: false } 
            })
        );
        func.locs.forEach(computeNewName);
        seq.push(body);
        return optimize({
            type: TYPES.SEQUENCE,
            seq
        });
    }
}

function constructClosure(expr) {
    const global = new Context();
    expr.env = global;
    (function scope(expr, env) {
        switch (expr.type) {
            case TYPES.INTEGER: case TYPES.STRING: case TYPES.BOOLEAN:
                break;

            case TYPES.VARIABLE:
                const s = env.lookup(expr.value);
                if (!s) {
                    expr.env = global;
                    global.define(expr.value, { refs: [], assigned: 0 });
                } 
                else {
                    expr.env = s;
                }
                const def = expr.env.get(expr.value);
                def.refs.push(expr);
                expr.def = def;
                break;
                
             case TYPES.NEGATION:
                scope(expr.body, env);
                break;

            case TYPES.ASSIGNMENT:
                scope(expr.left, env);
                scope(expr.right, env);
                if (expr.left.type === TYPES.VARIABLE) {
                    expr.left.def.assigned++;
                }
                break;

            case TYPES.BINARY:
                scope(expr.left, env);
                scope(expr.right, env);
                break;

            case KEYWORDS.CONDITIONAL:
                scope(expr.condition, env);
                scope(expr.do, env);
                if (expr.else) {
                    scope(expr.else, env);
                }
                break;

            case TYPES.SEQUENCE:
                expr.seq.forEach((expr) => {
                    scope(expr, env);
                })
                break;

            case TYPES.CALL:
                scope(expr.func, env);
                expr.args.forEach((expr) => scope(expr, env));
                break;

            case KEYWORDS.FUNCTION:
                expr.env = env = env.extend();
                if (expr.name) {
                    env.define(expr.name, { refs: [], func: true, assigned: 0 });
                }
                expr.vars.forEach((name, i) => {
                    env.define(name, { refs: [], farg: true, assigned: 0, cont: i === 0 });
                });
                if (!expr.locs) {
                    expr.locs = [];
                }
                expr.locs.forEach((name) => {
                    env.define(name, { refs: [], floc: true, assigned: 0 });
                });
                scope(expr.body, env);
                break;
        
            default:
                throw new Error(ERRORS.NODE_FAILURE + JSON.stringify(expr));
        }
    })(expr, global);
    return expr.env;
};

module.exports = CpsOptimizer;