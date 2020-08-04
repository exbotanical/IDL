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
  - [CPS Optimizer](https://github.com/MatthewZito/IDL/blob/master/packages/optimizer/CPS-optimizer.js)
  - [Node.js Runtime](https://github.com/MatthewZito/IDL/blob/master/packages/environment/synthetic-runtime.js)

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
IDL code samples have been relocated to [this directory](https://github.com/MatthewZito/IDL/blob/master/examples)

### Compiling to JavaScript (and optimizing)

IDL:
```
(resolver(){
    let (a = 2) {
      let (a = 3) {
        print(a);
      };
      print(a);
    };
  })();
```

JavaScript (pre-optimization):
```
(function ε_CC(ε_K1) { 
    STACK_GUARD(arguments, ε_CC); 
    (function ε_CC(ε_K2, a) { 
        STACK_GUARD(arguments, ε_CC); 
        (function ε_CC(ε_K3, a) { 
            STACK_GUARD(arguments, ε_CC); 
            print((function ε_CC(ε_R4) { 
                STACK_GUARD(arguments, ε_CC); 
                ε_K3(ε_R4) 
            }), a) 
        }) 
        ((function ε_CC(ε_R5) { 
            STACK_GUARD(arguments, ε_CC); 
            print((function ε_CC(ε_R6) { 
                STACK_GUARD(arguments, ε_CC); 
                ε_K2(ε_R6) 
            }), a) 
        }), 3) 
    })
    ((function ε_CC(ε_R7) { 
        STACK_GUARD(arguments, ε_CC); 
        ε_K1(ε_R7) 
    }), 2) 
})
((function ε_CC(ε_R8) {
     STACK_GUARD(arguments, ε_CC); 
     ε_R8 
    }))
```

Post-optimization:
```
(function (ε_K1) { 
    var a, ε_K3, ε_a$1;
    ((a=2), ((ε_K3 = (function (ε_R5) { 
        print(ε_K1, a) 
    })), ((ε_a$1=3), 
        print((function (ε_R4) { 
            ε_K3(ε_R4) 
        }), ε_a$1)))) })((function (ε_R8) { 
            ε_TOPLEVEL(ε_R8) 
        }));
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
