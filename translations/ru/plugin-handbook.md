# Руководство Плагинов Babel

В этом документе описано как создавать [плагины](https://babeljs.io/docs/advanced/plugins/) для [Babel](https://babeljs.io).

[![cc-by-4.0](https://licensebuttons.net/l/by/4.0/80x15.png)](http://creativecommons.org/licenses/by/4.0/)

Это руководство также доступно и на других языках, см. [файл README](/README.md) для получения полного списка.

# Содержание

  * [Введение](#toc-introduction)
  * [Базовые концепции](#toc-basics) 
      * [Абстрактные синтаксические деревья (ASTs)](#toc-asts)
      * [Этапы работы Babel](#toc-stages-of-babel)
      * [Парсинг](#toc-parse) 
          * [Лексический анализ](#toc-lexical-analysis)
          * [Синтаксический анализ](#toc-syntactic-analysis)
      * [Трансформация](#toc-transform)
      * [Генерация](#toc-generate)
      * [Обход](#toc-traversal)
      * [Посетители](#toc-visitors)
      * [Пути](#toc-paths) 
          * [Пути в Посетителях](#toc-paths-in-visitors)
      * [Состояние](#toc-state)
      * [Области видимости](#toc-scopes) 
          * [Привязка контекста](#toc-bindings)
  * [API](#toc-api) 
      * [babylon](#toc-babylon)
      * [babel-traverse](#toc-babel-traverse)
      * [babel-types](#toc-babel-types)
      * [Определения](#toc-definitions)
      * [Строители](#toc-builders)
      * [Валидаторы](#toc-validators)
      * [Преобразователи](#toc-converters)
      * [babel-generator](#toc-babel-generator)
      * [babel-template](#toc-babel-template)
  * [Создание вашего первого плагина Babel](#toc-writing-your-first-babel-plugin)
  * [Операции преобразования](#toc-transformation-operations) 
      * [Посещение](#toc-visiting)
      * [Get the Path of Sub-Node](#toc-get-the-path-of-a-sub-node)
      * [Check if a node is a certain type](#toc-check-if-a-node-is-a-certain-type)
      * [Check if an identifier is referenced](#toc-check-if-an-identifier-is-referenced)
      * [Манипуляция](#toc-manipulation)
      * [Replacing a node](#toc-replacing-a-node)
      * [Replacing a node with multiple nodes](#toc-replacing-a-node-with-multiple-nodes)
      * [Replacing a node with a source string](#toc-replacing-a-node-with-a-source-string)
      * [Inserting a sibling node](#toc-inserting-a-sibling-node)
      * [Removing a node](#toc-removing-a-node)
      * [Replacing a parent](#toc-replacing-a-parent)
      * [Removing a parent](#toc-removing-a-parent)
      * [Область видимости](#toc-scope)
      * [Checking if a local variable is bound](#toc-checking-if-a-local-variable-is-bound)
      * [Generating a UID](#toc-generating-a-uid)
      * [Pushing a variable declaration to a parent scope](#toc-pushing-a-variable-declaration-to-a-parent-scope)
      * [Rename a binding and its references](#toc-rename-a-binding-and-its-references)
  * [Параметры плагина](#toc-plugin-options)
  * [Построение узлов](#toc-building-nodes)
  * [Лучшие практики](#toc-best-practices) 
      * [Избегайте обхода AST насколько это возможно](#toc-avoid-traversing-the-ast-as-much-as-possible)
      * [Слияние посетителей, когда это возможно](#toc-merge-visitors-whenever-possible)
      * [Do not traverse when manual lookup will do](#toc-do-not-traverse-when-manual-lookup-will-do)
      * [Оптимизации вложенных посетителей](#toc-optimizing-nested-visitors)
      * [Избегайте вложенных структур](#toc-being-aware-of-nested-structures)

# <a id="toc-introduction"></a>Введение

Babel - это многоцелевой компилятор общего назначения для JavaScript. Более того, это коллекция модулей, которая может быть использована для множества различных форм синтаксического анализа.

> Статический анализ - это процесс анализа кода без запуска этого кода. (Анализ кода во время выполнения известен как динамический анализ). Цели синтаксического анализа очень разнообразны. Это может быть использовано для контроля качества кода (linting), компиляции, подсветки синтаксиса, трансформации, оптимизации, минификации и много другого.

Вы можете использовать Babel для создания множества различных инструментов, которые помогут Вам стать более продуктивным и писать лучшие программы.

> ***Оставайтесь в курсе последних обовлений - подписывайтесь в Твиттере на [@thejameskyle](https://twitter.com/thejameskyle).***

* * *

# <a id="toc-basics"></a>Базовые концепции

Babel - это JavaScript компилятор, точнее компилятор, преобразующий программу на одном языке в программу на другом языке (source-to-source compiler), часто называемый трянслятор. Это означает, что вы даёте Babel некоторый JavaScript код, а Babel модифицирует его, генерирует новый код и возвращает его.

## <a id="toc-asts"></a>Абстрактные синтаксические деревья (ASTs)

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

## <a id="toc-stages-of-babel"></a>Этапы работы Babel

Три основных этапа работы Babel это **парсинг**, **трансформация**, **генерация**.

### <a id="toc-parse"></a>Парсинг

Стадия **разбора** принимает код и выводит AST. Существуют два этапа разбора в Babel: [**Лексический анализ**](https://en.wikipedia.org/wiki/Lexical_analysis) и [**Синтаксический анализ**](https://en.wikipedia.org/wiki/Parsing).

#### <a id="toc-lexical-analysis"></a>Лексический анализ

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

#### <a id="toc-syntactic-analysis"></a>Синтаксический анализ

Синтаксический анализ примет поток токенов и преобразует их в AST представление. Используя информацию в токенах, этот этап переформатирует их как AST, который отображает структуру кода таким образом, что облегчает работу с ним.

### <a id="toc-transform"></a>Трансформация

Этап преобразования принимает AST и проходит через него, добавляя, обновляя, и удаляя узлы по мере прохождения. Это, безусловно, наиболее сложная часть Babel или любого компилятора. Здесь работают плагины и это будет предметом обсуждения большей части этого руководства. Поэтому мы не погружаемся слишком глубоко прямо сейчас.

### <a id="toc-generate"></a>Генерация

The [code generation](https://en.wikipedia.org/wiki/Code_generation_(compiler)) stage takes the final AST and turns it back into a string of code, also creating [source maps](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/).

Генерация кода довольно проста: вы проходите через AST в глубину, строя строку, которая представляет преобразованный код.

## <a id="toc-traversal"></a>Обход

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

### <a id="toc-visitors"></a>Посетители

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

### <a id="toc-paths"></a>Пути

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

А также множество методов, связанных с добавлением, обновлением, перемещением и удалением узлов, но об этом мы поговорим чуточку позже.

В некотором смысле, пути являются **активным** представлением позиции узла в дереве, а также содержат различные сведения об узле. Всякий раз эта информация обновляется, когда вызывается изменяющий дерево метод. Babel всё сделает это самостоятельно, чтобы Ваша работа с узлами была максимально легкой, и при этом, не оказывая влияния на последующие события.

#### <a id="toc-paths-in-visitors"></a>Пути в Посетителях

Когда у вас посетитель, который имеет метод `Identifier()`, на самом деле вы посещаете сам путь вместо узла. Таким образом, Вы работаете с активным представлением узла вместо самого узла.

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

### <a id="toc-state"></a>Состояние

Состояние является противником AST трансформации. Состояние будет "колоть" вас снова и снова, и ваши предположения о состоянии будут почти всегда опровергнуты каким-либо синтаксисом, который вы не рассматривали.

Возьмем следующий код:

```js
function square(n) {
  return n * n;
}
```

А теперь запустим туда коварного посетителя, который переименует `n` в `x`.

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

Это может сработать для приведенного выше кода, но мы можем легко это прервать, вызвав:

```js
function square(n) {
  return n * n;
}
n;
```

Лучший способ справиться с этим — рекурсия. Так что давайте вспомним фильм Кристофера Нолана "Начало" и положим посетителя в посетителя.

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

### <a id="toc-scopes"></a>Области видимости

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

Всякий раз, когда вы создаете ссылку в JavaScript, будь то переменной, функции, класса, параметра, импорта и т. д., она принадлежит к текущей области видимости.

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

Нам может потребоваться добавить новые ссылки и убедиться, что они не пересекаются с уже существующими. Или, может быть, мы просто хотим найти, на что ссылается переменная. Другими словами, мы просто хотим иметь возможность отслеживать эти ссылки в пределах заданной области.

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

Когда вы создаете новый scope, вы делаете это передавая ему путь и родительский scope. Затем в процессе обхода он собирает все ссылки ("bindings") внутри scope.

Как только всё это сделано, перед Вами и открываются все методы, которые можно использовать в областях видимости. Хотя как обычно, мы поговорим об этом чуточку позднее.

#### <a id="toc-bindings"></a>Привязка контекста

Все ссылки принадлежат к определенной области; эта связь известна как **привязка**.

```js
function scopeOnce() {
  var ref = "This is a binding";

  ref; // This is a reference to a binding

  function scopeTwo() {
    ref; // This is a reference to a binding from a lower scope
  }
}
```

Одиночная привязка выглядит следующим образом:

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

С этой информацией вы можете найти все ссылки на привязку (binding), увидеть, какой тип привязки (параметр, декларация и т. д.), поиск того, к какой области (scope) он принадлежит, или получить копию его идентификатора. You can even tell if it's constant and if not, see what paths are causing it to be non-constant.

Иметь возможность сказать, является ли binding постоянным, полезно для многих целей, крупнейшим из которых является минификация.

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

Babel фактически представляет собой набор модулей. В этом разделе мы рассмотрим основные из них, объясняя, что они делают и как их использовать.

> Примечание: это не замена для подробной API документации, которая вскоре будет доступна где-то в другом месте.

## <a id="toc-babylon"></a>[`babylon`](https://github.com/babel/babylon)

Babylon это парсер Babel'я. Появившийся как форк Acorn'а, он быстрый, простой в использовании, имеет плагин ориентированную архитектуру для нестандартных функций (а также будущих стандартов).

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

To see a full list of plugins, see the [Babylon README](https://github.com/babel/babylon/blob/master/README.md#plugins).

## <a id="toc-babel-traverse"></a>[`babel-traverse`](https://github.com/babel/babel/tree/master/packages/babel-traverse)

Модуль Babel Traverse поддерживает общее состояние дерева и отвечает за замену, удаление и добавление узлов.

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

## <a id="toc-babel-types"></a>[`babel-types`](https://github.com/babel/babel/tree/master/packages/babel-types)

Babel Types is a Lodash-esque utility library for AST nodes. Он содержит методы для создания, проверки и преобразования узлов AST. Он полезен для очистки AST логики с хорошо продуманными служебными методами.

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

### <a id="toc-definitions"></a>Определения

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

### <a id="toc-builders"></a>Строители

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

### <a id="toc-validators"></a>Валидаторы

Определение `BinaryExpression` также включает информацию о `полях` узла и как проверить их.

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

Это используется для создания двух типов проверки методов. В первом из которых является `isX`.

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

### <a id="toc-converters"></a>Преобразователи

> [WIP]

## <a id="toc-babel-generator"></a>[`babel-generator`](https://github.com/babel/babel/tree/master/packages/babel-generator)

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

# <a id="toc-writing-your-first-babel-plugin"></a>Создание вашего первого плагина Babel

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

# <a id="toc-transformation-operations"></a>Операции преобразования

## <a id="toc-visiting"></a>Посещение

### <a id="toc-get-the-path-of-a-sub-node"></a>Get the Path of Sub-Node

To access an AST node's property you normally access the node and then the property. `path.node.property`

```js
BinaryExpression(path) {
  path.node.left;
}
```

If you need to access the path of that property instead, use the `get` method of a path, passing in the string to the property.

```js
BinaryExpression(path) {
  path.get('left');
}
Program(path) {
  path.get('body[0]');
}
```

### <a id="toc-check-if-a-node-is-a-certain-type"></a>Check if a node is a certain type

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

## <a id="toc-manipulation"></a>Манипуляция

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

> **Примечание:** При замене выражения с несколькими узлами, они должны быть выражениями. Это потому, что Babel широко использует эвристику, при замене узлов, что означает, что вы можете сделать некоторые довольно сумасшедшие преобразования, которые в противном случае были бы чрезвычайно многословные.

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

> **Примечание:** Не рекомендуется использовать этот API, если вы имеете дело с динамическим источником строк, в противном случае это более эффективно для разбора кода вне посетителя.

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

## <a id="toc-scope"></a>Область видимости

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

# <a id="toc-plugin-options"></a>Параметры плагина

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

* * *

# <a id="toc-building-nodes"></a>Построение узлов

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

# <a id="toc-best-practices"></a>Лучшие практики

> В ближайшее время этот раздел будет дополнен.

## <a id="toc-avoid-traversing-the-ast-as-much-as-possible"></a>Избегайте обхода AST насколько это возможно

Traversing the AST is expensive, and it's easy to accidentally traverse the AST more than necessary. This could be thousands if not tens of thousands of extra operations.

Babel optimizes this as much as possible, merging visitors together if it can in order to do everything in a single traversal.

### <a id="toc-merge-visitors-whenever-possible"></a>Слияние посетителей, когда это возможно

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

### <a id="toc-do-not-traverse-when-manual-lookup-will-do"></a>Do not traverse when manual lookup will do

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

## <a id="toc-optimizing-nested-visitors"></a>Оптимизация вложенности посетителей

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

## <a id="toc-being-aware-of-nested-structures"></a>Избегайте вложенных структур

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

> ***Оставайтесь в курсе последних обновлений - подписывайтесь в Твиттере на [@thejameskyle](https://twitter.com/thejameskyle).***