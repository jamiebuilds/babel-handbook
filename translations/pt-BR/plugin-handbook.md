# Babel Plugin Handbook

Este documento aborda como criar [plugins](https://babeljs.io/docs/advanced/plugins/) para o [Babel](https://babeljs.io).

[![cc-by-4.0](https://licensebuttons.net/l/by/4.0/80x15.png)](http://creativecommons.org/licenses/by/4.0/)

Este manual está disponível em outros idiomas, consulte o [arquivo Leia-me](/README.md) para obter uma lista completa.

# Tabela de Conteúdos

  * [Introdução](#toc-introduction)
  * [Noções básicas](#toc-basics) 
      * [ASTs](#toc-asts)
      * [Estágios do Babel](#toc-stages-of-babel)
      * [Parse](#toc-parse) 
          * [Análise léxica](#toc-lexical-analysis)
          * [Análise sintática](#toc-syntactic-analysis)
      * [Transform](#toc-transform)
      * [Generate](#toc-generate)
      * [Traversal](#toc-traversal)
      * [Visitors](#toc-visitors)
      * [Paths](#toc-paths) 
          * [Paths in Visitors](#toc-paths-in-visitors)
      * [State](#toc-state)
      * [Scopes](#toc-scopes) 
          * [Bindings](#toc-bindings)
  * [API](#toc-api) 
      * [babylon](#toc-babylon)
      * [babel-traverse](#toc-babel-traverse)
      * [babel-types](#toc-babel-types)
      * [Definições](#toc-definitions)
      * [Construtores](#toc-builders)
      * [Validadores](#toc-validators)
      * [Conversores](#toc-converters)
      * [babel-generator](#toc-babel-generator)
      * [babel-template](#toc-babel-template)
  * [Escrevendo seu primeiro Plugin do Babel](#toc-writing-your-first-babel-plugin)
  * [Operações de transformação](#toc-transformation-operations) 
      * [Visitando](#toc-visiting)
      * [Get the Path of Sub-Node](#toc-get-the-path-of-a-sub-node)
      * [Check if a node is a certain type](#toc-check-if-a-node-is-a-certain-type)
      * [Check if an identifier is referenced](#toc-check-if-an-identifier-is-referenced)
      * [Manipulação](#toc-manipulation)
      * [Replacing a node](#toc-replacing-a-node)
      * [Replacing a node with multiple nodes](#toc-replacing-a-node-with-multiple-nodes)
      * [Replacing a node with a source string](#toc-replacing-a-node-with-a-source-string)
      * [Inserting a sibling node](#toc-inserting-a-sibling-node)
      * [Removing a node](#toc-removing-a-node)
      * [Replacing a parent](#toc-replacing-a-parent)
      * [Removing a parent](#toc-removing-a-parent)
      * [Escopo](#toc-scope)
      * [Checking if a local variable is bound](#toc-checking-if-a-local-variable-is-bound)
      * [Generating a UID](#toc-generating-a-uid)
      * [Pushing a variable declaration to a parent scope](#toc-pushing-a-variable-declaration-to-a-parent-scope)
      * [Rename a binding and its references](#toc-rename-a-binding-and-its-references)
  * [Opções do plugin](#toc-plugin-options)
  * [Construindo nós](#toc-building-nodes)
  * [Melhores práticas](#toc-best-practices) 
      * [Evitar cruzar o máximo possível o AST](#toc-avoid-traversing-the-ast-as-much-as-possible)
      * [Mesclar os visitantes sempre que possível](#toc-merge-visitors-whenever-possible)
      * [Não cruzar quando farão pesquisa manual](#toc-do-not-traverse-when-manual-lookup-will-do)
      * [Otimizando os visitantes aninhados](#toc-optimizing-nested-visitors)
      * [Estando ciente das estruturas aninhadas](#toc-being-aware-of-nested-structures)

# <a id="toc-introduction"></a>Introdução

Babel é um compilador genérico de múltiplos propósito para JavaScript. Mais do que isso, é uma coleção de módulos que podem ser usados de muitas formas diferentes de análise estática.

> Análise estática é o processo de análise de código sem executá-lo. (Análise de código durante a execução é conhecido como análise dinâmica). O objectivo da análise estática varia muito. Ele pode ser usado para linting, compilação, realce de código, transformação de código, otimização, minificação e muito mais.

Você pode usar Babel para construir vários tipos de ferramentas que podem ajudá-lo a ser mais produtivo e escrever programas melhores.

> ***Para futuras atualizações, siga [@thejameskyle](https://twitter.com/thejameskyle) no Twitter.***

* * *

# <a id="toc-basics"></a>Noções básicas

Babel é um compilador JavaScript, especificamente um compilador de código para código, muitas vezes chamado de "transpiler". Isto significa que você dá ao Babel algum código JavaScript, ele modifica o código e gera um novo código de volta.

## <a id="toc-asts"></a>ASTs

Cada um destes passos envolvem criação ou trabalho com uma [Árvore de Sintaxe Abstrata](https://en.wikipedia.org/wiki/Abstract_syntax_tree) ou AST.

> Babel usa um AST modificado de [ESTree](https://github.com/estree/estree), com uma especificação de núcleo localizada [aqui](https://github.com/babel/babel/blob/master/doc/ast/spec.md).

```js
function square(n) {
  return n * n;
}
```

> Confira [Explorando a AST](http://astexplorer.net/) para ter uma melhor noção de nós de AST. [Aqui](http://astexplorer.net/#/Z1exs6BWMq) está um link para ele, com o código de exemplo acima.

Este mesmo programa pode ser representado como uma lista assim:

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

Ou como um JSON como este:

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

Você observará que cada nível da AST tem uma estrutura semelhante:

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

> Nota: Algumas propriedades foram removidas para manter a simplicidade.

Cada um deles são conhecidos como um **nó**. Um AST pode ser composta por um único nó, ou centenas, senão milhares de nós. Juntos, eles são capazes de descrever a sintaxe de um programa que pode ser usado para análise estática.

Cada nó tem esta interface:

```typescript
interface Node {
  type: string;
}
```

O `tipo` de campo é uma seqüência de caracteres que representa o tipo do nó do objeto (ex. `"FunctionDeclaration"`, `"Identifier"` ou `"BinaryExpression"`). Cada tipo de nó define um conjunto adicional de propriedades que descrevem o tipo de nó específico.

Existem propriedades adicionais em cada nó que Babel gera que descrevem a posição do nó no código-fonte original.

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

Estas propriedades `start`, `end`, `loc`, aparecem em cada nó.

## <a id="toc-stages-of-babel"></a>Estágios do Babel

Os três estágios primários de Babel são **parse**, **transform**, **generate**.

### <a id="toc-parse"></a>Parse

O estágio de **parse**, paga o código e produz um AST. Existem duas fases de análise de Babel: [**Análise léxica**](https://en.wikipedia.org/wiki/Lexical_analysis) e [**Análise sintática**](https://en.wikipedia.org/wiki/Parsing).

#### <a id="toc-lexical-analysis"></a>Análise léxica

Análise lexical pega uma sequência de caracteres de código e o transforma em um fluxo de **tokens**.

Você pode pensar nos tokens como uma matriz plana de pedaços de sintaxe de linguagem.

```js
n * n;
```

```js
[
  { type: { ... }, value: "n", start: 0, end: 1, loc: { ... } },
  { type: { ... }, value: "*", start: 2, end: 3, loc: { ... } },
  { type: { ... }, value: "n", start: 4, end: 5, loc: { ... } },   ...
]
```

Cada um dos `tipos` tem um conjunto de propriedades que descrevem o token:

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

Como nós de AST também têm um `start`, `end` e `loc`.

#### <a id="toc-syntactic-analysis"></a>Análise sintática

Análise sintática irá levar a um fluxo de tokens e transformá-lo em uma representação de AST. Usando as informações de tokens, esta fase será reformatá-los como um AST que representa a estrutura do código de uma forma que torna mais fácil trabalhar.

### <a id="toc-transform"></a>Transform

O estágio de [transform](https://en.wikipedia.org/wiki/Program_transformation) atravessa um AST, adicionando, atualizando e removendo os nós junto. Esta é de longe a parte mais complexa de Babel ou qualquer compilador. Isto é onde operam os plugins e então será o assunto principal deste manual. Então não mergulharemos tão profundamente agora.

### <a id="toc-generate"></a>Generate

The [code generation](https://en.wikipedia.org/wiki/Code_generation_(compiler)) stage takes the final AST and turns it back into a string of code, also creating [source maps](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/).

Geração de código é muito simples: você percorre através da AST primeiro, e constroi uma sequência de caracteres que representa o código transformado.

## <a id="toc-traversal"></a>Traversal

Quando você deseja transformar um AST... você tem que [percorrer (traverse) a árvore](https://en.wikipedia.org/wiki/Tree_traversal) recursivamente.

Digamos que temos um nó do tipo `FunctionDeclaration`. Ele tem algumas propriedades como: `id`, `params` e `body`. Cada um deles possui seus próprios nós aninhados.

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

Então começamos no nó `FunctionDeclaration` e sabemos suas propriedades internas, logo, podemos visitar cada uma delas e seus filhos na sequência.

Depois vamos para o `id`, que é um `Identifier`.`Identifier` e não tem quaisquer propriedades do nó filho então podemos continuar.

Depois disso temos a propriedade `params`, que é uma matriz de nós. Nós os percorreremos, visitando cada um deles. Neste caso `params` possui um único nó, que é também um <0>Identifier</0>, então podemos continuar.

Então encontramos o `body` que é um `BlockStatement` com uma propriedade `body` que é uma matriz de nós, então nós vamos a cada um deles.

O único item que aqui é um nó `ReturnStatement` que tem um `argument`, nós vamos para o `argument` e encontramos um `BinaryExpression`.

O `BinaryExpression` tem uma propriedade `operator`, uma `left` e uma `right`. O operador não é um nó, apenas um valor, então não vamos até ele. Em vez disso, apenas visitamos as propriedades `left` e `right`.

Este processo de percorrer (traverse) acontece durante toda a fase de transformação de Babel.

### <a id="toc-visitors"></a>Visitors

Quando falamos sobre "ir" para um nó, na verdade queremos dizer que estamos **visitando** eles. A razão pela qual nós usamos esse termo está ligada ao conceito do design pattern [**visitor**](https://en.wikipedia.org/wiki/Visitor_pattern), usado frequentemente.

Visitors é um padrão usando pela AST para percorrer a linguagem. Simplificando, eles são um objeto com métodos definidos para aceitar tipos específicos de nó em uma árvore. Isso é um pouco abstrato, então vamos ver um exemplo.

```js
const MyVisitor = {
  Identifier() {
    console.log("Called!");
  }
};
```

> **Nota:** `Identifier() { ... }` é uma abreviação para `Identifier: {enter() { ... }}`.

Esta é uma visita básica que quando usado durante um percurso irá chamar o método `Identifier()` para cada `Identifier` na árvore.

Então com esse código o método `Identifier()` será chamado quatro vezes, um para cada `Identifier` (incluindo a função `square`).

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

Essas chamadas acontecem no nó de **entrada**. No entanto, há também a possibilidade de chamar um método visitante quando estiver no nó de **saída**.

Imagine que temos esta estrutura de árvore:

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

Enquanto percorrermos cada ramo da árvore, eventualmente atingimos becos sem saída, onde precisamos voltar para a árvore anterior para obter o próximo nó. Percorrendo a árvore podemos temos os nós de **entrada**, e voltando um nível acima, temos os nós de **saída** de cada nó.

Vamos *caminhar* através deste processo, utilizando a árvore acima.

  * Enter `FunctionDeclaration` 
      * Enter `Identifier (id)`
      * Hit dead end
      * Exit `Identifier (id)`
      * Enter `Identifier (params[0])`
      * Hit dead end
      * Exit `Identifier (params[0])`
      * Enter `BlockStatement (body)`
      * Enter `ReturnStatement (body)` 
          * Enter `BinaryExpression (argument)`
          * Enter `Identifier (left)` 
              * Hit dead end
          * Exit `Identifier (left)`
          * Enter `Identifier (right)` 
              * Hit dead end
          * Exit `Identifier (right)`
          * Exit `BinaryExpression (argument)`
      * Exit `ReturnStatement (body)`
      * Exit `BlockStatement (body)`
  * Exit `FunctionDeclaration`

Então, quando criamos um visitante, temos duas oportunidades para visitar um nó.

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

### <a id="toc-paths"></a>Paths

Um AST geralmente tem muitos nós, mas como os nós se relacionam um com o outro? Podemos ter um enorme objeto, mutável, no qual você pode manipular e ter total acesso, ou, podemos simplificar isso com os **Paths**.

Um **Path**, é um objeto que representa a ligação entre dois nós.

Por exemplo, se tomarmos o seguinte nó e seu filho:

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

E representar o `Indentifier` do nó filho como um caminho, parece algo como isto:

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

Ele também tem metadados adicionais sobre o caminho:

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

Bem como toneladas e toneladas de métodos relacionados para adicionar, atualizar, mover e remover nós, mas nós vamos ver isso mais tarde.

Em determinado momento, os Paths são como uma representação **reativa** da posição do nó na árvore e todas as informações sobre o mesmo. Sempre que você chamar um método que modifica a árvore, esta informação é atualizada. Babel gerencia tudo isso para tornar o trabalho com árvores e nós o mais simples e fácil possível.

#### <a id="toc-paths-in-visitors"></a>Paths in Visitors

Quando você tem um visitante que tem um método `Identifier()`, você na verdade está visitando o caminho em vez do nó. Desta forma, você está trabalhando, principalmente, com a representação reativa de um nó em vez do próprio nó.

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

### <a id="toc-state"></a>State

Estado (global e local) são os inimigos da AST. Eles irão pregar tanta peça em você, que você vai acabar vendo que seus conhecimentos sobre estado estarão errados devido a alguma sintaxe que você não considerava.

Veja o seguinte código:

```js
function square(n) {
  return n * n;
}
```

Vamos escrever um Visitor que vai renomear `n` para `x`.

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

Isto pode funcionar para o código acima, mas podemos facilmente quebra-lo:

```js
function square(n) {
  return n * n;
}
n;
```

A melhor maneira de lidar com isso é usando recursão. Então vamos fazer como um filme de Christopher Nolan, e colocar um Visitor dentro de um Visitor.

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

Este é um exemplo forçado mas, ele demonstra como eliminar o estado global de seus Visitors.

### <a id="toc-scopes"></a>Scopes

Agora, vamos introduzir o conceito de [**escopos**](https://en.wikipedia.org/wiki/Scope_(computer_science)). JavaScript tem [escopo léxico](https://en.wikipedia.org/wiki/Scope_(computer_science)#Lexical_scoping_vs._dynamic_scoping), que é uma estrutura de árvore onde blocos criam novos escopos.

```js
// global scope

function scopeOne() {
  // scope 1

  function scopeTwo() {
    // scope 2
  }
}
```

Sempre que você criar uma referência em JavaScript, quer seja por uma variável, função, classe, param, importação, etc., ele pertence ao escopo atual.

```js
var global = "I am in the global scope";

function scopeOne() {
  var one = "I am in the scope created by `scopeOne()`";

  function scopeTwo() {
    var two = "I am in the scope created by `scopeTwo()`";
  }
}
```

Código dentro de um escopo mais profundo pode usar uma referência do escopo superior.

```js
function scopeOne() {
  var one = "I am in the scope created by `scopeOne()`";

  function scopeTwo() {
    one = "I am updating the reference in `scopeOne` inside `scopeTwo`";
  }
}
```

Um escopo inferior também pode criar uma referência de mesmo nome, sem modificá-lo.

```js
function scopeOne() {
  var one = "I am in the scope created by `scopeOne()`";

  function scopeTwo() {
    var one = "I am creating a new `one` but leaving reference in `scopeOne()` alone.";
  }
}
```

Ao escrever uma transformação, queremos ter cuidado com escopos. Precisamos ter certeza de que não estamos quebrando o código existente ao modificar diferentes partes dele.

Nós podemos adicionar novas referências e ter a certeza de que elas não colidem com as já existentes. Ou talvez nós podemos encontrar onde uma variável é referenciada. Queremos rastrear essas referências dentro de um determinado escopo.

Um escopo pode ser representado como:

```js
{
  path: path,
  block: path.node,
  parentBlock: path.parent,
  parent: parentScope,
  bindings: [...]
}
```

Ao criar um novo escopo, você também está criando um Path e um escopo pai para ele. Então, durante o processo de travessia da árvore, nós recolhemos todas as referências ("bindings") dentro desse escopo.

Depois disso, há vários tipos de métodos que você pode usar dentro desse escopo. Nós vamos chegar lá mais para frente.

#### <a id="toc-bindings"></a>Bindings

Todas as referências pertencem a um determinado escopo; Essa relação é conhecida como **binding**.

```js
function scopeOnce() {
  var ref = "This is a binding";

  ref; // This is a reference to a binding

  function scopeTwo() {
    ref; // This is a reference to a binding from a lower scope
  }
}
```

Um único binding, é parecido com:

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

Com essas informações, você pode encontrar todas as referências de um binding e ver que tipo de binding ele é (parâmetro, declaração, etc.), verificar qual escopo ele pertence ou obter uma cópia do seu Identifier. Você pode até dizer se ele é constante ou não, e verificar quais Paths estão causando o problema de não ser constante.

Ser capaz de dizer se um binding é constante é útil para muitas coisas, uma das mais importantes, é a minificação.

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

Babel é na verdade uma coleção de módulos. Nesta seção veremos os mais famosos deles, explicando o que eles fazem e como usá-los.

> Nota: Este não é um substituto para a documentação da API, que será mais detalhada, e que estarão disponível em outro lugar em breve.

## <a id="toc-babylon"></a>[`babylon`](https://github.com/babel/babylon)

Babylon é um analisador sintático para o Babel. Começou como um fork do Acorn, é rápido, simples de usar e tem uma arquitetura baseada em plugins para recursos que não são padrões (assim como propostas futuras).

Primeiro, vamos instalá-lo.

```sh
$ npm install --save babylon
```

Vamos começar por analisar uma simples seqüência de código:

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

Nós também podemos passar opções para o `parse()` da seguinte maneira:

```js
babylon.parse(code, {
  sourceType: "module", // default: "script"
  plugins: ["jsx"] // default: []
});
```

`sourceType` pode ser um `"module"` ou `"script"`, que é o modo que o Babylon deve analisar o código. `"module"` vai analisar no modo estrito e permitir as declarações de módulos, já o modo `"script"` não.

> **Nota:** `sourceType` tem como padrão o modo `"script"` e retorna um erro quando ele encontra declarações `import` ou `export`. Use `sourceType: "module"` para se livrar desses erros.

Desde que Babylon é construído com uma arquitetura baseada em plugins, há também uma opção de `plugins` que permitirá o uso dos plugins internos. Nota, Babylon ainda não abriu essa API para plugins externos, embora, no futuro, possa fazê-lo.

To see a full list of plugins, see the [Babylon README](https://github.com/babel/babylon/blob/master/README.md#plugins).

## <a id="toc-babel-traverse"></a>[`babel-traverse`](https://github.com/babel/babel/tree/master/packages/babel-traverse)

O módulo babel-traverse, mantém o estado geral da árvore, e é responsável pela substituição, remoção e adição de nós.

Instale executando:

```sh
$ npm install --save babel-traverse
```

Podemos usá-lo ao lado do Babylon para percorrer e atualizar os nós:

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

babel-types é uma biblioteca de utilitários, ao estilo Lodash, para nós de AST. Ele contém métodos para a construção, validação e conversão de nós de AST. Tendo foco em limpar a lógica em uma AST, utilizando-se de métodos bem definidos.

Você pode instalá-lo executando:

```sh
$ npm install --save babel-types
```

E então, comece a usar:

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

### <a id="toc-definitions"></a>Definições

babel-types tem definições para cada tipo único de nó, com informações como: aonde pertencem cada propriedades, quais valores são válidos, como foi construído aquele nó, como o nó deve ser percorrido e pseudônimos daquele nó.

Uma definição de tipo de nó, é parecido com este:

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

### <a id="toc-builders"></a>Construtores

Você vai notar que a definição acima para `BinaryExpression` tem um campo para um `builder`.

```js
builder: ["operator", "left", "right"]
```

Isso porque, cada tipo de nó tem um método construtor, que, quando usado, é parecido com este:

```js
t.binaryExpression("*", t.identifier("a"), t.identifier("b"));
```

Que cria um AST como este:

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

Que, quando impresso, é parecido com este:

```js
a * b
```

Construtores também irão validar os nós que eles estão criando e lançaram erros descritivos se usados incorretamente. O que leva para o próximo tipo de método.

### <a id="toc-validators"></a>Validadores

A definição para `BinaryExpression` também inclui informações sobre os `fields` de um nó e como validá-los.

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

Isso é usado para criar dois tipos de validação de métodos. A primeira das quais é `isX`.

```js
t.isBinaryExpression(maybeBinaryExpressionNode);
```

Esse teste serve para se certificar de que o nó é uma expressão binária, mas você também pode passar um segundo parâmetro para garantir que o nó contém certas propriedades e valores.

```js
t.isBinaryExpression(maybeBinaryExpressionNode, { operator: "*" });
```

Há também a versão assertiva desses métodos, o *ehem*, que irá gerar erros em vez de retornar `true` ou `false`.

```js
t.assertBinaryExpression(maybeBinaryExpressionNode);
t.assertBinaryExpression(maybeBinaryExpressionNode, { operator: "*" });
// Error: Expected type "BinaryExpression" with option { "operator": "*" }
```

### <a id="toc-converters"></a>Conversores

> [WIP]

## <a id="toc-babel-generator"></a>[`babel-generator`](https://github.com/babel/babel/tree/master/packages/babel-generator)

babel-generator é o gerador de código para o Babel. Leva uma AST e a transforma em código com sourcemaps.

Execute os seguintes passos para instalá-lo:

```sh
$ npm install --save babel-generator
```

Em seguida, para usá-lo:

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

Você também pode passar opções para a função `generate()`.

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

# <a id="toc-writing-your-first-babel-plugin"></a>Escrevendo seu primeiro Plugin do Babel

Agora que você está familiarizado com o básico do Babel, vamos usar tudo o que aprendemos até aqui para criar nosso primeiro plugin.

Vamos começar com uma `função` que recebe um objeto do tipo [`babel`](https://github.com/babel/babel/tree/master/packages/babel-core).

```js
export default function(babel) {
  // plugin contents
}
```

Como você irá usar isso muitas vezes, você provavelmente vai querer acessar apenas o `babel.types`, podemos fazê-lo da seguinte forma:

```js
export default function({ types: t }) {
  // plugin contents
}
```

Então, você pode retornar um objeto com uma propriedade `visitor`, que é o principal visitante para o plugin.

```js
export default function({ types: t }) {
  return {
    visitor: {
      // visitor contents
    }
  };
};
```

Vamos criar um plugin bem simples para ver como isso funciona, veja o seguinte código:

```js
foo === bar;
```

Ou na forma de uma AST:

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

Vamos começar adicionando um método de visitante ao `BinaryExpression`.

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

E então, vamos reduzi-lo à expressão `BinaryExpression`, que serão usadas com o operador de `=`.

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

Agora vamos substituir a propriedade `left` com um novo identificador:

```js
BinaryExpression(path) {
  if (path.node.operator !== "===") {
    return;
  }

  path.node.left = t.identifier("sebmck");
  // ...
}
```

Se utilizarmos o plugin agora, teríamos:

```js
sebmck === bar;
```

Agora vamos substituir apenas a propriedade da `direita`.

```js
BinaryExpression(path) {
  if (path.node.operator !== "===") {
    return;
  }

  path.node.left = t.identifier("sebmck");
  path.node.right = t.identifier("dork");
}
```

E agora, nosso resultado final:

```js
sebmck === dork;
```

Incrível! Criamos nosso primeiro plugin para o Babel.

* * *

# <a id="toc-transformation-operations"></a>Operações de transformação

## <a id="toc-visiting"></a>Visitando

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

## <a id="toc-manipulation"></a>Manipulação

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

> **Nota:** Quando você substituir uma expressão com vários nós, eles devem ser declarações. Isso ocorre porque o Babel usa a heurística das declarações para simplificar as transformações malucas que você venha há criar. De outro modo, elas seriam extremamente verbosas e complicadas.

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

> **Nota:** Não é recomendado usar esta API, a menos que você esteja lidando com seqüências de caracteres de forma dinâmica, caso contrário, é mais eficiente analisar o código fora o visitante.

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

> **Nota:** Isso deve sempre uma declaração ou uma matriz de declarações. Ele usa a mesma heurística mencionada na [substituição de um nó com vários nós](#replacing-a-node-with-multiple-nodes).

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

## <a id="toc-scope"></a>Escopo

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

# <a id="toc-plugin-options"></a>Opções do plugin

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

# <a id="toc-building-nodes"></a>Construindo nós

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

> Observe que, às vezes, há mais propriedades que você pode personalizar no nó, do que a matriz de opções do `builder` contém. Isso é para manter o builder simples, sem muitos argumentos. Nesse caso, você precisa definir as propriedades manualmente. Um exemplo disso é o [`ClassMethod`](https://github.com/babel/babel/blob/bbd14f88c4eea88fa584dd877759dd6b900bf35e/packages/babel-types/src/definitions/es2015.js#L238-L276).

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

# <a id="toc-best-practices"></a>Melhores práticas

> Eu vou estar trabalhando nesta seção nas próximas semanas.

## <a id="toc-avoid-traversing-the-ast-as-much-as-possible"></a>Evitar cruzar o máximo possível o AST

Traversing the AST is expensive, and it's easy to accidentally traverse the AST more than necessary. This could be thousands if not tens of thousands of extra operations.

Babel optimizes this as much as possible, merging visitors together if it can in order to do everything in a single traversal.

### <a id="toc-merge-visitors-whenever-possible"></a>Mesclar os visitantes sempre que possível

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

### <a id="toc-do-not-traverse-when-manual-lookup-will-do"></a>Não cruzar quando farão pesquisa manual

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

## <a id="toc-optimizing-nested-visitors"></a>Otimizando os visitantes aninhados

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

## <a id="toc-being-aware-of-nested-structures"></a>Estando ciente das estruturas aninhadas

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

> ***Para futuras atualizações, siga [@thejameskyle](https://twitter.com/thejameskyle) no Twitter.***