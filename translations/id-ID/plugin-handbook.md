# Babel Plugin Handbook

Dokumen ini berisi langkah-langkah pembuatan [Babel](https://babeljs.io) [plugin](https://babeljs.io/docs/advanced/plugins/).

[![cc-by-4.0](https://licensebuttons.net/l/by/4.0/80x15.png)](http://creativecommons.org/licenses/by/4.0/)

Buku pedoman ini tersedia dalam bahasa lain, lihat file [README](/README.md) untuk daftar lengkap.

# Daftar Isi

  * [Pengenalan](#toc-introduction)
  * [Dasar](#toc-basics) 
      * [ASTs](#toc-asts)
      * [Status Babel](#toc-stages-of-babel)
      * [Penguraian](#toc-parse) 
          * [Analisis Leksikal](#toc-lexical-analysis)
          * [Analisis Sintaktik](#toc-syntactic-analysis)
      * [Transformasi](#toc-transform)
      * [Pembuatan](#toc-generate)
      * [Traversal](#toc-traversal)
      * [Pengunjung](#toc-visitors)
      * [Paths](#toc-paths) 
          * [Paths in Visitors](#toc-paths-in-visitors)
      * [State](#toc-state)
      * [Scopes](#toc-scopes) 
          * [Bindings](#toc-bindings)
  * [API](#toc-api) 
      * [babylon](#toc-babylon)
      * [babel-traverse](#toc-babel-traverse)
      * [babel-types](#toc-babel-types)
      * [Definisi](#toc-definitions)
      * [Pembangun](#toc-builders)
      * [Validator](#toc-validators)
      * [Konverter](#toc-converters)
      * [babel-generator](#toc-babel-generator)
      * [babel-template](#toc-babel-template)
  * [Menulis Plugin Babel pertama Anda](#toc-writing-your-first-babel-plugin)
  * [Aperasi Transformasi](#toc-transformation-operations) 
      * [Mengunjungi](#toc-visiting)
      * [Check if a node is a certain type](#toc-check-if-a-node-is-a-certain-type)
      * [Check if an identifier is referenced](#toc-check-if-an-identifier-is-referenced)
      * [Manipulation](#toc-manipulation)
      * [Replacing a node](#toc-replacing-a-node)
      * [Replacing a node with multiple nodes](#toc-replacing-a-node-with-multiple-nodes)
      * [Replacing a node with a source string](#toc-replacing-a-node-with-a-source-string)
      * [Inserting a sibling node](#toc-inserting-a-sibling-node)
      * [Removing a node](#toc-removing-a-node)
      * [Replacing a parent](#toc-replacing-a-parent)
      * [Removing a parent](#toc-removing-a-parent)
      * [Scope](#toc-scope)
      * [Checking if a local variable is bound](#toc-checking-if-a-local-variable-is-bound)
      * [Generating a UID](#toc-generating-a-uid)
      * [Pushing a variable declaration to a parent scope](#toc-pushing-a-variable-declaration-to-a-parent-scope)
      * [Rename a binding and its references](#toc-rename-a-binding-and-its-references)
  * [Plugin Options](#toc-plugin-options)
  * [Building Nodes](#toc-building-nodes)
  * [Best Practices](#toc-best-practices) 
      * [Avoid traversing the AST as much as possible](#toc-avoid-traversing-the-ast-as-much-as-possible)
      * [Merge visitors whenever possible](#toc-merge-visitors-whenever-possible)
      * [Do not traverse when manual lookup will do](#toc-do-not-traverse-when-manual-lookup-will-do)
      * [Optimizing nested visitors](#toc-optimizing-nested-visitors)
      * [Being aware of nested structures](#toc-being-aware-of-nested-structures)

# <a id="toc-introduction"></a>Pengenalan

Babel adalah compiler JavaScript umum yang multifungsi. Selebihnya, Babel adalah kumpulan modul yang dapat digunakan untuk beberapa bentuk analisis statik.

> Analisis statik adalah proses menganalisa kode tanpa mengeksekusinya. (Analisis kode selama mengeksekusi biasanya disebut analisis dinamik). Tujuan dari analisis statik itu beragam. Itu dapat digunakan untuk linting, compiling, higlight kode, transformasi kode, optimisasi, minifikasi, dan masih banyak lagi.

Anda dapat menggunakan Babel untuk membangun beberapa tipe perkakas yang dapat membantu anda semakun produktif dan menulis program lebih baik.

> ***Untuk pembaruan terbaru, ikuti [@thejameskyle](https://twitter.com/thejameskyle) di Twitter.***

* * *

# <a id="toc-basics"></a>Dasar

Babel adalah compiler JavaScript, yang lebih spesifik sebuah kompiler sumber ke sumber, sering disebut "transpiler". Ini berarti bahwa anda memberi beberapa kode JavaScript kepada Babel, Babel memodifikasi kodenya, dan membuat kode baru dari proses di belakangnya.

## <a id="toc-asts"></a>ASTs

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

Atau sebagai objek JavaScript seperti ini:

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

Properti seperti `start`, `end`, `loc`, muncul dalam setiap Node tunggal.

## <a id="toc-stages-of-babel"></a>Status Babel

Tiga tahap utama dari Babel adalah **parse**, **transform**, **generate**.

### <a id="toc-parse"></a>Parse

Tahap **parse**, mengambil kode dan mengembalikan AST. Ada dua fase mengurai di Babel: [**Analisis leksikal**](https://en.wikipedia.org/wiki/Lexical_analysis) dan [**Analisis sintaksis**](https://en.wikipedia.org/wiki/Parsing).

#### <a id="toc-lexical-analysis"></a>Analisis Leksikal

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

#### <a id="toc-syntactic-analysis"></a>Analisis Sintaktik

Analisis sintaksis akan mengambil aliran token dan mengubahnya menjadi representasi AST. Menggunakan informasi dalam token, fase ini akan memformat mereka sebagai AST yang mewakili struktur kode dalam cara yang membuatnya lebih mudah untuk bekerja.

### <a id="toc-transform"></a>Transformasi

Tahap [transformasi](https://en.wikipedia.org/wiki/Program_transformation) mengambil AST dan melintasi, menambahkan, memperbarui, dan menghapus node dalam prosesnya. Ini adalah bagian paling kompleks dari Babel atau kompiler apapun. Ini adalah tempat plugin beroperasi dan ini akan berupa sebagian besar buku ini. Jadi kita tidak akan menyelam terlalu jauh sekarang.

### <a id="toc-generate"></a>Pembuatan

The [code generation](https://en.wikipedia.org/wiki/Code_generation_(compiler)) stage takes the final AST and turns it back into a string of code, also creating [source maps](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/).

Pembuatan kode ini cukup sederhana: Anda melintasi melalui AST pada kedalaman pertama, membangun sebuah string yang mewakili kode yang sudah ditransormasi.

## <a id="toc-traversal"></a>Traversal

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

Kemudian kita menggunakan `body` yang merupakan `BlockStatement` dengan properti `body` yang merupakan node array agar kita bisa menggunakannya masing-masing.

Satu-satunyaitem di sini adalah sebuah node `ReturnStatement` yang memiliki `argumen`, kita bisa menggunakan `argumen` dan menemukan `BinaryExpression`.

`BinaryExpression` memiliki `operator`, `left`, dan `right`. Operator bujanlah sebuah node, hanya sebuah nilai, jadi kita tidak menggunakannya, dan hanya menggunakan `left` dan `right`.

Proses traversal ini terjadi sepanjang tahap mengubah Babel.

### <a id="toc-visitors"></a>Pengunjung

Ketika kita berbicara tentang "pergi" ke sebuah node, kita benar-benar mengartikan untuk **mengunjungi** mereka. Kita menggunakan istilah itu alasannya karena ada konsep [**pengunjung**](https://en.wikipedia.org/wiki/Visitor_pattern).

Pengunjung adalah sebuah pola yang digunakan dalam AST traversal bahasa. Cukup menempatkan sebuah objek dengan metode yang ditentukan untuk menerima tipe node tertentu di pohon. Itu sedikit abstrak jadi mari kita lihat sebuah contoh.

```js
const MyVisitor = {
  Identifier() {
    console.log("Called!");
  }
};
```

> **Catatan:** `Identifier() { ... }` adalah singkatan untuk `Identifier: {enter() { ... }}`.

Ini adalah dasar pengunjung ketika digunakan selama traversal akan memanggil metode `Identifier()` untuk setiap `Identifier` di pohon.

Jadi dengan kode `Identifier()` metode akan dipanggil empat kali dengan masing-masing `Identifier` (termasuk `square`).

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

### <a id="toc-paths"></a>Paths

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

#### <a id="toc-paths-in-visitors"></a>Paths in Visitors

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

### <a id="toc-state"></a>State

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

### <a id="toc-scopes"></a>Scopes

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

Kita mungkin ingin menambahkan referensi baru dan memastikan bahwa mereka tidak berbenturan dengan yang sudah ada. Atau mungkin kita hanya ingin menemukan mana variabel yang dirujuk. Kami ingin dapat melacak ini referensi dalam lingkup yang diberikan.

Lingkup yang dapat digambarkan sebagai:

```js
{
  path: path,
  block: path.node,
  parentBlock: path.parent,
  parent: parentScope,
  bindings: [...]
}
```

Ketika Anda membuat cakupan baru Anda melakukannya dengan memberikan jalan dan lingkup orangtua. Kemudian selama proses traversal mengumpulkan semua referensi ("binding") dalam lingkup itu.

Setelah selesai, ada segala macam metode yang dapat Anda gunakan pada cakupan. Kita akan mendapatkan ke orang-orang kemudian meskipun.

#### <a id="toc-bindings"></a>Bindings

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

# <a id="toc-api"></a>API

Babel adalah benar-benar kumpulan dari modul. Dalam bagian ini kita akan berjalan melalui yang utama, menjelaskan apa yang mereka lakukan dan bagaimana menggunakannya.

> Catatan: Ini bukanlah pengganti untuk rinci dokumentasi API yang akan tersedia di tempat lain segera.

## <a id="toc-babylon"></a>[`babylon`](https://github.com/babel/babel/tree/master/packages/babylon)

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

`sourceType` dapat menjadi `"modul"` atau `"script"` yang adalah modus yang Babel harus memilah dalam. `"modul"` akan mengurai dalam modus ketat dan memungkinkan Deklarasi modul, `"script"` tidak akan.

> **Catatan:** `sourceType` default `"script"` dan akan kesalahan ketika ia menemukan `impor` atau `ekspor`. Lulus `sourceType: "modul"` untuk menyingkirkan kesalahan ini.

Karena Babel dibangun dengan arsitektur yang berbasis plugin, juga ada pilihan `plugin` yang akan memungkinkan plugin internal. Catatan bahwa Babel tidak belum dibuka API ini untuk plugin eksternal, meskipun dapat melakukannya di masa depan.

Untuk melihat daftar lengkap plugin, lihat [README Babel](https://github.com/babel/babel/blob/master/packages/babylon/README.md#plugins).

## <a id="toc-babel-traverse"></a>[`babel-traverse`](https://github.com/babel/babel/tree/master/packages/babel-traverse)

Modul Babel melintasi mempertahankan status pohon, dan bertanggung jawab untuk mengganti, menghapus dan menambahkan node.

Menginstalnya dengan menjalankan:

```sh
$ npm install --save babel-traverse
```

Kita dapat menggunakannya bersama Babel untuk melintasi dan memperbarui node:

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

Jenis Babel adalah utilitas Lodash-esque perpustakaan untuk AST node. Ini berisi metode untuk membangun, memvalidasi, dan mengkonversi AST node. Hal ini berguna untuk membersihkan AST logika dengan dipikirkan utilitas metode dengan baik.

Anda dapat menginstalnya dengan menjalankan:

```sh
$ npm install --save babel-types
```

Kemudian mulai menggunakannya:

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

### <a id="toc-definitions"></a>Definisi

Babel jenis memiliki definisi untuk setiap satu jenis node, dengan informasi tentang sifat-sifat apa milik dimana, apa nilai-nilai berlaku, bagaimana membangun simpul tersebut, bagaimana node yang harus dilalui, dan alias node.

Definisi jenis satu simpul yang terlihat seperti ini:

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

### <a id="toc-builders"></a>Pembangun

Anda akan melihat definisi di atas untuk `BinaryExpression` memiliki lapangan bagi seorang `pembangun`.

```js
builder: ["operator", "left", "right"]
```

Hal ini karena setiap jenis node mendapat metode builder, yang bila digunakan tampak seperti ini:

```js
t.binaryExpression("*", t.identifier("a"), t.identifier("b"));
```

Yang menciptakan AST seperti ini:

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

Yang ketika dicetak tampak seperti ini:

```js
a * b
```

Pembangun juga akan memvalidasi node mereka membuat dan melempar kesalahan deskriptif jika digunakan dengan benar. Yang mengarah ke jenis metode berikutnya.

### <a id="toc-validators"></a>Validator

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

Ini digunakan untuk membuat dua jenis memvalidasi metode. Yang pertama adalah `Bei`.

```js
t.isBinaryExpression(maybeBinaryExpressionNode);
```

Tes ini untuk memastikan bahwa node adalah ekspresi biner, tetapi Anda juga dapat melewati parameter kedua untuk memastikan bahwa node berisi properti dan nilai-nilai tertentu.

```js
t.isBinaryExpression(maybeBinaryExpressionNode, { operator: "*" });
```

Ada juga lebih, *ehem*, tegas versi dari metode ini, yang akan melemparkan kesalahan daripada mengembalikan `true` atau `false`.

```js
t.assertBinaryExpression(maybeBinaryExpressionNode);
t.assertBinaryExpression(maybeBinaryExpressionNode, { operator: "*" });
// Error: Expected type "BinaryExpression" with option { "operator": "*" }
```

### <a id="toc-converters"></a>Konverter

> [WIP]

## <a id="toc-babel-generator"></a>[`babel-generator`](https://github.com/babel/babel/tree/master/packages/babel-generator)

Babel Generator adalah kode generator untuk Babel. Dibutuhkan AST dan mengubahnya menjadi kode dengan sourcemaps.

Jalankan berikut ini untuk menginstalnya:

```sh
$ npm install --save babel-generator
```

Kemudian menggunakannya

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

Anda juga dapat melewati pilihan untuk `generate()`.

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

Babel Template is another tiny but incredibly useful module. It allows you to write strings of code with placeholders that you can use instead of manually building up a massive AST. In computer science, this capability is called quasiquotes.

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

# <a id="toc-writing-your-first-babel-plugin"></a>Menulis Plugin Babel pertama Anda

Sekarang bahwa Anda akrab dengan semua dasar-dasar Babel, mari kita mengikat bersama-sama dengan plugin API.

Memulai dengan `fungsi` yang akan dilewati objek [`babel`](https://github.com/babel/babel/tree/master/packages/babel-core) saat ini.

```js
export default function(babel) {
  // plugin contents
}
```

Karena Anda akan menggunakan itu begitu sering, Anda mungkin ingin mengambil hanya `babel.types` seperti:

```js
export default function({ types: t }) {
  // plugin contents
}
```

Kemudian Anda kembali sebuah objek dengan properti `pengunjung` yang merupakan pengunjung utama untuk plugin.

```js
export default function({ types: t }) {
  return {
    visitor: {
      // visitor contents
    }
  };
};
```

Mari kita menulis sebuah plugin yang cepat untuk menunjukkan cara kerjanya. Berikut adalah kode sumber kami:

```js
foo === bar;
```

Atau AST membentuk:

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

Kita akan mulai dengan menambahkan metode pengunjung `BinaryExpression`.

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

Kemudian Mari kita menguranginya hingga ke hanya `BinaryExpression` s yang menggunakan operator `=`.

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

Sekarang mari kita mengganti properti `kiri` dengan sebuah identifier yang baru:

```js
BinaryExpression(path) {
  if (path.node.operator !== "===") {
    return;
  }

  path.node.left = t.identifier("sebmck");
  // ...
}
```

Sudah jika kita menjalankan plugin ini kita akan mendapatkan:

```js
sebmck === bar;
```

Sekarang mari kita hanya mengganti properti yang `tepat`.

```js
BinaryExpression(path) {
  if (path.node.operator !== "===") {
    return;
  }

  path.node.left = t.identifier("sebmck");
  path.node.right = t.identifier("dork");
}
```

Dan sekarang untuk hasil akhir kami:

```js
sebmck === dork;
```

Keren! Kami pertama plugin Babel.

* * *

# <a id="toc-transformation-operations"></a>Aperasi Transformasi

## <a id="toc-visiting"></a>Mengunjungi

### <a id="toc-check-if-a-node-is-a-certain-type"></a>Memeriksa apakah sebuah node jenis tertentu

Jika Anda ingin memeriksa apa jenis sebuah node, cara yang lebih disukai untuk melakukannya adalah:

```js
BinaryExpression(path) {
  if (t.isIdentifier(path.node.left)) {
    // ...
  }
}
```

Anda juga dapat melakukan memeriksa dangkal untuk properti simpul tersebut:

```js
BinaryExpression(path) {
  if (t.isIdentifier(path.node.left, { name: "n" })) {
    // ...
  }
}
```

Ini fungsional setara dengan:

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

### <a id="toc-check-if-an-identifier-is-referenced"></a>Periksa jika pengidentifikasi yang dirujuk

```js
Identifier(path) {
  if (path.isReferencedIdentifier()) {
    // ...
  }
}
```

Selain itu:

```js
Identifier(path) {
  if (t.isReferenced(path.node, path.parent)) {
    // ...
  }
}
```

## <a id="toc-manipulation"></a>Manipulasi

### <a id="toc-replacing-a-node"></a>Mengganti sebuah node

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

### <a id="toc-replacing-a-node-with-multiple-nodes"></a>Mengganti sebuah node dengan node beberapa

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

> **Catatan:** Ketika mengganti ekspresi dengan beberapa node, mereka harus pernyataan. Hal ini karena Babel menggunakan heuristik secara ekstensif ketika menggantikan node yang berarti bahwa Anda dapat melakukan beberapa transformasi yang cukup gila bahwa akan sangat verbose sebaliknya.

### <a id="toc-replacing-a-node-with-a-source-string"></a>Mengganti sebuah node dengan string sumber

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

> **Catatan:** Tidak dianjurkan untuk menggunakan API ini kecuali Anda sedang berhadapan dengan string dinamis sumber, jika tidak lebih efisien untuk mengurai kode di luar pengunjung.

### <a id="toc-inserting-a-sibling-node"></a>Memasukkan sebuah node saudara kandung

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

> **Catatan:** Ini harus selalu pernyataan atau sebuah array dari pernyataan. Ini menggunakan heuristik sama yang disebutkan dalam [menggantikan sebuah node dengan node beberapa](#replacing-a-node-with-multiple-nodes).

### <a id="toc-removing-a-node"></a>Menghapus sebuah node

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

### <a id="toc-replacing-a-parent"></a>Menggantikan orang tua

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

### <a id="toc-removing-a-parent"></a>Menghapus orangtua

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

## <a id="toc-scope"></a>Scope

### <a id="toc-checking-if-a-local-variable-is-bound"></a>Memeriksa jika variabel lokal adalah terikat

```js
FunctionDeclaration(path) {
  if (path.scope.hasBinding("n")) {
    // ...
  }
}
```

Ini akan berjalan lingkup pohon dan memeriksa untuk mengikat tertentu itu.

Anda juga dapat memeriksa jika memiliki lingkup yang mengikat **sendiri**:

```js
FunctionDeclaration(path) {
  if (path.scope.hasOwnBinding("n")) {
    // ...
  }
}
```

### <a id="toc-generating-a-uid"></a>Menghasilkan UID

Ini akan menghasilkan sebuah identifier yang tidak berbenturan dengan setiap variabel lokal didefinisikan.

```js
FunctionDeclaration(path) {
  path.scope.generateUidIdentifier("uid");
  // Node { type: "Identifier", name: "_uid" }
  path.scope.generateUidIdentifier("uid");
  // Node { type: "Identifier", name: "_uid2" }
}
```

### <a id="toc-pushing-a-variable-declaration-to-a-parent-scope"></a>Mendorong sebuah Deklarasi variabel untuk lingkup orangtua

Kadang-kadang Anda mungkin ingin mendorong `VariableDeclaration` sehingga Anda dapat menetapkan untuk itu.

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

### <a id="toc-rename-a-binding-and-its-references"></a>Mengubah nama yang mengikat dan referensi yang

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

Atau, Anda dapat mengubah mengikat untuk pengenal unik yang dihasilkan:

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

# <a id="toc-plugin-options"></a>Plugin Options

Jika Anda ingin agar pengguna Anda menyesuaikan perilaku Anda Babel plugin Anda dapat menerima pilihan plugin tertentu yang pengguna dapat menentukan seperti ini:

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

Pilihan ini kemudian mendapatkan melewati ke plugin pengunjung obyek `state`:

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

Pilihan ini plugin-spesifik dan Anda tidak dapat mengakses pilihan dari plugin lain.

* * *

# <a id="toc-building-nodes"></a>Building Nodes

Saat menulis transformasi Anda akan sering ingin membangun beberapa node untuk memasukkan ke dalam AST. Seperti disebutkan sebelumnya, Anda dapat melakukannya menggunakan metode [pembangun](#builder) dalam [`babel-jenis`](#babel-types) paket.

Nama metode bagi seorang pembangun adalah hanya nama jenis node yang Anda ingin membangun kecuali dengan huruf pertama lowercased. Misalnya jika Anda ingin membangun `MemberExpression` Anda akan menggunakan `t.memberExpression(...)`.

Argumen pembangun ini ditentukan oleh definisi node. Ada beberapa pekerjaan yang sedang dilakukan untuk menghasilkan mudah-untuk-membaca dokumentasi pada definisi, tetapi untuk sekarang mereka dapat semua akan ditemukan [di sini](https://github.com/babel/babel/tree/master/packages/babel-types/src/definitions).

Definisi node yang terlihat seperti berikut:

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

Di sini Anda dapat melihat semua informasi tentang tipe node tertentu, termasuk bagaimana untuk membangunnya, melewatinya dan memvalidasi itu.

Dengan melihat `pembangun` properti, Anda dapat melihat 3 argumen yang akan diperlukan untuk memanggil metode pembangun (`t.memberExpression`).

```js
builder: ["object", "property", "computed"],
```

> Perhatikan bahwa kadang-kadang ada sifat lebih yang Anda dapat menyesuaikan pada node dari array `pembangun` berisi. Hal ini untuk menjaga builder dari memiliki terlalu banyak argumen. Dalam kasus ini Anda perlu untuk mengatur properti secara manual. Contoh ini adalah [`ClassMethod`](https://github.com/babel/babel/blob/bbd14f88c4eea88fa584dd877759dd6b900bf35e/packages/babel-types/src/definitions/es2015.js#L238-L276).

Anda dapat melihat validasi untuk argumen pembangun dengan `bidang` objek.

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

Anda dapat melihat bahwa `objek` perlu `ekspresi`, `properti` baik perlu `ekspresi` atau `pengenal` tergantung pada apakah ekspresi anggota `dihitung` atau tidak dan `dihitung` hanya boolean yang default ke `false`.

Jadi kita dapat membangun `MemberExpression` dengan melakukan hal berikut:

```js
t.memberExpression(
  t.identifier('object'),
  t.identifier('property')
  // `computed` is optional
);
```

Yang akan menghasilkan:

```js
object.property
```

Namun, kita mengatakan bahwa `objek` yang dibutuhkan untuk menjadi `ekspresi` jadi mengapa adalah `Identifier` berlaku?

Baik jika kita melihat definisi `pengenal` kita dapat melihat bahwa ia memiliki properti `alias` yang menyatakan bahwa juga merupakan ekspresi.

```js
aliases: ["Expression", "LVal"],
```

Jadi karena `MemberExpression` adalah jenis `ekspresi`, kita bisa mengaturnya sebagai `objek` lain `MemberExpression`:

```js
t.memberExpression(
  t.memberExpression(
    t.identifier('member'),
    t.identifier('expression')
  ),
  t.identifier('property')
)
```

Yang akan menghasilkan:

```js
member.expression.property
```

Hal ini sangat tidak mungkin bahwa Anda akan pernah mengingat metode pembangun tanda tangan untuk setiap jenis node. Jadi Anda harus mengambil beberapa waktu dan memahami bagaimana mereka dihasilkan dari definisi node.

Anda dapat menemukan semua sebenarnya [definisi di sini](https://github.com/babel/babel/tree/master/packages/babel-types/src/definitions) dan Anda dapat melihat mereka [didokumentasikan di sini](https://github.com/babel/babel/blob/master/doc/ast/spec.md)

* * *

# <a id="toc-best-practices"></a>Praktik terbaik

> Aku akan bekerja pada bagian ini selama beberapa minggu mendatang.

## <a id="toc-avoid-traversing-the-ast-as-much-as-possible"></a>Menghindari melintasi AST sebanyak mungkin

Melintasi AST mahal, dan mudah untuk sengaja melintasi AST lebih dari yang diperlukan. Ini bisa menjadi ribuan jika tidak puluhan ribu operasi tambahan.

Babel mengoptimalkan pengunjung sebanyak mungkin, penggabungan ini bersama-sama jika itu bisa untuk melakukan semuanya dalam satu traversal.

### <a id="toc-merge-visitors-whenever-possible"></a>Menggabungkan pengunjung sedapat mungkin

Saat menulis pengunjung, mungkin akan tergoda untuk memanggil `path.traverse` di beberapa tempat di mana mereka logiknya perlu.

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

### <a id="toc-do-not-traverse-when-manual-lookup-will-do"></a>Tidak melintasi ketika pencarian manual akan melakukan

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

## <a id="toc-optimizing-nested-visitors"></a>Mengoptimalkan pengunjung bertingkat

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

Namun, hal ini menciptakan baru pengunjung objek setiap kali `FunctionDeclaration()` disebut di atas, yang Babel kemudian perlu meledak dan memvalidasi setiap saat. Ini bisa menjadi mahal, sehingga lebih baik untuk mengibarkan pengunjung.

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

## <a id="toc-being-aware-of-nested-structures"></a>Being aware of nested structures

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

> ***Untuk pembaruan terbaru, ikuti [@thejameskyle](https://twitter.com/thejameskyle) di Twitter.***