# Manualul de utilizare Babel

Acest document conține tot ceea ce ați vrut vreodată să ştiți despre utilizarea [Babel](https://babeljs.io) şi a instrumentelor aferente.

[![cc-by-4.0](https://licensebuttons.net/l/by/4.0/80x15.png)](http://creativecommons.org/licenses/by/4.0/)

Acest manual este disponibil și în alte limbi, a se vedea [README](/README.md) pentru o listă completă.

# Cuprins

  * [Introducere](#toc-introduction)
  * [Inițializare Babel](#toc-setting-up-babel) 
      * [`babel-cli`](#toc-babel-cli)
      * [Execuția Babel CLI (Interfața Liniei de Comandă) în cadrul unui proiect](#toc-running-babel-cli-from-within-a-project)
      * [`babel-register`](#toc-babel-register)
      * [`babel-node`](#toc-babel-node)
      * [`babel-core`](#toc-babel-core)
  * [Configurare Babel](#toc-configuring-babel) 
      * [`.babelrc`](#toc-babelrc)
      * [`babel-preset-es2015`](#toc-babel-preset-es2015)
      * [`babel-preset-react`](#toc-babel-preset-react)
      * [`babel-preset-stage-x`](#toc-babel-preset-stage-x)
  * [Execuția codului generat de Babel](#toc-executing-babel-generated-code) 
      * [`babel-polyfill`](#toc-babel-polyfill)
      * [`babel-runtime`](#toc-babel-runtime)
  * [Configurare Babel (Avansată)](#toc-configuring-babel-advanced) 
      * [Specificarea manuală a plugin-urilor](#toc-manually-specifying-plugins)
      * [Opțiuni de plugin](#toc-plugin-options)
      * [Personalizarea Babel în funcție de modul de lucru](#toc-customizing-babel-based-on-environment)
      * [Crearea unei presetări](#toc-making-your-own-preset)
  * [Babel şi alte instrumente](#toc-babel-and-other-tools) 
      * [Instrumente de analiză statică](#toc-static-analysis-tools)
      * [Verificare cod (Linting)](#toc-linting)
      * [Stil de cod](#toc-code-style)
      * [Documentație](#toc-documentation)
      * [Framework-uri](#toc-frameworks)
      * [React](#toc-react)
      * [Editoare de text şi IDEs](#toc-text-editors-and-ides)
  * [Suport Babel](#toc-babel-support) 
      * [Forum Babel](#toc-babel-forum)
      * [Discuții Babel](#toc-babel-chat)
      * [Probleme Babel](#toc-babel-issues)
      * [Raportarea unei probleme Babel](#toc-creating-an-awesome-babel-bug-report)

# <a id="toc-introduction"></a>Introducere

Babel este un compilator generic multi-scop pentru JavaScript. Folosind Babel puteţi utiliza (şi crea) următoarea generaţie de JavaScript, precum şi următoarea generaţie de instrumente JavaScript.

Limbajul JavaScript evoluează în mod constant, iar noile specificații și propuneri vin cu caracteristici noi în mod constant. Babel vă permite să folosiți multe din aceste caracteristici cu mult înainte ca acestea să fie disponibile peste tot.

Babel face acest lucru prin compilarea codului JavaScript scris cu cele mai recente standarde într-o versiune care va funcționa peste tot astăzi. Acest proces este cunoscut sub denumirea de compilare sursă-la-sursă, sau "transpiling".

De exemplu, Babel ar putea transforma sintaxa ES2015 pentru "funcții săgeată", din acest cod:

```js
const square = n => n * n;
```

În acest cod:

```js
const square = function square(n) {
  return n * n;
};
```

Însă Babel poate face mult mai mult decât atât, deoarece Babel oferă suport pentru extensii de sintaxă precum JSX pentru React sau Flux pentru verificarea statică a tipurilor.

Mai mult decât atât, totul în Babel este pur şi simplu un plug-in şi oricine își poate crea propriile plugin-uri folosind întreaga putere a Babel-ului, pentru propriile scopuri.

*Chiar mai mult* decât atât, Babel este defalcat într-o serie de module de bază pe care oricine o poate utiliza pentru a construi următoarea generaţie de instrumente JavaScript.

Ecosistemul care a apărut în jurul Babel este masiv și foarte divers. Pe parcursul acestui manual vom acoperi atât instrumentele incluse în Babel, precum şi câteva unelte utile construite de comunitate.

> ***Pentru actualizări, urmăriţi-l pe [@thejameskyle](https://twitter.com/thejameskyle) pe Twitter.***

* * *

# <a id="toc-setting-up-babel"></a>Inițializare Babel

Deoarece în comunitatea JavaScript există multe unelte de build, framework-uri, platforme, etc., Babel are integrări oficiale cu majoritatea dintre acestea. De la Gulp la Browserify, de la Ember la Meteor, cu siguranță există o integrare oficială.

Pe parcursul acestui manual, vom acoperi doar modurile predefinite de inițializare Babel, însă puteţi vizita [pagina de configurare](http://babeljs.io/docs/setup) interactivă pentru toate integrările existente.

> **Notă:** Acest ghid face referire la instrumente de linie de comandă, cum ar fi `node` şi `npm`. Înainte de a continua ar trebui să fiți confortabili cu aceste instrumente.

## <a id="toc-babel-cli"></a>`babel-cli`

Babel CLI este un mod simplu de a compila fişiere cu Babel din linia de comandă.

Haideţi să-l instalăm la nivel global pentru a învăţa elementele de bază.

```sh
$ npm install --global babel-cli
```

Putem compila primul nostru fişier astfel:

```sh
$ babel my-file.js
```

Această comandă va afișa codul compilat direct în terminal. Pentru a-l scrie într-un fişier trebuie să specificăm parametrul `--out-file` sau `-o`.

```sh
$ babel example.js --out-file compiled.js
# or
$ babel example.js -o compiled.js
```

Dacă vrem să compilăm un director întreg într-un director nou, putem face asta folosind `--out-dir` sau `-d`.

```sh
$ babel src --out-dir lib
# or
$ babel src -d lib
```

### <a id="toc-running-babel-cli-from-within-a-project"></a>Execuția Babel CLI (Interfața Liniei de Comandă) în cadrul unui proiect

Deși se *poate* instala Babel CLI și la nivel global pe maşina dvs., este recomandat să-l instalaţi **local**, la nivel de proiect.

Există două motive principale pentru asta.

  1. Proiecte diferite pe aceeaşi maşină pot depinde de versiuni diferite de Babel, permiţându-vă actualizarea individuală a lor.
  2. Aceasta înseamnă că nu aveţi o dependenţă implicită privind mediul în care lucraţi. Acest lucru face ca proiectul să fie mai portabil și mai ușor de instalat.

Putem instala Babel CLI la nivel local prin rularea:

```sh
$ npm install --save-dev babel-cli
```

> **Notă:** Deoarece, în general, este o idee rea să rulați Babel la nivel global, ar trebui să dezinstalaţi copia globală prin rularea:
> 
> ```sh
$ npm uninstall --global babel-cli
```

După ce se termină instalarea, fişierul `package.json` ar trebui să arate așa:

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "devDependencies": {
    "babel-cli": "^6.0.0"
  }
}
```

Acum, în loc să rulăm Babel direct din linia de comandă, vom adăuga comenzile noastre în **npm scripts** folosind versiunea noastră locală de Babel.

Pur şi simplu adăugaţi un câmp `"scripts"` în fișierul `package.json` şi adăugați comanda Babel pe proprietatea `build`.

```diff
  {
    "name": "my-project",
    "version": "1.0.0",
+   "scripts": {
+     "build": "babel src -d lib"
+   },
    "devDependencies": {
      "babel-cli": "^6.0.0"
    }
  }
```

Acum din terminalul nostru se poate rula:

```js
npm run build
```

Această comandă va rula Babel în acelaşi mod, ca înainte, însă folosind o instalare locală.

## <a id="toc-babel-register"></a>`babel-register`

Următoarea metoda comună de rulare Babel este prin `babel-register`. Această opţiune vă va permite să executaţi Babel doar prin cererea fişierelor, ceea ce facilitează integrarea mai bună cu setup-ul vostru.

Reţineţi că acest lucru nu este recomandat pentru utilizarea în producţie. Este considerată practică rea să utilizați cod compilat în acest fel. Este mult mai bine să compilaţi înainte de lansarea codului în producție. Însă acest lucru funcţionează destul de bine pentru script-uri sau alte lucruri pe care le rulați la nivel local.

În primul rând creaţi un fişier `index.js`.

```js
console.log("Hello world!");
```

Dacă am rula acest cod cu `node index.js`, nu ar fi compilat cu Babel. Așadar, vom configura `babel-register`.

Instalați mai întâi `babel-register`.

```sh
$ npm install --save-dev babel-register
```

Apoi, creaţi un fişier `register.js` în proiect şi cu următorul cod:

```js
require("babel-register");
require("./index.js");
```

Acest lucru va *înregistra* Babel în sistemul de module Node şi va începe compilarea fiecărui fişier care este "cerut" cu `require`.

Acum, în loc să rulăm `node index.js` putem folosi `register.js`.

```sh
$ node register.js
```

> **Notă:** Nu puteţi înregistra Babel în acelaşi fişier pe care doriţi să-l compilaţi. Asta deoarece Node va executa fişierul înainte ca Babel să-l compileze.
> 
> ```js
require("babel-register");
// not compiled:
console.log("Hello world!");
```

## <a id="toc-babel-node"></a>`babel-node`

Dacă doar rulați cod prin intermediul `node` CLI, cel mai simplu mod de a integra Babel ar fi să utilizaţi `babel-node` CLI, care este în mare parte doar o înlocuire pentru `node` CLI.

Reţineţi că acest lucru nu este recomandat pentru utilizarea în producţie. Este considerată practică rea să utilizați cod compilat în acest fel. Este mult mai bine să compilaţi înainte de lansarea codului în producție. Însă acest lucru funcţionează destul de bine pentru script-uri sau alte lucruri pe care le rulați la nivel local.

În primul rând, asiguraţi-vă că aveţi `babel-cli` instalat.

```sh
$ npm install --save-dev babel-cli
```

> **Notă:** Dacă vă întrebaţi de ce instalăm acest pachet la nivel local, vă rugăm să citiţi secţiunea [Execută Babel CLI (Interfața Liniei de Comandă) în cadrul unui proiect](#toc-running-babel-cli-from-within-a-project) de mai sus.

Apoi ori de câte ori executaţi `node` înlocuiți cu `babel-node`.

Dacă utilizaţi npm `scripts`, puteţi face pur şi simplu:

```diff
  {
    "scripts": {
-     "script-name": "node script.js"
+     "script-name": "babel-node script.js"
    }
  }
```

Altfel va trebui să scrieți calea către `babel-node`.

```diff
- node script.js
+ ./node_modules/.bin/babel-node script.js
```

> Sfat: Puteţi utiliza, de asemenea, [`npm-run`](https://www.npmjs.com/package/npm-run).

## <a id="toc-babel-core"></a>`babel-core`

Dacă aveţi nevoie să utilizaţi Babel programatic, puteţi folosi pachetul `babel-core`.

Mai întâi instalați `babel-core`.

```sh
$ npm install babel-core
```

```js
var babel = require("babel-core");
```

Dacă aveţi un şir de caractere JavaScript, îl puteţi compila direct folosind `babel.transform`.

```js
babel.transform("code();", options);
// => { code, map, ast }
```

Dacă lucraţi cu fişiere, puteţi utiliza fie metoda asincronă:

```js
babel.transformFile("filename.js", options, function(err, result) {
  result; // => { code, map, ast }
});
```

Fie cea sincronă:

```js
babel.transformFileSync("filename.js", options);
// => { code, map, ast }
```

Dacă aveţi deja un AST Babel, puteți transforma direct din AST.

```js
babel.transformFromAst(ast, code, options);
// => { code, map, ast }
```

Pentru toate metodele de mai sus, `options` se referă la https://babeljs.io/docs/usage/api/#options.

* * *

# <a id="toc-configuring-babel"></a>Configurare Babel

Poate ați observat până acum că Babel în sine nu pare să facă altceva decât să copieze fişiere JavaScript dintr-o locaţie în alta.

Aceasta se întâmplă deoarece încă nu i-am specificat să facă ceva anume.

> Deoarece Babel este un compilator de uz general, care este utilizat într-o multitudine de moduri diferite, nu face nimic în mod implicit. Trebuie specificat în mod explicit ceea ce ar trebui să facă.

Puteţi configura Babel pentru scopuri specifice prin instalarea de **plugin-uri** sau **presetări** (grupuri de plugin-uri).

## <a id="toc-babelrc"></a>`.babelrc`

Înainte de a începe a-i spune lui Babel ce să facă. Avem nevoie să creăm un fişier de configurare. Tot ce trebuie să facem este să creăm un fişier `.babelrc` la rădăcina proiectului. Să incepem cu următoarele date:

```js
{
  "presets": [],
  "plugins": []
}
```

Prin intermediul acestui fișier configurăm Babel pentru a face ceea ce dorim.

> **Notă:** În timp ce există și alte metode de setare a opţiunilor Babel, utilizarea fişierul `.babelrc` este cel recomandat.

## <a id="toc-babel-preset-es2015"></a>`babel-preset-es2015`

Să începem prin a instrui Babel să compileze din ES2015 (cea mai nouă versiune a standardului JavaScript, de asemenea, cunoscut și ca ES6) în ES5 (versiunea disponibilă în cele mai multe medii JavaScript astăzi).

Vom face acest lucru prin instalarea presetării Babel "es2015":

```sh
$ npm install --save-dev babel-preset-es2015
```

Apoi vom modifica fișierul nostru `.babelrc` pentru a include această presetare.

```diff
  {
    "presets": [
+     "es2015"
    ],
    "plugins": []
  }
```

## <a id="toc-babel-preset-react"></a>`babel-preset-react`

Setarea pentru React este la fel de simplă. Doar instalați presetarea:

```sh
$ npm install --save-dev babel-preset-react
```

Apoi adăugați presetarea în fişierul `.babelrc`:

```diff
  {
    "presets": [
      "es2015",
+     "react"
    ],
    "plugins": []
  }
```

## <a id="toc-babel-preset-stage-x"></a>`babel-preset-stage-x`

JavaScript are, de asemenea, unele propuneri care își urmează drumul lor spre standard, prin procesul TC39 (Comitetul tehnic din spatele standardul ECMAScript).

Acest proces este împărțit în 5 etape (0-4). Când propunerile câştiga tracţiune şi sunt mai susceptibile de a fi acceptate în standard, ele trec prin diferitele etape, în cele din urmă fiind acceptate în standard la etapa 4.

Acestea sunt incluse în Babel ca 4 presetări diferite:

  * `babel-preset-stage-0`
  * `babel-preset-stage-1`
  * `babel-preset-stage-2`
  * `babel-preset-stage-3`

> Reţineţi că nu există nici o presetare stage-4, deoarece aceasta este pur şi simplu presetarea `es2015` de mai sus.

Fiecare dintre aceste presetări necesită presetările pentru etapele ulterioare. Adică `babel-preset-stage-1` necesită `babel-preset-stage-2`, care necesită `babel-preset-stage-3`.

Pur şi simplu instalaţi etapa dorită pentru utilizare:

```sh
$ npm install --save-dev babel-preset-stage-2
```

Apoi o puteţi adăuga în configurarea `.babelrc`.

```diff
  {
    "presets": [
      "es2015",
      "react",
+     "stage-2"
    ],
    "plugins": []
  }
```

* * *

# <a id="toc-executing-babel-generated-code"></a>Execuția codului generat de Babel

Am compilat codul cu Babel, însă nu am ajuns la finalul povestirii.

## <a id="toc-babel-polyfill"></a>`babel-polyfill`

Aproape toată sintaxa viitoare al limbajului JavaScript poate fi compilată cu Babel, dar acest lucru nu este valabil și pentru API-uri.

De exemplu, următorul cod conține o funcţie săgeată, care trebuie compilată:

```js
function addAll() {
  return Array.from(arguments).reduce((a, b) => a + b);
}
```

Care se transformă în aceasta:

```js
function addAll() {
  return Array.from(arguments).reduce(function(a, b) {
    return a + b;
  });
}
```

Cu toate acestea, acest cod încă nu va funcţiona peste tot deoarece `Array.from` nu există în fiecare mediu de JavaScript.

    Uncaught TypeError: Array.from is not a function
    

Pentru a rezolva această problemă utilizam un așa-numit [Polyfill](https://remysharp.com/2010/10/08/what-is-a-polyfill). Un polyfill nu este altceva decât o bucata de cod care replică un API nativ, ce nu există în mediul în care rulează. Acest lucru vă permite să utilizaţi API-uri, cum ar fi `Array.from`, înainte de acestea să fie disponibile.

Babel utilizează [core-js](https://github.com/zloirock/core-js) ca polyfill, împreună cu un [regenerator](https://github.com/facebook/regenerator) personalizat pentru buna funcționare a generatoarelor şi funcţiilor asincrone.

Pentru a include polyfill-ul Babel, în primul rând trebuie instalat cu npm:

```sh
$ npm install --save babel-polyfill
```

Apoi, pur şi simplu includeți polyfill-ul în partea de sus a oricărui fişier care are nevoie de el:

```js
import "babel-polyfill";
```

## <a id="toc-babel-runtime"></a>`babel-runtime`

Pentru a implementa detalii ale specificațiilor ECMAScript, Babel va folosi metode de "ajutor" pentru a păstra codul generat curat.

Deoarece aceste ajutoare pot ajunge destul de lungi, şi fiind adăugate la începutul fiecărui fişier, le puteţi muta într-o singură "instanță", care să fie inclusă.

Începeți prin instalarea pachetelor `babel-plugin-transform-runtime` și `babel-runtime`:

```sh
$ npm install --save-dev babel-plugin-transform-runtime
$ npm install --save babel-runtime
```

Apoi actualizaţi `.babelrc`:

```diff
  {
    "plugins": [
+     "transform-runtime",
      "transform-es2015-classes"
    ]
  }
```

Acum Babel va compila codul următor:

```js
class Foo {
  method() {}
}
```

În acesta:

```js
import _classCallCheck from "babel-runtime/helpers/classCallCheck";
import _createClass from "babel-runtime/helpers/createClass";

let Foo = function () {
  function Foo() {
    _classCallCheck(this, Foo);
  }

  _createClass(Foo, [{
    key: "method",
    value: function method() {}
  }]);

  return Foo;
}();
```

Altfel ar trebui ca ajutoarele `_classCallCheck` şi `_createClass` să le introducem în fiecare fişier în cazul în care acestea sunt necesare.

* * *

# <a id="toc-configuring-babel-advanced"></a>Configurare Babel (Avansată)

Cei mai mulţi oameni vor utiliza Babel folosind doar presetările sale, însă Babel expune metode mult mai puternice și mai granulate.

## <a id="toc-manually-specifying-plugins"></a>Specificarea manuală a plugin-urilor

Presetările Babel sunt pur şi simplu colecţii de plugin-uri pre-configurate, dacă vrei să faci ceva diferit de specificarea manuală a plugin-urilor. Aceasta funcţionează aproape exact la fel ca presetările.

Instalați mai întâi un plugin:

```sh
$ npm install --save-dev babel-plugin-transform-es2015-classes
```

Apoi adăugaţi câmpul `plugins` în fișierul `.babelrc`.

```diff
  {
+   "plugins": [
+     "transform-es2015-classes"
+   ]
  }
```

Acest lucru vă oferă un control mult mai fin asupra transformărilor executate.

Pentru o listă completă de plugin-uri oficiale vizitați [pagina de plugin-uri Babel](http://babeljs.io/docs/plugins/).

De asemenea, aruncați o privire la toate plugin-urile care au fost [construite de către comunitate](https://www.npmjs.com/search?q=babel-plugin). Dacă doriţi să învăţați cum să scrieți propriile plugin-uri, citiți [Manualul pentru Plugin-uri Babel](plugin-handbook.md).

## <a id="toc-plugin-options"></a>Opțiuni de plugin

Multe plugin-uri au opţiuni pentru a le configura diferite comportamente. De exemplu, multe transformări au un mod "lejer", care renunță la unele specificații în favoarea unui cod generat mai performant și mai simplu.

Pentru a adăuga opţiuni unui plug-in, faceți următoarea modificare:

```diff
  {
    "plugins": [
-     "transform-es2015-classes"
+     ["transform-es2015-classes", { "loose": true }]
    ]
  }
```

> Voi actualiza documentația plugin-urilor pentru a detalia fiecare opţiune, în următoarele săptămâni. [Urmăriţi-mă pentru actualizări](https://twitter.com/thejameskyle).

## <a id="toc-customizing-babel-based-on-environment"></a>Personalizarea Babel în funcție de modul de lucru

Plugin-urile Babel rezolvă multe sarcini diferite. Multe dintre ele sunt instrumente de dezvoltare, care pot ajuta depanarea codului sau integrarea cu diverse alte instrumente. Există, de asemenea, o mulţime de plugin-uri care sunt destinate optimizării codului în producţie.

Din acest motiv este uzuală configurarea Babel în funcție de mediu de lucru. Puteţi face acest lucru cu uşurinţă din fişierul `.babelrc`.

```diff
  {
    "presets": ["es2015"],
    "plugins": [],
+   "env": {
+     "development": {
+       "plugins": [...]
+     },
+     "production": {
+       "plugins": [...]
+     }
    }
  }
```

Babel vă permite configurarea în propritatea `env`, în funcție de mediul curent.

Mediul actual va folosi ` process.env.BABEL_ENV `. Când `BABEL_ENV` nu este disponibil, acesta va recurge la `NODE_ENV`, şi dacă nici acesta nu este disponibil, atunci va lua implicit valoarea `"development"`.

**Unix**

```sh
$ BABEL_ENV=production [COMMAND]
$ NODE_ENV=production [COMMAND]
```

**Windows**

```sh
$ SET BABEL_ENV=production
$ [COMMAND]
```

> **Notă:** `[COMMAND]` este ceea ce folosiți pentru a rula Babel (adică. `babel`, `babel-node`, sau poate doar `node` dacă utilizaţi babel-register).
> 
> **Sfat:** Dacă doriţi funcționarea atât pe platforme Unix cât şi Windows, utilizaţi [`cross-env`](https://www.npmjs.com/package/cross-env).

## <a id="toc-making-your-own-preset"></a>Crearea unei presetări

Specificarea manuală a plugin-urilor? Opţiuni ale plugin-urilor? Setãri în funcție de mediu? Toate aceste configurări pot implica multă repetiţie în diferite proiecte.

Din acest motiv este de preferat crearea propriilor presetări. Aceasta ar putea fi o presetare pentru [versiunea Node](https://github.com/leebenson/babel-preset-node5) specifică pe care o utilzați, sau o presetare pentru [întreaga](https://github.com/cloudflare/babel-preset-cf) [companie](https://github.com/airbnb/babel-preset-airbnb).

Pentru a crea o presetare este simplu. Să zicem că avem următorul fișier `.babelrc`:

```js
{
  "presets": [
    "es2015",
    "react"
  ],
  "plugins": [
    "transform-flow-strip-types"
  ]
}
```

Tot ce trebuie să faceţi este să creaţi un nou proiect, urmând convenţia de denumire `babel-preset-*` (vă rugăm să fiți responsabili cu acest spațiu de nume), alături de două fişiere.

În primul rând, creaţi un fişier nou `package.json` cu `dependenţele` presetării voastre.

```js
{
  "name": "babel-preset-my-awesome-preset",
  "version": "1.0.0",
  "author": "James Kyle <me@thejameskyle.com>",
  "dependencies": {
    "babel-preset-es2015": "^6.3.13",
    "babel-preset-react": "^6.3.13",
    "babel-plugin-transform-flow-strip-types": "^6.3.15"
  }
}
```

Apoi creați un fişier `index.js` care exportă conţinutul fişierului `.babelrc`, înlocuind textele din proprietățile plugin și preset cu apeluri `require`.

```js
module.exports = {
  presets: [
    require("babel-preset-es2015"),
    require("babel-preset-react")
  ],
  plugins: [
    require("babel-plugin-transform-flow-strip-types")
  ]
};
```

Apoi publicați-l pe npm şi folosiți-l ca orice altă presetare.

* * *

# <a id="toc-babel-and-other-tools"></a>Babel şi alte instrumente

Babel este destul de simplu de setat, odată ce te obișnuiesti cu el, dar poate fi destul de dificil să-l integrați cu alte instrumente. Cu toate acestea, încercăm să lucrăm îndeaproape cu alte proiecte pentru a face experiența cât mai plăcută.

## <a id="toc-static-analysis-tools"></a>Instrumente de analiză statică

Standardele mai noi aduc o mulţime de sintaxe noi limbajului şi instrumentele de analiză statică doar încep să profite de ele.

### <a id="toc-linting"></a>Verificare cod (Linting)

Una dintre cele mai populare instrumente pentru linting este [ESLint](http://eslint.org), din acest motiv întreținem o integrare oficială [`babel-eslint`](https://github.com/babel/babel-eslint).

Pentru început instalați `eslint` şi `babel-eslint`.

```sh
$ npm install --save-dev eslint babel-eslint
```

Apoi creați sau folosiți fişierul `.eslintrc` existent în proiectul dumneavoastră şi setaţi `parser-ul` ca `babel-eslint`.

```diff
  {
+   "parser": "babel-eslint",
    "rules": {
      ...
    }
  }
```

Acum, adăugaţi o sarcină `lint` în script-urile din `package.json`:

```diff
  {
    "name": "my-module",
    "scripts": {
+     "lint": "eslint my-files.js"
    },
    "devDependencies": {
      "babel-eslint": "...",
      "eslint": "..."
    }
  }
```

Pe urmă, doar rulaţi sarcina şi instalarea este gata.

```sh
$ npm run lint
```

Pentru mai multe informaţii consultaţi documentaţia [`babel-eslint`](https://github.com/babel/babel-eslint) sau [`eslint`](http://eslint.org).

### <a id="toc-code-style"></a>Stil de cod

> JSCS a fuzionat cu ESLint, așadar aruncați un ochi peste Code Styling cu ESLint.

JSCS este un instrument extrem de popular care duce linting-ul un pas mai departe în verificarea stilului codului. Responsabilul de bază pentru proiectele Babel şi JSCS ([@hzoo](https://github.com/hzoo)) menține o integrare oficială cu JSCS.

Mai mult de atât, această integrare face parte acum din JSCS sub opțiunea `--exnext`. Așadar integrarea cu Babel este extrem de simplă:

    $ jscs . --esnext
    

Din linia de comandă, sau adăugarea opţiunii `esnext` în fişierul `.jscsrc`.

```diff
  {
    "preset": "airbnb",
+   "esnext": true
  }
```

Pentru mai multe informaţii consultaţi documentaţia [`babel-jscs`](https://github.com/jscs-dev/babel-jscs) sau [`jscs`](http://jscs.info).

<!--
### Code Coverage

> [WIP]
-->

### <a id="toc-documentation"></a>Documentație

Folosind Babel, ES2015 şi Flux puteți deduce multe despre codul vostru. Folosind [documentation.js](http://documentation.js.org) puteţi genera documentaţii detaliate pentru API-uri foarte ușor.

Documentation.js foloseste Babel în spate pentru a suporta cea mai recentă sintaxă, inclusiv adnotări Flux pentru declararea tipurilor în codul dumneavoastră.

## <a id="toc-frameworks"></a>Framework-uri

Toate framework-urile JavaScript majore sunt axate acum pe alinierea API-uri lor cu viitor limbajului. Din acest motiv, s-a depus un efort considerabil în instrumente.

Framework-urile au posibilitatea nu doar să folosească Babel, ci chiar să-l extindă în moduri care îmbunătățesc experiența utilizatorilor lor.

### <a id="toc-react"></a>React

React şi-a schimbat dramatic API-ul pentru a se alinia cu clasele ES2015 ([Citiți despre actualizarea API-ului aici](https://babeljs.io/blog/2015/06/07/react-on-es6-plus)). Mai mult de atât, React se bazează pe Babel pentru a compila sintaxa JSX, renunțând la propriul instrument în favoarea Babel. Puteţi începe prin setarea pachetului `babel-preset-react` urmând [instrucţiunile de mai sus](#babel-preset-react).

Comunitatea React a luat Babel şi l-au folosit intens. Există acum o multitudine de transformări [construite de comunitate](https://www.npmjs.com/search?q=babel-plugin+react).

Cel mai notabil ar fi [`babel-plugin-react-transform`](https://github.com/gaearon/babel-plugin-react-transform) care combinat cu un număr de [transformări specifice React](https://github.com/gaearon/babel-plugin-react-transform#transforms) poate permite lucruri ca *reîncărcarea modulelor* şi alte utilităţi de depanare.

<!--
### Ember

> [WIP]
-->

## <a id="toc-text-editors-and-ides"></a>Editoare de text şi IDEs

Introducerea sintaxei ES2015, JSX şi Flux cu Babel poate fi de ajutor, dar dacă editorul de text nu are suport pentru acestea atunci poate fi o experienţă neplacută. Pentru acest motiv, veţi dori să vă configurați editorul de text sau IDE-ul cu un plugin Babel.

  * [Sublime Text](https://github.com/babel/babel-sublime)
  * [Atom](https://atom.io/packages/language-babel)
  * [Vim](https://github.com/jbgutierrez/vim-babel)
  * [WebStorm](https://babeljs.io/docs/setup/#webstorm)

<!--
# Debugging Babel

> [WIP]
-->

* * *

# <a id="toc-babel-support"></a>Suport Babel

Babel are o comunitate foarte mare şi în plină creştere, iar odată cu dezvoltarea noastră vrem să ne asigurăm că oamenii au toate resursele de care au nevoie pentru a avea succes. Așadar, oferim mai multe metode pentru a obţine sprijin si ajutor.

Amintiţi-vă că în toate aceste comunităţi, se aplică un [Cod de Conduită](https://github.com/babel/babel/blob/master/CODE_OF_CONDUCT.md). Dacă nu se respectă codul de conduită, vor fi luate măsuri. Așadar, vă rugăm să-l citiţi cu atenție şi sa țineți cont de el atunci când interacţionați cu ceilalţi.

Căutăm, de asemenea, să creștem o comunitate auto-susţinută, pentru persoanele care stau prin preajmă şi îi sprijină pe alţii. Dacă cineva pune o întrebare si cunoasteți răspunsul, răpiți-vă câteva minute și dați-le o mână de ajutor. Încercați să fiți blând şi înţelegător atunci când faceți acest lucru.

## <a id="toc-babel-forum"></a>Forum Babel

[Discourse](http://www.discourse.org) ne găzduiește gratuit o versiune a forum-ului lor (şi noi îi iubim pentru aceasta!). În cazul în care preferați forumurile, faceți o vizită la [discuss.babeljs.io](https://discuss.babeljs.io).

## <a id="toc-babel-chat"></a>Discuții Babel

Toată lumea iubeşte [Slack](https://slack.com). Dacă sunteţi în căutare pentru asistenţă imediată din partea comunităţii, intrați pe [slack.babeljs.io](https://slack.babeljs.io).

<!--
## Babel Stack Overflow

> [WIP]
-->

## <a id="toc-babel-issues"></a>Probleme Babel

Babel utilizează issue tracker-ul oferit de [Github](http://github.com).

Puteţi vedea toate problemele existente şi rezolvate pe [Github](https://github.com/babel/babel/issues).

Dacă doriţi să raportați o nouă problemă:

  * [Căutați dacă nu cumva a fost creată de altcineva înainte](https://github.com/babel/babel/issues)
  * [Raportați un bug](https://github.com/babel/babel/issues/new) sau [solicitați o funcționalitate nouă](https://github.com/babel/babel/issues/new)

### <a id="toc-creating-an-awesome-babel-bug-report"></a>Raportarea unei probleme Babel

Problemele Babel pot fi uneori foarte dificil de depanat la distanţă, aşa că avem nevoie de tot ajutorul posibil. Petrecerea câtorva minute în plus pentru a crea un raport frumos și util pot ajuta în rezolvarea mult mai rapidă a problemei.

În primul rând, încercaţi izolarea problemei. Este extrem de puţin probabil ca fiecare parte a setup-ul să contribuie la această problemă. În cazul în care problema este o bucată de cod de intrare, încercaţi să ştergeţi codul cât mai mult posibil care cauzează problema.

> [WIP] în lucru

* * *

> ***Pentru actualizări, urmăriţi-l pe [@thejameskyle](https://twitter.com/thejameskyle) pe Twitter.***