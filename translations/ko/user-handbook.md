# Babel User Handbook

이 문서는 모든 [Babel](https://babeljs.io)과 관련된 도구를 사용하는 방법에 대해 설명합니다.

[![cc-by-4.0](https://licensebuttons.net/l/by/4.0/80x15.png)](http://creativecommons.org/licenses/by/4.0/)

이 핸드북은 다른 언어로도 볼 수 있습니다. 전체 목록은 [README](/README.md)를 참고하세요.

# 목차

  * [소개](#toc-introduction)
  * [Babel 설정하기](#toc-setting-up-babel) 
      * [`babel-cli`](#toc-babel-cli)
      * [프로젝트 내에서 Babel CLI 실행하기](#toc-running-babel-cli-from-within-a-project)
      * [`babel-register`](#toc-babel-register)
      * [`babel-node`](#toc-babel-node)
      * [`babel-core`](#toc-babel-core)
  * [Babel 컨픽 작성하기](#toc-configuring-babel) 
      * [`.babelrc`](#toc-babelrc)
      * [`babel-preset-es2015`](#toc-babel-preset-es2015)
      * [`babel-preset-react`](#toc-babel-preset-react)
      * [`babel-preset-stage-x`](#toc-babel-preset-stage-x)
  * [Babel로 생성된 코드 실행하기](#toc-executing-babel-generated-code) 
      * [`babel-polyfill`](#toc-babel-polyfill)
      * [`babel-runtime`](#toc-babel-runtime)
  * [Babel 컨픽 작성하기 (고급)](#toc-configuring-babel-advanced) 
      * [수동으로 플러그인 지정하기](#toc-manually-specifying-plugins)
      * [플러그인 옵션](#toc-plugin-options)
      * [환경에 따른 Babel 커스터마이징](#toc-customizing-babel-based-on-environment)
      * [나만의 프리셋 만들기](#toc-making-your-own-preset)
  * [Babel과 기타 도구들](#toc-babel-and-other-tools) 
      * [정적 분석 도구](#toc-static-analysis-tools)
      * [코드 검사기 (Linter)](#toc-linting)
      * [코드 스타일](#toc-code-style)
      * [문서](#toc-documentation)
      * [프레임워크](#toc-frameworks)
      * [React](#toc-react)
      * [텍스트 편집기와 IDE](#toc-text-editors-and-ides)
  * [Babel 지원](#toc-babel-support) 
      * [Babel 포럼](#toc-babel-forum)
      * [Babel 채팅](#toc-babel-chat)
      * [Babel 이슈](#toc-babel-issues)
      * [멋진 Babel 버그 보고 생성](#toc-creating-an-awesome-babel-bug-report)

# <a id="toc-introduction"></a>소개

Babel은 JavaScript를 위한 일반적인 다중 목적 컴파일러입니다. Babel은 다음 세대의 JavaScript를 사용할 수 있도록 해주고 (만들 수 있도록), 그 뿐만 아니라 다음 세대의 JavaScript 유용한 유틸리티를 제공합니다.

JavaScript는 언어로써 새로운 스팩과 제안과 새로운 기능들이 언제나 나오며 끊임없이 발전하고 있습니다. Babel을 사용하면 언어적 기능이 본격적으로 모든 곳에서 사용되기 이전에 모든 기능을 미리 사용할 수 있습니다.

Babel은 최신 표준으로 작성된 JavaScript 코드를 현재 어디서나 동작하는 코드로 컴파일합니다. 이 과정은 source-to-source 컴파일이라고도 부르고 트랜스파일이라고도 부릅니다.

예를 들어, Babel은 ES2015의 새로운 화살표 함수 문법을 변환할 수 있습니다:

```js
const square = n => n * n;
```

이를 다음과 같이 변환합니다:

```js
const square = function square(n) {
  return n * n;
};
```

하지만 Babel은 React의 JSX 문법이나 정적 타입 검사를 위한 Flow 문법 지원 같은 문법 확장도 지원하므로 위에서 본 것보다 더 많은 일을 할 수 있습니다.

더 나아가 Babel에서 모든 것은 단순한 플러그인이고 원한다면 언제든지 Babel의 모든 기능을 사용해서 자신만의 플러그인을 만들 수 있습니다.

*여기서 더 나아가* Babel은 차세대 JavaScript 도구를 만드는데 사용할 수 있는 다수의 핵심 모듈로 모듈화되어 있습니다.

많은 사람들 하듯이 갑자기 등장한 Babel의 생태계는 아주 크고 매우 다양합니다. 이 핸드북에서 Babel의 내장 도구들이 동작하는 원리와 커뮤니티에서 만든 유용한 내용을 다룰 것입니다.

> ***향후 업데이트에 대한 내용은 Twitter의 [@thejameskyle](https://twitter.com/thejameskyle)를 팔로우하세요.***

* * *

# <a id="toc-setting-up-babel"></a>Babel 설정하기

JavaScript 커뮤니티가 다양한 빌드도구, 프레임워크, 플랫폼 등을 가지므로 Babel은 주요 도구를 공식적으로 통합하고 있습니다. Gulp에서 Browserify 까지, Ember에서 Meteor까지 공식적인 통합이 있을 것 같은 모든 것을 설정해서 사용할 수 있습니다.

이 핸드북의 목적에 따라 Babel을 구성하는 내장된 방법을 설명하고 있지만 다른 통합에 대해서는 인터렉티브한 [설정 페이지](http://babeljs.io/docs/setup)를 사용할 수도 있습니다.

> **Note:** 이 가이드에서는 `node`와 `npm`같은 커맨드라인 도구를 사용합니다. 더 진행하기 전에 이러한 도구에 익숙해 져야 합니다.

## <a id="toc-babel-cli"></a>`babel-cli`

Babel의 CLI는 커맨드라인에서 Babel로 파일을 컴파일하는 간단한 방법입니다.

일단 기본을 배우기 위해 전역으로 설치해 보겠습니다.

```sh
$ npm install --global babel-cli
```

첫 파일을 다음과 같이 컴파일할 수 있습니다.

```sh
$ babel my-file.js
```

터미널에 컴파일된 결과가 바로 나타납니다. 컴파일된 결과를 파일에 쓰려면 `--out-file`나 `-o`을 지정해야 합니다..

```sh
$ babel example.js --out-file compiled.js
# 또는
$ babel example.js -o compiled.js
```

디렉터리 전체를 새로운 디렉터리로 컴파일하고 싶다면 `--out-dir`나 `-d`를 사용합니다..

```sh
$ babel src --out-dir lib
# 또는
$ babel src -d lib
```

### <a id="toc-running-babel-cli-from-within-a-project"></a>프로젝트 내에서 Babel CLI 실행하기

자신의 머신에 Babel CLI를 전역으로 *설치할 수도 있지만* 프로젝트 **내부에** Babel을 설치하는 것이 훨씬 더 좋습니다.

내부에 설치하는 이유가 두 가지 있습니다.

  1. 같은 머신에서 다른 프로젝트는 다른 버전의 Babel을 사용할 수 있으므로 한번에 하나씩 업데이트 할 수 있습니다.
  2. 이는 작업하는 환경에 암묵적인 의존성을 갖지 않는다는 의미입니다. 프로젝트를 이식하고 구성하기 쉽게 만드세요.

다음 명령어로 Babel CLI를 프로젝트 내부에 설치할 수 있습니다.

```sh
$ npm install --save-dev babel-cli
```

> **참고:** 전역에서 Babel을 실행하는 것은 좋지 않은 생각이므로 다음 명령으로 전역에 설치된 Babel을 지울 수 있습니다:
> 
> ```sh
$ npm uninstall --global babel-cli
```

설치가 끝나면, `package.json`이 다음과 같이 표시되어야 합니다:

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "devDependencies": {
    "babel-cli": "^6.0.0"
  }
}
```

이제 CLI에서 Babel을 직접적으로 사용하는 대신, **npm scripts**를 추가하여 로컬 버전의 Babel을 사용하도록 명령어를 추가합니다.

간단히 `package.json`에 `"scripts"` 필드를 추가한 후 `build` 명령어와 같이 Babel 명령어를 추가하세요.

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

이제 터미널에서 다음을 실행할 수 있습니다:

```js
npm run build
```

이 명령어는 이전과 같이 Babel을 실행하지만, 로컬에 설치된 Babel을 사용합니다.

## <a id="toc-babel-register"></a>`babel-register`

Babel을 실행하는 또 다른 방법의 하나는 `babel-register`를 사용하는 것입니다. 이 방법을 이용하면 파일을 require하는 것만으로도 Babel을 실행할 수 있어 더 간단하게 설정에 통합할 수 있을 것입니다.

이는 프로덕션에서 사용할 목적이라는 의미는 아닙니다. 이 방법으로 컴파일되는 코드를 배포하는 것은 좋지 않은 방법입니다. 배포하기 전에 미리 컴파일하는 것이 훨씬 나은 방법입니다. 하지만 빌드 스크립트나 로컬에서 실행하는 다른 작업에서는 아주 잘 동작합니다.

먼저 프로젝트에 `index.js`을 생성해 보겠습니다.

```js
console.log("Hello world!");
```

이 파일을 `node index.js`로 실행한다면 Babel로 컴파일되지 않을 것이므로 대신 `babel-register`를 설정해 보겠습니다..

먼저 `babel-register`를 설치하세요.

```sh
$ npm install --save-dev babel-register
```

그다음 프로젝트에 `register.js` 파일을 생성하고 다음 코드를 작성하세요.

```js
require("babel-register");
require("./index.js");
```

이 코드는 Node의 모듈 시스템에 Babel을 *등록하고* `require`하는 모든 파일을 컴파일합니다.

이제 `node index.js`를 실행하는 대신 `register.js`를 사용할 수 있습니다.

```sh
$ node register.js
```

> **Note:** Babel이 코드를 컴파일하기 전에 node가 파일을 실행하므로 컴파일하려는 파일에서 Babel을 등록할 수는 없습니다.
> 
> ```js
require("babel-register");
// 컴파일되지 않음:
console.log("Hello world!");
```

## <a id="toc-babel-node"></a>`babel-node`

`node` CLI로 코드를 실행한다면 `node` CLI의 대체물인 `babel-node` CLI를 사용하는 것이 Babel을 통합하는 가장 쉬운 방법입니다.

이는 프로덕션에서 사용할 목적이라는 의미는 아닙니다. 이 방법으로 컴파일되는 코드를 배포하는 것은 좋지 않은 방법입니다. 배포하기 전에 미리 컴파일하는 것이 훨씬 나은 방법입니다. 하지만 빌드 스크립트나 로컬에서 실행하는 다른 작업에서는 아주 잘 동작합니다.

일단 `babel-cli`가 설치되었는지 확인합니다.

```sh
$ npm install --save-dev babel-cli
```

> **Note:** 왜 이것을 로컬에 설치하는지 궁금하다면, [프로젝트에서 Babel CLI 실행하기](#toc-running-babel-cli-from-within-a-project) 부분을 읽어 보세요.

그 다음 `node`를 사용하는 대신 `babel-node`를 사용하세요..

npm `scripts`를 사용한다면 다음과 같이 설정할 수 있습니다.

```diff
  {
    "scripts": {
-     "script-name": "node script.js"
+     "script-name": "babel-node script.js"
    }
  }
```

아니면 `babel-node`의 경로를 적어주어야 합니다.

```diff
- node script.js
+ ./node_modules/.bin/babel-node script.js
```

> Tip: [`npm-run`](https://www.npmjs.com/package/npm-run)을 사용할 수도 있습니다..

## <a id="toc-babel-core"></a>`babel-core`

만약 어떠한 이유로 Babel을 프로그래밍 방식으로 사용해야 하는 경우, `babel-core` 패키지 자체를 사용할 수도 있습니다.

먼저 `babel-core`를 설치합니다.

```sh
$ npm install babel-core
```

```js
var babel = require("babel-core");
```

만약 JavaScript 문자열이 있는 경우 `babel.transform`를 통해 바로 컴파일 할 수 있습니다..

```js
babel.transform("code();", options);
// => { code, map, ast }
```

만약 파일로 작업하고 있다면 비동기 api와 함께 사용할 수 있습니다:

```js
babel.transformFile("filename.js", options, function(err, result) {
  result; // => { code, map, ast }
});
```

또는 동기 api를 사용할 수도 있습니다:

```js
babel.transformFileSync("filename.js", options);
// => { code, map, ast }
```

만약 어떠한 이유로 이미 Babel AST를 가지고 있다면 AST를 통해 직접 변환할 수 있습니다.

```js
babel.transformFromAst(ast, code, options);
// => { code, map, ast }
```

For all of the above methods, `options` refers to https://babeljs.io/docs/usage/api/#options.

* * *

# <a id="toc-configuring-babel"></a>Babel 설정 파일 작성하기

아마 Babel을 실행했을 때 JavaScript 파일들을 다른 경로로 복사하는 것 말고는 아무 일도 하지 않는다는 것을 눈치챘을 겁니다.

이는 아직 Babel에게 할 일을 아무것도 주지 않았기 때문입니다.

> Babel이 범용 컴파일러가 된 이후부터 무수히 많은 용도로 쓰이게 되었으나 기본적으론 아무 일도 하지 않습니다. 따라서 명시적으로 Babel에게 할 일을 알려주어야 합니다.

**플러그인** 또는 **프리셋** (플러그인 모음)을 설치함으로써 Babel에게 지시를 내릴 수 있습니다.

## <a id="toc-babelrc"></a>`.babelrc`

Babel에게 무엇을 해야 하는지 지시하기 전에, 파일을 하나 만들어야 합니다. 작업하기 전에 가장 먼저 할 것은 프로젝트의 루트에 `.babelrc` 파일을 만드는 것입니다. 다음과 같이 작성합니다:

```js
{
  "presets": [],
  "plugins": []
}
```

이 파일은 Babel이 어떤 작업을 해야 할 지 구성합니다.

> **참고:** 또한 `.babelrc`에서 Babel에 옵션을 전달할 수도 있으며 가장 좋은 방법입니다.

## <a id="toc-babel-preset-es2015"></a>`babel-preset-es2015`

이제 Babel에게 ES2015 (ES6으로 알려진 새로운 버전의 JavaScript 표준)를 ES5 (현대 대부분의 환경이 실행할 수 있는 JavaScript 버전)로 컴파일하도록 지시해봅시다.

위 커맨드는 "es2015" Babel 프리셋을 설치할 것입니다:

```sh
$ npm install --save-dev babel-preset-es2015
```

다음은 `.babelrc`가 프리셋을 포함하도록 수정합니다.

```diff
  {
    "presets": [
+     "es2015"
    ],
    "plugins": []
  }
```

## <a id="toc-babel-preset-react"></a>`babel-preset-react`

React를 설정하는 것은 매우 쉽습니다. 그저 프리셋을 설치하고:

```sh
$ npm install --save-dev babel-preset-react
```

`.babelrc` 파일에 프리셋을 추가합니다:

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

자바스크립트는 표준으로 만들기 위한 몇 가지 제안 사항을 가지고 있고 TC39의 진행 상황에 따라 표준이 제정됩니다. (ECMAScript 표준 기술 위원회)

이 과정은 5 스테이지 (0-4) 로 진행됩니다. 제안은 어느 정도의 호응과 함께 표준이 되어야 한다고 판단되면 스테이지에 따라 표준화 작업을 진행합니다. 최종 표준으로 받아들여질 제안은 stage 4에 위치됩니다.

Babel에선 다음 4가지 프리셋으로 번들되어 있습니다:

  * `babel-preset-stage-0`
  * `babel-preset-stage-1`
  * `babel-preset-stage-2`
  * `babel-preset-stage-3`

> stage-4 프리셋은 단순히 `es2015`이며 따로 프리셋이 존재하진 않습니다.

각 프리셋들은 이후의 프리셋을 자동으로 포함합니다. 즉, `babel-preset-stage-1`은 `babel-preset-stage-2`를 포함하며 다시 이 프리셋은 `babel-preset-stage-3`를 포함합니다.

관심이 있다면 단순히 다음과 같이 원하는 스테이지를 설치합니다:

```sh
$ npm install --save-dev babel-preset-stage-2
```

그런 다음 `.babelrc` 설정에 추가할 수 있습니다.

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

# <a id="toc-executing-babel-generated-code"></a>Babel로 생성된 코드 실행하기

그래서 일단 Babel로 코드를 컴파일 했습니다, 하지만 아직 끝나지 않았습니다.

## <a id="toc-babel-polyfill"></a>`babel-polyfill`

거의 모든 미래적인 JavaScript 문법은 Babel로 컴파일할 수 있습니다. 하지만 API는 그렇지 않습니다.

예를 들어, 다음 코드는 화살표 함수를 포함하고 있고 컴파일되어야 합니다:

```js
function addAll() {
  return Array.from(arguments).reduce((a, b) => a + b);
}
```

위 코드는 다음과 같이 변환됩니다:

```js
function addAll() {
  return Array.from(arguments).reduce(function(a, b) {
    return a + b;
  });
}
```

그러나, 모든 JavaScript 환경에 `Array.from`가 있지 않기 때문에 여전히 어디서나 작동하진 않을 것입니다.

    Uncaught TypeError: Array.from is not a function
    

이러한 문제는 [Polyfill](https://remysharp.com/2010/10/08/what-is-a-polyfill)을 사용함으로써 해결할 수 있습니다. 간단히 설명하자면, polyfill은 현재 런타임에 존재하지 않는 네이티브 API를 흉내내는 코드입니다. 이로써 `Array.from` 같은 API들을 환경의 지원에 상관없이 언제나 사용할 수 있습니다.

Babel은 우수한 [core-js](https://github.com/zloirock/core-js)를 polyfill로 사용하고, 생성기와 async 함수가 작동할 수 있도록 약간 변경한 [regenerator](https://github.com/facebook/regenerator) 런타임을 사용합니다.

Babel polyfill을 포함하려면, 먼저 npm으로 설치합니다:

```sh
$ npm install --save babel-polyfill
```

그리고 간단히 어떤 파일의 가장 상단에 다음 코드를 추가합니다:

```js
import "babel-polyfill";
```

## <a id="toc-babel-runtime"></a>`babel-runtime`

ECMAScript 스팩의 상세 구현을 따르기 위함과 동시에 생성되는 코드를 깨끗하게 유지하기 위해, Babel은 "helper" 메서드를 사용할 것입니다.

이러한 헬퍼 코드는 상당히 길고 매 파일 위에 삽입되어야 하기 때문에, 필요하다면 단일 "runtime"으로 모든 헬퍼 코드를 옮길 수 있습니다.

먼저 `babel-plugin-transform-runtime`과 `babel-runtime`을 설치합니다:

```sh
$ npm install --save-dev babel-plugin-transform-runtime
$ npm install --save babel-runtime
```

그리고 `.babelrc`를 수정하세요:

```diff
  {
    "plugins": [
+     "transform-runtime",
      "transform-es2015-classes"
    ]
  }
```

이제 Babel은 다음 코드를:

```js
class Foo {
  method() {}
}
```

다음과 같이 컴파일할 것입니다:

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

필요할 때마다 매 파일에 `_classCallCheck`와 `_createClass` 헬퍼를 삽입하는 대신 위와 같이 런타임 헬퍼를 사용하는 것으로 변경됩니다.

* * *

# <a id="toc-configuring-babel-advanced"></a>Babel 설정 파일 작성하기 (고급)

대부분의 사람들은 Babel과 빌트인 프리셋만을 사용합니다. 하지만 Babel은 더 세분화된 작업을 할 수 있습니다.

## <a id="toc-manually-specifying-plugins"></a>수동으로 플러그인 지정하기

Babel 프리셋은 미리 구성된 플러그인들의 집합입니다. 만약 플러그인을 특정하여 다른 작업을 하고 싶다면, 프리셋과 거의 정확히 같은 방식으로 작동합니다.

먼저 플러그인을 설치합니다:

```sh
$ npm install --save-dev babel-plugin-transform-es2015-classes
```

그리고 `.babelrc`의 `plugins` 필드에 추가합니다.

```diff
  {
+   "plugins": [
+     "transform-es2015-classes"
+   ]
  }
```

이는 세분화된 트랜스폼을 통해 세밀한 작업을 할 수 있게 해줍니다.

전체 공식 플러그인 리스트는 [Babel Plugins 페이지](http://babeljs.io/docs/plugins/)에서 확인할 수 있습니다.

또한 이미 [커뮤니티에 의해 만들어진](https://www.npmjs.com/search?q=babel-plugin) 모든 플러그인을 사용할 수도 있습니다. 만약 자신만의 플러그인을 작성하는 방법을 배우고 싶다면 [Babel Plugin Handbook](plugin-handbook.md)을 읽으세요..

## <a id="toc-plugin-options"></a>플러그인 옵션

또한 많은 플러그인들이 다르게 동작 하도록 구성할 수 있는 옵션을 가지고 있습니다. 예를 들면, 많은 트랜스폼이 일부 스펙을 지키지 않는 대신 생성되는 코드의 성능을 개선하고 단순하게 만드는 "loose" 모드를 가지고 있습니다.

플러그인에 옵션을 추가하려면, 간단히 설정을 다음과 같이 변경하면 됩니다:

```diff
  {
    "plugins": [
-     "transform-es2015-classes"
+     ["transform-es2015-classes", { "loose": true }]
    ]
  }
```

> 앞으로 몇 주 내로 모든 플러그인 옵션의 상세 사항을 포함하도록 플러그인 문서를 업데이트할 예정입니다. [업데이트 소식을 얻으려면 팔로우](https://twitter.com/thejameskyle).

## <a id="toc-customizing-babel-based-on-environment"></a>환경에 따른 Babel 커스터마이징

Babel 플러그인은 많은 다른 작업을 해결합니다. 대부분의 경우는 개발 툴이며 코드를 디버깅하거나 다른 툴과 통합할 수 있도록 도와줍니다. 또한 실제 프로덕션 코드를 위한 수 많은 최적화 플러그인도 많이 있습니다.

이러한 이유로 인해 Babel을 환경에 따라 구성을 변경하려 하는 것이 일반적입니다. `.babelrc`에서 쉽게 할 수 있습니다.

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

Babel은 현재 환경에 따라 `env` 내에 정의된 구성을 활성화 할 것입니다.

현재 환경은 `process.env.BABEL_ENV` 변수를 사용합니다. `BABEL_ENV`를 사용할 수 없다면, `NODE_ENV`를 대신 사용합니다. 만약 둘 다 사용할 수 없다면 기본으로 `"development"`가 지정됩니다..

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

> **참고:** `[COMMAND]`는 Babel을 실행하기 위한 명령어입니다. (ie. `babel`, `babel-node`, 또는 register 훅을 사용할 경우 그냥 `node`)
> 
> **Tip:** 만약 명령어가 unix와 windows 플랫폼에서 모두 작동하도록 하고 싶다면 [`cross-env`](https://www.npmjs.com/package/cross-env)를 사용하세요..

## <a id="toc-making-your-own-preset"></a>나만의 프리셋 만들기

직접 플러그인과 플러그인 옵션, 환경에 따른 설정을 지정하는 경우 모든 설정 과정이 프로젝트마다 되풀이되는 것을 느낄 것입니다.

이러한 이유로, 우리는 커뮤니티가 용도에 맞는 프리셋을 직접 만드는 것을 권장합니다. 이는 실행하고 있는 [node 버전](https://github.com/leebenson/babel-preset-node5)에 대해 특정되거나 [전적](https://github.com/cloudflare/babel-preset-cf)으로 [회사](https://github.com/airbnb/babel-preset-airbnb)에 관련된 프리셋이 될 수 있습니다..

프리셋을 만드는 것은 간단합니다. 다음과 같은 `.babelrc`를 프리셋으로 만드려면:

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

프리셋을 만들기 위해 해야 할 일은 단지 새 프로젝트를 만들고 `babel-preset-*`과 같은 명명법을 따르는 것 입니다. (네임 스페이스를 만들었다면 꼭 책임을 지시기 바랍니다) 그리고 두 개의 파일을 생성합니다.

먼저, 새 `package.json` 파일을 만든 후 프리셋에서 요구하는 `종속성`들을 설치합니다.

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

그리고 `index.js` 파일을 생성한 후 `.babelrc`의 내용을 export하도록 만들고 플러그인/프리셋 문자열을 `require` 호출로 바꿉니다.

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

그리고 간단히 npm에 배포하면 이 프리셋을 원하는 곳에 사용할 수 있습니다.

* * *

# <a id="toc-babel-and-other-tools"></a>Babel과 기타 도구들

Babel은 설치 방법이 아주 직관적입니다. 하지만 다른 툴과 함께 사용하는 경우라면 설정하는 방법을 탐색하는 것이 어려울 수 있습니다. 그러나, 우리는 다른 프로젝트와의 운용을 쉽게 만들기 위해 가능한 한 가깝게 만들고 있습니다.

## <a id="toc-static-analysis-tools"></a>정적 분석 도구

새로운 표준은 언어로 수 많은 새 문법을 가져오고 있으며 정적 분석 도구는 이를 그대로 활용합니다.

### <a id="toc-linting"></a>코드 검사기 (Linter)

코드 검사 도구 중 가장 인기있는 도구는 [ESLint](http://eslint.org)이며, 이에 따라 공식적으로 [`babel-eslint`](https://github.com/babel/babel-eslint)를 제공하고 있습니다.

먼저 `eslint`와 `babel-eslint`를 설치합니다.

```sh
$ npm install --save-dev eslint babel-eslint
```

그 다음 프로젝트에 새 `.eslintrc` 파일을 만들거나 이미 존재하는 설정에서 `파서`로 `babel-eslint`를 사용하도록 설정합니다.

```diff
  {
+   "parser": "babel-eslint",
    "rules": {
      ...
    }
  }
```

이제 `package.json`의 스크립트에 `lint` 작업을 추가합니다:

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

그리고 작업을 실행하면 모든 설정이 완료됩니다.

```sh
$ npm run lint
```

더 자세한 사항은 [`babel-eslint`](https://github.com/babel/babel-eslint) 또는 [`eslint`](http://eslint.org) 문서를 참고하세요.

### <a id="toc-code-style"></a>코드 스타일

> JSCS has merged with ESLint, so checkout Code Styling with ESLint.

JSCS는 코드 검사의 추가 단계에 있어서 코딩 스타일 자체를 점검하는 매우 인기 있는 코드 검사 도구입니다. Babel과 JSCS 프로젝트의 핵심 관리자 ([@hzoo](https://github.com/hzoo))는 공식적으로 JSCS와의 통합을 제공하고 있습니다.

더 나은 방법으로는, JSCS 자체의 `--esnext` 옵션을 통해 쉽게 Babel과 통합하는 방법도 있습니다:

    $ jscs . --esnext
    

CLI에서 실행하거나 `.jscsrc` 파일에 `esnext` 옵션을 추가해도 됩니다.

```diff
  {
    "preset": "airbnb",
+   "esnext": true
  }
```

더 자세한 정보는 [`babel-jscs`](https://github.com/jscs-dev/babel-jscs) 또는 [`jscs`](http://jscs.info) 문서를 참고하세요.

<!--
### Code Coverage

> [WIP]
-->

### <a id="toc-documentation"></a>문서

Babel, ES2015, Flow를 사용함으로써 코드의 많은 부분을 추론할 수 있습니다. [documentation.js](http://documentation.js.org)를 사용하면 자세한 API 문서를 쉽게 생성할 수 있습니다.

Documentation.js는 Flow 표기법이 코드 내에서 타입을 정의함과 동시에 최신의 문법을 지원하기 위해 내부적으로 Babel을 사용합니다.

## <a id="toc-frameworks"></a>프레임워크

모든 주요 JavaScript 프레임워크의 API들은 이제 언어의 미래를 향해 초점이 맞춰졌습니다. 이 때문에 툴링에 많은 일이 진행되고 있습니다.

프레임워크들은 Babel을 사용하는 것뿐만 아니라 확장하여 사용자 경험을 더 강화할 기회가 있습니다.

### <a id="toc-react"></a>React

React는 극적으로 ES2015의 클래스에 맞춰 API를 변경했습니다. ([업데이트된 API는 이곳에서 확인](https://babeljs.io/blog/2015/06/07/react-on-es6-plus)) 더욱이, React는 JSX 구문의 컴파일을 Babel에 의존하며 Babel을 사용함으로써 그들의 커스텀 툴의 사용을 반대합니다. `babel-preset-react` 패키지와 함께 [위의 절차](#babel-preset-react)에 따라 시작할 수 있습니다..

React 커뮤니티는 Babel과 함께 성장합니다. [커뮤니티에 의해 만들어진](https://www.npmjs.com/search?q=babel-plugin+react) 트랜스폼의 개수가 상당해졌습니다..

가장 주목할 것은 몇 가지의 [React-specific transforms](https://github.com/gaearon/babel-plugin-react-transform#transforms)과 함께 *hot module reloading* 그리고 디버깅 유틸리티를 활성화 시킬 수 있는 [`babel-plugin-react-transform`](https://github.com/gaearon/babel-plugin-react-transform)입니다.

<!--
### Ember

> [WIP]
-->

## <a id="toc-text-editors-and-ides"></a>텍스트 편집기와 IDE

Babel과 함께 ES2015와 JSX와 Flow 문법을 사용하는 것은 매우 유용할 수 있습니다. 하지만 텍스트 편집기가 지원하지 않는 경우 정말 좋지 않은 경험이 될 수 있습니다. 이러한 이유로 사용하는 IDE와 함께 Babel 플러그인을 사용하는 방법을 알아보고 싶을 것입니다. 다음을 참고하세요:

  * [Sublime Text](https://github.com/babel/babel-sublime)
  * [Atom](https://atom.io/packages/language-babel)
  * [Vim](https://github.com/jbgutierrez/vim-babel)
  * [WebStorm](https://babeljs.io/docs/setup/#webstorm)

<!--
# Debugging Babel

> [WIP]
-->

* * *

# <a id="toc-babel-support"></a>Babel 지원

Babel은 아주 크고 빠르게 성장하는 커뮤니티를 가지고 있으며, 성장하면서 사람들이 확실히 원하는 리소스를 성공적으로 얻을 수 있도록 도움을 주기 위해 노력하고 있습니다. 그래서 우리는 지원을 위해 서로 다른 채널을 제공하고 있습니다.

참고로 모든 커뮤니티는 [행동 강령](https://github.com/babel/babel/blob/master/CODE_OF_CONDUCT.md)을 적용받는다는 것을 기억하세요. 만약 행동 강령을 어길 경우, 조치가 취해질 것입니다. 따라서 위 문서를 읽고 다른 이들과 상호작용할 때 유의하시기 바랍니다.

우리는 사람들이 커뮤니티에 머무르며 다른 사람에게 지원하는, 자체적인 지원을 하는 커뮤니티를 목표로 하고 있습니다. 만약 다른 이들이 질문하고 있고 스스로가 이 질문에 대한 답을 안다면, 약간의 시간을 들여 그들을 도와주세요. 최대한 친절하고 이해하려 노력해주세요.

## <a id="toc-babel-forum"></a>Babel 포럼

[Discourse](http://www.discourse.org)는 호스팅 버전의 포럼 소프트웨어를 무료로 우리에게 제공하고 있습니다. (그리고 우리는 그들을 매우 사랑합니다!) 만약 포럼에 볼일이 있다면 [discuss.babeljs.io](https://discuss.babeljs.io)에 들러주세요..

## <a id="toc-babel-chat"></a>Babel 채팅

모두가 [Slack](https://slack.com)을 사랑합니다. 만약 즉각적인 커뮤니티 지원을 알아보고 있다면 [slack.babeljs.io](https://slack.babeljs.io)에 참여하여 도움을 요청하세요.

<!--
## Babel Stack Overflow

> [WIP]
-->

## <a id="toc-babel-issues"></a>Babel 이슈

Babel uses the issue tracker provided by [Github](http://github.com).

You can see all the open and closed issues on [Github](https://github.com/babel/babel/issues).

만약 새로운 이슈를 만들고 싶다면:

  * [먼저 해당 이슈가 이미 있는지 검색하세요](https://github.com/babel/babel/issues)
  * [Create a new bug report](https://github.com/babel/babel/issues/new) or [request a new feature](https://github.com/babel/babel/issues/new)

### <a id="toc-creating-an-awesome-babel-bug-report"></a>멋진 Babel 버그 보고 생성

가끔 Babel의 이슈는 원격으로 디버깅하기 상당히 어려울 때가 있습니다, 따라서 우리는 가능한 한 모든 도움을 받아야 합니다. 약간의 시간을 들여 정말 멋진 버그 리포트를 작성하여 개시한다면 해당 문제가 빠르게 해결되는 데 큰 도움이 됩니다.

첫째, 문제를 고립시킵니다. 설치 과정이 문제의 모든 부분에서 영향을 미치고 있을 가능성이 큽니다. 만약 문제가 코드내에 있다면, 같은 문제가 발생하도록 최대한 코드를 줄여주세요.

> [작업중]

* * *

> ***향후 업데이트에 대한 내용은 Twitter의 [@thejameskyle](https://twitter.com/thejameskyle)를 팔로우하세요.***