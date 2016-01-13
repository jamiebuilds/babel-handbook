# buku-petunjuk-plugin-babel

Dokumen ini berisi langkah-langkah pembuatan [Babel](https://babeljs.io) [plugin](https://babeljs.io/docs/advanced/plugins/).

Jika anda membaca terjemahan non-inggris pada buku petunjuk ini, anda dapat menuju seksi bahasa inggris yang belum diterjemahkan. Jika anda ingin berkontribusi pada salah satu terjemahan, anda harus melakukannya melalui Crowdin. Mohon membaca [petunjuk kontribusi](/CONTRIBUTING.md) untuk informasi lebih lanjut.

[![cc-by-4.0](https://licensebuttons.net/l/by/4.0/80x15.png)](http://creativecommons.org/licenses/by/4.0/)

Terima kasih kepada [@sebmck](https://github.com/sebmck/),[@hzoo](https://github.com/hzoo), [@jdalton](https://github.com/jdalton), [@abraithwaite](https://github.com/abraithwaite), [@robey](https://github.com/robey), dan yang lainnya untuk bantuannya menyelesaikan buku ini.

# Skrip Paket Node

Anda dapat memasang buku ini melalui npm. Silakan lakukan:

```sh
$ npm install -g babel-plugin-handbook
```

Sekarang anda sudah mempunyai perintah `babel-plugin-handbook` yang akan membuka berkas readme pada `$PAGER` anda. Selain itu, anda bisa mulai membaca dokumen ini seperti yang anda lakukan sekarang.

# Terjemahan

  * [English](/README.md)
  * [Afrikaans](/translations/af/README.md)
  * [العربية](/translations/ar/README.md)
  * [Català](/translations/ca/README.md)
  * [Čeština](/translations/cs/README.md)
  * [Danske](/translations/da/README.md)
  * [Deutsch](/translations/de/README.md)
  * [ελληνικά](/translations/el/README.md)
  * [Español](/translations/es-ES/README.md)
  * [Suomi](/translations/fi/README.md)
  * [Français](/translations/fr/README.md)
  * [עִברִית](/translations/he/README.md)
  * [Magyar](/translations/hu/README.md)
  * [Italiano](/translations/it/README.md)
  * [日本語](/translations/ja/README.md)
  * [한국어](/translations/ko/README.md)
  * [Norsk](/translations/no/README.md)
  * [Nederlands](/translations/nl/README.md)
  * [Português](/translations/pl/README.md)
  * [Português (Brasil)](/translations/pt-BR/README.md)
  * [Portugisisk](/translations/pt-PT/README.md)
  * [Română](/translations/ro/README.md)
  * [Pусский](/translations/ru/README.md)
  * [Српски језик (Ћирилица)](/translations/sr/README.md)
  * [Svenska](/translations/sv-SE/README.md)
  * [Türk](/translations/tr/README.md)
  * [Український](/translations/uk/README.md)
  * [Tiếng Việt](/translations/vi/README.md)
  * [中文](/translations/zh-Hans/README.md)
  * [繁體中文](/translations/zh-Hant/README.md)

**[Minta terjemahan lain](https://github.com/thejameskyle/babel-plugin-handbook/issues/new?title=Translation%20Request:%20[Please%20enter%20language%20here]&body=I%20am%20able%20to%20translate%20this%20language%20[yes/no])**

Jika Anda membaca terjemahan bahasa Inggris dari dokumen ini Anda akan menemukan sejumlah kata-kata bahasa Inggris yang adalah konsep-konsep pemrograman. Jika ini telah diterjemahkan ke bahasa lain akan ada kurangnya konsistensi dan kelancaran ketika membaca buku ini. Dalam banyak kasus, Anda akan menemukan terjemahan literal diikuti dengan istilah bahasa Inggris dalam kurung `()`. Sebagai contoh: sintaks abstrak pohon (ASTs).

# Daftar Isi

  * [Pengenalan](#introduction)
  * [Dasar](#basics) 
      * [ASTs](#asts)
      * [Status Babel](#stages-of-babel)
      * [Penguraian](#parse) 
          * [Analisis Leksikal](#lexical-analysis)
          * [Analisis Sintaktik](#syntactic-analysis)
      * [Transformasi](#transform)
      * [Pembuatan](#generate)
      * [Traversal](#traversal)
      * [Pengunjung](#visitors)
      * [Paths](#paths) 
          * [Paths in Visitors](#paths-in-visitors)
      * [State](#state)
      * [Scopes](#scopes) 
          * [Bindings](#bindings)
  * [API](#api) 
      * [babylon](#babylon)
      * [babel-traverse](#babel-traverse)
      * [babel-types](#babel-types)
      * [Definitions](#definitions)
      * [Builders](#builders)
      * [Validators](#validators)
      * [Converters](#converters)
      * [babel-generator](#babel-generator)
      * [babel-template](#babel-template)
  * [Writing your first Babel Plugin](#writing-your-first-babel-plugin)
  * [Transformation Operations](#transformation-operations) 
      * [Visiting](#visiting)
      * [Check if a node is a certain type](#check-if-a-node-is-a-certain-type)
      * [Check if an identifier is referenced](#check-if-an-identifier-is-referenced)
      * [Manipulation](#manipulation)
      * [Replacing a node](#replacing-a-node)
      * [Replacing a node with multiple nodes](#replacing-a-node-with-multiple-nodes)
      * [Replacing a node with a source string](#replacing-a-node-with-a-source-string)
      * [Inserting a sibling node](#inserting-a-sibling-node)
      * [Removing a node](#removing-a-node)
      * [Replacing a parent](#replacing-a-parent)
      * [Removing a parent](#removing-a-parent)
      * [Scope](#scope)
      * [Checking if a local variable is bound](#checking-if-a-local-variable-is-bound)
      * [Generating a UID](#generating-a-uid)
      * [Pushing a variable declaration to a parent scope](#pushing-a-variable-declaration-to-a-parent-scope)
      * [Rename a binding and its references](#rename-a-binding-and-its-references)
  * [Plugin Options](#plugin-options)
  * [Building Nodes](#building-nodes)
  * [Best Practices](#best-practices) 
      * [Avoid traversing the AST as much as possible](#avoid-traversing-the-ast-as-much-as-possible)
      * [Merge visitors whenever possible](#merge-visitors-whenever-possible)
      * [Do not traverse when manual lookup will do](#do-not-traverse-when-manual-lookup-will-do)
      * [Optimizing nested visitors](#optimizing-nested-visitors)
      * [Being aware of nested structures](#being-aware-of-nested-structures)

# Pengenalan

Babel adalah compiler JavaScript umum yang multifungsi. Selebihnya, Babel adalah kumpulan modul yang dapat digunakan untuk beberapa bentuk analisis statik.

> Analisis statik adalah proses menganalisa kode tanpa mengeksekusinya. (Analisis kode selama mengeksekusi biasanya disebut analisis dinamik). Tujuan dari analisis statik itu beragam. Itu dapat digunakan untuk linting, compiling, higlight kode, transformasi kode, optimisasi, minifikasi, dan masih banyak lagi.

Anda dapat menggunakan Babel untuk membangun beberapa tipe perkakas yang dapat membantu anda semakun produktif dan menulis program lebih baik.

# Dasar

Babel adalah compiler JavaScript, yang lebih spesifik sebuah kompiler sumber ke sumber, sering disebut "transpiler". Ini berarti bahwa anda memberi beberapa kode JavaScript kepada Babel, Babel memodifikasi kodenya, dan membuat kode baru dari proses di belakangnya.

## ASTs

Setiap langkah meliputi pembuatan atau pengerjaan [Pohon Sintak Abstrak](https://en.wikipedia.org/wiki/Abstract_syntax_tree) atau AST.

> Babel menggunakan modifikasi AST dari [ESTree](https://github.com/estree/estree), dengan spec utama berlokasi di [sini](https://github.com/babel/babel/blob/master/doc/ast/spec.md).

```js
function square(n) {
  return n * n;
}
```

> Periksa [AST Explorer](http://astexplorer.net/) untuk mendapatkan informasi yang lebih baik untuk node AST. [Ini](http://astexplorer.net/#/Z1exs6BWMq) adalah linknya dengan kode contoh di atas disisipkan.

Program yang sama dapat dilihat sebagai daftar seperti ini:

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

Or as a JavaScript Object like this:

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

Anda akan melihat bahwa setiap tingkat AST memiliki struktur serupa:

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

> Catatan: Beberapa properti telah dihapus untuk kesederhanaan.

Masing-masing yang dikenal sebagai **Node**. AST dapat terdiri dari satu node, atau ratusan jika tidak ribuan node. Bersama-sama mereka mampu menjelaskan sintaks dari sebuah program yang dapat digunakan untuk analisis statis.

Setiap Node memiliki antarmuka seperti ini:

```typescript
interface Node {
  type: string;
}
```

Field `type` adalah sebuah string yang mewakili tipe Node objek (seperti. `"FunctionDeclaration"`, `"Identifier"`, or `"BinaryExpression"`). Setiap jenis Node mendefinisikan tambahan set properti yang menggambarkan jenis node tertentu.

Ada properti tambahan pada setiap Node bahwa Babel menghasilkan yang menggambarkan posisi Node dalam kode sumber aslinya.

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

Properti seperti `mulai`, `akhir`, `loc`, muncul dalam setiap Node tunggal.

## Tahapan Babel

Tiga tahap utama dari Babel adalah **penguraian**, **transformasi**, **pembuatan**.

### Penguraian

Tahap **penguraian**, mengambil kode dan mengembalikan AST. Ada dua fase mengurai di Babel: [**Analisis leksikal**](https://en.wikipedia.org/wiki/Lexical_analysis) dan [**Analisis sintaksis**](https://en.wikipedia.org/wiki/Parsing).

#### Analisis Leksikal

Analisis leksikal akan mengambil serangkaian kode dan mengubahnya menjadi aliran **tokens**.

Anda dapat memikirkan tokens sebagai larik datar potongan sintaks bahasa.

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

Masing-masing `type` di sini memiliki seperangkat sifat-sifat yang menggambarkan token:

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

Seperti AST node mereka juga memiliki `start`, `end`, dan `loc`.

#### Analisis Sintaktik

Analisis sintaksis akan mengambil aliran token dan mengubahnya menjadi representasi AST. Menggunakan informasi dalam token, fase ini akan memformat mereka sebagai AST yang mewakili struktur kode dalam cara yang membuatnya lebih mudah untuk bekerja.

### Transformasi

Tahap [transformasi](https://en.wikipedia.org/wiki/Program_transformation) mengambil AST dan melintasi, menambahkan, memperbarui, dan menghapus node dalam prosesnya. Ini adalah bagian paling kompleks dari Babel atau kompiler apapun. Ini adalah tempat plugin beroperasi dan ini akan berupa sebagian besar buku ini. Jadi kita tidak akan menyelam terlalu jauh sekarang.

### Pembuatan

Tahap [pembuatan kode](https://en.wikipedia.org/wiki/Code_generation_(compiler)) mengambil AST akhir dan mengubah kembali menjadi serangkaian kode, juga menciptakan [source maps](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/).

Pembuatan kode ini cukup sederhana: Anda melintasi melalui AST pada kedalaman pertama, membangun sebuah string yang mewakili kode yang sudah ditransormasi.

## Traversal

Bila Anda ingin mengubah AST Anda harus [melintasi pohon](https://en.wikipedia.org/wiki/Tree_traversal) secara rekursif.

Mengatakan bahwa kita memiliki tipe `FunctionDeclaration`. Memiliki beberapa sifat: `id`, `params` dan `body`. Masing-masing memiliki node bertingkat.

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

Jadi kita mulai pada `FunctionDeclaration` dan kita tahu sifat internal sehingga kami mengunjungi masing-masing fungsi dan anak-anak mereka dalam urutan.

Selanjutnya kita pergi ke `id` yang adalah sebuah `Identifier`. `Identifier` tidak memiliki sifat setiap node anak sehingga kita dapat melanjutkan.

Setelah itu adalah `params` yang merupakan array node jadi kita mengunjungi masing-masing. Dalam hal ini sebuah node yang juga sebuah `Identifier` sehingga kita dapat lanjutkan.

Then we hit `body` which is a `BlockStatement` with a property `body` that is an array of Nodes so we go to each of them.

The only item here is a `ReturnStatement` node which has an `argument`, we go to the `argument` and find a `BinaryExpression`.

The `BinaryExpression` has an `operator`, a `left`, and a `right`. The operator isn't a node, just a value, so we don't go to it, and instead just visit `left` and `right`.

This traversal process happens throughout the Babel transform stage.

### Pengunjung

Ketika kita berbicara tentang "pergi" ke sebuah node, kita benar-benar mengartikan untuk **mengunjungi** mereka. Kita menggunakan istilah itu alasannya karena ada konsep [**pengunjung**](https://en.wikipedia.org/wiki/Visitor_pattern).

Visitors are a pattern used in AST traversal across languages. Simply put they are an object with methods defined for accepting particular node types in a tree. That's a bit abstract so let's look at an example.

```js
const MyVisitor = {
  Identifier() {
    console.log("Called!");
  }
};
```

> **Note:** `Identifier() { ... }` is shorthand for `Identifier: { enter() { ... } }`.

This is a basic visitor that when used during a traversal will call the `Identifier()` method for every `Identifier` in the tree.

So with this code the `Identifier()` method will be called four times with each `Identifier` (including `square`).

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

These calls are all on node **enter**. However there is also the possibility of calling a visitor method when on **exit**.

Imagine we have this tree structure:

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

As we traverse down each branch of the tree we eventually hit dead ends where we need to traverse back up the tree to get to the next node. Going down the tree we **enter** each node, then going back up we **exit** each node.

Let's *walk* through what this process looks like for the above tree.

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

So when creating a visitor you have two opportunities to visit a node.

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

### Path

An AST generally has many Nodes, but how do Nodes relate to one another? We could have one giant mutable object that you manipulate and have full access to, or we can simplify this with **Paths**.

Sebuah **Path** adalah representasi objek berhubungan antara dua node.

Sebagai contoh jika kita mengambil node berikut dan anaknya:

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

Dan mewakili anak `Identifier` sebagai path, tampak seperti ini:

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

Ini juga memiliki tambahan metadata tentang path:

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

Sama halnya dengan metode yang berhubungan dengan menambahkan, update, memindahkan, dan menghapus node, tetapi kita akan masuk ke sana nanti.

Dalam artinya, paths adalah sebuah representasi **reaktif** dari posisi node di pohon dan segala macam informasi tentang node. Setiap kali Anda memanggil metode yang memodifikasi pohon, informasi ini diperbarui. Babel mengelola semua ini bagi anda untuk membuat bekerja dengan node mudah dan semakin stateless.

#### Path pada Pengunjung

Bila Anda memiliki pengunjung yang memiliki metode`Identifier()`, Anda benar-benar mengunjungi path bukan node. Dengan cara ini Anda sebagian besar bekerja dengan perwakilan reaktif dari sebuah node bukan node itu sendiri.

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

### State

State is the enemy of AST transformation. State will bite you over and over again and your assumptions about state will almost always be proven wrong by some syntax that you didn't consider.

Take the following code:

```js
function square(n) {
  return n * n;
}
```

Let's write a quick hacky visitor that will rename `n` to `x`.

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

This might work for the above code, but we can easily break that by doing this:

```js
function square(n) {
  return n * n;
}
n;
```

The better way to deal with this is recursion. So let's make like a Christopher Nolan film and put a visitor inside of a visitor.

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

Tentu saja, ini adalah contoh yang dibuat-buat, tapi ini menunjukkan bagaimana untuk menghilangkan state global dari pengunjung anda.

### Cakupan

Selanjutnya mari kita belajar konsep [**cakupan**](https://en.wikipedia.org/wiki/Scope_(computer_science)). JavaScript memiliki [cakupan leksikal](https://en.wikipedia.org/wiki/Scope_(computer_science)#Lexical_scoping_vs._dynamic_scoping), yang merupakan struktur pohon di mana blok dapat membuat cakupan baru.

```js
// global scope

function scopeOne() {
  // scope 1

  function scopeTwo() {
    // scope 2
  }
}
```

Setiap kali Anda membuat referensi dalam JavaScript, apakah itu oleh variabel, fungsi, kelas, param, impor, label, dll, itu milik cakupan saat ini.

```js
var global = "I am in the global scope";

function scopeOne() {
  var one = "I am in the scope created by `scopeOne()`";

  function scopeTwo() {
    var two = "I am in the scope created by `scopeTwo()`";
  }
}
```

Kode dalam cakupan yang lebih dalam dapat menggunakan referensi dari cakupan yang lebih tinggi.

```js
function scopeOne() {
  var one = "I am in the scope created by `scopeOne()`";

  function scopeTwo() {
    one = "I am updating the reference in `scopeOne` inside `scopeTwo`";
  }
}
```

Cakupan yang lebih rendah juga mungkin membuat referensi dari nama yang sama tanpa memodifikasi itu.

```js
function scopeOne() {
  var one = "I am in the scope created by `scopeOne()`";

  function scopeTwo() {
    var one = "I am creating a new `one` but leaving reference in `scopeOne()` alone.";
  }
}
```

Saat menulis sebuah transformasi, kita perlu berhati-hati dengan cakupan. Kita perlu memastikan bahwa kita tidak melanggar kode yang ada sementara memodifikasi bagian yang berbeda itu.

We may want to add new references and make sure they don't collide with existing ones. Or maybe we just want to find where a variable is referenced. We want to be able to track these references within a given scope.

A scope can be represented as:

```js
{
  path: path,
  block: path.node,
  parentBlock: path.parent,
  parent: parentScope,
  bindings: [...]
}
```

When you create a new scope you do so by giving it a path and a parent scope. Then during the traversal process it collects all the references ("bindings") within that scope.

Once that's done, there's all sorts of methods you can use on scopes. We'll get into those later though.

#### Bindings

Semua referensi adalah milik cakupan tertentu; hubungan ini dikenal sebagai **binding**.

```js
function scopeOnce() {
  var ref = "This is a binding";

  ref; // This is a reference to a binding

  function scopeTwo() {
    ref; // This is a reference to a binding from a lower scope
  }
}
```

Binding tunggal terlihat seperti ini:

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

Dengan informasi ini anda dapat menemukan semua referensi pada sebuah binding, melihat apa jenis mengikat itu (parameter, deklarasi, dll), melihat cakupan apa itu, atau mendapatkan salinan dari identifier. Anda bahkan dapat memberitahu jika itu konstan dan jika tidak, dapat melihat jalan apa yang menyebabkan untuk menjadi tidak konstan.

Mampu untuk mengetahui apakah sebuah binding adalah konstan berguna untuk berbagai keperluan, yang terbesar adalah minifikasi.

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

# API

Babel is actually a collection of modules. In this section we'll walk through the major ones, explaining what they do and how to use them.

> Note: This is not a replacement for detailed API documentation which will be available elsewhere shortly.

## [`babylon`](https://github.com/babel/babel/tree/master/packages/babylon)

Babylon adalah pengurai Babel. Dimulai sebagai sebuah fork dari Acorn, dia cepat, mudah digunakan, memiliki arsitektur berbasis plugin untuk non-standar fitur (serta standar masa depan).

Pertama, mari kita menginstalnya.

```sh
$ npm install --save babylon
```

Mari kita mulai dengan hanya mengurai string kode:

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

Kami juga dapat melewati pilihan untuk `parse()` seperti:

```js
babylon.parse(code, {
  sourceType: "module", // default: "script"
  plugins: ["jsx"] // default: []
});
```

`sourceType` can either be `"module"` or `"script"` which is the mode that Babylon should parse in. `"module"` will parse in strict mode and allow module declarations, `"script"` will not.

> **Note:** `sourceType` defaults to `"script"` and will error when it finds `import` or `export`. Pass `sourceType: "module"` to get rid of these errors.

Since Babylon is built with a plugin-based architecture, there is also a `plugins` option which will enable the internal plugins. Note that Babylon has not yet opened this API to external plugins, although may do so in the future.

To see a full list of plugins, see the [Babylon README](https://github.com/babel/babel/blob/master/packages/babylon/README.md#plugins).

## [`babel-traverse`](https://github.com/babel/babel/tree/master/packages/babel-traverse)

The Babel Traverse module maintains the overall tree state, and is responsible for replacing, removing, and adding nodes.

Install it by running:

```sh
$ npm install --save babel-traverse
```

We can use it alongside Babylon to traverse and update nodes:

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

## [`babel-types`](https://github.com/babel/babel/tree/master/packages/babel-types)

Babel Types is a Lodash-esque utility library for AST nodes. It contains methods for building, validating, and converting AST nodes. It's useful for cleaning up AST logic with well thought out utility methods.

You can install it by running:

```sh
$ npm install --save babel-types
```

Then start using it:

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

### Definisi

Babel Types has definitions for every single type of node, with information on what properties belong where, what values are valid, how to build that node, how the node should be traversed, and aliases of the Node.

A single node type definition looks like this:

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

### Builders

You'll notice the above definition for `BinaryExpression` has a field for a `builder`.

```js
builder: ["operator", "left", "right"]
```

This is because each node type gets a builder method, which when used looks like this:

```js
t.binaryExpression("*", t.identifier("a"), t.identifier("b"));
```

Which creates an AST like this:

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

Which when printed looks like this:

```js
a * b
```

Builders will also validate the nodes they are creating and throw descriptive errors if used improperly. Which leads into the next type of method.

### Validators

Definisi `BinaryExpression` juga mencakup informasi tentang `bidang` sebuah node dan bagaimana melakukan validasi.

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

This is used to create two types of validating methods. The first of which is `isX`.

```js
t.isBinaryExpression(maybeBinaryExpressionNode);
```

This tests to make sure that the node is a binary expression, but you can also pass a second parameter to ensure that the node contains certain properties and values.

```js
t.isBinaryExpression(maybeBinaryExpressionNode, { operator: "*" });
```

There is also the more, *ehem*, assertive version of these methods, which will throw errors instead of returning `true` or `false`.

```js
t.assertBinaryExpression(maybeBinaryExpressionNode);
t.assertBinaryExpression(maybeBinaryExpressionNode, { operator: "*" });
// Error: Expected type "BinaryExpression" with option { "operator": "*" }
```

### Converters

> [WIP]

## [`babel-generator`](https://github.com/babel/babel/tree/master/packages/babel-generator)

Babel Generator is the code generator for Babel. It takes an AST and turns it into code with sourcemaps.

Run the following to install it:

```sh
$ npm install --save babel-generator
```

Then use it

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

You can also pass options to `generate()`.

```js
generate(ast, {
  retainLines: false,
  compact: "auto",
  concise: false,
  quotes: "double",
  // ...
}, code);
```

## [`babel-template`](https://github.com/babel/babel/tree/master/packages/babel-template)

Babel Template is another tiny but incredibly useful module. It allows you to write strings of code with placeholders that you can use instead of manually building up a massive AST.

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

# Writing your first Babel Plugin

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

# Transformation Operations

## Visiting

### Check if a node is a certain type

If you want to check what the type of a node is, the preferred way to do so is:

```js
BinaryExpression(path) {
  if (t.isIdentifier(path.node.left)) {
    // ...
  }
}
```

You can also do a shallow check for properties on that node:

```js
BinaryExpression(path) {
  if (t.isIdentifier(path.node.left, { name: "n" })) {
    // ...
  }
}
```

This is functionally equivalent to:

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

### Check if an identifier is referenced

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

## Manipulation

### Replacing a node

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

### Replacing a node with multiple nodes

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

### Replacing a node with a source string

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

### Inserting a sibling node

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

### Removing a node

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

### Replacing a parent

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

### Removing a parent

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

## Scope

### Checking if a local variable is bound

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

### Generating a UID

This will generate an identifier that doesn't collide with any locally defined variables.

```js
FunctionDeclaration(path) {
  path.scope.generateUidIdentifier("uid");
  // Node { type: "Identifier", name: "_uid" }
  path.scope.generateUidIdentifier("uid");
  // Node { type: "Identifier", name: "_uid2" }
}
```

### Pushing a variable declaration to a parent scope

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

### Rename a binding and its references

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

# Plugin Options

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

* * *

# Building Nodes

When writing transformations you'll often want to build up some nodes to insert into the AST. As mentioned previously, you can do this using the [builder](#builder) methods in the [`babel-types`](#babel-types) package.

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

# Praktik terbaik

> I'll be working on this section over the coming weeks.

## Avoid traversing the AST as much as possible

Traversing the AST is expensive, and it's easy to accidentally traverse the AST more than necessary. This could be thousands if not tens of thousands of extra operations.

Babel optimizes this as much as possible, merging visitors together if it can in order to do everything in a single traversal.

### Merge visitors whenever possible

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

Namun, itu jauh lebih baik untuk menulis ini sebagai seorang pengunjung tunggal yang hanya mendapat berjalan sekali. Sebaliknya Anda yang melintasi beberapa kali pohon yang sama tanpa alasan.

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

### Jangan melintasi ketika pencarian manual akan dilakukan

Mungkin juga akan tergoda untuk memanggil `path.traverse` ketika mencari jenis node tertentu.

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

Namun, jika anda mencari sesuatu yang spesifik dan dangkal, ada kemungkinan anda dapat secara manual mencari node yang Anda butuhkan tanpa melakukan traversal yang mahal.

```js
const MyVisitor = {
  FunctionDeclaration(path) {
    path.node.params.forEach(function() {
      // ...
    });
  }
};
```

## Mengoptimalkan pengunjung bertingkat

Ketika Anda pengunjung bertingkat, hal itu mungkin masuk akal untuk menulis mereka bertingkat dalam kode Anda.

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

Namun, hal ini menciptakan baru pengunjung objek setiap kali `FunctionDeclaration()` disebut di atas, yang Babel kemudian perlu meledak dan memvalidasi setiap saat. This can be costly, so it is better to hoist the visitor up.

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

Jika Anda memerlukan beberapa state dalam pengunjung bertingkat, seperti:

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

Anda dapat melewatinya dalam sebagai state dengan metode `traverse()` dan memiliki akses ke sana pada `this` dalam pengunjung.

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

## Berhati-hati terhadap struktur bertingkat

Kadang-kadang ketika berpikir tentang mengubah tertentu, Anda mungkin lupa bahwa struktur yang diberikan dapat disusun bertingkat.

Sebagai contoh, bayangkan kita ingin lookup `constuctor` `ClassMethod` dari `Foo` `ClassDeclaration`.

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

Kita mengabaikan fakta bahwa kelas dapat diulang dan menggunakan traversal di atas kita akan menemui `constructor` bertingkat juga:

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