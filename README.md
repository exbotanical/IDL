## IDL - A Lisp-like syntax for functional programming

## Table of Contents

 - [Introduction](#intro) 
    * [Packages](#packages)
 - [Documentation](#docs)
    * [Demos](#demo)
    * [Features](#features)

## <a name="intro"></a> Introduction

Code Samples:

Named variables:
```
let (x = 7, y = 9, z = x + y) print(x + y + z); # 32
```

Lambda expressions:
```
fib = resolver(n) if n < 2 do n else fib(n - 1) + fib(n - 2); 
print(fib(10)); # 55
print(fib(20)); # 6765
```


## <a name="packages"></a> Packages

  - [Parser](https://github.com/MatthewZito/IDL/tree/master/packages/parser)
    * [Input Stream Processor](https://github.com/MatthewZito/IDL/blob/master/packages/parser/process-input-stream.js)
    * [Lexer / Tokenizer](https://github.com/MatthewZito/IDL/blob/master/packages/parser/lexer.js)
    * [Core Parser](https://github.com/MatthewZito/IDL/blob/master/packages/parser/parser.js)
  - [Interpreter](https://github.com/MatthewZito/IDL/tree/master/packages/interpreter)
    * [CPS Evaluator](https://github.com/MatthewZito/IDL/blob/master/packages/interpreter/context.js)

## <a name="docs"></a> Documentation

Docs coming soon...

## <a name="demo"></a> Abstractions 

AST outputs for a Fibonacci Resolver:
```
{ token: { type: 'VARIABLE', value: 'fib' } } { type: 'PUNCTUATOR' } { inbound: '(' }
{ token: { type: 'VARIABLE', value: 'fib' } } { type: 'PUNCTUATOR' } { inbound: '{' }
{ token: { type: 'VARIABLE', value: 'fib' } } { type: 'KEYWORD' } { inbound: 'let' }
{ token: { type: 'VARIABLE', value: 'fib' } } { type: 'KEYWORD' } { inbound: 'if' }
{ token: { type: 'VARIABLE', value: 'fib' } } { type: 'KEYWORD' } { inbound: 'true' }
{ token: { type: 'VARIABLE', value: 'fib' } } { type: 'KEYWORD' } { inbound: 'false' }
{ token: { type: 'VARIABLE', value: 'fib' } } { type: 'KEYWORD' } { inbound: 'resolver' }
{ token: { type: 'OPERATOR', value: '=' } } { type: 'PUNCTUATOR' } { inbound: '(' }
{ token: { type: 'OPERATOR', value: '=' } } { type: 'OPERATOR' } { inbound: undefined }
{ token: { type: 'KEYWORD', value: 'resolver' } } { type: 'PUNCTUATOR' } { inbound: '(' }
{ token: { type: 'KEYWORD', value: 'resolver' } } { type: 'PUNCTUATOR' } { inbound: '{' }
{ token: { type: 'KEYWORD', value: 'resolver' } } { type: 'KEYWORD' } { inbound: 'let' }
{ token: { type: 'KEYWORD', value: 'resolver' } } { type: 'KEYWORD' } { inbound: 'if' }
{ token: { type: 'KEYWORD', value: 'resolver' } } { type: 'KEYWORD' } { inbound: 'true' }
{ token: { type: 'KEYWORD', value: 'resolver' } } { type: 'KEYWORD' } { inbound: 'false' }
{ token: { type: 'KEYWORD', value: 'resolver' } } { type: 'KEYWORD' } { inbound: 'resolver' }
{ token: { type: 'PUNCTUATOR', value: '(' } } { type: 'PUNCTUATOR' } { inbound: '(' }
{ token: { type: 'VARIABLE', value: 'n' } } { type: 'PUNCTUATOR' } { inbound: ')' }
{ token: { type: 'VARIABLE', value: 'n' } } { type: 'PUNCTUATOR' } { inbound: ')' }
{ token: { type: 'PUNCTUATOR', value: ')' } } { type: 'PUNCTUATOR' } { inbound: ')' }
{ token: { type: 'PUNCTUATOR', value: ')' } } { type: 'PUNCTUATOR' } { inbound: ')' }
{ token: { type: 'KEYWORD', value: 'if' } } { type: 'PUNCTUATOR' } { inbound: '(' }
{ token: { type: 'KEYWORD', value: 'if' } } { type: 'PUNCTUATOR' } { inbound: '{' }
{ token: { type: 'KEYWORD', value: 'if' } } { type: 'KEYWORD' } { inbound: 'let' }
{ token: { type: 'KEYWORD', value: 'if' } } { type: 'KEYWORD' } { inbound: 'if' }
{ token: { type: 'KEYWORD', value: 'if' } } { type: 'KEYWORD' } { inbound: 'if' }
{ token: { type: 'VARIABLE', value: 'n' } } { type: 'PUNCTUATOR' } { inbound: '(' }
{ token: { type: 'VARIABLE', value: 'n' } } { type: 'PUNCTUATOR' } { inbound: '{' }
{ token: { type: 'VARIABLE', value: 'n' } } { type: 'KEYWORD' } { inbound: 'let' }
{ token: { type: 'VARIABLE', value: 'n' } } { type: 'KEYWORD' } { inbound: 'if' }
{ token: { type: 'VARIABLE', value: 'n' } } { type: 'KEYWORD' } { inbound: 'true' }
{ token: { type: 'VARIABLE', value: 'n' } } { type: 'KEYWORD' } { inbound: 'false' }
{ token: { type: 'VARIABLE', value: 'n' } } { type: 'KEYWORD' } { inbound: 'resolver' }
{ token: { type: 'OPERATOR', value: '<' } } { type: 'PUNCTUATOR' } { inbound: '(' }
{ token: { type: 'OPERATOR', value: '<' } } { type: 'OPERATOR' } { inbound: undefined }
{ token: { type: 'INTEGER', value: 2 } } { type: 'PUNCTUATOR' } { inbound: '(' }
{ token: { type: 'INTEGER', value: 2 } } { type: 'PUNCTUATOR' } { inbound: '{' }
{ token: { type: 'INTEGER', value: 2 } } { type: 'KEYWORD' } { inbound: 'let' }
{ token: { type: 'INTEGER', value: 2 } } { type: 'KEYWORD' } { inbound: 'if' }
{ token: { type: 'INTEGER', value: 2 } } { type: 'KEYWORD' } { inbound: 'true' }
{ token: { type: 'INTEGER', value: 2 } } { type: 'KEYWORD' } { inbound: 'false' }
{ token: { type: 'INTEGER', value: 2 } } { type: 'KEYWORD' } { inbound: 'resolver' }
{ token: { type: 'KEYWORD', value: 'do' } } { type: 'PUNCTUATOR' } { inbound: '(' }
{ token: { type: 'KEYWORD', value: 'do' } } { type: 'OPERATOR' } { inbound: undefined }
{ token: { type: 'KEYWORD', value: 'do' } } { type: 'OPERATOR' } { inbound: undefined }
{ token: { type: 'KEYWORD', value: 'do' } } { type: 'PUNCTUATOR' } { inbound: '(' }
{ token: { type: 'KEYWORD', value: 'do' } } { type: 'PUNCTUATOR' } { inbound: '{' }
{ token: { type: 'KEYWORD', value: 'do' } } { type: 'KEYWORD' } { inbound: 'do' }
{ token: { type: 'VARIABLE', value: 'n' } } { type: 'PUNCTUATOR' } { inbound: '(' }
{ token: { type: 'VARIABLE', value: 'n' } } { type: 'PUNCTUATOR' } { inbound: '{' }
{ token: { type: 'VARIABLE', value: 'n' } } { type: 'KEYWORD' } { inbound: 'let' }
{ token: { type: 'VARIABLE', value: 'n' } } { type: 'KEYWORD' } { inbound: 'if' }
{ token: { type: 'VARIABLE', value: 'n' } } { type: 'KEYWORD' } { inbound: 'true' }
{ token: { type: 'VARIABLE', value: 'n' } } { type: 'KEYWORD' } { inbound: 'false' }
{ token: { type: 'VARIABLE', value: 'n' } } { type: 'KEYWORD' } { inbound: 'resolver' }
{ token: { type: 'KEYWORD', value: 'else' } } { type: 'PUNCTUATOR' } { inbound: '(' }
{ token: { type: 'KEYWORD', value: 'else' } } { type: 'OPERATOR' } { inbound: undefined }
{ token: { type: 'KEYWORD', value: 'else' } } { type: 'PUNCTUATOR' } { inbound: '(' }
{ token: { type: 'KEYWORD', value: 'else' } } { type: 'KEYWORD' } { inbound: 'else' }
{ token: { type: 'VARIABLE', value: 'fib' } } { type: 'PUNCTUATOR' } { inbound: '(' }
{ token: { type: 'VARIABLE', value: 'fib' } } { type: 'PUNCTUATOR' } { inbound: '{' }
{ token: { type: 'VARIABLE', value: 'fib' } } { type: 'KEYWORD' } { inbound: 'let' }
{ token: { type: 'VARIABLE', value: 'fib' } } { type: 'KEYWORD' } { inbound: 'if' }
{ token: { type: 'VARIABLE', value: 'fib' } } { type: 'KEYWORD' } { inbound: 'true' }
{ token: { type: 'VARIABLE', value: 'fib' } } { type: 'KEYWORD' } { inbound: 'false' }
{ token: { type: 'VARIABLE', value: 'fib' } } { type: 'KEYWORD' } { inbound: 'resolver' }
{ token: { type: 'PUNCTUATOR', value: '(' } } { type: 'PUNCTUATOR' } { inbound: '(' }
{ token: { type: 'PUNCTUATOR', value: '(' } } { type: 'PUNCTUATOR' } { inbound: '(' }
{ token: { type: 'VARIABLE', value: 'n' } } { type: 'PUNCTUATOR' } { inbound: ')' }
{ token: { type: 'VARIABLE', value: 'n' } } { type: 'PUNCTUATOR' } { inbound: ')' }
{ token: { type: 'VARIABLE', value: 'n' } } { type: 'PUNCTUATOR' } { inbound: '(' }
{ token: { type: 'VARIABLE', value: 'n' } } { type: 'PUNCTUATOR' } { inbound: '{' }
{ token: { type: 'VARIABLE', value: 'n' } } { type: 'KEYWORD' } { inbound: 'let' }
{ token: { type: 'VARIABLE', value: 'n' } } { type: 'KEYWORD' } { inbound: 'if' }
{ token: { type: 'VARIABLE', value: 'n' } } { type: 'KEYWORD' } { inbound: 'true' }
{ token: { type: 'VARIABLE', value: 'n' } } { type: 'KEYWORD' } { inbound: 'false' }
{ token: { type: 'VARIABLE', value: 'n' } } { type: 'KEYWORD' } { inbound: 'resolver' }
{ token: { type: 'OPERATOR', value: '-' } } { type: 'PUNCTUATOR' } { inbound: '(' }
{ token: { type: 'OPERATOR', value: '-' } } { type: 'OPERATOR' } { inbound: undefined }
{ token: { type: 'INTEGER', value: 1 } } { type: 'PUNCTUATOR' } { inbound: '(' }
{ token: { type: 'INTEGER', value: 1 } } { type: 'PUNCTUATOR' } { inbound: '{' }
{ token: { type: 'INTEGER', value: 1 } } { type: 'KEYWORD' } { inbound: 'let' }
{ token: { type: 'INTEGER', value: 1 } } { type: 'KEYWORD' } { inbound: 'if' }
{ token: { type: 'INTEGER', value: 1 } } { type: 'KEYWORD' } { inbound: 'true' }
{ token: { type: 'INTEGER', value: 1 } } { type: 'KEYWORD' } { inbound: 'false' }
{ token: { type: 'INTEGER', value: 1 } } { type: 'KEYWORD' } { inbound: 'resolver' }
{ token: { type: 'PUNCTUATOR', value: ')' } } { type: 'PUNCTUATOR' } { inbound: '(' }
{ token: { type: 'PUNCTUATOR', value: ')' } } { type: 'OPERATOR' } { inbound: undefined }
{ token: { type: 'PUNCTUATOR', value: ')' } } { type: 'OPERATOR' } { inbound: undefined }
{ token: { type: 'PUNCTUATOR', value: ')' } } { type: 'PUNCTUATOR' } { inbound: '(' }
{ token: { type: 'PUNCTUATOR', value: ')' } } { type: 'PUNCTUATOR' } { inbound: ')' }
{ token: { type: 'PUNCTUATOR', value: ')' } } { type: 'PUNCTUATOR' } { inbound: ')' }
{ token: { type: 'OPERATOR', value: '+' } } { type: 'OPERATOR' } { inbound: undefined }
{ token: { type: 'VARIABLE', value: 'fib' } } { type: 'PUNCTUATOR' } { inbound: '(' }
{ token: { type: 'VARIABLE', value: 'fib' } } { type: 'PUNCTUATOR' } { inbound: '{' }
{ token: { type: 'VARIABLE', value: 'fib' } } { type: 'KEYWORD' } { inbound: 'let' }
{ token: { type: 'VARIABLE', value: 'fib' } } { type: 'KEYWORD' } { inbound: 'if' }
{ token: { type: 'VARIABLE', value: 'fib' } } { type: 'KEYWORD' } { inbound: 'true' }
{ token: { type: 'VARIABLE', value: 'fib' } } { type: 'KEYWORD' } { inbound: 'false' }
{ token: { type: 'VARIABLE', value: 'fib' } } { type: 'KEYWORD' } { inbound: 'resolver' }
{ token: { type: 'PUNCTUATOR', value: '(' } } { type: 'PUNCTUATOR' } { inbound: '(' }
{ token: { type: 'PUNCTUATOR', value: '(' } } { type: 'PUNCTUATOR' } { inbound: '(' }
{ token: { type: 'VARIABLE', value: 'n' } } { type: 'PUNCTUATOR' } { inbound: ')' }
{ token: { type: 'VARIABLE', value: 'n' } } { type: 'PUNCTUATOR' } { inbound: ')' }
{ token: { type: 'VARIABLE', value: 'n' } } { type: 'PUNCTUATOR' } { inbound: '(' }
{ token: { type: 'VARIABLE', value: 'n' } } { type: 'PUNCTUATOR' } { inbound: '{' }
{ token: { type: 'VARIABLE', value: 'n' } } { type: 'KEYWORD' } { inbound: 'let' }
{ token: { type: 'VARIABLE', value: 'n' } } { type: 'KEYWORD' } { inbound: 'if' }
{ token: { type: 'VARIABLE', value: 'n' } } { type: 'KEYWORD' } { inbound: 'true' }
{ token: { type: 'VARIABLE', value: 'n' } } { type: 'KEYWORD' } { inbound: 'false' }
{ token: { type: 'VARIABLE', value: 'n' } } { type: 'KEYWORD' } { inbound: 'resolver' }
{ token: { type: 'OPERATOR', value: '-' } } { type: 'PUNCTUATOR' } { inbound: '(' }
{ token: { type: 'OPERATOR', value: '-' } } { type: 'OPERATOR' } { inbound: undefined }
{ token: { type: 'INTEGER', value: 2 } } { type: 'PUNCTUATOR' } { inbound: '(' }
{ token: { type: 'INTEGER', value: 2 } } { type: 'PUNCTUATOR' } { inbound: '{' }
{ token: { type: 'INTEGER', value: 2 } } { type: 'KEYWORD' } { inbound: 'let' }
{ token: { type: 'INTEGER', value: 2 } } { type: 'KEYWORD' } { inbound: 'if' }
{ token: { type: 'INTEGER', value: 2 } } { type: 'KEYWORD' } { inbound: 'true' }
{ token: { type: 'INTEGER', value: 2 } } { type: 'KEYWORD' } { inbound: 'false' }
{ token: { type: 'INTEGER', value: 2 } } { type: 'KEYWORD' } { inbound: 'resolver' }
{ token: { type: 'PUNCTUATOR', value: ')' } } { type: 'PUNCTUATOR' } { inbound: '(' }
{ token: { type: 'PUNCTUATOR', value: ')' } } { type: 'OPERATOR' } { inbound: undefined }
{ token: { type: 'PUNCTUATOR', value: ')' } } { type: 'OPERATOR' } { inbound: undefined }
{ token: { type: 'PUNCTUATOR', value: ')' } } { type: 'PUNCTUATOR' } { inbound: '(' }
{ token: { type: 'PUNCTUATOR', value: ')' } } { type: 'PUNCTUATOR' } { inbound: ')' }
{ token: { type: 'PUNCTUATOR', value: ')' } } { type: 'PUNCTUATOR' } { inbound: ')' }
{ token: { type: 'PUNCTUATOR', value: ';' } } { type: 'OPERATOR' } { inbound: undefined }
{ token: { type: 'PUNCTUATOR', value: ';' } } { type: 'OPERATOR' } { inbound: undefined }
{ token: { type: 'PUNCTUATOR', value: ';' } } { type: 'PUNCTUATOR' } { inbound: '(' }
{ token: { type: 'PUNCTUATOR', value: ';' } } { type: 'PUNCTUATOR' } { inbound: '(' }
{ token: { type: 'PUNCTUATOR', value: ';' } } { type: 'OPERATOR' } { inbound: undefined }
{ token: { type: 'PUNCTUATOR', value: ';' } } { type: 'PUNCTUATOR' } { inbound: '(' }
{ token: { type: 'PUNCTUATOR', value: ';' } } { type: 'PUNCTUATOR' } { inbound: '(' }
{ token: { type: 'PUNCTUATOR', value: ';' } } { type: 'OPERATOR' } { inbound: undefined }
{ token: { type: 'PUNCTUATOR', value: ';' } } { type: 'OPERATOR' } { inbound: undefined }
{ token: { type: 'PUNCTUATOR', value: ';' } } { type: 'PUNCTUATOR' } { inbound: '(' }
{ token: { type: 'PUNCTUATOR', value: ';' } } { type: 'PUNCTUATOR' } { inbound: ';' }
{ token: { type: 'VARIABLE', value: 'print' } } { type: 'PUNCTUATOR' } { inbound: '(' }
{ token: { type: 'VARIABLE', value: 'print' } } { type: 'PUNCTUATOR' } { inbound: '{' }
{ token: { type: 'VARIABLE', value: 'print' } } { type: 'KEYWORD' } { inbound: 'let' }
{ token: { type: 'VARIABLE', value: 'print' } } { type: 'KEYWORD' } { inbound: 'if' }
{ token: { type: 'VARIABLE', value: 'print' } } { type: 'KEYWORD' } { inbound: 'true' }
{ token: { type: 'VARIABLE', value: 'print' } } { type: 'KEYWORD' } { inbound: 'false' }
{ token: { type: 'VARIABLE', value: 'print' } } { type: 'KEYWORD' } { inbound: 'resolver' }
{ token: { type: 'PUNCTUATOR', value: '(' } } { type: 'PUNCTUATOR' } { inbound: '(' }
{ token: { type: 'PUNCTUATOR', value: '(' } } { type: 'PUNCTUATOR' } { inbound: '(' }
{ token: { type: 'VARIABLE', value: 'fib' } } { type: 'PUNCTUATOR' } { inbound: ')' }
{ token: { type: 'VARIABLE', value: 'fib' } } { type: 'PUNCTUATOR' } { inbound: ')' }
{ token: { type: 'VARIABLE', value: 'fib' } } { type: 'PUNCTUATOR' } { inbound: '(' }
{ token: { type: 'VARIABLE', value: 'fib' } } { type: 'PUNCTUATOR' } { inbound: '{' }
{ token: { type: 'VARIABLE', value: 'fib' } } { type: 'KEYWORD' } { inbound: 'let' }
{ token: { type: 'VARIABLE', value: 'fib' } } { type: 'KEYWORD' } { inbound: 'if' }
{ token: { type: 'VARIABLE', value: 'fib' } } { type: 'KEYWORD' } { inbound: 'true' }
{ token: { type: 'VARIABLE', value: 'fib' } } { type: 'KEYWORD' } { inbound: 'false' }
{ token: { type: 'VARIABLE', value: 'fib' } } { type: 'KEYWORD' } { inbound: 'resolver' }
{ token: { type: 'PUNCTUATOR', value: '(' } } { type: 'PUNCTUATOR' } { inbound: '(' }
{ token: { type: 'PUNCTUATOR', value: '(' } } { type: 'PUNCTUATOR' } { inbound: '(' }
{ token: { type: 'INTEGER', value: 20 } } { type: 'PUNCTUATOR' } { inbound: ')' }
{ token: { type: 'INTEGER', value: 20 } } { type: 'PUNCTUATOR' } { inbound: ')' }
{ token: { type: 'INTEGER', value: 20 } } { type: 'PUNCTUATOR' } { inbound: '(' }
{ token: { type: 'INTEGER', value: 20 } } { type: 'PUNCTUATOR' } { inbound: '{' }
{ token: { type: 'INTEGER', value: 20 } } { type: 'KEYWORD' } { inbound: 'let' }
{ token: { type: 'INTEGER', value: 20 } } { type: 'KEYWORD' } { inbound: 'if' }
{ token: { type: 'INTEGER', value: 20 } } { type: 'KEYWORD' } { inbound: 'true' }
{ token: { type: 'INTEGER', value: 20 } } { type: 'KEYWORD' } { inbound: 'false' }
{ token: { type: 'INTEGER', value: 20 } } { type: 'KEYWORD' } { inbound: 'resolver' }
{ token: { type: 'PUNCTUATOR', value: ')' } } { type: 'PUNCTUATOR' } { inbound: '(' }
{ token: { type: 'PUNCTUATOR', value: ')' } } { type: 'OPERATOR' } { inbound: undefined }
{ token: { type: 'PUNCTUATOR', value: ')' } } { type: 'PUNCTUATOR' } { inbound: '(' }
{ token: { type: 'PUNCTUATOR', value: ')' } } { type: 'PUNCTUATOR' } { inbound: ')' }
{ token: { type: 'PUNCTUATOR', value: ')' } } { type: 'PUNCTUATOR' } { inbound: ')' }
{ token: { type: 'PUNCTUATOR', value: ')' } } { type: 'OPERATOR' } { inbound: undefined }
{ token: { type: 'PUNCTUATOR', value: ')' } } { type: 'PUNCTUATOR' } { inbound: '(' }
{ token: { type: 'PUNCTUATOR', value: ')' } } { type: 'PUNCTUATOR' } { inbound: ')' }
{ token: { type: 'PUNCTUATOR', value: ')' } } { type: 'PUNCTUATOR' } { inbound: ')' }
{ token: { type: 'PUNCTUATOR', value: ';' } } { type: 'OPERATOR' } { inbound: undefined }
{ token: { type: 'PUNCTUATOR', value: ';' } } { type: 'PUNCTUATOR' } { inbound: '(' }
{ token: { type: 'PUNCTUATOR', value: ';' } } { type: 'PUNCTUATOR' } { inbound: ';' }
```







## Accreditations
The design of this interpreter is heavily based on an implementation by Mihai Bazon. The parser is likewise heavily based on patterns and designs by Marijn Haverbeke. 
