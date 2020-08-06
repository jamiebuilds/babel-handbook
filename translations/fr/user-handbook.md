# Manuel utilisateur de Babel

Ce document couvre tout ce que vous avez toujours voulu savoir sur l'utilisation de [Babel](https://babeljs.io) et des outils associés.

[![cc-by-4.0](https://licensebuttons.net/l/by/4.0/80x15.png)](http://creativecommons.org/licenses/by/4.0/)

Ce manuel est disponible dans d'autres langues, voir le [README](/README.md) pour une liste complète.

# Sommaire

  * [Introduction](#toc-introduction)
  * [Mise en place de Babel](#toc-setting-up-babel) 
      * [`babel-cli`](#toc-babel-cli)
      * [Exécution du CLI de Babel dans un projet](#toc-running-babel-cli-from-within-a-project)
      * [`babel-register`](#toc-babel-register)
      * [`babel-node`](#toc-babel-node)
      * [`babel-core`](#toc-babel-core)
  * [Configuration de Babel](#toc-configuring-babel) 
      * [`.babelrc`](#toc-babelrc)
      * [`babel-preset-es2015`](#toc-babel-preset-es2015)
      * [`babel-preset-react`](#toc-babel-preset-react)
      * [`babel-preset-stage-x`](#toc-babel-preset-stage-x)
  * [Exécution du code généré par Babel](#toc-executing-babel-generated-code) 
      * [`babel-polyfill`](#toc-babel-polyfill)
      * [`babel-runtime`](#toc-babel-runtime)
  * [Configuration de Babel (Avancé)](#toc-configuring-babel-advanced) 
      * [Spécification manuelle des plugins](#toc-manually-specifying-plugins)
      * [Options du plugin](#toc-plugin-options)
      * [Personnalisation de Babel basé sur l'environnement](#toc-customizing-babel-based-on-environment)
      * [Faire votre propre preset](#toc-making-your-own-preset)
  * [Babel et les autres outils](#toc-babel-and-other-tools) 
      * [Outils d'analyse statique](#toc-static-analysis-tools)
      * [Linting](#toc-linting)
      * [Style de code](#toc-code-style)
      * [Documentation](#toc-documentation)
      * [Frameworks](#toc-frameworks)
      * [React](#toc-react)
      * [IDEs et les éditeurs de texte](#toc-text-editors-and-ides)
  * [Support Babel](#toc-babel-support) 
      * [Forum Babel](#toc-babel-forum)
      * [Tchat Babel](#toc-babel-chat)
      * [Issues (anomalies) de Babel](#toc-babel-issues)
      * [Création d'un génial rapport de bogue](#toc-creating-an-awesome-babel-bug-report)

# <a id="toc-introduction"></a>Introduction

Babel est un compilateur générique et multi-usage pour JavaScript. L'utilisation de Babel, vous permet d'utiliser (et de créer) la prochaine génération de JavaScript, ainsi que la prochaine génération des outils JavaScript.

JavaScript est un langage en constante évolution, avec sans cesse de nouvelles spécifications, propositions et fonctionnalités. L'usage de Babel vous permettra d'utiliser un grand nombre de ces fonctionnalités des années avant qu'elles ne soient disponibles partout.

Babel fait cela en compilant le code JavaScript écrit avec le dernier standard dans une version fonctionnant partout aujourd'hui. Ce processus est connu comme de la compilation de source à source, aussi connu sous le nom de transpilation.

Par exemple, Babel pourrait transformer la syntaxe de la nouvelle fonction fléchée, de ceci :

```js
const square = n => n * n;
```

En cela :

```js
const square = function square(n) {
   return n * n;
};
```

Cependant, Babel peut faire beaucoup plus, comme le support des extensions de syntaxe telles que JSX pour React et le support de Flow pour la vérification de type statique.

De plus, dans Babel tout est composé de module, et n'importe qui peut créer le sien en utilisant toute la puissance de Babel pour en faire ce qu'il souhaite.

*Bien plus encore*, Babel est décomposé en un certain nombre de modules de base que n'importe qui peut utiliser pour construire la prochaine génération d'outils pour JavaScript.

Beaucoup de gens l'ont déjà fait, et l'écosystème qui a surgi autour de Babel est massif et très diversifié. Tout au long de ce guide, je vais couvrir ces deux aspects, comment les outils intégrés de Babel fonctionnent ainsi que des choses utiles provenant de la communauté.

> ***Pour les prochaines mises à jour, suivez [@thejameskyle](https://twitter.com/thejameskyle) sur Twitter.***

* * *

# <a id="toc-setting-up-babel"></a>Mise en place de Babel

Puisque la communauté JavaScript dispose d'une multitude d'outils de construction, de frameworks, de plateformes, etc., Babel fournit des intégrations officielles pour la majorité des outils. Peu importe votre configuration, en allant de Gulp à Browserify, ou bien d'Ember à Meteor, il y a probablement une intégration officielle.

Dans le cadre de ce guide, nous allons seulement couvrir les méthodes par défaut pour configurer Babel, mais vous pouvez également visiter la [page de configuration](http://babeljs.io/docs/setup) interactive pour les autres intégrations.

> **Remarque :** Ce guide va se référer à des outils de ligne de commande comme `node` et `npm`. Avant d'aller plus loin, vous devez être à l'aise avec ces outils.

## <a id="toc-babel-cli"></a>`babel-cli`

Le CLI de Babel est une façon simple de compiler des fichiers avec Babel depuis la ligne de commande.

Nous allons d’abord l’installer globalement pour apprendre les bases.

```sh
$ npm install --global babel-cli
```

Nous pouvons compiler notre premier fichier comme suit :

```sh
$ babel my-file.js
```

Cela affichera le résultat compilé directement dans votre terminal. Pour l’écrire dans un fichier, nous devons le préciser avec `--out-file` ou `-o`.

```sh
$ babel example.js --out-file compiled.js
# ou
$ babel example.js -o compiled.js
```

Si nous voulons compiler un répertoire entier dans un nouveau répertoire, nous pouvons le faire en utilisant `--out-dir` ou `-d`.

```sh
$ babel src --out-dir lib
# ou
$ babel src -d lib
```

### <a id="toc-running-babel-cli-from-within-a-project"></a>Exécution du CLI de Babel dans un projet

Bien que vous *pouvez* installer le CLI de Babel globalement sur votre machine, il est préférable de l'installer **localement** pour chaque projet.

Il y a deux raisons principales à cela.

  1. Plusieurs projets sur la même machine peuvent dépendre de différentes versions de Babel, donc ceci vous permet d'en mettre un à jour à la fois.
  2. Cela signifie que vous n’avez pas une dépendance implicite sur l’environnement que vous utilisez. Ce qui rend votre projet beaucoup plus portable et plus facile à installer.

Nous pouvons installer localement le CLI de Babel en exécutant :

```sh
$ npm install --save-dev babel-cli
```

> **Remarque :** Comme c’est généralement une mauvaise idée d’exécuter Babel globalement, vous pouvez désinstaller la copie globale en exécutant :
> 
> ```sh
$ npm uninstall --global babel-cli
```

Après avoir terminé l’installation, votre fichier `package.json` devrait ressembler à ceci :

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "devDependencies": {
    "babel-cli": "^6.0.0"
  }
}
```

Maintenant au lieu d’exécuter Babel directement à partir de la ligne de commande, nous allons mettre nos commandes dans les **scripts npm** qui utiliseront notre version locale.

Ajoutez simplement un champ `"scripts"` à votre `package.json` et mettez la commande de babel dans `build`.

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

Maintenant depuis notre terminal nous pouvons exécuter :

```js
npm run build
```

Ceci lancera Babel de la même manière que précédemment, seulement maintenant, nous utilisons une copie locale.

## <a id="toc-babel-register"></a>`babel-register`

La méthode suivante, la plus courante pour l’exécution de Babel, se fait par le biais de `babel-register`. Cette option vous permettra d’exécuter Babel en exigeant seulement les fichiers qui peuvent le mieux s’intégrer à votre configuration.

Notez que ce n'est pas destiné à une utilisation en production. Cela est considéré comme une mauvaise pratique de déployer du code qui est compilé de cette façon. Il est préférable de le compiler à l’avance avant de déployer. Toutefois, cela fonctionne très bien pour les scripts de construction ou d'autres choses que vous exécutez localement.

Premièrement, nous allons créer un fichier `index.js` dans notre projet.

```js
console.log("Hello world!");
```

Si nous devions exécuter ceci avec `node index.js`, ce ne serait pas compilé avec Babel. Donc, au lieu de faire cela, nous allons configurer `babel-register`.

Tout d’abord installez `babel-register`.

```sh
$ npm install --save-dev babel-register
```

Ensuite, créez un fichier `register.js` dans le projet et écrivez le code suivant :

```js
require("babel-register");
require("./index.js");
```

Ce qu’il fait, c'est d'*inscrire* Babel dans le système de module de Node et de commencer à compiler tous les fichiers qui sont exigés (require).

Maintenant, au lieu d’exécuter `node index.js`, nous pouvons utiliser à la place `register.js`.

```sh
$ node register.js
```

> **Remarque :** Vous ne pouvez pas enregistrer Babel dans le même fichier que celui que vous souhaitez compiler. Car node exécute le fichier avant que Babel ait une chance de le compiler.
> 
> ```js
require("babel-register");
// pas compilé :
console.log("Hello world!");
```

## <a id="toc-babel-node"></a>`babel-node`

Si vous êtes juste en train d’exécuter du code via le CLI de `node`, la meilleure façon d’intégrer Babel serait d’utiliser le CLI de `babel-node` qui est essentiellement un remplaçant du CLI de `node`.

Notez que ce n'est pas destiné à une utilisation en production. Cela est considéré comme une mauvaise pratique de déployer du code qui est compilé de cette façon. Il est préférable de le compiler à l’avance avant de déployer. Toutefois, cela fonctionne très bien pour les scripts de construction ou d'autres choses que vous exécutez localement.

Tout d’abord, assurez-vous que vous avez `babel-cli` qui est installé.

```sh
$ npm install --save-dev babel-cli
```

> **Remarque :** Si vous vous demandez pourquoi nous installons ceci en locale, veuillez lire ci-dessus la section [Exécution du CLI de Babel au sein d’un projet](#toc-running-babel-cli-from-within-a-project).

Puis remplacer chaque fois que vous exécutez `node` avec `babel-node`.

Si vous utilisez les `scripts` de npm, vous pouvez simplement faire :

```diff
  {
    "scripts": {
-     "script-name": "node script.js"
+     "script-name": "babel-node script.js"
    }
  }
```

Dans le cas contraire, vous devrez écrire vous-même le chemin d’accès à `babel-node`.

```diff
- node script.js
+ ./node_modules/.bin/babel-node script.js
```

> Astuce : Vous pouvez également utiliser [`npm-run`](https://www.npmjs.com/package/npm-run).

## <a id="toc-babel-core"></a>`babel-core`

Si vous devez utiliser Babel par programmation, pour une raison quelconque, vous pouvez utiliser le package `babel-core`.

Tout d’abord installez `babel-core`.

```sh
$ npm install babel-core
```

```js
var babel = require("babel-core");
```

Si vous avez une chaîne de JavaScript, vous pouvez la compiler directement à l’aide de `babel.transform`.

```js
babel.transform("code();", options);
// => { code, map, ast }
```

Si vous travaillez avec des fichiers, vous pouvez utiliser l’api asynchrone :

```js
babel.transformFile("filename.js", options, function(err, result) {
  result; // => { code, map, ast }
});
```

Ou l’api synchrone :

```js
babel.transformFileSync("filename.js", options);
// => { code, map, ast }
```

Si pour une raison quelconque vous avez déjà un AST de Babel, vous pouvez le transformer directement depuis l’AST.

```js
babel.transformFromAst(ast, code, options);
// => { code, map, ast }
```

Pour toutes les méthodes ci-dessus, les `options` se réfèrent à https://babeljs.io/docs/usage/api/#options.

* * *

# <a id="toc-configuring-babel"></a>Configuration de Babel

Vous avez peut-être remarqué qu’en exécutant Babel sur lui-même, il ne semble pas faire autre chose que de la copie de fichier JavaScript d’un endroit à un autre.

C’est parce que nous n’avons pas dit à Babel de faire quoi que ce soit pour le moment.

> Comme Babel est un compilateur polyvalent, et qu'il est utilisé de plusieurs façons différentes, il ne fait rien par défaut. Vous devez indiquer explicitement ce que Babel doit faire.

Vous pouvez donner des instructions Babel sur ce qu’il doit faire en installant des **plugins** ou **presets** (groupes de plugins).

## <a id="toc-babelrc"></a>`.babelrc`

Avant de commencer à dire à Babel ce qu'il doit faire. Nous devons créer un fichier de configuration. Tout ce que vous devez faire, c'est créer un fichier `.babelrc` à la racine de votre projet. Commencez le comme ceci :

```js
{
  "presets": [],
  "plugins": []
}
```

Ce fichier explique comment configurer Babel pour faire ce que vous voulez.

> **Remarque :** Bien que vous puissiez passer également des options à Babel de manières différentes, le fichier `.babelrc` est la convention et c'est la meilleure façon de le faire.

## <a id="toc-babel-preset-es2015"></a>`babel-preset-es2015`

Commençons par dire à Babel de compiler ES2015 (la version la plus récente de la norme JavaScript, également connu sous le nom de ES6) en ES5 (la version aujourd'hui disponible dans la plupart des environnements de JavaScript).

Nous ferons cela en installant le preset de Babel "es2015" :

```sh
$ npm install --save-dev babel-preset-es2015
```

Ensuite, nous allons modifier notre `.babelrc` pour inclure ce preset.

```diff
  {
    "presets": [
+     "es2015"
    ],
    "plugins": []
  }
```

## <a id="toc-babel-preset-react"></a>`babel-preset-react`

La mise en place de React est tout aussi facile. Il suffit d’installer le preset :

```sh
$ npm install --save-dev babel-preset-react
```

Puis ajoutez le preset à votre fichier `.babelrc` :

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

JavaScript a aussi quelques propositions qui font leur chemin dans la norme par le biais du processus de la TC39 (Comité technique derrière le standard ECMAScript).

Ce processus est découpé en 5 étapes (0-4). Plus les propositions séduisent et plus elles sont susceptibles d'être acceptées dans la norme, elles passent par les différentes étapes pour être finalement acceptées dans la norme à l'étape 4.

Celles-ci sont groupées dans babel comme 4 preset différents :

  * `babel-preset-stage-0`
  * `babel-preset-stage-1`
  * `babel-preset-stage-2`
  * `babel-preset-stage-3`

> Remarquez qu’il n’y a pas de preset stage-4, car il se trouve tout simplement dans le preset `es2015`.

Chacun de ces presets nécessite le preset des étapes ultérieures. C'est-à-dire que `babel-preset-stage-1` a besoin de `babel-preset-stage-2` qui lui même a besoin de `babel-preset-stage-3`.

Installez simplement l'étape que vous souhaitez utiliser :

```sh
$ npm install --save-dev babel-preset-stage-2
```

Puis vous pouvez l’ajouter au config de votre `.babelrc`.

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

# <a id="toc-executing-babel-generated-code"></a>Exécution du code généré par Babel

Donc vous avez compilé votre code avec Babel, mais ce n’est pas la fin de l’histoire.

## <a id="toc-babel-polyfill"></a>`babel-polyfill`

Presque toute la syntaxe JavaScript futuriste peut être compilée avec Babel, mais ce n'est pas le cas pour les API.

Par exemple, le code suivant est une fonction flèchée qui doit être compilé :

```js
function addAll() {
  return Array.from(arguments).reduce((a, b) => a + b);
}
```

Qui se transforme en ceci :

```js
function addAll() {
  return Array.from(arguments).reduce(function(a, b) {
    return a + b;
  });
}
```

Malgré cela, le code ne fonctionnera pas encore partout parce que `Array.from` n’existe pas dans tous les environnements JavaScript.

    Uncaught TypeError: Array.from is not a function
    

Pour résoudre ce problème, nous utilisons ce qu’on appelle un [Polyfill](https://remysharp.com/2010/10/08/what-is-a-polyfill). Autrement dit, un polyfill est un morceau de code qui reproduit une api native qui n’existe pas dans le runtime actuel. Cela vous permet d’utiliser des API telles que `Array.from` avant qu’elles ne soient disponibles.

Babel utilise l'excellent [core-js](https://github.com/zloirock/core-js) comme son polyfill, ainsi qu’un runtime personnalisé [regenerator](https://github.com/facebook/regenerator) pour obtenir des générateurs et des fonctions async qui fonctionnent.

Pour inclure le polyfill Babel, veuillez d’abord l’installez avec npm :

```sh
$ npm install --save babel-polyfill
```

Ensuite, veuillez simplement inclure le polyfill en haut de n’importe quel fichier qui l’exige :

```js
import "babel-polyfill";
```

## <a id="toc-babel-runtime"></a>`babel-runtime`

Pour implémenter les spécifications ECMAScript, Babel utilisera des méthodes "d'aide" (helper) afin de garder le code généré propre.

Comme la liste de ces aides peut devenir assez longue et qu'elle est ajoutée au début de chaque fichier, vous pouvez utiliser un seul "runtime" qui utilisera seulement celles qui sont requises.

Commencez par installer `babel-plugin-transform-runtime` et `babel-runtime` :

```sh
$ npm install --save-dev babel-plugin-transform-runtime
$ npm install --save babel-runtime
```

Puis mettez à jour votre `.babelrc` :

```diff
  {
    "plugins": [
+     "transform-runtime",
      "transform-es2015-classes"
    ]
  }
```

Maintenant, Babel compilera le code qui suit :

```js
class Foo {
  method() {}
}
```

En cela :

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

Au lieu de mettre les aides `_classCallCheck` et `_createClass` dans chaque fichier, Babel les mettra où elles sont nécessaires.

* * *

# <a id="toc-configuring-babel-advanced"></a>Configuration de Babel (Avancé)

La plupart des gens utilisent seulement Babel avec les presets fournis, cependant, Babel propose un contrôle beaucoup plus grand que cela.

## <a id="toc-manually-specifying-plugins"></a>Spécification manuelle des plugins

Les presets de Babel sont simplement des collections de plugins pré-configurés, si vous voulez faire les choses différemment, vous devez spécifier manuellement les plugins. Cela fonctionne presque exactement de la même façon que les presets prédéfinis.

Commencez par installer un plugin :

```sh
$ npm install --save-dev babel-plugin-transform-es2015-classes
```

Ajoutez ensuite le champ `plugins` à votre `.babelrc`.

```diff
  {
+   "plugins": [
+     "transform-es2015-classes"
+   ]
  }
```

Cela vous donne un contrôle beaucoup plus fin sur les transformations que vous exécutez.

Pour avoir une liste complète des plugins officiels, voir la [page des plugins de Babel](http://babeljs.io/docs/plugins/).

Jetez aussi un œil à tous les plugins qui ont été [construits par la communauté](https://www.npmjs.com/search?q=babel-plugin). Si vous souhaitez apprendre comment écrire votre propre plugin, lisez le [Manuel du plugin Babel](plugin-handbook.md).

## <a id="toc-plugin-options"></a>Options du plugin

De nombreux plugins ont aussi des options, cela permet de les configurer afin qu'ils se comportent différemment. Par exemple, plusieurs transformations ont un mode "loose" qui enlève certains comportements de la spécification en faveur d'une solution plus simple et plus performante du code généré.

Pour ajouter des options à un plugin, apportez simplement la modification suivante :

```diff
  {
    "plugins": [
-     "transform-es2015-classes"
+     ["transform-es2015-classes", { "loose": true }]
    ]
  }
```

> Je vais travailler sur les mises à jour de la documentation du plugin pour détailler toutes les options dans les prochaines semaines. [Suivez-moi pour les mises à jour](https://twitter.com/thejameskyle).

## <a id="toc-customizing-babel-based-on-environment"></a>Personnalisation de Babel basé sur l'environnement

Les plugins de Babel solutionnent plusieurs tâches différentes. Nombre d'entre eux sont des outils de développement qui peuvent vous aider à déboguer votre code ou intégrer des outils. Il y a aussi beaucoup de plugins qui sont destinés à optimiser votre code en production.

Pour cette raison, il est fréquent de vouloir avoir une configuration de Babel basée sur l’environnement. Vous pouvez le faire facilement avec votre fichier `.babelrc`.

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

Babel activera la configuration à l’intérieur de `env` par rapport à l’environnement actuel.

L’environnement actuel utilise `process.env.BABEL_ENV`. Quand `BABEL_ENV` n’est pas disponible, il se replit vers `NODE_ENV`, et s'il n’est pas disponible, par défaut c'est `"development"`.

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

> **Remarque :** `[COMMAND]` est celle que vous utilisez pour exécuter Babel (c’est à dire. `babel`, `babel-node` ou peut-être juste `node` si vous utilisez le hook du registre).
> 
> **Astuce :** Si vous souhaitez que votre commande fonctionne à la fois sur des plates-formes unix et windows, utilisez [`cross-env`](https://www.npmjs.com/package/cross-env).

## <a id="toc-making-your-own-preset"></a>Faire votre propre preset

Spécifiez manuellement les plugins ? Options du plugin ? Paramètres basés sur l’environnement ? Toute cette configuration peut vous sembler comme un nombre incalculable de répétition pour tous vos projets.

Pour cette raison, nous encourageons la communauté à créer leurs propres presets. Cela pourrait être un preset pour une [version spécifique de node](https://github.com/leebenson/babel-preset-node5) que vous utilisez, ou peut-être un preset pour [l’ensemble](https://github.com/cloudflare/babel-preset-cf) de votre [entreprise](https://github.com/airbnb/babel-preset-airbnb).

C'est facile de créer un preset. Disons que vous avez ce fichier `.babelrc` :

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

Tout ce que vous devez faire, c'est de créer un nouveau projet, en suivant la convention de nommage `babel-preset-*` (respecter cet espace de nommage) et créer deux fichiers.

Tout d’abord, créez un nouveau fichier `package.json` avec les `dépendances` nécessaires pour votre preset.

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

Puis créez un fichier `index.js` qui exporte le contenu de votre fichier `.babelrc`, en remplaçant les chaines plugin/preset avec des appels avec `require`.

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

Puis publiez simplement cela sur npm et vous pouvez l’utiliser comme vous le feriez pour un preset.

* * *

# <a id="toc-babel-and-other-tools"></a>Babel et les autres outils

Babel est assez simple à installer, une fois qu'on en a pris l'habitude, mais il peut être assez difficile à gérer lorsqu'on veut le mettre en place avec d’autres outils. Cependant, nous essayons de travailler en étroite collaboration avec d’autres projets afin de rendre l’expérience aussi facile que possible.

## <a id="toc-static-analysis-tools"></a>Outils d'analyse statique

Les derniers standards apportent beaucoup de nouvelle syntaxe au langage et les outils d’analyse statique commencent tout juste à en profiter.

### <a id="toc-linting"></a>Linting

Un des outils les plus populaires de linting est [ESLint](http://eslint.org), pour cette raison, nous maintenons une intégration officiel [`babel-eslint`](https://github.com/babel/babel-eslint).

Tout d’abord installer `eslint` et `babel-eslint`.

```sh
$ npm install --save-dev eslint babel-eslint
```

Ensuite, créez ou utilisez le fichier `.eslintrc` existant dans votre projet et définissez `parser` avec la valeur `babel-eslint`.

```diff
  {
+   "parser": "babel-eslint",
    "rules": {
      ...
    }
  }
```

Maintenant, ajoutez une tâche `lint` à vos scripts npm dans le `package.json` :

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

Ensuite, il suffit d'exécuter la tâche et vous aurez tous les réglages.

```sh
$ npm run lint
```

Pour plus d’informations, consultez la documentation de [`babel-eslint`](https://github.com/babel/babel-eslint) ou de [`eslint`](http://eslint.org).

### <a id="toc-code-style"></a>Style de code

> JSC a fusionné avec ESLint, donc vérifiez le style du code avec ESLint.

JSCS est un outil extrêmement populaire pour faire du linting un peu plus poussé en vérifiant le style du code. Un mainteneur principal à la fois du projet Babel et JSCS ([@hzoo](https://github.com/hzoo)) tient à jour une intégration officielle avec JSCS.

Mieux encore, cette intégration maintenant vit elle-même à l'intérieur de JSCS sous l'option `--esnext`. Donc l’intégration Babel est aussi simple que :

    $ jscs . --esnext
    

Depuis la cli, ou en ajoutant l’option `esnext` à votre fichier `.jscsrc`.

```diff
  {
    "preset": "airbnb",
+   "esnext": true
  }
```

Pour plus d’informations, consultez la documentation de [`babel-jscs`](https://github.com/jscs-dev/babel-jscs) ou de [`jscs`](http://jscs.info).

<!--
### Code Coverage

> [WIP]
-->

### <a id="toc-documentation"></a>Documentation

En utilisant Babel, ES2015 et Flow, vous pouvez prélever beaucoup de choses sur votre code. L'utilisation de [documentation.js](http://documentation.js.org) vous permet de générer une documentation détaillée de l'API très facilement.

Documentation.js utilise Babel en arrière plan pour prendre en charge l’ensemble de la syntaxe la plus récente, y compris les annotations de Flow afin de déclarer les types dans votre code.

## <a id="toc-frameworks"></a>Frameworks

Tous les principaux frameworks JavaScript se concentrent maintenant sur l’alignement de leurs API sur le futur du langage. Pour cette raison, il y a beaucoup de travail en cours dans l’outillage.

Les frameworks ont la possibilité non seulement d’utiliser Babel, mais de l’étendre de façon à améliorer l’expérience des utilisateurs.

### <a id="toc-react"></a>React

React a radicalement changé son API pour s’aligner avec les classes de ES2015 ([Lisez la mise à jour de l’API ici](https://babeljs.io/blog/2015/06/07/react-on-es6-plus)). Encore plus fort, React s'appuie sur Babel pour compiler sa syntaxe JSX, en abandonnant son propre outillage personnalisé en faveur de Babel. Vous pouvez commencer en mettant en place le package `babel-preset-react` en suivant les [instructions ci-dessus](#babel-preset-react).

La communauté de React a pris Babel et l'utilise. Il y a maintenant un certain nombre de transformations [construites par la communauté](https://www.npmjs.com/search?q=babel-plugin+react).

Plus particulièrement, le plugin [`babel-plugin-react-transform`](https://github.com/gaearon/babel-plugin-react-transform), qui combiné avec un certain nombre de [transformations spécifique de React](https://github.com/gaearon/babel-plugin-react-transform#transforms), peut permettre des choses comme *le rechargement à chaud de module* et autres utilitaires de débogage.

<!--
### Ember

> [WIP]
-->

## <a id="toc-text-editors-and-ides"></a>IDEs et les éditeurs de texte

L'introduction de la syntaxe ES2015, JSX et Flow avec Babel peut s’avérer utile, mais si votre éditeur de texte ne le supporte pas, alors cela peut être vraiment une mauvaise expérience. Pour cette raison, vous voudrez configurer votre éditeur de texte ou l’IDE avec un plugin de Babel.

  * [Sublime Text](https://github.com/babel/babel-sublime)
  * [Atom](https://atom.io/packages/language-babel)
  * [Vim](https://github.com/jbgutierrez/vim-babel)
  * [WebStorm](https://babeljs.io/docs/setup/#webstorm)

<!--
# Debugging Babel

> [WIP]
-->

* * *

# <a id="toc-babel-support"></a>Support Babel

Babel a une communauté très importante et qui croît rapidement, comme nous grandissons, nous voulons nous assurer que les gens ont toutes les ressources dont ils ont besoin pour réussir. Nous offrons donc un certain nombre de canaux différents pour obtenir du soutien.

N’oubliez pas que, dans l’ensemble de ces communautés, nous appliquons un [Code de conduite](https://github.com/babel/babel/blob/master/CODE_OF_CONDUCT.md). Si vous ne respectez pas le Code de conduite, des mesures seront prises. Alors veuillez le lire et en avoir conscience lorsque vous interagissez avec d’autres personnes.

Nous cherchons aussi à développer une communauté autonome, par des personnes qui restent dans les parages et qui aident les autres. Si vous trouvez quelqu'un qui pose une question, et que vous connaissez la réponse, prenez quelques minutes et aider-le. Faites de votre mieux pour être gentil et compréhensif lorsque vous le faites.

## <a id="toc-babel-forum"></a>Forum Babel

[Discourse](http://www.discourse.org) nous a fourni gratuitement une version hébergée de leur logiciel de forum (et nous les aimons pour cela !). Si les forums sont votre truc, veuillez vous arrêter sur [discuss.babeljs.io](https://discuss.babeljs.io).

## <a id="toc-babel-chat"></a>Tchat Babel

Tout le monde aime [Slack](https://slack.com). Si vous cherchez un soutien immédiat de la communauté, venez discuter avec nous sur [slack.babeljs.io](https://slack.babeljs.io).

<!--
## Babel Stack Overflow

> [WIP]
-->

## <a id="toc-babel-issues"></a>Issues (anomalies) de Babel

Babel utilise le suivi des problèmes fourni par [Github](http://github.com).

Vous pouvez voir tous les problèmes ouverts et fermés sur [Github](https://github.com/babel/babel/issues).

Si vous souhaitez ouvrir une nouvelle issue :

  * [Recherchez dans les issues existantes](https://github.com/babel/babel/issues)
  * [Créez un nouveau rapport de bogue](https://github.com/babel/babel/issues/new) ou [demandez une nouvelle fonctionnalité](https://github.com/babel/babel/issues/new)

### <a id="toc-creating-an-awesome-babel-bug-report"></a>Création d'un génial rapport de bogue

Les issues de Babel peuvent parfois être très difficiles à déboguer à distance, donc nous avons besoin d'un maximum d’aide. Avec quelques minutes supplémentaires, l'élaboration d’un rapport de bogue vraiment sympa permet de résoudre le problème beaucoup plus rapidement.

Tout d’abord, essayez d’isoler votre problème. Il est extrêmement peu probable que chaque partie de votre configuration contribue au problème. Si votre problème est un morceau de code, essayez, en supprimant le plus de code possible, de provoquer toujours un problème.

> \[WIP\] (Travail en cours)

* * *

> ***Pour les prochaines mises à jour, suivez [@thejameskyle](https://twitter.com/thejameskyle) sur Twitter.***