# Babel 插件开发指南

这篇文档涵盖了如何创建 [Babel](https://babeljs.io) [插件](https://babeljs.io/docs/advanced/plugins/)等方面的内容。.

如果你正在阅读本手册的非英语版本，你或许会发现一些英文的部分还没有被翻译。 如果你想帮助翻译的话你需要通过 Crowdin 来完成。 请先阅读[贡献指导](/CONTRIBUTING.md)来了解这方面更多的信息。

[![cc-by-4.0](https://licensebuttons.net/l/by/4.0/80x15.png)](http://creativecommons.org/licenses/by/4.0/)

特别感谢 [@sebmck](https://github.com/sebmck/), [@hzoo](https://github.com/hzoo), [@jdalton](https://github.com/jdalton), [@abraithwaite](https://github.com/abraithwaite), [@robey](https://github.com/robey)，及其他人为本手册提供的慷慨帮助。

# Node 脚本化版本（Node Packaged Manuscript）

你可以使用 npm 安装这份指南，方法如下：

```sh
$ npm install -g babel-plugin-handbook
```

现在你可以使用 `babel-plugin-handbook` 命令并在 `$PAGER` 中打开这份文档。 此外，你也可以继续阅读这份在线的版本。

# 翻译

  * [English](/README.md)
  * [Afrikaans](/translations/af/README.md)
  * [العربية](/translations/ar/README.md)
  * [Català](/translations/ca/README.md)
  * [Čeština](/translations/cs/README.md)
  * [Danske](/translations/da/README.md)
  * [Deutsche](/translations/de/README.md)
  * [ελληνικά](/translations/el/README.md)
  * [Español](/translations/es-ES/README.md)
  * [Suomi](/translations/fi/README.md)
  * [Français](/translations/fr/README.md)
  * [עִברִית](/translations/he/README.md)
  * [Magyar](/translations/hu/README.md)
  * [Italiano](/translations/it/README.md)
  * [日本語](/translations/ja/README.md)
  * [한국어](/translations/ko/README.md)
  * [Norsk](/translations/no/README.md)
  * [Nederlands](/translations/nl/README.md)
  * [Português](/translations/pl/README.md)
  * [Português (Brasil)](/translations/pt-BR/README.md)
  * [Portugisisk](/translations/pt-PT/README.md)
  * [Română](/translations/ro/README.md)
  * [Pусский](/translations/ru/README.md)
  * [Српски језик (Ћирилица)](/translations/sr/README.md)
  * [Svenska](/translations/sv-SE/README.md)
  * [Türk](/translations/tr/README.md)
  * [Український](/translations/uk/README.md)
  * [Tiếng Việt](/translations/vi/README.md)
  * [简体中文](/translations/zh-CN/README.md)
  * [繁體中文](/translations/zh-TW/README.md)

**[请求增加新的语种](https://github.com/thejameskyle/babel-plugin-handbook/issues/new?title=Translation%20Request:%20[Please%20enter%20language%20here]&body=I%20am%20able%20to%20translate%20this%20language%20[yes/no])**

如果您正在阅读本手册的非英语翻译版本，你会发现一些英文单词是编程概念。 如果按照字面翻译这些单词会导致在阅读时缺乏一致性和流畅性。 在此情形下，字面翻译会写在原文后面的 `（）` 内。 例如：抽象语法树（ASTs）

# 目录

  * [介绍](#introduction)
  * [基础](#basics) 
      * [抽象语法树（ASTs）](#asts)
      * [Babel 的处理步骤](#stages-of-babel)
      * [解析](#parse) 
          * [词法分析](#lexical-analysis)
          * [语法分析](#syntactic-analysis)
      * [转换](#transform)
      * [生成](#generate)
      * [遍历](#traversal)
      * [Visitors（访问者）](#visitors)
      * [Paths（路径）](#paths) 
          * [Paths in Visitors（存在于访问者中的路径）](#paths-in-visitors)
      * [State（状态）](#state)
      * [Scopes（作用域）](#scopes) 
          * [Bindings（绑定）](#bindings)
  * [API](#api) 
      * [babylon](#babylon)
      * [babel-traverse](#babel-traverse)
      * [babel-types](#babel-types)
      * [Definitions（定义）](#definitions)
      * [Builders（构建器）](#builders)
      * [Validators（验证器）](#validators)
      * [Converters（变换器）](#converters)
      * [babel-generator](#babel-generator)
      * [babel-template](#babel-template)
  * [编写你的第一个 Babel 插件](#writing-your-first-babel-plugin)
  * [转换操作](#transformation-operations) 
      * [访问](#visiting)
      * [检查节点是否为某种特定类型](#check-if-a-node-is-a-certain-type)
      * [检查标识符是否正在被引用着](#check-if-an-identifier-is-referenced)
      * [处理](#manipulation)
      * [替换节点](#replacing-a-node)
      * [用多个节点替换一个节点](#replacing-a-node-with-multiple-nodes)
      * [用字符串源码替换节点](#replacing-a-node-with-a-source-string)
      * [插入同级节点](#inserting-a-sibling-node)
      * [移除节点](#removing-a-node)
      * [替换父节点](#replacing-a-parent)
      * [移除父节点](#removing-a-parent)
      * [Scope（作用域）](#scope)
      * [检查本地变量是否有绑定](#checking-if-a-local-variable-is-bound)
      * [生成唯一标识符（UID）](#generating-a-uid)
      * [提升变量声明至父级作用域](#pushing-a-variable-declaration-to-a-parent-scope)
      * [重命名绑定及其引用](#rename-a-binding-and-its-references)
  * [插件选项](#plugin-options)
  * [构建节点](#building-nodes)
  * [最佳实践](#best-practices) 
      * [尽量避免遍历抽象语法树（AST）](#avoid-traversing-the-ast-as-much-as-possible)
      * [及时合并访问者对象](#merge-visitors-whenever-possible)
      * [可以手动查找就不要遍历](#do-not-traverse-when-manual-lookup-will-do)
      * [优化嵌套的访问者对象](#optimizing-nested-visitors)
      * [留意嵌套结构](#being-aware-of-nested-structures)

# 介绍

Babel 是一个通用的多功能的 JavaScript 编译器。此外它还拥有众多模块可用于不同形式的静态分析。

> 静态分析是在不需要执行代码的前提下对代码进行分析的处理过程 （执行代码的同时进行代码分析即是动态分析）。 静态分析的目的是多种多样的， 它可用于语法检查，编译，代码高亮，代码转换，优化，压缩等等场景。

你可以使用 Babel 创建多种类型的工具来帮助你更有效率并且写出更好的程序。

# 基础

Babel 是 JavaScript 编译器，更确切地说是源码到源码的编译器，通常也叫做“转换编译器（transpiler）”。 意思是说你为 Babel 提供一些 JavaScript 代码，Babel 更改这些代码，然后返回给你新生成的代码。

## 抽象语法树（ASTs）

这个处理过程中的每一步都涉及到创建或是操作[抽象语法树](https://en.wikipedia.org/wiki/Abstract_syntax_tree)，亦称 AST。

> Babel 使用一个基于 [ESTree](https://github.com/estree/estree) 并修改过的 AST，它的内核说明文档可以在[这里](https://github.com/babel/babel/blob/master/doc/ast/spec.md)找到。.

```js
function square(n) {
  return n * n;
}
```

> [AST Explorer](http://astexplorer.net/) 可以让你对 AST 节点有一个更好的感性认识。 [这里](http://astexplorer.net/#/Z1exs6BWMq)是上述代码的一个示例链接。

同样的程序可以表述为下面的列表：

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

## Babel 的处理步骤

Babel 的三个主要处理步骤分别是： **解析（parse）**，**转换（transform）**，**生成（generate）**。.

### 解析

**解析**步骤接收代码并输出 AST。 这个步骤分为两个阶段：[**词法分析（Lexical Analysis） **](https://en.wikipedia.org/wiki/Lexical_analysis)和 [**语法分析（Syntactic Analysis）**](https://en.wikipedia.org/wiki/Parsing)。.

#### 词法分析

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

#### 语法分析

语法分析阶段会把一个令牌流转换成 AST 的形式。 这个阶段会使用令牌中的信息把它们转换成一个 AST 的表述结构，这样更易于后续的操作。

### 转换

[转换](https://en.wikipedia.org/wiki/Program_transformation)步骤接收 AST 并对其进行遍历，在此过程中对节点进行添加、更新及移除等操作。 这是 Babel 或是其他编译器中最复杂的过程 同时也是插件将要介入工作的部分，这将是本手册的主要内容， 因此让我们慢慢来。

### 生成

[代码生成](https://en.wikipedia.org/wiki/Code_generation_(compiler))步骤把最终（经过一系列转换之后）的 AST转换成字符串形式的代码，同时创建[源码映射（source maps）](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/)。.

代码生成其实很简单：深度优先遍历整个 AST，然后构建可以表示转换后代码的字符串。

## 遍历

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

### Visitors（访问者）

当我们谈及“进入”一个节点，实际上是说我们在**访问**它们， 之所以使用这样的术语是因为有一个[**访问者模式（visitor）**](https://en.wikipedia.org/wiki/Visitor_pattern)的概念。.

访问者是一个用于 AST 遍历的跨语言的模式。 简单的说它们就是一个对象，定义了用于在一个树状结构中获取具体节点的方法。 这么说有些抽象所以让我们来看一个例子。

```js
const MyVisitor = {
  Identifier() {
    console.log("Called!");
  }
};
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

### Paths（路径）

AST 通常会有许多节点，那么节点直接如何相互关联？ 我们可以用一个巨大的可变对象让你来操作以及完全访问（节点的关系），或者我们可以用**Paths（路径）**来简化这件事情。.

**Path** 是一个对象，它表示两个节点之间的连接。

举例来说如果我们有以下的节点和它的子节点：

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

将子节点 `Identifier` 表示为路径的话，看起来是这样的：

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

同时它还有关于该路径的附加元数据：

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

当然还有成堆的方法，它们和添加、更新、移动和删除节点有关，不过我们后面再说。

可以这么说，路径是对于节点在数中的位置以及其他各种信息的**响应式**表述。 当你调用一个方法更改了树的时候，这些信息也会更新。 Babel 帮你管理着这一切从而让你能更轻松的操作节点并且尽量保证无状态化。（译注：意即尽可能少的让你来维护状态）

#### Paths in Visitors（存在于访问者中的路径）

当你有一个拥有 `Identifier()` 方法的访问者时，你实际上是在访问路径而不是节点。 如此一来你可以操作节点的响应式表述（译注：即路径）而不是节点本身。

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

### State（状态）

状态是 AST 转换的敌人。状态会不停的找你麻烦，你对状态的预估到最后几乎总是错的，因为你无法预先考虑到所有的语法。

考虑下列代码：

```js
function square(n) {
  return n * n;
}
```

让我们写一个把 `n` 重命名为 `x` 的访问者的快速实现：.

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

对上面的代码来说或许能行，但我们很容易就能“搞坏”它：

```js
function square(n) {
  return n * n;
}
n;
```

更好的处理方式是递归。那么让我们来像克里斯托佛·诺兰的电影那样来把一个访问者放进另外一个访问者里面。

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

当然，这只是一个刻意捏造的例子，不过它演示了如何从访问者中消除全局状态。

### Scopes（作用域）

接下来让我们引入[**作用域（scope）**](https://en.wikipedia.org/wiki/Scope_(computer_science))的概念。 JavaScript 拥有[词法作用域](https://en.wikipedia.org/wiki/Scope_(computer_science)#Lexical_scoping_vs._dynamic_scoping)，代码块创建新的作用域并形成一个树状结构。

```js
// global scope

function scopeOne() {
  // scope 1

  function scopeTwo() {
    // scope 2
  }
}
```

在 JavaScript 中，每当你创建了一个引用，不管是通过变量（variable）、函数（function）、类型（class）、参数（params）、模块导入（import）、标签（label）等等，它都属于当前作用域。

```js
var global = "I am in the global scope";

function scopeOne() {
  var one = "I am in the scope created by `scopeOne()`";

  function scopeTwo() {
    var two = "I am in the scope created by `scopeTwo()`";
  }
}
```

处于深层作用域代码可以使用高（外）层作用域的引用。

```js
function scopeOne() {
  var one = "I am in the scope created by `scopeOne()`";

  function scopeTwo() {
    one = "I am updating the reference in `scopeOne` inside `scopeTwo`";
  }
}
```

低（内）层作用域也可以创建（和外层）同名的引用而无须更改它。

```js
function scopeOne() {
  var one = "I am in the scope created by `scopeOne()`";

  function scopeTwo() {
    var one = "I am creating a new `one` but leaving reference in `scopeOne()` alone.";
  }
}
```

当编写一个转换器时，我们须要小心作用域。我们得确保在改变代码的各个部分时不会破坏它。

我们会想要添加新的引用并且保证它们不会和已经存在的引用冲突。 又或者我们只是想要找出变量在哪里被引用的。 我们需要能在给定作用域内跟踪这些引用。

作用域可以表述为：

```js
{
  path: path,
  block: path.node,
  parentBlock: path.parent,
  parent: parentScope,
  bindings: [...]
}
```

当你创建一个新的作用域时需要给它一个路径及父级作用域。之后在遍历过程中它会在改作用于内收集所有的引用（“绑定”）。

这些做好之后，你将拥有许多用于作用域上的方法。我们稍后再讲这些。

#### Bindings（绑定）

引用从属于特定的作用域；这种关系被称作：**绑定（binding）**。.

```js
function scopeOnce() {
  var ref = "This is a binding";

  ref; // This is a reference to a binding

  function scopeTwo() {
    ref; // This is a reference to a binding from a lower scope
  }
}
```

一个绑定看起来如下：

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

有了这些信息你就可以查找一个绑定的所有引用，并且知道绑定的类型是什么（参数，定义等等），寻找到它所属的作用域，或者得到它的标识符的拷贝。 你甚至可以知道它是否是一个常量，并查看是哪个路径让它不是一个常量。

知道绑定是否为常量在很多情况下都会很有用，最大的用处就是代码压缩。

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

# API

Babel 实际上是一系列的模块。本节我们将探索一些主要的模块，解释它们是做什么的以及如何使用它们。

> 注意：本节内容不是详细的 API 文档的替代品，正式的 API 文档将很快提供出来。

## [`babylon`](https://github.com/babel/babel/tree/master/packages/babylon)

Babylon 是 Babel 的解析器。最初是 Acorn 的一份 fork，它非常快，易于使用，并且针对非标准特性（以及那些未来的标准特性）设计了一个基于插件的架构。

首先，让我们先安装它。

```sh
$ npm install --save babylon
```

让我们从解析简单的字符形式代码开始：

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

我们还能传递选项给 `parse()`：

```js
babylon.parse(code, {
  sourceType: "module", // default: "script"
  plugins: ["jsx"] // default: []
});
```

`sourceType` 可以是 `"module"` 或者 `"script"`，它表示 Babylon 应该用哪种模式来解析。 `"module"` 将会在严格模式下解析并且允许模块定义，`"script"` 则不会。

> **注意：** `sourceType` 的默认值是 `"script"` 并且在发现 `import` 或 `export` 时产生错误。 使用 `scourceType: "module"` 来避免这些错误。

因为 Babylon 使用了基于插件的架构，因此 `plugins` 选项可以开启内置插件。 注意 Babylon 尚未对外部插件开放此 API 接口，不过未来会开放的。

可以在 [Babylon README](https://github.com/babel/babel/blob/master/packages/babylon/README.md#plugins) 查看所有插件的列表。.

## [`babel-traverse`](https://github.com/babel/babel/tree/master/packages/babel-traverse)

Babel Tranverse（遍历）模块维护了整棵树的状态，并且负责替换、移除和添加节点。

运行以下命令安装：

```sh
$ npm install --save babel-traverse
```

我们可以配合 Babylon 一起使用来遍历和更新节点：

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

## [`babel-types`](https://github.com/babel/babel/tree/master/packages/babel-types)

Babel Types（类型）模块是一个用于 AST 节点的 Lodash 式工具库。 译注：Lodash 是一个 JavaScript 函数工具库，提供了基于函数式编程风格的众多工具函数）它包含了构造、验证以及变换 AST 节点的方法。 其设计周到的工具方法有助于编写清晰简单的 AST 逻辑。

运行以下命令来安装它：

```sh
$ npm install --save babel-types
```

然后如下所示来使用：

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

### Definitions（定义）

Babel Types模块拥有每一个单一类型节点的定义，包括有哪些属性分别属于哪里，哪些值是合法的，如何构建该节点，该节点应该如何去遍历，以及节点的别名等信息。

单一节点类型定义的形式如下：

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

### Builders（构建器）

你会注意到上面的 `BinaryExpression` 定义有一个 `builder` 字段。.

```js
builder: ["operator", "left", "right"]
```

这是由于每一个节点类型都有构建器方法：

```js
t.binaryExpression("*", t.identifier("a"), t.identifier("b"));
```

它可以创建如下所示的 AST：

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

当打印出来（输出）之后是这样的：

```js
a * b
```

构建器还会验证自身创建的节点，并在错误使用的情形下抛出描述性的错误。这就引出了接下来的一种方法。

### Validators（验证器）

`BinaryExpression` 的定义还包含了节点的 `fields` 字段信息并且指示了如何验证它们。

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

这可以用来创建两种类型的验证方法。第一种是 `isX`。.

```js
t.isBinaryExpression(maybeBinaryExpressionNode);
```

此方法用来确保节点是一个二进制表达式，不过你也可以传入第二个参数来确保节点包含特定的属性和值。

```js
t.isBinaryExpression(maybeBinaryExpressionNode, { operator: "*" });
```

这些方法还有一种更加，嗯，断言式的版本，会抛出异常而不是返回 `true` 或 `false`。.

```js
t.assertBinaryExpression(maybeBinaryExpressionNode);
t.assertBinaryExpression(maybeBinaryExpressionNode, { operator: "*" });
// Error: Expected type "BinaryExpression" with option { "operator": "*" }
```

### Converters（变换器）

> [WIP]

## [`babel-generator`](https://github.com/babel/babel/tree/master/packages/babel-generator)

Babel Generator模块是 Babel 的代码生成器。它将 AST 输出为代码并包括源码映射（sourcemaps）。

运行以下命令来安装它：

```sh
$ npm install --save babel-generator
```

然后如下所示使用：

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

你也可以给 `generate()` 传递选项。.

```js
generate(ast, {
  retainLines: false,
  compact: "auto",
  concise: false,
  quotes: "double",
  // ...
}, code);
```

## [`babel-template`](https://github.com/babel/babel/tree/master/packages/babel-template)

Babel Template模块是一个很小但却非常有用的模块。它能让你编写带有占位符的字符串形式的代码，你可以用此来替代大量的手工构建的 AST。

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

# 编写你的第一个 Babel 插件

现在你已经熟悉了 Babel 的所有基础知识了，让我们把这些知识和插件的 API融合在一起来编写第一个 Babel 插件吧。

从一个接收了 `babel` 对象作为参数的 `function` 开始。

```js
export default function(babel) {
  // plugin contents
}
```

由于你将会经常这样使用，所以直接取出 `babel.types` 会更方便：（译注：这是 ES2015 语法中的对象解构，即 Destructuring）

```js
export default function({ types: t }) {
  // plugin contents
}
```

接着返回一个对象，其 `visitor` 属性是这个插件的主要访问者。

```js
export default function({ types: t }) {
  return {
    visitor: {
      // visitor contents
    }
  };
};
```

让我们快速编写一个可用的插件来展示一下它是如何工作的。下面是我们的源代码：

```js
foo === bar;
```

其 AST 形式如下：

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

我们从添加 `BinaryExpression` 访问者方法开始：

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

然后我们更确切一些，只关注哪些使用了 `===` 的 `BinaryExpression`。

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

现在我们用新的标识符来替换 `left` 属性：

```js
BinaryExpression(path) {
  if (path.node.operator !== "===") {
    return;
  }

  path.node.left = t.identifier("sebmck");
  // ...
}
```

于是如果我们运行这个插件我们会得到：

```js
sebmck === bar;
```

现在只需要替换 `right` 属性了。

```js
BinaryExpression(path) {
  if (path.node.operator !== "===") {
    return;
  }

  path.node.left = t.identifier("sebmck");
  path.node.right = t.identifier("dork");
}
```

这就是我们的最终结果了：

```js
sebmck === dork;
```

完美！我们的第一个 Babel 插件。

* * *

# 转换操作

## 访问

### 检查节点是否为某种特定类型

要检查节点的类型是什么，比较好的方法是：

```js
BinaryExpression(path) {
  if (t.isIdentifier(path.node.left)) {
    // ...
  }
}
```

你也可以对该节点进行浅层属性检查：

```js
BinaryExpression(path) {
  if (t.isIdentifier(path.node.left, { name: "n" })) {
    // ...
  }
}
```

功能上等价于：

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

### 检查标识符是否正在被引用着

```js
Identifier(path) {
  if (path.isReferencedIdentifier()) {
    // ...
  }
}
```

或者：

```js
Identifier(path) {
  if (t.isReferenced(path.node, path.parent)) {
    // ...
  }
}
```

## 处理

### 替换节点

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

### 用多个节点替换一个节点

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

> **注意：** 当用多个节点替换表达式时，这些节点必须是声明（statements）。 这是因为当节点替换发生时，Babel 极广泛地使用了启发式的算法，这意味着如果使用了非声明的代码会产生非常冗长的、疯狂的转换动作。

### 用字符串源码替换节点

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

> **注意：** 除非你要处理动态的源码字符串，否则不推荐使用这个 API，反之在访问者外部解析代码会更有效率。

### 插入同级节点

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

> **注意：** 这里同样应该使用声明或者一个声明数组。 因为使用了在[用多个节点替换一个节点](#replacing-a-node-with-multiple-nodes)一节提到的启发式算法。.

### 移除节点

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

### 替换父节点

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

### 移除父节点

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

## Scope（作用域）

### 检查本地变量是否有绑定

```js
FunctionDeclaration(path) {
  if (path.scope.hasBinding("n")) {
    // ...
  }
}
```

这会遍寻作用域树并查找指定的绑定。

你也可以检查作用域是否拥有**属于自己的**绑定：

```js
FunctionDeclaration(path) {
  if (path.scope.hasOwnBinding("n")) {
    // ...
  }
}
```

### 生成唯一标识符（UID）

这会生成一个不会和任何本地定义的变量冲突的标识符。

```js
FunctionDeclaration(path) {
  path.scope.generateUidIdentifier("uid");
  // Node { type: "Identifier", name: "_uid" }
  path.scope.generateUidIdentifier("uid");
  // Node { type: "Identifier", name: "_uid2" }
}
```

### 提升变量声明至父级作用域

有时你会需要提升一个 `VariableDeclaration` 以便可以给它赋值。

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

### 重命名绑定及其引用

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

或者，你可以重命名绑定来生成唯一的标识符：

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

# 插件选项

若你希望让你的用户自定义 Babel 插件的行为，你可以接收指定的选项：

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

这些选项会通过 `state` 对象传递给插件的访问者（visitors）:

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

这些选项是插件特定的，因此你不能从其他插件里访问到这些选项。

* * *

# 构建节点

当编写转换动作时你会时常需要构建一些节点然后把它们插入到 AST 中。 正如之前提到的，你可以使用 [babel-types](#builder) 模块里的 [`Builders（构建器）`](#babel-types) 方法。

建器的方法名称就是你想要构建的节点类型名称，只不过第一个字母是小写的。 比方说如果你要构建一个 `MemberExpression` 节点，你可以使用 `t.memberExpression(...)`。.

这些构建器的参数根据节点定义各有不同。 我们做了一些工作来生成便于阅读的节点定义文档，不过现在你可以在[这里](https://github.com/babel/babel/tree/master/packages/babel-types/src/definitions)找到它们。.

节点定义如下所示：

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

你可以看到关于特定节点类型的所有信息，包括如何构建它，遍历它，以及验证它。

看一看 `builder` 属性，你可以找到调用构建器方法时需要的 3 个参数（`t.memberExpression`）。).

```js
builder: ["object", "property", "computed"],
```

> 注意有时候除了 `builder` 数组包含的参数以外还有更多的属性可用于节点的自定义。 这是为了避免构建器含有太多参数。 此时你需要手动设置这些属性。 一个参考例子是 [`ClassMethod`](https://github.com/babel/babel/blob/bbd14f88c4eea88fa584dd877759dd6b900bf35e/packages/babel-types/src/definitions/es2015.js#L238-L276)。.

你可以通过 `fields` 对象查看构建器参数的验证条件。

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

你可以看到 `object` 必须得是一个 `Expression`，`property` 要么得是一个 `Expression` 要么得是一个 `Identifier`，取决于其成员表达式是否是 `computed`，而 `computed` 是一个布尔值，缺省为 `false`。.

于是我们可以这样来构造一个 `MemberExpression`：

```js
t.memberExpression(
  t.identifier('object'),
  t.identifier('property')
  // `computed` is optional
);
```

得到结果为：

```js
object.property
```

可是我们说了 `object` 必须得是一个 `Expression` 那么为什么 `Identifier` 是合法的呢？

如果我们看一下 `Identifier` 的定义就知道它有一个 `aliases` 属性，声明了它也可以是一个表达式。

```js
aliases: ["Expression", "LVal"],
```

所以由于 `MemberExpression` 是一个 `Expression` 类型，我们可以把它设置为另一个 `MemberExpression` 的 `object`：

```js
t.memberExpression(
  t.memberExpression(
    t.identifier('member'),
    t.identifier('expression')
  ),
  t.identifier('property')
)
```

得到结果为：

```js
member.expression.property
```

你不太可能把每种节点类型的构建器方法签名都背下来，所以最好花些时间来理解它们是如何通过节点定义生成出来的。

你可以在[这里](https://github.com/babel/babel/tree/master/packages/babel-types/src/definitions)找到所有的定义，也可以在[这里](https://github.com/babel/babel/blob/master/doc/ast/spec.md)查看它们的文档。

* * *

# 最佳实践

> I'll be working on this section over the coming weeks.

## 尽量避免遍历抽象语法树（AST）

遍历 AST 的代价很昂贵，并且很容易做出非必要的遍历，可能是数以千计甚或上万次的多余操作。

Babel 尽可能的对此做出了优化，方法是如果合并多个访问者能够在单次遍历做完所有事情的话那就合并它们。

### 及时合并访问者对象

当编写访问者时，若逻辑上必要的话，它会试图在多处调用 `path.traverse`。

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

不过若能把它们写进一个访问者的话会更好，这样只会运行一次，否则你会毫无必要的对同一棵树遍历多次。

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

### 可以手动查找就不要遍历

访问者也会尝试在查找一个特定节点类型时调用 `path.traverse`。

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

然而如果你查找的是很明确并且是表层的节点，那么手动去查找它们会避免代价更高的遍历。

```js
const MyVisitor = {
  FunctionDeclaration(path) {
    path.node.params.forEach(function() {
      // ...
    });
  }
};
```

## 优化嵌套的访问者对象

当你嵌套访问者时，直接把它们嵌套式的写进代码里看起来很合理。

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

当时上述代码在每次调用 `FunctionDeclaration()` 时都会创建新的访问者对象，使得 Babel 变得更大并且每次都要去做验证。 这也是代价不菲的，所以最好把访问者向上提升。

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

如果你需要嵌套的访问者的内部状态，就像这样：

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

可以传递给 `traverse()` 方法的第二个参数然后在访问者中用 `this` 去访问。

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

## 留意嵌套结构

有时候在考虑一些转换时，你可能会忘记某些结构是可以嵌套的。

举例来说，假设我们要从 `Foo` `ClassDeclaration` 中查找 `constructor` `ClassMethod`。.

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

可是我们忽略了类型定义是可以嵌套的，于是使用上面的遍历方式最终也会找到嵌套的 `constructor`：

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