const { ERRORS, KEYWORDS, PRECEDENCE, TYPES, TOKENS } = require("../constants");

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
            return TOKENS.EXPR_OPEN + js(expr.left) + expr.operator + js(expr.right) + TOKENS.EXPR_CLOSE;
        };

        function procAssignment(expr) {
            return procBinary(expr);
        };

        function procResolver(expr) {
            let code = `${TOKENS.EXPR_OPEN}function `;
            if (expr.name) {
                code += constructVariable(expr.name);
            }
            code += TOKENS.EXPR_OPEN + expr.vars.map(constructVariable).join(", ") + TOKENS.EXPR_CLOSE + TOKENS.BLOCK_OPEN;
            code += "return " + js(expr.body) + TOKENS.BLOCK_CLOSE + TOKENS.EXPR_CLOSE;
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
            return TOKENS.EXPR_OPEN + js(iifeNode) + TOKENS.EXPR_CLOSE;
        };

        function procConditional(expr) {
            return TOKENS.EXPR_OPEN
                + js(expr.condition) + " !== false"
                + " ? " + js(expr.do)
                + " : " + js(expr.else || { type: TYPES.BOOLEAN, value: false })
                +  TOKENS.EXPR_CLOSE;
        };

        function procSequence(expr) {
            return TOKENS.EXPR_OPEN + expr.seq.map(js).join(", ") + TOKENS.EXPR_CLOSE;
        };

        function procCall(expr) {
            return js(expr.func) + TOKENS.EXPR_OPEN + expr.args.map(js).join(", ") + TOKENS.EXPR_CLOSE; 
        };
};

module.exports = Transpiler;