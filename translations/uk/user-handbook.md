# Довідник користувача Babel

Цей документ містить всю необхідну інформацію стосовно використання [Babel](https://babeljs.io) та відповідних інструментів.

[![cc-by-4.0](https://licensebuttons.net/l/by/4.0/80x15.png)](http://creativecommons.org/licenses/by/4.0/)

Цей довідник доступний також іншими мовами, повний список можна знайти у файлі [README](/README.md).

# Зміст

  * [Вступ](#toc-introduction)
  * [Встановлення Babel](#toc-setting-up-babel) 
      * [`babel-cli`](#toc-babel-cli)
      * [Запуск Babel CLI в рамках проекту](#toc-running-babel-cli-from-within-a-project)
      * [`babel-register`](#toc-babel-register)
      * [`babel-node`](#toc-babel-node)
      * [`babel-core`](#toc-babel-core)
  * [Налаштування Babel](#toc-configuring-babel) 
      * [`.babelrc`](#toc-babelrc)
      * [`babel-preset-es2015`](#toc-babel-preset-es2015)
      * [`babel-preset-react`](#toc-babel-preset-react)
      * [`babel-preset-stage-x`](#toc-babel-preset-stage-x)
  * [Використання коду згенерованого Babel](#toc-executing-babel-generated-code) 
      * [`babel-polyfill`](#toc-babel-polyfill)
      * [`babel-runtime`](#toc-babel-runtime)
  * [Налаштування Babel (додатково)](#toc-configuring-babel-advanced) 
      * [Вручну зазначенні плагіни](#toc-manually-specifying-plugins)
      * [Налаштування плагінів](#toc-plugin-options)
      * [Персоналізація Babel для оточення](#toc-customizing-babel-based-on-environment)
      * [Створення власного пресету (preset)](#toc-making-your-own-preset)
  * [Babel та інші інструменти](#toc-babel-and-other-tools) 
      * [Інструменти статичного аналізу](#toc-static-analysis-tools)
      * [Linting](#toc-linting)
      * [Code Style](#toc-code-style)
      * [Документація](#toc-documentation)
      * [Фреймворки](#toc-frameworks)
      * [React](#toc-react)
      * [Текстові редактори та інтегровані середовища розробки (IDE)](#toc-text-editors-and-ides)
  * [Підтримка Babel](#toc-babel-support) 
      * [Форум Babel](#toc-babel-forum)
      * [Чат Babel](#toc-babel-chat)
      * [Проблеми Babel](#toc-babel-issues)
      * [Як створити гарний баг-репорт](#toc-creating-an-awesome-babel-bug-report)

# <a id="toc-introduction"></a>Вступ

Babel - це загальний багатоцільовий компілятор для JavaScript. Використовуючи Babel, ви можете користуватися (та створювати) наступним поколінням JavaScript, а також наступним поколінням JavaScript інструментів.

JavaScript - це мова, що постійно еволюціонує завдяки новим специфікаціям та пропозиціям, які постійно втілюються в нових версіях мови. Використання Babel дозволить вам скористатися багатьма новими функціями ще до того, як вони стануть доступними усюди.

Babel досягає цього шляхом компілювання JavaScript коду, написанного з використанням останніх стандартів, у версію, яка працюватиме усюди. Цей процес також відомий як source-to-source компіляція або transpiling.

Наприклад, Babel може перетворити синтаксис нової стрілкової функції ES2015 arrow function з цього:

```js
const square = n => n * n;
```

В наступний код:

```js
const square = function square(n) {
  return n * n;
};
```

Але Babel може робити набагато більше, ніж це, оскільки Babel має вбудовану підтримку розширень синтаксису (syntax extensions), наприклад JSX синтаксис для React або синтаксис Flow для статичної перевірки типів.

Більш того, все в Babel - це плагін, тому будь-хто може створити свої власні плагіни, використовуючи всю потужність Babel на власний розсуд.

*Навіть більше*, Babel складається з кількох основних модулів, які можуть бути використані будь ким для створення JavaScript інструментів нового покоління.

І багато людей це роблять, наразі екосистема, що зросла навколо Babel, є дуже великою та різноманітною. В цьому посібнику розглянуті як інструменти вбудовані в Babel, так і деякі гарні та дуже корисні інструменти, побудовані спільнотою.

> ***Ви можете слідкувати за оновленнями в Twitter, підписавшись на [@thejameskyle](https://twitter.com/thejameskyle).***

* * *

# <a id="toc-setting-up-babel"></a>Встановлення Babel

У зв'язку з тим, що спільнота JavaScript не має єдиного стандарту по інструменту збирання проекту (build tool), фреймворку (framework), платформі (platform) і так далі, Babel має офіційні інтеграції для всих відомих систем. Будь що, від Gulp до Browserify, від Ember до Meteor, не важливо з чого складається ваш проект - ймовірно, що для нього доступна офіційна версія інтеграції.

В рамках цього посібника ми розглянемо лише вбудовані засоби встановлення Babel, але ви можете також відвідати й інтерактивну [сторінку установки](http://babeljs.io/docs/setup), щоб побачити всі доступні інтеграції.

> **Примітка:** Цей посібник посилається на інструменти командного рядка, такі як `node` та `npm`. Перш ніж продовжити, ви маєте вміти впевнено користуватися цими інструментами.

## <a id="toc-babel-cli"></a>`babel-cli`

Babel CLI - це простий спосіб компілювати файли за допомогою Babel з командного рядка.

Давайте спочатку встановимо його глобально, для того, щоб навчитися основам.

```sh
$ npm install --global babel-cli
```

Тепер ми можемо скомпілювати наш перший файл наступним чином:

```sh
$ babel my-file.js
```

Ця команда поверне скомпільований результат безпосередньо у вікно терміналу. Для того, щоб спрямувати його у файл, ми маємо викликати команду з ключем `--out-file` або `-o`.

```sh
$ babel example.js --out-file compiled.js
# або
$ babel example.js -o compiled.js
```

Якщо ми бажаємо скомпілювати всі файли в теці та покласти результати у нову теку, то маємо скористатися наступними ключами командного рядка: `--out-dir` або `-d`.

```sh
$ babel src --out-dir lib
# або
$ babel src -d lib
```

### <a id="toc-running-babel-cli-from-within-a-project"></a>Запуск Babel CLI в рамках проекту

Хоч ви і *можете* встановити Babel CLI глобально на вашому комп'ютері, все ж набагато краще встановлювати його **локально** для кожного проекту.

Для цього є дві основні причини.

  1. Різні проекти на одному комп'ютері можуть залежати від різних версій Babel, це дозволить вам оновлювати кожен проект окремо.
  2. Це означає, що у вас немає неявної залежності від середовища, в якому ви працюєте. Це робить ваш проект набагато більш портативним та простішим в налаштуванні.

Ми можемо встановити Babel CLI локально, виконавши наступну команду:

```sh
$ npm install --save-dev babel-cli
```

> **Примітка:** Оскільки, як правило, запускати Babel глобально - це погана ідея, ви можете видалити глобальну копію, виконавши команду:
> 
> ```sh
$ npm uninstall --global babel-cli
```

Після завершення інсталяції файл `package.json` повинен виглядати наступним чином:

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "devDependencies": {
    "babel-cli": "^6.0.0"
  }
}
```

Тепер, замість запуску Babel безпосередньо з командного рядка, ми додамо наші команди в **npm scripts**, які будуть використовувати нашу локальну версію.

Просто додайте поле `"scripts"` до вашого файлу `package.json` та додайте туди команди babel під ключем `build`.

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

Тепер ми можемо викликати наступну команду з нашого терміналу:

```js
npm run build
```

Ця команда запустить Babel так само, як і раніше, але тепер з використанням локальної копії Babel.

## <a id="toc-babel-register"></a>`babel-register`

Ще одним поширеним методом запуску Babel є `babel-register`. Цей параметр дозволяє запускати Babel лише за допомогою включення необхідних файлів, що може зробити інтеграцію простішою.

Зверніть увагу, що це не підходить для використання на "бойовому" сервері. Зазвичай вважається поганою практикою розгортати код, скомпільований таким чином. Набагато краще скомпілювати весь код до того, як він стане доступний кінцевому користувачу. Однак цей підход чудово працює для збирання скриптів або інших інструментів, які ви запускаєте локально.

Для початку давайте створимо файл `index.js` в нашому проекті.

```js
console.log("Hello world!");
```

Якщо ми запустимо цей файл, виконавши `node index.js` він не буде скомпільований за допомогою Babel. Тому замість безпосереднього виконання ми налаштуємо `babel-register`.

Спочатку встановимо `babel-register`.

```sh
$ npm install --save-dev babel-register
```

Наступним кроком необхідно створити файл `register.js` в нашому проекті з наступним кодом всередині:

```js
require("babel-register"); 
require("./index.js");
```

Цей файл *реєструє * Babel в якості модуля Node та починає компілювати кожен `require`'d файл.

Тепер замість того, щоб запускати наш код за допомогою `node index.js`, ми можемо скористатися файлом `register.js`.

```sh
$ node register.js
```

> **Примітка:** Ви не можете зареєструвати Babel в тому ж самому файлі, який ви хочете скомпілювати. Це пов'язано з тим, що node виконує цей файл до того, як Babel може його скомпілювати.
> 
> ```js
require("babel-register");
// не скомпілює:
console.log("Hello world!");
```

## <a id="toc-babel-node"></a>`babel-node`

Якщо ви просто запускаєте деякий код за допомогою `node` CLI, то найпростішим способом інтегрувати Babel буде використання `babel-node` CLI, який по великому рахунку просто заміняє `node` CLI.

Зверніть увагу, що це не підходить для використання на "бойовому" сервері. Зазвичай вважається поганою практикою розгортати код, скомпільований таким чином. Набагато краще скомпілювати весь код до того, як він стане доступний кінцевому користувачу. Однак цей підход чудово працює для збирання скриптів або інших інструментів, які ви запускаєте локально.

Спочатку переконайтеся, що `babel-cli` встановлений.

```sh
$ npm install --save-dev babel-cli
```

> **Note:** If you are wondering why we are installing this locally, please read the [Running Babel CLI from within a project](#toc-running-babel-cli-from-within-a-project) section above.

Потім потрібно всюди замінити виклик `node` на `babel-node`.

Якщо ви використовуєте npm `scripts`, то ви можете просто зробити:

```diff
  {
    "scripts": {
-     "script-name": "node script.js"
+     "script-name": "babel-node script.js"
    }
  }
```

В іншому випадку ви повинні будете прописати шлях до самого `babel-node`.

```diff
- node script.js
+ ./node_modules/.bin/babel-node script.js
```

> Порада: Ви також можете використати [`npm-run`](https://www.npmjs.com/package/npm-run).

## <a id="toc-babel-core"></a>`babel-core`

Якщо з деякої причини вам потрібно використовувати Babel програмно, ви можете використовувати безпосередньо сам пакет `babel-core`.

Спочатку встановіть `babel-core`.

```sh
$ npm install babel-core
```

```js
var babel = require("babel-core");
```

Якщо у вас є рядок з JavaScript кодом, то ви можете скомпілювати його безпосередньо, використовуючи `babel.transform`.

```js
babel.transform("code();", options);
// => { code, map, ast }
```

Якщо ви працюєте з файлами, то можете використовувати або асинхронний api:

```js
babel.transformFile("filename.js", options, function(err, result) {
  result; // => { code, map, ast }
});
```

Або синхронний api:

```js
babel.transformFileSync("filename.js", options);
// => { code, map, ast }
```

Якщо з тої чи іншої причини у вас вже є Babel AST, то ви може перетворити безпосередньо з AST.

```js
babel.transformFromAst(ast, code, options);
// => { code, map, ast }
```

For all of the above methods, `options` refers to https://babeljs.io/docs/usage/api/#options.

* * *

# <a id="toc-configuring-babel"></a>Налаштування Babel

Можливо, ви вже помітили, що, на перший погляд, запуск Babel сам по собі нічого не робить, окрім копіювання JavaScript файлів з одного місця до іншого.

Так відбувається тому, що ми не сказали Babel зробити що-небудь ще.

> Оскільки Babel - це компілятор загального призначення, який може використовуватися в безліч різних способів, то він не робить нічого за промовчанням. Ви маєте явно сказати Babel те, що він повинен робити.

Ви можете дати Babel інструкції про те, що він має робити, встановивиши плагіни - **plugins** або пресети - **presets** (групи плагінів).

## <a id="toc-babelrc"></a>`.babelrc`

Перш ніж ми почнемо казати Babel, що робити, нам потрібно створити файл конфігурації. Все, що вам потрібно зробити, це створити файл `.babelrc` у корені вашого проекту. Заповнимо його наступним чином:

```js
{
  "presets": [],
  "plugins": []
}
```

Цей файл містить налаштування Babel і змушує його робити те, що ви хочете.

> **Примітка:** Хоча ви й можете передаватити параметри Babel іншим чином, використання файлу `.babelrc` - це звичний і найкращий спосіб.

## <a id="toc-babel-preset-es2015"></a>`babel-preset-es2015`

Давайте скажемо Babel скомпілювати ES2015 (найновішу версію стандарту JavaScript, також відому як ES6) в ES5 (версія, що зараз доступна в більшості JavaScript середовищ).

Встановимо для цього пресет Babel "es2015":

```sh
$ npm install --save-dev babel-preset-es2015
```

Далі змінимо наш файл `.babelrc` щоб включити цей пресет.

```diff
  {
    "presets": [
+     "es2015"
    ],
    "plugins": []
  }
```

## <a id="toc-babel-preset-react"></a>`babel-preset-react`

Налаштувати React так само легко. Просто встановіть пресет:

```sh
$ npm install --save-dev babel-preset-react
```

Потім додайте пресет до вашого файлу `.babelrc`:

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

JavaScript має деякі пропозиції, які вносяться до стандарту через процес TC39 (технічний комітет по стандарту ECMAScript).

Цей процес розбитий на 5 етапів (0-4). По мірі того, як пропозиції набирають підтримку та стають майже готовими для прийняття до стандарту, вони проходять через різні етапи і нарешті приймаються у стандарт на стадії 4.

Ці етапи включені до Babel як 4 різних пресети (presets):

  * `babel-preset-stage-0`
  * `babel-preset-stage-1`
  * `babel-preset-stage-2`
  * `babel-preset-stage-3`

> Зверніть увагу, що немає пресету stage-4, оскільки він просто є згаданим вище пресетом `es2015`.

Кожен з цих пресетів вимагає пресет для більш пізніх етапів. Тобто `babel-preset-stage-1` вимагає `babel-preset-stage2`, який вимагає `babel-preset-stage-3`.

Ви можете встановити необхідний етап виконавши:

```sh
$ npm install --save-dev babel-preset-stage-2
```

Потім ви можете додати його до вашого файлу конфігурації `.babelrc`.

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

# <a id="toc-executing-babel-generated-code"></a>Використання коду згенерованого Babel

Отже, ви скомпілювали ваш код за допомогою Babel, але це ще не кінець історії.

## <a id="toc-babel-polyfill"></a>`babel-polyfill`

Майже увесь футуристичний синтаксис JavaScript можна скомпілювати за допомогою Babel, але для API це не завжди так.

Наприклад, наступний код містить стрілкову функцію (arrow function):

```js
function addAll() {
  return Array.from(arguments).reduce((a, b) => a + b);
}
```

Після компіляції він перетворюється на це:

```js
function addAll() {
  return Array.from(arguments).reduce(function(a, b) {
    return a + b;
  });
}
```

Але цей код може і не виконатися тому, що `Array.from` може існувати не в кожному JavaScript середовищі.

    Uncaught TypeError: Array.from is not a function
    

Щоб вирішити цю проблему, ми скористаємося дечим під назвою [Polyfill](https://remysharp.com/2010/10/08/what-is-a-polyfill). Кажучи простими словами, polyfill - це шматок коду, який дублює native api, котрого бракує в поточний час виконання. Це дозволяє користуватися такими API як `Array.from` ще до того, як вони стають доступними.

Babel має неперевершений [core-js](https://github.com/zloirock/core-js) в якості polyfill, а також модифікований [regenerator](https://github.com/facebook/regenerator) runtime для отримання генераторів та можливості виклику асинхронних функцій.

Щоб включити Babel polyfill, спочатку встановимо його за допомогою npm:

```sh
$ npm install --save babel-polyfill
```

А потім включаємо polyfill у верхній частині будь-якого файлу, що його використовує:

```js
import "babel-polyfill";
```

## <a id="toc-babel-runtime"></a>`babel-runtime`

Для реалізації деталей специфікації ECMAScript, Babel буде використовувати "helper" методи для того, щоб тримати згенерований код чистим.

Оскільки ці допоміжні методи можуть бути досить великими, а також вони додаються до верхньої частини всіх файлів, ви можете перемістити їх усі в один "runtime", який потім викликається.

Почніть з інсталяції `babel-plugin-transform-runtime` та `babel-runtime`:

```sh
$ npm install --save-dev babel-plugin-transform-runtime
$ npm install --save babel-runtime
```

Потім відредагуйте ваш `.babelrc`:

```diff
  {
    "plugins": [
+     "transform-runtime",
      "transform-es2015-classes"
    ]
  }
```

Тепер Babel буде компілювати даний код:

```js
class Foo {
  method() {}
}
```

В оце:

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

Замість додавання допоміжних `_classCallCheck` та `_createClass` до кожного файлу, де вони потрібні.

* * *

# <a id="toc-configuring-babel-advanced"></a>Налаштування Babel (додатково)

Більшість людей може користуватися лише вбудованими до Babel пресетами, але Babel має набагато більше потужності.

## <a id="toc-manually-specifying-plugins"></a>Вручну зазначенні плагіни

Пресети Babel - це просто колекції попередньо сконфігурованих плагінів (plugins), якщо ви хочете зробити щось по-іншому, то маєте вказати плагіни вручну. Це робиться майже так само, як і при роботі з пресетами.

Спочатку встановіть плагін:

```sh
$ npm install --save-dev babel-plugin-transform-es2015-classes
```

Потім додайте поле ` plugins ` до вашого `.babelrc`.

```diff
  {
+   "plugins": [
+     "transform-es2015-classes"
+   ]
  }
```

Це дає вам набагато більше контролю над конкретними перетвореннями.

Повний перелік офіційних плагінів знаходиться на [сторінці Babel Plugins](http://babeljs.io/docs/plugins/).

Гляньте також і на інші плагіни, які були [побудовані спільнотою](https://www.npmjs.com/search?q=babel-plugin). Якщо ви хочете дізнатися, як написати свій плагін, читайте [Довідник розробника плагінів](plugin-handbook.md).

## <a id="toc-plugin-options"></a>Налаштування плагінів

Багато плагінів також мають параметри для налаштування їхньої поведінки. Наприклад, багато перетворень мають вільний "loose" режим, який додає деяку специфічну поведінку для генерації більш простого та продуктивного коду.

Для того, щоб додати параметри до плагіна, просто зробіть наступні зміни:

```diff
  {
    "plugins": [
-     "transform-es2015-classes"
+     ["transform-es2015-classes", { "loose": true }]
    ]
  }
```

> Я ще працюю над оновленнями до документації по плагінах, щоб освітити кожен параметр найближчим часом. [Слідкуйте за моїми оновленнями](https://twitter.com/thejameskyle).

## <a id="toc-customizing-babel-based-on-environment"></a>Персоналізація Babel для оточення

Плагіни Babel вирішують багато різних завдань. Багато з них є інструментами для розробки, що можуть допомогти вам в налагодженні вашого коду або інтеграції з іншими інструментами. Є також багато плагінів, які призначені для оптимізації коду на "бойовому" сервері.

З цієї причини стало загальною практикою створювати різні налаштування Babel в залежності від середовища. Ви можете легко налаштувати це у вашому файлі `.babelrc`.

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

Babel буде використовувати необхідну конфігурацію всередині `env` в залежності від поточного середовища.

Поточне середовище буде використовувати `process.env.BABEL_ENV`. Коли `BABEL_ENV` недоступна, то буде використана `NODE_ENV`, а якщо і вона недоступна - за промовчанням буде використана `"development"`.

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

> **Примітка:** `[COMMAND]` - це будь-яка команда для запуску Babel (як то `babel`, `babel-node` чи просто `node` якщо ви використовуєте register hook).
> 
> **Порада:** Для того, щоб команди працювали як на unix так і на windows платформі - скористайтеся [`cross-env`](https://www.npmjs.com/package/cross-env).

## <a id="toc-making-your-own-preset"></a>Створення власного пресету (preset)

Обрати плагіни вручну? Налаштування плагінів? Налаштування в залежності від середовища? Всі ці налаштування можуть стати цілою купою повторень для всіх ваших проектів.

З цієї причини ми закликаємо спільноту створювати свої власні пресети. Це може бути пресет для конкретної [версії node](https://github.com/leebenson/babel-preset-node5) з якою ви працюєте, або це може бути пресет для [усієї](https://github.com/cloudflare/babel-preset-cf) вашої [компанії](https://github.com/airbnb/babel-preset-airbnb).

Пресет створити дуже легко. Скажімо у вас є цей файл `.babelrc`:

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

Все, що вам потрібно зробити - це створити новий проект, користуючись наступним іменуванням `babel-preset-*` (будь ласка, будьте відповідальним за цей простір імен) і створіть два файли.

Спочатку створіть новий файл `package.json` з необхідним ключем `dependencies` для вашого пресету.

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

Потім створіть файл `index.js`, який експортує вміст вашого файлу `.babelrc`, замінивши плагін/преcет на виклики `require`.

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

Потім просто опублікуйте цей пресет в npm, і можете користуватися ним як будь-яким іншим пресетом.

* * *

# <a id="toc-babel-and-other-tools"></a>Babel та інші інструменти

Babel досить простий в налаштуванні коли ви з ним трохи розберетеся. Але все ж вам може бути досить важко розібратися, як його налаштувати за допомогою інших інструментів. Тим не менш, ми намагаємося працювати в тісному контакті з іншими проектами для того, щоб зробити взаємодію якомога простішою.

## <a id="toc-static-analysis-tools"></a>Інструменти статичного аналізу

Новітні стандарти принесли багато нового синтаксису в мову, і інструменти статичного аналізу вже починають розуміти цей синтаксис.

### <a id="toc-linting"></a>Linting

Одним з найбільш популярних інструментів для перевірки коректності синтаксису та стилю (linting) є [ESLint](http://eslint.org). У зв'язку з цим ми підтримуємо офіційну інтеграцію [`babel-eslint`](https://github.com/babel/babel-eslint).

Спочатку встановіть `eslint` та `babel-eslint`.

```sh
$ npm install --save-dev eslint babel-eslint
```

Далі створіть або використайте існуючий файл `.eslintrc` у вашому проекті і вкажіть в ключі `parser` значення `babel-eslint`.

```diff
  {
+   "parser": "babel-eslint",
    "rules": {
      ...
    }
  }
```

Тепер додайте завдання `lint` всередині ключа scripts до вашого npm `package.json`:

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

Потім просто запустіть завдання, ось і всі налаштування.

```sh
$ npm run lint
```

Для отримання додаткової інформації відвідайте розділи документації [`babel-eslint`](https://github.com/babel/babel-eslint) або [`eslint`](http://eslint.org).

### <a id="toc-code-style"></a>Code Style

> JSCS has merged with ESLint, so checkout Code Styling with ESLint.

JSCS - надзвичайно популярний інструмент для того, щоб підняти linting на вищий рівень і навчити його перевіряти безпосередньо стиль коду. Ключовий супровідник обох - Babel і JSCS проектів ([@hzoo](https://github.com/hzoo)) підтримує офіційну інтеграцію з JSCS.

Навіть краще, ця інтеграція зараз живе в JSCS, сама по собі як параметр `--esnext`. Тому аби інтегрувати Babel, достатньо лише виконати:

    $ jscs . --esnext
    

З командного рядка, або можете додати параметр `esnext` до вашого файлу `.jscsrc`.

```diff
  {
    "preset": "airbnb",
+   "esnext": true
  }
```

Для отримання додаткової інформації відвідайте розділи документації [`babel-jscs`](https://github.com/jscs-dev/babel-jscs) або [`jscs`](http://jscs.info).

<!--
### Code Coverage

> [WIP]
-->

### <a id="toc-documentation"></a>Документація

Використовуючи Babel, ES2015 та Flow ви зможете краще пізнати свій код. А за допомогою [documentation.js](http://documentation.js.org) ви зможете з легкістю генерувати детальну документацію по API.

Documentation.js використовує Babel за лаштунками, щоб підтримувати увесь останній синтаксис, включаючи анотації Flow для того, щоб описати типи у вашому коді.

## <a id="toc-frameworks"></a>Фреймворки

Всі основні JavaScript фреймворки зараз зосереджені на підгонці своїх API навколо майбутнього мови. У зв'язку з цим було зроблено багато роботи.

Фреймворки мають можливість не тільки використовувати Babel, але й розширюють його таким чином, щоб поліпшити взаємодію з користувачем.

### <a id="toc-react"></a>React

React кардинально змінили своє API для того щоб підігнати його під класи ES2015 ([Читайте про оновлений API тут](https://babeljs.io/blog/2015/06/07/react-on-es6-plus)). Навіть більше, React спирається на Babel, щоб компілювати свій JSX синтаксис, і оголосили застарілими (deprecated) свої власні інструменти на користь Babel. Ви можете почати, налаштувавши пакет `babel-preset-react` у відповідності до [наведених вище інструкцій](#babel-preset-react).

Спільнота React одразу підтримала Babel. В даний час уже є певна кількість трансформацій [побудованих спільнотою](https://www.npmjs.com/search?q=babel-plugin+react).

Одним з найцікавіших є плагін [`babel-plugin-react-transform`](https://github.com/gaearon/babel-plugin-react-transform), який у поєднанні з низкою [специфічних для React трансформацій](https://github.com/gaearon/babel-plugin-react-transform#transforms) може робити речі накшталт *перезавантаження модулів на льоту (hot module reloading)*, а також інші засоби налагодження.

<!--
### Ember

> [WIP]
-->

## <a id="toc-text-editors-and-ides"></a>Текстові редактори та інтегровані середовища розробки (IDE)

Вивчення ES2015, JSX та синтаксису Flow разом з Babel може бути корисним, але якщо ваш текстовий редактор всього цього не підтримує, то це не сприяє отриманню гарного досвіду. З цієї причини, вам можливо доведеться встановити текстовий редактор або IDE з плагіном Babel.

  * [Sublime Text](https://github.com/babel/babel-sublime)
  * [Atom](https://atom.io/packages/language-babel)
  * [Vim](https://github.com/jbgutierrez/vim-babel)
  * [WebStorm](https://babeljs.io/docs/setup/#webstorm)

<!--
# Debugging Babel

> [WIP]
-->

* * *

# <a id="toc-babel-support"></a>Підтримка Babel

У Babel дуже велика і швидко зростаюча спільнота. Оскільки ми ростемо, ми хочемо, щоб люди мали всі ресурси для досягнення успіху. Саме тому ми пропонуємо низку каналів для отримання підтримки.

Пам'ятайте, що в усіх цих спільнотах слід дотримуватися [Кодексу Поведінки (Code of Conduct)](https://github.com/babel/babel/blob/master/CODE_OF_CONDUCT.md). Якщо ви порушите Правила Поведінки, будуть вжиті відповідні заходи. Тож, будь ласка, прочитайте ці правила та дотримуйтеся їх при взаємодії з іншими учасниками.

Ми також плануємо зосередитись на збільшенні спільноти підтримки, для людей, які можуть прийти на допомогу іншим. Якщо хтось задає питання, на яке ви знаєте відповідь, будь-ласка, виділіть кілька хвилин і домоможіть їм. Зробіть все, що у ваших силах аби бути добрим і ставтеся до питання з розумінням.

## <a id="toc-babel-forum"></a>Форум Babel

[Discourse](http://www.discourse.org) безкоштовно надали нам своє програмне забезпечення для створення форуму (і ми їх любимо за це!). Якщо форуми - це ваша стихія, будь ласка, відвідайте [discuss.babeljs.io](https://discuss.babeljs.io).

## <a id="toc-babel-chat"></a>Чат Babel

Усі люблять [Slack](https://slack.com). Якщо ви шукаєте невідкладної підтримки з боку спільноти, то відвідайте наш чат на [slack.babeljs.io](https://slack.babeljs.io).

<!--
## Babel Stack Overflow

> [WIP]
-->

## <a id="toc-babel-issues"></a>Проблеми Babel

Babel uses the issue tracker provided by [Github](http://github.com).

You can see all the open and closed issues on [Github](https://github.com/babel/babel/issues).

Якщо ви виявили проблему і хочете відкрити для цього нову тему:

  * [Пошукайте вже існуючу тему](https://github.com/babel/babel/issues)
  * [Create a new bug report](https://github.com/babel/babel/issues/new) or [request a new feature](https://github.com/babel/babel/issues/new)

### <a id="toc-creating-an-awesome-babel-bug-report"></a>Як створити гарний баг-репорт

Проблеми Babel інколи дуже важко відлагодити віддалено, то ж ми потребуємо будь-якої допомоги, яку ви зможете надати. Кілька додаткових хвилин, присвячених створенню дійсно гарного баг репорту зможуть допомогти вирішенню вашої проблеми у значно швидший термін.

По-перше, спробуйте ізолювати неполадку. Вкрай малоймовірно, що кожна частина вашої конфігурації провокує проблему. Якщо ваша проблема - це частина вхідного коду, спробуйте видалити стільки коду, наскільки це можливо до тих пір поки проблема буде існувати.

> [WIP]

* * *

> ***Ви можете слідкувати за оновленнями в Twitter, підписавшись на [@thejameskyle](https://twitter.com/thejameskyle).***