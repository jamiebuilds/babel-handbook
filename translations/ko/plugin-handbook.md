# Babel Plugin Handbook

이 문서는 [Babel](https://babeljs.io) [플러그인](https://babeljs.io/docs/advanced/plugins/)을 만드는 방법을 설명합니다.

[![cc-by-4.0](https://licensebuttons.net/l/by/4.0/80x15.png)](http://creativecommons.org/licenses/by/4.0/)

이 핸드북은 다른 언어로도 볼 수 있습니다. 전체 목록은 [README](/README.md)를 참고하세요.

# 목차

  * [소개](#toc-introduction)
  * [기본](#toc-basics) 
      * [추상 구문 트리 (ASTs)](#toc-asts)
      * [Babel 실행 단계](#toc-stages-of-babel)
      * [분석(Parse)](#toc-parse) 
          * [어휘 분석(Lexical Analysis)](#toc-lexical-analysis)
          * [구문 분석(Syntactic Analysis)](#toc-syntactic-analysis)
      * [변환(Transform)](#toc-transform)
      * [생성(Generate)](#toc-generate)
      * [탐색(Traversal)](#toc-traversal)
      * [방문자(Visitors)](#toc-visitors)
      * [경로(Paths)](#toc-paths) 
          * [방문자안의 경로(Paths in Visitors)](#toc-paths-in-visitors)
      * [상태(State)](#toc-state)
      * [범위(Scopes)](#toc-scopes) 
          * [묶기(Binding)](#toc-bindings)
  * [API](#toc-api) 
      * [babylon](#toc-babylon)
      * [babel-traverse](#toc-babel-traverse)
      * [babel-types](#toc-babel-types)
      * [Definitions](#toc-definitions)
      * [Builders](#toc-builders)
      * [Validators](#toc-validators)
      * [Converters](#toc-converters)
      * [babel-generator](#toc-babel-generator)
      * [babel-template](#toc-babel-template)
  * [첫 Babel 플러그인 작성](#toc-writing-your-first-babel-plugin)
  * [변환 작업](#toc-transformation-operations) 
      * [방문하기(Visiting)](#toc-visiting)
      * [노드가 특정 타입인지 확인하자](#toc-check-if-a-node-is-a-certain-type)
      * [식별자가 참조인지를 확인하자](#toc-check-if-an-identifier-is-referenced)
      * [조작(Manipulation)](#toc-manipulation)
      * [노드 교체하기](#toc-replacing-a-node)
      * [노드 하나를 여러개의 노드로 교체하기](#toc-replacing-a-node-with-multiple-nodes)
      * [노드를 소스 코드로 교체하기](#toc-replacing-a-node-with-a-source-string)
      * [형제 노드(sibling node) 삽입하기](#toc-inserting-a-sibling-node)
      * [노드 삭제하기](#toc-removing-a-node)
      * [부모 교체하기](#toc-replacing-a-parent)
      * [부모 삭제하기](#toc-removing-a-parent)
      * [범위(Scope)](#toc-scope)
      * [지역 변수가 scope 안에 있는지 확인하기](#toc-checking-if-a-local-variable-is-bound)
      * [UID 생성하기](#toc-generating-a-uid)
      * [부모 스코프에 변수 선언 밀어 넣기](#toc-pushing-a-variable-declaration-to-a-parent-scope)
      * [바인딩과 참조의 이름 변경하기](#toc-rename-a-binding-and-its-references)
  * [플러그인 옵션](#toc-plugin-options)
  * [노드 만들기(Building Nodes)](#toc-building-nodes)
  * [모범 사례](#toc-best-practices) 
      * [가능한 AST 탐색을 피하라](#toc-avoid-traversing-the-ast-as-much-as-possible)
      * [가능하다면 방문자들을 병합(merge) 하라](#toc-merge-visitors-whenever-possible)
      * [수동 조회할 땐 탐색하지 마라](#toc-do-not-traverse-when-manual-lookup-will-do)
      * [중첩된 방문자들 최적화하기](#toc-optimizing-nested-visitors)
      * [중첩된 구조(nested structures) 인지하기](#toc-being-aware-of-nested-structures)

# <a id="toc-introduction"></a>소개

바벨은 일반적으로 다목적 자바스크립트 컴파일러입니다. 더 나아가 많은 형태의 정적 분석 (Static analysis) 에 사용되는 모듈들의 모음(collection) 이기도 합니다.

> 정적 분석(Static analysis) 이란 코드를 실행하지 않고 분석하는 작업 입니다. 코드를 실행하는 동안 분석하는 것은 동적 분석(dynamic analysis) 으로 알려져 있습니다. 정적 분석의 목적은 매우 다양합니다. 구문 검사 (linting), 컴파일링, 코드 하이라이팅, 코드 변환, 최적화, 압축(minification) 등 매우 많은 용도로 사용될 수 있습니다.

생산성을 향상시켜주고 더 좋은 프로그램을 작성하게 해주는 많은 다양한 형태의 도구들을 Babel 을 사용하여 만들 수 있습니다.

> ***향후 업데이트에 대한 내용은 Twitter의 [@thejameskyle](https://twitter.com/thejameskyle)를 팔로우하세요.***

* * *

# <a id="toc-basics"></a>기본

Babel은 JavaScript 컴파일러입니다. 정확히는 source-to-source 컴파일러이며 "트랜스파일러(transpiler)" 라고 불립니다. 즉, Babel에 자바스크립트 코드를 넘겨주면 Babel에서 코드를 수정하고 새로운 코드를 생성하여 반환해주게 됩니다.

## <a id="toc-asts"></a>추상 구문 트리 (ASTs)

각 과정들은 [추상 구문 트리(AST)](https://en.wikipedia.org/wiki/Abstract_syntax_tree)를 생성하거나 이것을 다루게됩니다.

> Babel 은 [ESTree AST](https://github.com/estree/estree) 를 개조한 AST 사용하고, 핵심 사양은 [여기](https://github.com/babel/babel/blob/master/doc/ast/spec.md)에서 볼 수 있습니다..

```js
function square(n) {
  return n * n;
}
```

> AST 노드(AST nodes) 들에 더 알고 싶으면 [AST 탐색기](http://astexplorer.net/)를 확인해보세요. [이 링크](http://astexplorer.net/#/Z1exs6BWMq) 는 위 코드를 붙여넣기한 예제입니다.

위의 코드는 이런 리스트로 나타낼 수 있습니다:

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

또는 이런 자바스크립트 객체로 나타낼 수도 있습니다.

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

AST 의 각 레벨들이 유사한 구조를 가지고 있다는것을 알 수 있습니다.

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

> 주의: 간단하게 보기 위해 몇개의 속성은 제거하였음.

이것들을 각각 **노드(Node)** 라고 합니다. AST 는 단일 노드 또는 수백개, 수천개의 노드로 이루어 질수 있습니다. 이 노드들이 모여 프로그램의 구문(syntax) 을 설명 할 수 있는데 이것은 정적 분석에 사용될 수 있습니다.

모든 노드는 이런 인터페이스를 가지고 있습니다:

```typescript
interface Node {
  type: string;
}
```

`type` 필드는 객체가 어떤 노드 타입인지 나타내는 문자열입니다. (예. `"FunctionDeclaration"`, `"Identifier"`, or `"BinaryExpression"`). 각 노드 type 은 이 특정 노드 type 을 기술하는 추가 속성들의 집합을 정의합니다.

Babel 이 만드는 모든 노드에는 오리지널 소스코드안의 노드의 위치를 알려주는 추가 속성이 있습니다.

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

이 `start`, `end`, `loc` 속성들은 모든 단일 노드안에 있습니다.

## <a id="toc-stages-of-babel"></a>Babel 실행 단계

바벨 과정의 주요 3단계는 **분석(parse)**, **변환(transform)**, **생성(generate)** 단계입니다..

### <a id="toc-parse"></a>분석(Parse)

**분석** 단계에서는, 코드는 취해 AST를 만들어냅니다. 바벨의 분석단계는 [**어휘 분석(Lexical Analysis)**](https://en.wikipedia.org/wiki/Lexical_analysis) 과 [**구문 분석(Syntactic Analysis)**](https://en.wikipedia.org/wiki/Parsing) 두 가지 단계가 있습니다..

#### <a id="toc-lexical-analysis"></a>어휘 분석(Lexical Analysis)

어휘 분석 과정은 코드 문자열을 취해 **토큰(tokens)**들의 스트림(stream) 으로 바꿀 것 입니다..

토큰들을 언어 구문 조각의 플랫한 배열이라고 생각해도됩니다.

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

여기 각 `type`들은 이 토큰을 기술하는 속성들의 집합을 가지고 있습니다:

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

이것은 또한 AST 노드처럼 `start`, `end`, 그리고 `loc` 을 가지고 있습니다..

#### <a id="toc-syntactic-analysis"></a>구문 분석(Syntactic Analysis)

구문 분석 과정에서는 토큰들의 스트림을 취해 AST 표현으로 바꿀 것 입니다. 이 과정에서는 토큰들 안에 있는 정보를 사용해서, 토큰들을 코드의 구조를 나타내는 AST로 재 구성하는데 이것은 어떤 의미에서 더 다루기가 더 쉽습니다.

### <a id="toc-transform"></a>변환(Transform)

[변환](https://en.wikipedia.org/wiki/Program_transformation) 단계에서는 추상 구문 트리(AST) 를 받아 그 속을 탐색해 나가며 노드들을 추가, 업데이트, 제거 합니다. Babel 이나 어떤 컴파일러에게라도 이 과정은 단연코 가장 복잡한 부분입니다. 이 과정에서 플러그인이 수행되므로 이 핸드북에서 가장 많이 다뤄질 것입니다. 그래서 지금 당장은 너무 깊게 들어가지 않겠습니다.

### <a id="toc-generate"></a>생성(Generate)

[코드 생성](https://en.wikipedia.org/wiki/Code_generation_(compiler)) 단계에서는 최종 AST를 취하여 다시 소스 코드 문자열로 만드는데, [소스 맵](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/) 또한 생성합니다..

소스 코드 생성은 매우 간단합니다: AST를 깊이 우선 탐색법으로 탐색하며 변환된 코드를 나타내는 문자열을 만듭니다.

## <a id="toc-traversal"></a>탐색(Traversal)

AST 변환을 하고 싶을때, 재귀적으로 [트리를 탐색](https://en.wikipedia.org/wiki/Tree_traversal)해야합니다.

`FunctionDeclaration` type을 가지고 있다고 해봅시다. 몇개의 속성들을 가지고 있습니다: `id`, `params`, and `body`. 이 각각은 중첩된 노드들을 가지고 있습니다.

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

자 이제 `FunctionDeclaration` 부터 시작하고 우린 이것의 내부 속성을 알고있으니 각 속성들과 그들의 자식을 차례로 방문합니다.

다음은 `Identifier` 인 `id` 입니다. `Identifier`는 자식 노드도 갖고 있지 않으므로 넘어갑시다.

다음은 `params` 인데, 이건 노드들의 배열이므로 각각을 방문시다. 여기서는 `Identifier`인 단일 노드뿐이므로 넘어갑시다.

그러면 이제 노드들의 배열인 `body` 속성을 가지고 있는 `BlockStatement` 인 `body`에 도달하는데 이 배열을 하나씩 가봅시다.

여기엔 오직 `argument` 속성을 가지고 있는 `ReturnStatement` 하나가 있는데, `argument` 속성으로 가서 `BinaryExpression` 을 찾아봅시다..

`BinaryExpression`은 `operator`, `left`, `right` 를 가지고 있습니다. Operator 는 노드가 아닌 단순 값이라 여긴 방문하지 않고, 대신 `left` 와 `right`를 방문 해봅시다..

이런 탐색(traversal) 과정은 바벨 변환(transform) 과정 내내 일어납니다.

### <a id="toc-visitors"></a>방문자(Visitors)

어떤 노드로 '간다'라고 말할때, 실제로 이건 노드들을 **방문**한다는 의미입니다. 이 단어를 사용하는 이유는 [**방문자(visitor)**](https://en.wikipedia.org/wiki/Visitor_pattern) 라는 개념이 있기 때문입니다..

방문자는 여러 언어에서 AST 탐색에 사용되는 패턴입니다. 간단히 말해서 그들은 트리에서 특정 노트 타입을 다루기 위한 메소드들을 가지고 있는 객체입니다. 조금 추상적인 내용이라 예를 들어 살펴보겠습니다.

```js
const MyVisitor = {
  Identifier() {
    console.log("Called!");
  }
};
```

> **Note:** `Identifier() { ... }` is shorthand for `Identifier: { enter() { ... } }`.

이것은 탐색을 하는 동안 트리에서 만나는 모든 `Identifier` 에 대해 `Identifier()` 를 호출하는 기본적인 방문자입니다.

자 `Identifier()` 메소드를 가지고 있는 이 코드는 각각의 `Identifier`에 대해 4번 호출될 것입니다(`square`를 포함하여).

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

이들은 모두 노드에 **입장(enter)**할때 호출됩니다. 그러나 **퇴장(exit)**할때 방문자 메소드가 호출되게 하는 것도 가능합니다..

이런 구조의 트리를 가지고 있다고 상상해봅시다.

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

트리의 각 가지들을 탐색하는 동안 결국 막다른 곳에 다다르는데 여기에서 다음 노드로 가기위해서는 뒤로 돌아가는 것이 필요합니다. 트리 아래로 내려가면서 각 노드에 **입장(enter)**하고, 돌아올때 각 노드를 **퇴장(exit)** 합니다.

이 과정이 어떻게 되는지 위의 트리로 한번 해봅시다.

  * Enter `FunctionDeclaration` 
      * Enter `Identifier (id)`
      * Hit dead end
      * Exit `Identifier (id)`
      * Enter `Identifier (params[0])`
      * Hit dead end
      * Exit `Identifier (params[0])`
      * Enter `BlockStatement (body)`
      * Enter `ReturnStatement (body)` 
          * Enter `BinaryExpression (argument)`
          * Enter `Identifier (left)` 
              * Hit dead end
          * Exit `Identifier (left)`
          * Enter `Identifier (right)` 
              * Hit dead end
          * Exit `Identifier (right)`
          * Exit `BinaryExpression (argument)`
      * Exit `ReturnStatement (body)`
      * Exit `BlockStatement (body)`
  * Exit `FunctionDeclaration`

이와같이 방문자를 생성할때 각 노드를 방문할 수 있는 두 번의 기회가 주어집니다.

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

### <a id="toc-paths"></a>경로(Paths)

추상구문트리(AST) 는 일반적으로 많은 노드들을 가지고 있는데, 어떻게 노드들이 다른 노드와 연결될 수 있을까요? 우리는 어디든 조작하고 접근할 수 있는 하나의 거대한 변경가능한(mutable) 객체를 가질 수도 있었고, 아니면 **Paths** 를 사용해 단순화시킬 수 있습니다..

**Path** 는 두개의 노드 사이의 링크를 나타내는 객체이다.

예를들어 아래 노드와 그 자식 노드들을 받는다고 해봅시다:

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

그리고 자식 `Identifier` 를 path 로 표현하면, 아래와 같이 보일 것 입니다.

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

이것은 또한 path에 대한 추가 메타데이터를 가집니다:

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

뿐만아니라 노드의 추가, 업데이트, 이동, 삭제와 관련된 굉장히 많은 메소드들도 있습니다만, 나중에 알아보도록 하겠습니다.

다른 의미로, paths 는 트리에서 노드의 위치에 **반응하는(reactive)** 표현이고 노드에 관련된 모든 종류의 정보입니다. 언제든지 트리를 변경하는 메소드를 호출할때마다, 이 정보는 업데이트됩니다. 노드를 쉽게 다루고 가능한 상태를 저장하지 않도록 Babel이 이 모든것을 관리합니다.

#### <a id="toc-paths-in-visitors"></a>방문자 안의 Paths (Paths in Visitors)

`Identifier()` 메소드를 가지는 방문자가 있을때, 실제로 방문하는 것은 노드가 아닌 path 입니다. 이 방법으로 노드 그 자체를 다루기 보다는 주로 이 reactive 표현을 사용하여 작업할수 있습니다.

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

### <a id="toc-state"></a>상태(State)

상태(State) 는 추상 구문 트리(AST) 변환의 적입니다. 상태는 계속해서 당신을 괴롭힐 것이며 상태에 대한 추정은 당신이 고려하지 못했던 구문에 의해 거의 항상 틀리게 될 것입니다.

아래의 코드를 봅시다:

```js
function square(n) {
  return n * n;
}
```

`n`을 `x`로 바꾸는 방문자를 빠르게 작성해봅시다..

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

위 코드는 아마 잘 동작 할테지만, 이렇게 함으로써 쉽게 깨질 수 있습니다:

```js
function square(n) {
  return n * n;
}
n;
```

더 좋은 방법은 재귀(recursion) 를 쓰는 것입니다. Christopher Nolan 의 영화처럼 만들어 방문자안에 방문자를 넣어봅시다.

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

물론, 이건 부자연스러운 예제이긴 하지만 방문자안의 전역 상태(global state) 를 어떻게 제거할 수 있는지 보여줍니다.

### <a id="toc-scopes"></a>범위(Scopes)

다음으로 [**scope**](https://en.wikipedia.org/wiki/Scope_(computer_science)) 개념을 소개합니다. 자바스크립트는 [lexical scoping](https://en.wikipedia.org/wiki/Scope_(computer_science)#Lexical_scoping_vs._dynamic_scoping)을 가지고 있는데, 이것은 트리 구조이며 블록이 새로운 scope을 생성합니다.

```js
// global scope

function scopeOne() {
  // scope 1

  function scopeTwo() {
    // scope 2
  }
}
```

자바스크립트에서는 언제라도 어떤 참조를 선언 할 수 있으며, 이게 변수든, 함수든, 클래스든, 파라미터든, 임포트든 라벨이든 기타 등등 뭐든지 간에 이건 현재 scope에 속하게 됩니다.

```js
var global = "I am in the global scope";

function scopeOne() {
  var one = "I am in the scope created by `scopeOne()`";

  function scopeTwo() {
    var two = "I am in the scope created by `scopeTwo()`";
  }
}
```

하위 scope 안의 코드에서는 상위 scope의 참조를 사용 할 수 있습니다.

```js
function scopeOne() {
  var one = "I am in the scope created by `scopeOne()`";

  function scopeTwo() {
    one = "I am updating the reference in `scopeOne` inside `scopeTwo`";
  }
}
```

또한 하위 scope에서 수정없이 같은 이름의 참조를 생성할수 있습니다.

```js
function scopeOne() {
  var one = "I am in the scope created by `scopeOne()`";

  function scopeTwo() {
    var one = "I am creating a new `one` but leaving reference in `scopeOne()` alone.";
  }
}
```

변환(transform) 이 될때, 우리는 이런 scope이 고려되길 원합니다. 우리는 코드가 다른 부분에서 수정되는 동안 기존 코드가 깨지지 않는 것을 보장할 필요가 있습니다.

우린 새로운 참조를 추가하고 기존의 것과 충돌하지 않는 것을 보장되길 원합니다. 아니면 단순히 변수가 어디를 참조하는지 알고 싶을수도 있습니다. 주어진 scope안에서 이 참조들을 추적할수 있기를 원합니다.

Scope은 이렇게 나타낼수 있습니다:

```js
{
  path: path,
  block: path.node,
  parentBlock: path.parent,
  parent: parentScope,
  bindings: [...]
}
```

Path 와 부모 scope를 제공하여 새로운 scope을 생성할 수 있습니다. 그러면 탐색 과정에서 이 scope 안의 모든 참조("bindings") 들을 수집합니다.

이것이 끝나면, scope 안에서 사용할수 있는 모든 유형의 메소드들이 있게됩니다. 이것에 대해선 나중에 알아봅시다.

#### <a id="toc-bindings"></a>바인딩(Bindings)

특정 scope에 속하는 모든 참조들; 이 관계를 **바인딩(binding)**이라고 합니다..

```js
function scopeOnce() {
  var ref = "This is a binding";

  ref; // This is a reference to a binding

  function scopeTwo() {
    ref; // This is a reference to a binding from a lower scope
  }
}
```

단일 binding 은 이렇게 생겼습니다:

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

이 정보들로 모든 참조들이 어디로 binding 되어있는지를 찾을 수 있고, 어떤 binding 타입(파라미터인지 선언지 등등) 인지 알 수 있고, 어떤 scope에 속하는지 조회하거나, identifier의 사본을 얻을 수 있습니다. 상수인지 아닌지 조차 알 수 있고, 어떤 paths 가 이 상수를 깨뜨렸는지 알수 있습니다.

만약 binding 이 상수이면 많은 목적에서 유용하다고 말할 수 있고, 특히 압축(minification) 에서 가장 유용합니다.

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

Babel 은 사실 모듈들의 집합입니다. 이 장에서는 모듈들이 무엇을 하고 어떻게 사용되는지 설명하는 매우 중요한 것을 살펴보겠습니다.

> 주의: 이 장은 곧 준비될 예정인 상세 API 문서를 대체하지는 않습니다.

## <a id="toc-babylon"></a>[`babylon`](https://github.com/babel/babylon)

babylon 은 Bable의 분석기(parser) 입니다. Acorn 을 복제(fork) 하여 시작되었고, 빠르고 사용하기 간단하며, 비 표준 (뿐만아니라 미래의 표준) 기능 을 위해 플러그인 기반의 구조를 가지고 있습니다.

먼저, 설치해봅시다.

```sh
$ npm install --save babylon
```

간단하게 코드의 문자열을 파싱해보며 시작해봅시다.

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

`parse()`호출시 아래처럼 options 를 넘길 수도 있습니다:

```js
babylon.parse(code, {
  sourceType: "module", // default: "script"
  plugins: ["jsx"] // default: []
});
```

`sourceType` `"module"` 또는 `"script"` 가 될 수 있고 babylon이 어떤 모드로 parse 하는지 정해줍니다. `"module"` 은 script mode 로 parse 할 것이고 모듈 선언을 허용하지만, `"script"` 는 그렇지 않습니다.

> **주의:** `sourceType` 은 기본으로 `"script"` 이며 여기서`import`나 `export` 를 발견하면 에러를 발생할 것입니다. 이 에러를 해결하려면 `sourceType: "module"` 을 넘겨주세요.

babylon 은 플러그인 기반 아키텍쳐가 내장되어있으므로, 역시 내부 플러그인들을 작동 시킬 수 있는 `plugins` 옵션이 있습니다. 아마 미래에는 가능할 것이지만, 외부 플러그인을 위한 API는 아직 오픈되지 않았다는 것을 주의하세요.

플러그인들의 모든 목록은 [Babylon README](https://github.com/babel/babylon/blob/master/README.md#plugins) 를 참고하세요..

## <a id="toc-babel-traverse"></a>[`babel-traverse`](https://github.com/babel/babel/tree/master/packages/babel-traverse)

babel-traverse 모듈은 전체 트리 상태를 관리하는 노드를 교체, 삭제, 추가하는 일을 담당합니다.

아래 명령어를 실행하여 설치합니다:

```sh
$ npm install --save babel-traverse
```

노드들을 탐색하고 업데이트 하기위해 babylon과 함께 사용할 수 있습니다:

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

babel-types 는 AST 노드들을 위한 Lodash 스타일의 유틸리티 라이브러리 입니다. AST 노드들을 만들고 검사하고 변경하기 위한 메소도들을 포함합니다. 검증된 유틸리티 메소들들을 사용하여 AST 로직을 정리할때 매우 유용합니다.

아래 명령어를 실행하여 설치합니다:

```sh
$ npm install --save babel-types
```

그런 다음 이렇게 사용합니다:

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

### <a id="toc-definitions"></a>정의(Definitions)

Babel에서 types 는 모든 단일 노드 type에 대한 정의들을 가지고 있는데, 어떤 속성이 어디에 속하는지, 어떤 값들이 유효한지, 이 노드를 어떻게 만드는지, 노드를 어떻게 탐색해야 하는지, 그리고 노드의 별명(alias) 정보 등을 가지고 있습니다.

단일 노드 type 정의는 이렇게 생겼습니다:

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

### <a id="toc-builders"></a>빌더(Builders)

위의 정의에서 `BinaryExpression` 이 `builder`를 위한 필드를 가지고 있다는 것을 알아차렸을 겁니다..

```js
builder: ["operator", "left", "right"]
```

각 노드 타입들은 빌더 메소드를 받기 때문인데요, 다음과 같이 사용합니다:

```js
t.binaryExpression("*", t.identifier("a"), t.identifier("b"));
```

이 코드는 아래와 같은 AST 를 생성합니다.

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

이것으로 소스 코드로 찍어보면 다음과 같습니다:

```js
a * b
```

빌더들은 또한 그들이 생성하는 노드들의 유효성을 검사하여 만약 부적절하다면 상세 에러를 던질것입니다. 이것은 다음 메소드 설명에 이어집니다.

### <a id="toc-validators"></a>검증자(Validators)

`BinaryExpression` 정의는 노드의 `fields` 정보와 이것을 어떻게 검사하는 지의 정보도 포함합니다.

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

이것은 두가지 종류의 유효성 검사방법을 만들기 위해 사용됩니다. 첫번째는 `isX` 방법 입니다..

```js
t.isBinaryExpression(maybeBinaryExpressionNode);
```

노드가 binary expression 인지 보장하는 것 뿐만 아니라 두번째 인자로 노드가 특정 속성과 값을 보장하도록 할 수 있습니다.

```js
t.isBinaryExpression(maybeBinaryExpressionNode, { operator: "*" });
```

`true` 나 `false` 를 리턴하는 대신 에러를 던지는 *더욱 확실한*, 메소드의 검증용(assertive) 버전도 있습니다..

```js
t.assertBinaryExpression(maybeBinaryExpressionNode);
t.assertBinaryExpression(maybeBinaryExpressionNode, { operator: "*" });
// Error: Expected type "BinaryExpression" with option { "operator": "*" }
```

### <a id="toc-converters"></a>변환기(Converters)

> [작업중]

## <a id="toc-babel-generator"></a>[`babel-generator`](https://github.com/babel/babel/tree/master/packages/babel-generator)

babel-generator는 Babel의 코드 생성기 입니다. AST 를 받아 소스 코드와 소스맵으로 바꿔줍니다.

설치를 위한 명령어 입니다:

```sh
$ npm install --save babel-generator
```

이렇게 사용합니다

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

`generator()` 에게 options 또한 넘겨줄 수도 있습니다..

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

babel-template 은 작지만 굉장히 유용한 모듈입니다. 손수 거대한 AST 를 만드는 대신 데이터가 들어갈 곳을 표시자(placeholders) 로 나타내며 코드를 작성할수 있게해줍니다. 컴퓨터 과학 분야에서, 이런 기술을 quasiquotes라고 부릅니다.

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

# <a id="toc-writing-your-first-babel-plugin"></a>첫 Babel 플러그인 작성하기

이제 Babel 의 기본기를 쌓았으면, 플러그인 API 에 대해서 함께 알아봅시다.

현재 [`babel`](https://github.com/babel/babel/tree/master/packages/babel-core)객체를 받는 `함수` 부터 시작합니다.

```js
export default function(babel) {
  // plugin contents
}
```

자주 사용될 것 이기 때문에, `babel.types`만을 이렇게 받을 수도 있습니다:

```js
export default function({ types: t }) {
  // plugin contents
}
```

그러면 플러그인의 최초의 방문자(visitor) 인 이 `방문자(visitor)` 속성을 가진 객체를 리턴합니다.

```js
export default function({ types: t }) {
  return {
    visitor: {
      // visitor contents
    }
  };
};
```

어떻게 동작하는지 빠르게 구현해봅시다. 이것이 우리의 소스코드 입니다.

```js
foo === bar;
```

AST 로 본다면 이렇습니다:

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

`BinaryExpression`에 방문자 메소드를 추가하면서 시작해봅시다.

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

그리고 `BinaryExpression` 이 `===` 연산자만 처리하도록 범위를 좁혀봅시다.

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

자 `left` 속성을 새로운 식별자로 바꿔봅시다.

```js
BinaryExpression(path) {
  if (path.node.operator !== "===") {
    return;
  }

  path.node.left = t.identifier("sebmck");
  // ...
}
```

이 플러그인을 실행하면 벌써 이런 결과를 얻을 수 있습니다.

```js
sebmck === bar;
```

자 이제 `right` 속성을 바꿔봅시다.

```js
BinaryExpression(path) {
  if (path.node.operator !== "===") {
    return;
  }

  path.node.left = t.identifier("sebmck");
  path.node.right = t.identifier("dork");
}
```

그러면 이제 최종 결과는:

```js
sebmck === dork;
```

와우! 이게 우리의 첫번째 Babel 플러그인입니다.

* * *

# <a id="toc-transformation-operations"></a>변환 작업

## <a id="toc-visiting"></a>방문하기(Visiting)

### <a id="toc-check-if-a-node-is-a-certain-type"></a>노드가 어떤 type인지 확인하자

노드 타입을 확인하기 원한다면, 우선 이런 방법을 쓸 수 있습니다:

```js
BinaryExpression(path) {
  if (t.isIdentifier(path.node.left)) {
    // ...
  }
}
```

또한 해당 노드의 속성에 대해 얕은 검사(shallow check) 를 할 수도 있습니다.

```js
BinaryExpression(path) {
  if (t.isIdentifier(path.node.left, { name: "n" })) {
    // ...
  }
}
```

이 코드는 아래의 코드와 똑같은 기능을 합니다.

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

### <a id="toc-check-if-an-identifier-is-referenced"></a>식별자가 참조인지를 확인하자

```js
Identifier(path) {
  if (path.isReferencedIdentifier()) {
    // ...
  }
}
```

또는:

```js
Identifier(path) {
  if (t.isReferenced(path.node, path.parent)) {
    // ...
  }
}
```

## <a id="toc-manipulation"></a>조작(Manipulation)

### <a id="toc-replacing-a-node"></a>노드 교체하기

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

### <a id="toc-replacing-a-node-with-multiple-nodes"></a>노드 하나를 여러개의 노드로 교체하기

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

> **주의:** 하나의 expression을 여러개의 노드로 대체할땐, 반드시 statements 여야 합니다. Babel 은 노드를 변환할때 휴리스틱(heuristics) 방법을 광범위하게 사용하는데, 이를 지키지 않으면 매우 이상한(crazy) 변환들이 엄청나게 발생 할 수도 있기 때문입니다.

### <a id="toc-replacing-a-node-with-a-source-string"></a>노드를 소스 코드로 교체하기

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

> **주의:** 동적 소스 코드 문자열을 사용하지 않는한 이 API는 권장하지 않지만, 방문자 밖에서 코드를 분석할 수 있는 효율적인 방법입니다.

### <a id="toc-inserting-a-sibling-node"></a>형제 노드(sibling node) 삽입하기

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

> **주의:** 반드시 statement 또는 statement의 array 어야 합니다. [하나의 노드를 여러 노드로 대체하기](#replacing-a-node-with-multiple-nodes)에서 언급했던 같은 휴리스틱 방식을 사용합니다..

### <a id="toc-removing-a-node"></a>노드 삭제하기

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

### <a id="toc-replacing-a-parent"></a>부모 교체하기

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

### <a id="toc-removing-a-parent"></a>부모 삭제하기

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

## <a id="toc-scope"></a>범위(Scope)

### <a id="toc-checking-if-a-local-variable-is-bound"></a>지역 변수가 scope 안에 있는지 확인하기

```js
FunctionDeclaration(path) {
  if (path.scope.hasBinding("n")) {
    // ...
  }
}
```

이 코드는 scope 트리를 상위로 거슬러 올라가며 특정 바인딩이 있는지 확인 할 것입니다. (역자주: javascript 에서는 상위 scope에 있는 변수에도 접근 가능)

또한 scope **자신이** 가지고 있는 바인딩인지 검사 할 수도 있습니다.

```js
FunctionDeclaration(path) {
  if (path.scope.hasOwnBinding("n")) {
    // ...
  }
}
```

### <a id="toc-generating-a-uid"></a>UID 생성하기

이 코드는 어떤 지역 변수 선언과도 충돌하지 않는 식별자를 생성할 것입니다.

```js
FunctionDeclaration(path) {
  path.scope.generateUidIdentifier("uid");
  // Node { type: "Identifier", name: "_uid" }
  path.scope.generateUidIdentifier("uid");
  // Node { type: "Identifier", name: "_uid2" }
}
```

### <a id="toc-pushing-a-variable-declaration-to-a-parent-scope"></a>부모 스코프에 변수 선언 밀어 넣기

때로는 `VariableDeclaration` 을 밀어넣어 할당하고 하고 싶을 수 있습니다.

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

### <a id="toc-rename-a-binding-and-its-references"></a>바인딩과 참조의 이름 변경하기

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

또는, 고유 식별자를 생성하여 바인딩의 이름을 변경할 수 있습니다.

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

# <a id="toc-plugin-options"></a>플러그인 옵션

플러그인에 사용자정의 기능을 넣기 원한다면 유저가 명시할 수 있는 특정 옵션을 허용 해 줄수 있습니다:

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

이 옵션들은 `state` 객체를 통해 플러그인 방문자로 전달됩니다.

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

이 옵션들은 해당 플러그인에 한정되며 다른 플러그인에서 접근 할 수 없습니다.

* * *

# <a id="toc-building-nodes"></a>노드 만들기(Building Nodes)

변환 작업을 할때 노드들을 AST에 삽입하고 싶을때가 자주 있었을 것입니다. 이전에 언급한 것처럼, [`babel-types`](#babel-types)패키지 안의 [builder](#builder)메소드를 사용하여 할 수 있습니다.

빌더의 메소드 이름은 간단하게 첫 문자가 소문자 라는 것만 제외하고는 만들고 싶은 노드의 타입 이름입니다. 예를 들어 `MemberExpression` 을 만들고 싶다면 `t.memberExpression(...)`을 사용하면 됩니다..

이 빌더들의 인자들은 노드 정의에 의해 결정됩니다. 이 정의와 관련해서 좀 더 가독성이 뛰어난 문서를 작성 중이긴 하지만 그때까진 일단 [여기](https://github.com/babel/babel/tree/master/packages/babel-types/src/definitions)서 모든 내용을 볼 수 있습니다..

노드 정의는 아래와 같이 생겼습니다:

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

여기에서 특정 노드 타입에 대해 어떻게 만들고, 탐색하고, 검사하는 방법을 포함한 모두 정보를 알수 있습니다.

`builder`속성을 보면, builder 메소드(`t.memberExpression`) 를 호출할때 필요한 3개의 인자를 볼수 있습니다.).

```js
builder: ["object", "property", "computed"],
```

> 이 노드는 `builder` 배열이 포함하는 것보다 더 많은 커스터마이징한 당신만의 속성을 가질수 있다는 것을 주의하세요. builder 가 너무 많은 인자를 가지는 것을 방지하기 위함입니다. 이러한 경우엔 수동으로 속성을 셋팅 해줘야 합니다. `ClassMethod<0>의 예제입니다.</p>
</blockquote>

<p><code>fields`객체에서 builder 인자들을 위한 validation 을 확인할 수 있습니다.</p> 
> 
> ```js
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

`object`는 `Expression`이 되야하고, `property`는 member expression이 `computed` 인지 아닌지에 따라 `Expression` 또는 ` Identifier`가 되야하며, `computed`는 간단하게 기본값을 `false`로 갖는 boolean 인것을 볼 수 있습니다..

`MemberExpression`을 아래와 같이 구현할 수 있습니다:

```js
t.memberExpression(
  t.identifier('object'),
  t.identifier('property')
  // `computed` is optional
);
```

이것의 결과는:

```js
object.property
```

하지만, `object` 는 `Expression` 이어야한다고 말했는데 왜 `Identifier` 로 검사하는 걸까요?

`Identifier`의 정의를 잘 보면 `aliases`속성을 가지고 있는 것을 볼수 있는데 고로 이는 동시에 expression 이기도 합니다.

```js
aliases: ["Expression", "LVal"],
```

그래서 `MemberExpression`이 `Expression` 타입이기 때문에, 또 다른 `MemberExpression`의 `object` 로 셋팅 할수 있습니다.

```js
t.memberExpression(
  t.memberExpression(
    t.identifier('member'),
    t.identifier('expression')
  ),
  t.identifier('property')
)
```

이것의 결과는:

```js
member.expression.property
```

모든 노드 타입의 대해 builder 메소드 특징을 기억해야하는것은 매우 별로입니다. 그래서 그들이 어떻게 노드 정의로부터 생성되는지를 이해하는데 시간을 투자해야합니다.

실제 모든 [정의](https://github.com/babel/babel/tree/master/packages/babel-types/src/definitions) 들과 [문서들을](https://github.com/babel/babel/blob/master/doc/ast/spec.md) 확인할 수 있습니다.

* * *

# <a id="toc-best-practices"></a>모범 사례

> 앞으로 몇 주 동안 이 섹션을 작성할 것입니다.

## <a id="toc-avoid-traversing-the-ast-as-much-as-possible"></a>가능한 AST 탐색을 피하라

AST를 탐색하는 것은 고비용이며, 의도치 않게 필요한 것 보다 더 많은 탐색을 하기 쉽습니다. 이런 추가 수행이 수천 또는 수만번이 될 수 있습니다.

Babel은 단일 탐색으로 모든 것을 할 수 있다면 방문자들을 병합(merging) 함으로써, 가능한 이것을 최적화 합니다.

### <a id="toc-merge-visitors-whenever-possible"></a>가능하다면 방문자들을 병합(merge) 하라

방문자를 작성할때, 논리적으로 필요한 여러 위치에서 `path.traverse`를 호출하고 싶을 수 있습니다.

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

그러나, 오직 1번만 실행되는 단일 방문자로 작성하는게 더 좋습니다. 그렇지 않으면 이유없이 같은 트리를 여러번 탐색 할 수 있습니다.

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

### <a id="toc-do-not-traverse-when-manual-lookup-will-do"></a>수동 조회할 땐 탐색하지 마라

특정 노드 타입을 찾을때 역시 `path.traverse` 을 호출하고 싶을 것입니다.

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

그러나, 뭔가 특정하고 얕은 검사로 찾을수 있는 것을 찾고 있다면, 비싼 탐색을 수행하지 않고 수동으로 필요한 노드를 수동으로 찾을수 있는 좋은 기회입니다.

```js
const MyVisitor = {
  FunctionDeclaration(path) {
    path.node.params.forEach(function() {
      // ...
    });
  }
};
```

## <a id="toc-optimizing-nested-visitors"></a>중첩된 방문자들 최적화하기

방문자들을 중첩하고 싶을때, 코드 안에 작성하는 것도 일리가 있습니다.

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

하지만, 이는 위에서 `FunctionDeclaration()`가 호출 될때마다 새로운 방문자 객체를 생성하며, 이때마다 Babel이 엄청나게 일을하며 유효성을 확인해야합니다. 이건 매우 고비용이라, 방문자를 끌어 올리는 것(hoist up) 이 낫습니다.

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

내부 방문자 안에 어떤 상태(state) 를 필요로 하는 경우, 다음과 같이:

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

`traverse()`메소드에 상태를 넘겨줄 수 잇고 방문자안의 `this`를 통해 접근 할수 있습니다.

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

## <a id="toc-being-aware-of-nested-structures"></a>중첩된 구조(nested structures) 인지하기

때로는 어떤 변환(transform) 에 대해 생각할때, 주어진 구조가 중첩 구조일 일수 있다는 것을 망각할수 있습니다.

예를 들어, `Foo` `ClassDeclaration` 으로부터 `constructor` `ClassMethod` 를 조회하기 원한다고 가정해봅시다..

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

클래스들이 중첩되어 있을수 있고 위의 코드대로 탐색을 할때, 사용하 중첩된`constructor` 까지 도달할 수 있다는 사실을 망각하고 있습니다.

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

> ***향후 업데이트에 대한 내용은 Twitter의 [@thejameskyle](https://twitter.com/thejameskyle)를 팔로우하세요.***