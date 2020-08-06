# Babel. Руководство Пользователя

Этот документ охватывает все, что Вы когда-либо хотели знать об использовании [Babel](https://babeljs.io) и его инструментах.

[![cc-by-4.0](https://licensebuttons.net/l/by/4.0/80x15.png)](http://creativecommons.org/licenses/by/4.0/)

Это руководство также доступно и на других языках, см. [файл README](/README.md) для получения полного списка.

# Содержание

  * [Введение](#toc-introduction)
  * [Настройка Babel](#toc-setting-up-babel) 
      * [`babel-cli`](#toc-babel-cli)
      * [Запуск Babel CLI внутри проекта](#toc-running-babel-cli-from-within-a-project)
      * [`babel-register`](#toc-babel-register)
      * [`babel-node`](#toc-babel-node)
      * [`babel-core`](#toc-babel-core)
  * [Настройка Babel](#toc-configuring-babel) 
      * [`.babelrc`](#toc-babelrc)
      * [`babel-preset-es2015`](#toc-babel-preset-es2015)
      * [`babel-preset-react`](#toc-babel-preset-react)
      * [`babel-preset-stage-x`](#toc-babel-preset-stage-x)
  * [Запуск кода, который сконструирован в Babel](#toc-executing-babel-generated-code) 
      * [`babel-polyfill`](#toc-babel-polyfill)
      * [`babel-runtime`](#toc-babel-runtime)
  * [Настройка Babel (Продвинутый уровень)](#toc-configuring-babel-advanced) 
      * [Manually specifying plugins](#toc-manually-specifying-plugins)
      * [Plugin options](#toc-plugin-options)
      * [Customizing Babel based on environment](#toc-customizing-babel-based-on-environment)
      * [Making your own preset](#toc-making-your-own-preset)
  * [Babel и другие инструменты](#toc-babel-and-other-tools) 
      * [Инструменты статического анализа](#toc-static-analysis-tools)
      * [Линтинг (инструменты для проверки кода)](#toc-linting)
      * [Code Style](#toc-code-style)
      * [Documentation](#toc-documentation)
      * [Frameworks](#toc-frameworks)
      * [React](#toc-react)
      * [Text Editors and IDEs](#toc-text-editors-and-ides)
  * [Поддержка Babel](#toc-babel-support) 
      * [Babel форум](#toc-babel-forum)
      * [Babel чат](#toc-babel-chat)
      * [Вопросы о Babel](#toc-babel-issues)
      * [Как создать полезный баг-репорт по Babel](#toc-creating-an-awesome-babel-bug-report)

# <a id="toc-introduction"></a>Введение

Babel — это универсальный многоцелевой компилятор для JavaScript. С его помощью можно использовать и создавать следующее поколение JavaScript, а также следующее поколения инструментов JavaScript.

JavaScript постоянно развивается, разрастается новыми спецификациями и предложениями, новыми функции появляются буквально каждый день. Использование Babel позволит Вам реализовать многие из этих особенностей намного лет вперед, другими словами заглянуть в будущее.

Babel делает это путем компиляции JavaScript кода, написанного по новейшим стандартам в ту версию, которая будет работать на текущей реализации. Этот процесс известен как компиляция кода.

Например, Babel может преобразовать код, написанный по новому синтаксису реализации ES2015:

```js
const square = n => n * n;
```

Вот в такой:

```js
const square = function square(n) {
  return n * n;
};
```

Тем не менее, Babel может сделать гораздо больше, поскольку он имеет поддержку для синтаксиса, например React'a или Flow.

Более того, Babel - это всего лишь плагин, и любой желающий может его использовать и создавать свои собственные плагины, используя всю мощь Babel, тем самым улучшая его.

Более того, Babel разбит на ряд основных модулей, которые любой желающий сможет использовать для создания следующего поколения инструментов JavaScript.

Многие уже делают так, расширяя и без того разнообразную "экосистему" инструментов, основанных на Babel. С помощью этого руководства я постараюсь объяснить, как работают встроенные инструменты Babel и поделиться некоторыми полезными замечаниями от сообщества.

> ***Оставайтесь в курсе последних обовлений - подписывайтесь в Твиттере на [@thejameskyle](https://twitter.com/thejameskyle).***

* * *

# <a id="toc-setting-up-babel"></a>Настройка Babel

Так как javascript-сообщество имеет не один сборщик пакетов, фреймворк, платформу и т. д., Babel имеет официальную интеграцию для всех основных инструментов. Все, от Gulp до Browserify, от Ember до Meteor, не важно каковы ваши предпочтения, - скорее всего для них найдется официальная интеграция.

В рамках целей данного руководства мы охватим только встроенные пути установки Babel, но вы также можете посетить интерактивную [страницу установки](http://babeljs.io/docs/setup) для выбора необходимых интеграций.

> **Примечание:** Это руководство будет ссылаться на инструменты командной строки такие как `node` и `npm`. Перед продолжением чтения вам следует почувствовать себя комфортно с этими инструментами.

## <a id="toc-babel-cli"></a>`babel-cli`

Интерфейс коммандной строки (Command Line Interface, CLI) Babel это простой путь для компилляции файлов с помощью Babel из коммандной строки.

Давайте вначале установим его глобально, чтобы изучить основы.

```sh
$ npm install --global babel-cli
```

Мы можем скомпиллировать наш первый файл как показано дальше:

```sh
$ babel my-file.js
```

Это выведет скомпилированный результат прямо в ваш терминал. Для записи в файл следует использовать `--out-file` или `-o`.

```sh
$ babel example.js --out-file compiled.js
# или 
$ babel example.js -o compiled.js
```

Если мы хотим скомпиллировать целую директорию в новую директорию, мы можем это сделать используя `--out-dir` или `-d`.

```sh
$ babel src --out-dir lib 
# или 
$ babel src -d lib
```

### <a id="toc-running-babel-cli-from-within-a-project"></a>Запуск Babel CLI внутри проекта

Итак, вы *можете* установить Babel CLI глобально на вашей машине, но будет гораздо лучше установить его **локально** для каждого проекта.

Есть две основные причины для этого.

  1. Разные проекты на одной машине могут основываться на разных версиях Babel, позволяя вам обновлять их только по отдельности.
  2. Это значит, что вы не будете иметь неявных зависимостей от окружения, в котором работаете и сделаете свой проект гораздо более переносимым и легким для установки.

Мы можем установить Babel CLI локально, запустив:

```sh
$ npm install --save-dev babel-cli
```

> **Примечание:** Так как запускать Babel глобально мы будем считать плохой идеей, для деинсталляции глобальной копии Babel вы можете использовать:
> 
> ```sh
$ npm uninstall --global babel-cli
```

После завершения установки, ваш файл `package.json` должен выглядеть примерно так:

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "devDependencies": {
    "babel-cli": "^6.0.0"
  }
}
```

Теперь вместо запуска Babel непосредственно из командной строки мы встроим наши команды в **npm scripts**, который будет использовать нашу локальную версию.

Просто добавьте поле `"scripts"` в ваш `package.json` и вставьте команду `build`.

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

Теперь из нашего терминала мы можем запустить:

```js
npm run build
```

Это запустит Babel так же, как раньше, но в виде локальной копии.

## <a id="toc-babel-register"></a>`babel-register`

Следующий наиболее общий способ запуска Babel используя `babel-register`. Эта опция позволит вам запускать Babel просто запрашивая необходимые файлы, которые могут упростить интеграцию.

Заметим, что это не самый подходящий вариант для продакшена. Не рекомендуется использовать код, скомпилированный подобным способом. Гораздо эффективнее скомпилировать код заранее. Тем не менее, этот вариант может подойти для сборки скриптов и других действий, которые вы захотите проделать на локальной машине.

Для начала добавим в наш проект файл `index.js`.

```js
console.log("Hello world!");
```

Если мы теперь запустим команду `node index.js`, файл не будет скомпилирован с помощью Babel. Так что вместо этого, мы установим `babel-register`.

Устанавливаем `babel-register`.

```sh
$ npm install --save-dev babel-register
```

Затем, в проекте создаем файл `register.js` и пишем следующий код:

```js
require("babel-register");
require("./index.js");
```

Таким образом мы *регистрируем* Babel в системе модулей Node и начинаем компиляцию всех файлов, добавленных в `require`.

Теперь вместо команды `node index.js` мы можем использовать `register.js`.

```sh
$ node register.js
```

> **Примечание:** Вы не сможете зарегистрировать Babel в том же файле, который собираетесь компилировать, поскольку node исполняет этот файл перед тем, как Babel доходит до его компиляции.
> 
> ```js
require("babel-register");
// not compiled:
console.log("Hello world!");
```

## <a id="toc-babel-node"></a>`babel-node`

Если вы просто запускаете некоторый код посредством `node` CLI (интерфейса командной строки), то самым легким способом подключить Babel станет, пожалуй, `babel-node` CLI, являющийся, по сути, всего лишь заменой `node` CLI.

Заметим, что это не самый подходящий вариант для продакшена. Не рекомендуется использовать код, скомпилированный подобным способом. Гораздо эффективнее скомпилировать код заранее. Тем не менее, этот вариант может подойти для сборки скриптов и других действий, которые вы захотите проделать на локальной машине.

Для начала, убедитесь, что у вас установлен `babel-cli`.

```sh
$ npm install --save-dev babel-cli
```

> **Note:** If you are wondering why we are installing this locally, please read the [Running Babel CLI from within a project](#toc-running-babel-cli-from-within-a-project) section above.

Затем, переключитесь на работу с `babel-node` везде, где вы работаете с `node`.

Если вы используете npm `scripts`, вы можете сделать так:

```diff
  {
    "scripts": {
-     "script-name": "node script.js"
+     "script-name": "babel-node script.js"
    }
  }
```

Либо вам придется прописать путь к собственно `babel-node`.

```diff
- node script.js
+ ./node_modules/.bin/babel-node script.js
```

> Подсказка: Вы также можете использовать [`npm-run`](https://www.npmjs.com/package/npm-run).

## <a id="toc-babel-core"></a>`babel-core`

Если вы хотите использовать Babel программно, то подключите пакет `babel-core`.

Установите `babel-core`.

```sh
$ npm install babel-core
```

```js
var babel = require("babel-core");
```

Если вам нужно скомпилировать строку JavaScript кода, можно воспользоваться `babel.transform`.

```js
babel.transform("code();", options);
// => { code, map, ast }
```

Если вы работаете с файлами, вы можете использовать асинхронные api:

```js
babel.transformFile("filename.js", options, function(err, result) {
  result; // => { code, map, ast }
});
```

Либо синхронные api:

```js
babel.transformFileSync("filename.js", options);
// => { code, map, ast }
```

Если у вас уже, по какой-то причине, есть Babel AST, вы можете преобразовывать непосредственно AST.

```js
babel.transformFromAst(ast, code, options);
// => { code, map, ast }
```

For all of the above methods, `options` refers to https://babeljs.io/docs/usage/api/#options.

* * *

# <a id="toc-configuring-babel"></a>Настройка Babel

Как вы могли заметить, сам по себе Babel при запуске только копирует Javascript файлы из одного места в другое.

Это происходит потому что мы еще не сказали Babel что следует делать.

> Так как Babel представляет собой компилятор общего назначения, который можно использовать множеством способов, то по умолчанию он не делает ничего. Необходимо явно указать Babel, что ему следует делать.

Вы можете снабдить Babel необходимыми инструкциями, установив **плагины** либо **пресеты** (группы плагинов).

## <a id="toc-babelrc"></a>`.babelrc`

Перед тем как мы начнем говорить Babel, что ему следует сделать, мы создадим файл конфигурации. Для этого нужно всего лишь создать файл `.babelrc` в корне вашего проекта. Запишите в него следующее:

```js
{
  "presets": [],
  "plugins": []
}
```

Используйте этот файл, чтобы настроить Babel свои специфические требования.

> **Примечание:** Хотя вы можете настроить Babel и другими путями, файл `.babelrc` является лучшим и общепризанным стандартным способом это сделать.

## <a id="toc-babel-preset-es2015"></a>`babel-preset-es2015`

Начнем с того, что укажем Babel компилировать ES2015 ( современную версию стандарта JavaScript, также известную как ES6) в ES5 ( наиболее доступную на сегодня версию в большинстве средах JavaScript).

We'll do this by installing the "es2015" Babel preset:

```sh
$ npm install --save-dev babel-preset-es2015
```

Next we'll modify our `.babelrc` to include that preset.

```diff
  {
    "presets": [
+     "es2015"
    ],
    "plugins": []
  }
```

## <a id="toc-babel-preset-react"></a>`babel-preset-react`

Setting up React is just as easy. Just install the preset:

```sh
$ npm install --save-dev babel-preset-react
```

Then add the preset to your `.babelrc` file:

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

JavaScript also has some proposals that are making their way into the standard through the TC39's (the technical committee behind the ECMAScript standard) process.

This process is broken through a 5 stage (0-4) process. As proposals gain more traction and are more likely to be accepted into the standard they proceed through the various stages, finally being accepted into the standard at stage 4.

These are bundled in babel as 4 different presets:

  * `babel-preset-stage-0`
  * `babel-preset-stage-1`
  * `babel-preset-stage-2`
  * `babel-preset-stage-3`

> Note that there is no stage-4 preset as it is simply the `es2015` preset above.

Each of these presets requires the preset for the later stages. i.e. `babel-preset-stage-1` requires `babel-preset-stage-2` which requires `babel-preset-stage-3`.

Simply install the stage you are interested in using:

```sh
$ npm install --save-dev babel-preset-stage-2
```

Then you can add it to your `.babelrc` config.

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

# <a id="toc-executing-babel-generated-code"></a>Запуск кода, который сконструирован в Babel

So you've compiled your code with Babel, but this is not the end of the story.

## <a id="toc-babel-polyfill"></a>`babel-polyfill`

Almost all futuristic JavaScript syntax can be compiled with Babel, but the same is not true for APIs.

For example, the following code has an arrow function that needs to be compiled:

```js
function addAll() {
  return Array.from(arguments).reduce((a, b) => a + b);
}
```

Which turns into this:

```js
function addAll() {
  return Array.from(arguments).reduce(function(a, b) {
    return a + b;
  });
}
```

However, this still won't work everywhere because `Array.from` doesn't exist in every JavaScript environment.

    Uncaught TypeError: Array.from is not a function
    

To solve this problem we use something called a [Polyfill](https://remysharp.com/2010/10/08/what-is-a-polyfill). Simply put, a polyfill is a piece of code that replicates a native api that does not exist in the current runtime. Allowing you to use APIs such as `Array.from` before they are available.

Babel uses the excellent [core-js](https://github.com/zloirock/core-js) as its polyfill, along with a customized [regenerator](https://github.com/facebook/regenerator) runtime for getting generators and async functions working.

To include the Babel polyfill, first install it with npm:

```sh
$ npm install --save babel-polyfill
```

Then simply include the polyfill at the top of any file that requires it:

```js
import "babel-polyfill";
```

## <a id="toc-babel-runtime"></a>`babel-runtime`

In order to implement details of ECMAScript specs, Babel will use "helper" methods in order to keep the generated code clean.

Since these helpers can get pretty long, and they get added to the top of every file you can move them into a single "runtime" which gets required.

Start by installing `babel-plugin-transform-runtime` and `babel-runtime`:

```sh
$ npm install --save-dev babel-plugin-transform-runtime
$ npm install --save babel-runtime
```

Then update your `.babelrc`:

```diff
  {
    "plugins": [
+     "transform-runtime",
      "transform-es2015-classes"
    ]
  }
```

Now Babel will compile code like the following:

```js
class Foo {
  method() {}
}
```

Into this:

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

Rather than putting the `_classCallCheck` and `_createClass` helpers in every single file where they are needed.

* * *

# <a id="toc-configuring-babel-advanced"></a>Настройка Babel (Продвинутый уровень)

Most people can get by using Babel with just the built-in presets, but Babel exposes much finer-grained power than that.

## <a id="toc-manually-specifying-plugins"></a>Manually specifying plugins

Babel presets are simply collections of pre-configured plugins, if you want to do something differently you manually specify plugins. This works almost exactly the same way as presets.

First install a plugin:

```sh
$ npm install --save-dev babel-plugin-transform-es2015-classes
```

Then add the `plugins` field to your `.babelrc`.

```diff
  {
+   "plugins": [
+     "transform-es2015-classes"
+   ]
  }
```

This gives you much finer grained control over the exact transforms you are running.

For a full list of official plugins see the [Babel Plugins page](http://babeljs.io/docs/plugins/).

Also take a look at all the plugins that have been [built by the community](https://www.npmjs.com/search?q=babel-plugin). If you would like to learn how to write your own plugin read the [Babel Plugin Handbook](plugin-handbook.md).

## <a id="toc-plugin-options"></a>Plugin options

Many plugins also have options to configure them to behave differently. For example, many transforms have a "loose" mode which drops some spec behavior in favor of simpler and more performant generated code.

To add options to a plugin, simply make the following change:

```diff
  {
    "plugins": [
-     "transform-es2015-classes"
+     ["transform-es2015-classes", { "loose": true }]
    ]
  }
```

> I'll be working on updates to the plugin documentation to detail every option in the coming weeks. [Follow me for updates](https://twitter.com/thejameskyle).

## <a id="toc-customizing-babel-based-on-environment"></a>Customizing Babel based on environment

Babel plugins solve many different tasks. Many of them are development tools that can help you debugging your code or integrate with tools. There are also a lot of plugins that are meant for optimizing your code in production.

For this reason, it is common to want Babel configuration based on the environment. You can do this easily with your `.babelrc` file.

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

Babel will enable configuration inside of `env` based on the current environment.

The current environment will use `process.env.BABEL_ENV`. When `BABEL_ENV` is not available, it will fallback to `NODE_ENV`, and if that is not available it will default to `"development"`.

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

> **Note:** `[COMMAND]` is whatever you use to run Babel (ie. `babel`, `babel-node`, or maybe just `node` if you are using the register hook).
> 
> **Tip:** If you want your command to work across unix and windows platforms then use [`cross-env`](https://www.npmjs.com/package/cross-env).

## <a id="toc-making-your-own-preset"></a>Making your own preset

Manually specifying plugins? Plugin options? Environment-based settings? All this configuration might seem like a ton of repetition for all of your projects.

For this reason, we encourage the community to create their own presets. This could be a preset for the specific [node version](https://github.com/leebenson/babel-preset-node5) you are running, or maybe a preset for your [entire](https://github.com/cloudflare/babel-preset-cf) [company](https://github.com/airbnb/babel-preset-airbnb).

It's easy to create a preset. Say you have this `.babelrc` file:

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

All you need to do is create a new project following the naming convention `babel-preset-*` (please be responsible with this namespace), and create two files.

First, create a new `package.json` file with the necessary `dependencies` for your preset.

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

Then create an `index.js` file that exports the contents of your `.babelrc` file, replacing plugin/preset strings with `require` calls.

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

Then simply publish this to npm and you can use it like you would any preset.

* * *

# <a id="toc-babel-and-other-tools"></a>Babel и другие инструменты

Babel довольно прост в установке, когда вы только начинаете знакомство с ним, однако настройка его работы с прочими инструментами может оказаться непростой задачей. Тем не менее мы тесно сотрудничаем с другими проектами, чтобы как можно сильнее упростить этот процесс.

## <a id="toc-static-analysis-tools"></a>Инструменты для статического анализа

Новейшие стандарты добавляют в язык новый синтаксис и инструменты статического анализа только начинают пользоваться этими преимуществами.

### <a id="toc-linting"></a>Линтинг (инструменты для проверки кода)

Один из самых популярных инструментов для линтинга (проверки кода) - это [ESLint](http://eslint.org), по этой причине мы поддерживаем официальную интеграцию [`babel-eslint`](https://github.com/babel/babel-eslint).

Сначала установите `eslint` и `babel-eslint`.

```sh
$ npm install --save-dev eslint babel-eslint
```

Затем создайте или используйте существующий файл `.eslintrc` в вашем проекте и установите `parser` как `babel-eslint`.

```diff
  {
+   "parser": "babel-eslint",
    "rules": {
      ...
    }
  }
```

Теперь добавьте `lint`-задачу в ваш npm `package.json` скрипт:

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

Затем просто запустите данную задачу, - вы все настроили.

```sh
$ npm run lint
```

За дальнейшей информацией обращайтесь к документации [`babel-eslint`](https://github.com/babel/babel-eslint) или [`eslint`](http://eslint.org).

### <a id="toc-code-style"></a>Стиль кода

> JSCS has merged with ESLint, so checkout Code Styling with ESLint.

JSCS is an extremely popular tool for taking linting a step further into checking the style of the code itself. A core maintainer of both the Babel and JSCS projects ([@hzoo](https://github.com/hzoo)) maintains an official integration with JSCS.

Even better, this integration now lives within JSCS itself under the `--esnext` option. So integrating Babel is as easy as:

    $ jscs . --esnext
    

From the cli, or adding the `esnext` option to your `.jscsrc` file.

```diff
  {
    "preset": "airbnb",
+   "esnext": true
  }
```

For more information consult the [`babel-jscs`](https://github.com/jscs-dev/babel-jscs) or [`jscs`](http://jscs.info) documentation.

<!--
### Code Coverage

> [WIP]
-->

### <a id="toc-documentation"></a>Documentation

Using Babel, ES2015, and Flow you can infer a lot about your code. Using [documentation.js](http://documentation.js.org) you can generate detailed API documentation very easily.

Documentation.js uses Babel behind the scenes to support all of the latest syntax including Flow annotations in order to declare the types in your code.

## <a id="toc-frameworks"></a>Frameworks

All of the major JavaScript frameworks are now focused on aligning their APIs around the future of the language. Because of this, there has been a lot of work going into the tooling.

Frameworks have the opportunity not just to use Babel but to extend it in ways that improve their users' experience.

### <a id="toc-react"></a>React

React has dramatically changed their API to align with ES2015 classes ([Read about the updated API here](https://babeljs.io/blog/2015/06/07/react-on-es6-plus)). Even further, React relies on Babel to compile it's JSX syntax, deprecating it's own custom tooling in favor of Babel. You can start by setting up the `babel-preset-react` package following the [instructions above](#babel-preset-react).

The React community took Babel and ran with it. There are now a number of transforms [built by the community](https://www.npmjs.com/search?q=babel-plugin+react).

Most notably the [`babel-plugin-react-transform`](https://github.com/gaearon/babel-plugin-react-transform) plugin which combined with a number of [React-specific transforms](https://github.com/gaearon/babel-plugin-react-transform#transforms) can enable things like *hot module reloading* and other debugging utilities.

<!--
### Ember

> [WIP]
-->

## <a id="toc-text-editors-and-ides"></a>Text Editors and IDEs

Introducing ES2015, JSX, and Flow syntax with Babel can be helpful, but if your text editor doesn't support it then it can be a really bad experience. For this reason you will want to setup your text editor or IDE with a Babel plugin.

  * [Sublime Text](https://github.com/babel/babel-sublime)
  * [Atom](https://atom.io/packages/language-babel)
  * [Vim](https://github.com/jbgutierrez/vim-babel)
  * [WebStorm](https://babeljs.io/docs/setup/#webstorm)

<!--
# Debugging Babel

> [WIP]
-->

* * *

# <a id="toc-babel-support"></a>Поддержка Babel

Babel has a very large and quickly growing community, as we grow we want to ensure that people have all the resources they need to be successful. So we provide a number of different channels for getting support.

Remember that across all of these communities we enforce a [Code of Conduct](https://github.com/babel/babel/blob/master/CODE_OF_CONDUCT.md). If you break the Code of Conduct, action will be taken. So please read it and be conscious of it when interacting with others.

We are also looking to grow a self-supporting community, for people who stick around and support others. If you find someone asking a question you know the answer to, take a few minutes and help them out. Try your best to be kind and understanding when doing so.

## <a id="toc-babel-forum"></a>Babel форум

[Discourse](http://www.discourse.org) has provided us with a hosted version of their forum software for free (and we love them for it!). If forums are your thing please stop by [discuss.babeljs.io](https://discuss.babeljs.io).

## <a id="toc-babel-chat"></a>Babel чат

Все любят [Slack](https://slack.com). Если вы ищите оперативную помощь со стороны сообщества, тогда заходите к нам в чат [slack.babeljs.io](https://slack.babeljs.io)..

<!--
## Babel Stack Overflow

> [WIP]
-->

## <a id="toc-babel-issues"></a>Вопросы о Babel

Babel uses the issue tracker provided by [Github](http://github.com).

You can see all the open and closed issues on [Github](https://github.com/babel/babel/issues).

If you want to open a new issue:

  * [Search for an existing issue](https://github.com/babel/babel/issues)
  * [Create a new bug report](https://github.com/babel/babel/issues/new) or [request a new feature](https://github.com/babel/babel/issues/new)

### <a id="toc-creating-an-awesome-babel-bug-report"></a>Как создать полезный баг-репорт по Babel

Babel issues can sometimes be very difficult to debug remotely, so we need all the help we can get. Spending a few more minutes crafting a really nice bug report can help get your problem solved significantly faster.

First, try isolating your problem. It's extremely unlikely that every part of your setup is contributing to the problem. If your problem is a piece of input code, try deleting as much code as possible that still causes an issue.

> [WIP]

* * *

> ***Оставайтесь в курсе последних обовлений - подписывайтесь в Твиттере на [@thejameskyle](https://twitter.com/thejameskyle).***