# Babel Kullanıcı Elkitabı

Bu belge [Babel](https://babeljs.io) ve ilgili araçları ile ilgili bilmek isteyeceğiniz herşeyi kapsar.

[![cc-by-4.0](https://licensebuttons.net/l/by/4.0/80x15.png)](http://creativecommons.org/licenses/by/4.0/)

Bu kitabın diğer dillere tercümeside mevcuttur.Tüm liste için [README](/README.md)'ye bakın.

# İçindekiler

  * [Giriş](#toc-introduction)
  * [Babel Kurulumu](#toc-setting-up-babel) 
      * [`babel-cli`](#toc-babel-cli)
      * [Proje içinde Babel CLI çalıştırmak](#toc-running-babel-cli-from-within-a-project)
      * [`babel-register`](#toc-babel-register)
      * [`babel-node`](#toc-babel-node)
      * [`babel-core`](#toc-babel-core)
  * [Babel Yapılandırması](#toc-configuring-babel) 
      * [`.babelrc`](#toc-babelrc)
      * [`babel-preset-es2015`](#toc-babel-preset-es2015)
      * [`babel-preset-react`](#toc-babel-preset-react)
      * [`babel-preset-stage-x`](#toc-babel-preset-stage-x)
  * [Üretilen kodu çalıştırma](#toc-executing-babel-generated-code) 
      * [`babel-polyfill`](#toc-babel-polyfill)
      * [`babel-runtime`](#toc-babel-runtime)
  * [Babel (Gelişmiş) yapılandırma](#toc-configuring-babel-advanced) 
      * [Eklentileri el ile belirtme](#toc-manually-specifying-plugins)
      * [Eklenti seçenekleri](#toc-plugin-options)
      * [Ortama göre Babel'i özelleştirme](#toc-customizing-babel-based-on-environment)
      * [Kendi önceden belirlenmiş ayarlarınızı yapmak](#toc-making-your-own-preset)
  * [Babil ve diğer araçlar](#toc-babel-and-other-tools) 
      * [Statik analiz araçları](#toc-static-analysis-tools)
      * [Linting](#toc-linting)
      * [Kod stili](#toc-code-style)
      * [Dökümantasyon](#toc-documentation)
      * [Frameworkler](#toc-frameworks)
      * [React](#toc-react)
      * [Metin düzenleyicileri ve IDE'ler](#toc-text-editors-and-ides)
  * [Babel destek](#toc-babel-support) 
      * [Babel Forum](#toc-babel-forum)
      * [Babel sohbet](#toc-babel-chat)
      * [Babel sorunları](#toc-babel-issues)
      * [Harika bir Babil hata raporu oluşturma](#toc-creating-an-awesome-babel-bug-report)

# <a id="toc-introduction"></a>Giriş

Babel genel -jenerik- (ve) çok amaçlı Javascript derleyicisidir. Babel kullanarak gelecek nesil Javascript -dilinin- yanısıra gelecek nesil Javascript araçlarını kullanabilir (ve oluşturabilirsiniz).

Bir dil olarak Javascript, yeni bildirge ve önerilerler ile ortaya çıkan yeni özellikleriyle sürekli gelişmektedir. Babel kullanmak bu yeni özelliklerden çoğunun yayılmasından yıllar önce kullanmanıza imkan verir.

Babel bunu yazılmış Javascript kodunu bugün her yerde çalışabilecek geçerli standart versiyona dayalı olarak derleyerek yapar. Bu işlem kaynaktan kaynağa derleme (source-to-source compiling) veya başka bir ismiyle transpiling olarak adlandırılır.

Örneğin Babel yeni ES2015 küçüktür (işaretli) aşağıdaki fonksiyonu:

```js
const square = n => n * n;
```

aşağıdaki fonksiyona dönüştürür:

```js
const square = function square(n) {
  return n * n;
};
```

Ancak, Babel bundan daha fazlasını yapabilir ki Babel'in React için JSX sözdizimi ve static tip kontrolü için Flow sözdizimi desteği gibi sözdizimi uzatı - syntax extension- desteği mevcuttur.

Buna ek olarak , Babel içindeki her şey sadece eklentidir - plugin- ve herkes -Babel'in- dışına çıkabilir ve istedikleri ne varsa yapabilmek için Babel'in tüm gücünü ikullanarak kendi eklentilerini yazabilirler.

Daha da fazlası, herkesin yeni bir javascript aracı -javascript tooling- hazırlayabilmesi için Babel bir çok çekirdek modüllere ayrılmıştır.

Birçok kişinin yaptıklarıyla - katkılarıyla - , Babel etrafında büyük ve çeşitli bir ekosistem -gelişip- çoğalmaktadır. Bu el kitabı -handbook- boyunca , Babel'in yerleşik (built-in) araçlarının nasıl çalıştığının yanısıra topluluk tarafından -keşfedilen- kullanışlı özellikleri de ele alacağız.

> ***Gelecek güncellemeler için [@thejameskyle](https://twitter.com/thejameskyle)'i Twitter'dan takip edin.***

* * *

# <a id="toc-setting-up-babel"></a>Babel Kurulumu

Javascript topluluğunun tek bir kurma aracı -build tool- ,çatı yapısı -framework , platformu gibi - özellikleri yok iken - Babel'in tüm ana araçlar -major tooling- için resmi entegrasyonu bulunmaktadır. Glup'tan Browserify'a , Ember'den Meteor'a kurulumunuzda ne olursa olsun muhtemelen resmi entegrasyonu bulunmaktadır.

Bu el kitabının amacı uyarınca, Babel'i yerleşik (built-in) yolları kullanarak hazırlmayı kapsayacaktır fakat isterseniz tüm entegrasyon için interaktif [kurulum sayfasını](http://babeljs.io/docs/setup) kullanabilirsiniz.

> **Not:** Bu kılavuz `node` ve `npm` gibi komut satırı -command line- araçlarını referanslar gönderir. Daha ileri de zorluk çekmemek için bu araçları anlamış ve kullanabiliyor olmanız gerekir.

## <a id="toc-babel-cli"></a>`babel-cli`

Babel CLI (Babel Komut Satırı arayüzü) Babel ile dosyaları komut satırı üzerinden derlemenin basit yoludur. 

Sistem üzerinde global olarak yükleyerek temelleri öğrenelim.

```sh
$ npm install --global babel-cli
```

İlk dosyanmızı şu şekilde derleyebiliriz.

```sh
$ babel my-file.js
```

Bu konut derlenmiş çıktıyı terminal üzerine hemen yazar. Bunu bir dosyaya yazmak için `--out-file`veya `-o` önekini yazmamız gerekir. .

```sh
$ babel example.js --out-file compiled.js
# veya 
$ babel example.js -o compiled.js
```

Eğer tüm klasörü yeni bir klasöre derlemek için : `--out-dir` or `-d` komutlarını kullanabiliriz..

```sh
$ babel src --out-dir lib
# or
$ babel src -d lib
```

### <a id="toc-running-babel-cli-from-within-a-project"></a>Proje içinde Babel CLI çalıştırmak

Babel CLI sisteminize global olarak yükleyebilmeniz mümkün olmasına rağmen, her bir projeniz için ayrı ayrı yüklemeniz daha kullanışlı olur.

Bunun iki önemli sebebi vardır: 

  1. Aynı sistemdeki farklı projeler Babel'in farklı versiyonlarına bağlı olabilir . Babel bunları ayrı ayrı güncellemenize olanak tanır.
  2. Bu çalıştığınız çevre için gizli bağımlılıklara sahip olmadığınız anlamına gelir. Projeleriniz çok daha taşınabilir ve kolaylıkla kurulabilir hale getirir.

Yerel - Local- olarak Babel CLI'ı şu şekilde kurarız:

```sh
$ npm install --save-dev babel-cli
```

> **Not:** Babel'i -sistem üzerinde- global kurmak kötü bir fikir olduğundan , aşağıdaki komutu girerek sistemden kaldırabilirsiniz:
> 
> ```sh
$ npm uninstall --global babel-cli
```

Yükleme bittikten sonra `package.json` şu şekilde görülmelidir.

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "devDependencies": {
    "babel-cli": "^6.0.0"
  }
}
```

Şimdi Babali dolaysız olarak komut satırından kullanmaktansa , komutlarımızı yerel versiyonumuzda kullandığımız **npm scriptine** koyacağız.

Basitce `package.json` dosyası içinde `"scripts"` alanını ekleyin ve babel komutlarınızı bu alan içinde `build` alanı ekleyerek yazınız. .

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

Şimdi terminal üzerinden aşağıdaki komutu çalıştırabiliriz: 

```js
npm run build
```

Bu daha önceden yaptığımız gibi Babel'i çalıştıracak , -fakat bu sefer - yerel -Babel - kopyası üzerinden -işlem - gerçekleşecek

## <a id="toc-babel-register"></a>`babel-register`

Sonraki Babel'i çalıştıran en geçerli metod `babel-register`dır. Bu seçenek sadece kurulumunuzla daha iyi entegre olabilecek gerekli dosyalarla Babel'i çalıştırmanıza izin verir. 

Unutmayın ki bu üretim seviyesi kullanımı anlamına gelmez. Bu şekilde dağıtım için derleme yapmak hatalı görülür. Dağıtım vaktinden önce derlemek çok daha iyidir. Ancak bu işlemler kurulum dosyaları -build script - veya yerel olarak yaptığınız işler için oldukça iyi çalışır. 

Önce projemiz içinde `index.js` dosyasını oluşturalım

```js
console.log("Hello world!");
```

Eğer bu -dosyayı- `node index.js` ile çalıştırırsak , bu işlem Babel ile derlenmeyecektir. Bunun yerine `babel-register` ile kurulum yapacağız..

Önce `babel-register` 'ı yükleyelim..

```sh
$ npm install --save-dev babel-register
```

Sonra , `register.js` dosyasını projenizde oluşturun ve aşağıdaki kodu ekleyin:

```js
require("babel-register");
require("./index.js");
```

Bu Babel'i Node modül sistemine *kaydeder* ve her bir `gerekli dosyayı `derlemeye başlar.

Şimdi `node index.js` olarak dosyayı yürütmek yerine `register.js` dosyasını kullanabiliriz.

```sh
$ node register.js
```

> **Node</Node> Babeli'i derlemek istediğiniz dosya üzerinde kayıt edemezsiniz.Node dosyayı Babel'in -önceden- derleme şansı olmadan yürütmeye başlar </p> 
> 
> ```js
require("babel-register");
// derleme hatası verir !! :
console.log("Hello world!");
```</blockquote> 

## <a id="toc-babel-node"></a>`babel-node`

If you are just running some code via the `node` CLI the easiest way to integrate Babel might be to use the `babel-node` CLI which largely is just a drop in replacement for the `node` CLI.

Unutmayın ki bu üretim seviyesi kullanımı anlamına gelmez. Bu şekilde dağıtım için derleme yapmak hatalı görülür. Dağıtım vaktinden önce derlemek çok daha iyidir. Ancak bu işlemler kurulum dosyaları -build script - veya yerel olarak yaptığınız işler için oldukça iyi çalışır. 

Önce `babel-cli` 'ın sisteminizde kurulu olduğundan emin olalım:

```sh
$ npm install --save-dev babel-cli
```

> **Note:** If you are wondering why we are installing this locally, please read the [Running Babel CLI from within a project](#toc-running-babel-cli-from-within-a-project) section above.

Daha sonra nerede `node` kullandığunız yerlerin yerine `babel-node` yazınız..

Eğer npm `scriptleri ` kullanıyorsanız şu şekilde - değişiklik- yapabilirsiniz.

```diff
  {
    "scripts": {
-     "script-name": "node script.js"
+     "script-name": "babel-node script.js"
    }
  }
```

Bu hallerin dışında -çalışma- yolunu `babel-node` üzerine yazmanız gerekir.

```diff
- node script.js
+ ./node_modules/.bin/babel-node script.js
```

> İpucu: Ayrıca [`npm-run`](https://www.npmjs.com/package/npm-run) kullanabilirsiniz.

## <a id="toc-babel-core"></a>`babel-core`

Herhangi bir sebebten dolayı Babel'i program arayüzüyle kullanacaksanız `Babil-çekirdek` paketinin kendisini kullanabilirsiniz.

Önce `babel-register` 'ı yükleyelim..

```sh
$ npm install babel-core
 
Context | Request Context

```

```js
var babel = require("babel-core");
```

Eğer -dosya yerine- yazı halinde derlenecek Javascript dosyanız varsa `babel.transform` ile doğrudan derleme yapabilirsiniz..

```js
babel.transform("code();", options);
// => { code, map, ast }
```

Eğer dosyalar üzerinde çalışıyorsanız eşzamansız (asynchronous) api (kullanıcı program arayüzünü) de kullanabilirsiniz.

```js
babel.transformFile("filename.js", options, function(err, result) {
  result; // => { code, map, ast }
});
```

yada eşzamanlı (synchronous api) api'yi 

```js
babel.transformFileSync("filename.js", options);
// => { code, map, ast }
```

Daha önceden herhangi bir sebeble Babel AST -elinizde mevcutsa- AST üzerinden doğrudan dönüşüm yapabilirsiniz.

```js
babel.transformFromAst(ast, code, options);
// => { code, map, ast }
```

For all of the above methods, `options` refers to https://babeljs.io/docs/usage/api/#options.

* * *

# <a id="toc-configuring-babel"></a>Babel Yapılandırması

Şu ana kadar Babel'in javascript dosyalarını bir yerden diğerine kopyalamaktan başka bir şey yapmadığını farketmiş olmalısınız.

Bunun sebebi Babel'in ne yapacağını size anlatmamış olmamız.

> Babel genel amaçlı derleyici olduğundan hiçbir -işlem- için varsayılan kullanım yolu belirtmez sayısız yoldan kullanma imkanı vardır. Babel'in ne yapacağını açıkça - explicitly- belirtmeniz gerekir.

**plugins** veya **presets** (Plugin grubu) yükleyerek Babel'e ne yapacağı ile ilgili talimatlar verebilirsiniz.

## <a id="toc-babelrc"></a>`.babelrc`

Babel' e ne yapacağını söylemeden önce yapılandırma dosyası oluşturmalıyız. Tüm yapmanız gereken `.babelrc` dosyasını projenin kök dizininde oluşturmanız gerekir. Şöyle başlayabilirsiniz.: 

```js
{
  "presets": [],
  "plugins": []
}
```

Bu dosya Babel'e istedğinizi yaptırabilmek için nasıl yapılandıracağınızı belirler. 

> **Not:** Babel'i ayarlarmak için başka yollar olmasına rağmen , `.babelrc` dosyası esas ve en iyi yoldur.

## <a id="toc-babel-preset-es2015"></a>`babel-preset-es2015`

Babeli ES2015 (ES6 olarak da bilinen , en yeni Javascript standartı) standardından ES5 (bugün kullanılan en yaygın javascript standardına) derleme doğru derleme yaparak başlayalım. 

Babel present alanına "es2015" yükleyelim:

```sh
$ npm install --save-dev babel-preset-es2015
```

Sonra , `.babelrc` dosyasını present (Plugin grubu) 'ı içerek şekilde değiştirelim.

```diff
  {
    "presets": [
+     "es2015"
    ],
    "plugins": []
  }
```

## <a id="toc-babel-preset-react"></a>`babel-preset-react`

React 'ı kurmak çok kolaydır. Önce Preset olarak yükleyin :

```sh
$ npm install --save-dev babel-preset-react
```

`.babelrc` dosyasına işbu present 'ı ekleyin: 

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

Javascript'in TC39 (Ecmascript'in arkasındaki teknik komite) standartı üzerinden veren bazı öneriler vardır.

Bu işlem 5 aşamalı (0'dan 4'e ) aşamalara bölümüştür. Önerilen giderek daha fazla izlendikçe ve diğer standart aşamalarında kabul gördükçe yükselir ve 4. aşamada kullanıma açılır.

Bunlar Babel üzerinde 4 ayrı present (Plugin Grubu) olarak paketlenmiştir:

  * `babel-preset-stage-0`
  * `babel-preset-stage-1`
  * `babel-preset-stage-2`
  * `babel-preset-stage-3`

> Not : 4. aşama yukarıda gösterilen `es2015` present 'i olduğundan ayrıca hazırlanmamıştır. 

Her bir present aşaması daha sonraki preset aşamasında gereklidir. `babel-preset-stage-2` `babel-preset-stage-1` 'i gerektirirken `babel-preset-stage-3` tarafındandan da ihtiyaç duyulur..

Basitce hangi aşamaya ihtiyacınız varsa kurulumunu yapınız:

```sh
$ npm install --save-dev babel-preset-stage-2
```

Sonra `.babelrc` ayar dosyasına ekleyiniz

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

# <a id="toc-executing-babel-generated-code"></a>Üretilen kodu çalıştırma

Kodunuzu Babel'de derlediniz , fakat bu hikayenin sonu değildir.

## <a id="toc-babel-polyfill"></a>`babel-polyfill`

Hemen hemen gelecekte kullanılacak tüm Javascript söz dizimi (syntax) Babel ile derlenebilir fakat bu tüm API 'ler için geçerli değildir. 

Örneğin , aşağıdaki kod derlenmesi gereken ok (arrow "=>") fonksiyonuna ihtiyaç duyar.

```js
function addAll() {
  return Array.from(arguments).reduce((a, b) => a + b);
}
```

Bu şu şekle dönüştürülür

```js
function addAll() {
  return Array.from(arguments).reduce(function(a, b) {
    return a + b;
  });
}
```

Ancak bu kod her ortamda çalışmaz çünkü `Array.from` tüm Javascript ortamlarında mevcut değildir.

    Uncaught TypeError: Array.from is not a function 
    Yakalanamamış Tip Hatası : Array.from fonksiyonu mevcut değil 
    

Bu problemi çözmek için [Polyfill](https://remysharp.com/2010/10/08/what-is-a-polyfill) denen yaklaşımı kullanırız. Temel anlamıla polyfily çalışma zamanında mevcut olmayan tabii api'yi çoğaltan kod parçasıdır. bu size daha önceden kullanıma açılmamış `Array.from` gibi API'yi kullanmanıza izin verir.

Babel kusursuz [core.js](https://github.com/zloirock/core-js) ile birlikte çalışmakta olan oluşturucu ve eş zamansız fonksiyonları alabilmek için kişiselleştirilebirilir [yeniden oluşturucu -regenerator- ](https://github.com/facebook/regenerator) çalışma zamanını kendi polyfill 'i olarak kullanır. 

Babel polyfill'i dahil etmek için önce npm ile sisteme yükleyelim : 

```sh
$ npm install --save babel-polyfill
```

Daha sonra gerekli dosyaların giriş satırına pollyfill 'i dahil edelim.

```js
import "babel-polyfill";
```

## <a id="toc-babel-runtime"></a>`babel-runtime`

ECMAScript yönerge detaylarını uygulamak -ve- üretilmiş kodları temiz tutabilmek için Babel "yardımcı -helper-" metodlarını kullanacaktır.

Bu "helpers - yardımcılar" oldukça uzun olduğundan ve her bir ihtiyaç duyulan dosyanın en üst satırına eklendiğinden bunları gerekli tek bir "runtime - çalışma zamanı- "na taşıyabilirsiniz.

`babel-plugin-transform-runtime` ve `babel-runtime`'mı yükleyerek başlayınız:

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

Şimdi Babel kodunuzu aşağıdaki koddan : 

```js
class Foo {
  method() {}
}
```

Şundan derleyebilir:

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

`_classCallCheck` ve `_createClass` deklerasyon yardımcılarını her bir dosyaya koymak yerine gerektiği dosyalara konulabilir.

* * *

# <a id="toc-configuring-babel-advanced"></a>Babel (Gelişmiş) yapılandırma

Çoğu kişi Babel'i yerleşik düzeniyle kullanabilir fakat babel bundan fazlasını sunmaktadır.

## <a id="toc-manually-specifying-plugins"></a>Eklentileri el ile belirtme

Babel önceden ayarlanamış plugin setini sunuar. Eğer bunlardan hariç bir şekilde kullanmak isyitorsanız pluginleri kendiniz belirtebilirsiniz. Bu -yukarıda gördümüz- present 'larla aşağı yukarı aynı şekilde çalışmaktadır. 

Önce plugin'i yükleyelim

```sh
$ npm install --save-dev babel-plugin-transform-es2015-classes
```

Sonra `plugins` alanını `babelrc` dosyanıza ekleyelim..

```diff
  {
+   "plugins": [
+     "transform-es2015-classes"
+   ]
  }
```

Bu size yürütmekte olduğunuz tüm dönüşümler üzerinde daha ince control imkanı sunar.

Tüm resmi plugin'ler için [Babel Plugins sayfasını](http://babeljs.io/docs/plugins/) ziyaret ediniz..

Ayrıca [topluluk tarafından oluşturulan ](https://www.npmjs.com/search?q=babel-plugin) pluginlere de göz atabilirsiniz. If you would like to learn how to write your own plugin read the [Babel Plugin Handbook](plugin-handbook.md).

## <a id="toc-plugin-options"></a>Eklenti seçenekleri

Çoğu pluginin varsayılandan farklı davranması için ayarlama imkanları vardır. Örneğin , çoğu dönünüşümün performans ve basitlik lehine bazı özellikleri görmezden geldiği "loose - hafif-" modu bulunmaktadır. 

Plugin'e seçenekler eklemek için aşağıdaki değişimleri yapınız: 

```diff
  {
    "plugins": [
-     "transform-es2015-classes"
+     ["transform-es2015-classes", { "loose": true }]
    ]
  }
```

> Gelecek dönemde plugin dökümantasyonu için güncelllemeler yapacağım [ Beni takip ediniz](https://twitter.com/thejameskyle).

## <a id="toc-customizing-babel-based-on-environment"></a>Ortama göre Babel'i özelleştirme

Babel plugins çok çeşitli görevlerde kullanılır. Bunların çoğu kodunuzun hatalarını gidermek yada diğer araçlarla entegre olmak için size yardımcı olan geliştirici ayarlarıdır. Ayrıca bir çok plugin üretim zamanında kodunu optimize etmek için kullanılır. 

Bu sebeble , sistemin durumuna göre Babel'i ayarlamak gerekebilir. Bu `.babelrc` dosyasıyla kolaylıkla yapılabilir.

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

Babel `env` alanının içinden cari ortama göre ayarlamaya izin verir.

Cari sistem ortamı için `process.env.BABEL_ENV` sabiti kullanılır. `BABEL_ENV` sabitinin olmadığı durumlarda `NODE_ENV` sabiti kullanır ve eğer bu "development" olarak atanmışsa mevcut değildir..

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

> **Note:** `[COMMAND]` Babeli yürütmek için kullandığınız komut (örneğin e. `babel`, `babel-node`, veya eğer sicil üzerinden - register hook- çalıştırdıysanız sadece `node` )
> 
> **Tip:** If you want your command to work across unix and windows platforms then use [`cross-env`](https://www.npmjs.com/package/cross-env).

## <a id="toc-making-your-own-preset"></a>Kendi önceden belirlenmiş ayarlarınızı yapmak

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

# <a id="toc-babel-and-other-tools"></a>Babil ve diğer araçlar

Babel is pretty straight forward to setup once you get the hang of it, but it can be rather difficult navigating how to set it up with other tools. However, we try to work closely with other projects in order to make the experience as easy as possible.

## <a id="toc-static-analysis-tools"></a>Statik analiz araçları

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

### <a id="toc-code-style"></a>Kod stili

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

### <a id="toc-documentation"></a>Dökümantasyon

Using Babel, ES2015, and Flow you can infer a lot about your code. Using [documentation.js](http://documentation.js.org) you can generate detailed API documentation very easily.

Documentation.js uses Babel behind the scenes to support all of the latest syntax including Flow annotations in order to declare the types in your code.

## <a id="toc-frameworks"></a>Frameworkler

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

## <a id="toc-text-editors-and-ides"></a>Metin düzenleyicileri ve IDE'ler

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

# <a id="toc-babel-support"></a>Babel destek

Babel has a very large and quickly growing community, as we grow we want to ensure that people have all the resources they need to be successful. So we provide a number of different channels for getting support.

Remember that across all of these communities we enforce a [Code of Conduct](https://github.com/babel/babel/blob/master/CODE_OF_CONDUCT.md). If you break the Code of Conduct, action will be taken. So please read it and be conscious of it when interacting with others.

We are also looking to grow a self-supporting community, for people who stick around and support others. If you find someone asking a question you know the answer to, take a few minutes and help them out. Try your best to be kind and understanding when doing so.

## <a id="toc-babel-forum"></a>Babel Forum

[Discourse](http://www.discourse.org) has provided us with a hosted version of their forum software for free (and we love them for it!). If forums are your thing please stop by [discuss.babeljs.io](https://discuss.babeljs.io).

## <a id="toc-babel-chat"></a>Babel sohbet

Everyone loves [Slack](https://slack.com). If you're looking for immediate support from the community then come chat with us at [slack.babeljs.io](https://slack.babeljs.io).

<!--
## Babel Stack Overflow

> [WIP]
-->

## <a id="toc-babel-issues"></a>Babel sorunları

Babel uses the issue tracker provided by [Github](http://github.com).

You can see all the open and closed issues on [Github](https://github.com/babel/babel/issues).

If you want to open a new issue:

  * [Search for an existing issue](https://github.com/babel/babel/issues)
  * [Create a new bug report](https://github.com/babel/babel/issues/new) or [request a new feature](https://github.com/babel/babel/issues/new)

### <a id="toc-creating-an-awesome-babel-bug-report"></a>Harika bir Babil hata raporu oluşturma

Babel issues can sometimes be very difficult to debug remotely, so we need all the help we can get. Spending a few more minutes crafting a really nice bug report can help get your problem solved significantly faster.

First, try isolating your problem. It's extremely unlikely that every part of your setup is contributing to the problem. If your problem is a piece of input code, try deleting as much code as possible that still causes an issue.

> [WIP]

* * *

> ***Gelecek güncellemeler için [@thejameskyle](https://twitter.com/thejameskyle)'i Twitter'dan takip edin.***