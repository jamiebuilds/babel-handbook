# Babel Plugin Handbook

В этом документе описано как создавать [плагины](https://babeljs.io/docs/advanced/plugins/) для [Babel](https://babeljs.io).

[![cc-by-4.0](https://licensebuttons.net/l/by/4.0/80x15.png)](http://creativecommons.org/licenses/by/4.0/)

This handbook is available in other languages, see the [README](/README.md) for a complete list.

# Содержание

  * [Введение](#introduction)
  * [Базовые концепции](#basics) 
      * [Абстрактные синтаксические деревья (ASTs)](#asts)
      * [Этапы работы Babel](#stages-of-babel)
      * [Парсинг](#parse) 
          * [Лексический анализ](#lexical-analysis)
          * [Синтаксический анализ](#syntactic-analysis)
      * [Трансформация](#transform)
      * [Генерация](#generate)
      * [Обход](#traversal)
      * [Посетители](#visitors)
      * [Пути](#paths) 
          * [Пути в Посетителях](#paths-in-visitors)
      * [Состояние](#state)
      * [Области видимости](#scopes) 
          * [Привязка контекста](#bindings)
  * [API](#api) 
      * [babylon](#babylon)
      * [babel-traverse](#babel-traverse)
      * [babel-types](#babel-types)
      * [Определения](#definitions)
      * [Строители](#builders)
      * [Валидаторы](#validators)
      * [Преобразователи](#converters)
      * [babel-generator](#babel-generator)
      * [babel-template](#babel-template)
  * [Создание вашего первого плагина Babel](#writing-your-first-babel-plugin)
  * [Операции преобразования](#transformation-operations) 
      * [Посещение](#visiting)
      * [Проверка типа узла](#check-if-a-node-is-a-certain-type)
      * [Проверка, есть ли ссылка на идентификатор](#check-if-an-identifier-is-referenced)
      * [Манипуляция](#manipulation)
      * [Замена узла](#replacing-a-node)
      * [Замена узла несколькими узлами](#replacing-a-node-with-multiple-nodes)
      * [Замена узла исходной строкой](#replacing-a-node-with-a-source-string)
      * [Добавление узла-потомка](#inserting-a-sibling-node)
      * [Удаление узла](#removing-a-node)
      * [Замена родителя](#replacing-a-parent)
      * [Удаление родителя](#removing-a-parent)
      * [Область видимости](#scope)
      * [Проверка, привязана ли локальная переменная](#checking-if-a-local-variable-is-bound)
      * [Создание UID](#generating-a-uid)
      * [Отправка объявления переменной в родительскую область видимости](#pushing-a-variable-declaration-to-a-parent-scope)
      * [Переименование привязки и ссылок на нее](#rename-a-binding-and-its-references)
  * [Параметры плагина](#plugin-options)
  * [Построение узлов](#building-nodes)
  * [Лучшие практики](#best-practices) 
      * [Избегайте обхода AST насколько это возможно](#avoid-traversing-the-ast-as-much-as-possible)
      * [Слияние посетителей, когда это возможно](#merge-visitors-whenever-possible)
      * [Do not traverse when manual lookup will do](#do-not-traverse-when-manual-lookup-will-do)
      * [Оптимизации вложенных посетителей](#optimizing-nested-visitors)
      * [Избегайте вложенных структур](#being-aware-of-nested-structures)

# Введение

Babel - это многоцелевой компилятор общего назначения для JavaScript. Более того, это коллекция модулей, которая может быть использована для множества различных форм синтаксического анализа.

> Статический анализ - это процесс анализа кода без запуска этого кода. (Анализ кода во время выполнения известен как динамический анализ). Цели синтаксического анализа очень разнообразны. Это может быть использовано для контроля качества кода (linting), компиляции, подсветки синтаксиса, трансформации, оптимизации, минификации и много другого.

Вы можете использовать Babel для создания множества различных инструментов, которые помогут вам стать более продуктивным и писать лучшие программы.

> For future updates, follow [@thejameskyle](https://twitter.com/thejameskyle) on Twitter.

* * *

# Базовые концепции

Babel - это JavaScript компилятор, точнее компилятор, преобразующий программу на одном языке в программу на другом языке (source-to-source compiler), часто называемый трянслятор. Это означает, что вы даёте Babel некоторый JavaScript код, а Babel модифицирует его, генерирует новый код и возвращает его.

## Абстрактные синтаксические деревья (ASTs)

Каждый из этих шагов требует создания или работы с [Абстрактным синтаксическим деревом](https://en.wikipedia.org/wiki/Abstract_syntax_tree), или AST.

> Babel использует в качестве AST модифицированный [ESTree](https://github.com/estree/estree) и его спецификация находится [здесь](https://github.com/babel/babel/blob/master/doc/ast/spec.md).

```js
function square(n) {
  return n * n;
}
```

> Взгляните на [AST Explorer](http://astexplorer.net/) чтобы получить более полное представление об AST-нодах. [Здесь](http://astexplorer.net/#/Z1exs6BWMq) находится ссылка на него с уже скопированным примером выше.

Эта же программа может быть представлена в виде подобного списка:

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

Или в виде JavaScript-объекта, вроде этого:

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

Вы могли заметить, что каждый уровень AST имеет одинаковую структуру:

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

> Некоторые свойства были убраны для упрощения.

Каждый из этих уровней называется **Нода (Node)**. Отдельный AST может состоять как из одной ноды, так и из сотен, если не тысяч нод. Все вместе они способны описать синтаксис программы, который может быть использован для статического анализа.

Каждая нода имеет следующий интерфейс:

```typescript
interface Node {
  type: string;
}
```

Поле `type` - это строка, описывающая, чем является объект, представляемый данной нодой (т.е. `"FunctionDeclaration"`, `"Identifier"`, или `"BinaryExpression"`). Каждый тип ноды определяет некоторый дополнительный набор полей, описывающий этот конкретный тип.

Пример. Каждая нода, сгенерированная Babel, имеет дополнительные свойства, которые описывают позицию этой ноды в оригинальном исходном коде.

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

Эти свойства - `start`, `end`, `loc` - присутствуют в каждой отдельной ноде.

## Этапы работы Babel

Три основных этапа работы Babel это **парсинг**, **трансформация**, **генерация**.

### Парсинг

Стадия **разбора** принимает код и выводит AST. Существуют два этапа разбора в Babel: [**Лексический анализ**](https://en.wikipedia.org/wiki/Lexical_analysis) и [**Синтаксический анализ**](https://en.wikipedia.org/wiki/Parsing).

#### Лексический анализ

Лексический анализ будет принимать строку кода и превращать его в поток **токенов**.

Вы можете думать о токенах как о плоском массиве элементов синтаксиса языка.

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

Каждый `тип` здесь имеет набор свойств, описывающих токен:

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

Как узлы AST, они также имеют `start`, `end` и `loc`.

#### Синтаксический анализ

Синтаксический анализ примет поток токенов и преобразует их в AST представление. Используя информацию в токенах, этот этап переформатирует их как AST, который отображает структуру кода таким образом, что облегчает работу с ним.

### Трансформация

Этап преобразования принимает AST и проходит через него, добавляя, обновляя, и удаляя узлы по мере прохождения. Это, безусловно, наиболее сложная часть Babel или любого компилятора. Здесь работают плагины и это будет предметом обсуждения большей части этого руководства. Поэтому мы не погружаемся слишком глубоко прямо сейчас.

### Генерация

Этапе [генерации кода](https://en.wikipedia.org/wiki/Code_generation_(compiler)) принимает окончательное AST и преобразует его в сроку кода, так же создавая [source maps](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/).

Генерация кода довольно проста: вы проходите через AST в глубину, строя строку, которая представляет преобразованный код.

## Обход

Когда вы хотите трансорфмировать AST вам необходимо [пройти по всему дереву](https://en.wikipedia.org/wiki/Tree_traversal) рекурсивно.

Скажем, у нас есть тип `FunctionDeclaration`. Он имеет несколько свойств: `id`, `params` и `body`. Каждый из них имеет вложенные узлы.

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

Итак, мы начинаем с `FunctionDeclaration`, и мы знаем его внутренние свойства, поэтому мы посещаем каждое из них и их детей в по порядку.

Далее мы идем к `id`, который представляет собой ` Identifier `. ` Identifier`ы не имеют дочерних узлов, поэтому мы двигаемся дальше.

Затем следует `params`, который представляет собой массив узлов, и мы посещаем каждый из них. В данном случае это один узел, который также является ` Identifier`. Идем дальше.

Затем мы попали `тело`, которое является `BlockStatement` со свойством `body`, которое является массивом узлов, поэтому мы проходимся по каждому из них.

Единственным элементом здесь является узел `ReturnStatement`, который имеет `argument`, мы идем на `argument` и находим выражение `BinaryExpression`.

`BinaryExpression` имеет `оператор`, `левую часть` и `правую часть`. Оператор это не узел, а просто значение, поэтому мы не переходим к нему, и вместо этого просто посещаем `левую` и `правую` части.

Этот процесс обхода происходит в Babel на этапе преобразования.

### Посетители

Когда мы говорим о том чтобы «пройти» к узлу, мы на самом деле имеем ввиду что мы **посещаем** его. Причина, по которой мы используем этот термин, потому что есть эта концепция [**посетителя**](https://en.wikipedia.org/wiki/Visitor_pattern).

Посетители – шаблон, используемый в AST для обхода различных языков. Simply put they are an object with methods defined for accepting particular node types in a tree. Это немного абстрактно, поэтому давайте рассмотрим пример.

```js
const MyVisitor = {
  Identifier() {
    console.log("Called!");
  }
};
```

> **Примечание:** `Identifier() { ... }` является краткой формой для `идентификатор: {enter() { ... }}`.

This is a basic visitor that when used during a traversal will call the `Identifier()` method for every `Identifier` in the tree.

Так с этим кодом `Identifier()` метод будет вызываться в четыре раза с каждым `Identifier` (включая `square`).

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

Все эти вызовы на узле, **enter**. Однако существует также возможность вызова метода посетителя на **exit**.

Представьте, что у нас есть следующая древовидная структура:

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

Как мы проходим вниз по каждой ветви дерева мы в конечном итоге доходим до тупика, где мы должны пройти обратно вверх по дереву, чтобы попасть на следующий узел. Идя вниз по дереву мы **enter** в каждый узел, затем возвращаясь мы **exit** из каждого узла.

Давайте *пройдем* через этот процесс для дерева из примера выше.

  * Вход в `FunctionDeclaration` 
      * Вход в `Identifier (id)`
      * Попадание в тупик
      * Выход из `Identifier (id)`
      * Вход в `Identifier (params[0])`
      * Попадание в тупик
      * Выход из `Identifier (params[0])`
      * Вход в `BlockStatement (body)`
      * Вход в `ReturnStatement (body)` 
          * Вход в `BinaryExpression (argument)`
          * Вход в `Identifier (left)` 
              * Попадание в тупик
          * Выход из `Identifier (left)`
          * Вход в `Identifier (right)` 
              * Попадание в тупик
          * Выход из `Identifier (right)`
          * Выход из `BinaryExpression (argument)`
      * Выход из `ReturnStatement (body)`
      * Выход из `BlockStatement (body)`
  * Выход из `FunctionDeclaration`

Итак, при создании посетителей у вас есть две возможности для посещения узла.

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

### Пути

AST, как правило, имеет много узлов, но как узлы связаны друг с другом? Мы могли бы иметь один гигантский изменяемый объект, которым вы манипулируете и к которому имеете полный доступ, или мы можем упростить это с **путями**.

**Путь** — это объектное представление ссылки между двумя узлами.

Например, если мы возьмем следующий узел и его дочерний:

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

И представление ребенка `Identifier` как путь выглядит примерно так:

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

Он также имеет дополнительные метаданные о пути:

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

#### Пути в Посетителях

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

### Состояние

State is the enemy of AST transformation. State will bite you over and over again and your assumptions about state will almost always be proven wrong by some syntax that you didn't consider.

Возьмем следующий код:

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

Лучший способ справиться с этим — рекурсия. Так что давайте делать как в фильме Кристофера Нолан и положить посетителя в посетителя.

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

Конечно это надуманный пример, но он демонстрирует как исключить глобальное состояние из ваших посетителей.

### Области видимости

Далее введем понятие [**области видимости**](https://en.wikipedia.org/wiki/Scope_(computer_science)). JavaScript имеет [лексическую область видимости](https://en.wikipedia.org/wiki/Scope_(computer_science)#Lexical_scoping_vs._dynamic_scoping), которая имеет структуру дерева, где блоки создают новую область видимости.

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

Код в пределах более глубокой области видимости может использовать ссылку из более высокой области видимости.

```js
function scopeOne() {
  var one = "I am in the scope created by `scopeOne()`";

  function scopeTwo() {
    one = "I am updating the reference in `scopeOne` inside `scopeTwo`";
  }
}
```

Более низкая область видимости также может создать ссылку с тем же именем без её изменения.

```js
function scopeOne() {
  var one = "I am in the scope created by `scopeOne()`";

  function scopeTwo() {
    var one = "I am creating a new `one` but leaving reference in `scopeOne()` alone.";
  }
}
```

При написании трансформации мы хотим быть осторожными с областью видимости. Мы должны убедиться, что не поломаем существующий код в процессе изменения отдельных его частей.

We may want to add new references and make sure they don't collide with existing ones. Or maybe we just want to find where a variable is referenced. We want to be able to track these references within a given scope.

Область видимости может быть представлена как:

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

#### Привязка контекста

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

# API

Babel фактически представляет собой набор модулей. В этом разделе мы рассмотрим основные из них, объясняя, что они делают и как их использовать.

> Примечание: это не замена для подробной API документации, которая вскоре будет доступна где-то в другом месте.

## [`babylon`](https://github.com/babel/babel/tree/master/packages/babylon)

Babylon is Babel's parser. Started as a fork of Acorn, it's fast, simple to use, has plugin-based architecture for non-standard features (as well as future standards).

Сперва давайте установим его.

```sh
$ npm install --save babylon
```

Давайте начнем с разбора строки кода:

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

Мы также можем передать опции в `parse()` следующим образом:

```js
babylon.parse(code, {
  sourceType: "module", // default: "script"
  plugins: ["jsx"] // default: []
});
```

`sourceType` может быть как `"module"`, так и `"script"` и представляет собой режим разбора в Babylon. `"module"` будет производить разбор в strict mode и позволяет объявления модуля, `"script"` — нет.

> **Примечание:** значением `sourceType` по умолчанию является `"script"`, и если будет найден ` import ` или ` export `, то произойдет ошибка. Передайте `sourceType: "module"` чтобы избежать этой ошибки.

Поскольку Babylon имеет плагин-архитектуру, есть также опция `plugins`, которая включит внутренние плагины. Обратите внимание, что в этот API Babylon еще не открыт для внешних плагинов, но может сделать это в будущем.

Чтобы увидеть полный список плагинов, посетите [Babylon README](https://github.com/babel/babel/blob/master/packages/babylon/README.md#plugins).

## [`babel-traverse`](https://github.com/babel/babel/tree/master/packages/babel-traverse)

The Babel Traverse module maintains the overall tree state, and is responsible for replacing, removing, and adding nodes.

Установите его, выполнив:

```sh
$ npm install --save babel-traverse
```

Мы можем использовать его вместе с Babylon для обхода и обновления узлов:

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

Babel Types is a Lodash-esque utility library for AST nodes. It contains methods for building, validating, and converting AST nodes. It's useful for cleaning up AST logic with well thought out utility methods.

Его можно установить, запустив:

```sh
$ npm install --save babel-types
```

Затем начнете его использовать:

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

### Определения

Типы Babel имеют определения для каждого типа узла с информацией о том, какие свойства чему принадлежат, какие значения являются допустимыми, как построить этот узел, как узел должен быть пройден, а также псевдонимы узла.

Определение типа узла выглядит следующим образом:

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

### Строители

Обратите внимание, что в приведенном выше определении для `BinaryExpression` есть поле `builder`.

```js
builder: ["operator", "left", "right"]
```

Это потому, что каждый тип узла получает метод-строитель, который при использовании выглядит следующим образом:

```js
t.binaryExpression("*", t.identifier("a"), t.identifier("b"));
```

И создает следующий AST:

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

Который при выводе выглядит следующим образом:

```js
a * b
```

Строители также будут проверять узлы, которые они создают и бросить ошибки если используются ненадлежащим образом. Что приводит нас к необходимости познакомиться со следующим типом методов.

### Валидаторы

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

### Преобразователи

> [WIP]

## [`babel-generator`](https://github.com/babel/babel/tree/master/packages/babel-generator)

Babel Generator — это генератор кода Babel. Он принимает AST и превращает его в код с sourcemaps.

Выполните следующие действия, чтобы установить его:

```sh
$ npm install --save babel-generator
```

Затем используйте его

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

Вы также можете передать параметры в `generate()`.

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

Babel Template это еще один крошечный, но невероятно полезный модуль. Он позволяет писать строки кода с заполнителями, которые можно использовать вместо создания вручную массовых AST.

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

# Создание вашего первого плагина Babel

Теперь, когда вы знакомы с основами Babel, давайте свяжем это вместе с API для плагинов.

Start off with a `function` that gets passed the current [`babel`](https://github.com/babel/babel/tree/master/packages/babel-core) object.

```js
export default function(babel) {
  // plugin contents
}
```

Так как вы будете использовать его так часто, вы, скорее всего, захотите просто взять `babel.types` следующим образом:

```js
export default function({ types: t }) {
  // plugin contents
}
```

Затем вы возвращаете объект со свойством `visitor`, который является основным посетитель для плагина.

```js
export default function({ types: t }) {
  return {
    visitor: {
      // visitor contents
    }
  };
};
```

Давайте быстро напишем плагин, чтобы показать как это работает. Вот наш исходный код:

```js
foo === bar;
```

Или в виде AST:

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

Мы начнем с добавления метода посетителя `BinaryExpression`.

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

Затем давайте сведем это к `BinaryExpression`, которые используют оператор `===`.

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

Теперь давайте заменить свойство `left` новым идентификатором:

```js
BinaryExpression(path) {
  if (path.node.operator !== "===") {
    return;
  }

  path.node.left = t.identifier("sebmck");
  // ...
}
```

Уже теперь если мы запустим этот плагин, мы получим:

```js
sebmck === bar;
```

Теперь давайте просто заменим свойство `right`.

```js
BinaryExpression(path) {
  if (path.node.operator !== "===") {
    return;
  }

  path.node.left = t.identifier("sebmck");
  path.node.right = t.identifier("dork");
}
```

И теперь для нашего конечного результата:

```js
sebmck === dork;
```

Великолепно! Наш самый первый плагин для Babel.

* * *

# Операции преобразования

## Посещение

### Проверка типа узла

Если вы хотите проверить тип узла, то лучше всего сделать это следующим образом:

```js
BinaryExpression(path) {
  if (t.isIdentifier(path.node.left)) {
    // ...
  }
}
```

Вы также можете сделать поверхностную проверку свойств в этом узле:

```js
BinaryExpression(path) {
  if (t.isIdentifier(path.node.left, { name: "n" })) {
    // ...
  }
}
```

Это функционально эквивалентно:

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

### Проверка, есть ли ссылка на идентификатор

```js
Identifier(path) {
  if (path.isReferencedIdentifier()) {
    // ...
  }
}
```

В качестве альтернативы:

```js
Identifier(path) {
  if (t.isReferenced(path.node, path.parent)) {
    // ...
  }
}
```

## Манипуляция

### Замена узла

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

### Замена узла несколькими узлами

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

> **Примечание:** При замене выражения с несколькими узлами, они должны быть выражениями. Это потому, что Babel широко использует эвристику, при замене узлов, что означает, что вы можете сделать некоторые довольно сумасшедшие преобразования, которые в противном случае были бы чрезвычайно многословные.

### Замена узла исходной строкой

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

> **Примечание:** Не рекомендуется использовать этот API, если вы имеете дело с динамическим источником строк, в противном случае это более эффективно для разбора кода вне посетителя.

### Добавление узла-потомка

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

### Удаление узла

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

### Замена родителя

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

### Удаление родителя

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

## Область видимости

### Проверка, привязана ли локальная переменная

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

### Создание UID

Следующий код сгенерирует идентификатор, который не конфликтует ни содной из локально определенных переменных.

```js
FunctionDeclaration(path) {
  path.scope.generateUidIdentifier("uid");
  // Node { type: "Identifier", name: "_uid" }
  path.scope.generateUidIdentifier("uid");
  // Node { type: "Identifier", name: "_uid2" }
}
```

### Отправка объявления переменной в родительскую область видимости

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

### Переименование привязки и ссылок на нее

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

# Параметры плагина

Если вы хотите позволить пользователям настраивать поведение вашего плагина для Babel, вы можете принимать параметры, специфичные для этого плагина, которые пользователи могут указать следующим образом:

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

Затем эти параметры передаются в посетителей через объект `state`:

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

Эти параметры зависят от плагина, и вам не удается получить доступ к параметрам от других плагинов.

* * *

# Построение узлов

При написании преобразования часто вы хотите построить некоторые узлы для вставки в AST. Как упоминалось ранее, вы можете сделать это с помощью методов [builder](#builder) в пакете [`babel-types`](#babel-types).

Имя метода для builder это просто имя типа узла, который вы хотите построить за исключением того, что первая буква в нижнем регистре. For example if you wanted to build a `MemberExpression` you would use `t.memberExpression(...)`.

The arguments of these builders are decided by the node definition. There's some work that's being done to generate easy-to-read documentation on the definitions, but for now they can all be found [here](https://github.com/babel/babel/tree/master/packages/babel-types/src/definitions).

Определение узла выглядит следующим образом:

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

Здесь вы можете увидеть всю информацию об этом конкретном типе узла, включая то как построить его, пройти по нему и проверить его.

By looking at the `builder` property, you can see the 3 arguments that will be needed to call the builder method (`t.memberExpression`).

```js
builder: ["object", "property", "computed"],
```

> Note that sometimes there are more properties that you can customize on the node than the `builder` array contains. This is to keep the builder from having too many arguments. In these cases you need to set the properties manually. An example of this is [`ClassMethod`](https://github.com/babel/babel/blob/bbd14f88c4eea88fa584dd877759dd6b900bf35e/packages/babel-types/src/definitions/es2015.js#L238-L276).

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

Вы можете найти все актуальные [определения здесь](https://github.com/babel/babel/tree/master/packages/babel-types/src/definitions) и вы можете увидеть их [документацию здесь](https://github.com/babel/babel/blob/master/doc/ast/spec.md)

* * *

# Лучшие практики

> I'll be working on this section over the coming weeks.

## Избегайте обхода AST насколько это возможно

Traversing the AST is expensive, and it's easy to accidentally traverse the AST more than necessary. This could be thousands if not tens of thousands of extra operations.

Babel optimizes this as much as possible, merging visitors together if it can in order to do everything in a single traversal.

### Слияние посетителей, когда это возможно

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

### Do not traverse when manual lookup will do

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

## Оптимизации вложенных посетителей

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

Если вам нужно некоторое состояние в пределах вложенного посетителя, как:

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

## Избегайте вложенных структур

Иногда, когда думаете о данном преобразовании, вы можете забыть, что данная структура может быть вложенной.

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

> For future updates, follow [@thejameskyle](https://twitter.com/thejameskyle) on Twitter.