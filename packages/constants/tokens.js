module.exports = TOKENS = {
    DIGIT: /[0-9]/i,
    IDENTIFIER_START: /[a-z_]/i,
    IDENTIFIER: "?!-<>=0123456789",
    OPERATOR: "+-*/%=&|<>!",
    PUNCTUATOR: ",;(){}[]",
    WHITESPACE: " \t\n",
    COMMENT_START: "#",
    NEWLINE: "\n",
    QUOTE: '"',
    ESCAPE: "\\",
    ASSIGNMENT: "=",
    EXPR_OPEN: "(",
    EXPR_CLOSE: ")",
    BLOCK_OPEN: "{",
    BLOCK_CLOSE: "}",
    END_EXPR: ";",
    DELIMITER: ","
};