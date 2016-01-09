# babel-plugin-handbook

U dokumentu je objašnjeno kako se kreiraju [Babel](https://babeljs.io) [plaginovi](https://babeljs.io/docs/advanced/plugins/).

Ako je pred vama priručnika koji nije pisan engleskim jezikom, možete da pronađete neprevedene delove, pisane englekim jezikom. Uz pomoć Crowdin-a možete da doprinesete u prevođenju na neki od jezika. Molim vas pročitajte [vodič za učešće](/CONTRIBUTING.md) ukoliko vam je potrebno više informacija.

[![cc-by-4.0](https://licensebuttons.net/l/by/4.0/80x15.png)](http://creativecommons.org/licenses/by/4.0/)

Posebno smo zahvalni [@sebmck](https://github.com/sebmck/), [@hzoo](https://github.com/hzoo), [@jdalton](https://github.com/jdalton), [@abraithwaite](https://github.com/abraithwaite), [@robey](https://github.com/robey) i drugima na njihovoj velikoj pomoći pri izradi ovog priručnika.

# Priručnik upakovan NodeJS-om

Da biste instalirali ovaj priručnik uz pomoć npm-a izvršite u konzoli:

```sh
$ npm install -g babel-plugin-handbook
```

Sad možete da pozovete komandu `babel-plugin-handbook` koja će otvoriti ovaj readme fajl u vašem `$PAGER-u`. Možete da nastavite da čitate ovaj priručnik i ovde u html formatu.

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
  * [Srpski](/translations/sr/README.md)
  * [Svenska](/translations/sv-SE/README.md)
  * [Türk](/translations/tr/README.md)
  * [Український](/translations/uk/README.md)
  * [Tiếng Việt](/translations/vi/README.md)
  * [中文](/translations/zh-Hans/README.md)
  * [繁體中文](/translations/zh-Hant/README.md)

**[Zahtev za dodavanje prevoda na drugi jezik](https://github.com/thejameskyle/babel-plugin-handbook/issues/new?title=Translation%20Request:%20[Please%20enter%20language%20here]&body=I%20am%20able%20to%20translate%20this%20language%20[yes/no])**

Ako čitate prevod ovog dokumenta koji nije pisan engleskim jezikom, videćete brojne reči na engleskom jeziku koje predstavljaju koncepte iz oblasti programiranja. Da su prevedene na druge jezike, nedostajala bi konzistentnost i jasnoća na mestima gde smo ih objašnjavali ili koristili. U mnogim slučajevima naći ćete doslovne prevode iza kojih sledi engleski izraz pisan u zagradama `()`. Na primer: apstraktna sintaksna stabla (ASTs).

# Sadržaj

  * [Uvod](#introduction)
  * [Osnove](#basics) 
      * [AST strukture](#asts)
      * [Stanja pri kompajliranja (Stages of Babel)](#stages-of-babel)
      * [Parsiranje](#parse) 
          * [Leksička analiza (Lexical Analysis)](#lexical-analysis)
          * [Analiza sintakse (Syntactic Analysis)](#syntactic-analysis)
      * [Transformisanje (Transform)](#transform)
      * [Generisanje (Generate)](#generate)
      * [Prolazak (Traversal)](#traversal)
      * [Posetioci (Visitors)](#visitors)
      * [Putanje (paths)](#paths) 
          * [Putanje u "posetiocima"](#paths-in-visitors)
      * [Stanje (state)](#state)
      * [Domeni (scopes)](#scopes) 
          * [Vezivanje (bindings)](#bindings)
  * [API](#api) 
      * [babylon](#babylon)
      * [babel-traverse](#babel-traverse)
      * [babel-types](#babel-types)
      * [Defincije](#definitions)
      * [Gradioci (Builders)](#builders)
      * [Validatori](#validators)
      * [Konvertori](#converters)
      * [babel-generator](#babel-generator)
      * [babel-template](#babel-template)
  * [Kreiranje vašeg prvog Babel plugina](#writing-your-first-babel-plugin)
  * [Operacije transformisanja](#transformation-operations) 
      * [Posećivanje (visiting)](#visiting)
      * [Proverite da li je čvor određenog tipa](#check-if-a-node-is-a-certain-type)
      * [Proverite da li neko referencira identifikator](#check-if-an-identifier-is-referenced)
      * [Manipulacija](#manipulation)
      * [Zamena čvora](#replacing-a-node)
      * [Zamenjivanje čvora sa više čvorova](#replacing-a-node-with-multiple-nodes)
      * [Zamenjivanje čvorova sa stringom koda](#replacing-a-node-with-a-source-string)
      * [Umetanje susednih čvorova](#inserting-a-sibling-node)
      * [Uklanjanje čvora](#removing-a-node)
      * [Zamena nadčvora (parent)](#replacing-a-parent)
      * [Uklanjanje nadčvora (parent)](#removing-a-parent)
      * [Domen](#scope)
      * [Proveravanje da li je lokalna promenljiva "vezana" (bounded)](#checking-if-a-local-variable-is-bound)
      * [Generisanje UID-a](#generating-a-uid)
      * [Pomeranje deklaracije promenljive na naddomen (parent scope)](#pushing-a-variable-declaration-to-a-parent-scope)
      * [Promena imena "vezivanja" i njegovih referenci](#rename-a-binding-and-its-references)
  * [Plagin opcije](#plugin-options)
  * [Kreiranje čvorova](#building-nodes)
  * [Praktični saveti](#best-practices) 
      * [Izbegavajte prolazak kroz AST što je više moguće](#avoid-traversing-the-ast-as-much-as-possible)
      * [Spajanje "posetioca" kad je to moguće](#merge-visitors-whenever-possible)
      * [Izbegavajte prolaske kada može da se upotrebi ručno prolaženje (kroz čvorove)](#do-not-traverse-when-manual-lookup-will-do)
      * [Optimizacija ugnežđenih "posetioca"](#optimizing-nested-visitors)
      * [Obratite pažnju na ugnežđene strukture](#being-aware-of-nested-structures)

# Uvod

Babel je generički višenamenski kompajler za JavaScript. Sastoji se od kolekcije modula koji se mogu koristiti u različitim vidovima statičke analize koda.

> Statička analiza je proces analiziranja koda bez njegovog izvršavanja. (Analiza koda prilikom njegovog izvršavanja se naziva dinamička analiza). Postoji veliki broj primena statičke analize koda. Može biti korišćena za proveru stila i načina pisanja (linting), kompajliranje, predstavljanje sintakse jezika bojama (color highlighting), transformisanje koda, optimizacije, minifikacije i druge operacije.

Uz pomoć Babel-a možete napisati mnoštvo različitih tipova alatki koje vam mogu pomoći da povećate produktivnost i pišete bolje programe.

# Osnove

Babel je JavaScript kompajler, tačnije kompajler iz koda u kod, što se najčešće naziva "transpiler". Drugim rečima, Babel će da modifikuje vaš kod i da generiše potpuno novi kod.

## AST strukture

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

### Putanje (paths)

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

Kompletna lista plaginova je data u [Babylon README](https://github.com/babel/babel/blob/master/packages/babylon/README.md#plugins).

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

### Definicije

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

### Gradioci (Builders)

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

### Validatori

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

### Konvertori

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

# Operacije transformisanja

## Posećivanje (visiting)

### Proverite da li je čvor određenog tipa

Ako želite da proverite koga je tipa dati čvor, najbolji način da to uradite je:

```js
BinaryExpression(path) {
  if (t.isIdentifier(path.node.left)) {
    // ...
  }
}
```

Takođe, možete uradite brzu proveru nad vrednostima polja datog čvora:

```js
BinaryExpression(path) {
  if (t.isIdentifier(path.node.left, { name: "n" })) {
    // ...
  }
}
```

Funkcionalno, ovo je ekvivalentno sledećem kodu:

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

### Proverite da li neko referencira identifikator

```js
Identifier(path) {
  if (path.isReferencedIdentifier()) {
    // ...
  }
}
```

Drugi način da to učinite je:

```js
Identifier(path) {
  if (t.isReferenced(path.node, path.parent)) {
    // ...
  }
}
```

## Manipulacija

### Zamena čvora

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

### Zamenjivanje čvora sa više čvorova

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

### Zamenjivanje čvorova sa stringom koda

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

### Umetanje susednih čvorova

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

### Uklanjanje čvora

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

### Zamena nadčvora (parent)

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

### Uklanjanje nadčvora (parent)

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

## Domen

### Proveravanje da li je lokalna promenljiva "vezana" (bounded)

```js
FunctionDeclaration(path) {
  if (path.scope.hasBinding("n")) {
    // ...
  }
}
```

Ovim se prolazi uz stablo domena i proverava da li postoji "vezivanje".

Možete, takođe, da proverite da li postoji "vezivanje" unutar samog domena:

```js
FunctionDeclaration(path) {
  if (path.scope.hasOwnBinding("n")) {
    // ...
  }
}
```

### Generisanje UID-a

Ovo će da generiše identifikator koji se ne sudara sa identifikatorom ni jedne lokalno definisane promenljive.

```js
FunctionDeclaration(path) {
  path.scope.generateUidIdentifier("uid");
  // Node { type: "Identifier", name: "_uid" }
  path.scope.generateUidIdentifier("uid");
  // Node { type: "Identifier", name: "_uid2" }
}
```

### Pomeranje deklaracije promenljive na naddomen (parent scope)

Ponekad je potrebno da pomerite `VariableDeclaration` tako da datoj promenljivoj možete da pridružite vrednost.

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

### Promena imena "vezivanja" i njegovih referenci

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

Isto tako, možete da promenite ime "vezivanja" tako što ćete generisati unikatni indetifikator:

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

# Plagin opcije

Ako želite da omogućite vašim korisnicima da menjaju ponašanje vaših Babel plaginova možete da prihvatite posebne opcije plagina koje korisnik može da specificira na sledeći način:

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

Ove opcije se prenose u "posetioce" plagina kroz `state` objekat:

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

Ove opcije su dodeljene samo pojedinačnim plaginovima i nije im moguće pristupiti iz ostalih plaginova.

* * *

# Kreiranje čvorova

Pri pisanju transformacija često je potrebno da dodamo nove čvorove u AST stablo. Kao što je prethodno rečeno, ovo je moguće izvesti korišćenjem metoda [gradioca](#builder) (builders) definisanih u [`babel-types`](#babel-types) paketu.

Naziv metoda "gradioca" je prosto ime tipa čvora koji želite da kreirate, pri čemu je prvo slovo naziva metoda malo slovo. Na primer, ako želite da kreirate čvor tipa `MemberExpression` treba da koristite `t.memberExpression(...)`.

Parametri ovih "gradioca" su odreženi definicijom čvora. Potrebno je još raditi na generisanju upotrebljive dokumentacije za ove definicije, a trenutno je možete naći [ovde](https://github.com/babel/babel/tree/master/packages/babel-types/src/definitions).

Definicija čvora izgleda ovako:

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

Ove možete da vidite sve informacije o datom tipu čvora, uključujući i kako da ga kreirate, kako da se krećete kroz njega i kako da ga validirate.

Gledajući polja `builder`, možete da zapazite 3 argumenta koja su potrebna pri pozivanju metode "gradioca" (`t.memberExpression`)).

```js
builder: ["object", "property", "computed"],
```

> Treba da znate da ponekad u čvoru postoji više polja koje je moguće definisati nego što ih sadrži niz pridružen polju `builder`. Razlog za ovo je da se izbegne prevelik broj parametara pri pozivanju metode "gradioca". Ako je to slučaj, potrebno je da ručno postavite vrednosti preostalih polja. Kao primer imamo [`ClassMethod`](https://github.com/babel/babel/blob/bbd14f88c4eea88fa584dd877759dd6b900bf35e/packages/babel-types/src/definitions/es2015.js#L238-L276).

Unutar `fields` objekta se nalaze validator za parametre metode "gradioca".

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

Vidimo da `object` treba da bude `Expression`, `property` može da bude `Expression` ili `Identifier` zavisno od vrednosti izraza `computed`. Polje `computed` ima podrazumevanu vrednost `false`.

Sledeći primer pokazuje kako možemo kreirati `MemberExpression`:

```js
t.memberExpression(
  t.identifier('object'),
  t.identifier('property')
  // `computed` is optional
);
```

Ovo rezultira izrazom:

```js
object.property
```

Međutim, rekli smo da `object` treba da bude `Expression` pa se pitamo zašto je `Identifier` validan?

Ako pogledamo definiciju `Identifier` videćemo da postoji `aliases` polje koji kaže da je identfikator takođe i izraz (expression).

```js
aliases: ["Expression", "LVal"],
```

Kako je `MemberExpression` tipa `Expression`, možemo da ga posmatramo kao `object` drugog `MemberExpression`:

```js
t.memberExpression(
  t.memberExpression(
    t.identifier('member'),
    t.identifier('expression')
  ),
  t.identifier('property')
)
```

Ovo rezultira izrazom:

```js
member.expression.property
```

Malo je verovatno da ćete moći da upamtite oblik metoda "gradioca" za svaki od tipova čvora. Zato je bolje da uložite malo vremena i truda i razumete kako su oni generisani na osnovu definicija čvora.

Definicije čvorova možete da nađete [ovde](https://github.com/babel/babel/tree/master/packages/babel-types/src/definitions), a prateća dokumentacija se nalazi [ovde](https://github.com/babel/babel/blob/master/doc/ast/spec.md)

* * *

# Praktični saveti

> O toku sledećih sedmica ću proširiti sadržaj ovog odeljka.

## Izbegavajte prolazak kroz AST što je više moguće

Prolaženje kroz AST je veoma skupa operacija, i lako se dešava da slučajno prolazite kroz AST više nego što je pogrebno. To dovodi do izvršavanja hiljade ako ne i desetine hiljada dodatnih operacija.

Babel ovo optimizuje koliko god može, spajajući "posetioce" zajedno kad je to moguće u cilju da se ceo posao završi u samo jednom prolasku.

### Spajanje "posetioca" kad je to moguće

Kad pišemo posetioce, može biti pogodno da se `path.traverse` poziva na više mesta gde to logika problema nalaže.

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

Međutim, mnogo je bolje koristiti pojedinačne "posetioce" koji se pozivaju samo jedan put. U suprotnom, dešava se da se isto stablo prolazi više puta bez razloga za to.

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

### Izbegavajte prolaske kada može da se upotrebi ručno prolaženje (kroz čvorove)

Kada tražimo koga je tipa određeni čvor, može doći do pozivanja metoda `path.traverse`.

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

Međutim, ako tražite nešto specifično i ne suviše zahtevno, postoji šansa da umesto skupog pozivanja "prolaska" (traversal) ručno pretražite neke čvorove.

```js
const MyVisitor = {
  FunctionDeclaration(path) {
    path.node.params.forEach(function() {
      // ...
    });
  }
};
```

## Optimizacija ugnežđenih "posetioca"

Kada je potrebno da koristite ugnežđene "posetioce", ima smisla da ih napišete ugnežđeno u vašem kodu.

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

Međutim, na ovaj način se kreira novi "posetioc" pri svakom pozivu metoda `FunctionDeclaration()` u gornjem primeru, pri čemu Babel treba da proanalizira i da ga validira svaki put. Ovo može da bude veoma skupo (po pitanju vremena izvršavanja i korišćenja resorsa), pa je bolje prebaciti "posetioce" iznad definicije objekta MyVisitor.

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

Ukoliko vam je potrebno da znate stanje unutar ugnežđenog "posetioca", iskoristite sledeću ideju:

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

Možete da ga prosledite kao stanje u `traverse()` metod i u "posetiocu" mu pristupite kroz `this` promenljivu.

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

## Obratite pažnju na ugnežđene strukture

Ponekad kad razmišljamo o datim transformacijama, možemo da zaboravimo da date strukture mogu biti ugnežđene.

Na primer, zamislimo da želio da nađemo `constructor` od `ClassMethod` datog u `Foo` `ClassDeclaration`.

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

Ignorisali smo činjenicu da klase mogu biti ugnežđene, pa će prethodni prolazak, između ostalog, da naiđe i na ugnežđeni `konstruktor`:

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