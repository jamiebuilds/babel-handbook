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
      * [Static analysis tools](#toc-static-analysis-tools)
      * [Linting](#toc-linting)
      * [Code Style](#toc-code-style)
      * [Documentation](#toc-documentation)
      * [Frameworks](#toc-frameworks)
      * [React](#toc-react)
      * [Text Editors and IDEs](#toc-text-editors-and-ides)
  * [Отладка Babel](#toc-debugging-babel)
  * [Поддержка Babel](#toc-babel-support) 
      * [Babel форум](#toc-babel-forum)
      * [Babel чат](#toc-babel-chat)
      * [Вопросы о Babel](#toc-babel-issues)
      * [Как создать полезный баг репорт по Babel](#toc-creating-an-awesome-babel-bug-report)

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

Многие уже делают так, расширяя и без того разнообразную "экосистему" инструментов, основанных на Babel. С помощью этого руководства я постараюсь объяснить, как работают встроенные инструменты Babel и поделится некоторыми полезными замечаниями от сообщества.

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

Это выведет дамп скомпилированной директории прямо в терминал. Для записи в файл следует использовать `--out-file` или `-o`.

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

Следующий наиболее распространенный метод вызова Babel является вызов через `babel-register`. Эта опция позволит запускать Babel просто вызывая require(), возможно этот вариант лучше подойдет для вашей системы. 

Внимание: этот метод не предназначен для использования в продакшене. It's considered bad practice to deploy code that gets compiled this way. It is far better to compile ahead of time before deploying. However this works quite well for build scripts or other things that you run locally.

First let's create an `index.js` file in our project.

```js
console.log("Hello world!");
```

If we were to run this with `node index.js` this wouldn't be compiled with Babel. So instead of doing that, we'll setup `babel-register`.

First install `babel-register`.

```sh
$ npm install --save-dev babel-register
```

Next, create a `register.js` file in the project and write the following code:

```js
require("babel-register");
require("./index.js");
```

What this does is *registers* Babel in Node's module system and begins compiling every file that is `require`'d.

Now, instead of running `node index.js` we can use `register.js` instead.

```sh
$ node register.js
```

> **Note:** You can't register Babel in the same file that you want to compile. As node is executing the file before Babel has a chance to compile it.
> 
> ```js
require("babel-register");
// not compiled:
console.log("Hello world!");
```

## <a id="toc-babel-node"></a>`babel-node`

If you are just running some code via the `node` CLI the easiest way to integrate Babel might be to use the `babel-node` CLI which largely is just a drop in replacement for the `node` CLI.

Note that this is not meant for production use. It's considered bad practice to deploy code that gets compiled this way. It is far better to compile ahead of time before deploying. However this works quite well for build scripts or other things that you run locally.

First make sure that you have `babel-cli` installed.

```sh
$ npm install --save-dev babel-cli
```

> **Note:** If you are wondering why we are installing this locally, please read the [Running Babel CLI from within a project](#running-babel-cli--from-within-a-project) section above.

Then replace wherever you are running `node` with `babel-node`.

If you are using npm `scripts` you can simply do:

```diff
  {
    "scripts": {
-     "script-name": "node script.js"
+     "script-name": "babel-node script.js"
    }
  }
```

Otherwise you'll need to write out the path to `babel-node` itself.

```diff
- node script.js
+ ./node_modules/.bin/babel-node script.js
```

> Tip: You can also use [`npm-run`](https://www.npmjs.com/package/npm-run).

## <a id="toc-babel-core"></a>`babel-core`

If you need to use Babel programmatically for some reason, you can use the `babel-core` package itself.

First install `babel-core`.

```sh
$ npm install babel-core
```

```js
var babel = require("babel-core");
```

If you have a string of JavaScript you can compile it directly using `babel.transform`.

```js
babel.transform("code();", options);
// => { code, map, ast }
```

If you are working with files you can use either the asynchronous api:

```js
babel.transformFile("filename.js", options, function(err, result) {
  result; // => { code, map, ast }
});
```

Or the synchronous api:

```js
babel.transformFileSync("filename.js", options);
// => { code, map, ast }
```

If you already have a Babel AST for whatever reason you may transform from the AST directly.

```js
babel.transformFromAst(ast, code, options);
// => { code, map, ast }
```

For all of the above methods, `options` refers to http://babeljs.io/docs/usage/options/.

* * *

# <a id="toc-configuring-babel"></a>Настройка Babel

You may have noticed by now that running Babel on its own doesn't seem to do anything other than copy JavaScript files from one location to another.

This is because we haven't told Babel to do anything yet.

> Since Babel is a general purpose compiler that gets used in a myriad of different ways, it doesn't do anything by default. You have to explicitly tell Babel what it should be doing.

You can give Babel instructions on what to do by installing **plugins** or **presets** (groups of plugins).

## <a id="toc-babelrc"></a>`.babelrc`

Before we start telling Babel what to do. We need to create a configuration file. All you need to do is create a `.babelrc` file at the root of your project. Start off with it like this:

```js
{
  "presets": [],
  "plugins": []
}
```

This file is how you configure Babel to do what you want.

> **Note:** While you can also pass options to Babel in other ways the `.babelrc` file is convention and is the best way.

## <a id="toc-babel-preset-es2015"></a>`babel-preset-es2015`

Let's start by telling Babel to compile ES2015 (the newest version of the JavaScript standard, also known as ES6) to ES5 (the version available in most JavaScript environments today).

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

Babel is pretty straight forward to setup once you get the hang of it, but it can be rather difficult navigating how to set it up with other tools. Тем не менее мы стараемся работать в тесном сотрудничестве с другими проектами для того, чтобы сделать опыт как можно проще.

## <a id="toc-static-analysis-tools"></a>Static analysis tools

Newer standards bring a lot of new syntax to the language and static analysis tools are just starting to take advantage of it.

### <a id="toc-linting"></a>Линтинг (инструменты для проверки кода)

Один из самых популярных инструментов для линтинга (проверки кода) - это [ESLint](http://eslint.org), по этой причине мы поддерживаем официальную интеграцию [`babel-eslint`](https://github.com/babel/babel-eslint).

Сначала установите `eslint` и `babel-eslint`.

```sh
$ npm install --save-dev eslint babel-eslint
```

> **Примечание:** `babel-eslint` совместимость с Babel 6 в настоящее время в находится в версии пре-релиза (стадия-кандидат на то, чтобы стать стабильной). Установите [последнюю](https://github.com/babel/babel-eslint/releases) 5.0 бета версию для того, чтобы использовать его с Babel 6.

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

Everyone loves [Slack](https://slack.com). If you're looking for immediate support from the community then come chat with us at [slack.babeljs.io](https://slack.babeljs.io).

<!--
## Babel Stack Overflow

> [WIP]
-->

## <a id="toc-babel-issues"></a>Вопросы о Babel

Babel uses the awesome issue tracker provided by [Phabricator](http://phabricator.org) an open source software development platform that makes GitHub issues a nightmare of the past.

Babel's Phabricator is available at [phabricator.babeljs.io](https://phabricator.babeljs.io). You can see all the open and closed issues on [maniphest](https://phabricator.babeljs.io/maniphest/).

If you want to open a new issue:

  * [Search for an existing issue](https://phabricator.babeljs.io/maniphest/query/advanced/)
  * [Login](https://phabricator.babeljs.io/auth/start/) or [Create an account](https://phabricator.babeljs.io/auth/register/) (You can also login using GitHub, Facebook, Twitter, Google, etc.)
  * [Create a new bug report](https://phabricator.babeljs.io/maniphest/task/create/?projects=PHID-PROJ-2ufzspoyuk4udiwfnzls#R) or [request a new feature](https://phabricator.babeljs.io/maniphest/task/create/?projects=PHID-PROJ-dfaevtocl5zgjtstjijd#R)

### <a id="toc-creating-an-awesome-babel-bug-report"></a>Как создать полезный баг-репорт по Babel

Babel issues can sometimes be very difficult to debug remotely, so we need all the help we can get. Spending a few more minutes crafting a really nice bug report can help get your problem solved significantly faster.

First, try isolating your problem. It's extremely unlikely that every part of your setup is contributing to the problem. If your problem is a piece of input code, try deleting as much code as possible that still causes an issue.

> [WIP]

* * *

> ***Оставайтесь в курсе последних обовлений - подписывайтесь в Твиттере на [@thejameskyle](https://twitter.com/thejameskyle).***
