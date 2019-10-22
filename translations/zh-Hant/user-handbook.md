# Babel 用戶手冊

這本手冊涵蓋了關於 [Babel](https://babeljs.io) 的使用及其相關工具的內容。

[![cc-by-4.0](https://licensebuttons.net/l/by/4.0/80x15.png)](http://creativecommons.org/licenses/by/4.0/)

這本手冊提供了多種語言的版本，查看 [自述文件](/README.md) 里的完整列表。

# 目錄

  * [介紹](#toc-introduction)
  * [安裝 Babel](#toc-setting-up-babel) 
      * [`babel-cli`](#toc-babel-cli)
      * [在項目內運行 Babel CLI](#toc-running-babel-cli-from-within-a-project)
      * [`babel-register`](#toc-babel-register)
      * [`babel-node`](#toc-babel-node)
      * [`babel-core`](#toc-babel-core)
  * [配置 Babel](#toc-configuring-babel) 
      * [`.babelrc`](#toc-babelrc)
      * [`babel-preset-es2015`](#toc-babel-preset-es2015)
      * [`babel-preset-react`](#toc-babel-preset-react)
      * [`babel-preset-stage-x`](#toc-babel-preset-stage-x)
  * [執行 Babel 生成的代碼](#toc-executing-babel-generated-code) 
      * [`babel-polyfill`](#toc-babel-polyfill)
      * [`babel-runtime`](#toc-babel-runtime)
  * [配置 Babel（進階）](#toc-configuring-babel-advanced) 
      * [手動指定插件](#toc-manually-specifying-plugins)
      * [插件選項](#toc-plugin-options)
      * [基於環境自定義 Babel](#toc-customizing-babel-based-on-environment)
      * [製作你自己的預設（preset）](#toc-making-your-own-preset)
  * [Babel 和其他工具](#toc-babel-and-other-tools) 
      * [靜態分析工具](#toc-static-analysis-tools)
      * [語法檢查（Linting）](#toc-linting)
      * [代碼風格](#toc-code-style)
      * [文檔](#toc-documentation)
      * [框架](#toc-frameworks)
      * [React](#toc-react)
      * [文本編輯器和 IDEs（集成開發環境）](#toc-text-editors-and-ides)
  * [Babel 支持](#toc-babel-support) 
      * [Babel 論壇](#toc-babel-forum)
      * [Babel 聊天](#toc-babel-chat)
      * [Babel 問題](#toc-babel-issues)
      * [創建漂亮的 Babel 錯誤報告](#toc-creating-an-awesome-babel-bug-report)

# <a id="toc-introduction"></a>介紹

Babel 是一個通用的多用途 JavaScript 編譯器。通過 Babel 你可以使用（並創建）下一代的 JavaScript，以及下一代的 JavaScript 工具。

作為一種語言，JavaScript 在不斷發展，新的標準／提案和新的特性層出不窮。 在得到廣泛普及之前，Babel 能夠讓你提前（甚至數年）使用它們。

Babel 把用最新標準編寫的 JavaScript 代碼向下編譯成可以在今天隨處可用的版本。 這一過程叫做“源碼到源碼”編譯， 也被稱為轉換編譯（transpiling，是一個自造合成詞，即轉換＋編譯。以下也簡稱為轉譯）。

例如，Babel 能夠將新的 ES2015 箭頭函數語法：

```js
const square = n => n * n;
```

轉譯為：

```js
const square = function square(n) {
  return n * n;
};
```

不過 Babel 的用途並不止於此，它支持語法擴展，能支持像 React 所用的 JSX 語法，同時還支持用於靜態類型檢查的流式語法（Flow Syntax）。

更重要的是，Babel 的一切都是簡單的插件，誰都可以創建自己的插件，利用 Babel 的全部威力去做任何事情。

*再進一步*，Babel 自身被分解成了數個核心模塊，任何人都可以利用它們來創建下一代的 JavaScript 工具。

已經有很多人都這樣做了，圍繞着 Babel 湧現出了非常大規模和多樣化的生態系統。 在這本手冊中，我將介紹如何使用 Babel 的內建工具以及一些來自於社區的非常有用的東西。

> ***在 Twitter 上關注 [@thejameskyle](https://twitter.com/thejameskyle)，第一時間獲取更新。***

* * *

# <a id="toc-setting-up-babel"></a>安裝 Babel

由於 JavaScript 社區沒有統一的構建工具、框架、平台等等，因此 Babel 正式集成了對所有主流工具的支持。 從 Gulp 到 Browserify，從 Ember 到 Meteor，不管你的環境設置如何，Babel 都有正式的集成支持。

本手冊的目的主要是介紹 Babel 內建方式的安裝，不過你可以訪問交互式的[安裝頁面](http://babeljs.io/docs/setup)來查看其它的整合方式。

> **注意：** 本手冊將涉及到一些命令行工具如 `node` 和 `npm`。在繼續閱讀之前請確保你已經熟悉這些工具了。

## <a id="toc-babel-cli"></a>`babel-cli`

Babel 的 CLI 是一種在命令行下使用 Babel 編譯文件的簡單方法。

讓我們先全局安裝它來學習基礎知識。

```sh
$ npm install --global babel-cli
```

我們可以這樣來編譯我們的第一個文件：

```sh
$ babel my-file.js
```

這將把編譯後的結果直接輸出至終端。使用 `--out-file` 或着 `-o` 可以將結果寫入到指定的文件。

```sh
$ babel example.js --out-file compiled.js
# 或
$ babel example.js -o compiled.js
```

如果我們想要把一個目錄整個編譯成一個新的目錄，可以使用 `--out-dir` 或者 `-d`。

```sh
$ babel src --out-dir lib
# 或
$ babel src -d lib
```

### <a id="toc-running-babel-cli-from-within-a-project"></a>在項目內運行 Babel CLI

儘管你 *可以* 把 Babel CLI 全局安裝在你的機器上，但是按項目逐個安裝在 **本地** 會更好。

有兩個主要的原因。

  1. 在同一台機器上的不同項目或許會依賴不同版本的 Babel 並允許你有選擇的更新。
  2. 這意味着你對工作環境沒有隱式依賴，這讓你的項目有很好的可移植性並且易於安裝。

要在（項目）本地安裝 Babel CLI 可以運行：

```sh
$ npm install --save-dev babel-cli
```

> **注意：** 因為全局運行 Babel 通常不是什麼好習慣所以如果你想要卸載全局安裝的 Babel 的話，可以運行：
> 
> ```sh
> $ npm uninstall --global babel-cli
> ```

安裝完成後，你的 `package.json` 應該如下所示：

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "devDependencies": {
    "babel-cli": "^6.0.0"
  }
}
```

現在，我們不直接從命令行運行 Babel 了，取而代之我們將把運行命令寫在 **npm scripts** 里，這樣可以使用 Babel 的本地版本。

只需將 `"scripts"` 字段添加到你的 `package.json` 文件內並且把 babel 命令寫成 `build` 字段。

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

現在可以在終端里運行：

```js
npm run build
```

這將以與之前同樣的方式運行 Babel，但這一次我們使用的是本地副本。

## <a id="toc-babel-register"></a>`babel-register`

下一個常用的運行 Babel 的方法是通過 `babel-register`。這種方法只需要引入文件就可以運行 Babel，或許能更好地融入你的項目設置。

但請注意這種方法並不適合正式產品環境使用。 直接部署用此方式編譯的代碼不是好的做法。 在部署之前預先編譯會更好。 不過用在構建腳本或是其他本地運行的腳本中是非常合適的。

讓我們先在項目中創建 `index.js` 文件。

```js
console.log("Hello world!");
```

如果我們用 `node index.js` 來運行它是不會使用 Babel 來編譯的。所以我們需要設置 `babel-register`。

首先安裝 `babel-register`。.

```sh
$ npm install --save-dev babel-register
```

接着，在項目中創建 `register.js` 文件並添加如下代碼：

```js
require("babel-register");
require("./index.js");
```

這樣做可以把 Babel *註冊* 到 Node 的模塊系統中並開始編譯其中 `require` 的所有文件。

現在我們可以使用 `register.js` 來代替 `node index.js` 來運行了。

```sh
$ node register.js
```

> **注意：** 你不能在你要編譯的文件內同時註冊 Babel，因為 node 會在 Babel 編譯它之前就將它執行了。
> 
> ```js
> require("babel-register");
> // 未編譯的：
> console.log("Hello world!");
> ```

## <a id="toc-babel-node"></a>`babel-node`

如果你要用 `node` CLI 來運行代碼，那麼整合 Babel 最簡單的方式就是使用 `babel-node` CLI，它是 `node` CLI 的替代品。

但請注意這種方法並不適合正式產品環境使用。 直接部署用此方式編譯的代碼不是好的做法。 在部署之前預先編譯會更好。 不過用在構建腳本或是其他本地運行的腳本中是非常合適的。

首先確保 `babel-cli` 已經安裝了。

```sh
$ npm install --save-dev babel-cli
```

> **注意:** 如果您想知道我們為什麼要在本地安裝，請閱讀 上面[在項目內運行Babel CLI](#toc-running-babel-cli-from-within-a-project)的部分。

然後用 `babel-node` 來替代 `node` 運行所有的代碼 。.

如果用 npm `scripts` 的話只需要這樣做：

```diff
  {
    "scripts": {
-     "script-name": "node script.js"
+     "script-name": "babel-node script.js"
    }
  }
```

要不然的話你需要寫全 `babel-node` 的路徑。

```diff
- node script.js
+ ./node_modules/.bin/babel-node script.js
```

> 提示：你可以使用 [`npm-run`](https://www.npmjs.com/package/npm-run)。.

## <a id="toc-babel-core"></a>`babel-core`

如果你需要以編程的方式來使用 Babel，可以使用 `babel-core` 這個包。

首先安裝 `babel-core`。.

```sh
$ npm install babel-core
```

```js
var babel = require("babel-core");
```

字符串形式的 JavaScript 代碼可以直接使用 `babel.transform` 來編譯。

```js
babel.transform("code();", options);
// => { code, map, ast }
```

如果是文件的話，可以使用異步 api：

```js
babel.transformFile("filename.js", options, function(err, result) {
  result; // => { code, map, ast }
});
```

或者是同步 api：

```js
babel.transformFileSync("filename.js", options);
// => { code, map, ast }
```

要是已經有一個 Babel AST（抽象語法樹）了就可以直接從 AST 進行轉換。

```js
babel.transformFromAst(ast, code, options);
// => { code, map, ast }
```

對於上述所有方法，`options` 指的都是 http://babeljs.io/docs/usage/options/

* * *

# <a id="toc-configuring-babel"></a>配置 Babel

你或許已經注意到了，目前為止通過運行 Babel 自己我們並沒能“翻譯”代碼，而僅僅是把代碼從一處拷貝到了另一處。

這是因為我們還沒告訴 Babel 要做什麼。

> 由於 Babel 是一個可以用各種花樣去使用的通用編譯器，因此默認情況下它反而什麼都不做。你必須明確地告訴 Babel 應該要做什麼。

你可以通過安裝 **插件（plugins）** 或 **預設（presets，也就是一組插件）** 來指示 Babel 去做什麼事情。

## <a id="toc-babelrc"></a>`.babelrc`

在我們告訴 Babel 該做什麼之前，我們需要創建一個配置文件。你需要做的就是在項目的根路徑下創建 `.babelrc` 文件。然後輸入以下內容作為開始：

```js
{
  "presets": [],
  "plugins": []
}
```

這個文件就是用來讓 Babel 做你要它做的事情的配置文件。

> **注意：** 儘管你也可以用其他方式給 Babel 傳遞選項，但 `.babelrc` 文件是約定也是最好的方式。

## <a id="toc-babel-preset-es2015"></a>`babel-preset-es2015`

我們先從讓 Babel 把 ES2015（最新版本的 JavaScript 標準，也叫做 ES6）編譯成 ES5（現今在大多數 JavaScript 環境下可用的版本）開始吧。

我們需要安裝 "es2015" Babel 預設：

```sh
$ npm install --save-dev babel-preset-es2015
```

我們修改 `.babelrc` 來包含這個預設。

```diff
  {
    "presets": [
+     "es2015"
    ],
    "plugins": []
  }
```

## <a id="toc-babel-preset-react"></a>`babel-preset-react`

設置 React 一樣容易。只需要安裝這個預設：

```sh
$ npm install --save-dev babel-preset-react
```

然後在 `.babelrc` 文件里補充：

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

JavaScript 還有一些提案，正在積極通過 TC39（ECMAScript 標準背後的技術委員會）的流程成為標準的一部分。

這個流程分為 5（0－4）個階段。 隨着提案得到越多的關注就越有可能被標準採納，於是他們就繼續通過各個階段，最終在階段 4 被標準正式採納。

以下是4 個不同階段的（打包的）預設：

  * `babel-preset-stage-0`
  * `babel-preset-stage-1`
  * `babel-preset-stage-2`
  * `babel-preset-stage-3`

> 注意 stage-4 預設是不存在的因為它就是上面的 `es2015` 預設。

以上每種預設都依賴於緊隨的後期階段預設。例如，`babel-preset-stage-1` 依賴 `babel-preset-stage-2`，後者又依賴 `babel-preset-stage-3`。.

使用的時候只需要安裝你想要的階段就可以了：

```sh
$ npm install --save-dev babel-preset-stage-2
```

然後添加進你的 `.babelrc` 配置文件。

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

# <a id="toc-executing-babel-generated-code"></a>執行 Babel 生成的代碼

即便你已經用 Babel 編譯了你的代碼，但這還不算完。

## <a id="toc-babel-polyfill"></a>`babel-polyfill`

Babel 幾乎可以編譯所有時新的 JavaScript 語法，但對於 APIs 來說卻並非如此。

比方說，下列含有箭頭函數的需要編譯的代碼：

```js
function addAll() {
  return Array.from(arguments).reduce((a, b) => a + b);
}
```

最終會變成這樣：

```js
function addAll() {
  return Array.from(arguments).reduce(function(a, b) {
    return a + b;
  });
}
```

然而，它依然無法隨處可用因為不是所有的 JavaScript 環境都支持 `Array.from`。

    Uncaught TypeError: Array.from is not a function
    

為了解決這個問題，我們使用一種叫做 [Polyfill（代碼填充，也可譯作兼容性補丁）](https://remysharp.com/2010/10/08/what-is-a-polyfill) 的技術。 簡單地說，polyfill 即是在當前運行環境中用來複制（意指模擬性的複製，而不是拷貝）尚不存在的原生 api 的代碼。 能讓你提前使用還不可用的 APIs，`Array.from` 就是一個例子。

Babel 用了優秀的 [core-js](https://github.com/zloirock/core-js) 用作 polyfill，並且還有定製化的 [regenerator](https://github.com/facebook/regenerator) 來讓 generators（生成器）和 async functions（異步函數）正常工作。

要使用 Babel polyfill，首先用 npm 安裝它：

```sh
$ npm install --save babel-polyfill
```

然後只需要在文件頂部導入 polyfill 就可以了：

```js
import "babel-polyfill";
```

## <a id="toc-babel-runtime"></a>`babel-runtime`

為了實現 ECMAScript 規範的細節，Babel 會使用“助手”方法來保持生成代碼的整潔。

由於這些助手方法可能會特別長並且會被添加到每一個文件的頂部，因此你可以把它們統一移動到一個單一的“運行時（runtime）”中去。

通過安裝 `babel-plugin-transform-runtime` 和 `babel-runtime` 來開始。

```sh
$ npm install --save-dev babel-plugin-transform-runtime
$ npm install --save babel-runtime
```

然後更新 `.babelrc`：

```diff
  {
    "plugins": [
+     "transform-runtime",
      "transform-es2015-classes"
    ]
  }
```

現在，Babel 會把這樣的代碼：

```js
class Foo {
  method() {}
}
```

編譯成：

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

這樣就不需要把 `_classCallCheck` 和 `_createClass` 這兩個助手方法放進每一個需要的文件里去了。

* * *

# <a id="toc-configuring-babel-advanced"></a>配置 Babel（進階）

大多數人使用 Babel 的內建預設就足夠了，不過 Babel 提供了更多更細粒度的能力。

## <a id="toc-manually-specifying-plugins"></a>手動指定插件

Babel 預設就是一些預先配置好的插件的集合，如果你想要做一些不一樣的事情你會手動去設定插件，這和使用預設幾乎完全相同。

首先安裝插件：

```sh
$ npm install --save-dev babel-plugin-transform-es2015-classes
```

然後往 `.babelrc` 文件添加 `plugins` 字段。.

```diff
  {
+   "plugins": [
+     "transform-es2015-classes"
+   ]
  }
```

這能讓你對正在使用的轉換器進行更細緻的控制。

完整的官方插件列表請見 [Babel 插件頁面](http://babeljs.io/docs/plugins/)。.

同時也別忘了看看[由社區構建的其他插件](https://www.npmjs.com/search?q=babel-plugin)。 如果你想學習如何編寫自己的插件可以閱讀 [Babel 插件手冊](plugin-handbook.md)。

## <a id="toc-plugin-options"></a>插件選項

很多插件也有選項用於配置他們自身的行為。 例如，很多轉換器都有“寬鬆”模式，通過放棄一些標準中的行為來生成更簡化且性能更好的代碼。

要為插件添加選項，只需要做出以下更改：

```diff
  {
    "plugins": [
-     "transform-es2015-classes"
+     ["transform-es2015-classes", { "loose": true }]
    ]
  }
```

> 接下來幾周內我會更新插件文檔來詳細介紹每一個選項。[關注我以獲知更新](https://twitter.com/thejameskyle)。.

## <a id="toc-customizing-babel-based-on-environment"></a>基於環境自定義 Babel

Babel 插件解決許多不同的問題。 其中大多數是開發工具，可以幫助你調試代碼或是與工具集成。 也有大量的插件用於在生產環境中優化你的代碼。

因此，想要基於環境來配置 Babel 是很常見的。你可以輕鬆的使用 `.babelrc` 文件來達成目的。

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

Babel 將根據當前環境來開啟 `env` 下的配置。

當前環境可以使用 `process.env.BABEL_ENV` 來獲得。 如果 `BABEL_ENV` 不可用，將會替換成 `NODE_ENV`，並且如果後者也沒有設置，那麼缺省值是`"development"`。.

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

> **注意：** `[COMMAND]` 指的是任意一個用來運行 Babel 的命令（如：`babel`，`babel-node`，或是 `node`，如果你使用了 register 鉤子的話）。
> 
> **提示：** 如果你想要讓命令能夠跨 unix 和 windows 平台運行的話，可以使用 [`cross-env`](https://www.npmjs.com/package/cross-env)。

## <a id="toc-making-your-own-preset"></a>製作你自己的預設（preset）

手動指定插件？插件選項？環境特定設置？所有這些配置都會在你的項目里產生大量的重複工作。

為此，我們鼓勵社區創建自己的預設。 這可能是一個針對特定 [node 版本](https://github.com/leebenson/babel-preset-node5)的預設，或是適用於你[整個](https://github.com/cloudflare/babel-preset-cf)[公司](https://github.com/airbnb/babel-preset-airbnb)的預設。

創建預設非常容易。比方說你這樣一個 `.babelrc` 文件：

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

你要做的就是依循命名約定 `babel-preset-*` 來創建一個新項目（請務必對這個命名約定保持責任心，也就是說不要濫用這個命名空間），然後創建兩個文件。

首先，創建一個 `package.json`，包括針對預設所必要的 `dependencies`。

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

然後創建 `index.js` 文件用於導出 `.babelrc` 的內容，使用對應的 `require` 調用來替換 plugins／presets 字符串。

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

然後只需要發布到 npm 於是你就可以像其它預設一樣來使用你的預設了。

* * *

# <a id="toc-babel-and-other-tools"></a>Babel 和其他工具

一旦你掌握的竅門，安裝 Babel 還是十分簡明的，不過和其他工具搭配在一起就會變得困難多了。 不過我們一直在與其他項目密切合作以確保這種體驗儘可能簡單。

## <a id="toc-static-analysis-tools"></a>靜態分析工具

新標準為語言帶來了許多新的語法，靜態分析工具正在將此利用起來。

### <a id="toc-linting"></a>語法檢查（Linting）

[ESLint](http://eslint.org) 是最流行的語法檢查工具之一，因此我們維護了一個官方的 [`babel-eslint`](https://github.com/babel/babel-eslint) 整合軟件包。

首先安裝 `eslint` 和 `babel-eslint`。

```sh
$ npm install --save-dev eslint babel-eslint
```

然後創建或使用項目現有的 `.eslintrc` 文件並設置 `parser` 為 `babel-eslint`。

```diff
  {
+   "parser": "babel-eslint",
    "rules": {
      ...
    }
  }
```

現在添加一個 `lint` 任務到 npm 的 `package.json` 腳本中：

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

接着只需要運行這個任務就一切就緒了。

```sh
$ npm run lint
```

詳細信息請諮詢 [`babel-eslint`](https://github.com/babel/babel-eslint) 或者 [`eslint`](http://eslint.org) 的文檔。

### <a id="toc-code-style"></a>代碼風格

> JSCS已經和ESLint合并，所以請查看ESLint的代碼風格。

JSCS 是一個極受歡迎的工具，在語法檢查的基礎上更進一步檢查代碼自身的風格。 Babel 和 JSCS 項目的核心維護者之一（[@hzoo](https://github.com/hzoo)）維護着 JSCS 的官方集成。

更妙的是，JSCS 自己通過 `--esnext` 選項實現了這種集成，於是和 Babel 的集成就簡化成了直接在命令行運行：
```sh
$ jscs . --esnext
```   

或者在 `.jscsrc` 文件里添加 `esnext` 選項。

```diff
  {
    "preset": "airbnb",
+   "esnext": true
  }
```

詳細信息請諮詢 [`babel-jscs`](https://github.com/jscs-dev/babel-jscs) 或是 [`jscs`](http://jscs.info) 的文檔。

<!--
### Code Coverage

> [WIP]
-->

### <a id="toc-documentation"></a>文檔

使用 Babel，ES2015，還有 Flow 你可以對你的代碼進行大量的推斷。使用 [documentation.js](http://documentation.js.org) 可以非常簡便地生成詳細的 API 文檔。

Documentation.js 使用 Babel 來支持所有最新的語法，包括用於在你的代碼中聲明類型所用的 Flow 註解在內，

## <a id="toc-frameworks"></a>框架

所有主流的 JavaScript 框架都正在努力調整他們的 APIs 向這門語言的未來看齊。有鑒於此，配套工具方面已經做出了大量的工作。

除了使用 Babel 以外，框架更有條件去擴展 Babel 來幫助他們提升用戶體驗。

### <a id="toc-react"></a>React

React 已經大幅改變了他們的 API 以適應 ES2015 的類語法（[此處了解更新的 API](https://babeljs.io/blog/2015/06/07/react-on-es6-plus)）。 特別是 React 現在依賴 Babel 編譯它的 JSX 語法且棄用了它原有的自定義工具。 你可以按照[上述說明](#babel-preset-react)安裝 `babel-preset-react` 包來開始。

React 社區採用 Babel 並圍繞它來運行，現在社區已經創建了[大量的轉換器（transforms）](https://www.npmjs.com/search?q=babel-plugin+react)。

最令人矚目的是 [`babel-plugin-react-transform`](https://github.com/gaearon/babel-plugin-react-transform) 插件，它集成了大量 [React 專用轉換器](https://github.com/gaearon/babel-plugin-react-transform#transforms)可以啟用諸如 *熱模塊重載* 等其他調試工具。

<!--
### Ember

> [WIP]
-->

## <a id="toc-text-editors-and-ides"></a>文本編輯器和 IDEs（集成開發環境）

通過 Babel 引入 ES2015，JSX，和流式語法固然是大有裨益，可如果你的文本編輯不支持那可就糟糕透了。 因此，別忘了為你的文本編輯器或是 IDE 安裝 Babel 插件。

  * [Sublime Text](https://github.com/babel/babel-sublime)
  * [Atom](https://atom.io/packages/language-babel)
  * [Vim](https://github.com/jbgutierrez/vim-babel)
  * [WebStorm](https://babeljs.io/docs/setup/#webstorm)

<!--
# Debugging Babel

> [WIP]
-->

* * *

# <a id="toc-babel-support"></a>Babel 支持

Babel 的社區非常龐大並且增長速度很快，伴隨着我們成長的同時我們希望保證人們總能獲取他們需要的所有資源。 所以我們提供了數種途徑來提供支持。

謹記在所有的這些溝通渠道里我們都共同遵守一套[行為準則](https://github.com/babel/babel/blob/master/CODE_OF_CONDUCT.md)。 破壞準則的行為會被處理。 所以請閱讀它並在與他人互動時注意自己的行為。

同時我們也在尋求發展一個自我支持式的社區，為那些始終熱誠奉獻的人們。 如果別人問的問題你恰好知道答案，請不吝花費幾分鐘幫幫他們。 在此過程中也請儘力保持友善與相互理解。

## <a id="toc-babel-forum"></a>Babel 論壇

[Discourse](http://www.discourse.org) 免費為我們提供了一個託管版本的論壇（我們愛死他們了！）。 如果你是個論壇控請不要錯過 [discuss.babeljs.io](https://discuss.babeljs.io)。

## <a id="toc-babel-chat"></a>Babel 聊天

無人不愛 [Slack](https://slack.com)。如果你正在尋求來自社區的即時支持，那就來 [slack.babeljs.io](https://slack.babeljs.io) 和我們聊天吧。

<!--
## Babel Stack Overflow

> [WIP]
-->

## <a id="toc-babel-issues"></a>Babel 問題

Babel使用[Github](http://github.com)提供的問題跟蹤器。

您可以在[Github](https://github.com/babel/babel/issues)上看到所有的開放和封閉的問題。

如果你想要打開一個新的問題：

  * [先搜搜看有沒有現存的類似問題](https://github.com/babel/babel/issues)
  * 創建一個新的錯誤報告</> 或請求新功能</></li> </ul> 
    
    ### <a id="toc-creating-an-awesome-babel-bug-report"></a>創建漂亮的 Babel 錯誤報告
    
    Babel 的問題有時候很難遠程調試，所以我們希望能獲取儘可能詳細的信息來幫助我們解決問題。 花點時間去撰寫一份好的錯誤報告會讓你的問題更快得到解決。
    
    首先，嘗試隔離問題。 並非設置過程的每一步都是導致問題的原因。 如果你的問題是一段輸入代碼，試着儘可能把與問題不相關的代碼都刪除掉。
    
    > [WIP]
    
    * * *
    
    > ***在 Twitter 上關注 [@thejameskyle](https://twitter.com/thejameskyle)，第一時間獲取更新。***
