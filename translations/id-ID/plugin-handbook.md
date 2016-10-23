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
      * [Jalur](#toc-paths) 
          * [Jalan pengunjung](#toc-paths-in-visitors)
      * [Keadaan](#toc-state)
      * [Cakupan](#toc-scopes) 
          * [Binding](#toc-bindings)
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
  * [Operasi Transformasi](#toc-transformation-operations) 
      * [Pengunjungan](#toc-visiting)
      * [Mendapatkan path dari Sub-Node](#toc-get-the-path-of-a-sub-node)
      * [Memeriksa tipe dari sebuah node](#toc-check-if-a-node-is-a-certain-type)
      * [Memeriksa apakah sebuah identifier direferensikan](#toc-check-if-an-identifier-is-referenced)
      * [Manipulasi](#toc-manipulation)
      * [Mengganti sebuah node](#toc-replacing-a-node)
      * [Mengganti sebuah node dengan banyak node](#toc-replacing-a-node-with-multiple-nodes)
      * [Mengganti sebuah node dengan source code](#toc-replacing-a-node-with-a-source-string)
      * [Menambahkan node yang berdekatan](#toc-inserting-a-sibling-node)
      * [Menghapus sebuah node](#toc-removing-a-node)
      * [Mengganti parent dari sebuah node](#toc-replacing-a-parent)
      * [Menghapus parent dari sebuah node](#toc-removing-a-parent)
      * [Cakupan](#toc-scope)
      * [Memeriksa apakah variabel lokal terbatasi](#toc-checking-if-a-local-variable-is-bound)
      * [Menghasilkan UID](#toc-generating-a-uid)
      * [Menambahkan deklarasi variable ke cakupan parent](#toc-pushing-a-variable-declaration-to-a-parent-scope)
      * [Mengubah nama dari binding dan referensinya](#toc-rename-a-binding-and-its-references)
  * [Plugin: Opsi](#toc-plugin-options)
  * [Bangunan node](#toc-building-nodes)
  * [Praktik terbaik](#toc-best-practices) 
      * [Menghindari melintasi AST sebanyak mungkin](#toc-avoid-traversing-the-ast-as-much-as-possible)
      * [Menggabungkan pengunjung sedapat mungkin](#toc-merge-visitors-whenever-possible)
      * [Tidak melintasi ketika pencarian manual akan melakukan](#toc-do-not-traverse-when-manual-lookup-will-do)
      * [Mengoptimalkan pengunjung bertingkat](#toc-optimizing-nested-visitors)
      * [Berhati-hati terhadap struktur bertingkat](#toc-being-aware-of-nested-structures)

# <a id="toc-introduction"></a>Pengenalan

Babel adalah compiler JavaScript umum yang multifungsi. Selebihnya, Babel adalah kumpulan modul yang dapat digunakan untuk beberapa bentuk analisis statik.

> Analisis statik adalah proses menganalisa kode tanpa mengeksekusinya. (Analisis kode selama mengeksekusi biasanya disebut analisis dinamik). Tujuan dari analisis statik itu beragam. Itu dapat digunakan untuk linting, compiling, higlight kode, transformasi kode, optimisasi, minifikasi, dan masih banyak lagi.

Anda dapat menggunakan Babel untuk membangun beberapa tipe perkakas yang dapat membantu anda semakin produktif dan menulis program lebih baik.

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

> Catatan: Beberapa properti telah dihapus untuk disederhanakan.

Masing-masing dikenal sebagai **Node**. AST dapat terdiri dari satu node, atau ratusan jika tidak ribuan node. Bersama-sama mereka mampu menerangkan sintaks dari sebuah program yang dapat digunakan untuk analisis statis.

Setiap Node memiliki antarmuka berikut:

```typescript
interface Node {
  type: string;
}
```

Field `type` adalah sebuah string yang mewakili tipe objek Node (seperti. `"FunctionDeclaration"`, `"Identifier"`, or `"BinaryExpression"`). Setiap jenis Node mendefinisikan tambahan set properti yang menggambarkan tipe node tertentu.

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

Tahap [kode generasi](https://en.wikipedia.org/wiki/Code_generation_(compiler)) mengambil AST akhir dan mengubahnya kembali ke serangkaian kode, juga menciptakan [sumber peta](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/).

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

Panggilan ini adalah semua node **Masukkan**. Namun ada juga kemungkinan memanggil metode pengunjung ketika pada **keluar**.

Bayangkan kita memiliki struktur ini:

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

Seperti kita melintasi turun setiap cabang pohon kita akhirnya memukul mati berakhir di mana kita perlu untuk melintasi cadangan pohon untuk mendapatkan ke node berikutnya. Turun pohon kita **Masukkan** setiap node, maka akan kembali kita **keluar** setiap node.

Mari kita *berjalan* melalui apa proses ini tampak seperti untuk pohon di atas.

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

Jadi ketika membuat pengunjung Anda memiliki dua kesempatan untuk mengunjungi sebuah node.

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

### <a id="toc-paths"></a>Jalur

AST umumnya memiliki banyak node, tapi bagaimana node berhubungan satu sama lain? Kita bisa memiliki satu objek bisa berubah raksasa yang Anda memanipulasi dan memiliki akses penuh ke, atau kita dapat menyederhanakan ini dengan **jalan**.

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

#### <a id="toc-paths-in-visitors"></a>Jalan pengunjung

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

### <a id="toc-state"></a>Keadaan

Keadaan adalah musuh AST transformasi. Negara akan menggigit Anda lagi dan lagi dan Anda asumsi tentang keadaan akan hampir selalu terbukti salah oleh beberapa sintaks yang tidak Anda pertimbangkan.

Ambil kode berikut:

```js
function square(n) {
  return n * n;
}
```

Ayo menulis pengunjung hacky cepat yang akan mengubah `n` `x`.

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

Ini mungkin bekerja untuk kode di atas, tetapi kita dapat dengan mudah pecah bahwa dengan melakukan hal ini:

```js
function square(n) {
  return n * n;
}
n;
```

Cara yang lebih baik untuk menangani hal ini adalah rekursi. Jadi mari kita membuat seperti film Christopher Nolan dan menempatkan pengunjung dalam pengunjung.

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

### <a id="toc-scopes"></a>Cakupan

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

#### <a id="toc-bindings"></a>Binding

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

## <a id="toc-babylon"></a>[`babylon`](https://github.com/babel/babylon)

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

To see a full list of plugins, see the [Babylon README](https://github.com/babel/babylon/blob/master/README.md#plugins).

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

Babel Template adalah modul kecil tapi sangat berguna yang lain. Hal ini memungkinkan Anda untuk menulis string kode dengan pengganti yang Anda dapat menggunakan bukan secara manual membangun AST besar. Dalam ilmu komputer, kemampuan ini disebut quasiquotes.

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

# <a id="toc-transformation-operations"></a>Operasi Transformasi

## <a id="toc-visiting"></a>Pengunjungan

### <a id="toc-get-the-path-of-a-sub-node"></a>Mendapatkan path dari Sub-Node

Untuk mengakses properti dari node AST, biasanya Anda mengakses node-nya terlebih dahulu dan kemudian propertinya. `path.node.Property`

```js
BinaryExpression(path) {
  path.node.left;
}
```

Apabila kamu hendak mengakses path dari properti tersebut, gunakan method `get` dari path, lalu gunakan sebagai string di properti tersebut.

```js
BinaryExpression(path) {
  path.get('left');
}
Program(path) {
  path.get('body[0]');
}
```

### <a id="toc-check-if-a-node-is-a-certain-type"></a>Memeriksa tipe dari sebuah node

Apabila kamu ingin mengetahui tipe dari sebuah node, cara yang dianjurkan adalah sebagai berikut:

```js
BinaryExpression(path) {
  if (t.isIdentifier(path.node.left)) {
    // ...
  }
}
```

Kamu juga dapat melakukan pemeriksaan singkat pada properti-properti dari node tersebut:

```js
BinaryExpression(path) {
  if (t.isIdentifier(path.node.left, { name: "n" })) {
    // ...
  }
}
```

Hal ini secara fungsional juga sama dengan:

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

### <a id="toc-check-if-an-identifier-is-referenced"></a>Memeriksa apakah sebuah identifier direferensikan

```js
Identifier(path) {
  if (path.isReferencedIdentifier()) {
    // ...
  }
}
```

Atau dengan cara lain:

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

### <a id="toc-replacing-a-node-with-multiple-nodes"></a>Mengganti sebuah node dengan banyak node

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

### <a id="toc-replacing-a-node-with-a-source-string"></a>Mengganti sebuah node dengan source code

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

### <a id="toc-inserting-a-sibling-node"></a>Menambahkan node yang berdekatan

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

### <a id="toc-replacing-a-parent"></a>Mengganti parent dari sebuah node

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

### <a id="toc-removing-a-parent"></a>Menghapus parent dari sebuah node

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

## <a id="toc-scope"></a>Ruang lingkup

### <a id="toc-checking-if-a-local-variable-is-bound"></a>Memeriksa apakah variabel lokal terbatasi

```js
FunctionDeclaration(path) {
  if (path.scope.hasBinding("n")) {
    // ...
  }
}
```

Dengan begini, Babel akan memeriksa binding tersebut dengan cakupan yang semakin tinggi.

You can also check if a scope has its **own** binding:

```js
FunctionDeclaration(path) {
  if (path.scope.hasOwnBinding("n")) {
    // ...
  }
}
```

### <a id="toc-generating-a-uid"></a>Menghasilkan UID

Fungsi berikut akan menghasilkan sebuah pengenal yang tidak akan sama dengan variabel lokal apapun yang telah didefinisikan.

```js
FunctionDeclaration(path) {
  path.scope.generateUidIdentifier("uid");
  // Node { type: "Identifier", name: "_uid" }
  path.scope.generateUidIdentifier("uid");
  // Node { type: "Identifier", name: "_uid2" }
}
```

### <a id="toc-pushing-a-variable-declaration-to-a-parent-scope"></a>Menambahkan deklarasi variable ke cakupan parent

Terkadang kamu hanya ingin menambahkan sebuah `VariableDeclaration` sehingga kamu dapat memberi nilai pada variabel tersebut.

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

### <a id="toc-rename-a-binding-and-its-references"></a>Mengubah nama dari binding dan referensinya

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

Atau kamu dapat mengganti nama sebuah binding dengan tanda pengenal unik yang telah dihasilkan:

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

# <a id="toc-plugin-options"></a>Plugin: Opsi

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

# <a id="toc-building-nodes"></a>Bangunan node

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

> Perhatikan bahwa kadang-kadang ada sifat lebih yang Anda dapat menyesuaikan pada node dari array `pembangun` berisi. Hal ini untuk menjaga builder dari memiliki terlalu banyak argumen. Dalam kasus ini Anda perlu untuk mengatur properti secara manual. Contoh ini adalah [`ClassMethod`](https://github.com/babel/babel/blob/bbd14f88c4eea88fa584dd877759dd6b900bf35e/packages/babel-types/src/definitions/es2015.js#L238-L276).

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

# <a id="toc-best-practices"></a>Praktik terbaik

> Aku akan bekerja pada bagian ini selama beberapa minggu mendatang.

## <a id="toc-avoid-traversing-the-ast-as-much-as-possible"></a>Menghindari melintasi AST sebanyak mungkin

Traversing the AST is expensive, and it's easy to accidentally traverse the AST more than necessary. This could be thousands if not tens of thousands of extra operations.

Babel optimizes this as much as possible, merging visitors together if it can in order to do everything in a single traversal.

### <a id="toc-merge-visitors-whenever-possible"></a>Menggabungkan pengunjung sedapat mungkin

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

### <a id="toc-do-not-traverse-when-manual-lookup-will-do"></a>Tidak melintasi ketika pencarian manual akan melakukan

It may also be tempting to call `path.traverse` when looking for a particular node type.

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

## <a id="toc-optimizing-nested-visitors"></a>Mengoptimalkan pengunjung bertingkat

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

However, this creates a new visitor object everytime `FunctionDeclaration()` is called above, which Babel then needs to explode and validate every single time. This can be costly, so it is better to hoist the visitor up.

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

## <a id="toc-being-aware-of-nested-structures"></a>Berhati-hati terhadap struktur bertingkat

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

> ***Untuk pembaruan terbaru, ikuti [@thejameskyle](https://twitter.com/thejameskyle) di Twitter.***