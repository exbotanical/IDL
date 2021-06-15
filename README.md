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

  - Stack monitoring and garbage collection
  - CPS / Continuations (specifically, IDL control flow is recursively bound by continuation-passing)
  - Recursive Descent Parser
  - Concurrent Lexer for rendering ASTs
  - Compiles to JavaScript (cross-maps IDL ASTs into JavaScript syntax)

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
