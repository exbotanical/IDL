const { ERRORS, KEYWORDS, PRECEDENCE, TYPES, TOKENS } = require("../constants");

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

function evaluate(expr, env) {
    switch (expr.type) {
        case TYPES.INTEGER: case TYPES.STRING: case TYPES.BOOLEAN:
            return expr.value;
        case TYPES.VARIABLE:
            return env.get(expr.value);

        case TYPES.ASSIGNMENT:
            if (expr.left.type !== TYPES.VARIABLE) {
                throw new Error(`${ERRORS.EXPECT_VAR} ${JSON.stringify(expr.left)}`);
            }
            return env.set(expr.left.value, evaluate(expr.right, env));

        case TYPES.BINARY:
            return applyOperator(
                expr.operator,
                evaluate(expr.left, env),
                evaluate(expr.right, env)
            );

        case KEYWORDS.FUNCTION:
            return constructResolver(env, expr);

        case KEYWORDS.CONDITIONAL:
            const condition = evaluate(expr.condition, env);
            if (condition !== false) {
                return evaluate(expr.then, env);
            }
            return expr.else ? evaluate(expr.else, env) : false;

        case TYPES.SEQUENCE:
            let ephemeralVal = false;
            expr.seq.forEach(expr => { 
                ephemeralVal = evaluate(expr, env);
            });
            return ephemeralVal;

        case TYPES.CALL:
            const caller = evaluate(expr.func, env);
            return caller.apply(
                null, 
                expr.args.map(arg => evaluate(arg, env)
        ));

        case KEYWORDS.DECLARATION:
            expr.vars.forEach((v) => {
                const scope = env.extend();
                scope.define(v.name, v.def ? evaluate(v.def, env) : false);
                env = scope;
            });
            return evaluate(expr.body, env);

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

function constructResolver(env, exp) {
    // if func name is extant, extend the scope, pointing said name at closure created herein
    // this is how we handle `{{KEYWORDS.VAR}}`
    if (exp.name) {                    
        env = env.extend();            
        env.def(exp.name, resolver); 
    }           
    function resolver(...args) {
        const variables = exp.vars,
            context = env.extend();
        for (let i = 0; i < variables.length; ++i) {
            console.log("i", context, variables, i);
            context.define(variables[i], i < args.length ? args[i] : false);
        }
        return evaluate(exp.body, context);
    }
    return resolver;
};

module.exports = {
    Context,
    evaluate
};
