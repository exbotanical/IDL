const { TYPES, KEYWORDS } = require("../../constants");

module.exports = computePurity = (expr) => {
    switch (expr.type) {
        case TYPES.CALL: case TYPES.ASSIGNMENT:
            return true;
        case TYPES.INTEGER: case TYPES.STRING: case TYPES.BOOLEAN: case TYPES.VARIABLE: case KEYWORDS.FUNCTION:
            return false;
        case TYPES.BINARY:
            return computePurity(expr.left) || computePurity(expr.right);
        case KEYWORDS.CONDITIONAL:
            return computePurity(expr.condition) || computePurity(expr.do) || expr.else && computePurity(expr.else);
        case KEYWORDS.DECLARATION:
            for (let i = 0; i < expr.vars.length; ++i) {
                const v = expr.vars[i];
                if (v.def && computePurity(v.def)) {
                    return true;
                }
            }
            return computePurity(expr.body);
        case TYPES.SEQUENCE:
            for (let i = 0; i < expr.seq.length; ++i) {
                if (computePurity(expr.seq[i])) {
                    return true;
                }
            }
            return false;
    }
    return true;
};