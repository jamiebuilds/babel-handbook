# Babel Plugin Handbook

このドキュメントでは[Babel](https://babeljs.io)の[プラグイン](https://babeljs.io/docs/advanced/plugins/)を作る方法を解説します。.

[![cc-by-4.0](https://licensebuttons.net/l/by/4.0/80x15.png)](http://creativecommons.org/licenses/by/4.0/)

このハンドブックは他の言語でも閲覧可能です。[README](/README.md)をご覧ください。

# 目次

  * [導入](#toc-introduction)
  * [基本事項](#toc-basics) 
      * [抽象構文木(ASTs)](#toc-asts)
      * [Babelのステージ](#toc-stages-of-babel)
      * [パース(Parse)](#toc-parse) 
          * [字句解析(Lexical Analysis)](#toc-lexical-analysis)
          * [構文解析(Syntactic Analysis)](#toc-syntactic-analysis)
      * [変換(Transform)](#toc-transform)
      * [生成(generate)](#toc-generate)
      * [走査(Traversal)](#toc-traversal)
      * [ビジター(Visitors)](#toc-visitors)
      * [パス(Paths)](#toc-paths) 
          * [ビジターにおけるパス(Paths in Visitors)](#toc-paths-in-visitors)
      * [状態(State)](#toc-state)
      * [スコープ(Scopes)](#toc-scopes) 
          * [バインディング(Bindings)](#toc-bindings)
  * [API](#toc-api) 
      * [babylon](#toc-babylon)
      * [babel-traverse](#toc-babel-traverse)
      * [babel-types](#toc-babel-types)
        * [定義(Definitions)](#toc-definitions)
        * [ビルダー(Builders)](#toc-builders)
        * [バリデーター(Validators)](#toc-validators)
        * [コンバーター(Converters)](#toc-converters)
      * [babel-generator](#toc-babel-generator)
      * [babel-template](#toc-babel-template)
  * [はじめてのBabelプラグイン作成](#toc-writing-your-first-babel-plugin)
  * [変換作業](#toc-transformation-operations) 
      * [ビジティング(Visiting)](#toc-visiting)
        * [サブノード(Sub Node)のパス(Path)の取得](#toc-get-the-path-of-a-sub-node)
        * [ノード(Node)が特定のタイプ(Type)か調べる](#toc-check-if-a-node-is-a-certain-type)
        * [パス(Path)が特定のタイプ(Type)か調べる](#toc-check-if-a-path-is-a-certain-type)
        * [識別子(Identifier)が参照されているか調べる](#toc-check-if-an-identifier-is-referenced)
        * [特定の親パス(Parent Path)を探す](#toc-find-a-specific-parent-path)
        * [兄弟パス(Sibling Paths)を取得する](#toc-get-sibling-paths)
        * [走査(Traversal)を停止する](#toc-stopping-traversal)
      * [操作方法](#toc-manipulation)
        * [ノード(Node)を置き換える](#toc-replacing-a-node)
        * [1つのノード(Node)を複数のノード(Node)で置き換える](#toc-replacing-a-node-with-multiple-nodes)
        * [ノード(Node)をソースの文字列で置き換える](#toc-replacing-a-node-with-a-source-string)
        * [兄弟ノード(Sibling Node)を挿入する](#toc-inserting-a-sibling-node)
        * [コンテナ(Container)に挿入する](#toc-inserting-into-a-container)
        * [ノード(Node)を削除する](#toc-removing-a-node)
        * [親(Parent)を置き換える](#toc-replacing-a-parent)
        * [親(Parent)を削除する](#toc-removing-a-parent)
      * [スコープ(Scope)](#toc-scope)
        * [ローカル変数がバインド(Bind)されているかどうかの確認](#toc-checking-if-a-local-variable-is-bound)
        * [UIDの生成](#toc-generating-a-uid)
        * [変数宣言(Variable Declaration)の親スコープ(Parent Scope)へのプッシュ](#toc-pushing-a-variable-declaration-to-a-parent-scope)
        * [バインディング(Binding)とその参照(References)の名称変更](#toc-rename-a-binding-and-its-references)
  * [プラグインのオプション](#toc-plugin-options) 
      * [プラグインのPreとPost](#toc-pre-and-post-in-plugins)
      * [プラグインのシンタックス(Syntax)を有効にする](#toc-enabling-syntax-in-plugins)
	  * [シンタックスエラー(Syntax Error)を投げる](#toc-throwing-a-syntax-error)
  * [ノード(Node)の構築](#toc-building-nodes)
  * [ベストプラクティス](#toc-best-practices)
      * [ヘルパービルダー(Helper Builders)とチェッカー(Checkers)の作成](#toc-create-helper-builders-and-checkers)
      * [極力、ASTの走査(Traversing)を避ける](#toc-avoid-traversing-the-ast-as-much-as-possible)
        * [可能な限りビジター(Visitors)を統合する](#toc-merge-visitors-whenever-possible)
        * [手動で済む場合は走査(Traverse)しない](#toc-do-not-traverse-when-manual-lookup-will-do)
      * [入れ子になったビジター(Nesting Visitors)の最適化](#toc-optimizing-nested-visitors)
      * [入れ子構造(Nested Structures)を意識する](#toc-being-aware-of-nested-structures)
      * [ユニットテスト(Unit Testing)](#toc-unit-testing)
	    * [スナップショットテスト(Snapshot Tests)](#toc-snapshot-test)
		* [ASTテスト(AST Tests)](#toc-ast-test)
		* [エクゼクティブテスト(Exec Tests)](#toc-exec-test)
		* [babel-plugin-tester](#toc-babel-plugin-tester)

# <a id="toc-introduction"></a>イントロダクション

BabelはJavaScriptのための汎用的で多目的に使用できるコンパイラです。また、様々な静的コード解析に利用するためのモジュールのコレクションでもあります。

> 静的コード解析(Static Analysis)とは、実行すること無くコードの分析を行うプロセスです。 (コードの実行中にそれを分析するのは動的コード解析(Dynamic Analysis)と呼ばれます。) 静的コード解析の目的は様々です。 Lint、コンパイル、コードハイライト、トランスフォーム、最適化、縮小など、様々な目的で利用することができます。

Babelを利用することで、より生産的で、より良いコードを書くためのツールを作ることができます。

> ***最新の情報を受け取るには、Twitterで[@thejameskyle](https://twitter.com/thejameskyle)をフォローしてください。***

* * *

# <a id="toc-basics"></a>基本事項

BabelはJavaScriptのコンパイラ、特にソースからソースへ変換する「トランスパイラ(Transpiler)」と呼ばれる種類のコンパイラです。 つまり、BabelにJavaScriptのコードを与えることで、Babelはコードを変更し新しいコードを生成します。

## <a id="toc-asts"></a>抽象構文木(ASTs)

コードの変換の各ステップでは[Abstract Syntax Tree](https://en.wikipedia.org/wiki/Abstract_syntax_tree)、すなわちAST(抽象構文木)を利用します。

> Babelは、[ESTree](https://github.com/estree/estree)をベースにしたASTを使用しています。 コアスペックは[こちら](https://github.com/babel/babylon/blob/master/ast/spec.md)です。

```js
function square(n) {
  return n * n;
}
```

> ASTノードについて理解を深めたい場合は[AST Explorer](http://astexplorer.net/)を使ってみてください。 上記のサンプルコードの例は[こちら](http://astexplorer.net/#/Z1exs6BWMq)で確認することができます。

上記のサンプルコードは、次のようなツリーで表現できます。

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

またはJavaScriptのオブジェクトして表現すると、以下のように表現できます。

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

このASTの各階層は同じような構造をしていることに気付くでしょう。

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

> 注) いくつかのプロパティは、単純化のため省略しています。

これらは **ノード(Node)** と呼ばれます。 ASTは単一のノード、または何百、何千のノードから構成することができます。 これらを利用し、静的コード解析に利用するプログラムの文法を説明することができるのです。

全てのノードはインターフェイスを持ちます。

```typescript
interface Node {
  type: string;
}
```

`type`フィールドは、オブジェクトのノードのタイプを表す文字列です(例えば、 `"FunctionDeclaration"`、`"Identifier"`、`"BinaryExpression"`などがあります。) ノードの種類は特定のノードのタイプを記述するためのプロパティのセットを追加して定義します。

Babelが生成したノードには、元のソースコード上のノードの位置を記述した追加のプロパティがセットされます。

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

これらのプロパティには`start`、`end`、`loc`が1つのノードに出現します。

## <a id="toc-stages-of-babel"></a>Babelのステージ

Babelには大きく分けて３つのステージが存在します。すなわち、**パース(Parse)**、**変換(Transform)**、そして**生成(generate)**です。

### <a id="toc-parse"></a>パース(Parse)

**パース(Parse)**は、コードを入力として受け取り、ASTを出力するステージです。 さらに、Parseは２つのフェーズに分けることができます。すなわち、 [**字句解析(Lexical Analysis)**](https://en.wikipedia.org/wiki/Lexical_analysis) と [**構文解析(Syntactic Analysis)**](https://en.wikipedia.org/wiki/Parsing)です。.

#### <a id="toc-lexical-analysis"></a>字句解析(Lexical Analysis)

字句解析(Lexical Analysis)は、コードの文字列を**トークン(Token)**のストリームへ変換するフェーズを指します。

トークンは言語の構文の個々の部品であり、トークンのストリームはそれらがフラットに並んだ配列と考えてください。

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

上記はトークンのストリームですが、それぞれのトークンは`type`を持ち、それは以下の様なプロパティから構成されています。

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

ASTのノードと同様、`type`もまた`start`、`end`、`loc`といったプロパティを持ちます。

#### <a id="toc-syntactic-analysis"></a>構文解析(Syntactic Analysis)

一方、構文解析(Syntactic Analysis)は、トークンのストリームをASTに変換するフェーズを指します。 このフェーズでは、トークンの情報を利用して、コードの構造を表すASTとして再構成し、作業をしやすくします。

### <a id="toc-transform"></a>変換(Transform)

[変換(Transform)](https://en.wikipedia.org/wiki/Program_transformation)のステージでは、ASTのツリーを走査して、ノードの追加、変更、削除といった処理を施します。 このステージこそが最も複雑なステージであり、それはBabelのみならず、他のコンパイラにおいても同様です。 また、このステージこそがプラグインに関わる部分であるため、言わばこのハンドブックの大半は変換に関して書かれています。 したがって、ここでは簡単に説明するだけに留めたいと思います。

### <a id="toc-generate"></a>ジェネレーター

[コード生成(Code Generate)](https://en.wikipedia.org/wiki/Code_generation_(compiler))のステージは、ASTをふたたびコードの文字列に変換するステージです。さらに、このステージは[ソースマップ(Source Map)](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/)も生成します。

コード生成の処理は単純明快です。それは、ASTを深さ順に走査して、変換後のコードを表す文字列を構築します。

## <a id="toc-traversal"></a>走査(Traversal)

ASTを変換するには、ツリーを再帰的に走査(Traversal)する必要があります。

たとえば、`type`が`FunctionDeclaration`のASTがあるとしましょう。このASTは `id`、`params`、そして`body`という3つのネストしたノードを含みます。

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

そこで、`FunctionDeclaration`から始めて、その内部のプロパティがわかるので、それぞれとその子(Children)を順番に見ていきます。

次に、`Identifier`である`id`に進みます。`Identifier`は子ノード(Child Node)のプロパティを持っていないので、次に進みます。

続いて、ノードの配列である`params`があるので、それぞれのノードを訪問します。この場合は、またしても`Identifier`という単一のノードなので、次に進みます。

続いて、`BlockStatement`である`body`に、ノードの配列であるpropertyがあるので、それぞれにアクセスします。

ここには、引数(Argument)を持つ`ReturnStatement`ノードしかないので、`argument`に訪問して`BinaryExpression`を見つけます。

`BinaryExpression` は`operator`、`left`、そして`right`の３つのプロパティを持ちます。 `operator`はノードではなく単なる値なので、そこにはアクセスせず、`left`と`right`にアクセスします。

この走査(Traversal)プロセスは、Babelの変換(Transform)ステージを通して行われます。

### <a id="toc-visitors"></a>ビジター(Visitors)

私たちがノードに「行く」というとき、実際には **訪問(Visiting)** していることを意味します。この言葉を使うのは、[**ビジター(Visitor)**](https://en.wikipedia.org/wiki/Visitor_pattern)という概念があるからです。

ビジターは、言語を問わずAST走査で使われるパターンです。簡単に言えば，木(Tree)の中の特定のノードタイプ(Node Types)を受け入れるためのメソッドが定義されたオブジェクトです。少し抽象的なので、例を見てみましょう。

```js
const MyVisitor = {
  Identifier() {
    console.log("Called!");
  }
};

// ビジターを作成して、後からメソッドを追加することも可能です。
let visitor = {};
visitor.MemberExpression = function() {};
visitor.FunctionDeclaration = function() {}
```

> **注)** `Identifier() { ... }`は`Identifier: { enter() { ... } }`の簡略。

これは基本的なビジターで、走査中に使用されると、ツリー内のすべての`Identifier`に対して`Identifier()`メソッドを呼び出します。

つまりこのコードでは、各`Identifier`（`square`を含む）に対して、`Identifier()`メソッドが4回呼ばれます。

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

これらの呼び出しはすべてノードの **enter** で行われます。しかし、 **exit** の時にvisitorメソッドを呼び出す可能性もあります。

このようなツリー構造があるとします。

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


木の各枝(each Branch of the Tree)をたどっていくと、最終的には行き止まりになり、次のノードに行くためには木をさかのぼらなければなりません。木を下っていくと各ノードに **enter** し、上に戻ると各ノードから **exit** します。

上の木の場合、このプロセスがどのように見えるか *歩いて* みましょう。

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

そのため、ビジターを作成する際には、ノードを訪問する機会が2回あります。

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

必要に応じて、メソッド名を `|` で区切って、`Identifier|MemberExpression` のような文字列として、複数のビジターノードに同じ関数を適用することもできます。

[flow-comments](https://github.com/babel/babel/blob/2b6ff53459d97218b0cf16f8a51c14a165db1fd2/packages/babel-plugin-transform-flow-comments/src/index.js#L47)プラグインで以下のように使われています。

```js
const MyVisitor = {
  "ExportNamedDeclaration|Flow"(path) {}
};
```


また、エイリアス(Aliases)をビジターノードとして使用することもできます([babel-types](https://github.com/babel/babel/tree/master/packages/babel-types/src/definitions)で定義されています).

例えば,

`Function`は`FunctionDeclaration`, `FunctionExpression`, `ArrowFunctionExpression`, `ObjectMethod`, `ClassMethod`のエイリアスです.

```js
const MyVisitor = {
  Function(path) {}
};
```

### <a id="toc-paths"></a>パス(Paths)

ASTは一般的に多くのノードを持ちますが、ノードはどうやってお互いに関係するのでしょうか？巨大な可変型オブジェクト(Giant Mutable Object)を用意して、それを操作したり、完全にアクセスできるようにすることもできますが、 **パス(Path)** を使ってこれを単純化することもできます。

**パス(Path)** とは、2つのノード間のリンクをオブジェクトで表現したものです。

例えば、次のようなノードとその子を考えてみましょう。

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

そして、子の`Identifier`をパスで表すと、以下のようになります。

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

また、パスに関する追加のメタデータも持っています。

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

また、ノードの追加、更新、移動、削除に関連する膨大な数のメソッドがありますが、それらについては後ほど説明します。

ある意味で、パスはツリー内のノードの位置とノードに関するあらゆる情報を **リアクティブ(Reactive)** に表現しています。ツリーを変更するメソッドを呼び出すたびに、この情報は更新されます。Babelは、ノードの操作を簡単にし、可能な限りステートレスにするために、これらすべてを管理します。

#### <a id="toc-paths-in-visitors"></a>ビジターにおけるパス(Paths in Visitors)

ビジターが `Identifier()`メソッドを持っている場合、実際にはノードではなくパスを訪れていることになります。この方法では、ほとんどの場合ノードそのものではなく、ノードのリアクティブな表現を扱うことになります。

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

### <a id="toc-state"></a>状態(State)

状態(State)はAST変換(AST Transformation)の敵です。状態は何度も何度も手を煩わしてきますし、状態に関する仮定はほとんどの場合、考慮していなかった何らかの構文によって間違っていることが証明されます。

次のコードを見てみましょう。

```js
function square(n) {
  return n * n;
}
```

それでは、`n`を`x`にリネームする簡単なハッキーなビジター(Hacky Visitor)を書いてみましょう。

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

これは上記のコードではうまくいくかもしれませんが、次のようにすれば簡単に壊すことができます。

```js
function square(n) {
  return n * n;
}
n;
```

これに対処するためのより良い方法は再帰(Recursion)です。では、クリストファー・ノーランの映画のように、ビジターの中にビジターを入れてみましょう。

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

もちろん、これは作為的な例ですが、ビジターからグローバルステートを排除する方法を示しています。

### <a id="toc-scopes"></a>スコープ(Scopes)

次に、[**スコープ(Scope)**](https://en.wikipedia.org/wiki/Scope_(computer_science))という概念を紹介します。
JavaScriptには、[字句スコープ(Lexical Scoping)](https://en.wikipedia.org/wiki/Scope_(computer_science)#Lexical_scoping_vs._dynamic_scoping)
JavaScript has [lexical scoping](https://en.wikipedia.org/wiki/Scope_(computer_science)#Lexical_scoping_vs._dynamic_scoping)という、ブロックが新しいスコープを作るツリー構造があります。

```js
// グローバルスコープ

function scopeOne() {
  // スコープ 1

  function scopeTwo() {
    // スコープ 2
  }
}
```

JavaScriptでは、変数、関数、クラス、param、import、labelなどで参照を作成すると、それは現在のスコープに属します。

```js
var global = "I am in the global scope";

function scopeOne() {
  var one = "I am in the scope created by `scopeOne()`";

  function scopeTwo() {
    var two = "I am in the scope created by `scopeTwo()`";
  }
}
```

より深いスコープ内のコードは、より高いスコープからの参照を使用することができます。

```js
function scopeOne() {
  var one = "I am in the scope created by `scopeOne()`";

  function scopeTwo() {
    one = "I am updating the reference in `scopeOne` inside `scopeTwo`";
  }
}
```

下位のスコープでは、同じ名前の参照を変更せずに作成することもあります。

```js
function scopeOne() {
  var one = "I am in the scope created by `scopeOne()`";

  function scopeTwo() {
    var one = "I am creating a new `one` but leaving reference in `scopeOne()` alone.";
  }
}
```

変換(Transform)を書くときには、スコープに注意したいものです。既存のコードの様々な部分を修正する際に、既存のコードを壊してしまわないようにする必要があります。

新しい参照を追加して、それが既存のものと衝突しないようにしたいこともあるでしょう。また、ある変数がどこで参照されているかを調べたいこともあるでしょう。そのためには、特定のスコープ内の参照を追跡できるようにする必要があります。

スコープは次のように表すことができます。

```js
{
  path: path,
  block: path.node,
  parentBlock: path.parent,
  parent: parentScope,
  bindings: [...]
}
```

新しいスコープを作成するときは、パスと親スコープ(Parent Scope)を与えて行います。そして走査(Traversal)処理の間に、そのスコープ内のすべての参照（「バインディング(Bindings)」）を集めます。

これが完了すると、スコープで使用できるあらゆる種類のメソッドがあります。それらについては後ほどご紹介します。

#### <a id="toc-bindings"></a>バインディング(Bindings)

参照(References)はすべて特定のスコープに属しており、この関係は **バインディング(Binding)** と呼ばれています。

```js
function scopeOnce() {
  var ref = "This is a binding";

  ref; // This is a reference to a binding

  function scopeTwo() {
    ref; // This is a reference to a binding from a lower scope
  }
}
```

シングルバインディング(Single Binding)の場合は以下のようになります。

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

この情報を使って、あなたはバインディングへのすべての参照を見つけ、それがどのようなタイプのバインディングであるか（パラメータ(Parameter)、宣言(Declaration)など）を確認し、それがどのスコープに属しているかを調べ、またはその識別子(Identifier)のコピーを得ることができます。定数(Constant)であるかどうかもわかりますし、定数でない場合には、どのようなパスが原因で定数でないのかもわかります。

バインディングが定数であるかどうかを知ることができるのは、多くの目的に役立ちますが、その中でも最大の目的はミニマイズ(Minification)です。

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

Babelは、実際にはモジュールのコレクション(a Collection of Modules)です。このセクションでは、主要なモジュールについて、それらが何をするのか、どのように使用するのかを説明します。

> 注) これは、間もなく他の場所で利用可能になる詳細なAPIドキュメントの代わりではありません。

## <a id="toc-babylon"></a>[`babylon`](https://github.com/babel/babylon)

BabylonはBabelのパーサーです。Acornのフォークとして始まり、高速で使いやすく、非標準的な機能（将来の標準的な機能も含む）のためのプラグインベースのアーキテクチャ(Plugin-Based Architecture)を備えています。

まずは、インストールしてみましょう。

```sh
$ npm install --save babylon
```

まずは、単純にコードの文字列をパース(Parsing)してみましょう。

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

また、以下のように`parse()`にオプションを渡すこともできます。

```js
babylon.parse(code, {
  sourceType: "module", // default: "script"
  plugins: ["jsx"] // default: []
});
```

`sourceType` は `"module"` か `"script"` のどちらかで、Babylonがパースする際のモードを表します。`"module"`はstrictモードでパースし、モジュールの宣言(Module Declarations)を許可する一方で、`"script"`は許可しません。

> **注)** `sourceType`のデフォルトは`"script"`で、`import`や`export`を見つけるとエラーになります。`sourceType: "module"`を渡すことで、これらのエラーを取り除くことができます。

Babylonはプラグインベースのアーキテクチャで構築されているので、内部プラグインを有効にする`plugins`オプションもあります。BabylonはまだこのAPIを外部プラグインに開放していませんが、将来的には開放する可能性があることに注意してください。

プラグインの全リストは、[Babylon README](https://github.com/babel/babylon/blob/master/README.md#plugins)で見られます。

## <a id="toc-babel-traverse"></a>[`babel-traverse`](https://github.com/babel/babel/tree/master/packages/babel-traverse)

`babel-traverse`モジュールは、ツリー全体の状態を維持し、ノードの交換、削除、追加を行います。

次を実行してインストールしてください。

```sh
$ npm install --save babel-traverse
```

Babylonと一緒に使って、ノードを走査(Traverse)して更新することができます。

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

`babel-types`は、Lodash風のASTノード用ユーティリティーライブラリ(Utility Library for AST Nodes)です。ASTノードを構築、検証、変換するためのメソッドが含まれています。よく考えられたユーティリティーメソッド(Utility Methods)を使って、ASTのロジックをきれいにするのに便利です。

次のコマンドでインストールできます。

```sh
$ npm install --save babel-types
```

では、使ってみましょう。

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

### <a id="toc-definitions"></a>定義(Definitions)

`babel-types`には、どのプロパティがどこに属しているか、どの値が有効か、そのノードをどのように構築するか、そのノードをどのように走査(Traverse)するか、ノードのエイリアスはなにか、などの情報を含む、ノードのすべてのタイプ(Type)の定義があります。

1つのノードタイプの定義(Single Node Type Definition)は以下のようになります。

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

### <a id="toc-builders"></a>ビルダー(Builders)

上記の`BinaryExpression`の定義には、`builder`フィールドがあることに気づくでしょう。

```js
builder: ["operator", "left", "right"]
```

これは、各ノードタイプにビルダーメソッドが用意されているからで、これを使うと次のようになります。

```js
t.binaryExpression("*", t.identifier("a"), t.identifier("b"));
```

これは次のようなASTを生成します。

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

これを出力すると次のようになります。

```js
a * b
```

また、ビルダーは作成中のノードを検証し、不適切な使い方をした場合は記述エラーを出します。これが次のタイプのメソッド(Type of Method)につながります。

### <a id="toc-validators"></a>バリデーター(Validators)

`BinaryExpression`の定義には、ノードの`fields`とその検証方法についての情報も含まれています。

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

これを使って、2種類のバリデーションメソッド(Validating Methods)を作成します。1つ目は、`isX`です。

```js
t.isBinaryExpression(maybeBinaryExpressionNode);
```

これは、ノードがバイナリ式(Binary Expression)であることを確認するためのテストですが、2番目のパラメータを渡して、ノードに特定のプロパティや値が含まれていることを確認することもできます。

```js
t.isBinaryExpression(maybeBinaryExpressionNode, { operator: "*" });
```

また、これらのメソッドには、`true`や`false`を返すのではなく、エラーを発生させる、より*賢い*ものもあります。

```js
t.assertBinaryExpression(maybeBinaryExpressionNode);
t.assertBinaryExpression(maybeBinaryExpressionNode, { operator: "*" });
// Error: Expected type "BinaryExpression" with option { "operator": "*" }
```

### <a id="toc-converters"></a>コンバーター(Converters)

> [WIP]

## <a id="toc-babel-generator"></a>[`babel-generator`](https://github.com/babel/babel/tree/master/packages/babel-generator)

`babel-generator`は、Babelのコードジェネレータ(Code Generator)です。ASTをソースマップ付きのコード(Code with Sourcemaps)に変換します。

以下を実行してインストールしてください。

```sh
$ npm install --save babel-generator
```

では、使ってみましょう。

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

`generate()`にオプションを渡すこともできます。

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

`babel-template`は、小さいですが、非常に便利なモジュールです。これにより、膨大なASTを手動で構築する代わりに、プレースホルダー(Placeholders)を使用してコードの文字列を書くことができます。コンピュータサイエンスの世界では、この機能を「quasiquote」と呼びます。

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

# <a id="toc-writing-your-first-babel-plugin"></a>はじめてのBabelプラグイン作成

Babelの基本をすべて理解したところで、それをプラグインAPIと結びつけてみましょう。

まずは、現在の[`babel`](https://github.com/babel/babel/tree/master/packages/babel-core)オブジェクトを受け取る `function` から始めましょう。

```js
export default function(babel) {
  // plugin contents
}
```

頻繁に使用することになるので、次のように`babel.types`だけを取得したいと思うでしょう。

```js
export default function({ types: t }) {
  // plugin contents
}
```

そして、プラグインの主要なビジター(Visitor)であるプロパティ`visitor`を持つオブジェクトを返します。

```js
export default function({ types: t }) {
  return {
    visitor: {
      // visitor contents
    }
  };
};
```

ビジターの各関数は2つの引数を受け取ります。`path`と`state`です。

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

それでは、簡単なプラグインを作成して、その仕組みを紹介しましょう。ここにソースコードがあります。

```js
foo === bar;
```

またはASTの形で。

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

まずは、`BinaryExpression`のビジターメソッド(Visitor Method)を追加することから始めましょう。

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

そこで、`===`演算子を使っている`BinaryExpression`だけに絞ってみましょう。

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

では、`left`プロパティを新しい識別子(Identifier)に置き換えてみましょう。

```js
BinaryExpression(path) {
  if (path.node.operator !== "===") {
    return;
  }

  path.node.left = t.identifier("sebmck");
  // ...
}
```

すでにこのプラグインを実行すると、次のようになります。

```js
sebmck === bar;
```

では、`right`プロパティだけを置き換えてみましょう。

```js
BinaryExpression(path) {
  if (path.node.operator !== "===") {
    return;
  }

  path.node.left = t.identifier("sebmck");
  path.node.right = t.identifier("dork");
}
```

最終結果は次のようになります。

```js
sebmck === dork;
```

すごい！私たちの最初のBabelプラグインです。

* * *

# <a id="toc-transformation-operations"></a>変換作業(Transformation Operations)

## <a id="toc-visiting"></a>ビジティング(Visiting)

### <a id="toc-get-the-path-of-a-sub-node"></a>サブノード(Sub Node)のパス(Path)の取得

ASTノードのプロパティにアクセスするには、通常、ノードにアクセスしてからプロパティにアクセスします(`path.node.property`)。

```js
// the BinaryExpression AST node has properties: `left`, `right`, `operator`
BinaryExpression(path) {
  path.node.left;
  path.node.right;
  path.node.operator;
}
```

代わりにそのプロパティの`path`にアクセスする必要がある場合は、パスの`get`メソッドを使用して、プロパティに文字列を渡します。

```js
BinaryExpression(path) {
  path.get('left');
}
Program(path) {
  path.get('body.0');
}
```

### <a id="toc-check-if-a-node-is-a-certain-type"></a>ノード(Node)が特定のタイプ(Type)か調べる

ノードのタイプが何であるかを確認したい場合は、次が好ましい方法です。

```js
BinaryExpression(path) {
  if (t.isIdentifier(path.node.left)) {
    // ...
  }
}
```

また、そのノードのプロパティを浅くチェック(Shallow Check)することもできます。

```js
BinaryExpression(path) {
  if (t.isIdentifier(path.node.left, { name: "n" })) {
    // ...
  }
}
```

これは機能的には次と同等です。

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

### <a id="toc-check-if-a-path-is-a-certain-type"></a>パス(Path)が特定のタイプ(Type)か調べる

パスには、ノードのタイプを確認する方法があります。

```js
BinaryExpression(path) {
  if (path.get('left').isIdentifier({ name: "n" })) {
    // ...
  }
}
```

これは次と同等です。

```js
BinaryExpression(path) {
  if (t.isIdentifier(path.node.left, { name: "n" })) {
    // ...
  }
}
```

### <a id="toc-check-if-an-identifier-is-referenced"></a>識別子(Identifier)が参照されているか調べる

```js
Identifier(path) {
  if (path.isReferencedIdentifier()) {
    // ...
  }
}
```

他の方法として次があります。

```js
Identifier(path) {
  if (t.isReferenced(path.node, path.parent)) {
    // ...
  }
}
```

### <a id="toc-find-a-specific-parent-path"></a>特定の親パス(Parent Path)を探す

ある条件が満たされるまで、あるパスからツリーを上方向に走査(Traverse)する必要がある場合があります。

すべての親の`NodePath`を指定して、指定された`callback`を呼び出します。`callback`が真の値(Truthy Value)を返したら、その`NodePath`を返します。

```js
path.findParent((path) => path.isObjectExpression());
```

現在のパスも含めたい場合は次のようにします。

```js
path.find((path) => path.isObjectExpression());
```

最も近い親の関数やプログラム(Parent Function or Program)を探す場合は次のようにします。

```js
path.getFunctionParent();
```

リストの親ノードのパスが見つかるまでASTを上方向に走査するには次のようにします。

```js
path.getStatementParent();
```

### <a id="toc-get-sibling-paths"></a>兄弟パス(Sibling Paths)を取得する

パスが `Function`/`Program`のボディ(Body)といったリストの中にある場合、そのパスには「兄弟(Siblings)」が存在します。

  * パスがリストの一部であるかどうかを `path.inList`でチェックします。
  * `path.getSibling(index)`で周囲の兄弟(Surrounding Siblings)を取得することができます。
  * コンテナ(Container)内の現在のパスのインデックスを`path.key`で取得します。
  * パスのコンテナ(すべての兄弟ノードの配列)を`path.container`で取得します。
  * `path.listKey`で、リストコンテナ(List Container)のキーの名前を取得します。

> これらのAPIは[babel-minify](https://github.com/babel/babili)で使用されている[transform-merge-sibling-variables](https://github.com/babel/babili/blob/master/packages/babel-plugin-transform-merge-sibling-variables/src/index.js)プラグインで使用されています。

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

### <a id="toc-stopping-traversal"></a>走査(Traversal)を停止する

ある状況下でプラグインを動作させない必要がある場合、最もシンプルなのはアーリーリターン(Early Return)を書くことです。

```js
BinaryExpression(path) {
  if (path.node.operator !== '**') return;
}
```

トップレベルのパスでサブトラバーサル(Sub Traversal)を行う場合、2つの提供されたAPIメソッドを使用できます。

`path.skip()`は、現在のパスの子の走査をスキップします。`path.stop()`は、走査を完全に停止します。

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

## <a id="toc-manipulation"></a>操作方法

### <a id="toc-replacing-a-node"></a>ノード(Node)を置き換える

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

### <a id="toc-replacing-a-node-with-multiple-nodes"></a>1つのノード(Node)を複数のノード(Node)で置き換える

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

> **注)** 複数のノードで式(Expression)を置き換える場合、それらはステートメント(Statement)でなければなりません。これは、Babelがノードを置き換える際にヒューリスティック(Heuristics)を広範囲に使用するためで、そうでなければ非常に冗長になってしまうような、かなりクレイジーな変換をすることになります。

### <a id="toc-replacing-a-node-with-a-source-string"></a>ノード(Node)をソースの文字列で置き換える

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

> **注)** 動的なソースの文字列(Dynamic Source Strings)を扱う場合を除き、このAPIの使用は推奨されません。そうでない場合は、ビジター(Visitor)の外部でコードを解析する方が効率的です。

### <a id="toc-inserting-a-sibling-node"></a>兄弟ノード(Sibling Node)を挿入する

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

> **注)** これは常にステートメント(Statement)またはステートメント(Statement)の配列でなければなりません。これは[Replacing a node with multiple nodes](#replacing a node-with-multiple-nodes)で述べられているのと同じヒューリスティック(Heuristics)を使用しています。

### <a id="toc-inserting-into-a-container"></a>Inserting into a container

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

### <a id="toc-removing-a-node"></a>ノード(Node)を削除する

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

### <a id="toc-replacing-a-parent"></a>親(Parent)を置き換える

親パスを指定して`replaceWith`を呼び出すだけです： `path.parentPath`

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

### <a id="toc-removing-a-parent"></a>親(Parent)を削除する

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

## <a id="toc-scope"></a>スコープ(Scope)

### <a id="toc-checking-if-a-local-variable-is-bound"></a>ローカル変数がバインド(Bind)されているかどうかの確認

```js
FunctionDeclaration(path) {
  if (path.scope.hasBinding("n")) {
    // ...
  }
}
```

これにより、スコープツリー(Scope Tree)をさかのぼり、その特定のバインディング(Binding)をチェックします。

また、あるスコープが **独自の** バインディングを持っているかどうかをチェックすることもできます。

```js
FunctionDeclaration(path) {
  if (path.scope.hasOwnBinding("n")) {
    // ...
  }
}
```

### <a id="toc-generating-a-uid"></a>UIDの生成

これにより、ローカルに定義された変数(Locally Defined Variables)と衝突しない識別子(Identifier)が生成されます。

```js
FunctionDeclaration(path) {
  path.scope.generateUidIdentifier("uid");
  // Node { type: "Identifier", name: "_uid" }
  path.scope.generateUidIdentifier("uid");
  // Node { type: "Identifier", name: "_uid2" }
}
```

### <a id="toc-pushing-a-variable-declaration-to-a-parent-scope"></a>変数宣言(Variable Declaration)の親スコープ(Parent Scope)へのプッシュ

時には、`VariableDeclaration`をプッシュして、代入できるようにしたいこともあります。

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

### <a id="toc-rename-a-binding-and-its-references"></a>バインディング(Binding)とその参照(References)の名称変更

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

また、バインディングの名前を、生成された一意の識別子に変更することもできます。

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

# <a id="toc-plugin-options"></a>プラグインのオプション

ユーザーにBabelプラグインの動作をカスタマイズさせたい場合には、ユーザーが以下のように指定できるプラグイン固有のオプションを受け入れることができます。

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

これらのオプションは、`state`オブジェクトを通じて、プラグインのビジター(Visitors)に渡されます。

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

これらのオプションはプラグイン固有のもので、他のプラグインのオプションにはアクセスできません。

## <a id="toc-pre-and-post-in-plugins"></a>プラグインのPreとPost

プラグインは、プラグインの前または後に実行される関数を持つことができます。これらは、セットアップやクリーンアップ、分析のために使用することができます。

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

## <a id="toc-enabling-syntax-in-plugins"></a>プラグインのシンタックス(Syntax)を有効にする

プラグインは[babylonプラグイン](https://github.com/babel/babylon#plugins)を有効にすることで、ユーザーがインストール/有効化する必要がありません。これにより、シンタックスプラグイン(Syntax Plugin)を継承しなくても、パースエラー(Parsing Error)を防ぐことができます。

```js
export default function({ types: t }) {
  return {
    inherits: require("babel-plugin-syntax-jsx")
  };
}
```

## <a id="toc-throwing-a-syntax-error"></a>シンタックスエラー(Syntax Error)を投げる

babel-code-frameとメッセージでエラーを投げたい場合は次のようにします。

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

エラーは次のように表示されます。

    file.js: Error message here
       7 |
       8 | let tips = [
    >  9 |   "Click on any AST node with a '+' to expand it",
         |   ^
      10 |
      11 |   "Hovering over a node highlights the \
      12 |    corresponding part in the source code",
    

* * *

# <a id="toc-building-nodes"></a>ノード(Node)の構築

変換(Transformations)のコードを書いていると、ASTに挿入するノードを構築したくなることがよくあります。前述のように、[babel-types`](#babel-types)パッケージの[builder](#builders)メソッドを使ってこれを行うことができます。

ビルダー(Builder)のメソッド名は、構築したいノードタイプの名前を、最初の文字を除いて小文字にしたものになります。例えば、`MemberExpression`を構築したい場合は、`t.memberExpression(...)`となります。

これらのビルダーの引数は、ノード定義(Node Definition)によって決定されます。ノード定義についての読みやすいドキュメントを作成する作業が行われていますが、現時点ではすべて[ここ](https://github.com/babel/babel/tree/master/packages/babel-types/src/definitions)で見ることができます。

ノード定義は次のようなものです。

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

ここには、この特定のノードタイプに関するすべての情報（構築方法、走査(Traverse)方法、検証(Validate)方法など）が表示されます。

`builder`プロパティを見ると、ビルダーメソッド(`t.memberExpression`)を呼び出すのに必要な3つの引数を見ることができます。

```js
builder: ["object", "property", "computed"],
```

> なお、ノード上でカスタマイズできるプロパティは、`builder`の配列に含まれる数よりも多い場合があります。これはビルダーの引数が多くなりすぎないようにするためです。このような場合には、手動でプロパティを設定する必要があります。この例としては、[`ClassMethod`](https://github.com/babel/babel/blob/bbd14f88c4eea88fa584dd877759dd6b900bf35e/packages/babel-types/src/definitions/es2015.js#L238-L276)があります。

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

ビルダーの引数に対するバリデーションは、`fields`オブジェクトで確認できます。

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

`object`は`Expression`である必要があり、`property`は`MemberExpression`が `computed` であるかどうかに応じて `Expression`または`Identifier`である必要があり、`computed`は単なるブール値で、デフォルトでは`false`であることがわかります。

つまり、以下のようにして`MemberExpression`を構築することができます。

```js
t.memberExpression(
  t.identifier('object'),
  t.identifier('property')
  // `computed` is optional
);
```

これは次のようになります。

```js
object.property
```

しかし、`object`は`Expression`である必要があると言いましたが、なぜ`Identifier`は有効なのでしょうか？

さて、`Identifier`の定義を見てみると、`aliases`というプロパティがあり、これは`Expression`でもあることを示しています。

```js
aliases: ["Expression", "LVal"],
```

つまり、`MemberExpression`は`Expression`の一種なので、別の`MemberExpression`の`object`として設定することができます。

```js
t.memberExpression(
  t.memberExpression(
    t.identifier('member'),
    t.identifier('expression')
  ),
  t.identifier('property')
)
```

これは次のようになります。

```js
member.expression.property
```

すべてのノードタイプのビルダーメソッドシグネチャ(Builder Method Signatures)を記憶することはまずないでしょう。そのため、時間をかけて、ノード定義からどのように生成されるかを理解する必要があります。

実際の全ての定義は[こちら](https://github.com/babel/babel/tree/master/packages/babel-types/src/definitions)、ドキュメントは[こちら](https://github.com/babel/babel/blob/master/doc/ast/spec.md)にあります。

* * *

# <a id="toc-best-practices"></a>ベストプラクティス

## <a id="toc-create-helper-builders-and-checkers"></a>ヘルパービルダー(Helper Builders)とチェッカー(Checkers)の作成

特定のチェック(ノードが特定のタイプであるかどうか)を独自のヘルパー関数(Helper Functions)に抽出したり、特定のノードタイプ用のヘルパーを抽出したりするのはとても簡単です。

```js
function isAssignment(node) {
  return node && node.operator === opts.operator + "=";
}

function buildAssignment(left, right) {
  return t.assignmentExpression("=", left, right);
}
```

## <a id="toc-avoid-traversing-the-ast-as-much-as-possible"></a>極力、ASTの走査(Traversing)を避ける

ASTの走査(Traverse)にはコストがかかりますし、誤って必要以上にASTを走査してしまうこともあります。これは、何万回とは言わないまでも、何千回もの余分な操作になる可能性があります。

Babelはこれを可能な限り最適化し、1回の走査ですべてを行うために、可能であればビジター(Visitors)を結合します。

### <a id="toc-merge-visitors-whenever-possible"></a>可能な限りビジター(Visitors)を統合する

ビジター(Visitors)を書いていると、論理的に必要な複数の場所で `path.traverse`を呼び出したくなることがあります。

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

しかし、これらは一度だけ実行される単一のビジターとして記述する方がはるかに良いです。そうしないと、同じASTを意味もなく何度も横断することになります。

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

### <a id="toc-do-not-traverse-when-manual-lookup-will-do"></a>手動で済む場合は走査(Traverse)しない

特定のノードタイプを探すときに、`path.traverse`を呼びたくなることもあるでしょう。

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

しかし、対象が具体的で浅ければ、コストのかかる走査を行わなくても、必要なノードを手動で探せる可能性があります。

```js
const MyVisitor = {
  FunctionDeclaration(path) {
    path.node.params.forEach(function() {
      // ...
    });
  }
};
```

## <a id="toc-optimizing-nested-visitors"></a>入れ子になったビジター(Nesting Visitors)の最適化

ビジターを入れ子(Nesting Visitors)にしているときは、コードの中に入れ子にして書くとよいかもしれません。

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

しかしこれは、`FunctionDeclaration()`が呼ばれるたびに、新しいビジターオブジェクト(Visitor Object)を作成します。なぜなら、Babelは新しいビジターオブジェクトが渡されるたびに、いくつかの処理を行うからです(複数のタイプを含むキーのエクスプロード(Explod)、検証の実行、オブジェクト構造(Object Structure)の調整など)。Babelは、その処理を既に行ったことを示すフラグをビジターオブジェクトに保存するので、ビジターを変数に保存して、毎回同じオブジェクトを渡す方が良いでしょう。

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

入れ子になったビジターの中で何らかの状態が必要な場合は、次のようにします。

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

これを状態(State)として `traverse()`メソッドに渡すことで、ビジターの`this`からアクセスできるようになります。

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

## <a id="toc-being-aware-of-nested-structures"></a>入れ子構造(Nested Structures)を意識する

与えられた変換(Transform)について考えるとき、与えられた構造がネストできることを忘れてしまうことがあります。

例えば、`Foo`の`ClassDeclaration`から`constructor`の`ClassMethod`を検索したいとします。

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

ここではクラスが入れ子になっているという事実を無視しており、上記の走査を使用すると、入れ子になった`constructor`も発見してしまいます。

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

## <a id="toc-unit-testing"></a>ユニットテスト(Unit Testing)

Babelプラグインのテストには、いくつかの主要な方法があります。スナップショットテスト(Snapshot Tests)、ASTテスト、エクゼクティブテスト(Exec Tests)です。この例では、スナップショットテストをサポートしている[jest](http://facebook.github.io/jest/)を使用しています。ここで作成しているサンプルは、[このレポジトリ](https://github.com/brigand/babel-plugin-testing-example)でホストされています。

まず、Babelプラグインが必要です。これを`src/index.js`に入れます。

```js
module.exports = function testPlugin(babel) {
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

### <a id="toc-snapshot-test"></a>スナップショットテスト(Snapshot Tests)

次に、`npm install -save-dev babel-core jest`で依存関係をインストールして、最初のテストであるスナップショット(Snapshot Tests)を書き始めます。スナップショットテストでは、Babelプラグインの出力を視覚的に検査することができます。入力を与えてスナップショットを作成するように指示すると、それをファイルに保存します。そのスナップショットをGitにチェックインします。これにより、テストケースの出力に影響を与えたときにそれを確認することができます。また、プルリクエストの際にも差分を使うことができます。もちろん、これはどんなテストフレームワークでもできますが、Jestではスナップショットの更新は`jest -u`で簡単にできます。

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

これで、`src/__tests__/__snapshots__/index-test.js.snap`に(Snapshot File)ができました。

```js
exports[`test works 1`] = `
"
var bar = 1;
if (bar) console.log(bar);"
`;
```

プラグインで'bar'を'baz'に変更して、再度Jestを実行すると、次のようになります。

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

プラグインのコードを変更したことで、プラグインの出力にどのような影響があったかを確認し、出力に問題がなければ、`jest -u`を実行してスナップショットを更新します。

### <a id="toc-ast-test"></a>ASTテスト(AST Tests)

スナップショットテストに加えて、ASTを手動で検査することもできます。これはシンプルで脆い例です。もっと複雑な状況では、`babel-traverse`を活用するとよいでしょう。`babel-traverse`では、プラグインと同じように、`visitor`キーでオブジェクトを指定することができます。

```js
it('contains baz', () => {
  const {ast} = babel.transform(example, {plugins: [plugin]});
  const program = ast.program;
  const declaration = program.body[0].declarations[0];
  assert.equal(declaration.id.name, 'baz');
  // or babelTraverse(program, {visitor: ...})
});
```

### <a id="toc-exec-test"></a>エクゼクティブテスト(Exec Tests)

ここでは、コードを変換し、それが正しく動作するかどうかを評価します。このテストでは`assert`を使用していないことに注意してください。これは、プラグインが誤って`assert`の行を削除するなどの変なことをしても、テストが失敗することを保証するためです。

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

`babel-core`は、スナップショットとエクゼクティブテストに[類似したアプローチ](https://github.com/babel/babel/blob/main/CONTRIBUTING.md#writing-tests)を使用しています。

### <a id="toc-babel-plugin-tester"></a>[`babel-plugin-tester`](https://github.com/kentcdodds/babel-plugin-tester)

本パッケージはプラグインのテストを容易にします。ESLintの[RuleTester](http://eslint.org/docs/developer-guide/working-with-rules#rule-unit-tests)に慣れている方にはお馴染みのパッケージです。どのようなことができるかについては[ドキュメント](https://github.com/kentcdodds/babel-plugin-tester/blob/master/README.md)を参照してください。ここでは簡単な例を紹介します。

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

> ***今後のアップデートについては、Twitterで[@thejameskyle](https://twitter.com/thejameskyle)と[@babeljs](https://twitter.com/babeljs)をフォローしてください。***