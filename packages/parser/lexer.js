const TOKENS = require("./constants/tokens.js");
const TYPES = require("./constants/types.js");
const ERRORS = require("./constants/errors.js");

const RenderTokenStream = input => {
    let _current = null,
        _keywords = " if then else lambda true false ";
    
    /* Token Identifiers */

    // via `indexOf` - ever-so-slightly faster than evaluating an array
    const isKeyword = char => _keywords.indexOf(` ${char} `) >= 0;
    const isDigit = char => TOKENS.DIGIT.test(char);
    const isIdentifierStart = char => TOKENS.IDENTIFIER_START.test(char);
    const isIdentifier =  char => isIdentifierStart(char) || TOKENS.IDENTIFIER.indexOf(char) >= 0;
    const isOperator = char => TOKENS.OPERATOR.indexOf(char) >= 0;
    const isPunctuator = char => TOKENS.PUNCTUATOR.indexOf(char) >= 0;
    const isWhiteSpace = char => TOKENS.WHITESPACE.indexOf(char) >= 0;

    // continue parsing while predicate eval
    const parseWhile = predicate => {
        let ephemeralStr = "";
        while (!input.eof() && predicate(input.peek())) {
            ephemeralStr += input.next();
        }
        return ephemeralStr;
    };
    
    const parseInteger = () => {
        let delimiterExtant = false;
        const integer = parseWhile(
            (char) => {
                if (char === ".") {
                    if (delimiterExtant) {
                        return false;
                    }
                    delimiterExtant = true;
                    return true;
                }
                return isDigit(char);
            }
        );
        return { type: TYPES.INTEGER, value: parseFloat(integer) };
    };

    const parseIdentifier = () => {
        let identifier = parseWhile(isIdentifier);
        return {
            type: isKeyword(identifier) ? TYPES.KEYWORD : TYPES.VARIABLE,
            value: identifier
        };
    };

    const parseEscape = sequenceEnd => {
        let isEscaped = false, 
            ephemeralStr = "";
        // explicit advance 
        input.next();
        while (!input.eof()) {
            const char = input.next();
            if (isEscaped) {
                ephemeralStr += char;
                isEscaped = false;
            } 
            else if (char === TOKENS.ESCAPE) {
                isEscaped = true;
            } 
            else if (char === sequenceEnd) {
                break;
            } 
            else {
                ephemeralStr += char;
            }
        }
        return ephemeralStr;
    };

    const parseString = () => ({ type: TYPES.STRING, value: parseEscape(TOKENS.QUOTE) });
    
    const parseComment = () => {
        parseWhile(
            (char) => char !== TOKENS.NEWLINE
        );
        input.next();
    };

    const parseNext = () => {
        parseWhile(isWhiteSpace);
        if (input.eof()) {
            return null;
        }
        const char = input.peek();
        if (char === TOKENS.COMMENT_START) {
            parseComment();
            return parseNext();
        }
        if (char === TOKENS.QUOTE) {
            return parseString();
        }
        if (isDigit(char)) {
            return parseInteger();
        }
        if (isIdentifierStart(char)) {
            return parseIdentifier();
        }
        if (isPunctuator(char)) {
            return {
                type: TYPES.PUNCTUATOR,
                value: input.next()
            };
        }
        if (isOperator(char)) {
            return {
                type: TYPES.OPERATOR,
                value: parseWhile(isOperator)
            }
        };
        input.term(`${ERRORS.UNKNOWN}: ${char}`);
    };

    // either current val, or explicitly advance
    const peek = () => _current || (_current = parseNext());
    
    const next = () => {
        let token = _current;
        _current = null;
        return token || parseNext();
    };

    const eof = () => peek() === null;
    
    return {
        next,
        peek,
        eof,
        term: input.term
    };
};

module.exports = RenderTokenStream;