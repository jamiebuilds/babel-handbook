# Manual para Plugins Babel

Este documento abarca cómo crear [plugins](https://babeljs.io/docs/advanced/plugins/) para [Babel](https://babeljs.io).

[![cc-by-4.0](https://licensebuttons.net/l/by/4.0/80x15.png)](http://creativecommons.org/licenses/by/4.0/)

Este manual está disponible en otros idiomas, mira el archivo [README](/README.md) para ver la lista completa.

# Tabla de contenido

  * [Introducción](#toc-introduction)
  * [Conceptos básicos](#toc-basics) 
      * [Árboles de sintaxis abstracta (AST)](#toc-asts)
      * [Etapas de Babel](#toc-stages-of-babel)
      * [Análisis](#toc-parse) 
          * [Análisis léxico](#toc-lexical-analysis)
          * [Análisis sintáctico](#toc-syntactic-analysis)
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
      * [Definiciones](#toc-definitions)
      * [Builders](#toc-builders)
      * [Validators](#toc-validators)
      * [Converters](#toc-converters)
      * [babel-generator](#toc-babel-generator)
      * [babel-template](#toc-babel-template)
  * [Escribiendo tu primer plugin para Babel](#toc-writing-your-first-babel-plugin)
  * [Transformation Operations](#toc-transformation-operations) 
      * [Visiting](#toc-visiting)
      * [Get the Path of Sub-Node](#toc-get-the-path-of-a-sub-node)
      * [Check if a node is a certain type](#toc-check-if-a-node-is-a-certain-type)
      * [Check if a path is a certain type](#toc-check-if-a-path-is-a-certain-type)
      * [Check if an identifier is referenced](#toc-check-if-an-identifier-is-referenced)
      * [Find a specific parent path](#toc-find-a-specific-parent-path)
      * [Get Sibling Paths](#toc-get-sibling-paths)
      * [Stopping Traversal](#toc-stopping-traversal)
      * [Manipulation](#toc-manipulation)
      * [Replacing a node](#toc-replacing-a-node)
      * [Replacing a node with multiple nodes](#toc-replacing-a-node-with-multiple-nodes)
      * [Replacing a node with a source string](#toc-replacing-a-node-with-a-source-string)
      * [Inserting a sibling node](#toc-inserting-a-sibling-node)
      * [Inserting into a container](#toc-inserting-into-a-container)
      * [Removing a node](#toc-removing-a-node)
      * [Replacing a parent](#toc-replacing-a-parent)
      * [Removing a parent](#toc-removing-a-parent)
      * [Scope](#toc-scope)
      * [Checking if a local variable is bound](#toc-checking-if-a-local-variable-is-bound)
      * [Generating a UID](#toc-generating-a-uid)
      * [Pushing a variable declaration to a parent scope](#toc-pushing-a-variable-declaration-to-a-parent-scope)
      * [Rename a binding and its references](#toc-rename-a-binding-and-its-references)
  * [Plugin Options](#toc-plugin-options) 
      * [Pre and Post in Plugins](#toc-pre-and-post-in-plugins)
      * [Enabling Syntax in Plugins](#toc-enabling-syntax-in-plugins)
  * [Building Nodes](#toc-building-nodes)
  * [Best Practices](#toc-best-practices) 
      * [Avoid traversing the AST as much as possible](#toc-avoid-traversing-the-ast-as-much-as-possible)
      * [Merge visitors whenever possible](#toc-merge-visitors-whenever-possible)
      * [Do not traverse when manual lookup will do](#toc-do-not-traverse-when-manual-lookup-will-do)
      * [Optimizing nested visitors](#toc-optimizing-nested-visitors)
      * [Being aware of nested structures](#toc-being-aware-of-nested-structures)
      * [Unit Testing](#toc-unit-testing)

# <a id="toc-introduction"></a>Introducción

Babel es un compilador multipropósito para Javascript. Más que eso es una colección de módulos que pueden ser usados en diferentes formas de análisis estático.

> Análisis estático es el proceso de analizar código sin ejecutarlo. (Análisis de código durante la ejecución se conoce como análisis dinámico). El propósito del análisis estático varía enormemente. Puede ser utilizado para compilar, resaltar ó transformar código. También en procesos de linting, optimización ó minificación, entre muchos otros.

Babel puede ser usado para construir diferentes tipos de herramientas, las cuales nos pueden ayudar a ser más productivos y escribir mejores programas.

> ***Para futuras actualizaciones, sigue a [@thejameskyle](https://twitter.com/thejameskyle) en Twitter.***

* * *

# <a id="toc-basics"></a>Conceptos básicos

Babel es un compilador de JavaScript, específicamente un compilador de fuente a fuente, a menudo llamado "transpiler". Esto significa le entregas a Babel código en JavaScript, Babel lo modifica y devuelve el código nuevo creado en Javascript.

## <a id="toc-asts"></a>ASTs

Cada uno de estos pasos implican crear o trabajar con un [Árbol de Sintaxis Abstracta](https://en.wikipedia.org/wiki/Abstract_syntax_tree) ó AST por sus siglas en inglés.

> Babel utiliza un AST modificada de [ESTree](https://github.com/estree/estree), con la especificación base disponible [aquí](https://github.com/babel/babylon/blob/master/ast/spec.md).

```js
function square(n) {
  return n * n;
}
```

> Si deseas tener una mejor idea de los nodos AST, visita [AST Explorer](http://astexplorer.net/). [Aquí](http://astexplorer.net/#/Z1exs6BWMq) hay un enlace que contiene el código del ejemplo anterior.

Este mismo programa puede ser representado en un árbol como este:

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

O como un objeto de JavaScript:

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

Te darás cuenta de que cada nivel del AST tiene una estructura similar:

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

> Nota: Algunas propiedades se han eliminado por simplicidad.

Cada uno de estos se conocen como un **Nodo**. Un AST puede ser formado por un sólo nodo, ó cientos si no miles de nodos. Juntos tienen la capacidad de describir la sintaxis de un programa que puede utilizarse para análisis estático.

Cada nodo tiene esta interfaz:

```typescript
interface Node {
  type: string;
}
```

El campo `tipo` es una cadena que representa que tipo de nodo es el objeto. Por ejemplo: `"FunctionDeclaration"`, `"Identifier"`, or `"BinaryExpression"`). Cada tipo de nodo define un conjunto adicional de propiedades que describen ese tipo de nodo en particular.

Hay propiedades adicionales en cada nodo que Babel genera para describir la posición del nodo en el código fuente original.

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

Estas propiedades ` start `, `end`, `loc`, aparecen en cada uno de los nodos.

## <a id="toc-stages-of-babel"></a>Etapas de Babel

Las tres etapas principales de Babel son **analizar**, **transformar**, **generar**.

### <a id="toc-parse"></a>Analizar

La etapa de **análisis**, recibe código a la entrada y entrega un AST a la salida. Hay dos fases de análisis en Babel: [**Análisis léxico**](https://en.wikipedia.org/wiki/Lexical_analysis) y [**Análisis sintáctico**](https://en.wikipedia.org/wiki/Parsing).

#### <a id="toc-lexical-analysis"></a>Análisis léxico

El análisis léxico recibe una cadena de código y lo convierte en una secuencia de **tokens**.

Podemos pensar los tokens como una matriz plana, en la cual cada elemento representa una parte de sintaxis del lenguaje.

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

Aquí cada uno de los `tipo`s tienen un conjunto de propiedades que describen el token:

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

Así como los nodos AST, estos también tienen `start`, `end` y `loc`.

#### <a id="toc-syntactic-analysis"></a>Análisis sintáctico

El análisis sintáctico recibe una secuencia de tokens y lo convierten en una representación de AST. Usando la información de los tokens, esta fase les cambia el formato y los representa en un AST. El cual representa la estructura del código de una manera más sencilla para trabajar.

### <a id="toc-transform"></a>Transformar

La etapa de [transformación](https://en.wikipedia.org/wiki/Program_transformation) toma un AST y cruza a través de él, agregando, actualizando y quitando nodos a medida que va avanzando. Esta es, por lejos, la parte más compleja de Babel o cualquier otro compilador. Aquí es donde los plugins operan, así que este será el tema pricncipal de este manual. Por ahora no lo analizaremos en detalle.

### <a id="toc-generate"></a>Generar

La etapa de [generación de código](https://en.wikipedia.org/wiki/Code_generation_(compiler)) toma el AST y lo convierte de vuelta en una cadena de código, también creando el [source maps](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/).

Generar el código es bastante simple: se recorre a través del AST, empezando en lo más profundo, construyendo una cadena que representa el código transformado.

## <a id="toc-traversal"></a>Recorrido

Cuando se desea transformar un AST es necesario [recorrer el árbol](https://en.wikipedia.org/wiki/Tree_traversal) de manera recursiva.

Digamos que tenemos el tipo `FunctionDeclaration`. Este tiene unas propiedades: `id`, `params` y `body`. Cada propiedad tiene nodos anidados.

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

Así que empezamos en `FunctionDeclaration`. Sabemos sus propiedades internas, entonces visitamos ordenadamente cada una de ellas y sus respectivos hijos.

A continuación vamos a `id` que es un ` Identifier`. Los ` Identifier`s no tienen nodos hijos en sus propiedades por lo tanto continuamos el recorrido.

Después encontramos ` params ` que es una arreglo de nodos así que visitamos cada uno de ellos. En este caso es sólo un nodo que es también un `Identifier`, entonces seguimos.

Entonces encontramos `body` que es un `BlockStatement` con una propiedad `body` que es un arreglo, por lo tanto vamos a cada uno de ellos.

Aquí el único elemento es el nodo `ReturnStatement` que tiene un `argument`. Vamos a `argument` y encontramos una `BinaryExpression`.

La `BinaryExpression` tiene tres propiedades ` operator`, `left` y `right`. El operador no es un nodo, es sólo un valor, entonces no lo visitamos. En cambio, vistamos `left` y `right`.

Este proceso de recorrido, en Babel, pasa a lo largo de la etapa de transformación.

### <a id="toc-visitors"></a>Visitantes

Cuando decimos que "vamos" a un nodo, lo que realmente queremos decir es que los estamos **visitando**. Se utiliza éste término porque existe el concepto de [**visitante**](https://en.wikipedia.org/wiki/Visitor_pattern) (visitor).

Los visitantes (visitors) son patrones usados en AST transversal en distintos idiomas. Básicamente son objetos, con métodos definidos para aceptar ciertos tipos de nodos en un árbol. Esto es un poco abstracto, veamos un ejemplo.

```js
const MyVisitor = {
  Identifier() {
    console.log("Called!");
  }
};

// También puedes crear un visitador y el método agregar después
let visitor = {};
visitor.MemberExpression = function() {};
visitor.FunctionDeclaration = function() {}
```

> **Nota:**`Identifier() { ... }` es la abreviatura de `Identifier: { enter() { ... } }`.

Esto es un visitador básico que cuando se usa durante un recorrido llamara el método `Identifier()` por cada `Identifier` en el árbol.

Así que, el código del método `Identifier()` será llamado cuatro veces por cada `Identifier` (incluyendo `square`).

```js
function square(n) {
  return n * n;
}
```

```js
path.traverse(MyVisitor);
Called!
Called!
Called!
Called!
```

Estas llamadas son por cada nodo cuando **entrar** al nodo. Sin embargo existe la posibilidad de llamar al método del visitador cuando **sale**.

Imagina que nosotros tememos una estructura así:

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

Según atravesamos hacia abajo cada rama del árbol eventualmente llega a un punto final donde nosotros atravesamos de retroceso el árbol para llegar al siguiente nodo. Yendo hacia abajo del árbol nosotros **entramos ** en cada nodo, entonces yendo de retroceso nosotros **salimos** de cada nodo.

Vamos a *caminar* a traves el proceso de lo que parece el árbol de arriba.

  * Entra `FunctionDeclaration` 
      * Entra `Identifier (id)`
      * Punto final
      * Sale ` Identifier (id)`
      * Entra ` Identifier (params[0])`
      * Punto final
      * Sale ` Identifier (params[0])`
      * Entra `BlockStatement (body)`
      * Entra `ReturnStatement (body)` 
          * Entra `BinaryExpression (argument)`
          * Entra `Identifier (left)` 
              * Punto final
          * Sale `Identifier (left)`
          * Entra `Identifier (right)` 
              * Punto final
          * Sale `Identifier (right)`
          * Sale `BinaryExpression (argument)`
      * Sale `ReturnStatement (body)`
      * Sale `BlockStatement (body)`
  * Sale `FunctionDeclaration`

Así que cuando se crea un visitador tu tienes dos oportunidades de visitar un nodo.

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

Si es necesario, tu puedes también aplicar la misma función por múltiples nodos de visitante separándolos con un `|` en el método como cadena de la siguiente manera `Identifier|MemberExpression`.

Ejemplo en el uso del plugin [flow-comments](https://github.com/babel/babel/blob/2b6ff53459d97218b0cf16f8a51c14a165db1fd2/packages/babel-plugin-transform-flow-comments/src/index.js#L47)

```js
const MyVisitor = {
  "ExportNamedDeclaration|Flow"(path) {}
};
```

También puedes usar alias como nodos visitadores (como se define en [babel-types](https://github.com/babel/babel/tree/master/packages/babel-types/src/definitions)).

Por ejemplo,

`Function` es un álias para `FunctionDeclaration`, `FunctionExpression`, `ArrowFunctionExpression`, `ObjectMethod` and `ClassMethod`.

```js
const MyVisitor = {
  Function(path) {}
};
```

### <a id="toc-paths"></a>Paths

En AST generalmente tiene muchos Nodos, pero, Cómo los nodos se relacionan unos con otros? Podríamos tener un enorme objeto mutable que puedas manipular y al que tener acceso total, o simplemente esto con **Paths**.

Un **Path** es una representación de un objeto entre el enlace de dos nodos.

Por ejemplo, si tomamos el siguiente nodo y su hijo:

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

Y representamos el hijo `Identifier` como un path, se mira como algo asi:

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

También tiene metadatos adicionales sobre el path:

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

También toneladas y toneladas de métodos relacionados con agregación, actualización, movimiento y eliminación de nodos, pero, entraremos en esos mas adelante.

En un sentido, paths son una representación **reactiva** de la posición de un nodo en el árbol y toda clase de información sobre el nodo. Siempre que tu llames un método que modifica el árbol, esta información es actualizada. Babel maneja todo esto por ti para poder trabajar con los nodos lo mas descentralizado posible.

#### <a id="toc-paths-in-visitors"></a>Paths en Visitadores

Cuando tu tienes un visitador que contiene el `Identifier()`, estas actualmente visitando el camino en vez del nodo. De esta manera tu estas mayormente trabajando con la representación reactiva del nodo en vez del nodo en si mismo.

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
path.traverse(MyVisitor);
Visiting: a
Visiting: b
Visiting: c
```

### <a id="toc-state"></a>Estado

Estado es el enemigo de la transformación AST. El estado te morderá una y otra vez y tus suposiciones sobre el estado casi siempre serán probadas incorrectas por alguna sintaxis que no consideraste.

Toma el siguiente código:

```js
function square(n) {
  return n * n;
}
```

Vamos a escribir rapidamente un visitador que renombre `n` a `x`.

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

Esto podría funcionar con el código de arriba, pero nosotros podemos fácilmente romperlo haciendo esto:

```js
function square(n) {
  return n * n;
}
n;
```

La mejor manera de lidiar con esto es la recursion. Así que vamos a hacer una película de Christopher Nolan y pongamos un visitador dentro de un visitador.

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

path.traverse(MyVisitor);
```

Por su puesto, este es un ejemplo inventado, pero que demuestra como eliminar el estado global desde uno de tus visitadores.

### <a id="toc-scopes"></a>Scope

Ahora vamos a presentar el concepto de [**scope**](https://en.wikipedia.org/wiki/Scope_(computer_science)). Javascript tiene un [lexical scope](https://en.wikipedia.org/wiki/Scope_(computer_science)#Lexical_scoping_vs._dynamic_scoping), cual es una estructura de árbol de bloques donde se crean nuevos scopes.

```js
// global scope

function scopeOne() {
  // scope 1

  function scopeTwo() {
    // scope 2
  }
}
```

En Javascript, cada referencia creada, ya sea a una variable, función, clase, parámetro, import, etiqueta, etc, pertenece al ámbito actual.

```js
var global = "I am in the global scope";

function scopeOne() {
  var one = "I am in the scope created by `scopeOne()`";

  function scopeTwo() {
    var two = "I am in the scope created by `scopeTwo()`";
  }
}
```

Código dentro de un ámbito más profundo puede llegar a usar una referencia de un ámbito anterior.

```js
function scopeOne() {
  var one = "I am in the scope created by `scopeOne()`";

  function scopeTwo() {
    one = "I am updating the reference in `scopeOne` inside `scopeTwo`";
  }
}
```

Un ámbito menor puede incluso crear una referencia de el mismo nombre sin modificarla.

```js
function scopeOne() {
  var one = "I am in the scope created by `scopeOne()`";

  function scopeTwo() {
    var one = "I am creating a new `one` but leaving reference in `scopeOne()` alone.";
  }
}
```

Cuando escribimos una transformación queremos estar alerta con el ámbito. Necesitamos estar seguros de no romper código existente mientras modificamos las diferentes partes de este.

Podríamos querer incluir nuevas referencias y estar seguros de que no choquen con las existentes. O tal vez solo queramos encontrar donde una variable está siendo referenciada. Queremos tener la capacidad de rastrear estas referencias dentro de un ámbito determinado.

Un ámbito puede ser representado como:

```js
{
  path: path,
  block: path.node,
  parentBlock: path.parent,
  parent: parentScope,
  bindings: [...]
}
```

Cuando crea un nuevo ámbito, lo hace asignándole una ruta y un ámbito padre. Entonces durante el proceso de recorrido recopila todas las referencias ("enlaces") dentro de ese ámbito.

Una vez haya terminado, hay todo tipo de métodos que puede usar en ese ámbito. Hablaremos de estos más adelante.

#### <a id="toc-bindings"></a>Bindings

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

> Note: This is not a replacement for detailed API documentation which will be available elsewhere shortly.

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

> **Note:** `sourceType` defaults to `"script"` and will error when it finds `import` or `export`. Pass `sourceType: "module"` to get rid of these errors.

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

### <a id="toc-definitions"></a>Definiciones

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

### <a id="toc-builders"></a>Builders

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

### <a id="toc-validators"></a>Validadores

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

### <a id="toc-converters"></a>Convertidores

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

generate(ast, {}, code);
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

# <a id="toc-writing-your-first-babel-plugin"></a>Escribiendo tu primer plugin para Babel

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

# <a id="toc-transformation-operations"></a>Transformation Operations

## <a id="toc-visiting"></a>Visiting

### <a id="toc-get-the-path-of-a-sub-node"></a>Get the Path of Sub-Node

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

If a path is in a list like in the body of a `Function`/`Program`, it will have "siblings".

  * Check if a path is part of a list with `path.inList`
  * You can get the surrounding siblings with `path.getSibling(index)`,
  * The current path's index in the container with `path.key`,
  * The path's container (an array of all sibling nodes) with `path.container`
  * Get the name of the key of the list container with `path.listKey`

> These APIs are used in the [transform-merge-sibling-variables](https://github.com/babel/babili/blob/master/packages/babel-plugin-transform-merge-sibling-variables/src/index.js) plugin used in [babel-minify](https://github.com/babel/babili).

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
outerPath.traverse({
  Function(innerPath) {
    innerPath.skip(); // if checking the children is irrelevant
  },
  ReferencedIdentifier(innerPath, state) {
    state.iife = true;
    innerPath.stop(); // if you want to save some state and then stop traversal, or deopt
  }
});
```

## <a id="toc-manipulation"></a>Manipulation

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

If you want to insert into a AST node property like that is an array like `body`. It is similar to `insertBefore`/`insertAfter` other than you having to specify the `listKey` which is usually `body`.

```js
ClassMethod(path) {
  path.get('body').unshiftContainer('body', t.expressionStatement(t.stringLiteral('before')));
  path.get('body').pushContainer('body', t.expressionStatement(t.stringLiteral('after')));
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

## <a id="toc-scope"></a>Scope

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

# <a id="toc-plugin-options"></a>Plugin Options

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

# <a id="toc-building-nodes"></a>Building Nodes

When writing transformations you'll often want to build up some nodes to insert into the AST. As mentioned previously, you can do this using the [builder](#builders) methods in the [`babel-types`](#babel-types) package.

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

# <a id="toc-best-practices"></a>Best Practices

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

## <a id="toc-avoid-traversing-the-ast-as-much-as-possible"></a>Avoid traversing the AST as much as possible

Traversing the AST is expensive, and it's easy to accidentally traverse the AST more than necessary. This could be thousands if not tens of thousands of extra operations.

Babel optimizes this as much as possible, merging visitors together if it can in order to do everything in a single traversal.

### <a id="toc-merge-visitors-whenever-possible"></a>Merge visitors whenever possible

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
const nestedVisitor = {
  Identifier(path) {
    // ...
  }
};

const MyVisitor = {
  FunctionDeclaration(path) {
    path.get('params').traverse(nestedVisitor);
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

## <a id="toc-optimizing-nested-visitors"></a>Optimizing nested visitors

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

However, this creates a new visitor object every time `FunctionDeclaration()` is called. That can be costly, because Babel does some processing each time a new visitor object is passed in (such as exploding keys containing multiple types, performing validation, and adjusting the object structure). Because Babel stores flags on visitor objects indicating that it's already performed that processing, it's better to store the visitor in a variable and pass the same object each time.

```js
const nestedVisitor = {
  Identifier(path) {
    // ...
  }
};

const MyVisitor = {
  FunctionDeclaration(path) {
    path.traverse(nestedVisitor);
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
const nestedVisitor = {
  Identifier(path) {
    if (path.node.name === this.exampleState) {
      // ...
    }
  }
};

const MyVisitor = {
  FunctionDeclaration(path) {
    var exampleState = path.node.params[0].name;
    path.traverse(nestedVisitor, { exampleState });
  }
};
```

## <a id="toc-being-aware-of-nested-structures"></a>Being aware of nested structures

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

## <a id="toc-unit-testing"></a>Unit Testing

There are a few primary ways to test babel plugins: snapshot tests, AST tests, and exec tests. We'll use [jest](http://facebook.github.io/jest/) for this example because it supports snapshot testing out of the box. The example we're creating here is hosted in [this repo](https://github.com/brigand/babel-plugin-testing-example).

First we need a babel plugin, we'll put this in src/index.js.

```js
<br />module.exports = function testPlugin(babel) {
  return {
    visitor: {
      Identifier(path) {
        if (path.node.name === 'foo') {
          path.node.name = 'bar';
        }
      }
    }
  };
};
```

### Snapshot Tests

Next, install our dependencies with `npm install --save-dev babel-core jest`, and then we can begin writing our first test: the snapshot. Snapshot tests allow us to visually inspect the output of our babel plugin. We give it an input, tell it to make a snapshot, and it saves it to a file. We check in the snapshots into git. This allows us to see when we've affected the output of any of our test cases. It also gives use a diff in pull requests. Of course you could do this with any test framework, but with jest updating the snapshots is as easy as `jest -u`.

```js
// src/__tests__/index-test.js
const babel = require('babel-core');
const plugin = require('../');

var example = `
var foo = 1;
if (foo) console.log(foo);
`;

it('works', () => {
  const {code} = babel.transform(example, {plugins: [plugin]});
  expect(code).toMatchSnapshot();
});
```

This gives us a snapshot file in `src/__tests__/__snapshots__/index-test.js.snap`.

```js
exports[`test works 1`] = `
"
var bar = 1;
if (bar) console.log(bar);"
`;
```

If we change 'bar' to 'baz' in our plugin and run jest again, we get this:

```diff
Received value does not match stored snapshot 1.

    - Snapshot
    + Received

    @@ -1,3 +1,3 @@
     "
    -var bar = 1;
    -if (bar) console.log(bar);"
    +var baz = 1;
    +if (baz) console.log(baz);"
```

We see how our change to the plugin code affected the output of our plugin, and if the output looks good to us, we can run `jest -u` to update the snapshot.

### AST Tests

In addition to snapshot testing, we can manually inspect the AST. This is a simple but brittle example. For more involved situations you may wish to leverage babel-traverse. It allows you to specify an object with a `visitor` key, exactly like you use for the plugin itself.

```js
it('contains baz', () => {
  const {ast} = babel.transform(example, {plugins: [plugin]});
  const program = ast.program;
  const declaration = program.body[0].declarations[0];
  assert.equal(declaration.id.name, 'baz');
  // or babelTraverse(program, {visitor: ...})
});
```

### Exec Tests

Here we'll be transforming the code, and then evaluating that it behaves correctly. Note that we're not using `assert` in the test. This ensures that if our plugin does weird stuff like removing the assert line by accident, the test will still fail.

```js
it('foo is an alias to baz', () => {
  var input = `
    var foo = 1;
    // test that foo was renamed to baz
    var res = baz;
  `;
  var {code} = babel.transform(input, {plugins: [plugin]});
  var f = new Function(`
    ${code};
    return res;
  `);
  var res = f();
  assert(res === 1, 'res is 1');
});
```

Babel core uses a [similar approach](https://github.com/babel/babel/blob/7.0/CONTRIBUTING.md#writing-tests) to snapshot and exec tests.

### [`babel-plugin-tester`](https://github.com/kentcdodds/babel-plugin-tester)

This package makes testing plugins easier. If you're familiar with ESLint's [RuleTester](http://eslint.org/docs/developer-guide/working-with-rules#rule-unit-tests) this should be familiar. You can look at [the docs](https://github.com/kentcdodds/babel-plugin-tester/blob/master/README.md) to get a full sense of what's possible, but here's a simple example:

```js
import pluginTester from 'babel-plugin-tester';
import identifierReversePlugin from '../identifier-reverse-plugin';

pluginTester({
  plugin: identifierReversePlugin,
  fixtures: path.join(__dirname, '__fixtures__'),
  tests: {
    'does not change code with no identifiers': '"hello";',
    'changes this code': {
      code: 'var hello = "hi";',
      output: 'var olleh = "hi";',
    },
    'using fixtures files': {
      fixture: 'changed.js',
      outputFixture: 'changed-output.js',
    },
    'using jest snapshots': {
      code: `
        function sayHi(person) {
          return 'Hello ' + person + '!'
        }
      `,
      snapshot: true,
    },
  },
});
```

* * *

> ***For future updates, follow [@thejameskyle](https://twitter.com/thejameskyle) and [@babeljs](https://twitter.com/babeljs) on Twitter.***