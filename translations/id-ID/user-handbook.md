# Paduan Pengguna Babel

Dokumen ini mencakup semua yang ingin Anda tahu tentang menggunakan [Babel](https://babeljs.io) dan terkait tooling.

[![cc-by-4.0](https://licensebuttons.net/l/by/4.0/80x15.png)](http://creativecommons.org/licenses/by/4.0/)

Buku pedoman ini tersedia dalam bahasa lain, lihat [README](/README.md) untuk daftar lengkap.

# Daftar Isi

  * [Pengenalan](#toc-introduction)
  * [Mempersiapkan Babel](#toc-setting-up-babel) 
      * [`babel-cli`](#toc-babel-cli)
      * [Menjalankan Babel CLI dalam sebuah proyek](#toc-running-babel-cli-from-within-a-project)
      * [`babel-register`](#toc-babel-register)
      * [`babel-node`](#toc-babel-node)
      * [`babel-core`](#toc-babel-core)
  * [Mengkonfigurasi Babel](#toc-configuring-babel) 
      * [`.babelrc`](#toc-babelrc)
      * [`babel-preset-es2015`](#toc-babel-preset-es2015)
      * [`babel-preset-react`](#toc-babel-preset-react)
      * [`babel-preset-stage-x`](#toc-babel-preset-stage-x)
  * [Mengeksekusi kode yang dihasilkan Babel](#toc-executing-babel-generated-code) 
      * [`babel-polyfill`](#toc-babel-polyfill)
      * [`babel-runtime`](#toc-babel-runtime)
  * [Mengkonfigurasi Babel (lanjutan)](#toc-configuring-babel-advanced) 
      * [Menentukan plugin secara manual](#toc-manually-specifying-plugins)
      * [Pilihan plugin](#toc-plugin-options)
      * [Menyesuaikan Babel berdasarkan lingkungan](#toc-customizing-babel-based-on-environment)
      * [Membuat preset Anda sendiri](#toc-making-your-own-preset)
  * [Babel dan alat lainnya](#toc-babel-and-other-tools) 
      * [Alat analisis statis](#toc-static-analysis-tools)
      * [Linting](#toc-linting)
      * [Gaya kode](#toc-code-style)
      * [Dokumentasi](#toc-documentation)
      * [Kerangka kerja](#toc-frameworks)
      * [React](#toc-react)
      * [Teks editor dan IDE](#toc-text-editors-and-ides)
  * [Debugging Babel](#toc-debugging-babel)
  * [Dukungan Babel](#toc-babel-support) 
      * [Forum Babel](#toc-babel-forum)
      * [Chat Babel](#toc-babel-chat)
      * [Masalah Babel](#toc-babel-issues)
      * [Membuat laporan bug Babel yang mengagumkan](#toc-creating-an-awesome-babel-bug-report)

# <a id="toc-introduction"></a>Pengenalan

Babel adalah kompiler generik multi-tujuan untuk JavaScript. Dengan menggunakan Babel Anda dapat menggunakan (dan membuat) generasi JavaScript berikutnya, serta generasi alat JavaScript berikutnya.

JavaScript sebagai bahasa yang terus berkembang, dengan spesifikasi baru dan usulan-usulan yang keluar dengan fitur terbaru sepanjang waktu. Menggunakan Babel akan memungkinkan Anda untuk menggunakan berbagai fitur bertahun-tahun sebelum mereka tersedia di mana-mana.

Babel melakukan ini dengan menyusun turun kode JavaScript yang ditulis dengan standar terbaru ke versi yang akan bekerja di mana-mana hari ini. Proses ini dikenal sebagai sumber-ke-sumber kompilasi, juga dikenal sebagai transpiling.

Sebagai contoh, Babel bisa mengubah sintaks panah fungsi baru pada ES2015 dari:

```js
const square = n => n * n;
```

Menjadi:

```js
const square = function square(n) {
  return n * n;
};
```

Namun, Babel bisa melakukan jauh lebih daripada ini. Babel memiliki dukungan untuk sintaks ekstensi seperti JSX syntax untuk React dan Flow syntax dukungan untuk memeriksa tipe statis.

Lebih dari itu, semuanya di Babel hanya sebuah plugin dan siapa saja bisa menggunakan dan membuat plugin mereka sendiri yang menggunakan kekuatan penuh dari Babel untuk melakukan apa pun yang mereka inginkan.

*Bahkan lebih* dari itu, Babel dibagi menjadi beberapa modul inti yang siapa pun dapat menggunakannya untuk membangun generasi alat javascript berikutnya.

Banyak orang telah melakukan, ekosistem yang telah bermunculan di sekitar Babel besar dan sangat beragam. Seluruh buku ini aku akan membahas baik bagaimana tool Babel bekerja seperti beberapa hal yang berguna dari seluruh masyarakat.

> ***Untuk pembaruan terbaru, ikuti [@thejameskyle](https://twitter.com/thejameskyle) di Twitter.***

* * *

# <a id="toc-setting-up-babel"></a>Mempersiapkan Babel

Karena komunitas JavaScript tidak membangun satu alat, kerangka, platform, dll, Babel telah resmi integrasi untuk semua perkakas utama. Semuanya dari Gulp sampai Browserify, dari Ember sampai dengan Meteor, tidak peduli pengaturan yang anda buat disana mungkin ada integrasi resmi.

Untuk tujuan buku ini, kita hanya akan membahas cara-cara built-in menyiapkan Babel, tetapi Anda juga dapat mengunjungi interaktif [halaman setup](http://babeljs.io/docs/setup) untuk semua integrasi.

> **Catatan:** Panduan ini akan merujuk pada baris perintah perangkat seperti `node` dan `npm`. Sebelum melanjutkan lebih jauh Anda harus nyaman dengan alat-alat ini.

## <a id="toc-babel-cli"></a>`babel-cli`

Babel's CLI adalah cara sederhana untuk mengkompilasi file dengan Babel dari command line atau terminal.

Pertama mari kita menginstalnya secara global untuk mempelajari dasar-dasar.

```sh
$ npm install --global babel-cli
```

Kita dapat mengkompilasi file pertama kita seperti:

```sh
$ babel my-file.js
```

Ini akan membuang output dikompilasi langsung ke terminal Anda. Untuk menulis ke file kita akan menentukan `--out-file` atau `-o`.

```sh
$ babel example.js --out-file compiled.js
# atau
$ babel example.js -o compiled.js
```

Jika kita ingin menyusun seluruh direktori ke direktori baru kita dapat melakukannya dengan menggunakan `-out-dir` atau `-d`.

```sh
$ babel src --out-dir lib
# atau
$ babel src -d lib
```

### <a id="toc-running-babel-cli-from-within-a-project"></a>Menjalankan Babel CLI dalam sebuah proyek

Meskipun Anda *dapat* menginstal Babel CLI secara global pada mesin Anda, itu jauh lebih baik untuk menginstalnya **secara lokal** untuk setiap proyek.

Ada dua alasan utama untuk ini.

  1. Proyek-proyek yang berbeda di mesin yang sama dapat bergantung pada versi yang berbeda dari Babel yang memungkinkan Anda untuk memperbarui satu per satu waktu.
  2. Itu berarti Anda tidak memiliki ketergantungan implisit terhadap lingkungan Anda bekerja di. Membuat proyek Anda jauh lebih portabel dan mudah untuk setup.

Kita dapat menginstal Babel CLI secara lokal dengan menjalankan:

```sh
$ npm install --save-dev babel-cli
```

> **Catatan:** Karena umumnya ide yang buruk untuk menjalankan Babel global Anda mungkin ingin menghapus salinan global dengan menjalankan:
> 
> ```sh
$ npm uninstall --global babel-cli
```

Setelah itu selesai menginstal, file `package.json` Anda akan terlihat seperti ini:

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "devDependencies": {
    "babel-cli": "^6.0.0"
  }
}
```

Sekarang bukan menjalankan Babel langsung dari baris perintah kami akan memasukkan perintah kami di **npm script** yang akan menggunakan versi lokal kami.

Cukup tambahkan sebuah field `"scripts"` untuk `package.json` anda dan menempatkan perintah babel di dalam sana sebagai `membangun`.

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

Sekarang dari terminal kita kita dapat menjalankan:

```js
npm run build
```

Ini akan menjalankan Babel dengan cara yang sama seperti sebelumnya, hanya sekarang kami menggunakan salinan lokal.

## <a id="toc-babel-register"></a>`babel-register`

Metode yang paling umum berikutnya menjalankan Babel adalah melalui `babel-register`. Pilihan ini akan memungkinkan Anda untuk menjalankan Babel hanya dengan mengharuskan file, yang dapat mengintegrasikan dengan setup Anda lebih baik.

Catatan bahwa ini tidak dimaksudkan untuk penggunaan produksi. Hal ini dianggap praktik buruk untuk menggunakan kode yang mendapat disusun dengan cara ini. Hal ini jauh lebih baik untuk mengkompilasi terlebih dahulu sebelum penggelaran. Namun karya ini cukup baik untuk membangun script atau hal-hal lain yang Anda jalankan secara lokal.

Pertama mari kita membuat `index.js` file di proyek kami.

```js
console.log("Hello world!");
```

Kalau kita harus menjalankan hal ini dengan `node index.js` ini tidak dikompilasi dengan Babel. Jadi bukannya melakukan itu, kita akan setup `babel-register`.

Pertama Instal `babel-register`.

```sh
$ npm install --save-dev babel-register
```

Selanjutnya, buat `register.js` file dalam proyek dan tuliskan kode berikut ini:

```js
require("babel-register");
require("./index.js");
```

Apa yang dilakukan adalah *registers* Babel di Node modul sistem dan mulai menyusun setiap file yang `require` ' d.

Sekarang, daripada menjalankan `simpul index.js` kita dapat menggunakan `register.js` sebagai gantinya.

```sh
$ node register.js
```

> **Catatan:** Anda tidak dapat mendaftar Babel pada file yang sama yang Anda ingin mengkompilasi. Sebagai node mengeksekusi file sebelum Babel memiliki kesempatan untuk mengkompilasi.
> 
> ```js
require("babel-register");
// not compiled:
console.log("Hello world!");
```

## <a id="toc-babel-node"></a>`babel-node`

Jika Anda hanya menjalankan beberapa kode melalui `node` CLI cara termudah untuk mengintegrasikan Babel mungkin menggunakan `babel-node` CLI yang sebagian besar hanya penurunan pengganti `node` CLI.

Catatan bahwa ini tidak dimaksudkan untuk penggunaan produksi. Hal ini dianggap praktik buruk untuk menggunakan kode yang mendapat disusun dengan cara ini. Hal ini jauh lebih baik untuk mengkompilasi terlebih dahulu sebelum penggelaran. Namun karya ini cukup baik untuk membangun script atau hal-hal lain yang Anda jalankan secara lokal.

Pertama, pastikan bahwa Anda memiliki `babel-cli` diinstal.

```sh
$ npm install --save-dev babel-cli
```

> **Catatan:** Jika Anda bertanya-tanya mengapa kita menginstal ini secara lokal, silakan baca bagian [CLI Babel berjalan dari dalam sebuah proyek](#running-babel-cli--from-within-a-project) di atas.

Lalu timpa dimanapun Anda menjalankan `node` dengan `babel node`.

Jika Anda menggunakan npm `scripts` Anda dapat melakukan:

```diff
  {
    "scripts": {
-     "script-name": "node script.js"
+     "script-name": "babel-node script.js"
    }
  }
```

Sebaliknya Anda akan perlu untuk menulis path ke `babel-node` itu sendiri.

```diff
- node script.js
+ ./node_modules/.bin/babel-node script.js
```

> Tip: Anda juga dapat menggunakan [`npm-run`](https://www.npmjs.com/package/npm-run).

## <a id="toc-babel-core"></a>`babel-core`

Jika Anda perlu menggunakan Babel pemrograman untuk beberapa alasan, Anda dapat menggunakan paket `babel-core` itu sendiri.

Pertama Instal `babel-core`.

```sh
$ npm install babel-core
```

```js
var babel = require("babel-core");
```

Jika Anda memiliki serangkaian JavaScript Anda dapat mengkompilasi langsung menggunakan `babel.transform`.

```js
babel.transform("code();", options);
// => { code, map, ast }
```

Jika Anda bekerja dengan file, Anda dapat menggunakan baik api tak sinkron:

```js
babel.transformFile("filename.js", options, function(err, result) {
  result; // => { code, map, ast }
});
```

Atau api sinkron:

```js
babel.transformFileSync("filename.js", options);
// => { code, map, ast }
```

Jika Anda sudah memiliki AST Babel untuk alasan apa pun Anda mungkin mengubah dari AST langsung.

```js
babel.transformFromAst(ast, code, options);
// => { code, map, ast }
```

Untuk semua metode di atas, `pilihan` mengacu pada http://babeljs.io/docs/usage/options/.

* * *

# <a id="toc-configuring-babel"></a>Mengkonfigurasi Babel

Anda mungkin telah memperhatikan oleh sekarang bahwa menjalankan Babel sendiri tampaknya tidak melakukan apa-apa selain menyalin file JavaScript dari satu lokasi lain.

Hal ini karena kita belum diberitahu Babel untuk melakukan apa-apa lagi.

> Karena Babel kompiler tujuan umum yang akan digunakan dalam berbagai cara yang berbeda, tidak melakukan apa pun secara default. Anda harus secara eksplisit memberitahu Babel apa yang harus ia lakukan.

Anda dapat memberikan petunjuk Babel tentang apa yang harus dilakukan dengan menginstal **plugin** atau **presets** (kelompok plugin).

## <a id="toc-babelrc"></a>`.babelrc`

Sebelum kita mulai menceritakan Babel apa yang harus dilakukan. Kita perlu membuat file konfigurasi. Yang perlu Anda lakukan adalah membuat `.babelrc` file akar dari proyek Anda. Memulai dengan itu seperti ini:

```js
{
  "presets": [],
  "plugins": []
}
```

File ini adalah bagaimana Anda mengkonfigurasi Babel untuk melakukan apa yang Anda inginkan.

> **Catatan:** Sementara Anda juga dapat melewati pilihan untuk Babel dengan cara lain `.babelrc` file Konvensi dan cara terbaik.

## <a id="toc-babel-preset-es2015"></a>`babel-preset-es2015`

Mari kita mulai dengan mengatakan Babel untuk mengkompilasi ES2015 (versi terbaru JavaScript standar, juga dikenal sebagai ES6) untuk ES5 (versi tersedia dalam kebanyakan lingkungan JavaScript hari).

Kami akan melakukan hal ini dengan menginstal "es2015" Babel preset:

```sh
$ npm install --save-dev babel-preset-es2015
```

Selanjutnya kita akan memodifikasi kami `.babelrc` untuk menyertakan pra-atur itu.

```diff
  {
    "presets": [
+     "es2015"
    ],
    "plugins": []
  }
```

## <a id="toc-babel-preset-react"></a>`babel-preset-react`

Menyiapkan React sama mudahnya. Hanya menginstal preset:

```sh
$ npm install --save-dev babel-preset-react
```

Kemudian tambahkan preset untuk `.babelrc` file:

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

JavaScript juga memiliki beberapa proposal yang membuat jalan mereka ke dalam standar melalui TC39 (Komite teknis di balik standar ECMAScript) proses.

Proses ini rusak melalui proses tahap 5 (0-4). Proposal mendapatkan traksi yang lebih dan lebih mungkin untuk diterima ke dalam standar mereka melanjutkan melalui berbagai tahap, akhirnya diterima menjadi standar pada tahap 4.

Ini dibundel di babel sebagai 4 preset yang berbeda:

  * `babel-preset-stage-0`
  * `babel-preset-stage-1`
  * `babel-preset-stage-2`
  * `babel-preset-stage-3`

> Perhatikan bahwa ada tidak ada tahap-4 preset seperti itu hanya `es2015` preset di atas.

Masing-masing preset ini memerlukan preset untuk tahap. yaitu `babel-preset-stage-1` mengharuskan `babel-preset-stage-2` yang memerlukan `babel-preset-stage-3`.

Hanya menginstal tahap Anda tertarik untuk menggunakan:

```sh
$ npm install --save-dev babel-preset-stage-2
```

Kemudian Anda dapat menambahkannya ke konfigurasi `.babelrc`.

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

# <a id="toc-executing-babel-generated-code"></a>Mengeksekusi kode yang dihasilkan Babel

Jadi Anda telah menyusun kode Anda dengan Babel, tetapi ini bukanlah akhir dari cerita.

## <a id="toc-babel-polyfill"></a>`babel-polyfill`

Sintaks JavaScript futuristik hampir semua dapat dikompail dengan Babel, tetapi hal yang sama tidak berlaku untuk api.

Sebagai contoh, kode berikut memiliki fungsi panah yang perlu dikompilasi:

```js
function addAll() {
  return Array.from(arguments).reduce((a, b) => a + b);
}
```

Yang berubah menjadi ini:

```js
function addAll() {
  return Array.from(arguments).reduce(function(a, b) {
    return a + b;
  });
}
```

Namun, ini masih tidak akan bekerja di mana-mana karena `Array.from` tidak ada di setiap lingkungan JavaScript.

    Uncaught TypeError: Array.from is not a function
    

Untuk mengatasi masalah ini, kami menggunakan sesuatu yang disebut [Polyfill](https://remysharp.com/2010/10/08/what-is-a-polyfill). Sederhananya, polyfill adalah bagian dari kode yang mereplikasi api asli yang tidak ada di runtime saat ini. Memungkinkan Anda untuk menggunakan api seperti `Array.from` sebelum mereka tersedia.

Babel menggunakan baik [core-js](https://github.com/zloirock/core-js) sebagai polyfill yang, bersama dengan disesuaikan [regenerator](https://github.com/facebook/regenerator) runtime untuk mendapatkan generator dan fungsi async bekerja.

Untuk menyertakan Babel polyfill, pertama menginstalnya dengan npm:

```sh
$ npm install --save babel-polyfill
```

Kemudian hanya menyertakan polyfill di bagian atas setiap file yang membutuhkan itu:

```js
import "babel-polyfill";
```

## <a id="toc-babel-runtime"></a>`babel-runtime`

Untuk menerapkan rincian ECMAScript spesifikasi, Babel akan menggunakan metode "Pembantu" untuk menjaga kode bersih.

Karena ini dapat mendapatkan cukup panjang, dan mereka ditambahkan ke atas setiap file, Anda dapat memindahkan mereka ke dalam satu "runtime" yang akan diperlukan.

Mulai dengan menginstal `babel-plugin-transform-runtime` dan `babel-runtime`:

```sh
$ npm install --save-dev babel-plugin-transform-runtime
$ npm install --save babel-runtime
```

Kemudian update Anda `.babelrc`:

```diff
  {
    "plugins": [
+     "transform-runtime",
      "transform-es2015-classes"
    ]
  }
```

Sekarang Babel akan mengkompilasi kode seperti berikut:

```js
class Foo {
  method() {}
}
```

Ke ini:

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

Daripada menempatkan penolong `_classCallCheck` dan `_createClass` dalam setiap satu file di mana mereka dibutuhkan.

* * *

# <a id="toc-configuring-babel-advanced"></a>Mengkonfigurasi Babel (lanjutan)

Kebanyakan orang bisa mendapatkan dengan menggunakan Babel dengan hanya preset bawaan, tetapi Babel memperlihatkan banyak kekuasaan berbulir lebih halus dari itu.

## <a id="toc-manually-specifying-plugins"></a>Menentukan plugin secara manual

Babel preset cukup koleksi pra-konfigurasi plugin, jika Anda ingin melakukan sesuatu yang berbeda Anda secara manual menentukan plugin. Ini bekerja hampir sama persis dengan cara yang sama sebagai preset.

Pertama Instal plugin:

```sh
$ npm install --save-dev babel-plugin-transform-es2015-classes
```

Kemudian tambahkan bidang `plugin` untuk Anda `.babelrc`.

```diff
  {
+   "plugins": [
+     "transform-es2015-classes"
+   ]
  }
```

Ini memberi Anda jauh lebih halus kendali atas mentransformasi tepat yang Anda menjalankan.

Untuk daftar lengkap plugin resmi Lihat [halaman plugin Babel](http://babeljs.io/docs/plugins/).

Juga lihat di semua plugin yang telah [dibangun oleh masyarakat](https://www.npmjs.com/search?q=babel-plugin). Jika Anda ingin belajar bagaimana menulis plugin Anda sendiri membaca [Babel Plugin Handbook](plugin-handbook.md).

## <a id="toc-plugin-options"></a>Pilihan plugin

Banyak plugin juga memiliki pilihan untuk mengkonfigurasi mereka untuk berperilaku berbeda. Sebagai contoh, banyak mengubah memiliki modus "longgar" yang tetes beberapa perilaku spec dalam mendukung lebih sederhana dan lebih performant dihasilkan kode.

Untuk menambahkan pilihan ke sebuah plugin, cukup membuat perubahan berikut:

```diff
  {
    "plugins": [
-     "transform-es2015-classes"
+     ["transform-es2015-classes", { "loose": true }]
    ]
  }
```

> Aku akan bekerja pada update ke dokumentasi plugin untuk detail setiap pilihan dalam beberapa minggu mendatang. [Ikuti saya untuk update](https://twitter.com/thejameskyle).

## <a id="toc-customizing-babel-based-on-environment"></a>Menyesuaikan Babel berdasarkan lingkungan

Babel plugin memecahkan berbagai tugas. Banyak dari mereka adalah alat-alat pengembangan yang dapat membantu Anda debug kode Anda atau mengintegrasikan dengan alat. Ada juga banyak plugin yang dimaksudkan untuk mengoptimalkan kode Anda dalam produksi.

Untuk alasan ini, itu umum untuk menginginkan konfigurasi Babel yang didasarkan pada lingkungan. Anda dapat melakukannya dengan mudah dengan file `.babelrc` Anda.

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

Babel akan memungkinkan konfigurasi dalam `env` berdasarkan lingkungan saat ini.

Lingkungan saat ini akan menggunakan `process.env.BABEL_ENV`. Ketika `BABEL_ENV` tidak tersedia, itu akan mundur ke `NODE_ENV`, dan jika itu tidak tersedia, itu akan default untuk `"pembangunan"`.

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

> **Catatan:** `[COMMAND]` adalah apa pun yang Anda gunakan untuk menjalankan Babel (ie. `Babel`, `babel-node`, atau mungkin hanya `node` jika Anda menggunakan hook daftar).
> 
> **Tip:** Jika Anda ingin perintah Anda untuk bekerja di platform unix dan windows kemudian menggunakan [`salib-env`](https://www.npmjs.com/package/cross-env).

## <a id="toc-making-your-own-preset"></a>Membuat preset Anda sendiri

Secara manual menentukan plugin? Pilihan plugin? Pengaturan berbasis lingkungan? Semua konfigurasi ini mungkin tampak seperti satu ton pengulangan untuk semua proyek Anda.

Untuk alasan ini, kita mendorong komunitas untuk menciptakan preset mereka sendiri. Ini bisa preset untuk tertentu [node Versi](https://github.com/leebenson/babel-preset-node5) Anda menjalankan, atau mungkin preset untuk [seluruh](https://github.com/cloudflare/babel-preset-cf) [perusahaan](https://github.com/airbnb/babel-preset-airbnb).

Sangat mudah untuk menciptakan preset. Katakanlah Anda memiliki file `.babelrc` ini:

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

Semua yang perlu Anda lakukan adalah membuat sebuah proyek baru yang mengikuti konvensi penamaan `babel - preset-*` (silahkan menjadi bertanggung jawab dengan namespace ini), dan membuat dua file.

Pertama, membuat file `package.json` baru dengan diperlukan `dependensi` Atur.

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

Kemudian membuat file `index.js` yang ekspor isi dari file `.babelrc` Anda, menggantikan plugin pra-atur string dengan `memerlukan` panggilan.

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

Kemudian hanya menerbitkan ini untuk npm dan Anda dapat menggunakannya seperti Anda akan preset apapun.

* * *

# <a id="toc-babel-and-other-tools"></a>Babel dan alat lainnya

Babel adalah cukup lurus ke depan untuk setup sekali Anda mendapatkan menguasainya, tetapi bisa agak sulit menavigasi cara mengatur dengan alat-alat lain. Namun, kami mencoba untuk bekerja sama dengan proyek-proyek lain untuk membuat pengalaman semudah mungkin.

## <a id="toc-static-analysis-tools"></a>Alat analisis statis

Standar baru membawa banyak sintaks baru ke bahasa dan alat analisis statis hanya mulai mengambil keuntungan dari itu.

### <a id="toc-linting"></a>Linting

Salah satu alat yang paling populer untuk linting [ESLint](http://eslint.org), karena ini kami menjaga integrasi resmi [`babel-eslint`](https://github.com/babel/babel-eslint).

Pertama Instal `eslint` dan `babel-eslint`.

```sh
$ npm install --save-dev eslint babel-eslint
```

Selanjutnya menciptakan atau menggunakan file `.eslintrc` yang sudah ada dalam proyek Anda dan mengatur `parser` sebagai `babel-eslint`.

```diff
  {
+   "parser": "babel-eslint",
    "rules": {
      ...
    }
  }
```

Sekarang tambahkan tugas `serat` skrip `package.json` npm:

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

Kemudian hanya menjalankan tugas dan Anda akan semua setup.

```sh
$ npm run lint
```

Untuk informasi lebih lanjut lihat dokumentasi [`babel-eslint`](https://github.com/babel/babel-eslint) atau [`eslint`](http://eslint.org).

### <a id="toc-code-style"></a>Gaya kode

JSCS adalah alat yang sangat populer untuk mengambil linting langkah lebih jauh ke dalam memeriksa gaya kode itu sendiri. Pengelola inti Babel dan JSCS proyek ([@hzoo](https://github.com/hzoo)) mempertahankan integrasi resmi dengan JSCS.

Bahkan lebih baik, integrasi ini sekarang hidup dalam JSCS sendiri di bawah `--esnext` pilihan. Jadi mengintegrasikan Babel semudah:

    $ jscs . --esnext
    

Dari cli, atau menambahkan opsi `esnext` ke `.jscsrc` file.

```diff
  {
    "preset": "airbnb",
+   "esnext": true
  }
```

Untuk informasi lebih lanjut lihat dokumentasi [`babel-jscs`](https://github.com/jscs-dev/babel-jscs) atau [`jscs`](http://jscs.info).

<!--
### Code Coverage

> [WIP]
-->

### <a id="toc-documentation"></a>Dokumentasi

Menggunakan Babel, ES2015, dan aliran Anda dapat menyimpulkan banyak tentang kode Anda. Menggunakan [documentation.js](http://documentation.js.org) Anda dapat menghasilkan rinci dokumentasi API sangat mudah.

Documentation.js menggunakan Babel di belakang layar untuk mendukung semua sintaks terbaru termasuk aliran anotasi untuk menyatakan jenis dalam kode Anda.

## <a id="toc-frameworks"></a>Kerangka kerja

Semua kerangka JavaScript utama sekarang berfokus pada penyelarasan api mereka di sekitar masa depan bahasa. Karena ini, ada banyak pekerjaan yang masuk ke perkakas.

Kerangka kerja memiliki kesempatan tidak hanya untuk menggunakan Babel tetapi untuk memperluas cara-cara yang meningkatkan pengalaman pengguna mereka.

### <a id="toc-react"></a>React

Bereaksi telah berubah secara dramatis API untuk menyelaraskan dengan kelas ES2015 ([Baca tentang API yang diperbarui di sini](https://babeljs.io/blog/2015/06/07/react-on-es6-plus)). Lebih jauh, bereaksi bergantung pada Babel untuk mengkompilasi sintaks BEJ, mencela itu sendiri kustom tooling mendukung Babel. Anda dapat memulai dengan menyiapkan paket `babel-preset-react` mengikuti [petunjuk di atas](#babel-preset-react).

Masyarakat React mengambil Babel dan berlari dengan itu. Sekarang ada sejumlah mentransformasi [dibangun oleh komunitas](https://www.npmjs.com/search?q=babel-plugin+react).

Terutama [`babel-plugin-react-transform`](https://github.com/gaearon/babel-plugin-react-transform) plugin yang dikombinasikan dengan jumlah [tertentu bereaksi mengubah](https://github.com/gaearon/babel-plugin-react-transform#transforms) dapat mengaktifkan hal-hal seperti *panas modul reload* dan utilitas debugging lain.

<!--
### Ember

> [WIP]
-->

## <a id="toc-text-editors-and-ides"></a>Teks editor dan ide

Memperkenalkan ES2015, BEJ dan aliran sintaks dengan Babel dapat membantu, tapi jika editor teks Anda tidak mendukung itu maka dapat menjadi pengalaman yang benar-benar buruk. Untuk alasan ini, Anda akan ingin untuk men-setup editor teks atau IDE Anda dengan Babel plugin.

  * [Sublime Text](https://github.com/babel/babel-sublime)
  * [Atom](https://atom.io/packages/language-babel)
  * [Vim](https://github.com/jbgutierrez/vim-babel)
  * [WebStorm](https://babeljs.io/docs/setup/#webstorm)

<!--
# Debugging Babel

> [WIP]
-->

* * *

# <a id="toc-babel-support"></a>Dukungan Babel

Babel memiliki komunitas yang sangat besar dan dengan cepat berkembang, seperti yang kita tumbuh kami ingin memastikan bahwa orang memiliki semua sumber daya yang mereka butuhkan untuk menjadi sukses. Jadi kami menyediakan sejumlah saluran yang berbeda untuk mendapatkan dukungan.

Ingat bahwa seluruh komunitas ini, kami melaksanakan [Kode etik](https://github.com/babel/babel/blob/master/CODE_OF_CONDUCT.md). Jika Anda melanggar kode etik, tindakan akan diambil. Jadi silakan membacanya dan menjadi sadar akan hal itu ketika berinteraksi dengan orang lain.

Kami juga mencari untuk tumbuh Komunitas mandiri, untuk orang yang bertahan dan mendukung orang lain. Jika Anda menemukan seseorang mengajukan pertanyaan Anda tahu jawaban, mengambil beberapa menit dan membantu mereka keluar. Cobalah yang terbaik untuk jenis dan pengertian ketika melakukannya.

## <a id="toc-babel-forum"></a>Forum Babel

[Wacana](http://www.discourse.org) telah menyediakan software forum gratis untuk kita dengan versi hosted (dan kita mencintai mereka untuk itu!). Jika Forum hal Anda silahkan mampir [discuss.babeljs.io](https://discuss.babeljs.io).

## <a id="toc-babel-chat"></a>Chat Babel

Semua orang menyukai [kendur](https://slack.com). Jika Anda sedang mencari dukungan langsung dari masyarakat kemudian datang chatting dengan kami di [slack.babeljs.io](https://slack.babeljs.io).

<!--
## Babel Stack Overflow

> [WIP]
-->

## <a id="toc-babel-issues"></a>Masalah Babel

Babel menggunakan pelacak isu mengagumkan yang disediakan oleh [Phabricator](http://phabricator.org) platform pengembangan perangkat lunak open source yang membuat isu-isu GitHub mimpi buruk di masa lalu.

Phabricator Babel's tersedia di [phabricator.babeljs.io](https://phabricator.babeljs.io). Anda dapat melihat semua masalah terbuka dan tertutup pada [maniphest](https://phabricator.babeljs.io/maniphest/).

Jika Anda ingin membuka masalah baru:

  * [Mencari masalah yang ada](https://phabricator.babeljs.io/maniphest/query/advanced/)
  * [Login](https://phabricator.babeljs.io/auth/start/) atau [membuat account](https://phabricator.babeljs.io/auth/register/) (Anda juga dapat login menggunakan GitHub, Facebook, Twitter, Google, dll.)
  * [Membuat laporan bug](https://phabricator.babeljs.io/maniphest/task/create/?projects=PHID-PROJ-2ufzspoyuk4udiwfnzls#R) atau [permintaan fitur baru](https://phabricator.babeljs.io/maniphest/task/create/?projects=PHID-PROJ-dfaevtocl5zgjtstjijd#R)

### <a id="toc-creating-an-awesome-babel-bug-report"></a>Membuat laporan bug Babel yang mengagumkan

Babel masalah kadang-kadang bisa sangat sulit untuk debug jarak jauh, jadi kita perlu semua bantuan yang bisa kita dapatkan. Menghabiskan beberapa menit menyusun laporan bug yang benar-benar baik dapat membantu mendapatkan masalah Anda terpecahkan secara signifikan lebih cepat.

Pertama, coba mengisolasi masalah Anda. Hal ini sangat tidak mungkin bahwa setiap bagian dari Anda setup memberikan kontribusi kepada masalah. Jika masalah Anda sepotong masukan kode, mencoba menghapus kode sebanyak mungkin yang masih menyebabkan masalah.

> [WIP]

* * *

> ***Untuk pembaruan terbaru, ikuti [@thejameskyle](https://twitter.com/thejameskyle) di Twitter.***