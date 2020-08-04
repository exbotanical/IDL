const { ERRORS } = require("../../constants");


let STACK_LEN,
    ROOT_EXECUTION_CONTEXT_ACTIVE = false;

function STACK_GUARD(fn, args) {
    if (--STACK_LEN < 0) {
        throw new Continuation(fn, args);
    }
};

function Continuation(fn, args) {
    this.func = fn;
    this.args = args;
};

function Execute(fn, args) {
    if (ROOT_EXECUTION_CONTEXT_ACTIVE) {
        return fn.apply(null, args);
    }
    ROOT_EXECUTION_CONTEXT_ACTIVE = true;
    while (true) {
        try {
            STACK_LEN = 200;
            fn.apply(null, args);
            break;
        }
        catch(err) {
            if (err instanceof Continuation) {
                fn = err.func;
                args = err.args; 
            }
            else {
                ROOT_EXECUTION_CONTEXT_ACTIVE = false;
                throw err;
            }
        }
    }
    ROOT_EXECUTION_CONTEXT_ACTIVE = false;
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

module.exports = {
    Context,
    Execute,
    STACK_GUARD
};
