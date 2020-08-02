const { ERRORS, KEYWORDS, TYPES } = require("../../constants");

function Transpiler(expr) {
    return js(expr);

    function js(expr) {
        switch (expr.type) {
            case TYPES.INTEGER: case TYPES.STRING: case TYPES.BOOLEAN: 
                return procAtomic(expr);
            case TYPES.VARIABLE: 
                return procVariable(expr);
            case TYPES.BINARY: 
                return procBinary(expr);
            case TYPES.ASSIGNMENT: 
                return procAssignment(expr);
            case KEYWORDS.DECLARATION: 
                return procNamedLet(expr);
            case KEYWORDS.FUNCTION: 
                return procResolver(expr);
            case KEYWORDS.CONDITIONAL:  
                return procConditional(expr);
            case TYPES.SEQUENCE: 
                return procSequence(expr);
            case TYPES.CALL: 
                return procCall(expr);
            default:
                throw new Error(`${ERRORS.COMPILATION_ERR} ${JSON.stringify(expr)}`);
        }
    };

        function procAtomic(expr) {
            return JSON.stringify(expr.value);
        };

        function constructVariable(name) {
            return name;
        };

        function procVariable(expr) {
            return constructVariable(expr.value);
        };

        function procBinary(expr) {
            return "(" + js(expr.left) + expr.operator + js(expr.right) + ")";
        };

        function procAssignment(expr) {
            return procBinary(expr);
        };

        function procResolver(expr) {
            let code = "(function ";
            const CC = expr.name || KEYWORDS.SYMBOL + "CC";
            code += constructVariable(CC);
            code += "(" + expr.vars.map(constructVariable).join(", ") + ")";
            code += `{ STACK_GUARD(arguments, ${CC}); ${js(expr.body)} })`;
            return code;
        };

        function procNamedLet(expr) {
            if (expr.vars.length === 0) {
                return js(expr.body);
            }
            const iifeNode = {
                type: TYPES.CALL,
                func: {
                    type: KEYWORDS.FUNCTION,
                    vars: [ expr.vars[0].name ],
                    body: {
                        type: KEYWORDS.DECLARATION,
                        vars: expr.vars.slice(1),
                        body: expr.body
                    }
                },
                args: [ expr.vars[0].def || { type: TYPES.BOOLEAN, value: false }]
            };
            return `(${js(iifeNode)})`;
        };

        function procConditional(expr) {
            return "("
                + js(expr.condition) + " !== false"
                + " ? " + js(expr.do)
                + " : " + js(expr.else || { type: TYPES.BOOLEAN, value: false })
                +  ")";
        };

        function procSequence(expr) {
            return `(${expr.seq.map(js).join(", ")})`;
        };

        function procCall(expr) {
            return js(expr.func) + `(${expr.args.map(js).join(", ")})`; 
        };
};

module.exports = Transpiler;