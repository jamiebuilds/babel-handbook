# Babel 使用手冊

本文件包含了[Babel](https://babeljs.io)及其相關工具的所有資訊。

[![cc-by-4.0](https://licensebuttons.net/l/by/4.0/80x15.png)](http://creativecommons.org/licenses/by/4.0/)

本使用手冊也提供了其它語系的版本，請參閱[讀我檔案](/README.md)以獲得完整清單。

# 目錄

  * [簡介](#toc-introduction)
  * [安裝 Babel](#toc-setting-up-babel) 
      * [`babel-cli`](#toc-babel-cli)
      * [在專案底下使用 Babel CLI](#toc-running-babel-cli-from-within-a-project)
      * [`babel-register`](#toc-babel-register)
      * [`babel-node`](#toc-babel-node)
      * [`babel-core`](#toc-babel-core)
  * [設定 Babel](#toc-configuring-babel) 
      * [`.babelrc`](#toc-babelrc)
      * [`babel-preset-es2015`](#toc-babel-preset-es2015)
      * [`babel-preset-react`](#toc-babel-preset-react)
      * [`babel-preset-stage-x`](#toc-babel-preset-stage-x)
  * [執行已轉換的程式碼](#toc-executing-babel-generated-code) 
      * [`babel-polyfill`](#toc-babel-polyfill)
      * [`babel-runtime`](#toc-babel-runtime)
  * [Babel 進階設定](#toc-configuring-babel-advanced) 
      * [手動指定外掛](#toc-manually-specifying-plugins)
      * [外掛選項](#toc-plugin-options)
      * [基於環境的 Babel 客製化](#toc-customizing-babel-based-on-environment)
      * [撰寫自己的 preset](#toc-making-your-own-preset)
  * [其他工具](#toc-babel-and-other-tools) 
      * [靜態分析工具](#toc-static-analysis-tools)
      * [Linting](#toc-linting)
      * [Code Style](#toc-code-style)
      * [撰寫說明文件](#toc-documentation)
      * [Frameworks](#toc-frameworks)
      * [React](#toc-react)
      * [IDE 及編輯器](#toc-text-editors-and-ides)
  * [技術支援](#toc-babel-support) 
      * [Babel Forum](#toc-babel-forum)
      * [Babel Chat](#toc-babel-chat)
      * [Babel Issues](#toc-babel-issues)
      * [Creating an awesome Babel bug report](#toc-creating-an-awesome-babel-bug-report)

# <a id="toc-introduction"></a>簡介

Babel 是個 JavaScript 通用型多功能編譯器。藉由 Babel ，你可享受到（或創建出）新世代的 JavaScript 及功能。

JavaScript 作為一種不斷演進的程式語言，新功能的規格制定和提議不斷推陳出新。 使用 Babel 可讓你在這些新功能廣為普及之前就先行上手。

Babel 靠的就是把你依據最新標準所寫下的程式碼編譯成時下最普及版本。 這種程序叫程式碼對程式碼編譯（source-to-source compiling），亦稱之為「轉譯」（transpiling）。

舉例來說，Babel 能將 ES2015 的新語法，arrow function：

```js
const square = n => n * n;
```

轉譯成：

```js
const square = function square(n) {
  return n * n;
};
```

不過 Babel 能做的不僅如此，它能支援擴充語法，例如能支援 React 的 JSX 語法，以及能進行靜態型別檢查的 Flow 語法。

而且在 Babel 裡，一切都是以外掛的形式存在。任何人都可創作自己的外掛，並藉由 Babel 的威力來做任何事。

*甚至更進一步地*，Babel 自身被解構成數個核心模組，任何人都可用它們來打造新一代的 JavaScript 工具。

目前已有許多人這麼做了，整個環繞著 Babel 的生態圈蓬勃發展，充滿著多樣性。 在這份手冊裡，我會談到如何被用 Babel 的內建工具，以及這社群裡的一些實用的東西。

> ***進一步的最新資訊，請追蹤[@thejameskyle](https://twitter.com/thejameskyle)的 Twitter 帳號。***

* * *

# <a id="toc-setting-up-babel"></a>安裝 Babel

由於 JavaScript 社群裡並沒有統一的建置工具、程式架構、或平臺之類的，Babel 對於所有主流工具整合都有正式的支援。 從 Gulp 到 Browserify、從 Ember 到 Meteor，無論你的建置環境如何設置，Babel 可能都正式整合進來了。

基於本手冊的宗旨，我們只會提到 Babel 內建的安裝方式。不過您可參閱互動式的[安裝頁面](http://babeljs.io/docs/setup)來得知其他整合方式的詳情。

> **注意：**本指南會提到一些命令列工具，例如：`node` 和 `npm`。在閱讀下去之前，請確保您對這些工具有夠的了解。

## <a id="toc-babel-cli"></a>`babel-cli`

Babel 的命令列介面（CLI）是編譯檔案最簡單的方法。

我們先以全域安裝的方式來學些基本的

```sh
$ npm install --global babel-cli
```

我們可以像這樣來編譯我們的第一個檔案了：

```sh
$ babel my-file.js
```

這樣會把編譯結果直接輸出到你的終端機上。要讓它輸出到檔案，我們得指定：`--out-file` 或 `-o`.

```sh
$ babel example.js --out-file compiled.js
# or
$ babel example.js -o compiled.js
```

如果我們想編譯整個目錄內的檔案，並把結果輸出到另一個目錄下，我們可以使用：`--out-dir` 或 `-d`.

```sh
$ babel src --out-dir lib
# or
$ babel src -d lib
```

### <a id="toc-running-babel-cli-from-within-a-project"></a>在專案下執行 Babel CLI

雖然您*能*在把 Babel 安裝在機器的全域之下，但在各個專案之下，進行**本地**安裝會更適合。

這麼做有兩個主要原因：

  1. 同一臺機器上的兩個專案，各自使用自己的 Babel，能讓您進行個別的更動。
  2. 如此意謂著你的工作環境不會與非必要的東西產生隱性相依，讓你的專案更具可攜性，更容易設置。

要進行本地安裝 Babel 命令列，可執行：

```sh
$ npm install --save-dev babel-cli
```

> **注意：**既然一般而言，在全域下執行 Babel 不是個好做法。您或許會想解除安裝全域下的 Babel，請執行：
> 
> ```sh
$ npm uninstall --global babel-cli
```

安裝完成後，你的 `package.json` 檔看起來應該像這樣：

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "devDependencies": {
    "babel-cli": "^6.0.0"
  }
}
```

現在，我們不是直接在命令列下執行 Babel，而是把我們的命令放進 **npm scripts** 裡，使用本地版本的 Babel。

只要在你的 `package.json` 檔裡加入 `"scripts"` 欄位，並把對 Babel 的命令放在 `build` 之後。.

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

現在，我們可以從終端機執行：

```js
npm run build
```

這樣就能跟之前一樣地執行 Babel 了，只不過使用的是本地的版本。

## <a id="toc-babel-register"></a>`babel-register`

下個經常使用 Babel 的方式是透過 `babel-register`。這種方式，只要有所需的檔案就能執行 Babel 了，這樣或許能跟你的設置做出更好的整合。

但是請注意這並不適合在正式環境中使用。 部署以此法編譯出的程式並不是好做法。 在部署之前，先把程式編譯好才比較好。 However this works quite well for build scripts or other things that you run locally.

首先，我們在專案中建立一個 `index.js` 檔。

```js
console.log("Hello world!");
```

如果我們執行 `node index.js`，Babel 不會編譯它。我們得安裝 `babel-register`.

首先，安裝 `babel-register`.

```sh
$ npm install --save-dev babel-register
```

接著在專案中建立一個 `register.js` 檔，並在其中加入下列程式碼：

```js
require("babel-register");
require("./index.js");
```

這麼做是在 Node 的模組系統中*注冊*Babel，並且開始編譯所有被 `require` 的檔案。

現在，我們可以用 `register.js` 取代 `node index.js` 了。

```sh
$ node register.js
```

> **注意：**您不能在想編譯的檔案中注冊 Babel。因為 node 會在 Babel 編譯它前就先執行它。
> 
> ```js
require("babel-register");
// not compiled:
console.log("Hello world!");
```

## <a id="toc-babel-node"></a>`babel-node`

如果您只是透過 `node` 命令列介面來執行某些程式，整合 Babel 的最簡單方式可能就是使用 `babel-node` 命令列介面了。大體上而言，它可算是 `node` 命令列介面的替代品。

但是請注意這並不適合在正式環境中使用。 部署以此法編譯出的程式並不是好做法。 在部署之前，先把程式編譯好才比較好。 However this works quite well for build scripts or other things that you run locally.

首先，請確定您己安裝了 `babel-cli`

```sh
$ npm install --save-dev babel-cli
```

> **Note:** If you are wondering why we are installing this locally, please read the [Running Babel CLI from within a project](#toc-running-babel-cli-from-within-a-project) section above.

然後在任何您執行 `node` 的地方，以 `babel-node` 取代之。.

如果您使用 npm `scripts`，您只需：

```diff
  {
    "scripts": {
-     "script-name": "node script.js"
+     "script-name": "babel-node script.js"
    }
  }
```

不然的話，你得指明 `babel-node` 的完整路徑。

```diff
- node script.js
+ ./node_modules/.bin/babel-node script.js
```

> 提示：你也可使用 [`npm-run`](https://www.npmjs.com/package/npm-run).

## <a id="toc-babel-core"></a>`babel-core`

如果您由於某種原因，需要使用程式控制 Babel，您可直接使用 `babel-core` 套件。

首先安裝 `babel-core`.

```sh
$ npm install babel-core
```

```js
var babel = require("babel-core");
```

如果您的 JavaScript 是字串形式的，您可直接使用 `babel.transform` 編譯它。.

```js
babel.transform("code();", options);
// => { code, map, ast }
```

如果是檔案形式的，您可選擇使用非同步 API：

```js
babel.transformFile("filename.js", options, function(err, result) {
  result; // => { code, map, ast }
});
```

或是同步 API：

```js
babel.transformFileSync("filename.js", options);
// => { code, map, ast }
```

無論如何，如果您已經有了 Babel 的抽象語法樹（AST），您也可直接將之編譯。

```js
babel.transformFromAst(ast, code, options);
// => { code, map, ast }
```

For all of the above methods, `options` refers to https://babeljs.io/docs/usage/api/#options.

* * *

# <a id="toc-configuring-babel"></a>設定 Babel

現在你可能注意到了，單獨執行 Babel 看來除了把 JavaScript 檔案從一處複製到另一處之外，並沒什麼其他的作用。

這是因為我們還沒告訴 Babel 要做什麼。

> 因為 Babel 是個通用型的編譯器，有各式各樣的使用方式。在預設的情況下，它不會做任何事。你得明確告訴 Babel 該做些什麼。

您可藉由安裝 **外掛程式** 或 **presets**（一組外掛程式）來指示 Babel 該做些什麼。

## <a id="toc-babelrc"></a>`.babelrc`

在我們告訴 Babel 做什麼之前，我們需要建立一個組態檔。我們需要做的只是建立一個 `.babelrc` 檔，把它放在您的專案的根目錄。剛開始它的內容就像這樣：

```js
{
  "presets": [],
  "plugins": []
}
```

這個檔案就是您用來設定 Babel，讓它執行您想做的事。

> **注意：**儘管您還是有其他方式可把各種選項傳給 Babel，但 `.babelrc` 檔仍是最常規、最好的方式。

## <a id="toc-babel-preset-es2015"></a>`babel-preset-es2015`

我們就先從叫 Babel 把 ES2015（最新版的 JavaScrpt 標準，亦稱 ES6）程式碼編譯成 ES5（大多數 JavaScript 環境都支援的版本）程式碼。

我們得安裝「ES2015」Babel preset：

```sh
$ npm install --save-dev babel-preset-es2015
```

接著，我們得修改 `.babelrc` 檔來把那 preset 包含進來。

```diff
  {
    "presets": [
+     "es2015"
    ],
    "plugins": []
  }
```

## <a id="toc-babel-preset-react"></a>`babel-preset-react`

要安裝 React 很容易，只需安裝 preset:

```sh
$ npm install --save-dev babel-preset-react
```

然後把那 preset 加入您的 `.babelrc` 檔即可：

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

JavaScript 還有些提議案正經過 TC39（ECMAScript 標準背後的技術委員會）的審議程序，準備加入標準。

這個程序被分為五個階段（0-4）。 提案獲得越多關注就越有可能被採納。它們通過各個階段審議，最後在階段4被接受並納入標準。

這些提案被包裹成四個不同的 preset：

  * `babel-preset-stage-0`
  * `babel-preset-stage-1`
  * `babel-preset-stage-2`
  * `babel-preset-stage-3`

> 注意階段4的 preset 並不存在，因為它就是上面提到的 `es2015` preset

上述各階段 preset 都相依於它下個階段的 preset，例如：`babel-preset-stage-1` 相依於 `babel-preset-stage-2`，而後者又相依於 `babel-preset-stage-3`.

要安裝您感興趣的階段只需：

```sh
$ npm install --save-dev babel-preset-stage-2
```

然後您就可把它加入您的 `.babelrc` 組態檔.

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

# <a id="toc-executing-babel-generated-code"></a>執行已轉換的程式碼

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

# <a id="toc-configuring-babel-advanced"></a>Babel 進階設定

Most people can get by using Babel with just the built-in presets, but Babel exposes much finer-grained power than that.

## <a id="toc-manually-specifying-plugins"></a>手動指定外掛

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

## <a id="toc-plugin-options"></a>外掛選項

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

## <a id="toc-customizing-babel-based-on-environment"></a>基於環境的 Babel 客製化

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

## <a id="toc-making-your-own-preset"></a>撰寫自己的 preset

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

# <a id="toc-babel-and-other-tools"></a>其他工具

Babel is pretty straight forward to setup once you get the hang of it, but it can be rather difficult navigating how to set it up with other tools. However, we try to work closely with other projects in order to make the experience as easy as possible.

## <a id="toc-static-analysis-tools"></a>靜態分析工具

Newer standards bring a lot of new syntax to the language and static analysis tools are just starting to take advantage of it.

### <a id="toc-linting"></a>Linting

One of the most popular tools for linting is [ESLint](http://eslint.org), because of this we maintain an official [`babel-eslint`](https://github.com/babel/babel-eslint) integration.

First install `eslint` and `babel-eslint`.

```sh
$ npm install --save-dev eslint babel-eslint
```

Next create or use the existing `.eslintrc` file in your project and set the `parser` as `babel-eslint`.

```diff
  {
+   "parser": "babel-eslint",
    "rules": {
      ...
    }
  }
```

Now add a `lint` task to your npm `package.json` scripts:

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

Then just run the task and you will be all setup.

```sh
$ npm run lint
```

For more information consult the [`babel-eslint`](https://github.com/babel/babel-eslint) or [`eslint`](http://eslint.org) documentation.

### <a id="toc-code-style"></a>Code Style

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

### <a id="toc-documentation"></a>撰寫說明文件

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

## <a id="toc-text-editors-and-ides"></a>IDE 及編輯器

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

# <a id="toc-babel-support"></a>技術支援

Babel has a very large and quickly growing community, as we grow we want to ensure that people have all the resources they need to be successful. So we provide a number of different channels for getting support.

Remember that across all of these communities we enforce a [Code of Conduct](https://github.com/babel/babel/blob/master/CODE_OF_CONDUCT.md). If you break the Code of Conduct, action will be taken. So please read it and be conscious of it when interacting with others.

We are also looking to grow a self-supporting community, for people who stick around and support others. If you find someone asking a question you know the answer to, take a few minutes and help them out. Try your best to be kind and understanding when doing so.

## <a id="toc-babel-forum"></a>Babel Forum

[Discourse](http://www.discourse.org) has provided us with a hosted version of their forum software for free (and we love them for it!). If forums are your thing please stop by [discuss.babeljs.io](https://discuss.babeljs.io).

## <a id="toc-babel-chat"></a>Babel Chat

Everyone loves [Slack](https://slack.com). If you're looking for immediate support from the community then come chat with us at [slack.babeljs.io](https://slack.babeljs.io).

<!--
## Babel Stack Overflow

> [WIP]
-->

## <a id="toc-babel-issues"></a>Babel Issues

Babel uses the issue tracker provided by [Github](http://github.com).

You can see all the open and closed issues on [Github](https://github.com/babel/babel/issues).

If you want to open a new issue:

  * [Search for an existing issue](https://github.com/babel/babel/issues)
  * [Create a new bug report](https://github.com/babel/babel/issues/new) or [request a new feature](https://github.com/babel/babel/issues/new)

### <a id="toc-creating-an-awesome-babel-bug-report"></a>Creating an awesome Babel bug report

Babel issues can sometimes be very difficult to debug remotely, so we need all the help we can get. Spending a few more minutes crafting a really nice bug report can help get your problem solved significantly faster.

First, try isolating your problem. It's extremely unlikely that every part of your setup is contributing to the problem. If your problem is a piece of input code, try deleting as much code as possible that still causes an issue.

> [WIP]

* * *

> ***進一步的最新資訊，請追蹤[@thejameskyle](https://twitter.com/thejameskyle)的 Twitter 帳號。***