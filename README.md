## IDL - A Lisp-like syntax for functional programming

## Table of Contents

 - [Introduction](#intro) 
    * [Packages](#packages)
    * [Features](#features)
 - [Documentation](#docs)
    * [Demos](#demo)

## <a name="intro"></a> Introduction

## <a name="packages"></a> Packages

  - [Recursive Descent Parser](https://github.com/MatthewZito/IDL/tree/master/packages/parser)
    * [Input Stream Processor](https://github.com/MatthewZito/IDL/blob/master/packages/parser/process-input-stream.js)
    * [Lexer / Tokenizer](https://github.com/MatthewZito/IDL/blob/master/packages/parser/lexer.js)
    * [Core Parser](https://github.com/MatthewZito/IDL/blob/master/packages/parser/parser.js)
  - [Interpreter](https://github.com/MatthewZito/IDL/tree/master/packages/interpreter)
    * [CPS Evaluator](https://github.com/MatthewZito/IDL/blob/master/packages/interpreter/context.js)
    * [Constructs and Primitives](https://github.com/MatthewZito/IDL/blob/master/packages/interpreter/constructs.js)
  - [Compiler Set](https://github.com/MatthewZito/IDL/tree/master/packages/compiler)
    * [CPS Transformer](https://github.com/MatthewZito/IDL/blob/master/packages/compiler/CPS-transformer.js)
    * [JavaScript Transpiler](https://github.com/MatthewZito/IDL/blob/master/packages/compiler/transpiler.js)


## <a name="features"></a> Features

  - Stack monitoring and custom garbage collection
  - CPS / Continuations (specifically, IDL control flow is recursively bound by continuation-passing)
  - Recursive Descent Parser
  - Concurrent Lexer for rendering ASTs
  - Compiles to JavaScript (cross-maps IDL ASTs into JavaScript syntax) 300x speed 


## <a name="docs"></a> Documentation

Docs coming soon...

## <a name="demo"></a> Abstractions 

### IDL Code Samples

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

Unlimited Recursion:
```
sum = resolver(n, acc)
if n == 0 do acc
    else sum(n - 1, acc + n);

# compute 1 + 2 + ... + 50000
print(sum(50000, 0));  
# 1250025000
```

### Compiling to JavaScript

IDL:
```
sum = resolver(n, acc)
if n == 0 do acc
    else sum(n - 1, acc + n);

# comments
# will
# be
# ignored
print(sum(50000, 0))
```
JavaScript:
```
((sum=(function (n, acc){return ((n==0) !== false ? acc : sum((n-1), (acc+n)))})), print(sum(50000, 0)))
```

IDL:
```
a = foo();
b = bar();
c = baz();
```

JavaScript:
```
foo(function (ε_R1) {
    return a=ε_R1, bar(function(ε_R2) { 
        return b=ε_R2, baz(function(ε_R3) {
            return c=ε_R3
        });
    });
});
```

### AST Format

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
