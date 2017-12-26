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
      * [정의(Definitions)](#toc-definitions)
      * [빌더(Builders)](#toc-builders)
      * [Validators](#toc-validators)
      * [Converters](#toc-converters)
      * [babel-generator](#toc-babel-generator)
      * [babel-template](#toc-babel-template)
  * [첫 Babel 플러그인 작성](#toc-writing-your-first-babel-plugin)
  * [변환 작업](#toc-transformation-operations) 
      * [방문하기(Visiting)](#toc-visiting)
      * [서브-노드의 경로 얻기](#toc-get-the-path-of-a-sub-node)
      * [노드가 어떤 형식인지 확인하기](#toc-check-if-a-node-is-a-certain-type)
      * [경로가 어떤 형식인지 확인하기](#toc-check-if-a-path-is-a-certain-type)
      * [식별자가 참조되었는지 확인하기](#toc-check-if-an-identifier-is-referenced)
      * [특정한 부모 경로 찾기](#toc-find-a-specific-parent-path)
      * [형제 경로 얻기](#toc-get-sibling-paths)
      * [탐색 중지하기](#toc-stopping-traversal)
      * [노드 변형하기](#toc-manipulation)
      * [노드 교체하기](#toc-replacing-a-node)
      * [노드 하나를 여러 개의 노드로 교체하기](#toc-replacing-a-node-with-multiple-nodes)
      * [노드 하나를 소스 문자열로 교체하기](#toc-replacing-a-node-with-a-source-string)
      * [형제 노드를 삽입하기](#toc-inserting-a-sibling-node)
      * [컨테이너에 삽입하기](#toc-inserting-into-a-container)
      * [노드 삭제하기](#toc-removing-a-node)
      * [부모 교체하기](#toc-replacing-a-parent)
      * [부모 삭제하기](#toc-removing-a-parent)
      * [스코프](#toc-scope)
      * [지역 변수가 바인딩되었는지 확인하기](#toc-checking-if-a-local-variable-is-bound)
      * [UID 생성하기](#toc-generating-a-uid)
      * [부모 스코프에 변수 선언 집어넣기](#toc-pushing-a-variable-declaration-to-a-parent-scope)
      * [바인딩과 참조의 이름 바꾸기](#toc-rename-a-binding-and-its-references)
  * [플러그인 옵션](#toc-plugin-options) 
      * [플러그인의 전처리와 후처리](#toc-pre-and-post-in-plugins)
      * [플러그인에서 구문 활성화하기](#toc-enabling-syntax-in-plugins)
  * [노드 만들기(Building Nodes)](#toc-building-nodes)
  * [모범 사례](#toc-best-practices) 
      * [가능한 AST 탐색을 피하라](#toc-avoid-traversing-the-ast-as-much-as-possible)
      * [가능하다면 방문자들을 병합(merge) 하라](#toc-merge-visitors-whenever-possible)
      * [수동 조회할 땐 탐색하지 마라](#toc-do-not-traverse-when-manual-lookup-will-do)
      * [중첩된 방문자들 최적화하기](#toc-optimizing-nested-visitors)
      * [중첩된 구조(nested structures) 인지하기](#toc-being-aware-of-nested-structures)
      * [단위 테스트](#toc-unit-testing)

# <a id="toc-introduction"></a>소개

Babel은 일반적으로 다목적 자바스크립트 컴파일러입니다. 더 나아가 많은 형태의 정적 분석 (Static analysis) 에 사용되는 모듈들의 모음(collection) 이기도 합니다.

> 정적 분석(Static analysis) 이란 코드를 실행하지 않고 분석하는 작업 입니다. 코드를 실행하는 동안 분석하는 것은 동적 분석(dynamic analysis) 으로 알려져 있습니다. 정적 분석의 목적은 매우 다양합니다. 구문 검사 (linting), 컴파일링, 코드 하이라이팅, 코드 변환, 최적화, 압축(minification) 등 매우 많은 용도로 사용될 수 있습니다.

생산성을 향상시켜주고 더 좋은 프로그램을 작성하게 해주는 많은 다양한 형태의 도구들을 Babel 을 사용하여 만들 수 있습니다.

> ***향후 업데이트에 대한 내용은 Twitter의 [@thejameskyle](https://twitter.com/thejameskyle)를 팔로우하세요.***

* * *

# <a id="toc-basics"></a>기본

Babel은 JavaScript 컴파일러입니다. 정확히는 source-to-source 컴파일러이며 "트랜스파일러(transpiler)" 라고 불립니다. 즉, Babel에 자바스크립트 코드를 넘겨주면 Babel에서 코드를 수정하고 새로운 코드를 생성하여 반환해주게 됩니다.

## <a id="toc-asts"></a>추상 구문 트리 (ASTs)

각 과정들은 [추상 구문 트리(AST)](https://en.wikipedia.org/wiki/Abstract_syntax_tree)를 생성하거나 이것을 다루게됩니다.

> Babel은 [ESTree](https://github.com/estree/estree)에서 수정된 AST를 사용하며, 핵심 스팩은 [여기](https://github.com/babel/babylon/blob/master/ast/spec.md)에 있습니다.

```js
function square(n) {
  return n * n;
}
```

> AST 노드(AST nodes) 들에 더 알고 싶으면 [AST 탐색기](http://astexplorer.net/)를 확인해보세요. [이 링크](http://astexplorer.net/#/Z1exs6BWMq) 는 위 코드를 붙여넣기한 예제입니다.

위의 코드는 이런 트리로 나타낼 수 있습니다:

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

구문 분석 과정에서는 토큰들의 스트림을 취해 AST 표현으로 바꿀 것 입니다. 이 과정에서는 토큰들 안에 있는 정보를 사용해서, 토큰들을 코드의 구조를 나타내는 AST로 재 구성하여 다루기 쉽게 만듭니다.

### <a id="toc-transform"></a>변환(Transform)

[변환](https://en.wikipedia.org/wiki/Program_transformation) 단계에서는 추상 구문 트리(AST) 를 받아 그 속을 탐색해 나가며 노드들을 추가, 업데이트, 제거 합니다. Babel 이나 어떤 컴파일러에게라도 이 과정은 단연코 가장 복잡한 부분입니다. 이 과정에서 플러그인이 수행되므로 이 핸드북에서 가장 많이 다뤄질 것입니다. 그래서 지금 당장은 너무 깊게 들어가지 않겠습니다.

### <a id="toc-generate"></a>생성(Generate)

[코드 생성](https://en.wikipedia.org/wiki/Code_generation_(compiler)) 단계에서는 최종 AST를 취하여 다시 소스 코드 문자열로 만드는데, [소스 맵](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/) 또한 생성합니다..

소스 코드 생성은 매우 간단합니다: AST를 깊이 우선 탐색법으로 탐색하며 변환된 코드를 나타내는 문자열을 만듭니다.

## <a id="toc-traversal"></a>탐색(Traversal)

AST 변환을 하고 싶을때, 재귀적으로 [트리를 탐색](https://en.wikipedia.org/wiki/Tree_traversal)해야합니다.

`FunctionDeclaration` type이 있다고 해봅시다. 이것은 몇 개의 속성들을 가지고 있습니다: `id`, `params`, 그리고 `body`. 이 각각은 중첩된 노드들을 가지고 있습니다.

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

다음은 `params` 인데, 이것은 노드들의 배열이므로 각각을 방문합니다. 여기에서는 `Identifier`인 단일 노드뿐이므로 넘어갑시다.

그러면 이제 `body`인데 노드들의 배열인 `body`를 속성으로 가지는 `BlockStatement`이므로 각각의 노드를 방문합니다.

여기엔 오직 `argument` 속성을 가지고 있는 `ReturnStatement` 하나가 있는데, `argument` 속성으로 가면 `BinaryExpression` 이 있습니다.

`BinaryExpression`은 `operator`, `left`, `right` 를 가지고 있습니다. Operator 는 노드가 아닌 단순 값이라 여긴 방문하지 않고, 대신 `left` 와 `right`를 방문 해봅시다.

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

// You can also create a visitor and add methods on it later
let visitor = {};
visitor.MemberExpression = function() {};
visitor.FunctionDeclaration = function() {}
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
path.traverse(MyVisitor);
Called!
Called!
Called!
Called!
```

이들은 모두 노드에 **입장(enter)**할때 호출됩니다. 그러나 **퇴장(exit)**할때 방문자 메소드가 호출되게 하는 것도 가능합니다.

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

만일 필요하다면, 메소드 이름을 문자열로 `Identifier|MemberExpression`와 같이 `|`로 나눔으로써 같은 함수를 여러 방문자 노드에 적용할 수 있습니다.

예시 [flow-comments](https://github.com/babel/babel/blob/2b6ff53459d97218b0cf16f8a51c14a165db1fd2/packages/babel-plugin-transform-flow-comments/src/index.js#L47) 플러그인

```js
const MyVisitor = {
  "ExportNamedDeclaration|Flow"(path) {}
};
```

또한 별칭(aliases)을 사용할 수도 있습니다.([babel-types](https://github.com/babel/babel/tree/master/packages/babel-types/src/definitions)에 정의된 대로).

예를 들어,

`Function` 은 `FunctionDeclaration`, `FunctionExpression`, `ArrowFunctionExpression`, `ObjectMethod` 그리고 `ClassMethod` 에 대한 별명입니다..

```js
const MyVisitor = {
  Function(path) {}
};
```

### <a id="toc-paths"></a>경로(Paths)

추상구문트리(AST) 는 일반적으로 많은 노드들을 가지고 있는데, 어떻게 노드들이 다른 노드와 연결될 수 있을까요? 어디서든 조작하고 접근할 수 있는 하나의 거대한 변경가능한(mutable) 객체를 가질 수 있지만, **Paths** 를 사용해 단순화시킬 수도 있습니다.

**Path** 는 두 노드 사이의 연결을 표현하는 객체입니다.

예를들어 아래와 같은 노드와 그 자식 노드가 있다고 해봅시다:

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

그리고 자식 노드인 `Identifier`를 경로(path)로 표현하면, 다음과 같습니다:

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

이것은 또한 경로에 대한 추가적인 메타데이터(metadata)를 가집니다:

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

뿐만아니라 노드들의 추가, 업데이트, 이동, 삭제와 관련된 굉장히 많은 메소드들도 있습니다만, 나중에 알아보도록 하겠습니다.

한마디로 Path들은 트리에서 노드의 위치에 대한 **리액티브(reactive)**한 표현이고 노드에 관련된 모든 종류의 정보입니다. 언제든지 트리를 변경하는 메소드를 호출할때마다, 이 정보는 업데이트됩니다. Babel은 당신이 노드들을 쉽고, 최대한 stateless하게 다루도록 이 모든 것을 관리합니다.

#### <a id="toc-paths-in-visitors"></a>방문자 안의 Paths (Paths in Visitors)

`Identifier()` 메소드를 가지는 방문자가 있을때, 실제로 방문하는 것은 노드가 아닌 path 입니다. 따라서 노드를 직접 다루기 보다는 주로 그 노드의 리액티브(reactive)한 표현을 사용하여 작업할 수 있습니다.

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
path.traverse(MyVisitor);
Visiting: a
Visiting: b
Visiting: c
```

### <a id="toc-state"></a>상태(State)

상태(State) 는 추상 구문 트리(AST) 변환의 적입니다. 상태는 계속해서 당신을 괴롭힐 것이며 상태에 대한 추정은 당신이 고려하지 못했던 구문(syntax)에 의해 거의 항상 틀릴 것입니다.

아래의 코드를 봅시다:

```js
function square(n) {
  return n * n;
}
```

`n`의 이름을 `x`로 바꾸는 빠르고 간단한 방문자를 작성해봅시다.

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

위 코드는 아마 잘 동작 할테지만, 아래와 같은 경우 제대로 동작하지 않습니다:

```js
function square(n) {
  return n * n;
}
n;
```

더 좋은 방법은 재귀(recursion) 를 쓰는 것입니다. Christopher Nolan의 영화처럼 방문자안에 방문자를 넣어봅시다.

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

path.traverse(MyVisitor);
```

물론, 이건 부자연스러운 예제이긴 하지만 방문자에서 전역 상태(global state) 를 어떻게 제거할 수 있는지 보여줍니다.

### <a id="toc-scopes"></a>범위(Scopes)

다음으로 [**scope**](https://en.wikipedia.org/wiki/Scope_(computer_science)) 개념을 소개합니다. 자바스크립트는 [lexical scoping](https://en.wikipedia.org/wiki/Scope_(computer_science)#Lexical_scoping_vs._dynamic_scoping)을 가지고 있는데, 이것은 트리 구조이며 블록은 새로운 scope을 생성합니다.

```js
// 전역 스코프

function scopeOne() {
  // scope 1

  function scopeTwo() {
    // scope 2
  }
}
```

자바스크립트에서는 참조(reference)를 선언할 경우, 그게 변수든, 함수든, 클래스든, 파라미터든, import든, label이든 뭐든지 간에 현재 scope에 속하게 됩니다.

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

또한 하위 scope에서 상위 scope의 참조를 바꾸지 않고, 같은 이름의 참조를 생성할 수 있습니다.

```js
function scopeOne() {
  var one = "I am in the scope created by `scopeOne()`";

  function scopeTwo() {
    var one = "I am creating a new `one` but leaving reference in `scopeOne()` alone.";
  }
}
```

코드가 변환(transform) 이 될 때, 이 scope를 고려해야 합니다. 코드의 다른 부분이 수정되는 동안 기존 코드가 깨지지 않도록 해야 합니다.

우리는 새로운 변수들을 추가하고, 그 변수들이 기존의 것들과 충돌하지 않도록 할 수도 있습니다. 아니면 단순히 변수가 어디에서 참조되는지 찾을 수도 있습니다. 우리는 주어진 scope에서 이 참조들이 추적될 수 있도록 만들려고 합니다.

Scope는 다음과 같이 나타낼 수 있습니다:

```js
{
  path: path,
  block: path.node,
  parentBlock: path.parent,
  parent: parentScope,
  bindings: [...]
}
```

새로운 scope 생성 시 그것의 경로(path)와 부모(parent) scope를 전달함으로써 그렇게 할 수 있습니다. 그런 다음 그것은 탐색 과정 중 해당 scope의 모든 참조("bindings")들을 수집합니다.

이것이 끝나면, scope 안에서 사용할 수 있는 각종 메소드들이 있게 됩니다. 이것에 대해선 나중에 알아봅시다.

#### <a id="toc-bindings"></a>바인딩(Bindings)

특정 scope에 속하는 모든 참조들; 이 관계를 **바인딩**(binding) 이라고 합니다.

```js
function scopeOnce() {
  var ref = "This is a binding";

  ref; // 바인딩에 대한 참조입니다

  function scopeTwo() {
    ref; // 낮은 스코프의 바인딩에 대한 참조입니다
  }
}
```

하나의 binding은 이렇게 생겼습니다:

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

이 정보들로 binding의 모든 참조들을 찾을 수 있고, 어떤 binding 타입(파라미터인지 선언인지 등등)인지 알 수 있고, 어떤 scope에 속하는지 찾거나, identifier의 사본을 얻을 수 있습니다. 또한 그것이 상수인지 알 수 있고, 만일 아니라면 어떤 path들이 그것을 변경했는지도 알 수 있습니다.

상수인지 아닌지는 다양한 이유로 유용한 정보인데, 가장 큰 이유는 minification 때문입니다.

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

Babel 은 사실 모듈들의 집합입니다. 이 장에서는 중요한 모듈들이 살펴보고, 그것들이 무엇을 하고, 어떻게 그것들을 사용할 것인지 설명합니다.

> 주의: 이 장은 곧 준비될 예정인 상세 API 문서를 대체하지는 않습니다.

## <a id="toc-babylon"></a>[`babylon`](https://github.com/babel/babylon)

Babylon 은 Bable의 분석기(parser) 입니다. Acorn 을 복제(fork) 하여 시작되었고, 빠르고 사용하기 간단하며, 비 표준 (그뿐만 아니라 미래의 표준) 기능을 위해 플러그인 기반의 구조를 가지고 있습니다.

먼저, 설치해봅시다.

```sh
$ npm install --save babylon
```

간단하게 코드의 문자열을 파싱 해보며 시작해봅시다.

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

`parse()`호출 시 아래와 같이 option들을 넘길 수도 있습니다:

```js
babylon.parse(code, {
  sourceType: "module", // default: "script"
  plugins: ["jsx"] // default: []
});
```

`sourceType` `"module"` 또는 `"script"` 가 될 수 있고 babylon이 어떤 모드로 파싱 하는지 정해줍니다. `"module"` 은 strict mode로 파싱하고 모듈 선언을 허용하지만, `"script"` 는 그렇지 않습니다.

> **주의:** `sourceType` 은 기본으로 `"script"` 이며 여기서`import`나 `export` 를 발견하면 에러를 발생할 것입니다. 이 에러를 해결하려면 `sourceType: "module"` 을 넘겨주세요.

Babylon은 플러그인 기반 설계로 만들어져서, 내부 플러그인들(`plugins`)을 작동 시킬 수 있는 옵션이 있습니다. 아마 나중에는 그렇게 되겠지만, Babylon은 아직 이 API를 외부 플러그인들에게 오픈하지 않았다는 것을 알아두세요.

플러그인들의 모든 목록은 [Babylon README](https://github.com/babel/babylon/blob/master/README.md#plugins) 를 참고하세요..

## <a id="toc-babel-traverse"></a>[`babel-traverse`](https://github.com/babel/babel/tree/master/packages/babel-traverse)

Babel Traverse 모듈은 트리의 모든 상태를 관리하고, 노드들의 교체, 삭제, 추가하는 일을 담당합니다.

아래 명령어를 실행하여 설치합니다:

```sh
$ npm install --save babel-traverse
```

노드들을 탐색하고 업데이트하기 위해 Babylon과 함께 사용할 수 있습니다:

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

Babel Types 는 AST 노드들을 위한 Lodash 스타일의 유틸리티 라이브러리입니다. 이 라이브러리는 AST 노드들을 만들고(building), 검사하고(validating), 변경하기(converting) 위한 메소드들을 포함합니다. 검증된 유틸리티 메소드들을 사용하여 AST 로직을 정리할 때 매우 유용합니다.

아래 명령어를 실행하여 설치합니다:

```sh
$ npm install --save babel-types
```

그다음 이렇게 사용할 수 있습니다:

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

Babel Types 는 모든 노드 type에 대한 정의들을 가지고 있는데, 어떤 속성이 어디에 속하는지, 어떤 값들이 유효한지, 이 노드를 어떻게 만드는지, 노드를 어떻게 탐색해야 하는지, 그리고 노드가 어떤 별명(aliases)을 가지는지에 대한 정보를 가집니다.

하나의 노드 type 정의는 이렇게 생겼습니다:

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

위의 정의에서 `BinaryExpression` 이 `builder`를 위한 필드를 가지고 있다는 것을 알아차렸을 겁니다.

```js
builder: ["operator", "left", "right"]
```

이는 각 노드 타입이 빌더 메소드를 받기 때문인데, 다음과 같이 사용됩니다:

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

빌더들은 또한 그들이 생성하는 노드들의 유효성을 검사하여 만약 부적절하다면 상세 에러를 던질 것입니다. 이것은 다음 메소드 설명에 이어집니다.

### <a id="toc-validators"></a>검증자(Validators)

`BinaryExpression` 정의는 노드의 `fields` 정보와 이것을 어떻게 검증(validate) 하는지에 대한 정보도 포함합니다.

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

이것은 두 종류의 검증 메소드들을 만들기 위해 사용됩니다. 첫번째는 `isX`입니다..

```js
t.isBinaryExpression(maybeBinaryExpressionNode);
```

이것은 노드가 binary expression 인지 보장하는 것뿐만 아니라 노드가 특정 속성들과 값들을 가지는지 확인하도록 두 번째 파라미터를 보낼 수 있습니다.

```js
t.isBinaryExpression(maybeBinaryExpressionNode, { operator: "*" });
```

*ehem*이라는 `true` 나 `false` 를 리턴하는 대신 에러를 던지는 assertive 형식의 메소드도 있습니다.

```js
t.assertBinaryExpression(maybeBinaryExpressionNode);
t.assertBinaryExpression(maybeBinaryExpressionNode, { operator: "*" });
// Error: Expected type "BinaryExpression" with option { "operator": "*" }
```

### <a id="toc-converters"></a>변환기(Converters)

> [작업중]

## <a id="toc-babel-generator"></a>[`babel-generator`](https://github.com/babel/babel/tree/master/packages/babel-generator)

Babel Generator는 Babel의 코드 생성기입니다. AST를 받아 소스 코드와 소스맵으로 바꿔줍니다.

아래 명령어를 실행하여 설치합니다:

```sh
$ npm install --save babel-generator
```

그 다음 이렇게 사용합니다

```js
import * as babylon from "babylon";
import generate from "babel-generator";

const code = `function square(n) {
  return n * n;
}`;

const ast = babylon.parse(code);

generate(ast, {}, code);
// {
//   code: "...",
//   map: "..."
// }
```

`generator()` 에게 옵션들(options) 을 넘겨줄 수도 있습니다.

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

Babel Template 은 작지만 굉장히 유용한 모듈입니다. 직접 거대한 AST 를 만드는 대신 데이터가 들어갈 곳을 표시자(placeholders) 로 나타내며 코드를 작성할 수 있게 해줍니다. 컴퓨터 과학 분야에선, 이런 기술을 quasiquotes라고 부릅니다.

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

Now that you're familiar with all the basics of Babel, let's tie it together with the plugin API.

Start off with a `function` that gets passed the current [`babel`](https://github.com/babel/babel/tree/master/packages/babel-core) object.

```js
export default function(babel) {
  // plugin contents
}
```

Since you'll be using it so often, you'll likely want to grab just `babel.types` like so:

```js
export default function({ types: t }) {
  // plugin contents
}
```

Then you return an object with a property `visitor` which is the primary visitor for the plugin.

```js
export default function({ types: t }) {
  return {
    visitor: {
      // visitor contents
    }
  };
};
```

Each function in the visitor receives 2 arguments: `path` and `state`

```js
export default function({ types: t }) {
  return {
    visitor: {
      Identifier(path, state) {},
      ASTNodeTypeHere(path, state) {}
    }
  };
};
```

Let's write a quick plugin to show off how it works. Here's our source code:

```js
foo === bar;
```

Or in AST form:

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

We'll start off by adding a `BinaryExpression` visitor method.

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

Then let's narrow it down to just `BinaryExpression`s that are using the `===` operator.

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

Now let's replace the `left` property with a new identifier:

```js
BinaryExpression(path) {
  if (path.node.operator !== "===") {
    return;
  }

  path.node.left = t.identifier("sebmck");
  // ...
}
```

Already if we run this plugin we would get:

```js
sebmck === bar;
```

Now let's just replace the `right` property.

```js
BinaryExpression(path) {
  if (path.node.operator !== "===") {
    return;
  }

  path.node.left = t.identifier("sebmck");
  path.node.right = t.identifier("dork");
}
```

And now for our final result:

```js
sebmck === dork;
```

Awesome! Our very first Babel plugin.

* * *

# <a id="toc-transformation-operations"></a>변환 작업

## <a id="toc-visiting"></a>방문하기(Visiting)

### <a id="toc-get-the-path-of-a-sub-node"></a>서브-노드의 경로 얻기

To access an AST node's property you normally access the node and then the property. `path.node.property`

```js
// the BinaryExpression AST node has properties: `left`, `right`, `operator`
BinaryExpression(path) {
  path.node.left;
  path.node.right;
  path.node.operator;
}
```

If you need to access the `path` of that property instead, use the `get` method of a path, passing in the string to the property.

```js
BinaryExpression(path) {
  path.get('left');
}
Program(path) {
  path.get('body.0');
}
```

### <a id="toc-check-if-a-node-is-a-certain-type"></a>노드가 어떤 형식인지 확인하기

노드의 형식이 무엇인지 확인하고 싶을 때 가장 권장되는 방법은 다음과 같습니다:

```js
BinaryExpression(path) {
  if (t.isIdentifier(path.node.left)) {
    // ...
  }
}
```

또한 해당 노드의 속성에 대해 얕은 검사 (shallow check) 를 할 수도 있습니다.

```js
BinaryExpression(path) {
  if (t.isIdentifier(path.node.left, { name: "n" })) {
    // ...
  }
}
```

이 코드는 아래의 코드와 동일한 기능을 합니다:

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

### <a id="toc-check-if-a-path-is-a-certain-type"></a>경로가 어떤 형식인지 확인하기

A path has the same methods for checking the type of a node:

```js
BinaryExpression(path) {
  if (path.get('left').isIdentifier({ name: "n" })) {
    // ...
  }
}
```

is equivalent to doing:

```js
BinaryExpression(path) {
  if (t.isIdentifier(path.node.left, { name: "n" })) {
    // ...
  }
}
```

### <a id="toc-check-if-an-identifier-is-referenced"></a>식별자가 참조되었는지 확인하기

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

### <a id="toc-find-a-specific-parent-path"></a>특정한 부모 경로 찾기

Sometimes you will need to traverse the tree upwards from a path until a condition is satisfied.

Call the provided `callback` with the `NodePath`s of all the parents. When the `callback` returns a truthy value, we return that `NodePath`.

```js
path.findParent((path) => path.isObjectExpression());
```

If the current path should be included as well:

```js
path.find((path) => path.isObjectExpression());
```

Find the closest parent function or program:

```js
path.getFunctionParent();
```

Walk up the tree until we hit a parent node path in a list

```js
path.getStatementParent();
```

### <a id="toc-get-sibling-paths"></a>형제 경로 얻기

If a path is in a list like in the body of a `Function`/`Program`, it will have "siblings".

  * Check if a path is part of a list with `path.inList`
  * You can get the surrounding siblings with `path.getSibling(index)`,
  * The current path's index in the container with `path.key`,
  * The path's container (an array of all sibling nodes) with `path.container`
  * Get the name of the key of the list container with `path.listKey`

> These APIs are used in the [transform-merge-sibling-variables](https://github.com/babel/babili/blob/master/packages/babel-plugin-transform-merge-sibling-variables/src/index.js) plugin used in [babel-minify](https://github.com/babel/babili).

```js
var a = 1; // pathA, path.key = 0
var b = 2; // pathB, path.key = 1
var c = 3; // pathC, path.key = 2
```

```js
export default function({ types: t }) {
  return {
    visitor: {
      VariableDeclaration(path) {
        // if the current path is pathA
        path.inList // true
        path.listKey // "body"
        path.key // 0
        path.getSibling(0) // pathA
        path.getSibling(path.key + 1) // pathB
        path.container // [pathA, pathB, pathC]
      }
    }
  };
}
```

### <a id="toc-stopping-traversal"></a>탐색 중지하기

If your plugin needs to not run in a certain situation, the simpliest thing to do is to write an early return.

```js
BinaryExpression(path) {
  if (path.node.operator !== '**') return;
}
```

If you are doing a sub-traversal in a top level path, you can use 2 provided API methods:

`path.skip()` skips traversing the children of the current path. `path.stop()` stops traversal entirely.

```js
outerPath.traverse({
  Function(innerPath) {
    innerPath.skip(); // if checking the children is irrelevant
  },
  ReferencedIdentifier(innerPath, state) {
    state.iife = true;
    innerPath.stop(); // if you want to save some state and then stop traversal, or deopt
  }
});
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

### <a id="toc-replacing-a-node-with-multiple-nodes"></a>노드 하나를 여러 개의 노드로 교체하기

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

### <a id="toc-replacing-a-node-with-a-source-string"></a>노드 하나를 소스 문자열로 교체하기

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

### <a id="toc-inserting-a-sibling-node"></a>형제 노드를 삽입하기

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

### <a id="toc-inserting-into-a-container"></a>컨테이너에 삽입하기

If you want to insert into a AST node property like that is an array like `body`. It is similar to `insertBefore`/`insertAfter` other than you having to specify the `listKey` which is usually `body`.

```js
ClassMethod(path) {
  path.get('body').unshiftContainer('body', t.expressionStatement(t.stringLiteral('before')));
  path.get('body').pushContainer('body', t.expressionStatement(t.stringLiteral('after')));
}
```

```diff
 class A {
  constructor() {
+   "before"
    var a = 'middle';
+   "after"
  }
 }
```

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

Just call `replaceWith` with the parentPath: `path.parentPath`

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

### <a id="toc-checking-if-a-local-variable-is-bound"></a>지역 변수가 바인딩되었는지 확인하기

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

### <a id="toc-generating-a-uid"></a>UID 생성하기

This will generate an identifier that doesn't collide with any locally defined variables.

```js
FunctionDeclaration(path) {
  path.scope.generateUidIdentifier("uid");
  // Node { type: "Identifier", name: "_uid" }
  path.scope.generateUidIdentifier("uid");
  // Node { type: "Identifier", name: "_uid2" }
}
```

### <a id="toc-pushing-a-variable-declaration-to-a-parent-scope"></a>부모 스코프에 변수 선언 집어넣기

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

### <a id="toc-rename-a-binding-and-its-references"></a>바인딩과 참조의 이름 바꾸기

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

# <a id="toc-plugin-options"></a>플러그인 옵션

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

## <a id="toc-pre-and-post-in-plugins"></a> 플러그인의 전처리와 후처리

Plugins can have functions that are run before or after plugins. They can be used for setup or cleanup/analysis purposes.

```js
export default function({ types: t }) {
  return {
    pre(state) {
      this.cache = new Map();
    },
    visitor: {
      StringLiteral(path) {
        this.cache.set(path.node.value, 1);
      }
    },
    post(state) {
      console.log(this.cache);
    }
  };
}
```

## <a id="toc-enabling-syntax-in-plugins"></a> 플러그인에서 구문 활성화하기

Plugins can enable [babylon plugins](https://github.com/babel/babylon#plugins) so that users don't need to install/enable them. This prevents a parsing error without inheriting the syntax plugin.

```js
export default function({ types: t }) {
  return {
    inherits: require("babel-plugin-syntax-jsx")
  };
}
```

## <a id="toc-throwing-a-syntax-error"></a> 구문 오류 throw 하기

If you want to throw an error with babel-code-frame and a message:

```js
export default function({ types: t }) {
  return {
    visitor: {
      StringLiteral(path) {
        throw path.buildCodeFrameError("Error message here");
      }
    }
  };
}
```

The error looks like:

    file.js: Error message here
       7 |
       8 | let tips = [
    >  9 |   "Click on any AST node with a '+' to expand it",
         |   ^
      10 |
      11 |   "Hovering over a node highlights the \
      12 |    corresponding part in the source code",
    

* * *

# <a id="toc-building-nodes"></a>노드 만들기(Building Nodes)

When writing transformations you'll often want to build up some nodes to insert into the AST. As mentioned previously, you can do this using the [builder](#builders) methods in the [`babel-types`](#babel-types) package.

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

```js
// Example
// because the builder doesn't contain `async` as a property
var node = t.classMethod(
  "constructor",
  t.identifier("constructor"),
  params,
  body
)
// set it manually after creation
node.async = true;
```

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

# <a id="toc-best-practices"></a>모범 사례

## <a id="toc-create-helper-builders-and-checkers"></a> 헬퍼 빌더와 체커 만들기

It's pretty simple to extract certain checks (if a node is a certain type) into their own helper functions as well as extracting out helpers for specific node types.

```js
function isAssignment(node) {
  return node && node.operator === opts.operator + "=";
}

function buildAssignment(left, right) {
  return t.assignmentExpression("=", left, right);
}
```

## <a id="toc-avoid-traversing-the-ast-as-much-as-possible"></a>가능한 AST 탐색을 피하라

Traversing the AST is expensive, and it's easy to accidentally traverse the AST more than necessary. This could be thousands if not tens of thousands of extra operations.

Babel optimizes this as much as possible, merging visitors together if it can in order to do everything in a single traversal.

### <a id="toc-merge-visitors-whenever-possible"></a>가능하다면 방문자들을 병합(merge) 하라

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

### <a id="toc-do-not-traverse-when-manual-lookup-will-do"></a>수동 조회할 땐 탐색하지 마라

It may also be tempting to call `path.traverse` when looking for a particular node type.

```js
const nestedVisitor = {
  Identifier(path) {
    // ...
  }
};

const MyVisitor = {
  FunctionDeclaration(path) {
    path.get('params').traverse(nestedVisitor);
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

## <a id="toc-optimizing-nested-visitors"></a>중첩된 방문자들 최적화하기

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

However, this creates a new visitor object every time `FunctionDeclaration()` is called. That can be costly, because Babel does some processing each time a new visitor object is passed in (such as exploding keys containing multiple types, performing validation, and adjusting the object structure). Because Babel stores flags on visitor objects indicating that it's already performed that processing, it's better to store the visitor in a variable and pass the same object each time.

```js
const nestedVisitor = {
  Identifier(path) {
    // ...
  }
};

const MyVisitor = {
  FunctionDeclaration(path) {
    path.traverse(nestedVisitor);
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
const nestedVisitor = {
  Identifier(path) {
    if (path.node.name === this.exampleState) {
      // ...
    }
  }
};

const MyVisitor = {
  FunctionDeclaration(path) {
    var exampleState = path.node.params[0].name;
    path.traverse(nestedVisitor, { exampleState });
  }
};
```

## <a id="toc-being-aware-of-nested-structures"></a>중첩된 구조(nested structures) 인지하기

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

## <a id="toc-unit-testing"></a>단위 테스트

There are a few primary ways to test babel plugins: snapshot tests, AST tests, and exec tests. We'll use [jest](http://facebook.github.io/jest/) for this example because it supports snapshot testing out of the box. The example we're creating here is hosted in [this repo](https://github.com/brigand/babel-plugin-testing-example).

First we need a babel plugin, we'll put this in src/index.js.

```js
<br />module.exports = function testPlugin(babel) {
  return {
    visitor: {
      Identifier(path) {
        if (path.node.name === 'foo') {
          path.node.name = 'bar';
        }
      }
    }
  };
};
```

### Snapshot 테스트

Next, install our dependencies with `npm install --save-dev babel-core jest`, and then we can begin writing our first test: the snapshot. Snapshot tests allow us to visually inspect the output of our babel plugin. We give it an input, tell it to make a snapshot, and it saves it to a file. We check in the snapshots into git. This allows us to see when we've affected the output of any of our test cases. It also gives use a diff in pull requests. Of course you could do this with any test framework, but with jest updating the snapshots is as easy as `jest -u`.

```js
// src/__tests__/index-test.js
const babel = require('babel-core');
const plugin = require('../');

var example = `
var foo = 1;
if (foo) console.log(foo);
`;

it('works', () => {
  const {code} = babel.transform(example, {plugins: [plugin]});
  expect(code).toMatchSnapshot();
});
```

This gives us a snapshot file in `src/__tests__/__snapshots__/index-test.js.snap`.

```js
exports[`test works 1`] = `
"
var bar = 1;
if (bar) console.log(bar);"
`;
```

If we change 'bar' to 'baz' in our plugin and run jest again, we get this:

```diff
Received value does not match stored snapshot 1.

    - Snapshot
    + Received

    @@ -1,3 +1,3 @@
     "
    -var bar = 1;
    -if (bar) console.log(bar);"
    +var baz = 1;
    +if (baz) console.log(baz);"
```

We see how our change to the plugin code affected the output of our plugin, and if the output looks good to us, we can run `jest -u` to update the snapshot.

### AST 테스트

In addition to snapshot testing, we can manually inspect the AST. This is a simple but brittle example. For more involved situations you may wish to leverage babel-traverse. It allows you to specify an object with a `visitor` key, exactly like you use for the plugin itself.

```js
it('contains baz', () => {
  const {ast} = babel.transform(example, {plugins: [plugin]});
  const program = ast.program;
  const declaration = program.body[0].declarations[0];
  assert.equal(declaration.id.name, 'baz');
  // or babelTraverse(program, {visitor: ...})
});
```

### Exec 테스트

여기선 코드를 변환시켜보고, 올바르게 동작하는지 확인해보겠습니다. Note that we're not using `assert` in the test. This ensures that if our plugin does weird stuff like removing the assert line by accident, the test will still fail.

```js
it('foo is an alias to baz', () => {
  var input = `
    var foo = 1;
    // test that foo was renamed to baz
    var res = baz;
  `;
  var {code} = babel.transform(input, {plugins: [plugin]});
  var f = new Function(`
    ${code};
    return res;
  `);
  var res = f();
  assert(res === 1, 'res is 1');
});
```

Babel core uses a [similar approach](https://github.com/babel/babel/blob/7.0/CONTRIBUTING.md#writing-tests) to snapshot and exec tests.

### [`babel-plugin-tester`](https://github.com/kentcdodds/babel-plugin-tester)

This package makes testing plugins easier. If you're familiar with ESLint's [RuleTester](http://eslint.org/docs/developer-guide/working-with-rules#rule-unit-tests) this should be familiar. You can look at [the docs](https://github.com/kentcdodds/babel-plugin-tester/blob/master/README.md) to get a full sense of what's possible, but here's a simple example:

```js
import pluginTester from 'babel-plugin-tester';
import identifierReversePlugin from '../identifier-reverse-plugin';

pluginTester({
  plugin: identifierReversePlugin,
  fixtures: path.join(__dirname, '__fixtures__'),
  tests: {
    'does not change code with no identifiers': '"hello";',
    'changes this code': {
      code: 'var hello = "hi";',
      output: 'var olleh = "hi";',
    },
    'using fixtures files': {
      fixture: 'changed.js',
      outputFixture: 'changed-output.js',
    },
    'using jest snapshots': {
      code: `
        function sayHi(person) {
          return 'Hello ' + person + '!'
        }
      `,
      snapshot: true,
    },
  },
});
```

* * *

> ***향후 업데이트를 받아보려면 Twitter에 있는 [@thejameskyle](https://twitter.com/thejameskyle) 와 [@babeljs](https://twitter.com/babeljs) 를 팔로우하세요.***