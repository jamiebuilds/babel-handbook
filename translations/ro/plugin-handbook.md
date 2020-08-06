# Manualul pentru Plugin-uri Babel

Acest document descrie cum se pot crea [plugin-uri](https://babeljs.io/docs/advanced/plugins/) pentru [Babel](https://babeljs.io).

[![cc-by-4.0](https://licensebuttons.net/l/by/4.0/80x15.png)](http://creativecommons.org/licenses/by/4.0/)

Acest manual este disponibil și în alte limbi, a se vedea [README](/README.md) pentru o listă completă.

# Cuprins

  * [Introducere](#toc-introduction)
  * [Concepte de bază](#toc-basics) 
      * [ASTs](#toc-asts)
      * [Etapele Babel](#toc-stages-of-babel)
      * [Analiză](#toc-parse) 
          * [Analiză Lexicală](#toc-lexical-analysis)
          * [Analiză Sintactică](#toc-syntactic-analysis)
      * [Transformare](#toc-transform)
      * [Generare](#toc-generate)
      * [Traversare](#toc-traversal)
      * [Vizitatori (Visitors)](#toc-visitors)
      * [Trasee (Paths)](#toc-paths) 
          * [Trasee în Vizitatori (Paths in Visitors)](#toc-paths-in-visitors)
      * [Stare](#toc-state)
      * [Domenii (Scopes)](#toc-scopes) 
          * [Legături (Bindings)](#toc-bindings)
  * [API](#toc-api) 
      * [babylon](#toc-babylon)
      * [babel-traverse](#toc-babel-traverse)
      * [babel-types](#toc-babel-types)
      * [Definiții](#toc-definitions)
      * [Constructori](#toc-builders)
      * [Validatori](#toc-validators)
      * [Convertori](#toc-converters)
      * [babel-generator](#toc-babel-generator)
      * [babel-template](#toc-babel-template)
  * [Scrierea primului Plugin Babel](#toc-writing-your-first-babel-plugin)
  * [Operații de Transformare](#toc-transformation-operations) 
      * [Vizitare (Visiting)](#toc-visiting)
      * [Aflarea căii unui sub-nod](#toc-get-the-path-of-a-sub-node)
      * [Verificare dacă un nod este de un anumit tip](#toc-check-if-a-node-is-a-certain-type)
      * [Verificare dacă un nod este de un anumit tip](#toc-check-if-a-path-is-a-certain-type)
      * [Verificare dacă un identificator are referință](#toc-check-if-an-identifier-is-referenced)
      * [Aflarea căii unui anumit părinte](#toc-find-a-specific-parent-path)
      * [Aflarea căilor nodurilor de același nivel](#toc-get-sibling-paths)
      * [Oprirea traversării](#toc-stopping-traversal)
      * [Manipulare](#toc-manipulation)
      * [Înlocuirea unui nod](#toc-replacing-a-node)
      * [Înlocuirea unui nod cu mai multe noduri](#toc-replacing-a-node-with-multiple-nodes)
      * [Înlocuirea unui nod cu un șir de caractere sursă](#toc-replacing-a-node-with-a-source-string)
      * [Inserarea unui nod pe același nivel](#toc-inserting-a-sibling-node)
      * [Inserarea într-un containăr](#toc-inserting-into-a-container)
      * [Ștergerea unui nod](#toc-removing-a-node)
      * [Înlocuirea unui părinte](#toc-replacing-a-parent)
      * [Ștergerea unui părinte](#toc-removing-a-parent)
      * [Domeniu (Scope)](#toc-scope)
      * [Verificare dacă o variabilă locală este legată](#toc-checking-if-a-local-variable-is-bound)
      * [Generarea unui UID](#toc-generating-a-uid)
      * [Mutarea unei declarații de variabilă într-un domeniu părinte](#toc-pushing-a-variable-declaration-to-a-parent-scope)
      * [Redenumirea unei legături și a referințelor sale](#toc-rename-a-binding-and-its-references)
  * [Opțiuni de plugin](#toc-plugin-options) 
      * [Pre şi Post în plugin-uri](#toc-pre-and-post-in-plugins)
      * [Activarea Syntax în plugin-uri](#toc-enabling-syntax-in-plugins)
  * [Construirea nodurilor](#toc-building-nodes)
  * [Practici preferate](#toc-best-practices) 
      * [Evitați traversarea AST pe cât posibil](#toc-avoid-traversing-the-ast-as-much-as-possible)
      * [Îmbinarea vizitatorilor ori de câte ori este posibil](#toc-merge-visitors-whenever-possible)
      * [Evitați traversarea când o căutare manuală este suficientă](#toc-do-not-traverse-when-manual-lookup-will-do)
      * [Optimizarea vizitatorilor imbricați](#toc-optimizing-nested-visitors)
      * [Atenție la structuri imbricate](#toc-being-aware-of-nested-structures)
      * [Testarea Unitara](#toc-unit-testing)

# <a id="toc-introduction"></a>Introducere

Babel este un compilator generic multi-scop pentru JavaScript. Mai mult decât atât, este o colecție de module care pot fi utilizate pentru diverse tipuri de analiză statică.

> Analiza statică este procesul de a analiza cod fără a-l executa. (Analiza de cod, în timp ce se execută este cunoscută sub denumirea de analiză dinamică). Scopul analizei statice variază foarte mult. Poate fi folosită pentru validare (linting), compilare, evidențiere (highlighting), transformare, optimizare, minimizare, și multe altele.

Puteți utiliza Babel pentru a construi diverse tipuri de instrumente care vă pot ajuta să fiți mai productivi și pentru a scrie programe mai bune.

> ***Pentru actualizări, urmăriţi-l pe [@thejameskyle](https://twitter.com/thejameskyle) pe Twitter.***

* * *

# <a id="toc-basics"></a>Concepte de bază

Babel este un compilator de JavaScript, mai exact un compilator sursă-la-sursă, deseori numit un "transpiler". Asta înseamnă că dacă îi pasezi cod JavaScript, Babel modifică codul, și generează cod nou.

## <a id="toc-asts"></a>ASTs

Fiecare dintre acești pași implică crearea sau lucrul cu un [Arbore Abstract de Sintaxă](https://en.wikipedia.org/wiki/Abstract_syntax_tree) sau AST.

> Babel folosește un AST modificat din [ESTree](https://github.com/estree/estree), cu specificațiile interne aflate [aici](https://github.com/babel/babylon/blob/master/ast/spec.md).

```js
function square(n) {
  return n * n;
}
```

> Examinați [AST Explorer](http://astexplorer.net/) pentru a înțelege mai bine nodurile AST. [Aici](http://astexplorer.net/#/Z1exs6BWMq) este un link, cu exemplul de cod de mai sus.

Același program poate fi reprezentat printr-o listă, ca aceasta:

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

Sau printr-un obiect JavaScript ca acesta:

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

Veți observa că fiecare nivel AST are o structură similară:

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

> Notă: Unele proprietăți au fost eliminate pentru simplitate.

Fiecare dintre acestea sunt cunoscute sub denumirea de **Nod**. AST-ul poate fi alcătuit dintr-un singur nod, sute sau mii de noduri. Impreună ele sunt capabile să descrie sintaxa unui program care poate fi folosită pentru analiză statică.

Fiecare Nod are această interfață:

```typescript
interface Node {
  type: string;
}
```

Câmpul `type` este un string reprezentând tipul Nodului (ex. `"FunctionDeclaration"`, `"Identifier"`, sau `"BinaryExpression"`). Fiecare tip de Nod definește un set suplimentar de proprietăţi care descriu acel nod.

Există proprietăţi suplimentare pe fiecare Nod, generate de Babel, care descriu poziţia Nodului în codul sursă original.

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

Aceste proprietăţi `start`, `end`, `loc`, apar în fiecare Nod.

## <a id="toc-stages-of-babel"></a>Etapele Babel

Cele trei etape principale ale Babel sunt **analiză**, **transformare**, **generare**.

### <a id="toc-parse"></a>Analiză

Etapa de **analiză**, primeste codul şi produce AST-ul. Există două faze ale analizei în Babel: [**Analiza lexicală**](https://en.wikipedia.org/wiki/Lexical_analysis) şi [**Analiza sintactică**](https://en.wikipedia.org/wiki/Parsing).

#### <a id="toc-lexical-analysis"></a>Analiză Lexicală

Analiza lexicală primeste un şir de cod şi-l transformă într-un flux de simboluri (**tokens**).

Vă puteţi gândi la tokens ca o matrice uni-dimensională de piese de sintaxă a limbii.

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

Fiecare `type` are un set de proprietăţi care descrie token-ul:

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

La fel ca nodurile AST, acestea conțin `start`, `end`, și `loc`.

#### <a id="toc-syntactic-analysis"></a>Analiză Sintactică

Analiza sintactică primește un flux de token-uri şi-l transformă într-o reprezentare AST. Folosind informaţiile din token-uri, această fază le va reformata ca un AST care reprezintă structura codului într-un mod care este mai uşor de utilizat.

### <a id="toc-transform"></a>Transformare

Etapa de [Transformare](https://en.wikipedia.org/wiki/Program_transformation) primește un AST pe care-l traversează, adăugă, actualizează şi sterge noduri. Această etapă este de departe cea mai complexă din Babel sau din orice alt compilator. Acesta este locul în care plugin-urile acționează de fapt, aşadar va fi subiectul majorității capitolelor din acest manual. Nu vom intra prea adânc în detalii pentru moment.

### <a id="toc-generate"></a>Generare

Etapa de [generare de cod](https://en.wikipedia.org/wiki/Code_generation_(compiler)) primește AST-ul final şi-l transformă înapoi într-un şir de cod, creând şi [source maps](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/).

Generarea de cod este destul de simplă: se traversează AST-ul și se construiește un şir de caractere care reprezintă codul transformat.

## <a id="toc-traversal"></a>Traversare

Atunci când doriţi să transformați un AST trebuie să-l [traversați](https://en.wikipedia.org/wiki/Tree_traversal) recursiv.

Să zicem că avem tipul `FunctionDeclaration`. El are câteva proprietăți: `id`, `params` și `body`. Fiecare dintre ele au noduri imbricate.

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

Vom începe cu `FunctionDeclaration` şi ştim proprietăţile sale interne, astfel încât vom vizita fiecare proprietate şi copiii săi, în ordine.

Apoi vom continua cu `id`, care este un `Identificator`. `Identificatorii` nu au proprietăţi copil, așadar putem merge mai departe.

Urmează `params`, care este o matrice de noduri, așadar le vom vizita pe fiecare în parte. În acest caz este un singur nod care este de asemenea un `Identificator` aşadar putem merge mai departe.

Apoi ajungem la `body`, care este un `BlockStatement` cu o proprietate `body`, care este o serie de noduri, aşa că le vom vizita pe fiecare dintre ele.

Singurul element de aici este un nod `ReturnStatement`, care are un `argument`, vom merge la `argument` unde găsim un `BinaryExpression`.

`BinaryExpression` conține un `operator`, un `left`, şi un `right`. "Operator" nu este un nod, doar o valoare, așadar o ignorăm, şi în schimb vizităm doar `left` şi `right`.

Acest proces de traversare se întâmplă de-a lungul etapei de transformare Babel.

### <a id="toc-visitors"></a>Vizitatori (Visitors)

Atunci când vorbim despre "a merge" la un nod, ne referim de fapt la a-l **vizita**. Motivul pentru care vom folosi acest termen este pentru că există acest concept de [**vizitator**](https://en.wikipedia.org/wiki/Visitor_pattern).

Vizitatorii sunt un model folosit în traversarea AST, utilizat în diverse limbaje. În termeni simpli, aceștia sunt obiecte cu metode definite pentru a accepta anumite tipuri de nod dintr-un AST. Această definiție poate fi puțin abstractă, așadar să luăm un exemplu.

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

> **Notă:** `Identifier() { ... }` este o prescurtare pentru `Identifier: {enter() { ... }}`.

Aceasta este un vizitator simplu care atunci când este utilizat în timpul traversării va apela metoda `Identifier()` pentru fiecare `Identificator` din arbore.

Așadar, cu acest cod, metoda `Identifier()` va fi apelată de patru ori cu fiecare `Identificator` (inclusiv `square`).

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

Toate aceste apeluri se petrec la **intrarea** în nod. Cu toate acestea, există, de asemenea, posibilitatea de a apela o metodă vizitator la **ieşire**.

Imaginaţi-vă că avem această structură de arbore:

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

În timpul parcurgerii fiecărei ramuri, vom ajunge în cele din urmă într-o înfundătură, unde trebuie să traversăm arborele în sens invers pentru a ajunge la nodul următor. Mergând în jos prin arbore **intrăm** în fiecare nod, iar când parcurgem în sens invers **ieșim** din fiecare nod.

Haideţi să *parcurgem* acest proces de traversare pentru arborele de mai sus.

  * Intrare `FunctionDeclaration` 
      * Intrare `Identifier (id)`
      * Înfundătură
      * Ieșire `Identifier (id)`
      * Intrare `Identifier (params[0])`
      * Înfundătură
      * Ieșire `Identifier (params[0])`
      * Intrare `BlockStatement (body)`
      * Intrare `ReturnStatement (body)` 
          * Intrare `BinaryExpression (argument)`
          * Intrare `Identifier (left)` 
              * Înfundătură
          * Ieșire `Identifier (left)`
          * Intrare `Identifier (right)` 
              * Înfundătură
          * Ieșire `Identifier (right)`
          * Ieșire `BinaryExpression (argument)`
      * Ieșire `ReturnStatement (body)`
      * Ieșire `BlockStatement (body)`
  * Ieșire `FunctionDeclaration`

Așadar, când creaţi un vizitator aveţi două ocazii de a vizita un nod.

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

Dacă este necesar, puteţi aplica aceeaşi funcţie mai multor noduri de vizitator prin separare acestora cu o `|` în numele metodei, de exemplu `Identifier|MemberExpression`.

Exemplu de utilizare în plugin-ul [flow-comments](https://github.com/babel/babel/blob/2b6ff53459d97218b0cf16f8a51c14a165db1fd2/packages/babel-plugin-transform-flow-comments/src/index.js#L47)

```js
const MyVisitor = {
  "ExportNamedDeclaration|Flow"(path) {}
};
```

Puteţi deasemenea utiliza un alias ca noduri de vizitator (conform definiției din [babel-types](https://github.com/babel/babel/tree/master/packages/babel-types/src/definitions)).

De exemplu,

`Function` este un alias pentru `FunctionDeclaration`, `FunctionExpression`, `ArrowFunctionExpression`, `ObjectMethod` and `ClassMethod`.

```js
const MyVisitor = {
  Function(path) {}
};
```

### <a id="toc-paths"></a>Trasee (Paths)

AST o are în general multe Noduri, dar cum se relaționează ele unul la altul? Am putea avea un singur obiect mutabil gigant, pe care să-l manipulăm şi să avem acces deplin la el, sau putem simplifica acest lucru cu Trasee (**Paths**).

Un Traseu (**Path**) este o reprezentare de obiect a legăturii dintre două noduri.

De exemplu, dacă luăm următorul nod şi copilul său:

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

Şi reprezentăm copilul ` Identifier ` ca un Traseu, ar arăta ceva de genul acesta:

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

De asemenea, conține metadate suplimentare despre traseu:

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

Precum şi foarte multe metode legate de adăugarea, actualizarea, mutarea, şi ștergerea de noduri, dar vom ajunge la ele mai târziu.

Într-un anumit sens, traseele sunt o reprezentare **reactivă** a poziţiei unui nod în arbore şi multe alte informatii despre nod. Ori de câte ori apelați o metodă care modifică arborele, această informaţie este actualizată. Babel gestionează toate acestea pentru a face lucrul cu noduri cât mai ușor posibil.

#### <a id="toc-paths-in-visitors"></a>Trasee în Vizitatori (Paths in Visitors)

Când aveţi un vizitator care are o metodă `Identifier()`, de fapt se vizitează traseul, nu nodul. În acest fel se lucrează cu reprezentarea reactivă a nodului, nu cu nodul în sine.

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

### <a id="toc-state"></a>Stare

Starea este duşmanul transformării AST-ului. Starea îți va crea mari probleme şi ipotezele tale despre stare vor fi aproape întotdeauna greşite, din cauza unei sintaxe care nu ai luat-o în considerare.

Să considerăm următorul cod:

```js
function square(n) {
  return n * n;
}
```

Să scriem un vizitator rapid, care va redenumi `n` în `x`.

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

Acest lucru ar putea funcționa pentru codul de mai sus, dar îl putem strica uşor dacă facem acest lucru:

```js
function square(n) {
  return n * n;
}
n;
```

O modalitate mai bună de a rezolva această problema este folosind recursivitate. Așadar, haideți să facem ca într-un film de Christopher Nolan şi să punem un vizitator în interiorul unui vizitator.

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

Desigur, acesta este un exemplu teoretic, însă demonstrează cum să eliminăm starea globală din vizitatori.

### <a id="toc-scopes"></a>Domenii (Scopes)

În continuare vom introduce conceptul de [**domeniu**](https://en.wikipedia.org/wiki/Scope_(computer_science)). JavaScript utilizează [domeniu lexical](https://en.wikipedia.org/wiki/Scope_(computer_science)#Lexical_scoping_vs._dynamic_scoping), care este o structură de arbore, în care fiecare bloc crează un nou domeniu.

```js
// global scope

function scopeOne() {
  // scope 1

  function scopeTwo() {
    // scope 2
  }
}
```

Ori de câte ori creaţi o referinţă în JavaScript, fie că este o variabilă, funcție, clasă, parametru, import, etichetî, etc., aceasta aparţine actualului domeniu.

```js
var global = "I am in the global scope";

function scopeOne() {
  var one = "I am in the scope created by `scopeOne()`";

  function scopeTwo() {
    var two = "I am in the scope created by `scopeTwo()`";
  }
}
```

Codul dintr-un domeniu mai adânc poate utiliza o referință dintr-un domeniu superior.

```js
function scopeOne() {
  var one = "I am in the scope created by `scopeOne()`";

  function scopeTwo() {
    one = "I am updating the reference in `scopeOne` inside `scopeTwo`";
  }
}
```

Un domeniu mai adânc ar putea crea, de asemenea, o referință cu același nume fără a o modifica.

```js
function scopeOne() {
  var one = "I am in the scope created by `scopeOne()`";

  function scopeTwo() {
    var one = "I am creating a new `one` but leaving reference in `scopeOne()` alone.";
  }
}
```

Când scriem o transformare, vrem să ținem cont de domeniu. Trebuie să ne asigurăm că nu stricăm cod existent în timp ce modificăm diverse părți din el.

Probabil vom dori să adăugăm noi referinţe şi trebuie sa ne asigurăm că acestea nu intră în coliziune cu cele existente. Sau poate vrem doar să găsim unde se referențiază o anumită variabilă. Vrem să fim capabili să urmărim aceste referinţe într-un anumit domeniu.

Un domeniu poate fi reprezentat în felul următor:

```js
{
  path: path,
  block: path.node,
  parentBlock: path.parent,
  parent: parentScope,
  bindings: [...]
}
```

Crearea unui domeniu nou implică pasarea unui traseu şi a unui domeniu părinte. Apoi, în timpul procesului de traversare se colectează toate referințele ("legăturile") din acel domeniu.

Odată ce am făcut acest lucru, există tot felul de metode ce le putem utiliza pe domenii. Însă le vom examina mai târziu.

#### <a id="toc-bindings"></a>Legături (Bindings)

Toate referinţele aparţin unui anumit domeniu; această relaţie este cunoscută sub denumirea de **legătură**.

```js
function scopeOnce() {
  var ref = "This is a binding";

  ref; // This is a reference to a binding

  function scopeTwo() {
    ref; // This is a reference to a binding from a lower scope
  }
}
```

O legătură arată astfel:

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

Cu aceste informaţii putem găsi toate referințele la o legătură, putem vedea ce tip de legătură este (parametru, declaraţie etc.), putem căuta cărui domeniu îi aparține, sau putem să-i copiem identificatorul. Putem chiar să aflăm dacă este constantă şi, dacă nu, putem afla ce trasee o determină să fie variabilă, nu constantă.

Fiind capabili să spunem dacă o legătură este constantă este utilă pentru multe scopuri, insă cel mai mare este minimizarea codului.

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

Babel este de fapt o colecţie de module. În această secţiune vom trece prin cele mai importante, explicând la ce ajută şi cum se utilizează.

> Notă: Acest document nu este un înlocuitor pentru documentaţia detaliată a API-ului, care va fi disponibilă în altă parte în scurt timp.

## <a id="toc-babylon"></a>[`babylon`](https://github.com/babel/babylon)

Babylon este analizorul din Babel. A început ca o bifurcație din Acorn, este rapid, simplu de utilizat, are o arhitectură bazată pe plugin-uri pentru caracteristici neconvenţionale (precum şi viitoarele standarde).

În primul rând, să-l instalăm.

```sh
$ npm install --save babylon
```

Să începem pur şi simplu prin parsarea unui şir de cod:

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

Putem, de asemenea, sa pasăm opţiuni metodei `parse()` astfel:

```js
babylon.parse(code, {
  sourceType: "module", // default: "script"
  plugins: ["jsx"] // default: []
});
```

`sourceType` poate fi `"module"` sau `"script"`, care este modul în care Babylon ar trebui să-l analizeze. `"module"` va analiza în mod strict (strict mode) şi permite declaraţii de module, `"script"` nu va permite acest lucru si nu va analiza implicit in mod strict.

> **Notă:** `sourceType` va lua valoarea implicită `"script"` si va arunca eroare atunci când găsește valoarea `import` sau `export`. Pasați `sourceType: "module"` pentru a scăpa de aceste erori.

Din moment ce Babylon este construit cu o arhitectură bazată pe plugin-uri, există, de asemenea, o opţiune ` plugins` care permite activarea plugin-urilor interne. Reţineţi că Babylon nu a deschis încă API-ul pentru plugin-uri externe, deşi este posibil sa facă acest lucru în viitor.

Pentru a vedea o listă completă de plugin-uri, a se vedea [Babylon README](https://github.com/babel/babylon/blob/master/README.md#plugins).

## <a id="toc-babel-traverse"></a>[`babel-traverse`](https://github.com/babel/babel/tree/master/packages/babel-traverse)

Modulul de Traversare Babel conține starea generală a arborelui, şi este responsabil pentru înlocuirea, ștergerea şi adăugarea de noduri.

Instalaţi-l prin rularea:

```sh
$ npm install --save babel-traverse
```

Putem să-l folosim alături de Babylon să traversăm şi să actualizăm noduri:

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

Babel Types este o librărie de utilitare, similară cu Lodash, pentru nodurile AST. Conține metode pentru construirea, validarea şi conversia nodurilor AST. Este util pentru curățarea logicii AST cu metode utilitare bine gândite.

Îl puteţi instala prin rularea:

```sh
$ npm install --save babel-types
```

Apoi să-l utilizaţi:

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

### <a id="toc-definitions"></a>Definiții

Babel Types conține definiţii pentru fiecare tip de nod, și informaţii cu privire la ce proprietăţile aparţin cui, ce valori sunt valide, cum se construiește un nod, cum ar trebui traversat nodul şi alias-uri ale nodului.

O definiţie a unui tip de nod arată astfel:

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

### <a id="toc-builders"></a>Constructori

Veţi observa mai sus că definiţia pentru `BinaryExpression` are un câmp `builder`.

```js
builder: ["operator", "left", "right"]
```

Acest lucru se datorează faptului că fiecare tip de nod primește o metodă constructor, care, atunci când este utilizată arată în felul următor:

```js
t.binaryExpression("*", t.identifier("a"), t.identifier("b"));
```

Care creează un AST ca acesta:

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

Iar atunci când este tipărit arată astfel:

```js
a * b
```

Constructorii, de asemenea, vor valida nodurile pe care le crează şi aruncă erori descriptive dacă sunt folosiți necorespunzător. Ceea ce ne conduce la următorul tip de metodă.

### <a id="toc-validators"></a>Validatori

Definiția pentru `BinaryExpression` include informații privind cămpurile (`fields`) nodului şi cum să le validăm.

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

Acest lucru este folosit pentru a crea două tipuri de metode de validare. Prima dintre acestea este `isX`.

```js
t.isBinaryExpression(maybeBinaryExpressionNode);
```

Aceasta testează pentru a se asigura că nodul este o expresie binară, dar puteţi pasa, de asemenea, un al doilea parametru pentru a se asigura că nodul conţine anumite proprietăţi şi valori.

```js
t.isBinaryExpression(maybeBinaryExpressionNode, { operator: "*" });
```

Există, de asemenea, mai multe, *ehem*, versiuni dogmatice ale acestor metode, care vor arunca erori în loc sa returneze adevărat (`true`) sau fals (`false`).

```js
t.assertBinaryExpression(maybeBinaryExpressionNode);
t.assertBinaryExpression(maybeBinaryExpressionNode, { operator: "*" });
// Error: Expected type "BinaryExpression" with option { "operator": "*" }
```

### <a id="toc-converters"></a>Convertori

> [WIP] în lucru

## <a id="toc-babel-generator"></a>[`babel-generator`](https://github.com/babel/babel/tree/master/packages/babel-generator)

Babel Generator este generatorul de cod pentru Babel. Primește un AST şi îl transformă în cod cu sourcemaps.

Executaţi următoarea comandă pentru a-l instala:

```sh
$ npm install --save babel-generator
```

Apoi folosiți-l

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

Puteţi pasa, de asemenea, opţiuni metodei `generate()`.

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

Babel Template este un alt modul mic dar incredibil de util. Vă permite să scrie şiruri de cod cu substituenţi care le puteţi folosi în loc de construirea manuală unui AST masiv. În informatică, această capabilitate se numeşte quasiquotes.

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

# <a id="toc-writing-your-first-babel-plugin"></a>Scrierea primului Plugin Babel

Acum că sunteţi familiarizați cu toate elementele de bază din Babel, haideţi să le utilizăm împreună cu API-ul pentru plugin-uri.

Începe cu o `funcţie` care primește obiectul [`babel`](https://github.com/babel/babel/tree/master/packages/babel-core) curent.

```js
export default function(babel) {
  // plugin contents
}
```

Deoarece îl veţi folosi foarte des, probabil doriți să pasați doar `babel.types` astfel:

```js
export default function({ types: t }) {
  // plugin contents
}
```

Apoi, veţi returna un obiect cu o proprietate `visitor` care este principalul vizitator pentru plugin.

```js
export default function({ types: t }) {
  return {
    visitor: {
      // visitor contents
    }
  };
};
```

Fiecare funcţie în vizitator primește 2 argumente: ` path ` şi ` state `

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

Să scriem un plug-in rapid pentru a scoate în evidenţă modul în care funcţionează. Acesta este codul nostru sursă:

```js
foo === bar;
```

Sau în forma AST:

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

Vom începe prin adăugarea unei metode vizitator `BinaryExpression`.

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

Apoi să filtrăm doar token-urile `BinaryExpression` care folosesc operatorul `===`.

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

Acum să înlocuim proprietatea `left` cu un nou identificator:

```js
BinaryExpression(path) {
  if (path.node.operator !== "===") {
    return;
  }

  path.node.left = t.identifier("sebmck");
  // ...
}
```

În cazul în care vom rula acest plugin, ar rezulta:

```js
sebmck === bar;
```

Acum să înlocuim si proprietatea `right`.

```js
BinaryExpression(path) {
  if (path.node.operator !== "===") {
    return;
  }

  path.node.left = t.identifier("sebmck");
  path.node.right = t.identifier("dork");
}
```

Ceea ce conduce la rezultatul nostru final:

```js
sebmck === dork;
```

Super mișto! Primul nostru plugin pentru Babel.

* * *

# <a id="toc-transformation-operations"></a>Operații de Transformare

## <a id="toc-visiting"></a>Vizitare (Visiting)

### <a id="toc-get-the-path-of-a-sub-node"></a>Aflarea căii unui sub-nod

Pentru a accesa proprietatea unui nod AST în mod normal se accesează nodul şi apoi proprietatea. `path.node.property`

```js
// the BinaryExpression AST node has properties: `left`, `right`, `operator`
BinaryExpression(path) {
  path.node.left;
  path.node.right;
  path.node.operator;
}
```

În cazul în care aveţi nevoie să accesați calea proprietății, utilizaţi metoda `get` a traseului, pasându-i numele proprietății.

```js
BinaryExpression(path) {
  path.get('left');
}
Program(path) {
  path.get('body.0');
}
```

### <a id="toc-check-if-a-node-is-a-certain-type"></a>Verificare dacă un nod este de un anumit tip

Dacă doriţi să verificaţi de ce tip este un anumit nod, modul preferat de a face acest lucru este:

```js
BinaryExpression(path) {
  if (t.isIdentifier(path.node.left)) {
    // ...
  }
}
```

De asemenea, puteţi face o verificare superficială pentru proprietăţile acelui nod:

```js
BinaryExpression(path) {
  if (t.isIdentifier(path.node.left, { name: "n" })) {
    // ...
  }
}
```

Aceasta este echivalentă cu:

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

### <a id="toc-check-if-a-path-is-a-certain-type"></a>Verificare dacă un nod este de un anumit tip

Un traseu are aceleași metode de verificare a tipului unui nod:

```js
BinaryExpression(path) {
  if (path.get('left').isIdentifier({ name: "n" })) {
    // ...
  }
}
```

este echivalent cu a face:

```js
BinaryExpression(path) {
  if (t.isIdentifier(path.node.left, { name: "n" })) {
    // ...
  }
}
```

### <a id="toc-check-if-an-identifier-is-referenced"></a>Verificare dacă un identificator are referință

```js
Identifier(path) {
  if (path.isReferencedIdentifier()) {
    // ...
  }
}
```

Alternativ:

```js
Identifier(path) {
  if (t.isReferenced(path.node, path.parent)) {
    // ...
  }
}
```

### <a id="toc-find-a-specific-parent-path"></a>Aflarea căii unui anumit părinte

Uneori va trebui să traversați arborele în sus, până când este îndeplinită o condiţie.

Apelați `callback`-ul cu `NodePath`-ul tuturor părinţii. Când `calback`-ul returnează o valoare adevărată, vom returna acel `NodePath`.

```js
path.findParent((path) => path.isObjectExpression());
```

În cazul în care traseul curent trebuie și el inclus:

```js
path.find((path) => path.isObjectExpression());
```

Găseşte cea mai apropiată funcție sau program părinte:

```js
path.getFunctionParent();
```

Traversați arborele în sus, până când găsim un nod părinte în listă

```js
path.getStatementParent();
```

### <a id="toc-get-sibling-paths"></a>Aflarea traseelor nodurilor de același nivel

În cazul în care o cale dintr-o listă, ca în corpul unui ` Function ` / ` Program `, acesta va avea "fraţi".

  * Verificaţi dacă un traseu este parte dintr-o listă cu `path.inList`
  * Puteţi obţine fraţii din jur cu `path.getSibling(index)`,
  * Indicele traseului curent în containerul cu `path.key`,
  * Containerului traseului (o serie cu toate traseele nodurilor frați) cu `path.container`
  * Obţine numele cheii containerului listei cu `path.listKey`

> Aceste API-uri sunt utilizate în plugin-ul [transform-merge-sibling-variables](https://github.com/babel/babili/blob/master/packages/babel-plugin-transform-merge-sibling-variables/src/index.js) utilizat în [babel-minify](https://github.com/babel/babili).

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

### <a id="toc-stopping-traversal"></a>Oprirea traversării

Dacă plugin-ul dumneavoastră trebuie să-și oprească execuția la un anumit moment, cea mai simplă abordare este să returnați devreme.

```js
BinaryExpression(path) {
  if (path.node.operator !== '**') return;
}
```

Dacă faceți o sub-traversare într-un traseu de nivel superior, puteţi folosi 2 metode oferite de API:

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

## <a id="toc-manipulation"></a>Manipulare

### <a id="toc-replacing-a-node"></a>Înlocuirea unui nod

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

### <a id="toc-replacing-a-node-with-multiple-nodes"></a>Înlocuirea unui nod cu mai multe noduri

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

> **Notă:** Când se înlocuieşte o expresie cu mai multe noduri, acestea trebuie să fie declaraţii. Acest lucru este necesar deoarece Babel utilizează euristică pe scară largă la înlocuirea nodurilor, ceea ce înseamnă că puteţi face unele transformări destul de complexe, care altfel ar fi extrem de detaliate.

### <a id="toc-replacing-a-node-with-a-source-string"></a>Înlocuirea unui nod cu un șir de caractere sursă

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

> **Notă:** Nu este recomandat să utilizaţi acest API dacă nu aveți de a face cu șiruri de caractere sursă dinamice, altfel este mult mai eficient pentru a analiza codul în afara vizitatorului.

### <a id="toc-inserting-a-sibling-node"></a>Inserarea unui nod pe același nivel

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

> **Notă:** Acesta ar trebui să fie întotdeauna o declaraţie sau o serie de declaraţii. Aceasta utilizează aceleaşi euristici menţionate în [Înlocuirea unui nod cu mai multe noduri](#replacing-a-node-with-multiple-nodes).

### <a id="toc-inserting-into-a-container"></a>Inserarea într-un container

Dacă doriţi să inseraţi într-o proprietate de nod AST ca asta este un array la fel ca `body`. Este similar cu `insertBefore` / `insertAfter` fiind nevoie doar de a specifica `listKey`, care este de obicei `body`.

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

### <a id="toc-removing-a-node"></a>Ștergerea unui nod

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

### <a id="toc-replacing-a-parent"></a>Înlocuirea unui părinte

Doar apelați `replaceWith` cu parentPath: `path.parentPath`

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

### <a id="toc-removing-a-parent"></a>Ștergerea unui părinte

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

## <a id="toc-scope"></a>Domeniu (Scope)

### <a id="toc-checking-if-a-local-variable-is-bound"></a>Verificare dacă o variabilă locală este legată

```js
FunctionDeclaration(path) {
  if (path.scope.hasBinding("n")) {
    // ...
  }
}
```

Aceasta va parcurge arborele şi va căuta acea legătură anume.

Puteţi verifica și dacă un domeniu are o legătură proprie (**own**):

```js
FunctionDeclaration(path) {
  if (path.scope.hasOwnBinding("n")) {
    // ...
  }
}
```

### <a id="toc-generating-a-uid"></a>Generarea unui UID

Următorul cod va genera un identificator fără coliziuni cu nicio variabilă definită local.

```js
FunctionDeclaration(path) {
  path.scope.generateUidIdentifier("uid");
  // Node { type: "Identifier", name: "_uid" }
  path.scope.generateUidIdentifier("uid");
  // Node { type: "Identifier", name: "_uid2" }
}
```

### <a id="toc-pushing-a-variable-declaration-to-a-parent-scope"></a>Mutarea unei declarații de variabilă într-un domeniu părinte

Uneori, poate doriţi să mutați un `VariableDeclaration`, pentru a-i putea asocia o valoare.

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

### <a id="toc-rename-a-binding-and-its-references"></a>Redenumirea unei legături și a referințelor sale

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

Alternativ, puteţi redenumi o legătură cu un identificator unic generat:

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

# <a id="toc-plugin-options"></a>Opțiuni de plugin

Dacă doriţi să lăsați utilizatorii să particularizeze comportamentul plugin-ul vostru Babel, puteţi accepta opţiuni de plugin specifice, pe care utilizatorii le pot specifica în felul următor:

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

Aceste opţiuni sunt pasate apoi vizitatorilor plugin-ului prin obiectul `state`:

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

Aceste opţiuni sunt specifice plugin-ului şi nu puteţi accesa opţiuni din alte plugin-uri.

## <a id="toc-pre-and-post-in-plugins"></a> Pre şi Post în plugin-uri

Plugin-urile pot avea funcţii care sunt rulate înainte sau după. Ele pot fi folosite în scopuri de instalare sau curăţare/analiză.

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

## <a id="toc-enabling-syntax-in-plugins"></a> Activarea Syntax în plugin-uri

Plugin-urile pot activa [plugin-uri Babilon](https://github.com/babel/babylon#plugins), astfel încât utilizatorii nu trebuie să le instaleze/activeze. Acest lucru previne erori de interpretare în lipsa moştenirii plugin-ului de sintaxă.

```js
export default function({ types: t }) {
  return {
    inherits: require("babel-plugin-syntax-jsx")
  };
}
```

## <a id="toc-throwing-a-syntax-error"></a> Aruncarea unei Erori de Sintaxă

Dacă doriţi să aruncați o eroare cu babel-code-frame și un mesaj:

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

Eroarea arată așa:

    file.js: Error message here
       7 |
       8 | let tips = [
    >  9 |   "Click on any AST node with a '+' to expand it",
         |   ^
      10 |
      11 |   "Hovering over a node highlights the \
      12 |    corresponding part in the source code",
    

* * *

# <a id="toc-building-nodes"></a>Construirea nodurilor

Când scrieţi transformări veţi dori adesea să construiți unele noduri pentru a le insera în AST. Aşa cum am menţionat anterior, puteţi face acest lucru folosind metodele [builder](#builder) din pachetul [`babel-types`](#babel-types).

Numele metodei pentru un constructor este pur şi simplu numele tipului de nod pe care doriţi să-l construiți cu excepţia că prima literă trebuie sa fie mică. De exemplu dacă doriți să construiți `MemberExpression` ar trebui să utilizaţi `t.memberExpression(...)`.

Argumentele acestor constructori sunt stabilite prin definiţia nodului. În momentul de față se lucrează pentru a genera documentaţie uşor de citit pentru definiţii, dar pentru moment toate pot fi găsite [aici](https://github.com/babel/babel/tree/master/packages/babel-types/src/definitions).

O definiţie de nod arată în felul următor:

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

Aici puteţi vedea toate informaţiile despre acest tip de nod, inclusiv modul de construcție, traversare şi validare.

Uitându-ne la proprietatea `builder`, putem vedea 3 argumente care vor fi necesare pentru a apela metoda constructor (`t.memberExpression`).

```js
builder: ["object", "property", "computed"],
```

> Reţineţi că, uneori, există mai multe proprietăţi care le puteți particulariza, decât cele conținute în seria constructorului (`builder`). Acest lucru se întâmplă pentru a evita prea multe argumente pe constructor. În aceste cazuri, trebuie să setaţi proprietăţile manual. Un exemplu este [`ClassMethod`](https://github.com/babel/babel/blob/bbd14f88c4eea88fa584dd877759dd6b900bf35e/packages/babel-types/src/definitions/es2015.js#L238-L276).

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

Puteţi vedea validarea pentru argumentele constructorului cu obiectul `fields`.

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

Puteţi vedea că `object` trebuie să fie `Expression`, `property` trebuie să fie `Expression` sau `Identifier` depinzând dacă expresia membru este calculată (`computed`) sau nu, iar `computed` este pur şi simplu un boolean care implicit este `false`.

Aşadar putem construi un `MemberExpression` în felul următor:

```js
t.memberExpression(
  t.identifier('object'),
  t.identifier('property')
  // `computed` is optional
);
```

Ceea ce va rezulta în:

```js
object.property
```

Cu toate acestea, am spus că `object` să fie `Expression`, așadar de ce `Identifier` este valid?

Ei bine, dacă ne uităm la definiţia pentru `Identifier` putem vedea că are o proprietate `aliases` care declară că este, de asemenea, o expresie.

```js
aliases: ["Expression", "LVal"],
```

Așadar, din moment ce `MemberExpression` este de tip `Expression`, l-am putea seta ca un `object` pentru alt `MemberExpression`:

```js
t.memberExpression(
  t.memberExpression(
    t.identifier('member'),
    t.identifier('expression')
  ),
  t.identifier('property')
)
```

Ceea ce va rezulta în:

```js
member.expression.property
```

Este foarte puţin probabil că veți memora vreodată semnăturile metodei constructor pentru fiecare tip de nod. Așadar, ar trebui să vă rezervați ceva timp să înţelegeți cum sunt generate acestea din definiţiile nodului.

Puteţi găsi toate [definiţiile aici](https://github.com/babel/babel/tree/master/packages/babel-types/src/definitions) şi le puteţi vedea [documentate aici](https://github.com/babel/babel/blob/master/doc/ast/spec.md)

* * *

# <a id="toc-best-practices"></a>Practici preferate

## <a id="toc-create-helper-builders-and-checkers"></a> Crearea de funcții ajutătoare Constructor şi Verificator

Este destul de simplu pentru a extrage anumite verificări (dacă un nod are un anumit tip) în funcții separate de ajutor, precum şi extragerea de funcții ajutoare pentru tipuri specifice de nod.

```js
function isAssignment(node) {
  return node && node.operator === opts.operator + "=";
}

function buildAssignment(left, right) {
  return t.assignmentExpression("=", left, right);
}
```

## <a id="toc-avoid-traversing-the-ast-as-much-as-possible"></a>Evitați traversarea AST pe cât posibil

Traversarea AST este scumpă, şi este uşor să traversați accidental AST mai mult decât este necesar. Acest lucru ar putea însemna mii daca nu zeci de mii de operaţiuni suplimentare.

Babel optimizează acest lucru cât mai mult posibil, prin îmbinarea vizitatorilor împreună, dacă este posibil, pentru a face totul într-o singură traversare.

### <a id="toc-merge-visitors-whenever-possible"></a>Îmbinarea vizitatorilor ori de câte ori este posibil

Când scrieţi vizitatori, poate fi tentant să apelați `path.traverse` în mai multe locuri unde sunt necesare în mod logic.

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

Cu toate acestea, este mult mai bine să scrieți toate acestea ca un vizitator unic care este rulat doar o singură dată. Altfel veți traversa acelaşi arbore mai multe ori pentru niciun motiv.

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

### <a id="toc-do-not-traverse-when-manual-lookup-will-do"></a>Evitați traversarea când o căutare manuală este suficientă

De asemenea, poate fi tentant să apelați `path.traverse` atunci când căutați un anumit tip de nod.

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

Așadar, în cazul în care căutați ceva specific, este o şansă bună să gasiți nodurile respective printr-o căutare manuală, fără a efectua vreo traversare costisitoare.

```js
const MyVisitor = {
  FunctionDeclaration(path) {
    path.node.params.forEach(function() {
      // ...
    });
  }
};
```

## <a id="toc-optimizing-nested-visitors"></a>Optimizarea vizitatorilor imbricați

Atunci când aveți vizitatori imbricați, ar putea avea mai mult sens să-i scrieți imbricat și în codul dumneavoastră.

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

Cu toate acestea, acest lucru creează un nou obiect de vizitator de fiecare dată când este chemat `FunctionDeclaration()`. Acest lucru poate fi costisitor, deoarece Babel face unele procesări de fiecare dată când un obiect vizitator nou este pasat (cum ar fi desfacerea cheilor care conţin mai multe tipuri, validarea şi ajustarea structurii obiectului). Deoarece Babel stochează fanioane pe obiectele vizitator care indică faptul că acesta a efectuat deja această transformare, este mai bine pentru a stoca vizitatorul într-o variabilă şi pasarea aceluiași obiect de fiecare dată.

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

Dacă aveţi nevoie de stare în cadrul vizitatorilor imbricați, astfel:

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

Puteţi să-l pasați ca stare metodei `traverse()` şi să aveți acces la ea pe obiectul `this` al vizitatorului.

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

## <a id="toc-being-aware-of-nested-structures"></a>Atenție la structuri imbricate

Uneori când ne gândim la o transformare, am putea uita că structura poate fi imbricată.

De exemplu, imaginaţi-vă că dorim să căutăm `constructor` `ClassMethod` din `Foo` `ClassDeclaration`.

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

Putem ușor ignora faptul că clasele pot fi imbricate şi folosind traversarea mai sus ne vom lovi de un `constructor` imbricat, precum:

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

## <a id="toc-unit-testing"></a>Testarea Unitara

Există câteva moduri de bază pentru a testa plugin-uri babel: teste de imagine, teste de AST şi teste de execuție. Vom folosi [jest](http://facebook.github.io/jest/) pentru acest exemplu deoarece suportă implicit teste de imagine. Exemplul creat aici este găzduit în [acest repo](https://github.com/brigand/babel-plugin-testing-example).

În primul rând avem nevoie de un plugin de babel, pe care-l vom pune în src/index.js.

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

### Teste de imagine

Apoi, instalăm dependenţele noastre cu `npm install --save-dev babel-core jest`, şi apoi putem începe scrierea primului nostru test: imaginea. Testele de imagine ne permit să inspectăm vizual rezultatul plug-in-ului babel. Îi pasăm date de intrare, îi spunem să creeze imaginea rezultatului şi să o salveaze într-un fişier. Adăugăm imaginile în git. Acest lucru ne permite să vedem atunci când este afectat rezultatul oricăruia dintre cazurile noastre de testare. Deasemenea, ne arată și diferența dintre cele 2 variante în Pull Requests. Desigur, ai putea face acest lucru cu orice framework de testare, dar cu jest actualizarea imaginilor este foarte ușoară: `jest -u`.

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

Codul de mai sus ne creează un fişier de imagine în `src/__tests__/__snapshots__/index-test.js.snap`.

```js
exports[`test works 1`] = `
"
var bar = 1;
if (bar) console.log(bar);"
`;
```

Dacă vom schimba din 'bar' în 'baz' plugin-ul şi rulăm jest din nou, vom obține acest lucru:

```diff
Valoarea primită nu este identică cu cea salvată 1.

    - Snapshot
    + Received

    @@ -1,3 +1,3 @@
     "
    -var bar = 1;
    -if (bar) console.log(bar);"
    +var baz = 1;
    +if (baz) console.log(baz);"
```

Putem vedea cum modificarea noastră în codul de plug-in a afectat rezultatul plugin-ului nostru, iar în cazul în care noul rezultat este ceea ce ne dorim, putem rula `jest -u` pentru a actualiza imaginea salvată.

### Teste AST

În plus faţă de testarea de imagine, putem inspecta manual și AST-ul. Acesta este un exemplu simplu, dar fragil. Pentru situaţii reale, aţi putea folosi babel-traverse. Acest lucru vă permite să specificaţi un obiect cu o cheie de `vizitator`, exact cum utilizaţi pentru plugin-ul în sine.

```js
it('contains baz', () => {
  const {ast} = babel.transform(example, {plugins: [plugin]});
  const program = ast.program;
  const declaration = program.body[0].declarations[0];
  assert.equal(declaration.id.name, 'baz');
  // or babelTraverse(program, {visitor: ...})
});
```

### Teste de Execuție

Aici vom transforma codul şi apoi vom evalua dacă se comportă corect. Reţineţi că nu vom utiliza `assert` în test. Acest lucru asigură faptul că dacă plugin-ul nostru efectuează chestii ciudate, ca de exemplu eliminarea linie assert din greșeală, testul va eșua.

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

Babel core foloseşte o [abordare similară](https://github.com/babel/babel/blob/7.0/CONTRIBUTING.md#writing-tests) a testelor de imagine şi de execuție.

### [`babel-plugin-tester`](https://github.com/kentcdodds/babel-plugin-tester)

Acest pachet ușurează testarea plugin-urilor. Dacă sunteţi familiarizat cu [RuleTester](http://eslint.org/docs/developer-guide/working-with-rules#rule-unit-tests) din ESLint, acest lucru ar trebui să vă fie cunoscut. Puteți urmări [documentația](https://github.com/kentcdodds/babel-plugin-tester/blob/master/README.md) pentru lista completă de posibilități, dar iată un exemplu simplu:

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

> ***Pentru actualizări, urmăriţi [@thejameskyle](https://twitter.com/thejameskyle) şi [@babeljs](https://twitter.com/babeljs) pe Twitter.***