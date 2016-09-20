# Babel Plugin Handbook

U dokumentu je objašnjeno kako se kreiraju [Babel](https://babeljs.io) [plaginovi](https://babeljs.io/docs/advanced/plugins/).

[![cc-by-4.0](https://licensebuttons.net/l/by/4.0/80x15.png)](http://creativecommons.org/licenses/by/4.0/)

This handbook is available in other languages, see the [README](/README.md) for a complete list.

# Sadržaj

  * [Uvod](#toc-introduction)
  * [Osnove](#toc-basics) 
      * [AST strukture](#toc-asts)
      * [Stanja pri kompajliranja (Stages of Babel)](#toc-stages-of-babel)
      * [Parsiranje](#toc-parse) 
          * [Leksička analiza (Lexical Analysis)](#toc-lexical-analysis)
          * [Analiza sintakse (Syntactic Analysis)](#toc-syntactic-analysis)
      * [Transformisanje (Transform)](#toc-transform)
      * [Generisanje (Generate)](#toc-generate)
      * [Prolazak (Traversal)](#toc-traversal)
      * [Posetioci (Visitors)](#toc-visitors)
      * [Putanje (paths)](#toc-paths) 
          * [Putanje u "posetiocima"](#toc-paths-in-visitors)
      * [Stanje (state)](#toc-state)
      * [Domeni (scopes)](#toc-scopes) 
          * [Vezivanje (bindings)](#toc-bindings)
  * [API](#toc-api) 
      * [babylon](#toc-babylon)
      * [babel-traverse](#toc-babel-traverse)
      * [babel-types](#toc-babel-types)
      * [Defincije](#toc-definitions)
      * [Gradioci (Builders)](#toc-builders)
      * [Validatori](#toc-validators)
      * [Konvertori](#toc-converters)
      * [babel-generator](#toc-babel-generator)
      * [babel-template](#toc-babel-template)
  * [Kreiranje vašeg prvog Babel plugina](#toc-writing-your-first-babel-plugin)
  * [Operacije transformisanja](#toc-transformation-operations) 
      * [Posećivanje (visiting)](#toc-visiting)
      * [Get the Path of Sub-Node](#toc-get-the-path-of-a-sub-node)
      * [Check if a node is a certain type](#toc-check-if-a-node-is-a-certain-type)
      * [Check if an identifier is referenced](#toc-check-if-an-identifier-is-referenced)
      * [Manipulacija](#toc-manipulation)
      * [Replacing a node](#toc-replacing-a-node)
      * [Replacing a node with multiple nodes](#toc-replacing-a-node-with-multiple-nodes)
      * [Replacing a node with a source string](#toc-replacing-a-node-with-a-source-string)
      * [Inserting a sibling node](#toc-inserting-a-sibling-node)
      * [Removing a node](#toc-removing-a-node)
      * [Replacing a parent](#toc-replacing-a-parent)
      * [Removing a parent](#toc-removing-a-parent)
      * [Domen](#toc-scope)
      * [Checking if a local variable is bound](#toc-checking-if-a-local-variable-is-bound)
      * [Generating a UID](#toc-generating-a-uid)
      * [Pushing a variable declaration to a parent scope](#toc-pushing-a-variable-declaration-to-a-parent-scope)
      * [Rename a binding and its references](#toc-rename-a-binding-and-its-references)
  * [Plagin opcije](#toc-plugin-options)
  * [Kreiranje čvorova](#toc-building-nodes)
  * [Praktični saveti](#toc-best-practices) 
      * [Izbegavajte prolazak kroz AST što je više moguće](#toc-avoid-traversing-the-ast-as-much-as-possible)
      * [Spajanje "posetioca" kad je to moguće](#toc-merge-visitors-whenever-possible)
      * [Izbegavajte prolaske kada može da se upotrebi ručno prolaženje (kroz čvorove)](#toc-do-not-traverse-when-manual-lookup-will-do)
      * [Optimizacija ugnežđenih "posetioca"](#toc-optimizing-nested-visitors)
      * [Obratite pažnju na ugnežđene strukture](#toc-being-aware-of-nested-structures)

# <a id="toc-introduction"></a>Uvod

Babel je generički višenamenski kompajler za JavaScript. Sastoji se od kolekcije modula koji se mogu koristiti u različitim vidovima statičke analize koda.

> Statička analiza je proces analiziranja koda bez njegovog izvršavanja. (Analiza koda prilikom njegovog izvršavanja se naziva dinamička analiza). Postoji veliki broj primena statičke analize koda. Može se koristiti za proveru stila i načina pisanja (linting), kompajliranje, predstavljanje sintakse jezika bojama (color highlighting), transformisanje koda, optimizacije, minifikacije i druge operacije.

Uz pomoć Babel-a možete napisati mnoštvo različitih tipova alatki koje mogu da se koriste da povećaju produktivnost i poboljšaju kvalitet pisanog koda.

> ***За будућа ажурирања, пратите [@thejameskyle](https://twitter.com/thejameskyle) на Твитеру.***

* * *

# <a id="toc-basics"></a>Osnove

Babel je JavaScript kompajler, tačnije kompajler iz koda u kod, što se najčešće naziva "transpiler". Drugim rečima, Babel može da modifikuje i da generiše potpuno novi kod na osnovu vašeg koda.

## <a id="toc-asts"></a>AST strukture

Svaki od koraka pri kompajliranju uključuje kreiranje ili korišćenje apstraktnog sintaksnog stabla [Abstract Syntax Tree](https://en.wikipedia.org/wiki/Abstract_syntax_tree) tj. AST.

> Babel za AST koristi modifikovanu verziju [ESTree](https://github.com/estree/estree), čija je osnovna specifikacija data [ovde](https://github.com/babel/babel/blob/master/doc/ast/spec.md).

```js
function square(n) {
  return n * n;
}
```

> Da biste stekli bolji osećaj u vezi sa strukturama koje koristi AST možete da pogledate [AST Explorer](http://astexplorer.net/). Da biste pogledali kod iz prethodnog primera u Ast Exploreru možete da odete na [ovaj](http://astexplorer.net/#/Z1exs6BWMq) link.

Kod iz primera može se predstaviti kao lista:

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

ili kao JavaScript objekt:

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

Svaki nivo AST strukture ima sličan oblik:

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

> Napomena: neki delovi objekta (properties) su izostavljeni radi lakšeg uočavanja trenutno bitnih delova strukture.

Struktura predstavljenja u prethodnim primerima se naziva **čvor** (node). AST može da se sastoji bilo od jednog, bilo od ogromnog broja čvorova (nodes). Zajedno, svi čvorovi opisuju sintaksu programa, pa datu strukturu možemo da se iskoristimo za statičku analizu.

Svaki čvor je predstavljen na sledeći način:

```typescript
interface Node {
  type: string;
}
```

Polje `type` je string koji sadrži tip objekta, odnosno čvora. (npr. `"FunctionDeclaration"`, `"Identifier"`, ili `"BinaryExpression"` - deklaracija fukcije, indetifikatora ili binarnog izraza/operacije). Svaki tipova čvora ima različitu dodatnu grupa podataka koji ga opisuju.

Za svaki čvor koji je generisan Babelom koriste se dodatni podaci koji sadrže informaciju o položaju čvora u originalnom kodu.

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

Polja (properties) `start`, `end`, `loc` se mogu naći u svakom pojedinačnom čvoru.

## <a id="toc-stages-of-babel"></a>Stanja pri kompajliranja (Stages of Babel)

Tri osnovna stanja kroz koje Babel prolazi su **parsiranje**, **transformisanje**, **generisanje**.

### <a id="toc-parse"></a>Parsiranje

U fazi **parsiranja**, kod se pretvara u AST strukturu. Parsiranje čine dve faze: [**Leksička analiza**](https://en.wikipedia.org/wiki/Lexical_analysis) (Lexical Analysis) i [**Analiza sintakse**](https://en.wikipedia.org/wiki/Parsing) (Syntactic Analysis).

#### <a id="toc-lexical-analysis"></a>Leksička analiza (Lexical Analysis)

U leksičkoj analizi delić koda se pretvara u niz **tokena**.

Tokene možete da zamislite kao linearan niz sačinjen od delova koji čine sintaksu jezika (npr. operatori ili ključne reči).

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

U svakom `tipu` imamo skup polja (properties) koje opisuju dati token:

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

Kao i u elementima AST strukture i ovde imamo polja `start`, `end`, and `loc`.

#### <a id="toc-syntactic-analysis"></a>Analiza sintakse (Syntactic Analysis)

Analiza sintakse koristi niz tokena i pretvara ih u AST formu. U ovoj fazi tokeni su, na osnovu informacija koje nose, restruktuirani u formu AST-a. Ovakva reprezentacija strukture koda je daleko jednostavnija za dalje procesiranje.

### <a id="toc-transform"></a>Transformisanje (Transform)

U stanju [transformisanja](https://en.wikipedia.org/wiki/Program_transformation) Babel prolazi kroz čvorove AST strukture i pri tom kreira nove, briše ili modifikuje postojeće čvorove. Ovo je daleko najsloženiji deo kroz koji prolazi bilo Babel bilo koji drugi kompajler. Plaginovi svoje procese obavljaju u ovom stanju pa će ovo stanje biti glavna tema u većem delu ovog priručnika. Zbog toga nećemo ulaziti duboko u detalje za sad.

### <a id="toc-generate"></a>Generisanje (Generate)

The [code generation](https://en.wikipedia.org/wiki/Code_generation_(compiler)) stage takes the final AST and turns it back into a string of code, also creating [source maps](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/).

Generisanje koda je prilično jednostavan proces: prolazi se kroz AST strukturu i ispišu stringovi koji predstavljaju transformisani kod.

## <a id="toc-traversal"></a>Prolazak (Traversal)

Pri transformaciji AST strukture potrebno je rekurzivno [proći kroz stablo](https://en.wikipedia.org/wiki/Tree_traversal) kojim je predstavljen.

Recimo za tip `FunctionDeclaration` je karakteristično nekoliko podataka: `id`, `params`, i `body`. Svaki od njih ima ugnežđene druge čvorove.

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

Polazimo od `FunctionDeclaration` i pošto znamo polja njegove unutrašnje strukture, prolazimo redom kroz svako od tih polja i sve njihove podstruture (children).

Zatim dolazimo do `id` koji predstavlja `identifikator` (Identifier). `Identifikatori` nemaju podstrukturu pa možemo da nastavimo dalje sa prolaskom.

Sledi `params` koji je predstaljen nizom čvorova pa ćemo da prođemo kroz svakog od njih. U ovom slučaju nailazimo samo na jedan čvor koji je takođe `identifikator` pa možemo da nastavimo dalje.

Tada nailazimo na `body` koji je tipa `BlockStatement` i ima polje `body` koje predstavlja niz čvorova pa ćemo da prođemo kroz svaki od članova niza.

Jedini član niza je tipa `ReturnStatement` koji ima čvor tipa `argument`. Prolazeći kroz njega nailazimo na čvor tipa `BinaryExpression`.

Struktura `BinaryExpression` ima polja `operator`, a `left`, i a `right`. Polje operator nije čvor nego primitivni tip, pa nastavljamo dalje prolazak kroz `left` i `right`.

Opisani proces prolaska se desava u stanju transformisanja (transform stage).

### <a id="toc-visitors"></a>Posetioci (Visitors)

Kada govorimo o "prolasku" kroz čvor, zapravo mislimo na njihovo **podsećivanje**. Ovaj termin se korisiti zato što postoji koncept [**visitora**](https://en.wikipedia.org/wiki/Visitor_pattern) (visitor).

Posetioci (visitors) su algoritam (pattern) koji se koristi u AST za prolaske u raznim jezicima. Jednostavno rečeno, radi se o objektima sa definisanim metodama za prihvaćanje određenog tipa nodova u stablu. Kako sam koncept deluje pomalo apstraktno, pogledaćemo jedan primer.

```js
const MyVisitor = {
  Identifier() {
    console.log("Called!");
  }
};
```

> **Napomena:** `Identifier() { ... }` je skraćeno zapisano `Identifier: { enter() { ... } }`.

Ovo je osnovni posetioc (visitor). Prilikom prolaska (traversal) se za svaki `Identifier` u stablu poziva metod `Identifier()`.

To znači da će, u datom primeru, metod `Identifier()` biti pozvan četiri puta za svaki `Identifier` (uključujući `square`).

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

Svi ovi pozivi se dešavaju pri **ulasku** u čvor. Međutim postoji i mogućnost pozivanja metoda posetioca i pri **izlasku** iz čvora.

Zamislimo da imamo ovakvu strukturu:

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

Pri prolasku kroz grana u stablu, nailazićemo na poslednje čvorove u datom nivou i tada treba da se vratimo na prethodni nivo u stablu da bismo došli do preostalih čvora. Idući kroz stablo **ulazićemo** u onda pri povratku nazad **izlazićemo** iz svakog od čvorava.

Pogledajmo, *korak po korak*, kako izgleda proces prolaska kroz stablo dato u poslednjem primeru.

  * Ulaz u `FunctionDeclaration` 
      * Ulaz u `Identifier (id)`
      * Završeno procesiranje čvora
      * Izlaz iz `Identifier (id)`
      * Ulaz u `Identifier (params[0])`
      * Završeno procesiranje čvora
      * Izlaz iz `Identifier (params[0])`
      * Ulaz u `BlockStatement (body)`
      * Ulaz u `ReturnStatement (body)` 
          * Ulaz u `BinaryExpression (argument)`
          * Ulaz u `Identifier (left)` 
              * Završeno procesiranje čvora
          * Izlaz iz `Identifier (left)`
          * Ulaz u `Identifier (right)` 
              * Završeno procesiranje čvora
          * Izlaz iz `Identifier (right)`
          * Izlaz iz `BinaryExpression (argument)`
      * Izlaz iz `ReturnStatement (body)`
      * Izlaz iz `BlockStatement (body)`
  * Izlaz iz `FunctionDeclaration`

Pri kreiranju posetioca postoje dve mogućnosti da posećivanje čvora.

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

### <a id="toc-paths"></a>Putanje (paths)

Generalno, AST se sastoji od više čvorova. Postavlja se pitanje kako su oni međusobno povezani? Možemo da imamo jeda ogroman promenljivi objekat sa kojim manipulišemo i imati potpun pristup ka svakom njegovom delu ili možemo da pojednostavimo ovo manipulisanje korišćenjem **putanja**.

**Putanja** je veza između dva čvora u objektnoj reprezentaciji.

Na primer, ako pogledamo sledeći čvor i njegove podčvore (child):

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

i predstavimo podčvor `Identifier` kao "putanju", dobijeni rezultat izgleda kao:

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

Ovde imamo i dodatne metapodatke (metadata) o "putanji":

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

Kasnije ćemo razmotriti veliki broj metoda vezanih za dodavanje, modifikovanje, pomeranje i uklanjanje čvorova.

Na neki način, "putanje" su **reaktivne** reprezentacije položaja čvorova unutar stabla kao i različite informacije o čvoru. Pozivanjem metoda koje modifikuju stablo se ažuriraju informacije o njegovoj strukturi. Sve ovo vam omogućava Babel kako bi korišćenje čvorova bilo što olakšano i nezavisno od stanja u kojima se nalaze.

#### <a id="toc-paths-in-visitors"></a>Putanje u "posetiocima"

Kad imamo "posetioca" koji ima `Identifier()` metod, u stanju smo da radimo sa putanjom umesto sa čvorom. Na ovaj način možemo da koristimo reaktivnu reprezentaciju čvora umesto samog čvora.

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

### <a id="toc-state"></a>Stanje (state)

Stanje je neprijatelj AST transformacija. Stanje će vas uvek napadati i vaše pretpostavke o stanju će skoro uvek biti pogrešne tako što će se pojavljivati sintakse koda koje niste očekivali.

Pogledajmo sledeći primer:

```js
function square(n) {
  return n * n;
}
```

Napišimo mali "posetioc" koji će da preimenuje `n` u `x`.

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

Ovaj primer će možda raditi za prethodni primer, ali ne i za sledeći primer:

```js
function square(n) {
  return n * n;
}
n;
```

Bolje rešenje se dobija korišćenjem rekurzije. Ubacimo "posetioca" u "posetioca" kao u filmu Christophera Nolana.

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

Iako je ovo specifičan primer, on demonstira kako da izbegnemo korišćenje globalog stanja u vašem "posetiocu".

### <a id="toc-scopes"></a>Domeni (scopes)

Uvedimo sad koncept [**domena**](https://en.wikipedia.org/wiki/Scope_(computer_science)) (scope). JavaScript koristi [leksički domen](https://en.wikipedia.org/wiki/Scope_(computer_science)#Lexical_scoping_vs._dynamic_scoping) (lexical scoping) - strukturu stabla u kojoj svaki blok koda kreira novi domen.

```js
// global scope

function scopeOne() {
  // scope 1

  function scopeTwo() {
    // scope 2
  }
}
```

Uvek kad u JavaScriptu uvedemo referencu, bilo da se radi o promenljivoj, funkciji, klasi, parametaru, labela i tako dalje, ona pripada trenutnom domenu (current scope).

```js
var global = "I am in the global scope";

function scopeOne() {
  var one = "I am in the scope created by `scopeOne()`";

  function scopeTwo() {
    var two = "I am in the scope created by `scopeTwo()`";
  }
}
```

Kod iz ugnežđenih domena može da koristi reference iz spoljašnjih domena.

```js
function scopeOne() {
  var one = "I am in the scope created by `scopeOne()`";

  function scopeTwo() {
    one = "I am updating the reference in `scopeOne` inside `scopeTwo`";
  }
}
```

Ugnežđeni domen može da koristi referencu sa istim imenom kao i referenca u spoljašnjem domenu, ali ona pri tome ne menja vrednost.

```js
function scopeOne() {
  var one = "I am in the scope created by `scopeOne()`";

  function scopeTwo() {
    var one = "I am creating a new `one` but leaving reference in `scopeOne()` alone.";
  }
}
```

Kada pišemo kod za transformacije, moramo voditi računa o domenima. Moramo se pobrinuti da ne pokvarimo postojeći kod pri modifikovanju njegovih raznih delova.

Ako treba da dodamo nove reference, treba da vodimo računa da se one ne poklapaju sa već postojećim. Ili možda samo želimo da nađemo gde su referencirane promenljive. Moramo biti u stanju da pratimo te reference unutar datog domena.

Domen može biti predstavljen kao:

```js
{
  path: path,
  block: path.node,
  parentBlock: path.parent,
  parent: parentScope,
  bindings: [...]
}
```

Novi domen kreiramo tako da mu dodeljujemo putanju i nadređeni domen (parent scope). U procesu prolaska se prikupljaju sve reference ("bindings") unutar domena.

Nakon toka, na domen možemo da primenumo veliko broj metoda. Njih ćemo razmotriti kasnije.

#### <a id="toc-bindings"></a>Vezivanje (bindings)

Reference pripadaju određenom domenu; ovu relaciju nazivamo **vezivanje** (binding).

```js
function scopeOnce() {
  var ref = "This is a binding";

  ref; // This is a reference to a binding

  function scopeTwo() {
    ref; // This is a reference to a binding from a lower scope
  }
}
```

Jedno "vezivanje" ima sledeći oblik:

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

Sa ovim informacijama možemo da nađemo sve reference na "vezivanja", odgovorimo na pitanje o kom tipu "vezivanja" se radi (parametar, deklaracija,...), pronaći u kome se domenu nalaze, ili dobiti kopiju identifikatora "vezivanja". Možemo čak da proverimo da li se radi o konstanti i videti koja "putanja" uzrokuje da "vezivanje" ne može da bude predstavljeno kao konstanta.

Mogućnost da kažemo da li je neko "vezivanje konstanta" je korisno u mnogim slučajevima, pri čemu je najbitniji minifikacija koda.

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

Babel u osnovi čini kolekciju modula. U ovom odeljku ćemo pomenuti one koji su najbitniji, objašnjavajući šta oni rade i kako se koriste.

> Napomena: Ovaj dokument ne zamenjuje detaljnu API dokumentaciju koja će uskoro biti dostupna na drugom mestu.

## <a id="toc-babylon"></a>[`babylon`](https://github.com/babel/babylon)

Babylon je parser koji se koristi u Babelu. Ovaj modul je nastao kao "ogranak" (fork) projekta Acorn, veoma je brz, jednostavan za korišćenje, ima arhitekturu "plugina" koja je upotrebljiva za nestandardne potrebe (kao i za buduće standarde).

Prvo, treba da ga instaliramo.

```sh
$ npm install --save babylon
```

Počnimo od jednostavnog parsiranja koda datog u sledećem stringu:

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

Metod `parse()` može da primi i opcije kao objekta prosleđen kao drugi parametar:

```js
babylon.parse(code, {
  sourceType: "module", // default: "script"
  plugins: ["jsx"] // default: []
});
```

`sourceType` može da bude ili `"module"` ili `"script"` što oderđuje na koji način Babylon treba da parsira dati kod. Ako je sourceType tipa `"module"`, ulazni kod će biti parsiran u "striktnom modu" (strict mode) i biće dozvoljene deklaracije modula što nije moguće ako se koristi mod `"script"`.

> **Napomena:** podrazumevana vrednost za `sourceType` je `"script"` u ako se pri parsiranju naiđe na ključnu reč `import` or `export` parser će da izbaci poruku o grešci i prekinuti parsiranje. Da bi izbegli ove greške koristite `sourceType: "module"` u opcijama pri pozivu parsera.

Kako se Babylon sagrađen na arhitekturi baziranoj na plaginovima, postoji `plugins` opcija koja dozvoljava upotrebu unutrašnjih plaginova. Imajte u vidu da Babylon još nije otvorio svoj API da bi podržao spoljašnje plaginove, i očekuje se će to biti ostvareno jedoga dana.

To see a full list of plugins, see the [Babylon README](https://github.com/babel/babylon/blob/master/README.md#plugins).

## <a id="toc-babel-traverse"></a>[`babel-traverse`](https://github.com/babel/babel/tree/master/packages/babel-traverse)

Babel Traverse modul procesira ukupno stanje stabla i odgovoran je za zamene, uklanjanja i dodavanje čvorova.

Da biste ga instalirali izvršite sledeću komandu:

```sh
$ npm install --save babel-traverse
```

Možemo ga koristiti zajedno sa Babylonom da bismo prošli kroz čvorove i ažurirali ih:

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

Babel Types podseća na Loadas biblioteku primenjenu na AST čvorove. Biblioteka sadrži metode za kreiranje, validaciju i konverziju AST čvorova. Korisna je za pročišćavanje logike u AST strukturi korišćenjem dobro osmišljenih pomoćnih metoda.

Možemo ga instalirati ako izvršimo komandu:

```sh
$ npm install --save babel-types
```

Po tom možemo da počnemo da ga koristimo:

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

### <a id="toc-definitions"></a>Defincije

Babel Types sadrži definicije za svaki pojedinačni tip čvora, sa informacija koje se strukture podataka koriste u njima, koje su validne vrednosti unutar strukture, kako se kreiraju određeni čvorovi, kako se prolazi kroz čvorove i koji su alijasi (aliases) za čvorove.

Definicija tipa jednog čvora ima oblik:

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

### <a id="toc-builders"></a>Gradioci (Builders)

Primetićete da gornja definicija `BinaryExpression` ima polje `builder`.

```js
builder: ["operator", "left", "right"]
```

Svaki tip čvora koristi metodu "gradioca", koja u praksi izgleda ovako:

```js
t.binaryExpression("*", t.identifier("a"), t.identifier("b"));
```

Ovim je kreiran jedan čvor AST koji izgleda kao:

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

Rezultat prethodnog izraza je sledeći:

```js
a * b
```

"Gradioci", takođe, validiraju čvorove koje kreiraju i bacaju greške sa opisom ako nisu korišćeni na pravi način. Ovo nas vodi u sledeći tip metoda.

### <a id="toc-validators"></a>Validatori

Definicija `BinaryExpression`, takođe, uključuje informacije o `poljima` čvora i kako se validiraju.

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

Ovo je iskorišćeno da se kreiraju dva tipa metoda za validaciju. Prvi od njih je `isX`.

```js
t.isBinaryExpression(maybeBinaryExpressionNode);
```

Izraz proverava da li čvor sadrži binarni izraz, a moguće je proslediti i drugi parametar kojim se obezbeđuje da čvor sadrži određena polja i njihove vrednosti.

```js
t.isBinaryExpression(maybeBinaryExpressionNode, { operator: "*" });
```

Moguće je koristiti i verzije ovih metoda koje će izbaciti greške u izvršavanju koda, umesto da vraćaju samo vrednosti true ili false.

```js
t.assertBinaryExpression(maybeBinaryExpressionNode);
t.assertBinaryExpression(maybeBinaryExpressionNode, { operator: "*" });
// Error: Expected type "BinaryExpression" with option { "operator": "*" }
```

### <a id="toc-converters"></a>Konvertori

> [WIP]

## <a id="toc-babel-generator"></a>[`babel-generator`](https://github.com/babel/babel/tree/master/packages/babel-generator)

Babel Generator je generator koda u okviru Babela. Njegova uloga je da pretvori AST strukturu u kod sa mapama koda (sourcemaps).

Izvršite sledeću komandu da biste ga instalirali:

```sh
$ npm install --save babel-generator
```

Po tom ga možete koristiti

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

Metod `generate()` prihvata opcije u formi objekta prosleđenog kao drugi parametar.

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

# <a id="toc-writing-your-first-babel-plugin"></a>Kreiranje vašeg prvog Babel plugina

Nakon što smo se upoznali sa osnova Babela, pokušajmo da stečeno znanje iskoristimu u radu sa plugin API-ijem.

Start off with a `function` that gets passed the current [`babel`](https://github.com/babel/babel/tree/master/packages/babel-core) object.

```js
export default function(babel) {
  // plugin contents
}
```

Pošto će biti često korišćeno, dodaćemo kod za uzimanje `babel.types` kao:

```js
export default function({ types: t }) {
  // plugin contents
}
```

Rezultat poziva treba da bude objekat koji ima polje `visitor` koji predstavlja osnovni "posetioc" u plaginu.

```js
export default function({ types: t }) {
  return {
    visitor: {
      // visitor contents
    }
  };
};
```

Napisaćemo mali plagin da bi smo demonstrirali kao oni rade. Ovako izgleda naš test kod:

```js
foo === bar;
```

Ili u AST formi:

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

Počećemo sa dodavanje `BinaryExpression` metoda "posetioca".

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

Ograničićemo dejstvo metoda samo na `BinaryExpression` (binarne operacije) koje koriste operator `===`.

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

Zamenimo `left` polje sa novim identifikatorom:

```js
BinaryExpression(path) {
  if (path.node.operator !== "===") {
    return;
  }

  path.node.left = t.identifier("sebmck");
  // ...
}
```

Ako sad izvršimo ovaj plagin kao rezultat ćemo dobiti:

```js
sebmck === bar;
```

Zamenimo sad i `right` polje koje odgovara desnom operandu binarne operacije.

```js
BinaryExpression(path) {
  if (path.node.operator !== "===") {
    return;
  }

  path.node.left = t.identifier("sebmck");
  path.node.right = t.identifier("dork");
}
```

Kao konačan rezultat dobijamo:

```js
sebmck === dork;
```

Neviđeno! Naš prvi Babel plagin.

* * *

# <a id="toc-transformation-operations"></a>Operacije transformisanja

## <a id="toc-visiting"></a>Posećivanje (visiting)

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

## <a id="toc-manipulation"></a>Manipulacija

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

> **Napomena:** Kad zamenjujete izraz sa više čvorovan, oni moraju biti izrazi (statements). Razlog za ovo je što Babel intenzivno koristi heuristiku kada zamenjuje čvorove, što znači da možete da uradite prilično neobične transformacije koje bi u suprotnom tražile jako veliko broj linija koda.

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

> **Napomena:** Nije preporučljivo koristit ovaj API ukoliko ne radite sa izvorom dinamičkih stringova. U suprotnom, mnogo je efikasnije da se kod parsira izvan "posetioca".

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

> **Napomena:** Ovo uvek treba da bude izraz ili niz izraza. Ovde se koristi ista heuristika kao i u [Zamenjivanje čvora sa više čvorova](#replacing-a-node-with-multiple-nodes).

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

## <a id="toc-scope"></a>Domen

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

# <a id="toc-plugin-options"></a>Plagin opcije

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

# <a id="toc-building-nodes"></a>Kreiranje čvorova

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

> Treba da znate da ponekad u čvoru postoji više polja koje je moguće definisati nego što ih sadrži niz pridružen polju `builder`. Razlog za ovo je da se izbegne prevelik broj parametara pri pozivanju metode "gradioca". Ako je to slučaj, potrebno je da ručno postavite vrednosti preostalih polja. Kao primer imamo [`ClassMethod`](https://github.com/babel/babel/blob/bbd14f88c4eea88fa584dd877759dd6b900bf35e/packages/babel-types/src/definitions/es2015.js#L238-L276).

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

# <a id="toc-best-practices"></a>Praktični saveti

> O toku sledećih sedmica ću proširiti sadržaj ovog odeljka.

## <a id="toc-avoid-traversing-the-ast-as-much-as-possible"></a>Izbegavajte prolazak kroz AST što je više moguće

Traversing the AST is expensive, and it's easy to accidentally traverse the AST more than necessary. This could be thousands if not tens of thousands of extra operations.

Babel optimizes this as much as possible, merging visitors together if it can in order to do everything in a single traversal.

### <a id="toc-merge-visitors-whenever-possible"></a>Spajanje "posetioca" kad je to moguće

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

### <a id="toc-do-not-traverse-when-manual-lookup-will-do"></a>Izbegavajte prolaske kada može da se upotrebi ručno prolaženje (kroz čvorove)

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

## <a id="toc-optimizing-nested-visitors"></a>Optimizacija ugnežđenih "posetioca"

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

## <a id="toc-being-aware-of-nested-structures"></a>Obratite pažnju na ugnežđene strukture

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

> ***За будућа ажурирања, пратите [@thejameskyle](https://twitter.com/thejameskyle) на Твитеру.***