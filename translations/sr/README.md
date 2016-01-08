# babel-plugin-handbook

U dokumentu je objašnjeno kako se kreiraju [Babel](https://babeljs.io) [plugini](https://babeljs.io/docs/advanced/plugins/).

Ako čitate prevod ovog priručnika koji nije na engleskom jeziku, još uvek možete pronaći neprevedene delove koji su pisani englekim jezikom. Uz pomoć Crowdin-a možete da doprinesete u prevođenju na neki od jezika. Molim vas pročitajte [vodič za učešće](/CONTRIBUTING.md) ukoliko vam je potrebno više informacija.

[![cc-by-4.0](https://licensebuttons.net/l/by/4.0/80x15.png)](http://creativecommons.org/licenses/by/4.0/)

Posebno smo zahvalni [@sebmck](https://github.com/sebmck/), [@hzoo](https://github.com/hzoo), [@jdalton](https://github.com/jdalton), [@abraithwaite](https://github.com/abraithwaite), [@robey](https://github.com/robey), i ostalim na njihovoj velikoj pomoći pri izradi ovog priručnika.

# Node Packaged Manuscript

Da biste instalirali ovaj priručnik uz pomoć npm-a izvršite u konzoli:

```sh
$ npm install -g babel-plugin-handbook
```

Sad možete da pozovete komandu `babel-plugin-handbook` koja će otvoriti ovaj readme fajl u vašem `$PAGER`/u. Inače, možete da nastavite da čitate ovaj dokument kao što i sad činite.

# Prevodi

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
  * [中文](/translations/zh-Hans/README.md)
  * [繁體中文](/translations/zh-Hant/README.md)

**[Zahtev za novi jezik](https://github.com/thejameskyle/babel-plugin-handbook/issues/new?title=Translation%20Request:%20[Please%20enter%20language%20here]&body=I%20am%20able%20to%20translate%20this%20language%20[yes/no])**

Ako čitate prevod ovog dokumenta koji nije pisan engleskim jezikom, naći ćete brojne engleske reči koje predstavljaju koncepte u programiranju. Da su prevedene na druge jezike, nedostajala bi konzistentnost i tečnost kada se čita o njima. U mnogim slučajevima naći ćete doslovne prevode iza kojih sledi engleski izraz pisan u zagradama `()`. Na primer: apstraktna sintaksna stabla (ASTs).

# Sadržaj

  * [Uvod](#introduction)
  * [Osnove](#basics) 
      * [ASTs](#asts)
      * [Stages of Babel](#stages-of-babel)
      * [Parse](#parse) 
          * [Lexical Analysis](#lexical-analysis)
          * [Syntactic Analysis](#syntactic-analysis)
      * [Transform](#transform)
      * [Generate](#generate)
      * [Traversal](#traversal)
      * [Visitors](#visitors)
      * [Paths](#paths) 
          * [Paths in Visitors](#paths-in-visitors)
      * [State](#state)
      * [Scopes](#scopes) 
          * [Bindings](#bindings)
  * [API](#api) 
      * [babylon](#babylon)
      * [babel-traverse](#babel-traverse)
      * [babel-types](#babel-types)
      * [Definitions](#definitions)
      * [Builders](#builders)
      * [Validators](#validators)
      * [Converters](#converters)
      * [babel-generator](#babel-generator)
      * [babel-template](#babel-template)
  * [Writing your first Babel Plugin](#writing-your-first-babel-plugin)
  * [Transformation Operations](#transformation-operations) 
      * [Visiting](#visiting)
      * [Check if a node is a certain type](#check-if-a-node-is-a-certain-type)
      * [Check if an identifier is referenced](#check-if-an-identifier-is-referenced)
      * [Manipulation](#manipulation)
      * [Replacing a node](#replacing-a-node)
      * [Replacing a node with multiple nodes](#replacing-a-node-with-multiple-nodes)
      * [Replacing a node with a source string](#replacing-a-node-with-a-source-string)
      * [Inserting a sibling node](#inserting-a-sibling-node)
      * [Removing a node](#removing-a-node)
      * [Replacing a parent](#replacing-a-parent)
      * [Removing a parent](#removing-a-parent)
      * [Scope](#scope)
      * [Checking if a local variable is bound](#checking-if-a-local-variable-is-bound)
      * [Generating a UID](#generating-a-uid)
      * [Pushing a variable declaration to a parent scope](#pushing-a-variable-declaration-to-a-parent-scope)
      * [Rename a binding and its references](#rename-a-binding-and-its-references)
  * [Plugin Options](#plugin-options)
  * [Building Nodes](#building-nodes)
  * [Best Practices](#best-practices) 
      * [Avoid traversing the AST as much as possible](#avoid-traversing-the-ast-as-much-as-possible)
      * [Merge visitors whenever possible](#merge-visitors-whenever-possible)
      * [Do not traverse when manual lookup will do](#do-not-traverse-when-manual-lookup-will-do)
      * [Optimizing nested visitors](#optimizing-nested-visitors)
      * [Being aware of nested structures](#being-aware-of-nested-structures)

# Uvod

Babel je generički višenamenski kompajler za JavaScript. Čini ga kolekcija modula koji se mogu koristiti za različite oblike statičke analize koda.

> Statička analiza je proces analiziranja koda bez njegovog izvršavanja. (Analiza koda prilikom njegovog izvršavanja se naziva dinamička analiza). Namena statičke analize moze biti vrlo različita. Može biti korišćena za proveru stila i načina pisanja (linting), kompajliranje, predstavljanje sintakse jezika bojama (color highlighting), transformisanje koda, optimizacije, minifikacije i druge operacije.

Uz pomoć Babel-a možete napisati mnoštvo različitih tipova alatki koje vam mogu pomoći da povećate produktivnost i pišete bolje programe.

# Osnove

Babel je JavaScript kompajler, tačnije kompajler iz koda u kod, što se najčešće naziva "transpiler". Drugim rečima, Babel će da modifikuje vaš kod i da generiše potpuno novi kod.

## ASTs

Svaki od koraka pri kompajliranju uključuje kreiranje ili korišćenje apstraktnog sintaksnog stabla [Abstract Syntax Tree](https://en.wikipedia.org/wiki/Abstract_syntax_tree) tj. AST.

> Babel za AST koristi modifikovanu verziju [ESTree](https://github.com/estree/estree), čija se osnovna specifikacija nalazi [ovde](https://github.com/babel/babel/blob/master/doc/ast/spec.md).

```js
function square(n) {
  return n * n;
}
```

> Da biste stekli bolji osećaj u vezi sa strukturama koje koristi AST možete da pogledate [AST Explorer](http://astexplorer.net/). [Ovde](http://astexplorer.net/#/Z1exs6BWMq) se nalazi njegov link sa kodom iz prethodnog primera.

Isto parče koda može se predstaviti listom kao:

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

Ili kao JavaScript objekt kao:

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

Možete da primetite da svaki nivo AST-a ima sličnu strukturu:

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

> Napomena: neki delovi objekta (properties) su sklonjeni da bi se videla suština.

Svaki deo (property) se naziva **čvor** (node). Struktura AST-a može da se sastoji bilo od jednog, bilo od ogromnog broja čvorova (nodes). Svi čvorovi zajedno mogu da opišu sintaksu programa što može da se koristi za statičku analizu.

Svaki čvor je predstavljen sledećom strukturom:

```typescript
interface Node {
  type: string;
}
```

Polje `type` je string koji sadrži tip objekta koji je predstavljen čvorom. (npr. `"FunctionDeclaration"`, `"Identifier"`, ili `"BinaryExpression"`). Za svaki od tipova čvorova se koristi posebana dodatna grupa podataka kojim je opisan dati čvor.

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

## Faze kompajliranja (Stages of Babel)

Tri osnovna stanja kroz koje Babel prolazi su **parsiranje**, **transformisanje**, **generisanje**.

### Parsiranje

U fazi **parsiranja**, kod se pretvara u AST strukturu. Parsiranje čine dve faze: [**Leksička analiza**](https://en.wikipedia.org/wiki/Lexical_analysis) (Lexical Analysis) i [**Analiza sintakse**](https://en.wikipedia.org/wiki/Parsing) (Syntactic Analysis).

#### Leksička analiza (Lexical Analysis)

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

#### Analiza sintakse (Syntactic Analysis)

Analiza sintakse koristi niz tokena i pretvara ih u AST formu. U ovoj fazi tokeni su, na osnovu informacija koje nose, restruktuirani u formu AST-a. Ovakva reprezentacija strukture koda je daleko jednostavnija za dalje procesiranje.

### Transformisanje (Transform)

U stanju [transformisanja](https://en.wikipedia.org/wiki/Program_transformation) Babel prolazi kroz čvorove AST strukture i pri tom kreira nove, briše ili modifikuje postojeće čvorove. Ovo je daleko najsloženiji deo kroz koji prolazi bilo Babel bilo koji drugi kompajler. Plaginovi svoje procese obavljaju u ovom stanju pa će ovo stanje biti glavna tema u većem delu ovog priručnika. Zbog toga nećemo ulaziti duboko u detalje za sad.

### Generisanje (Generate)

Stanje [generisanje koda](https://en.wikipedia.org/wiki/Code_generation_(compiler)) koristi AST generisan u prethodnom stanju i na osnovu njega generiše kod i kreira [mapu koda](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/) (source map).

Generisanje koda je prilično jednostavan proces: prolazi se kroz AST strukturu i ispišu stringovi koji predstavljaju transformisani kod.

## Prolazak (Traversal)

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

### Posetioci (Visitors)

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

As we traverse down each branch of the tree we eventually hit dead ends where we need to traverse back up the tree to get to the next node. Going down the tree we **enter** each node, then going back up we **exit** each node.

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

### Putanje (paths)

Generalno, AST se sastoji od više čvorova. Postavlja se pitanje kako su oni međusobno povezani? We could have one giant mutable object that you manipulate and have full access to, or we can simplify this with **Paths**.

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

#### Putanje u "posetiocima"

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

### Stanje (state)

State is the enemy of AST transformation. State will bite you over and over again and your assumptions about state will almost always be proven wrong by some syntax that you didn't consider.

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

### Domeni (scopes)

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

#### Vezivanje (bindings)

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

# API

Babel u osnovi čini kolekciju modula. U ovom odeljku ćemo pomenuti one koji su najbitniji, objašnjavajući šta oni rade i kako se koriste.

> Napomena: Ovaj dokument ne zamenjuje detaljnu API dokumentaciju koja će uskoro biti dostupna na drugom mestu.

## [`babylon`](https://github.com/babel/babel/tree/master/packages/babylon)

Babylon je parser koji se koristi u Babelu. Ovaj modul je nastao kao "ogranak" (fork) projekta Acorn, veoma je brz, jednostavan za korišćenje, ima arhitekturu "plugina" koja je upotrebljiva za nestandardne potrebe (kao i za buduće standarde).

Prvo, treba da ga instaliramo.

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

To see a full list of plugins, see the [Babylon README](https://github.com/babel/babel/blob/master/packages/babylon/README.md#plugins).

## [`babel-traverse`](https://github.com/babel/babel/tree/master/packages/babel-traverse)

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

## [`babel-types`](https://github.com/babel/babel/tree/master/packages/babel-types)

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

### Definitions

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

### Builders

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

### Validators

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

### Converters

> [WIP]

## [`babel-generator`](https://github.com/babel/babel/tree/master/packages/babel-generator)

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

## [`babel-template`](https://github.com/babel/babel/tree/master/packages/babel-template)

Babel Template je sledeći mali, ali izuzetno koristan modul. On omogućava pisanje stringova koda sa "mestima za zamene" (placeholders) koje možemo koristiti umesto ručnog kreiranja ogromne AST strukture.

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

# Kreiranje vašeg prvog Babel plugina

Nakon što smo se upoznali sa osnova Babela, pokušajmo da stečeno znanje iskoristimu u radu sa plugin API-ijem.

Započećemo sa `funkcijom` koja kao ulazni parametar uzima trenutni `babel` objekt.

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

# Transformation Operations

## Visiting

### Check if a node is a certain type

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

### Check if an identifier is referenced

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

## Manipulation

### Replacing a node

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

### Replacing a node with multiple nodes

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

### Replacing a node with a source string

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

### Inserting a sibling node

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

### Removing a node

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

### Replacing a parent

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

### Removing a parent

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

## Scope

### Checking if a local variable is bound

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

### Generating a UID

This will generate an identifier that doesn't collide with any locally defined variables.

```js
FunctionDeclaration(path) {
  path.scope.generateUidIdentifier("uid");
  // Node { type: "Identifier", name: "_uid" }
  path.scope.generateUidIdentifier("uid");
  // Node { type: "Identifier", name: "_uid2" }
}
```

### Pushing a variable declaration to a parent scope

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

### Rename a binding and its references

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

# Plugin Options

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

# Building Nodes

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

# Best Practices

> I'll be working on this section over the coming weeks.

## Avoid traversing the AST as much as possible

Traversing the AST is expensive, and it's easy to accidentally traverse the AST more than necessary. This could be thousands if not tens of thousands of extra operations.

Babel optimizes this as much as possible, merging visitors together if it can in order to do everything in a single traversal.

### Merge visitors whenever possible

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

## Optimizing nested visitors

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

## Being aware of nested structures

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