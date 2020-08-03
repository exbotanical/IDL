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
            case TYPES.NEGATION:
                return procNegation(expr);
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
            const left = js(expr.left);
            const right = js(expr.right);
            switch(expr.operator) {
                case "&&":
                    if (isBoolean(expr.left)) {
                        break;
                    }
                    return "((" + left + " !== false) && " + right + ")";
                case "||":
                    if (isBoolean(expr.left)) {
                        break;
                    }
                    return "((ε_TMP = " + left + ") !== false ? ε_TMP : " + right + ")";
            }
            return "(" + left + expr.operator + right + ")";
        };

        function procAssignment(expr) {
            return procBinary(expr);
        };

        function procNegation(expr) {
            if (isBoolean(expr.body)) {
                return "!" + js(expr.body);
            }
            return "(" + js(expr.body) + " === false)";
        };

        function procResolver(expr) {
            let code = "(function ", CC;
            if (!expr.unguarded) {
                CC = expr.name || "ε_CC";
                code += constructVariable(CC);
            }
            code += "(" + expr.vars.map(constructVariable).join(", ") + ") {";
            if (expr.locs && expr.locs.length > 0) {
                code += "var " + expr.locs.join(", ") + ";";
            }
            if (!expr.unguarded) {
                code += "STACK_GUARD(arguments, " + CC + "); ";
            }
            code += js(expr.body) + " })";
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
            const cond = js(expr.condition);
            if (!isBoolean(expr.condition)) {
                cond += " !== false";
            }
            return "(" + cond + " ? " + js(expr.do) + " : " + js(expr.else || { type: TYPES.BOOLEAN, value: false }) + ")";
        };
 

        function procSequence(expr) {
            return `(${expr.seq.map(js).join(", ")})`;
        };

        function procCall(expr) {
            return js(expr.func) + `(${expr.args.map(js).join(", ")})`; 
        };

        function isBoolean(expr) {
            switch (expr.type) {
                case TYPES.BOOLEAN: case TYPES.NEGATION:
                    return true;
              case TYPES.CONDITIONAL:
                    return isBoolean(expr.do) || (expr.else && isBoolean(expr.else));
              case TYPES.BINARY:
                if (",<,<=,==,!=,>=,>,".indexOf("," + expr.operator + ",") >= 0) {
                    return true;
                }
                if (expr.operator == "&&" || expr.operator == "||") {
                    return isBoolean(expr.left) && isBoolean(expr.right);
                }
                break;
            }
            return false;
        }
};

module.exports = Transpiler;