# Babel 插件手册

这篇文档涵盖了如何创建 [Babel](https://babeljs.io) [插件](https://babeljs.io/docs/advanced/plugins/)等方面的内容。.

[![cc-by-4.0](https://licensebuttons.net/l/by/4.0/80x15.png)](http://creativecommons.org/licenses/by/4.0/)

这本手册提供了多种语言的版本，查看 [自述文件](/README.md) 里的完整列表。

# 目录

  * [介绍](#toc-introduction)
  * [基础](#toc-basics) 
      * [抽象语法树（ASTs）](#toc-asts)
      * [Babel 的处理步骤](#toc-stages-of-babel)
      * [解析](#toc-parse) 
          * [词法分析](#toc-lexical-analysis)
          * [语法分析](#toc-syntactic-analysis)
      * [转换](#toc-transform)
      * [生成](#toc-generate)
      * [遍历](#toc-traversal)
      * [Visitors（访问者）](#toc-visitors)
      * [Paths（路径）](#toc-paths) 
          * [Paths in Visitors（存在于访问者中的路径）](#toc-paths-in-visitors)
      * [State（状态）](#toc-state)
      * [Scopes（作用域）](#toc-scopes) 
          * [Bindings（绑定）](#toc-bindings)
  * [API](#toc-api) 
      * [babylon](#toc-babylon)
      * [babel-traverse](#toc-babel-traverse)
      * [babel-types](#toc-babel-types)
      * [Definitions（定义）](#toc-definitions)
      * [Builders（构建器）](#toc-builders)
      * [Validators（验证器）](#toc-validators)
      * [Converters（变换器）](#toc-converters)
      * [babel-generator](#toc-babel-generator)
      * [babel-template](#toc-babel-template)
  * [编写你的第一个 Babel 插件](#toc-writing-your-first-babel-plugin)
  * [转换操作](#toc-transformation-operations) 
      * [访问](#toc-visiting)
      * [获取子节点的Path](#toc-get-the-path-of-a-sub-node)
      * [检查节点的类型](#toc-check-if-a-node-is-a-certain-type)
      * [Check if a path is a certain type](#toc-check-if-a-path-is-a-certain-type)
      * [Check if an identifier is referenced](#toc-check-if-an-identifier-is-referenced)
      * [Find a specific parent path](#toc-find-a-specific-parent-path)
      * [Get Sibling Paths](#toc-get-sibling-paths)
      * [Stopping Traversal](#toc-stopping-traversal)
      * [处理](#toc-manipulation)
      * [Replacing a node](#toc-replacing-a-node)
      * [Replacing a node with multiple nodes](#toc-replacing-a-node-with-multiple-nodes)
      * [Replacing a node with a source string](#toc-replacing-a-node-with-a-source-string)
      * [Inserting a sibling node](#toc-inserting-a-sibling-node)
      * [Inserting into a container](#toc-inserting-into-a-container)
      * [Removing a node](#toc-removing-a-node)
      * [Replacing a parent](#toc-replacing-a-parent)
      * [Removing a parent](#toc-removing-a-parent)
      * [Scope（作用域）](#toc-scope)
      * [Checking if a local variable is bound](#toc-checking-if-a-local-variable-is-bound)
      * [Generating a UID](#toc-generating-a-uid)
      * [Pushing a variable declaration to a parent scope](#toc-pushing-a-variable-declaration-to-a-parent-scope)
      * [Rename a binding and its references](#toc-rename-a-binding-and-its-references)
  * [插件选项](#toc-plugin-options) 
      * [Pre and Post in Plugins](#toc-pre-and-post-in-plugins)
      * [Enabling Syntax in Plugins](#toc-enabling-syntax-in-plugins)
  * [构建节点](#toc-building-nodes)
  * [最佳实践](#toc-best-practices) 
      * [尽量避免遍历抽象语法树（AST）](#toc-avoid-traversing-the-ast-as-much-as-possible)
      * [及时合并访问者对象](#toc-merge-visitors-whenever-possible)
      * [可以手动查找就不要遍历](#toc-do-not-traverse-when-manual-lookup-will-do)
      * [优化嵌套的访问者对象](#toc-optimizing-nested-visitors)
      * [留意嵌套结构](#toc-being-aware-of-nested-structures)

# <a id="toc-introduction"></a>介绍

Babel 是一个通用的多功能的 JavaScript 编译器。此外它还拥有众多模块可用于不同形式的静态分析。

> 静态分析是在不需要执行代码的前提下对代码进行分析的处理过程 （执行代码的同时进行代码分析即是动态分析）。 静态分析的目的是多种多样的， 它可用于语法检查，编译，代码高亮，代码转换，优化，压缩等等场景。

你可以使用 Babel 创建多种类型的工具来帮助你更有效率并且写出更好的程序。

> ***在 Twitter 上关注 [@thejameskyle](https://twitter.com/thejameskyle)，第一时间获取更新。***

* * *

# <a id="toc-basics"></a>基础

Babel 是 JavaScript 编译器，更确切地说是源码到源码的编译器，通常也叫做“转换编译器（transpiler）”。 意思是说你为 Babel 提供一些 JavaScript 代码，Babel 更改这些代码，然后返回给你新生成的代码。

## <a id="toc-asts"></a>抽象语法树（ASTs）

这个处理过程中的每一步都涉及到创建或是操作[抽象语法树](https://en.wikipedia.org/wiki/Abstract_syntax_tree)，亦称 AST。

> Babel 使用一个基于 [ESTree](https://github.com/estree/estree) 并修改过的 AST，它的内核说明文档可以在[这里](https://github.com/babel/babel/blob/master/doc/ast/spec.md)找到。.

```js
function square(n) {
  return n * n;
}
```

> [AST Explorer](http://astexplorer.net/) 可以让你对 AST 节点有一个更好的感性认识。 [这里](http://astexplorer.net/#/Z1exs6BWMq)是上述代码的一个示例链接。

This same program can be represented as a tree like this:

```md
- FunctionDeclaration:
  - id:
    - Identifier:
      - name: square
  - params [1]
    - Identifier
      - name: n
  - body:
    - BlockStatement
      - body [1]
        - ReturnStatement
          - argument
            - BinaryExpression
              - operator: *
              - left
                - Identifier
                  - name: n
              - right
                - Identifier
                  - name: n
```

或是如下所示的 JavaScript Object（对象）：

```js
{
  type: "FunctionDeclaration",
  id: {
    type: "Identifier",
    name: "square"
  },
  params: [{
    type: "Identifier",
    name: "n"
  }],
  body: {
    type: "BlockStatement",
    body: [{
      type: "ReturnStatement",
      argument: {
        type: "BinaryExpression",
        operator: "*",
        left: {
          type: "Identifier",
          name: "n"
        },
        right: {
          type: "Identifier",
          name: "n"
        }
      }
    }]
  }
}
```

你会留意到 AST 的每一层都拥有相同的结构：

```js
{
  type: "FunctionDeclaration",
  id: {...},
  params: [...],
  body: {...}
}
```

```js
{
  type: "Identifier",
  name: ...
}
```

```js
{
  type: "BinaryExpression",
  operator: ...,
  left: {...},
  right: {...}
}
```

> 注意：出于简化的目的移除了某些属性

这样的每一层结构也被叫做 **节点（Node）**。 一个 AST 可以由单一的节点或是成百上千个节点构成。 它们组合在一起可以描述用于静态分析的程序语法。

每一个节点都有如下所示的接口（Interface）：

```typescript
interface Node {
  type: string;
}
```

字符串形式的 `type` 字段表示节点的类型（如： `"FunctionDeclaration"`，`"Identifier"`，或 `"BinaryExpression"`）。 每一种类型的节点定义了一些附加属性用来进一步描述该节点类型。

Babel 还为每个节点额外生成了一些属性，用于描述该节点在原始代码中的位置。

```js
{
  type: ...,
  start: 0,
  end: 38,
  loc: {
    start: {
      line: 1,
      column: 0
    },
    end: {
      line: 3,
      column: 1
    }
  },
  ...
}
```

每一个节点都会有 `start`，`end`，`loc` 这几个属性。

## <a id="toc-stages-of-babel"></a>Babel 的处理步骤

Babel 的三个主要处理步骤分别是： **解析（parse）**，**转换（transform）**，**生成（generate）**。.

### <a id="toc-parse"></a>解析

**解析**步骤接收代码并输出 AST。 这个步骤分为两个阶段：[**词法分析（Lexical Analysis） **](https://en.wikipedia.org/wiki/Lexical_analysis)和 [**语法分析（Syntactic Analysis）**](https://en.wikipedia.org/wiki/Parsing)。.

#### <a id="toc-lexical-analysis"></a>词法分析

词法分析阶段把字符串形式的代码转换为 **令牌（tokens）** 流。.

你可以把令牌看作是一个扁平的语法片段数组：

```js
n * n;
```

```js
[
  { type: { ... }, value: "n", start: 0, end: 1, loc: { ... } },
  { type: { ... }, value: "*", start: 2, end: 3, loc: { ... } },
  { type: { ... }, value: "n", start: 4, end: 5, loc: { ... } },
  ...
]
```

每一个 `type` 有一组属性来描述该令牌：

```js
{
  type: {
    label: 'name',
    keyword: undefined,
    beforeExpr: false,
    startsExpr: true,
    rightAssociative: false,
    isLoop: false,
    isAssign: false,
    prefix: false,
    postfix: false,
    binop: null,
    updateContext: null
  },
  ...
}
```

和 AST 节点一样它们也有 `start`，`end`，`loc` 属性。.

#### <a id="toc-syntactic-analysis"></a>语法分析

语法分析阶段会把一个令牌流转换成 AST 的形式。 这个阶段会使用令牌中的信息把它们转换成一个 AST 的表述结构，这样更易于后续的操作。

### <a id="toc-transform"></a>转换

[转换](https://en.wikipedia.org/wiki/Program_transformation)步骤接收 AST 并对其进行遍历，在此过程中对节点进行添加、更新及移除等操作。 这是 Babel 或是其他编译器中最复杂的过程 同时也是插件将要介入工作的部分，这将是本手册的主要内容， 因此让我们慢慢来。

### <a id="toc-generate"></a>生成

[代码生成](https://en.wikipedia.org/wiki/Code_generation_(compiler))步骤把最终（经过一系列转换之后）的 AST 转换成字符串形式的代码，同时还会创建[源码映射（source maps）](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/)。.

代码生成其实很简单：深度优先遍历整个 AST，然后构建可以表示转换后代码的字符串。

## <a id="toc-traversal"></a>遍历

想要转换 AST 你需要进行递归的[树形遍历](https://en.wikipedia.org/wiki/Tree_traversal)。

比方说我们有一个 `FunctionDeclaration` 类型。它有几个属性：`id`，`params`，和 `body`，每一个都有一些内嵌节点。

```js
{
  type: "FunctionDeclaration",
  id: {
    type: "Identifier",
    name: "square"
  },
  params: [{
    type: "Identifier",
    name: "n"
  }],
  body: {
    type: "BlockStatement",
    body: [{
      type: "ReturnStatement",
      argument: {
        type: "BinaryExpression",
        operator: "*",
        left: {
          type: "Identifier",
          name: "n"
        },
        right: {
          type: "Identifier",
          name: "n"
        }
      }
    }]
  }
}
```

于是我们从 `FunctionDeclaration` 开始并且我们知道它的内部属性（即：`id`，`params`，`body`），所以我们依次访问每一个属性及它们的子节点。

接着我们来到 `id`，它是一个 `Identifier`。`Identifier` 没有任何子节点属性，所以我们继续。

之后是 `params`，由于它是一个数组节点所以我们访问其中的每一个，它们都是 `Identifier` 类型的单一节点，然后我们继续。

此时我们来到了 `body`，这是一个 `BlockStatement` 并且也有一个 `body`节点，而且也是一个数组节点，我们继续访问其中的每一个。

这里唯一的一个属性是 `ReturnStatement` 节点，它有一个 `argument`，我们访问 `argument` 就找到了 `BinaryExpression`。.

`BinaryExpression` 有一个 `operator`，一个 `left`，和一个 `right`。 Operator 不是一个节点，它只是一个值因此我们不用继续向内遍历，我们只需要访问 `left` 和 `right`。.

Babel 的转换步骤全都是这样的遍历过程。

### <a id="toc-visitors"></a>Visitors（访问者）

当我们谈及“进入”一个节点，实际上是说我们在**访问**它们， 之所以使用这样的术语是因为有一个[**访问者模式（visitor）**](https://en.wikipedia.org/wiki/Visitor_pattern)的概念。.

访问者是一个用于 AST 遍历的跨语言的模式。 简单的说它们就是一个对象，定义了用于在一个树状结构中获取具体节点的方法。 这么说有些抽象所以让我们来看一个例子。

```js
const MyVisitor = {
  Identifier() {
    console.log("Called!");
  }
};

// You can also create a visitor and add methods on it later
let visitor = {};
visitor.MemberExpression = function() {};
visitor.FunctionDeclaration = function() {}
```

> **注意**： `Identifier() { ... }` 是 `Identifier: { enter() { ... } }` 的简写形式。.

这是一个简单的访问者，把它用于遍历中时，每当在树中遇见一个 `Identifier` 的时候会调用 `Identifier()` 方法。

所以在下面的代码中 `Identifier()` 方法会被调用四次（包括 `square` 在内，总共有四个 `Identifier`）。).

```js
function square(n) {
  return n * n;
}
```

```js
Called!
Called!
Called!
Called!
```

这些调用都发生在**进入**节点时，不过有时候我们也可以在**退出**时调用访问者方法。.

假设我们有一个树状结构：

```js
- FunctionDeclaration
  - Identifier (id)
  - Identifier (params[0])
  - BlockStatement (body)
    - ReturnStatement (body)
      - BinaryExpression (argument)
        - Identifier (left)
        - Identifier (right)
```

当我们向下遍历这颗树的每一个分支时我们最终会走到尽头，于是我们需要往上遍历回去从而获取到下一个节点。 向下遍历这棵树我们**进入**每个节点，向上遍历回去时我们**退出**每个节点。

让我们以上面那棵树为例子走一遍这个过程。

  * 进入 `FunctionDeclaration` 
      * 进入 `Identifier (id)`
      * 走到尽头
      * 退出 `Identifier (id)`
      * 进入 `Identifier (params[0])`
      * 走到尽头
      * 退出 `Identifier (params[0])`
      * 进入 `BlockStatement (body)`
      * 进入 `ReturnStatement (body)` 
          * 进入 `BinaryExpression (argument)`
          * 进入 `Identifier (left)` 
              * 走到尽头
          * 退出 `Identifier (left)`
          * 进入 `Identifier (right)` 
              * 走到尽头
          * 退出 `Identifier (right)`
          * 退出 `BinaryExpression (argument)`
      * 退出 `ReturnStatement (body)`
      * 退出 `BlockStatement (body)`
  * 退出 `FunctionDeclaration`

所以当创建访问者时你实际上有两次机会来访问一个节点。

```js
const MyVisitor = {
  Identifier: {
    enter() {
      console.log("Entered!");
    },
    exit() {
      console.log("Exited!");
    }
  }
};
```

If necessary, you can also apply the same function for multiple visitor nodes by separating them with a `|` in the method name as a string like `Identifier|MemberExpression`.

Example usage in the [flow-comments](https://github.com/babel/babel/blob/2b6ff53459d97218b0cf16f8a51c14a165db1fd2/packages/babel-plugin-transform-flow-comments/src/index.js#L47) plugin

```js
const MyVisitor = {
  "ExportNamedDeclaration|Flow"(path) {}
};
```

You can also use aliases as visitor nodes (as defined in [babel-types](https://github.com/babel/babel/tree/master/packages/babel-types/src/definitions)).

For example,

`Function` is an alias for `FunctionDeclaration`, `FunctionExpression`, `ArrowFunctionExpression`

```js
const MyVisitor = {
  Function(path) {}
};
```

### <a id="toc-paths"></a>Paths（路径）

An AST generally has many Nodes, but how do Nodes relate to one another? We could have one giant mutable object that you manipulate and have full access to, or we can simplify this with **Paths**.

A **Path** is an object representation of the link between two nodes.

For example if we take the following node and its child:

```js
{
  type: "FunctionDeclaration",
  id: {
    type: "Identifier",
    name: "square"
  },
  ...
}
```

And represent the child `Identifier` as a path, it looks something like this:

```js
{
  "parent": {
    "type": "FunctionDeclaration",
    "id": {...},
    ....
  },
  "node": {
    "type": "Identifier",
    "name": "square"
  }
}
```

It also has additional metadata about the path:

```js
{
  "parent": {...},
  "node": {...},
  "hub": {...},
  "contexts": [],
  "data": {},
  "shouldSkip": false,
  "shouldStop": false,
  "removed": false,
  "state": null,
  "opts": null,
  "skipKeys": null,
  "parentPath": null,
  "context": null,
  "container": null,
  "listKey": null,
  "inList": false,
  "parentKey": null,
  "key": null,
  "scope": null,
  "type": null,
  "typeAnnotation": null
}
```

As well as tons and tons of methods related to adding, updating, moving, and removing nodes, but we'll get into those later.

In a sense, paths are a **reactive** representation of a node's position in the tree and all sorts of information about the node. Whenever you call a method that modifies the tree, this information is updated. Babel manages all of this for you to make working with nodes easy and as stateless as possible.

#### <a id="toc-paths-in-visitors"></a>Paths in Visitors（存在于访问者中的路径）

When you have a visitor that has a `Identifier()` method, you're actually visiting the path instead of the node. This way you are mostly working with the reactive representation of a node instead of the node itself.

```js
const MyVisitor = {
  Identifier(path) {
    console.log("Visiting: " + path.node.name);
  }
};
```

```js
a + b + c;
```

```js
Visiting: a
Visiting: b
Visiting: c
```

### <a id="toc-state"></a>State（状态）

State is the enemy of AST transformation. State will bite you over and over again and your assumptions about state will almost always be proven wrong by some syntax that you didn't consider.

Take the following code:

```js
function square(n) {
  return n * n;
}
```

Let's write a quick hacky visitor that will rename `n` to `x`.

```js
let paramName;

const MyVisitor = {
  FunctionDeclaration(path) {
    const param = path.node.params[0];
    paramName = param.name;
    param.name = "x";
  },

  Identifier(path) {
    if (path.node.name === paramName) {
      path.node.name = "x";
    }
  }
};
```

This might work for the above code, but we can easily break that by doing this:

```js
function square(n) {
  return n * n;
}
n;
```

The better way to deal with this is recursion. So let's make like a Christopher Nolan film and put a visitor inside of a visitor.

```js
const updateParamNameVisitor = {
  Identifier(path) {
    if (path.node.name === this.paramName) {
      path.node.name = "x";
    }
  }
};

const MyVisitor = {
  FunctionDeclaration(path) {
    const param = path.node.params[0];
    const paramName = param.name;
    param.name = "x";

    path.traverse(updateParamNameVisitor, { paramName });
  }
};
```

Of course, this is a contrived example but it demonstrates how to eliminate global state from your visitors.

### <a id="toc-scopes"></a>Scopes（作用域）

Next let's introduce the concept of a [**scope**](https://en.wikipedia.org/wiki/Scope_(computer_science)). JavaScript has [lexical scoping](https://en.wikipedia.org/wiki/Scope_(computer_science)#Lexical_scoping_vs._dynamic_scoping), which is a tree structure where blocks create new scope.

```js
// global scope

function scopeOne() {
  // scope 1

  function scopeTwo() {
    // scope 2
  }
}
```

Whenever you create a reference in JavaScript, whether that be by a variable, function, class, param, import, label, etc., it belongs to the current scope.

```js
var global = "I am in the global scope";

function scopeOne() {
  var one = "I am in the scope created by `scopeOne()`";

  function scopeTwo() {
    var two = "I am in the scope created by `scopeTwo()`";
  }
}
```

Code within a deeper scope may use a reference from a higher scope.

```js
function scopeOne() {
  var one = "I am in the scope created by `scopeOne()`";

  function scopeTwo() {
    one = "I am updating the reference in `scopeOne` inside `scopeTwo`";
  }
}
```

A lower scope might also create a reference of the same name without modifying it.

```js
function scopeOne() {
  var one = "I am in the scope created by `scopeOne()`";

  function scopeTwo() {
    var one = "I am creating a new `one` but leaving reference in `scopeOne()` alone.";
  }
}
```

When writing a transform, we want to be wary of scope. We need to make sure we don't break existing code while modifying different parts of it.

We may want to add new references and make sure they don't collide with existing ones. Or maybe we just want to find where a variable is referenced. We want to be able to track these references within a given scope.

A scope can be represented as:

```js
{
  path: path,
  block: path.node,
  parentBlock: path.parent,
  parent: parentScope,
  bindings: [...]
}
```

When you create a new scope you do so by giving it a path and a parent scope. Then during the traversal process it collects all the references ("bindings") within that scope.

Once that's done, there's all sorts of methods you can use on scopes. We'll get into those later though.

#### <a id="toc-bindings"></a>Bindings（绑定）

References all belong to a particular scope; this relationship is known as a **binding**.

```js
function scopeOnce() {
  var ref = "This is a binding";

  ref; // This is a reference to a binding

  function scopeTwo() {
    ref; // This is a reference to a binding from a lower scope
  }
}
```

A single binding looks like this:

```js
{
  identifier: node,
  scope: scope,
  path: path,
  kind: 'var',

  referenced: true,
  references: 3,
  referencePaths: [path, path, path],

  constant: false,
  constantViolations: [path]
}
```

With this information you can find all the references to a binding, see what type of binding it is (parameter, declaration, etc.), lookup what scope it belongs to, or get a copy of its identifier. You can even tell if it's constant and if not, see what paths are causing it to be non-constant.

Being able to tell if a binding is constant is useful for many purposes, the largest of which is minification.

```js
function scopeOne() {
  var ref1 = "This is a constant binding";

  becauseNothingEverChangesTheValueOf(ref1);

  function scopeTwo() {
    var ref2 = "This is *not* a constant binding";
    ref2 = "Because this changes the value";
  }
}
```

* * *

# <a id="toc-api"></a>API

Babel is actually a collection of modules. In this section we'll walk through the major ones, explaining what they do and how to use them.

> 注意：本节内容不是详细的 API 文档的替代品，正式的 API 文档将很快提供出来。

## <a id="toc-babylon"></a>[`babylon`](https://github.com/babel/babylon)

Babylon is Babel's parser. Started as a fork of Acorn, it's fast, simple to use, has plugin-based architecture for non-standard features (as well as future standards).

First, let's install it.

```sh
$ npm install --save babylon
```

Let's start by simply parsing a string of code:

```js
import * as babylon from "babylon";

const code = `function square(n) {
  return n * n;
}`;

babylon.parse(code);
// Node {
//   type: "File",
//   start: 0,
//   end: 38,
//   loc: SourceLocation {...},
//   program: Node {...},
//   comments: [],
//   tokens: [...]
// }
```

We can also pass options to `parse()` like so:

```js
babylon.parse(code, {
  sourceType: "module", // default: "script"
  plugins: ["jsx"] // default: []
});
```

`sourceType` can either be `"module"` or `"script"` which is the mode that Babylon should parse in. `"module"` will parse in strict mode and allow module declarations, `"script"` will not.

> **注意：** `sourceType` 的默认值是 `"script"` 并且在发现 `import` 或 `export` 时产生错误。 使用 `scourceType: "module"` 来避免这些错误。

Since Babylon is built with a plugin-based architecture, there is also a `plugins` option which will enable the internal plugins. Note that Babylon has not yet opened this API to external plugins, although may do so in the future.

To see a full list of plugins, see the [Babylon README](https://github.com/babel/babylon/blob/master/README.md#plugins).

## <a id="toc-babel-traverse"></a>[`babel-traverse`](https://github.com/babel/babel/tree/master/packages/babel-traverse)

The Babel Traverse module maintains the overall tree state, and is responsible for replacing, removing, and adding nodes.

Install it by running:

```sh
$ npm install --save babel-traverse
```

We can use it alongside Babylon to traverse and update nodes:

```js
import * as babylon from "babylon";
import traverse from "babel-traverse";

const code = `function square(n) {
  return n * n;
}`;

const ast = babylon.parse(code);

traverse(ast, {
  enter(path) {
    if (
      path.node.type === "Identifier" &&
      path.node.name === "n"
    ) {
      path.node.name = "x";
    }
  }
});
```

## <a id="toc-babel-types"></a>[`babel-types`](https://github.com/babel/babel/tree/master/packages/babel-types)

Babel Types is a Lodash-esque utility library for AST nodes. It contains methods for building, validating, and converting AST nodes. It's useful for cleaning up AST logic with well thought out utility methods.

You can install it by running:

```sh
$ npm install --save babel-types
```

Then start using it:

```js
import traverse from "babel-traverse";
import * as t from "babel-types";

traverse(ast, {
  enter(path) {
    if (t.isIdentifier(path.node, { name: "n" })) {
      path.node.name = "x";
    }
  }
});
```

### <a id="toc-definitions"></a>Definitions（定义）

Babel Types has definitions for every single type of node, with information on what properties belong where, what values are valid, how to build that node, how the node should be traversed, and aliases of the Node.

A single node type definition looks like this:

```js
defineType("BinaryExpression", {
  builder: ["operator", "left", "right"],
  fields: {
    operator: {
      validate: assertValueType("string")
    },
    left: {
      validate: assertNodeType("Expression")
    },
    right: {
      validate: assertNodeType("Expression")
    }
  },
  visitor: ["left", "right"],
  aliases: ["Binary", "Expression"]
});
```

### <a id="toc-builders"></a>Builders（构建器）

You'll notice the above definition for `BinaryExpression` has a field for a `builder`.

```js
builder: ["operator", "left", "right"]
```

This is because each node type gets a builder method, which when used looks like this:

```js
t.binaryExpression("*", t.identifier("a"), t.identifier("b"));
```

Which creates an AST like this:

```js
{
  type: "BinaryExpression",
  operator: "*",
  left: {
    type: "Identifier",
    name: "a"
  },
  right: {
    type: "Identifier",
    name: "b"
  }
}
```

Which when printed looks like this:

```js
a * b
```

Builders will also validate the nodes they are creating and throw descriptive errors if used improperly. Which leads into the next type of method.

### <a id="toc-validators"></a>Validators（验证器）

The definition for `BinaryExpression` also includes information on the `fields` of a node and how to validate them.

```js
fields: {
  operator: {
    validate: assertValueType("string")
  },
  left: {
    validate: assertNodeType("Expression")
  },
  right: {
    validate: assertNodeType("Expression")
  }
}
```

This is used to create two types of validating methods. The first of which is `isX`.

```js
t.isBinaryExpression(maybeBinaryExpressionNode);
```

This tests to make sure that the node is a binary expression, but you can also pass a second parameter to ensure that the node contains certain properties and values.

```js
t.isBinaryExpression(maybeBinaryExpressionNode, { operator: "*" });
```

There is also the more, *ehem*, assertive version of these methods, which will throw errors instead of returning `true` or `false`.

```js
t.assertBinaryExpression(maybeBinaryExpressionNode);
t.assertBinaryExpression(maybeBinaryExpressionNode, { operator: "*" });
// Error: Expected type "BinaryExpression" with option { "operator": "*" }
```

### <a id="toc-converters"></a>Converters（变换器）

> [WIP]

## <a id="toc-babel-generator"></a>[`babel-generator`](https://github.com/babel/babel/tree/master/packages/babel-generator)

Babel Generator is the code generator for Babel. It takes an AST and turns it into code with sourcemaps.

Run the following to install it:

```sh
$ npm install --save babel-generator
```

Then use it

```js
import * as babylon from "babylon";
import generate from "babel-generator";

const code = `function square(n) {
  return n * n;
}`;

const ast = babylon.parse(code);

generate(ast, null, code);
// {
//   code: "...",
//   map: "..."
// }
```

You can also pass options to `generate()`.

```js
generate(ast, {
  retainLines: false,
  compact: "auto",
  concise: false,
  quotes: "double",
  // ...
}, code);
```

## <a id="toc-babel-template"></a>[`babel-template`](https://github.com/babel/babel/tree/master/packages/babel-template)

Babel Template is another tiny but incredibly useful module. It allows you to write strings of code with placeholders that you can use instead of manually building up a massive AST. In computer science, this capability is called quasiquotes.

```sh
$ npm install --save babel-template
```

```js
import template from "babel-template";
import generate from "babel-generator";
import * as t from "babel-types";

const buildRequire = template(`
  var IMPORT_NAME = require(SOURCE);
`);

const ast = buildRequire({
  IMPORT_NAME: t.identifier("myModule"),
  SOURCE: t.stringLiteral("my-module")
});

console.log(generate(ast).code);
```

```js
var myModule = require("my-module");
```

# <a id="toc-writing-your-first-babel-plugin"></a>编写你的第一个 Babel 插件

Now that you're familiar with all the basics of Babel, let's tie it together with the plugin API.

Start off with a `function` that gets passed the current [`babel`](https://github.com/babel/babel/tree/master/packages/babel-core) object.

```js
export default function(babel) {
  // plugin contents
}
```

Since you'll be using it so often, you'll likely want to grab just `babel.types` like so:

```js
export default function({ types: t }) {
  // plugin contents
}
```

Then you return an object with a property `visitor` which is the primary visitor for the plugin.

```js
export default function({ types: t }) {
  return {
    visitor: {
      // visitor contents
    }
  };
};
```

Each function in the visitor receives 2 arguments: `path` and `state`

```js
export default function({ types: t }) {
  return {
    visitor: {
      Identifier(path, state) {},
      ASTNodeTypeHere(path, state) {}
    }
  };
};
```

Let's write a quick plugin to show off how it works. Here's our source code:

```js
foo === bar;
```

Or in AST form:

```js
{
  type: "BinaryExpression",
  operator: "===",
  left: {
    type: "Identifier",
    name: "foo"
  },
  right: {
    type: "Identifier",
    name: "bar"
  }
}
```

We'll start off by adding a `BinaryExpression` visitor method.

```js
export default function({ types: t }) {
  return {
    visitor: {
      BinaryExpression(path) {
        // ...
      }
    }
  };
}
```

Then let's narrow it down to just `BinaryExpression`s that are using the `===` operator.

```js
visitor: {
  BinaryExpression(path) {
    if (path.node.operator !== "===") {
      return;
    }

    // ...
  }
}
```

Now let's replace the `left` property with a new identifier:

```js
BinaryExpression(path) {
  if (path.node.operator !== "===") {
    return;
  }

  path.node.left = t.identifier("sebmck");
  // ...
}
```

Already if we run this plugin we would get:

```js
sebmck === bar;
```

Now let's just replace the `right` property.

```js
BinaryExpression(path) {
  if (path.node.operator !== "===") {
    return;
  }

  path.node.left = t.identifier("sebmck");
  path.node.right = t.identifier("dork");
}
```

And now for our final result:

```js
sebmck === dork;
```

Awesome! Our very first Babel plugin.

* * *

# <a id="toc-transformation-operations"></a>转换操作

## <a id="toc-visiting"></a>访问

### <a id="toc-get-the-path-of-a-sub-node"></a>获取子节点的Path

To access an AST node's property you normally access the node and then the property. `path.node.property`

```js
// the BinaryExpression AST node has properties: `left`, `right`, `operator`
BinaryExpression(path) {
  path.node.left;
  path.node.right;
  path.node.operator;
}
```

If you need to access the `path` of that property instead, use the `get` method of a path, passing in the string to the property.

```js
BinaryExpression(path) {
  path.get('left');
}
Program(path) {
  path.get('body.0');
}
```

### <a id="toc-check-if-a-node-is-a-certain-type"></a>检查节点的类型

If you want to check what the type of a node is, the preferred way to do so is:

```js
BinaryExpression(path) {
  if (t.isIdentifier(path.node.left)) {
    // ...
  }
}
```

You can also do a shallow check for properties on that node:

```js
BinaryExpression(path) {
  if (t.isIdentifier(path.node.left, { name: "n" })) {
    // ...
  }
}
```

This is functionally equivalent to:

```js
BinaryExpression(path) {
  if (
    path.node.left != null &&
    path.node.left.type === "Identifier" &&
    path.node.left.name === "n"
  ) {
    // ...
  }
}
```

### <a id="toc-check-if-a-path-is-a-certain-type"></a>Check if a path is a certain type

A path has the same methods for checking the type of a node:

```js
BinaryExpression(path) {
  if (path.get('left').isIdentifier({ name: "n" })) {
    // ...
  }
}
```

is equivalent to doing:

```js
BinaryExpression(path) {
  if (t.isIdentifier(path.node.left, { name: "n" })) {
    // ...
  }
}
```

### <a id="toc-check-if-an-identifier-is-referenced"></a>Check if an identifier is referenced

```js
Identifier(path) {
  if (path.isReferencedIdentifier()) {
    // ...
  }
}
```

Alternatively:

```js
Identifier(path) {
  if (t.isReferenced(path.node, path.parent)) {
    // ...
  }
}
```

### <a id="toc-find-a-specific-parent-path"></a>Find a specific parent path

Sometimes you will need to traverse the tree upwards from a path until a condition is satisfied.

Call the provided `callback` with the `NodePath`s of all the parents. When the `callback` returns a truthy value, we return that `NodePath`.

```js
path.findParent((path) => path.isObjectExpression());
```

If the current path should be included as well:

```js
path.find((path) => path.isObjectExpression());
```

Find the closest parent function or program:

```js
path.getFunctionParent();
```

Walk up the tree until we hit a parent node path in a list

```js
path.getStatementParent();
```

### <a id="toc-get-sibling-paths"></a>Get Sibling Paths

If a path in a a list like in the body of a `Function`/`Program`, it will have "siblings".

  * Check if a path is part of a list with `path.inList`
  * You can get the surrounding siblings with `path.getSibling(index)`,
  * The current path's index in the container with `path.key`,
  * The path's container (an array of all sibling paths) with `path.container`
  * Get the name of the key of the list container with `path.listKey`

> These APis are used in the [transform-merge-sibling-variables](https://github.com/babel/babili/blob/master/packages/babel-plugin-transform-merge-sibling-variables/src/index.js) plugin used in [babel-minify](https://github.com/babel/babili).

```js
var a = 1; // pathA, path.key = 0
var b = 2; // pathB, path.key = 1
var c = 3; // pathC, path.key = 2
```

```js
export default function({ types: t }) {
  return {
    visitor: {
      VariableDeclaration(path) {
        // if the current path is pathA
        path.inList // true
        path.listKey // "body"
        path.key // 0
        path.getSibling(0) // pathA
        path.getSibling(path.key + 1) // pathB
        path.container // [pathA, pathB, pathC]
      }
    }
  };
}
```

### <a id="toc-stopping-traversal"></a>Stopping Traversal

If your plugin needs to not run in a certain situation, the simpliest thing to do is to write an early return.

```js
BinaryExpression(path) {
  if (path.node.operator !== '**') return;
}
```

If you are doing a sub-traversal in a top level path, you can use 2 provided API methods:

`path.skip()` skips traversing the children of the current path. `path.stop()` stops traversal entirely.

```js
path.traverse({
  Function(path) {
    path.skip(); // if checking the children is irrelevant
  },
  ReferencedIdentifier(path, state) {
    state.iife = true;
    path.stop(); // if you want to save some state and then stop traversal, or deopt
  }
});
```

## <a id="toc-manipulation"></a>处理

### <a id="toc-replacing-a-node"></a>Replacing a node

```js
BinaryExpression(path) {
  path.replaceWith(
    t.binaryExpression("**", path.node.left, t.numberLiteral(2))
  );
}
```

```diff
  function square(n) {
-   return n * n;
+   return n ** 2;
  }
```

### <a id="toc-replacing-a-node-with-multiple-nodes"></a>Replacing a node with multiple nodes

```js
ReturnStatement(path) {
  path.replaceWithMultiple([
    t.expressionStatement(t.stringLiteral("Is this the real life?")),
    t.expressionStatement(t.stringLiteral("Is this just fantasy?")),
    t.expressionStatement(t.stringLiteral("(Enjoy singing the rest of the song in your head)")),
  ]);
}
```

```diff
  function square(n) {
-   return n * n;
+   "Is this the real life?";
+   "Is this just fantasy?";
+   "(Enjoy singing the rest of the song in your head)";
  }
```

> **Note:** When replacing an expression with multiple nodes, they must be statements. This is because Babel uses heuristics extensively when replacing nodes which means that you can do some pretty crazy transformations that would be extremely verbose otherwise.

### <a id="toc-replacing-a-node-with-a-source-string"></a>Replacing a node with a source string

```js
FunctionDeclaration(path) {
  path.replaceWithSourceString(`function add(a, b) {
    return a + b;
  }`);
}
```

```diff
- function square(n) {
-   return n * n;
+ function add(a, b) {
+   return a + b;
  }
```

> **Note:** It's not recommended to use this API unless you're dealing with dynamic source strings, otherwise it's more efficient to parse the code outside of the visitor.

### <a id="toc-inserting-a-sibling-node"></a>Inserting a sibling node

```js
FunctionDeclaration(path) {
  path.insertBefore(t.expressionStatement(t.stringLiteral("Because I'm easy come, easy go.")));
  path.insertAfter(t.expressionStatement(t.stringLiteral("A little high, little low.")));
}
```

```diff
+ "Because I'm easy come, easy go.";
  function square(n) {
    return n * n;
  }
+ "A little high, little low.";
```

> **Note:** This should always be a statement or an array of statements. This uses the same heuristics mentioned in [Replacing a node with multiple nodes](#replacing-a-node-with-multiple-nodes).

### <a id="toc-inserting-into-a-container"></a>Inserting into a container

If you want to insert into a AST node property like that is an array like `body`. It is simialr to `insertBefore`/`insertAfter` other than you having to specify the `listKey` which is usually `body`.

```js
ClassMethod(path) {
  path.get('body').unshiftContainer('body', t.stringLiteral('before'));
  path.get('body').pushContainer('body', t.stringLiteral('after'));
}
```

```diff
 class A {
  constructor() {
+   "before"
    var a = 'middle';
+   "after"
  }
 }
```

### <a id="toc-removing-a-node"></a>Removing a node

```js
FunctionDeclaration(path) {
  path.remove();
}
```

```diff
- function square(n) {
-   return n * n;
- }
```

### <a id="toc-replacing-a-parent"></a>Replacing a parent

Just call `replaceWith` with the parentPath: `path.parentPath`

```js
BinaryExpression(path) {
  path.parentPath.replaceWith(
    t.expressionStatement(t.stringLiteral("Anyway the wind blows, doesn't really matter to me, to me."))
  );
}
```

```diff
  function square(n) {
-   return n * n;
+   "Anyway the wind blows, doesn't really matter to me, to me.";
  }
```

### <a id="toc-removing-a-parent"></a>Removing a parent

```js
BinaryExpression(path) {
  path.parentPath.remove();
}
```

```diff
  function square(n) {
-   return n * n;
  }
```

## <a id="toc-scope"></a>Scope（作用域）

### <a id="toc-checking-if-a-local-variable-is-bound"></a>Checking if a local variable is bound

```js
FunctionDeclaration(path) {
  if (path.scope.hasBinding("n")) {
    // ...
  }
}
```

This will walk up the scope tree and check for that particular binding.

You can also check if a scope has its **own** binding:

```js
FunctionDeclaration(path) {
  if (path.scope.hasOwnBinding("n")) {
    // ...
  }
}
```

### <a id="toc-generating-a-uid"></a>Generating a UID

This will generate an identifier that doesn't collide with any locally defined variables.

```js
FunctionDeclaration(path) {
  path.scope.generateUidIdentifier("uid");
  // Node { type: "Identifier", name: "_uid" }
  path.scope.generateUidIdentifier("uid");
  // Node { type: "Identifier", name: "_uid2" }
}
```

### <a id="toc-pushing-a-variable-declaration-to-a-parent-scope"></a>Pushing a variable declaration to a parent scope

Sometimes you may want to push a `VariableDeclaration` so you can assign to it.

```js
FunctionDeclaration(path) {
  const id = path.scope.generateUidIdentifierBasedOnNode(path.node.id);
  path.remove();
  path.scope.parent.push({ id, init: path.node });
}
```

```diff
- function square(n) {
+ var _square = function square(n) {
    return n * n;
- }
+ };
```

### <a id="toc-rename-a-binding-and-its-references"></a>Rename a binding and its references

```js
FunctionDeclaration(path) {
  path.scope.rename("n", "x");
}
```

```diff
- function square(n) {
-   return n * n;
+ function square(x) {
+   return x * x;
  }
```

Alternatively, you can rename a binding to a generated unique identifier:

```js
FunctionDeclaration(path) {
  path.scope.rename("n");
}
```

```diff
- function square(n) {
-   return n * n;
+ function square(_n) {
+   return _n * _n;
  }
```

* * *

# <a id="toc-plugin-options"></a>插件选项

If you would like to let your users customize the behavior of your Babel plugin you can accept plugin specific options which users can specify like this:

```js
{
  plugins: [
    ["my-plugin", {
      "option1": true,
      "option2": false
    }]
  ]
}
```

These options then get passed into plugin visitors through the `state` object:

```js
export default function({ types: t }) {
  return {
    visitor: {
      FunctionDeclaration(path, state) {
        console.log(state.opts);
        // { option1: true, option2: false }
      }
    }
  }
}
```

These options are plugin-specific and you cannot access options from other plugins.

## <a id="toc-pre-and-post-in-plugins"></a> Pre and Post in Plugins

Plugins can have functions that are run before or after plugins. They can be used for setup or cleanup/analysis purposes.

```js
export default function({ types: t }) {
  return {
    pre(state) {
      this.cache = new Map();
    },
    visitor: {
      StringLiteral(path) {
        this.cache.set(path.node.value, 1);
      }
    },
    post(state) {
      console.log(this.cache);
    }
  };
}
```

## <a id="toc-enabling-syntax-in-plugins"></a> Enabling Syntax in Plugins

Plugins can enable [babylon plugins](https://github.com/babel/babylon#plugins) so that users don't need to install/enable them. This prevents a parsing error without inheriting the syntax plugin.

```js
export default function({ types: t }) {
  return {
    inherits: require("babel-plugin-syntax-jsx")
  };
}
```

## <a id="toc-throwing-a-syntax-error"></a> Throwing a Syntax Error

If you want to throw an error with babel-code-frame and a message:

```js
export default function({ types: t }) {
  return {
    visitor: {
      StringLiteral(path) {
        throw path.buildCodeFrameError("Error message here");
      }
    }
  };
}
```

The error looks like:

    file.js: Error message here
       7 | 
       8 | let tips = [
    >  9 |   "Click on any AST node with a '+' to expand it",
         |   ^
      10 | 
      11 |   "Hovering over a node highlights the \
      12 |    corresponding part in the source code",
    

* * *

# <a id="toc-building-nodes"></a>构建节点

When writing transformations you'll often want to build up some nodes to insert into the AST. As mentioned previously, you can do this using the [builder](#builder) methods in the [`babel-types`](#babel-types) package.

The method name for a builder is simply the name of the node type you want to build except with the first letter lowercased. For example if you wanted to build a `MemberExpression` you would use `t.memberExpression(...)`.

The arguments of these builders are decided by the node definition. There's some work that's being done to generate easy-to-read documentation on the definitions, but for now they can all be found [here](https://github.com/babel/babel/tree/master/packages/babel-types/src/definitions).

A node definition looks like the following:

```js
defineType("MemberExpression", {
  builder: ["object", "property", "computed"],
  visitor: ["object", "property"],
  aliases: ["Expression", "LVal"],
  fields: {
    object: {
      validate: assertNodeType("Expression")
    },
    property: {
      validate(node, key, val) {
        let expectedType = node.computed ? "Expression" : "Identifier";
        assertNodeType(expectedType)(node, key, val);
      }
    },
    computed: {
      default: false
    }
  }
});
```

Here you can see all the information about this particular node type, including how to build it, traverse it, and validate it.

By looking at the `builder` property, you can see the 3 arguments that will be needed to call the builder method (`t.memberExpression`).

```js
builder: ["object", "property", "computed"],
```

> Note that sometimes there are more properties that you can customize on the node than the `builder` array contains. This is to keep the builder from having too many arguments. In these cases you need to set the properties manually. An example of this is [`ClassMethod`](https://github.com/babel/babel/blob/bbd14f88c4eea88fa584dd877759dd6b900bf35e/packages/babel-types/src/definitions/es2015.js#L238-L276).

```js
// Example
// because the builder doesn't contain `async` as a property
var node = t.classMethod(
  "constructor",
  t.identifier("constructor"),
  params,
  body
)
// set it manually after creation
node.async = true;
```

You can see the validation for the builder arguments with the `fields` object.

```js
fields: {
  object: {
    validate: assertNodeType("Expression")
  },
  property: {
    validate(node, key, val) {
      let expectedType = node.computed ? "Expression" : "Identifier";
      assertNodeType(expectedType)(node, key, val);
    }
  },
  computed: {
    default: false
  }
}
```

You can see that `object` needs to be an `Expression`, `property` either needs to be an `Expression` or an `Identifier` depending on if the member expression is `computed` or not and `computed` is simply a boolean that defaults to `false`.

So we can construct a `MemberExpression` by doing the following:

```js
t.memberExpression(
  t.identifier('object'),
  t.identifier('property')
  // `computed` is optional
);
```

Which will result in:

```js
object.property
```

However, we said that `object` needed to be an `Expression` so why is `Identifier` valid?

Well if we look at the definition of `Identifier` we can see that it has an `aliases` property which states that it is also an expression.

```js
aliases: ["Expression", "LVal"],
```

So since `MemberExpression` is a type of `Expression`, we could set it as the `object` of another `MemberExpression`:

```js
t.memberExpression(
  t.memberExpression(
    t.identifier('member'),
    t.identifier('expression')
  ),
  t.identifier('property')
)
```

Which will result in:

```js
member.expression.property
```

It's very unlikely that you will ever memorize the builder method signatures for every node type. So you should take some time and understand how they are generated from the node definitions.

You can find all of the actual [definitions here](https://github.com/babel/babel/tree/master/packages/babel-types/src/definitions) and you can see them [documented here](https://github.com/babel/babel/blob/master/doc/ast/spec.md)

* * *

# <a id="toc-best-practices"></a>最佳实践

## <a id="toc-create-helper-builders-and-checkers"></a> Create Helper Builders and Checkers

It's pretty simple to extract certain checks (if a node is a certain type) into their own helper functions as well as extracting out helpers for specific node types.

```js
function isAssignment(node) {
  return node && node.operator === opts.operator + "=";
}

function buildAssignment(left, right) {
  return t.assignmentExpression("=", left, right);
}
```

## <a id="toc-avoid-traversing-the-ast-as-much-as-possible"></a>尽量避免遍历抽象语法树（AST）

Traversing the AST is expensive, and it's easy to accidentally traverse the AST more than necessary. This could be thousands if not tens of thousands of extra operations.

Babel optimizes this as much as possible, merging visitors together if it can in order to do everything in a single traversal.

### <a id="toc-merge-visitors-whenever-possible"></a>及时合并访问者对象

When writing visitors, it may be tempting to call `path.traverse` in multiple places where they are logically necessary.

```js
path.traverse({
  Identifier(path) {
    // ...
  }
});

path.traverse({
  BinaryExpression(path) {
    // ...
  }
});
```

However, it is far better to write these as a single visitor that only gets run once. Otherwise you are traversing the same tree multiple times for no reason.

```js
path.traverse({
  Identifier(path) {
    // ...
  },
  BinaryExpression(path) {
    // ...
  }
});
```

### <a id="toc-do-not-traverse-when-manual-lookup-will-do"></a>可以手动查找就不要遍历

It may also be tempting to call `path.traverse` when looking for a particular node type.

```js
const visitorOne = {
  Identifier(path) {
    // ...
  }
};

const MyVisitor = {
  FunctionDeclaration(path) {
    path.get('params').traverse(visitorOne);
  }
};
```

However, if you are looking for something specific and shallow, there is a good chance you can manually lookup the nodes you need without performing a costly traversal.

```js
const MyVisitor = {
  FunctionDeclaration(path) {
    path.node.params.forEach(function() {
      // ...
    });
  }
};
```

## <a id="toc-optimizing-nested-visitors"></a>优化嵌套的访问者对象

When you are nesting visitors, it might make sense to write them nested in your code.

```js
const MyVisitor = {
  FunctionDeclaration(path) {
    path.traverse({
      Identifier(path) {
        // ...
      }
    });
  }
};
```

However, this creates a new visitor object everytime `FunctionDeclaration()` is called above, which Babel then needs to explode and validate every single time. This can be costly, so it is better to hoist the visitor up.

```js
const visitorOne = {
  Identifier(path) {
    // ...
  }
};

const MyVisitor = {
  FunctionDeclaration(path) {
    path.traverse(visitorOne);
  }
};
```

If you need some state within the nested visitor, like so:

```js
const MyVisitor = {
  FunctionDeclaration(path) {
    var exampleState = path.node.params[0].name;

    path.traverse({
      Identifier(path) {
        if (path.node.name === exampleState) {
          // ...
        }
      }
    });
  }
};
```

You can pass it in as state to the `traverse()` method and have access to it on `this` in the visitor.

```js
const visitorOne = {
  Identifier(path) {
    if (path.node.name === this.exampleState) {
      // ...
    }
  }
};

const MyVisitor = {
  FunctionDeclaration(path) {
    var exampleState = path.node.params[0].name;
    path.traverse(visitorOne, { exampleState });
  }
};
```

## <a id="toc-being-aware-of-nested-structures"></a>留意嵌套结构

Sometimes when thinking about a given transform, you might forget that the given structure can be nested.

For example, imagine we want to lookup the `constructor` `ClassMethod` from the `Foo` `ClassDeclaration`.

```js
class Foo {
  constructor() {
    // ...
  }
}
```

```js
const constructorVisitor = {
  ClassMethod(path) {
    if (path.node.name === 'constructor') {
      // ...
    }
  }
}

const MyVisitor = {
  ClassDeclaration(path) {
    if (path.node.id.name === 'Foo') {
      path.traverse(constructorVisitor);
    }
  }
}
```

We are ignoring the fact that classes can be nested and using the traversal above we will hit a nested `constructor` as well:

```js
class Foo {
  constructor() {
    class Bar {
      constructor() {
        // ...
      }
    }
  }
}
```

> ***For future updates, follow [@thejameskyle](https://twitter.com/thejameskyle) and [@babeljs](https://twitter.com/babeljs) on Twitter.***