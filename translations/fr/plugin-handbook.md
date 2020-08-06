# Manuel du plugin de Babel

Ce présent document décrit les méthodes de création des [plugins](https://babeljs.io/docs/advanced/plugins/) pour [Babel](https://babeljs.io).

[![cc-by-4.0](https://licensebuttons.net/l/by/4.0/80x15.png)](http://creativecommons.org/licenses/by/4.0/)

Ce manuel est disponible dans d'autres langues, consulter le [README](/README.md) pour obtenir la liste complète.

# Sommaire

  * [Introduction](#toc-introduction)
  * [Notions de base](#toc-basics) 
      * [AST](#toc-asts)
      * [Les étapes de Babel](#toc-stages-of-babel)
      * [Analyse](#toc-parse) 
          * [Analyse lexicale](#toc-lexical-analysis)
          * [Analyse syntaxique](#toc-syntactic-analysis)
      * [Transformation](#toc-transform)
      * [Génération](#toc-generate)
      * [Parcours](#toc-traversal)
      * [Visiteurs](#toc-visitors)
      * [Chemins](#toc-paths) 
          * [Chemins dans les visiteurs](#toc-paths-in-visitors)
      * [État](#toc-state)
      * [Portées](#toc-scopes) 
          * [Liaisons](#toc-bindings)
  * [API](#toc-api) 
      * [babylon](#toc-babylon)
      * [babel-traverse](#toc-babel-traverse)
      * [babel-types](#toc-babel-types)
      * [Définitions](#toc-definitions)
      * [Constructeurs](#toc-builders)
      * [Validateurs](#toc-validators)
      * [Convertisseurs](#toc-converters)
      * [babel-generator](#toc-babel-generator)
      * [babel-template](#toc-babel-template)
  * [Écriture de votre premier plugin de Babel](#toc-writing-your-first-babel-plugin)
  * [Opérations de transformations](#toc-transformation-operations) 
      * [Visite](#toc-visiting)
      * [Récupération du chemin du sous-nœud](#toc-get-the-path-of-a-sub-node)
      * [Vérification si un nœud est un certain type](#toc-check-if-a-node-is-a-certain-type)
      * [Vérification si un chemin est un certain type](#toc-check-if-a-path-is-a-certain-type)
      * [Vérification si un identificateur est référencé](#toc-check-if-an-identifier-is-referenced)
      * [Trouver un chemin d'un parent spécifique](#toc-find-a-specific-parent-path)
      * [Récupérer les chemins des frères](#toc-get-sibling-paths)
      * [Arrêt du parcours](#toc-stopping-traversal)
      * [Manipulation](#toc-manipulation)
      * [Remplacement d’un nœud](#toc-replacing-a-node)
      * [Remplacement d’un nœud par plusieurs nœuds](#toc-replacing-a-node-with-multiple-nodes)
      * [Remplacement d’un nœud avec une chaîne source](#toc-replacing-a-node-with-a-source-string)
      * [Insertion d'un nœud enfant](#toc-inserting-a-sibling-node)
      * [Insertion dans un conteneur](#toc-inserting-into-a-container)
      * [Suppression d'un nœud](#toc-removing-a-node)
      * [Remplacement d'un parent](#toc-replacing-a-parent)
      * [Suppression d'un parent](#toc-removing-a-parent)
      * [Portée](#toc-scope)
      * [Vérification si une variable locale est liée](#toc-checking-if-a-local-variable-is-bound)
      * [Génération d'un UID](#toc-generating-a-uid)
      * [Poussée d'une déclaration de variable vers un scope parent](#toc-pushing-a-variable-declaration-to-a-parent-scope)
      * [Renommage d'une liaison et de ses références](#toc-rename-a-binding-and-its-references)
  * [Options du plugin](#toc-plugin-options) 
      * [Pré et Post dans les plugins](#toc-pre-and-post-in-plugins)
      * [Activation de la syntaxe dans les plugins](#toc-enabling-syntax-in-plugins)
  * [Nœuds de création](#toc-building-nodes)
  * [Meilleures pratiques](#toc-best-practices) 
      * [Éviter de traverser l'AST autant que possible](#toc-avoid-traversing-the-ast-as-much-as-possible)
      * [Fusionner les visiteurs quand c'est possible](#toc-merge-visitors-whenever-possible)
      * [N'utilisez pas "traverse" lorsqu'une lecture manuelle est possible](#toc-do-not-traverse-when-manual-lookup-will-do)
      * [Optimisation des visiteurs imbriqués](#toc-optimizing-nested-visitors)
      * [Etre conscient des structures imbriqués](#toc-being-aware-of-nested-structures)
      * [Tests unitaires](#toc-unit-testing)

# <a id="toc-introduction"></a>Introduction

Babel est un compilateur multifonction générique pour JavaScript. Plus que cela, c'est une collection de modules qui peut être utilisée pour plusieurs formes différentes d'analyse statique.

> L'analyse statique est le processus d'analyse du code sans l'exécuter. (L'analyse du code lors de l'exécution est appelée analyse dynamique). Le but de l'analyse statique varie grandement. Il peut être utilisé pour le "linting", la compilation, le "highlighting", la transformation du code, l'optimisation, la minification et bien plus.

Vous pouvez utiliser Babel pour construire différents types d'outils qui peuvent vous aider à être plus productifs et écrire de meilleurs logiciels.

> ***Pour les prochaines mises à jour, suivez [@thejameskyle](https://twitter.com/thejameskyle) sur Twitter.***

* * *

# <a id="toc-basics"></a>Notions de base

Babel est un compilateur JavaScript, plus précisément un compilateur de code source en un autre code source, souvent appelé un « transpiler ». Cela signifie que vous donnez à Babel du code JavaScript, Babel modifie le code et génère un nouveau code en sortie.

## <a id="toc-asts"></a>AST

Chacune de ces étapes implique la création ou le travail avec une [Arbre de syntaxe abstraite](https://en.wikipedia.org/wiki/Abstract_syntax_tree) ou AST.

> Babel utilise un AST modifié de [ESTree](https://github.com/estree/estree), avec la spécification principale située [ici](https://github.com/babel/babylon/blob/master/ast/spec.md).

```js
function square(n) {
  return n * n;
}
```

> Découvrez [AST Explorer](http://astexplorer.net/) pour avoir une meilleure idée des nœuds AST. Voici [un lien](http://astexplorer.net/#/Z1exs6BWMq) avec l'exemple de code ci-dessus.

Ce même programme peut être représenté sous forme d'une arborescence comme celle-ci :

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

Ou comme un objet JavaScript comme suit :

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

Vous remarquerez que chaque niveau de l'AST a une structure similaire :

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

> Remarque : Certaines propriétés ont été supprimées par souci de simplicité.

Chacun de ces niveaux est connu sous le terme **Nœud**. L'AST peut être composé d'un seul nœud, de centaines ou même de milliers de nœuds. Ensemble, ils sont capables de décrire la syntaxe d'un programme qui peut être utilisée pour l'analyse statique.

Chaque Nœud a cette interface :

```typescript
interface Node {
  type: string;
}
```

Le champ `type` est une chaîne qui représente le type de l'objet nœud (c'est à dire. `"FunctionDeclaration"`, `"Identifier"` ou `"BinaryExpression"`). Chaque type de nœud définit un ensemble de propriétés supplémentaires qui décrivent ce type de nœud particulier .

Des propriétés supplémentaires sont présentes sur chaque nœud que Babel génère qui décrivent la position du nœud dans le code source original.

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

Ces propriétés `start`, `end`, `loc`, apparaissent sur chacun des nœuds.

## <a id="toc-stages-of-babel"></a>Les étapes de Babel

Les trois étapes principales de Babel sont **analyse**, **transformation**, **génération**.

### <a id="toc-parse"></a>Analyse

L'étape **d'analyse** prend le code et génère un AST. Il y a deux phases d'analyse dans Babel : [**Analyse lexicale**](https://en.wikipedia.org/wiki/Lexical_analysis) et [**Analyse Syntaxique**](https://en.wikipedia.org/wiki/Parsing).

#### <a id="toc-lexical-analysis"></a>Analyse lexicale

L'analyse lexicale prendra une chaîne de code et la transformera en un flux de **jetons** (tokens).

Vous pouvez considérer les jetons comme un tableau plat composé de morceaux de syntaxe de langage.

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

Ici, chacun des `type`s a un ensemble de propriétés décrivant le jeton :

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

Comme les nœuds AST, ils ont aussi un `start`, `end` et `loc`.

#### <a id="toc-syntactic-analysis"></a>Analyse syntaxique

L'analyse syntaxique prendra un flux de jetons et le transformera en une représentation AST. En utilisant les informations dans les jetons, cette phase les reformatera en un AST qui représente la structure du code, cela permettra de les manipuler plus facilement.

### <a id="toc-transform"></a>Transformation

L’étape de [transformation](https://en.wikipedia.org/wiki/Program_transformation) prend un AST, le parcourt, en ajoutant, mettant à jour et supprimant des nœuds au fur et à mesure. C’est de loin la partie la plus complexe de Babel ou de n’importe quel compilateur. Il s’agit du fonctionnement des plugins et donc cela sera l’objet de la majeure partie de ce manuel. Donc, pour l'instant, nous ne l'étudierons pas trop profondément.

### <a id="toc-generate"></a>Génération

L’étape de [génération de code](https://en.wikipedia.org/wiki/Code_generation_(compiler)) prend l’AST final et il le retourne en une chaîne de code, en créant les [source maps](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/).

La génération du code est assez simple : on traverse l’AST en profondeur, en créant une chaîne qui représente le code transformé.

## <a id="toc-traversal"></a>Parcours

Lorsque vous souhaitez transformer un AST, vous devez [parcourir l’arborescence](https://en.wikipedia.org/wiki/Tree_traversal) de manière récursive.

Supposons que nous avons le type `FunctionDeclaration`. Il possède quelques propriétés : `id`, `params` et `body`. Elles ont chacune des nœuds imbriqués.

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

Nous partons donc de `FunctionDeclaration` et dans le but de connaitre ses propriétés internes nous visitons les nœuds ainsi que leurs enfants.

Ensuite, nous allons sur `id` qui est un `Identifier`. Les `Identifier`s n'ont pas de propriétés de noeud d'enfant donc nous repartons.

Après, il y a `params`, qui est un tableau de nœuds que nous visitons les uns après les autres. Dans ce cas, c’est un seul nœud, qui est également un `Identifier` donc nous repartons.

Puis nous arrivons sur `corps` qui est un `BlockStatement` avec une propriété `body` qui est un tableau de nœuds que nous visitons les uns après les autres.

Le seul élément ici est un nœud de `ReturnStatement` qui possède un `argument`, nous allons dans `argument` et nous trouvons un `BinaryExpression`.

Le `BinaryExpression` a un `operator`, un `left` et un `right`. L’operator n’est pas un nœud, juste une valeur, alors nous n’y allons pas, et au lieu de cela, nous visitons juste `left` et `right`.

Ce parcours s’effectue tout au long de l’étape de transformation de Babel.

### <a id="toc-visitors"></a>Visiteurs

Lorsque nous parlons "d'aller" vers un nœud, nous voulons dire que nous sommes en train de le **visiter**. Nous utilisons ce terme car il y a cette notion de [**visiteur**](https://en.wikipedia.org/wiki/Visitor_pattern).

Les visiteurs sont un modèle utilisé dans le parcours de l’AST des langages. Plus simplement, c'est un objet avec des méthodes définies pour accepter les types de nœud particulier dans une arborescence. C’est un peu abstrait, alors prenons un exemple.

```js
const MyVisitor = {
  Identifier() {
    console.log("Appelé !");
  }
};

// Vous pouvez aussi créer un visiteur et lui ajouter des méthodes plus tard
let visitor = {};
visitor.MemberExpression = function() {};
visitor.FunctionDeclaration = function() {}
```

> **Remarque :** `Identifier() { ... }` est le raccourci de `identificateur: {enter() { ... }}`.

Il s’agit d’un visiteur basique qui est utilisé lors d'un parcours, il appellera la méthode `Identifier()` à chaque `Identifier` dans l’arborescence.

Donc avec ce code, la méthode `Identifier()` sera appelée quatre fois pour chaque `Identifier` (y compris `square`).

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

Ces appels sont tous faits lorsqu'on **entre** dans le nœud. Cependant, il est possible d’appeler une méthode de visiteur lorsqu'on **sort**.

Imaginons que nous avons cette arborescence :

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

Comme nous parcourons chaque branche de l’arborescence vers le bas, nous tombons finalement sur des impasses que nous devons remonter pour obtenir le nœud suivant. En descendant l’arborescence, nous **entrons** dans chaque nœud, puis en remontant nous **sortons** de chaque nœud.

*Suivons* le processus de l’arborescence ci-dessus.

  * Entre dans `FunctionDeclaration` 
      * Entre dans `Identifier (id)`
      * Arrive à une impasse
      * Sort de `Identifier (id)`
      * Entre dans `Identifier (params[0])`
      * Arrive à une impasse
      * Sort de `Identifier (params[0])`
      * Entre dans `BlockStatement (body)`
      * Entre dans `ReturnStatement (body)` 
          * Entre dans `BinaryExpression (argument)`
          * Entre dans `Identifier (left)` 
              * Arrive à une impasse
          * Sort de `Identifier (left)`
          * Entre dans `Identifier (right)` 
              * Arrive à une impasse
          * Sort de `Identifier (right)`
          * Sort de `BinaryExpression (argument)`
      * Sort de `ReturnStatement (body)`
      * Sort de `BlockStatement (body)`
  * Sort de `FunctionDeclaration`

Lorsque vous créez un visiteur, vous avez deux possibilités pour visiter un nœud.

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

Si nécessaire, vous pouvez également appliquer la même fonction pour plusieurs nœuds visiteur en les séparant avec un `|` dans le nom de la méthode sous forme de chaîne comme `Identifier|MemberExpression`.

Exemple d’utilisation dans le plugin de [flow-comments](https://github.com/babel/babel/blob/2b6ff53459d97218b0cf16f8a51c14a165db1fd2/packages/babel-plugin-transform-flow-comments/src/index.js#L47)

```js
const MyVisitor = {
  "ExportNamedDeclaration|Flow"(path) {}
};
```

Vous pouvez également utiliser des alias comme nœuds visiteur (tel que défini dans [babel-types](https://github.com/babel/babel/tree/master/packages/babel-types/src/definitions)).

Par exemple,

`Function` est un alias pour `FunctionDeclaration`, `FunctionExpression`, `ArrowFunctionExpression`, `ObjectMethod` et `ClassMethod`.

```js
const MyVisitor = {
  Function(path) {}
};
```

### <a id="toc-paths"></a>Chemins

Un AST a généralement beaucoup de nœuds, mais comment les nœuds sont liés les uns aux autres ? Nous pourrions avoir un objet mutable géant qui les manipule et a un accès totale, ou nous pouvons simplifier ceci avec les **chemins**.

Un **chemin** est un objet qui représente le lien entre deux nœuds.

Par exemple, si nous prenons le nœud suivant et son enfant :

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

Et qu'on représente l’enfant `Identifier` comme un chemin, il ressemble donc à ceci :

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

Il a également des métadonnées supplémentaires à propos du chemin :

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

Ainsi que des tonnes et des tonnes de méthodes liées à l’ajout, la mise à jour, le déplacement et la suppression de nœuds, mais nous en parlerons plus tard.

D'une certaine manière, les chemins sont une représentation **réactive** de la position d'un nœud dans l'arborescence et ont toutes sortes d'informations sur le nœud. Chaque fois que vous appelez une méthode qui modifie l’arborescence, cette information est mise à jour. Babel gère tout cela pour vous permettre de travailler avec les nœuds de manière simple et sans toucher le plus possible aux états dans lequel ils sont.

#### <a id="toc-paths-in-visitors"></a>Chemins dans les visiteurs

Lorsque vous avez un visiteur qui a une méthode `Identifier()`, vous visitez en fait le chemin à la place du nœud. De cette façon vous travaillez principalement avec la représentation réactive d’un nœud au lieu du nœud lui-même.

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

### <a id="toc-state"></a>État

L'état est l'ennemi de la transformation de l'AST. L'état vous jouera des tours à maintes reprises et vos hypothèses à propos de l'état seront presque toujours démenties par une syntaxe que vous n'avez pas envisagé.

Prenons le code suivant :

```js
function square(n) {
  return n * n;
}
```

Nous allons écrire un rapide visiteur pas très originale qui renommera `n` en `x`.

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

Cela pourrait fonctionner pour le code ci-dessus, mais nous pouvons facilement le casser en procédant ainsi :

```js
function square(n) {
  return n * n;
}
n;
```

La meilleure façon de le traiter, c'est la récursivité. Nous allons donc faire comme dans un film de Christopher Nolan et mettre un visiteur à l’intérieur d’un visiteur.

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

Bien sûr, il s’agit d’un exemple artificiel mais il montre comment éliminer l’état global de vos visiteurs.

### <a id="toc-scopes"></a>Portées

Ensuite, nous allons introduire le concept d’une [**portée**](https://en.wikipedia.org/wiki/Scope_(computer_science)). JavaScript a une [portée lexicale](https://en.wikipedia.org/wiki/Scope_(computer_science)#Lexical_scoping_vs._dynamic_scoping), qui est une structure arborescente où les blocs créent une nouvelle portée.

```js
// global scope

function scopeOne() {
  // scope 1

  function scopeTwo() {
    // scope 2
  }
}
```

Dès que vous créez une référence en JavaScript, que ce soit par une variable, une fonction, une classe, un paramètre, un import, une étiquette, etc., elle appartient à la portée actuelle.

```js
var global = "I am in the global scope";

function scopeOne() {
  var one = "Je suis la portée créée par `scopeOne()`";

  function scopeTwo() {
    var two = "Je suis la portée créée par `scopeTwo()`";
  }
}
```

Le code dans une portée plus profonde peut utiliser une référence d’une portée plus haute.

```js
function scopeOne() {
  var one = "Je suis la portée créée par `scopeOne()`";

  function scopeTwo() {
    one = "Je mets à jour la référence dans `scopeOne` à l'intérieur de `scopeTwo`";
  }
}
```

Une portée plus basse pourrait également créer une référence du même nom sans la modifier.

```js
function scopeOne() {
  var one = "Je suis dans la portée créée par `scopeOne()`";

  function scopeTwo() {
    var one = "Je crée un nouveau `one` mais en laissant la référence `scopeOne()` seule.";
  }
}
```

Lors de l'écriture d'une transformation, nous devons nous méfier de la portée. Il faut s’assurer que nous ne cassons pas le code existant tout en modifiant les différentes parties de celui-ci.

On peut vouloir ajouter de nouvelles références et s'assurer qu’elles n’entrent pas en conflit avec celles qui existent déjà. Ou peut-être que nous voulons juste trouver où est référencée une variable. Nous voulons être en mesure de suivre ces références dans une portée donnée.

Une portée peut être représentée ainsi :

```js
{
  path: path,
  block: path.node,
  parentBlock: path.parent,
  parent: parentScope,
  bindings: [...]
}
```

Lorsque vous créez une nouvelle portée, vous devez donc le faire en lui donnant un chemin et une portée mère. Puis au cours du processus de parcours, il faut recueillir toutes les références (les « liaisons ») dans cette portée.

Une fois cela fait, il y a toutes sortes de méthodes que vous pouvez utiliser sur des portées. Nous en parlerons cependant plus tard.

#### <a id="toc-bindings"></a>Liaisons

Les références appartiennent toutes à une portée particulière, cette relation est appelée une **liaison**.

```js
function scopeOnce() {
  var ref = "Ceci est une liaison";

  ref; // Ceci est une référence à un liaison

  function scopeTwo() {
    ref; // Ceci est une référence à une liaison à partir d'une portée inférieure
  }
}
```

Une liaison unique ressemble à ceci :

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

Avec cette information, vous pouvez trouver toutes les références qui ont un liaison, voir quel est le type de liaison (paramètre, déclaration, etc.), rechercher à quelle portée elle appartient ou obtenir une copie de son identificateur. Vous pouvez même dire si elle est constante ou pas, regardez quels chemins sont à l’origine qu'elle soit une constante ou pas.

Être capable de dire si une liaison est constante est utile pour beaucoup de choses, dont la plus importante, c'est la minification.

```js
function scopeOne() {
  var ref1 = "Ceci est une liaison constante";

  becauseNothingEverChangesTheValueOf(ref1);

  function scopeTwo() {
    var ref2 = "Ceci *n'est pas* une liaison constante";
    ref2 = "Car la valeur est modifiée";
  }
}
```

* * *

# <a id="toc-api"></a>API

Babel est en fait une collection de modules. Dans cette section, nous verrons les plus importants, en expliquant ce qu’ils font et comment les utiliser.

> Remarque : Ceci ne remplace pas la documentation détaillée de l'API qui sera disponible dans peu de temps.

## <a id="toc-babylon"></a>[`babylon`](https://github.com/babel/babylon)

Babylone est l'analyseur de Babel. Il est démarré comme un fork de Acorn, c' est rapide, simple à utiliser, il a une architecture de plugin pour les fonctionnalités non standards (ainsi que les futures standards).

Tout d’abord, nous devons l’installer.

```sh
$ npm install --save babylon
```

Commençons par analyser simplement une chaîne de code :

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

Nous pouvons aussi passer des options à `parse()` comme suit :

```js
babylon.parse(code, {
  sourceType: "module", // default: "script"
  plugins: ["jsx"] // default: []
});
```

`sourceType` peut avoir soit `"module"` ou `"script"` qui est le mode que doit utiliser Babylon pour analyser. `"module"` analysera en mode strict et permettra les déclarations de module, ce ne sera pas le cas de `"script"`.

> **Remarque :** `sourceType` a par défaut `"script"` et partira en erreur lorsqu’il détecte `import` ou `export`. Passez `sourceType: « module »` pour se débarrasser de ces erreurs.

Comme Babylon est construit avec une architecture de plugin, il y a également une option `plugins` qui activera les plugins internes. Remarquez que Babylon n’a pas encore ouvert cette API aux plugins externes, bien qu'il puisse le faire dans le futur.

Pour voir une liste complète des plugins, consultez le [README de Babylon](https://github.com/babel/babylon/blob/master/README.md#plugins).

## <a id="toc-babel-traverse"></a>[`babel-traverse`](https://github.com/babel/babel/tree/master/packages/babel-traverse)

Le module Traverse de Babel maintient l’état général de l’arborescence et est responsable du remplacement, de la suppression et de l’ajout de nœuds.

Installez-le en exécutant :

```sh
$ npm install --save babel-traverse
```

Nous pouvons l’utiliser avec Babylon pour parcourir et mettre à jour les nœuds :

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

Babel Types est une bibliothèque d’utilitaires de type Lodash pour les nœuds de l’AST. Il contient des méthodes pour la construction, la validation et la conversion des nœuds de l’AST. C'est pratique pour le nettoyage logique de l'AST avec des méthodes utiles bien pensées.

Vous pouvez l’installer en exécutant :

```sh
$ npm install --save babel-types
```

Puis commencez à l’utiliser :

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

### <a id="toc-definitions"></a>Définitions

Babel Types a des définitions pour chaque type de nœud, avec des informations sur les propriétés qu'il contient, quelles sont les valeurs valides, comment construire ce nœud, comment le nœud doit être parcouru et l'alias du nœud.

Une définition de type de nœud ressemble à ceci :

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

### <a id="toc-builders"></a>Constructeurs

Vous remarquerez que la définition ci-dessus pour `BinaryExpression` a un champ `builder`.

```js
builder: ["operator", "left", "right"]
```

C’est parce que chaque type de nœud obtient une méthode de construction, qui, une fois utilisé ressemble à ceci :

```js
t.binaryExpression("*", t.identifier("a"), t.identifier("b"));
```

Ce qui crée un AST comme ceci :

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

Qui, une fois affiché ressemble à ceci :

```js
a * b
```

Les constructeurs valideront également les nœuds qu’ils créent et lèveront des erreurs descriptives s'ils sont mal utilisés. Ce qui mène au prochain type de méthode.

### <a id="toc-validators"></a>Validateurs

La définition de `BinaryExpression` contient aussi des informations sur les `fields` (champs) d’un nœud et comment les valider.

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

Ceci est utilisé pour créer deux types de validation de méthodes. La première étant `isX`.

```js
t.isBinaryExpression(maybeBinaryExpressionNode);
```

Ce test pour s'assurer que le nœud est une expression binaire, mais vous pouvez également passer un deuxième paramètre pour vous assurer que le nœud contient certaines propriétés et valeurs.

```js
t.isBinaryExpression(maybeBinaryExpressionNode, { operator: "*" });
```

Il y a aussi une version plus assertive de ces méthodes, *ehem*, qui déclenchera des erreurs au lieu de retourner la valeur `true` ou `false`.

```js
t.assertBinaryExpression(maybeBinaryExpressionNode);
t.assertBinaryExpression(maybeBinaryExpressionNode, { operator: "*" });
// Error: Expected type "BinaryExpression" with option { "operator": "*" }
```

### <a id="toc-converters"></a>Convertisseurs

> \[WIP\] (Travail en cours)

## <a id="toc-babel-generator"></a>[`babel-generator`](https://github.com/babel/babel/tree/master/packages/babel-generator)

Babel Generator est le générateur de code pour Babel. Il prend un AST et le transforme en code avec des sourcemaps.

Exécutez la commande suivante pour l’installer :

```sh
$ npm install --save babel-generator
```

Puis utilisez-le

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

Vous pouvez également passer des options à `generate()`.

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

Babel Template est un autre module minuscule mais incroyablement utile. Il vous permet d'écrire des chaînes de code avec des emplacements que vous pouvez utiliser au lieu de construire manuellement un AST massif. En informatique, cette fonctionnalité est appelée quasiquotes.

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

# <a id="toc-writing-your-first-babel-plugin"></a>Écriture de votre premier plugin de Babel

Maintenant que vous êtes familiarisé avec les bases de Babel, nous allons les attacher ensemble avec l'API de plugin.

Commencez par une `function` qui passe l’objet courant de [`babel`](https://github.com/babel/babel/tree/master/packages/babel-core).

```js
export default function(babel) {
  // contenu du plugin
}
```

Étant donné que vous allez l’utiliser souvent, vous aurez probablement envie de saisir simplement ` babel.types` comme ceci :

```js
export default function({ types: t }) {
  // contenu du plugin
}
```

Puis vous retournez un objet avec une propriété `visitor` qui est le visiteur primaire du plugin.

```js
export default function({ types: t }) {
  return {
    visitor: {
      // contenu du visiteur
    }
  };
};
```

Chaque fonction dans le visiteur reçoit 2 arguments : `path` et `state`

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

Nous allons écrire un plugin rapide pour montrer comment il fonctionne. Voici notre code source :

```js
foo === bar;
```

Ou sous forme d'un AST  :

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

Nous allons commencer en ajoutant une méthode visiteur `BinaryExpression`.

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

Ensuite, nous allons restreindre `BinaryExpression` pour qu'il utilise uniquement l'opérateur `===`.

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

Maintenant nous allons remplacer la propriété `left` avec un nouvel identificateur :

```js
BinaryExpression(path) {
  if (path.node.operator !== "===") {
    return;
  }

  path.node.left = t.identifier("sebmck");
  // ...
}
```

Déjà si nous exécutons ce plugin que nous obtiendrions :

```js
sebmck === bar;
```

Maintenant, nous allons remplacer la propriété `right`.

```js
BinaryExpression(path) {
  if (path.node.operator !== "===") {
    return;
  }

  path.node.left = t.identifier("sebmck");
  path.node.right = t.identifier("dork");
}
```

Et voici notre résultat final :

```js
sebmck === dork;
```

Génial ! Notre tout premier plugin Babel.

* * *

# <a id="toc-transformation-operations"></a>Opérations de transformations

## <a id="toc-visiting"></a>Visite

### <a id="toc-get-the-path-of-a-sub-node"></a>Récupération du chemin du sous-nœud

Pour accéder à la propriété d’un nœud de l’AST, vous accéder normalement au nœud, puis à la propriété. `Path.Node.Property`

```js
// le nœud AST BinaryExpression possède des propriétés : `left`, `right`, `operator`
BinaryExpression(path) {
  path.node.left;
  path.node.right;
  path.node.operator;
}
```

Si au lieu de cela, vous avez besoin d'accéder au `path` de cette propriété, utilisez la méthode `get` d’un chemin, en passant la chaîne de la propriété.

```js
BinaryExpression(path) {
  path.get('left');
}
Program(path) {
  path.get('body.0');
}
```

### <a id="toc-check-if-a-node-is-a-certain-type"></a>Vérification si un nœud est un certain type

Si vous voulez vérifier le type d'un noeud, la meilleure façon de procéder est la suivante :

```js
BinaryExpression(path) {
  if (t.isIdentifier(path.node.left)) {
    // ...
  }
}
```

Vous pouvez également faire une vérification peu profonde pour les propriétés de ce nœud :

```js
BinaryExpression(path) {
  if (t.isIdentifier(path.node.left, { name: "n" })) {
    // ...
  }
}
```

C’est fonctionnellement équivalent à :

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

### <a id="toc-check-if-a-path-is-a-certain-type"></a>Vérification si un chemin est un certain type

Un chemin a les mêmes méthodes pour contrôler le type d’un nœud :

```js
BinaryExpression(path) {
  if (path.get('left').isIdentifier({ name: "n" })) {
    // ...
  }
}
```

équivaut à faire :

```js
BinaryExpression(path) {
  if (t.isIdentifier(path.node.left, { name: "n" })) {
    // ...
  }
}
```

### <a id="toc-check-if-an-identifier-is-referenced"></a>Vérification si un identificateur est référencé

```js
Identifier(path) {
  if (path.isReferencedIdentifier()) {
    // ...
  }
}
```

Ou une autre alternative :

```js
Identifier(path) {
  if (t.isReferenced(path.node, path.parent)) {
    // ...
  }
}
```

### <a id="toc-find-a-specific-parent-path"></a>Trouver un chemin d'un parent spécifique

Parfois, vous aurez besoin de remonter l’arborescence d’un chemin jusqu'à ce qu’une condition soit satisfaite.

Appelez le `callback` fourni avec les `NodePath`s de tous les parents. Lorsque le `callback` renvoie une valeur truthy, nous retournons ce `NodePath`.

```js
path.findParent((path) => path.isObjectExpression());
```

Si le chemin actuel doit être inclus :

```js
path.find((path) => path.isObjectExpression());
```

Trouver le programme ou la fonction parent le plus proche :

```js
path.getFunctionParent();
```

Remonter l’arborescence jusqu'à ce que nous accédions à un chemin du nœud parent dans une liste

```js
path.getStatementParent();
```

### <a id="toc-get-sibling-paths"></a>Récupérer les chemins des frères

Si un chemin est une liste, comme pour le corps de `Function` ou `Program`, il aura des « frères ».

  * Vérifiez si un chemin fait partie d’une liste avec `path.inList`
  * Vous pouvez obtenir les frère environnants avec `path.getSibling(index)`,
  * L'index du chemin dans le conteneur avec `path.key`,
  * Le conteneur du chemin (un tableau de tous les nœuds frères) avec `path.container`
  * Obtenez le nom de la clé du conteneur de liste avec `path.listKey`

> Ces API sont utilisées dans le plugin [transform-merge-sibling-variables](https://github.com/babel/babili/blob/master/packages/babel-plugin-transform-merge-sibling-variables/src/index.js) utilisé dans [babel-minify](https://github.com/babel/babili).

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

### <a id="toc-stopping-traversal"></a>Arrêt du parcours

Si votre plugin ne doit pas fonctionner dans certaine situation, la chose la plus simple à faire, c'est d’écrire un retour anticipé.

```js
BinaryExpression(path) {
  if (path.node.operator !== '**') return;
}
```

Si vous sous-parcourez un chemin de niveau supérieur, vous pouvez utiliser 2 méthodes fournies de l’API :

`path.skip()` saute le parcours du fils du chemin courant. `path.stop()` arrête de parcourir entièrement.

```js
outerPath.traverse({
  Function(innerPath) {
    innerPath.skip(); // si la vérification des enfants n'est pas pertinent
  },
  ReferencedIdentifier(innerPath, state) {
    state.iife = true;
    innerPath.stop(); // si vous souhaitez enregistrer un état puis arrêter le parcours
  }
});
```

## <a id="toc-manipulation"></a>Manipulation

### <a id="toc-replacing-a-node"></a>Remplacement d’un nœud

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

### <a id="toc-replacing-a-node-with-multiple-nodes"></a>Remplacement d’un nœud par plusieurs nœuds

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

> **Remarque :** Lors du remplacement d’une expression avec plusieurs nœuds, ils doivent être sous forme d'instruction. C’est parce que Babel utilise abondamment des heuristiques lors du remplacement des nœuds, ce qui signifie que vous pouvez faire quelques transformations assez folles qui seraient autrement très verbeuses.

### <a id="toc-replacing-a-node-with-a-source-string"></a>Remplacement d’un nœud avec une chaîne source

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

> **Remarque :** Il n'est pas recommandé d'utiliser cette API, à moins que votre source de données soit une chaîne de caractère dynamique. Dans un cas nominal, il est plus efficace d'analyser le code à l'extérieur du visiteur.

### <a id="toc-inserting-a-sibling-node"></a>Insertion d'un nœud enfant

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

> **Remarque :** Cela doit toujours être une instruction ou un tableau d’instructions. Cet exemple utilise les mêmes heuristiques que ceux mentionnés dans [Remplacement d'un nœud par plusieurs nœuds](#replacing-a-node-with-multiple-nodes).

### <a id="toc-inserting-into-a-container"></a>Insertion dans un conteneur

Si vous voulez insérer dans un nœud AST une propriété qui est un tableau comme `body`. C'est similaire à `insertBefore` et `insertAfter` sauf que vous devez spécifier `listKey` qui est généralement `body`.

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

### <a id="toc-removing-a-node"></a>Suppression d'un nœud

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

### <a id="toc-replacing-a-parent"></a>Remplacement d'un parent

Il suffit d’appeler `replaceWith` avec le parentPath : `path.parentPath`

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

### <a id="toc-removing-a-parent"></a>Suppression d'un parent

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

## <a id="toc-scope"></a>Portée

### <a id="toc-checking-if-a-local-variable-is-bound"></a>Vérification si une variable locale est liée

```js
FunctionDeclaration(path) {
  if (path.scope.hasBinding("n")) {
    // ...
  }
}
```

Ceci traversera l’arborescence de la portée et vérifiera la liaison particulière.

Vous pouvez également vérifier si une portée a sa **propre** liaison :

```js
FunctionDeclaration(path) {
  if (path.scope.hasOwnBinding("n")) {
    // ...
  }
}
```

### <a id="toc-generating-a-uid"></a>Génération d'un UID

Cela générera un identificateur qui n’empiète pas sur les variables définies localement.

```js
FunctionDeclaration(path) {
  path.scope.generateUidIdentifier("uid");
  // Node { type: "Identifier", name: "_uid" }
  path.scope.generateUidIdentifier("uid");
  // Node { type: "Identifier", name: "_uid2" }
}
```

### <a id="toc-pushing-a-variable-declaration-to-a-parent-scope"></a>Poussée d'une déclaration de variable vers un scope parent

Parfois, vous voudrez peut-être pousser une `VariableDeclaration` pour pouvoir l'assigner.

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

### <a id="toc-rename-a-binding-and-its-references"></a>Renommage d'une liaison et de ses références

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

Alternativement, vous pouvez renommer une liaison vers un identificateur unique généré :

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

# <a id="toc-plugin-options"></a>Options du plugin

Si vous souhaitez permettre à vos utilisateurs de personnaliser le comportement de votre plugin Babel, vous pouvez accepter des options de plugin spécifiques que les utilisateurs peuvent définir de cette façon :

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

Ces options sont alors passées dans les visiteurs du plugin à travers l'objet `state` :

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

Ces options sont spécifiques au plugin et vous ne pouvez pas accéder aux options des autres plugins.

## <a id="toc-pre-and-post-in-plugins"></a> Pré et Post dans les plugins

Les plugins peuvent avoir des fonctions qui sont exécutées avant ou après les plugins. Elles peuvent être utilisées à des fins d’installation ou de nettoyage/analyse.

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

## <a id="toc-enabling-syntax-in-plugins"></a> Activation de la syntaxe dans les plugins

Les plugins peuvent activer [babylon plugins](https://github.com/babel/babylon#plugins) pour que les utilisateurs n'aient pas besoin de les installer/activer. Cela empêche une erreur d'analyse sans hériter du plugin de syntaxe.

```js
export default function({ types: t }) {
  return {
    inherits: require("babel-plugin-syntax-jsx")
  };
}
```

## <a id="toc-throwing-a-syntax-error"></a> Lancer une erreur de syntaxe

Si vous souhaitez lever une erreur avec babel-code-frame et un message :

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

L’erreur ressemblera à :

    file.js: Error message here
       7 |
       8 | let tips = [
    >  9 |   "Click on any AST node with a '+' to expand it",
         |   ^
      10 |
      11 |   "Hovering over a node highlights the \
      12 |    corresponding part in the source code",
    

* * *

# <a id="toc-building-nodes"></a>Nœuds de création

Lors de l’écriture des transformations, vous aurez souvent envie de créer certains nœuds pour les insérer dans l’AST. Comme mentionné précédemment, vous pouvez le faire en utilisant les méthodes du [builder](#builders) dans le package [`babel-types`](#babel-types).

Le nom de la méthode pour un constructeur (builder) est simplement le nom du type de nœud que vous voulez construire sauf que la première lettre est en minuscule. Par exemple si vous voulez construire un `MemberExpression` vous utiliserez `t.memberExpression(...)`.

Les arguments de ces constructeurs sont déterminés par la définition du nœud. Il y a un peu de travail à faire pour générer la documentation afin der lire facilement les définitions, mais en attendant, elles peuvent tous être trouvés [ici](https://github.com/babel/babel/tree/master/packages/babel-types/src/definitions).

Une définition de nœud ressemble à ce qui suit :

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

Ici vous pouvez voir toutes les informations sur ce type de nœud particulier, y compris comment le construire, le parcourir et le valider.

En examinant la propriété `builder`, vous pouvez voir les 3 arguments qui seront nécessaires pour appeler la méthode du constructeur (`t.memberExpression`).

```js
builder: ["object", "property", "computed"],
```

> Veuillez notez que parfois il y a plus de propriétés personnalisables sur le nœud que celles contenues dans le tableau `builder` . Cela doit empêcher le constructeur d'avoir trop d'arguments. Dans ces cas, vous devrez définir manuellement les propriétés. Un exemple de ceci, c'est [`ClassMethod`](https://github.com/babel/babel/blob/bbd14f88c4eea88fa584dd877759dd6b900bf35e/packages/babel-types/src/definitions/es2015.js#L238-L276).

```js
// Exemple
// parce que le builder ne contient pas la propriété `async`
var node = t.classMethod(
  "constructor",
  t.identifier("constructor"),
  params,
  body
)
// set it manually after creation
node.async = true;
```

Vous pouvez voir la validation pour les arguments du constructeur avec l’objet `fields`.

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

Vous pouvez voir que `object` doit être une `Expression`, `property` doit être soit une `Expression` ou un `Identifier` selon si l’expression membre est `computed` ou non, `computed` est simplement une valeur booléenne qui est par défaut à `false`.

Donc nous pouvons construire un `MemberExpression` en procédant comme suit :

```js
t.memberExpression(
  t.identifier('object'),
  t.identifier('property')
  // `computed` est facultatif
);
```

Qui se traduira par :

```js
object.property
```

Cependant, nous avons dit que `object` doit être une `Expression` alors pourquoi `Identifier` est valide ?

Eh bien, si nous regardons la définition de `Identifier`, nous pouvons voir qu’il a une propriété `aliases` qui stipule que c’est aussi une expression.

```js
aliases: ["Expression", "LVal"],
```

Donc puisque `MemberExpression` est un type de `Expression`, nous pourrions le définir comme `object` d’un autre `MemberExpression` :

```js
t.memberExpression(
  t.memberExpression(
    t.identifier('member'),
    t.identifier('expression')
  ),
  t.identifier('property')
)
```

Qui se traduira par :

```js
member.expression.property
```

Il est très improbable que vous appreniez par cœur les signatures de méthode du constructeur pour chaque type de nœud. Donc vous devriez prendre du temps et comprendre comment ils sont générés depuis les définitions du nœud.

Vous pouvez trouver toutes les [définitions actuelles ici](https://github.com/babel/babel/tree/master/packages/babel-types/src/definitions) et vous pouvez les voir [documentées ici](https://github.com/babel/babel/blob/master/doc/ast/spec.md)

* * *

# <a id="toc-best-practices"></a>Meilleures pratiques

## <a id="toc-create-helper-builders-and-checkers"></a> Créer des constructeurs d'assistance et des vérificateurs

Il est assez simple d'extraire certaines vérifications (si un nœud est un certain type) dans leurs propres fonctions d'aide, ainsi que d'extraire des aides pour des types de nœuds spécifiques.

```js
function isAssignment(node) {
  return node && node.operator === opts.operator + "=";
}

function buildAssignment(left, right) {
  return t.assignmentExpression("=", left, right);
}
```

## <a id="toc-avoid-traversing-the-ast-as-much-as-possible"></a>Éviter de traverser l'AST autant que possible

Parcourir l'AST est coûteux, et il est facile de parcourir accidentellement l'AST plus que nécessaire. Cela pourrait être la source de milliers, voire de dizaines de milliers d'opérations supplémentaires.

Babel optimise ces parcours le plus possible, en fusionnant les visiteurs ensemble si possible afin de tout faire en un seul parcours.

### <a id="toc-merge-visitors-whenever-possible"></a>Fusionner les visiteurs quand c'est possible

Lorsque vous écrivez des visiteurs, il peut être tentant d’appeler `path.traverse` à plusieurs endroits où ils sont logiquement nécessaires.

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

Cependant, il est bien plus efficace d'écrire un seul visiteur qui n'est appelé qu'une seule fois. Dans le cas contraire, vous visiteriez le même arbre plusieurs fois sans raison.

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

### <a id="toc-do-not-traverse-when-manual-lookup-will-do"></a>N'utilisez pas "traverse" lorsqu'une lecture manuelle est possible

Il peut être tentant d'appeler `path.traverse` pour rechercher un type de nœud particulier.

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

Cependant, lorsque vous recherchez quelque chose de précis et peu profond dans l'arbre, il est souvent possible de récupérer manuellement des nœuds fils sans effectuer une traversée coûteuse.

```js
const MyVisitor = {
  FunctionDeclaration(path) {
    path.node.params.forEach(function() {
      // ...
    });
  }
};
```

## <a id="toc-optimizing-nested-visitors"></a>Optimisation des visiteurs imbriqués

Lorsque vous imbriquez un visiteur dans un autre, il paraît sensé de les imbriquer également dans votre code.

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

Cependant, ceci crée un nouvel objet visiteur chaque fois que `FunctionDeclaration()` est appelée. Cela peut être coûteux, car Babel effectue un traitement chaque fois qu'un nouvel objet visiteur est transmis (comme l'explosion de clés contenant plusieurs types, la validation et l'ajustement de la structure de l'objet). Parce que Babel stocke des flags sur les objets visiteurs indiquant qu'il a déjà effectué ce traitement, il est préférable de stocker le visiteur dans une variable et de transmettre le même objet à chaque fois.

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

Si vous avez besoin d'enregistrer un état à l'intérieur d'un visiteur imbriqué, comme ceci :

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

Vous pouvez le fournir en paramètre de la méthode `traverse()`, puis y accéder grâce à l'opérateur `this` au sein du visiteur.

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

## <a id="toc-being-aware-of-nested-structures"></a>Etre conscient des structures imbriqués

Quelquefois en pensant à une transformation donnée, vous pourriez oublier que la structure de donnée peut être imbriquée.

Par exemple, imaginez que nous voulons rechercher la `ClassMethod` du `constructor` depuis la la `ClassDeclaration` de `Foo`.

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

Nous ignorons le fait que les classes peuvent être imbriquées et en utilisant le parcours ci-dessus nous tomberons sur un `constructor` imbriqué :

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

## <a id="toc-unit-testing"></a>Tests unitaires

Il existe quelques méthodes principales pour tester les plugins babel : les tests instantanés, les tests AST et les tests d'exécution. Nous utiliserons [jest](http://facebook.github.io/jest/) pour cet exemple car il prend en charge le test instantané dès la sortie de la boîte. L'exemple que nous créons ici est hébergé dans [ce dépôt](https://github.com/brigand/babel-plugin-testing-example).

Nous avons d'abord besoin d'un plugin babel, nous allons le mettre dans src/index.js.

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

### Tests instantanés

Ensuite, installez nos dépendances avec `npm install --save-dev babel-core jest`, et nous pourrons commencer à écrire notre premier test : l'instantané. Les tests d'instantanés nous permettent d'inspecter visuellement la sortie de notre plugin babel. Nous lui donnons une entrée, puis nous lui disons de faire un instantané, et de l'enregistrer dans un fichier. Nous vérifions les instantanés dans git. Cela nous permet de voir quand nous avons affecté la sortie de l'un de nos cas de test. Cela donne aussi un diff dans les pull requests. Bien sûr, vous pouvez le faire avec n'importe quel framework de test, mais avec jest la mise à jour des instantanés est assez simple avec `jest -u`.

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

Cela nous donne un fichier instantané dans `src/__tests__/__snapshots__/index-test.js.snap`.

```js
exports[`test works 1`] = `
"
var bar = 1;
if (bar) console.log(bar);"
`;
```

Si nous changeons 'bar' en 'baz' dans notre plugin et que nous recommençons l'exécution de jest, nous obtenons ceci :

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

Nous voyons comment notre modification du code du plugin a affecté la sortie de notre plugin, et si la sortie nous semble bonne, nous pouvons lancer `jest -u` pour mettre à jour l'instantané.

### Tests AST

En plus des tests d'instantanés, nous pouvons inspecter manuellement l'AST. C'est un exemple simple mais fragile. Pour les situations plus complexes, vous pouvez utiliser babel-traverse. Il vous permet de spécifier un objet avec une clé `visitor`, exactement comme vous l'utilisez pour le plugin lui-même.

```js
it('contains baz', () => {
  const {ast} = babel.transform(example, {plugins: [plugin]});
  const program = ast.program;
  const declaration = program.body[0].declarations[0];
  assert.equal(declaration.id.name, 'baz');
  // ou babelTraverse(program, {visitor: ...})
});
```

### Tests d'exécution

Ici, nous allons transformer le code, puis évaluer s'il se comporte correctement. Notez que nous n'utilisons pas `assert` dans le test. Cela garantit que si notre plugin fait des choses bizarres comme la suppression de la ligne d'assertion par accident, le test échouera toujours.

```js
it('foo is an alias to baz', () => {
  var input = `
    var foo = 1;
    // test que foo a été renommé en baz
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

Le cœur de Babel utilise une [approche similaire](https://github.com/babel/babel/blob/7.0/CONTRIBUTING.md#writing-tests) pour les tests instantanés et d’exécutions.

### [`babel-plugin-tester`](https://github.com/kentcdodds/babel-plugin-tester)

Ce paquet facilite les tests de plugins. Si vous connaissez le [RuleTester](http://eslint.org/docs/developer-guide/working-with-rules#rule-unit-tests) d'ESLint, cela devrait vous être familier. Vous pouvez regarder [les docs](https://github.com/kentcdodds/babel-plugin-tester/blob/master/README.md) pour avoir une idée complète de ce qui est possible, mais voici un exemple simple :

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

> ***Pour les prochaines mises à jour, suivez [@thejameskyle](https://twitter.com/thejameskyle) et [@babeljs](https://twitter.com/babeljs) sur Twitter.***