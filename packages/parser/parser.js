const { ERRORS, KEYWORDS, PRECEDENCE, TYPES, TOKENS } = require("./constants");

// recursive descent parser
const parse = input => {

    const procIs = (type, inbound) => {
        const token = input.peek();
        return token && token.type === type && (!inbound || token.value === inbound) && token;
    };
    
    const isPunctuator = inbound => procIs(TYPES.PUNCTUATOR, inbound);

    const isKeyword = inbound => procIs(TYPES.KEYWORD, inbound);

    const isOperator = inbound => procIs(TYPES.OPERATOR, inbound);

    const passPunctuator = inbound => isPunctuator(inbound) ? input.next() : input.term(ERRORS.NO_PUNCTUATOR, inbound);

    const passKeyword = inbound => isKeyword(inbound) ? input.next() : input.term(ERRORS.NO_KEYWORD, inbound);

    const passOperator = inbound => isOperator(inbound) ? input.next() : input.term(ERRORS.NO_OPERATOR, inbound);

    const unexpected = () => input.term(ERRORS.TOKEN_ERR, JSON.stringify(input.peek()));

    const isNextBinary = (left, precedence) => {
        const token = isOperator();
        if (token) {
            const metric = PRECEDENCE[token.value];
            if (metric > precedence) {
                input.next();
                return isNextBinary({
                    type: token.value === TOKENS.ASSIGNMENT ? TYPES.ASSIGNMENT : TYPES.BINARY,
                    operator: token.value,
                    left,
                    right: isNextBinary(parseAtom(), metric)
                }, precedence);
            }
        }
        return left;
    };

    const delimited = (begin, end, imperative, parser) => {
        const collatedArgs = [];
        let initialChar = true;
        passPunctuator(begin);
        while (!input.eof()) {
            if (isPunctuator(end)) {
                break;
            }
            if (initialChar) {
                initialChar = false; 
            }
            else {
                passPunctuator(imperative);
            }
            if (isPunctuator(end)) {
                break;
            }
            collatedArgs.push(parser());
        }
        passPunctuator(end);
        return collatedArgs;
    };

    const parseCall = func => ({
            type: TYPES.CALL,
            func,
            args: delimited(TOKENS.PARENS_OPEN, TOKENS.PARENS_CLOSE, TOKENS.DELIMITER, parseExpression),
        });

    function parseVariable() {
        const token = input.next();
        if (token.type !== KEYWORDS.VARIABLE) {
            input.term(ERRORS.NO_VARNAME);
        }
        return token.value;
    };

    function parseIfStatement() {
        passKeyword(KEYWORDS.CONDITIONAL);
        const condition = parseExpression();
        if (!isPunctuator(TOKENS.BLOCK_OPEN)) {
            passKeyword(KEYWORDS.PROC);
        }
        const then = parseExpression();

        let conditionalExpression = {
            type: KEYWORDS.CONDITIONAL,
            condition,
            then,
        };
        if (isKeyword(KEYWORDS.ALTERNATIVE)) {
            input.next();
            conditionalExpression.else = parseExpression();
        }
        return conditionalExpression;
    };

    const parseResolution = () => ({
            type: KEYWORDS.FUNCTION,
            vars: delimited(TOKENS.PARENS_OPEN, TOKENS.PARENS_CLOSE, TOKENS.DELIMITER, parseVariable),
            body: parseExpression()
        });
    
    const parseBoolean = () => ({
            type: TYPES.BOOLEAN,
            value: input.next().value === KEYWORDS.TRUE
        });
    
    const isNextCall = inbound => {
        inbound = inbound();
        return isPunctuator(TOKENS.PARENS_OPEN) ? parseCall(inbound) : inbound;
    };

    function parseAtom() {
        return isNextCall(() => {
            if (isPunctuator(TOKENS.PARENS_OPEN)) {
                input.next();
                const expression = parseExpression();
                passPunctuator(TOKENS.PARENS_CLOSE);
                return expression;
            }
            if (isPunctuator(TOKENS.BLOCK_OPEN)) {
                return parseSequence();
            }
            if (isKeyword(KEYWORDS.CONDITIONAL)) {
                return parseIfStatement();
            }
            if (isKeyword(KEYWORDS.TRUE) || isKeyword(KEYWORDS.FALSE)) {
                return parseBoolean();
            }
            if (isKeyword(KEYWORDS.FUNCTION)) {
                input.next();
                return parseResolution();
            }
            const token = input.next();
            if (token.type === TYPES.VARIABLE || token.type === TYPES.INTEGER || token.type === TYPES.STRING) {
                return token;
            }
            unexpected();
        });
    };

    const parseRoot = () => {
        const seq = [];
        while (!input.eof()) {
            seq.push(parseExpression());
            if (!input.eof()) {
                passPunctuator(TOKENS.END_EXPR);
            }
        }
        return { type: TYPES.CALL, seq };
    };
    
    const parseSequence = () => {
        const seq = delimited(TOKENS.BLOCK_OPEN, TOKENS.BLOCK_CLOSE, TOKENS.END_EXPR, parseExpression);
        if (seq.length === 0) {
            return { type: TYPES.BOOLEAN, value: false };
        }
        if (seq.length === 1) { 
            return seq[0];
        }
        return { type: TYPES.CALL, seq };
    };
 
    const parseExpression = () => {
        return isNextCall(() => {
            return isNextBinary(parseAtom(), 0);
        });
    };

    return parseRoot();

};

module.exports = parse;

