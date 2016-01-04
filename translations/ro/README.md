# Manual pentru Plugin-uri Babel

Acest document descrie cum se pot crea [plugin-uri](https://babeljs.io/docs/advanced/plugins/) pentru [Babel](https://babeljs.io).

În cazul în care citiți într-o limbă diferită de engleză, este posibil ca unele secțiuni care nu au fost traduse incă, să le găsiți în engleză. Dacă doriți să contribuiți la traducerea acestui document, va trebui să folosiți Crowdin. Vă rugăm să citiți [ghidul de contribuție](/CONTRIBUTING.md) pentru mai multe informații.

[![cc-by-4.0](https://licensebuttons.net/l/by/4.0/80x15.png)](http://creativecommons.org/licenses/by/4.0/)

Mulțumim în mod special lui [@sebmck](https://github.com/sebmck/), [@hzoo](https://github.com/hzoo), [@jdalton](https://github.com/jdalton), [@abraithwaite](https://github.com/abraithwaite), [@robey](https://github.com/robey), și altora, pentru ajutorul extraordinar adus acestui document.

# Pachet Node

Puteți instala acest document folosing npm, în felul următor:

```sh
$ npm install -g babel-plugin-handbook
```

Acum veți avea comanda `babel-plugin-handbook` care va deschide acest document în `$PAGER`. Ca alternativă, puteti continua să citiți acest document, așa cum o faceți în acest moment.

# Traduceri

  * [English](/README.md)
  * [Afrikaans](/translations/af/README.md)
  * [العربية](/translations/ar/README.md)
  * [Català](/translations/ca/README.md)
  * [Čeština](/translations/cs/README.md)
  * [Danske](/translations/da/README.md)
  * [Deutsch](/translations/de/README.md)
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
  * [中文](/translations/zh-CN/README.md)
  * [繁體中文](/translations/zh-TW/README.md)

**[Solicită o altă traducere](https://github.com/thejameskyle/babel-plugin-handbook/issues/new?title=Translation%20Request:%20[Please%20enter%20language%20here]&body=I%20am%20able%20to%20translate%20this%20language%20[yes/no])**

În cazul în care citiți o traducere din limba engleză, veți găsi cuvinte în engleză care se referă la concepte de programare. Daca acestea ar fi traduse în alte limbi s-ar pierde consistența și fluența în citire. În anumite cazuri veți găsi traducerea literară urmată de termenul în engleză între paranteze `()`. De exemplu: Arbori Abstracți de Sintaxă (ASTs).

# Cuprins

  * [Introducere](#introduction)
  * [Concepte de bază](#basics) 
      * [ASTs](#asts)
      * [Etapele Babel](#stages-of-babel)
      * [Analiză](#parse) 
          * [Analiză Lexicală](#lexical-analysis)
          * [Analiză Sintactică](#syntactic-analysis)
      * [Transformare](#transform)
      * [Generare](#generate)
      * [Traversare](#traversal)
      * [Vizitatori (Visitors)](#visitors)
      * [Trasee (Paths)](#paths) 
          * [Trasee în Vizitatori (Paths in Visitors)](#paths-in-visitors)
      * [Stare](#state)
      * [Domenii (Scopes)](#scopes) 
          * [Legături (Bindings)](#bindings)
  * [API](#api) 
      * [babylon](#babylon)
      * [babel-traverse](#babel-traverse)
      * [babel-types](#babel-types)
      * [Definiții](#definitions)
      * [Constructori](#builders)
      * [Validatori](#validators)
      * [Convertori](#converters)
      * [babel-generator](#babel-generator)
      * [babel-template](#babel-template)
  * [Scrierea primului Plugin Babel](#writing-your-first-babel-plugin)
  * [Operații de Transformare](#transformation-operations) 
      * [Vizitare (Visiting)](#visiting)
      * [Verificare dacă un nod este de un anumit tip](#check-if-a-node-is-a-certain-type)
      * [Verificare dacă un identificator are referință](#check-if-an-identifier-is-referenced)
      * [Manipulare](#manipulation)
      * [Înlocuirea unui nod](#replacing-a-node)
      * [Înlocuirea unui nod cu mai multe noduri](#replacing-a-node-with-multiple-nodes)
      * [Înlocuirea unui nod cu un șir de caractere sursă](#replacing-a-node-with-a-source-string)
      * [Inserarea unui nod pe același nivel](#inserting-a-sibling-node)
      * [Ștergerea unui nod](#removing-a-node)
      * [Înlocuirea unui părinte](#replacing-a-parent)
      * [Ștergerea unui părinte](#removing-a-parent)
      * [Domeniu (Scope)](#scope)
      * [Verificare dacă o variabilă locală este legată](#checking-if-a-local-variable-is-bound)
      * [Generarea unui UID](#generating-a-uid)
      * [Mutarea unei declarații de variabilă într-un domeniu părinte](#pushing-a-variable-declaration-to-a-parent-scope)
      * [Redenumirea unei legături și a referințelor sale](#rename-a-binding-and-its-references)
  * [Opțiuni de plugin](#plugin-options)
  * [Construirea nodurilor](#building-nodes)
  * [Practici preferate](#best-practices) 
      * [Evitați traversarea AST pe cât posibil](#avoid-traversing-the-ast-as-much-as-possible)
      * [Îmbinarea vizitatorilor ori de câte ori este posibil](#merge-visitors-whenever-possible)
      * [Evitați traversarea când o căutare manuală este suficientă](#do-not-traverse-when-manual-lookup-will-do)
      * [Optimizarea vizitatorilor imbricați](#optimizing-nested-visitors)
      * [Atenție la structuri imbricate](#being-aware-of-nested-structures)

# Introducere

Babel este un compilator generic multi-scop pentru JavaScript. Mai mult decât atât, este o colecție de module care pot fi utilizate pentru diverse tipuri de analiză statică.

> Analiza statică este procesul de a analiza cod fără a-l executa. (Analiza de cod, în timp ce se execută este cunoscută ca analiză dinamică). Scopul analizei statice variază foarte mult. Poate fi folosită pentru validare (linting), compilare, evidențiere (highlighting), transformare, optimizare, minimizare, și multe altele.

Puteți utiliza Babel pentru a construi diverse tipuri de instrumente care vă pot ajuta să fiți mai productivi și pentru a scrie programe mai bune.

# Concepte de bază

Babel este un compilator de JavaScript, mai exact un compilator sursă-la-sursă, deseori numit un "transpiler". Asta înseamnă că daca îi pasezi cod JavaScript, Babel modifică codul, și generează cod nou.

## ASTs

Fiecare dintre acești pași implică crearea sau lucrul cu un [Arbore Abstract de Sintaxa](https://en.wikipedia.org/wiki/Abstract_syntax_tree) sau AST.

> Babel folosește un AST modificat din [ESTree](https://github.com/estree/estree), cu specificațiile interne aflate [aici](https://github.com/babel/babel/blob/master/doc/ast/spec.md).

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

## Etapele Babel

Cele trei etape principale ale Babel sunt **analiză**, **transformare**, **generare**.

### Analiză

Etapa de **analiză**, primeste codul şi produce AST-ul. Există două faze ale analizei în Babel: [**Analiza lexicală**](https://en.wikipedia.org/wiki/Lexical_analysis) şi [**Analiza sintactică**](https://en.wikipedia.org/wiki/Parsing).

#### Analiză Lexicală

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

Fiecare `type` au un set de proprietăţi care descrie token-ul:

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

#### Analiză Sintactică

Analiza sintactică primește un flux de token-uri şi-l transformă într-o reprezentare AST. Folosind informaţiile din token-uri, această fază le va reformata ca un AST care reprezintă structura codului într-un mod care este mai uşor de utilizat.

### Transformare

Etapa de [Transformare](https://en.wikipedia.org/wiki/Program_transformation) primește un AST pe care-l traversează, adăugă, actualizează şi sterge noduri. Această etapă este de departe cea mai complexă din Babel sau din orice alt compilator. Aici este locul în care plugin-uri operează aşadar va fi subiectul majorității capitolelor din acest manual. Nu vom intra prea adânc în detalii pentru moment.

### Generare

Etapa de [generare de cod](https://en.wikipedia.org/wiki/Code_generation_(compiler)) primește AST-ul final şi-l transformă înapoi într-un şir de cod, creând şi [source maps](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/).

Generarea de cod este destul de simplă: se traversează AST-ul și se construiește un şir de caractere care reprezintă codul transformat.

## Traversare

Atunci când doriţi să transformați un AST trebuie să-l [traversați](https://en.wikipedia.org/wiki/Tree_traversal) recursiv.

Să zicem ca avem tipul `FunctionDeclaration`. El are câteva proprietăți: `id`, `params` si `body`. Fiecare dintre ele au noduri imbricate.

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

Vom începe cu `FunctionDeclaration` şi ştim proprietăţile sale interne, astfel încât vom vizita fiecare proprietate şi copiii lor în ordine.

Apoi vom continua cu `id`, care este un `Identificator`. `Identificatorii` nu au proprietăţi copil astfel încât putem merge mai departe.

Urmează `params`, care este o matrice de noduri, așadar vom vizita pe fiecare dintre ele. În acest caz este un singur nod care este de asemenea un `Identificator` aşadar putem merge mai departe.

Apoi ajungem la `body`, care este un `BlockStatement` cu o proprietate `body`, care este o serie de noduri, aşa că le vom vizita pe fiecare dintre ele.

Singurul element de aici este un nod `ReturnStatement`, care are un `argument`, vom merge la `argument` unde găsim un `BinaryExpression`.

`BinaryExpression` conține un `operator`, un `left`, şi un `right`. "Operator" nu este un nod, doar o valoare, așadar o ignorăm, şi în schimb vizităm doar `left` şi `right`.

Acest proces de traversare se întâmplă de-a lungul etapei de transformare Babel.

### Vizitatori (Visitors)

Atunci când vorbim despre "a merge" la un nod, ne referim de fapt la a-l **vizita**. Motivul pentru care vom folosi acest termen este pentru că există acest concept de [**vizitator**](https://en.wikipedia.org/wiki/Visitor_pattern).

Vizitatorii sunt un model folosit în traversarea AST traversare, utilizat în diverse limbaje. În termeni simpli, aceștia sunt obiecte cu metode definite pentru a accepta anumite tipuri de nod dintr-un AST. Asta poate fi putin abstract, așadar să luăm un exemplu.

```js
const MyVisitor = {
  Identifier() {
    console.log("Called!");
  }
};
```

> **Notă:** `Identifier() { ... }` este o prescurtare pentru `Identifier: {enter() { ... }}`.

Aceasta este un vizitator simplu care atunci când este utilizat în timpul traversării va apela metoda `Identifier()` pentru fiecare `Identificator` din arbore.

Așadar cu acest cod metoda `Identifier()` va fi apelată de patru ori cu fiecare `Identificator` (inclusiv `square`).

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

### Trasee (Paths)

AST o are în general multe Noduri, dar cum se relaționează unul la altul? Am putea avea un singur obiect mutabil gigant, care să-l manipulăm şi să avem acces deplin la el, sau putem simplifica acest lucru cu Trasee (**Paths**).

Un Traseu (**Path**) este o reprezentare de obiect a legăturii între două noduri.

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

#### Trasee în Vizitatori (Paths in Visitors)

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
Visiting: a
Visiting: b
Visiting: c
```

### Stare

Starea este duşmanul transformării AST-ului. Starea îți va crea mari probleme şi ipotezele tale despre stare vor fi aproape întotdeauna greşite de o sintaxă care nu ai luat-o în considerare.

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

O modalitate mai bună de a rezolva asta este folosind recursivitate. Așadar, hai să facem ca într-un film de Christopher Nolan şi să punem un vizitator în interiorul unui vizitator.

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

Desigur, acesta este un exemplu teoretic, insă demonstrează cum să eliminăm starea globală din vizitatori.

### Domenii (Scopes)

În continuare vom introduce conceptul de [**domeniu**](https://en.wikipedia.org/wiki/Scope_(computer_science)). JavaScript utilizează [domenii lexicale](https://en.wikipedia.org/wiki/Scope_(computer_science)#Lexical_scoping_vs._dynamic_scoping), care este o structură de arbore, în care fiecare bloc crează un nou domeniu.

```js
// global scope

function scopeOne() {
  // scope 1

  function scopeTwo() {
    // scope 2
  }
}
```

Ori de câte ori creaţi o referinţă în JavaScript, fie că este o variabilă, funcție, clasă, parametru, import, eticheta, etc., aceasta aparţine actualului domeniu.

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

Crearea unui domeniu nou implică pasarea unui traseu şi a unui domeniu părinte. Apoi, în timpul procesului de traversare se colectează toate referințele ("legături") din acel domeniu.

Odată ce am făcut acest lucru, există tot felul de metode ce le putem utiliza pe domenii. Însă le vom examina mai târziu.

#### Legături (Bindings)

Toate referinţele aparţin unui anumit domeniu; această relaţie este cunoscut ca o **legătură**.

```js
function scopeOnce() {
  var ref = "This is a binding";

  ref; // This is a reference to a binding

  function scopeTwo() {
    ref; // This is a reference to a binding from a lower scope
  }
}
```

O singură legătură arată astfel:

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

Cu aceste informaţii putem găsi toate referințele la o legătură, putem vedea ce tip de legătură este (parametru, declaraţie etc.), putem căuta cărui domeniu îi aparține, sau să-i copiem identificatorul. Putem chiar să aflăm dacă este constantă şi, dacă nu, putem afla ce trasee o determină să fie variabilă, nu constantă.

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

# API

Babel este de fapt o colecţie de module. În această secţiune vom trece prin cele mai importante, explicând la ce ajută şi cum se utilizează.

> Notă: Aceasta nu este un înlocuitor pentru documentaţia detaliată a API-ului, care va fi disponibilă în altă parte în scurt timp.

## [`babylon`](https://github.com/babel/babel/tree/master/packages/babylon)

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

Pentru a vedea o listă completă de plugin-uri, examinați [Babylon README](https://github.com/babel/babel/blob/master/packages/babylon/README.md#plugins).

## [`babel-traverse`](https://github.com/babel/babel/tree/master/packages/babel-traverse)

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

## [`babel-types`](https://github.com/babel/babel/tree/master/packages/babel-types)

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

### Definiții

Babel Types conține definiţii pentru fiecare tip de nod, și informaţii cu privire la ce proprietăţile aparţin cui, ce valori sunt valide, cum se construiește un nod, cum ar trebui traversat nodul şi pseudonime ale nodului.

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

### Constructori

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

Constructorii, de asemenea, vor valida nodurile pe care le crează şi arunca erori descriptive dacă sunt folosiți necorespunzător. Ceea ce ne conduce la următorul tip de metodă.

### Validatori

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

### Convertori

> [WIP] în lucru

## [`babel-generator`](https://github.com/babel/babel/tree/master/packages/babel-generator)

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

generate(ast, null, code);
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

## [`babel-template`](https://github.com/babel/babel/tree/master/packages/babel-template)

Babel Template este un alt modul micuț dar incredibil de util. Vă permite să scrieți şiruri de cod cu substituenţi care îi puteţi folosi în loc să construiți manual un AST uriaș.

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

# Scrierea primului Plugin Babel

Acum că sunteţi familiarizați cu toate elementele de bază din Babel, haideţi să le utilizăm împreună cu API-ul pentru plugin-uri.

Să începem cu o `funcţie` care primește obiectu `babel`.

```js
export default function(babel) {
  // plugin contents
}
```

Deoarece veţi folosi foarte des, probabil doriți sa pasați doar `babel.types` astfel:

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

În cazul în care vom rula acest plugin ar rezulta:

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

Super mișto! Primul nostru plug-in pentru Babel.

* * *

# Operații de Transformare

## Vizitare (Visiting)

### Verificare dacă un nod este de un anumit tip

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

### Verificare dacă un identificator are referință

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

## Manipulare

### Înlocuirea unui nod

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

### Înlocuirea unui nod cu mai multe noduri

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

### Înlocuirea unui nod cu un șir de caractere sursă

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

> **Notă:** Nu este recomandat să utilizaţi acest API daca nu aveți de a face cu șiruri de caractere sursă dinamice, altfel este mult mai eficient pentru a analiza codul în afara vizitatorului.

### Inserarea unui nod pe același nivel

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

### Ștergerea unui nod

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

### Înlocuirea unui părinte

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

### Ștergerea unui părinte

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

## Domeniu (Scope)

### Verificare dacă o variabilă locală este legată

```js
FunctionDeclaration(path) {
  if (path.scope.hasBinding("n")) {
    // ...
  }
}
```

Aceasta va parcurge arborele şi va căuta acea legatură anume.

Puteţi verifica și dacă un domeniu are o anumita legătura proprie (**own**):

```js
FunctionDeclaration(path) {
  if (path.scope.hasOwnBinding("n")) {
    // ...
  }
}
```

### Generarea unui UID

Următorul cod va genera un identificator care nu se ciocnește cu nicio variabilă definită local.

```js
FunctionDeclaration(path) {
  path.scope.generateUidIdentifier("uid");
  // Node { type: "Identifier", name: "_uid" }
  path.scope.generateUidIdentifier("uid");
  // Node { type: "Identifier", name: "_uid2" }
}
```

### Mutarea unei declarații de variabilă într-un domeniu părinte

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

### Redenumirea unei legături și a referințelor sale

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

Alternativ, puteţi redenumi o legătura cu un identificator unic generat:

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

# Opțiuni de plugin

Dacă doriţi să lasați utilizatorii să particularizeze comportamentul plugin-ul vostru Babel, puteţi accepta opţiuni de plugin specifice, pe care utilizatorii le pot specifica în felul următor:

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

* * *

# Construirea nodurilor

Când scrieţi transformări veţi dori adesea să construiți unele noduri pentru a le insera în AST. Aşa cum am menţionat anterior, puteţi face acest lucru folosind metodele constructor ([builder](#builder)) din pachetul [`babel-types`](#babel-types).

Numele metodei pentru un constructor este pur şi simplu numele tipului de nod pe care doriţi să-l construiți cu excepţia că prima literă trebuie sa fie mică. De exemplu dacă doriți să construiți `MemberExpression` ar trebui să utilizaţi `t.memberExpression(...)`.

Argumentele acestor constructori sunt hotărâte prin definiţia nodului. In momentul de față se lucrează pentru a genera documentaţie uşor de citit pentru definiţii, dar pentru moment toate pot fi găsite [aici](https://github.com/babel/babel/tree/master/packages/babel-types/src/definitions).

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

> Reţineţi că, uneori, există mai multe proprietăţi care le puteți particulariza, decât cele conținute in seria constructorului (`builder`). Aceasta este de a evita prea multe argumente pe constructor. În aceste cazuri, trebuie să setaţi proprietăţile manual. Un exemplu este [`ClassMethod`](https://github.com/babel/babel/blob/bbd14f88c4eea88fa584dd877759dd6b900bf35e/packages/babel-types/src/definitions/es2015.js#L238-L276).

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

Puteţi vedea că `object` trebuie să fie `Expression`, `property` trebuie să fie `Expression` sau `Identifier` în funcţie dacă expresia de membru este calculată (`computed`) sau nu şi `computed` este pur şi simplu un boolean care implicit este `false`.

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

# Practici preferate

> Voi lucra la această secţiune în următoarele săptămâni.

## Evitați traversarea AST pe cât posibil

Traversarea AST este scumpă, şi este uşor să traversați accidental AST mai mult decât este necesar. Acest lucru ar putea însemna mii daca nu zeci de mii de operaţiuni suplimentare.

Babel optimizează acest lucru cât mai mult posibil, prin îmbinarea vizitatorilor împreună, dacă este posibil, pentru a face totul într-o singură traversare.

### Îmbinarea vizitatorilor ori de câte ori este posibil

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

### Evitați traversarea când o căutare manuală este suficientă

De asemenea, poate fi tentant să apelați `path.traverse` atunci când cautați un anumit tip de nod.

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

## Optimizarea vizitatorilor imbricați

Atunci când aveți vizitatori imbricați, ar putea face mai mult sens să-i scrieți imbricat și în codul dumneavoastră.

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

Însă acest lucru creează un nou obiect vizitator de fiecare dată când `FunctionDeclaration()` este apelată, iar Babel trebuie să o spargă şi să o valideze de fiecare dată. Acest lucru poate fi costisitor, așadar este mai bine să declarați vizitatorul în afară.

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

## Atenție la structuri imbricate

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