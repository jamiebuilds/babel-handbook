# Manual de usuario de Babel

Este documento abarca todo lo que siempre quizo saber sobre como usar [Babel](https://babeljs.io) y sus herramientas relacionadas.

[![cc-by-4.0](https://licensebuttons.net/l/by/4.0/80x15.png)](http://creativecommons.org/licenses/by/4.0/)

Este manual está disponible en otros idiomas, revise el [README](/README.md) para que pueda visualizar la lista completa.

# Tabla de Contenidos

  * [Introducción](#toc-introduction)
  * [Iniciando Babel](#toc-setting-up-babel) 
      * [`babel-cli`](#toc-babel-cli)
      * [Ejecutar Babel CLI dentro de un proyecto](#toc-running-babel-cli-from-within-a-project)
      * [`babel-register`](#toc-babel-register)
      * [`babel-node`](#toc-babel-node)
      * [`babel-core`](#toc-babel-core)
  * [Configuración de Babel](#toc-configuring-babel) 
      * [`.babelrc`](#toc-babelrc)
      * [`babel-preset-es2015`](#toc-babel-preset-es2015)
      * [`babel-preset-react`](#toc-babel-preset-react)
      * [`babel-preset-stage-x`](#toc-babel-preset-stage-x)
  * [Ejecutar código generado en Babel](#toc-executing-babel-generated-code) 
      * [`babel-polyfill`](#toc-babel-polyfill)
      * [`babel-runtime`](#toc-babel-runtime)
  * [Configuración de Babel (Avanzado)](#toc-configuring-babel-advanced) 
      * [Especificar extensiones manualmente](#toc-manually-specifying-plugins)
      * [Opciones de extensiones](#toc-plugin-options)
      * [Personalizar Babel basado en el entorno](#toc-customizing-babel-based-on-environment)
      * [Haciendo su propio preset](#toc-making-your-own-preset)
  * [Babel y otras herramientas](#toc-babel-and-other-tools) 
      * [Herramientas de análisis estático](#toc-static-analysis-tools)
      * [Linting](#toc-linting)
      * [Estilo de código](#toc-code-style)
      * [Documentación](#toc-documentation)
      * [Frameworks](#toc-frameworks)
      * [React](#toc-react)
      * [Editores de texto e IDEs](#toc-text-editors-and-ides)
  * [Soporte de Babel](#toc-babel-support) 
      * [Foro de Babel](#toc-babel-forum)
      * [Chat de Babel](#toc-babel-chat)
      * [Problemas en Babel](#toc-babel-issues)
      * [Crear un sorprendente reporte de fallos de Babel](#toc-creating-an-awesome-babel-bug-report)

# <a id="toc-introduction"></a>Introducción

Babel es un compilador multi propósito para Java Script. Al usar Babel usted puede usar (y crear) la siguiente generación de JavaScript, así como la siguiente generación de herramientas para JavaScript.

JavaScript es un lenguaje en constante evolución, con nuevas especificaciones, propuestas en camino y nuevas funcionalidades todo el tiempo. Usar Babel le permitirá usar muchas de estás características años antes de que estén disponibles en todos lados.

Babel hace esto al compilar código en JavaScript escrito con los últimos estándares a una versión que funcionará en todos lados hoy. Este proceso es conocido como compilación source-to-source, también conocido como transpiling.

Por ejemplo, Babel puede transformar la nueva función flecha de ES2015 de esto:

```js
const square = n => n * n;
```

A esto:

```js
const square = function square(n) {
  return n * n;
};
```

Sin embargo, Babel puede hacer mucho más que esto porque Babel tiene soporte para extensiones de sintaxis como JSX para React y soporte para la sintaxis de Flow para validación de tipado estático.

Más allá de eso, todo en Babel es simplemente una extensión y cualquiera puede crear sus propias extensiones usando todo el poder de Babel para hacer cualquier cosa que se deseé.

*Aún más allá* que eso, Babel está conformado por un numero de módulos clave que cualquiera puede usar para construir la siguiente generación de herramientas para JavaScript.

Muchas personas hacen eso también, el ecosistema que se ha formado alrededor de Babel es masivo y muy diverso. A lo largo de este manual estaré cubriendo tanto como las herramientas de Babel predefinidas funcionan y algunas cosas útiles alrededor de la comunidad.

> ***Para futuros updates, siga a [@thejameskyle](https://twitter.com/thejameskyle) en Twitter.***

* * *

# <a id="toc-setting-up-babel"></a>Iniciando Babel

Debido a que la comunidad de JavaScript no tiene una sola herramienta, framework o plataforma etc., Babel tiene integraciones oficiales con las herramientas de trabajo más comunes. Todo desde Gulp hasta Browserify, desde Ember a Meteor, no importa como su configuración se vea, existe probablemente una integración oficial.

Para los propósitos de este manual, solo se van a cubrir las partes incorporadas por default para configurar Babel, pero usted puede visitar también la [página de configuración](http://babeljs.io/docs/setup) para todas las integraciones.

> **Nota:** Esta guía usará referencias recurrentes a herramientas de la linea de comandos como `node` y `npm`. Antes de continuar usted debe sentirse cómodo con estas tecnologías.

## <a id="toc-babel-cli"></a>`babel-cli`

Babel CLI es una forma simple de compilar archivos con Babel desde la linea de comandos.

Vamos a instalarlo primero globalmente para aprender lo básico.

```sh
$ npm install --global babel-cli
```

Podemos compilar nuestro primer archivo de esta manera:

```sh
$ babel my-file.js
```

Esto arrojará el archivo compilado directamente a su terminal. Para escribir la salida a un archivo vamos a especificar `--out-file` o `o`.

```sh
$ babel example.js --out-file compiled.js
# o
$ babel example.js -o compiled.js
```

Si deseamos compilar un directorio completo a un nuevo directorio podemos hacerlo usando: `--out-dir` or `-d`.

```sh
$ babel src --out-dir lib
# o
$ babel src -d lib
```

### <a id="toc-running-babel-cli-from-within-a-project"></a>Ejecutar Babel CLI dentro de un proyecto

Si bien usted *puede* instalar Babel CLI globalmente en su máquina, es mucho mejor instalarlo **localmente** en cada proyecto.

Hay dos principales razones para esto.

  1. Diferentes proyectos en la misma máquina pueden depender de diferentes versiones de Babel, permitiéndole a usted actualizar uno por uno.
  2. Esto significa que usted no tiene una dependencia implícita en el ambiente en que usted esta trabajando, haciendo su proyecto más portable y fácil de configurar.

Podemos instalar Babel CLI localmente ejecutando:

```sh
$ npm install --save-dev babel-cli
```

> **Nota:** Puesto que es generalmente una mala idea correr Babel global puede des instalar la copia global:
> 
> ```sh
$ npm uninstall --global babel-cli
```

Después de terminarse de instalar, su archivo `package.json` debería verse algo así:

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "devDependencies": {
    "babel-cli": "^6.0.0"
  }
}
```

Ahora, en vez de ejecutar Babel directamente desde la línea de comandos, vamos a escribir nuestros comandos en **npm scripts** los cuales usarán nuestra versión local.

Simplemente añada el campo `"scripts"` a su paquete `package.json` y ponga el comando de babel dentro como `build`.

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

Ahora desde nuestro terminal podemos correr lo siguiente:

```js
npm run build
```

Esto ejecutará Babel igual que antes, sólo que ahora estamos usando una copia local.

## <a id="toc-babel-register"></a>`babel-register`

El siguiente método más común de ejecutar Babel es a través de `babel-register`. Esta opción te permitirá ejecutar babel solo requiriendo archivos, en esa manera se configurará de mejor manera.

Nótese que esto no quiere decir que sea para uso en Producción. Es considerado una mala practica desplegar código compilado en esa manera. Es muchísimo mejor compilar el código antes de desplegar. Como sea, este trabajo es recomendado para script con el fin de ser ejecutados localmente.

Primero vamos a crear un `index.js` en nuestro proyecto.

```js
console.log("Hello world!");
```

Si fueramos a ejecutar esto con `node index.js` no compilaria con Babel. Así que en lugar de hacer eso, vamos a configurar `babel-register`.

Primero instala `babel-register`.

```sh
$ npm install --save-dev babel-register
```

Siguiente paso, crea un archivo `register.js` en tu proyecto y escribe el siguiente código:

```js
require("babel-register");
require("./index.js");
```

Lo que esto hace es *registrar* Babel en el modulo de sistema en Node y empieza a compilar cada vez que es requerido `` `required` ``.

Ahora, en vez de ejecutar `node index.js` nosotros podemos usar `register.js`.

```sh
$ node register.js
```

> **Nótese** Usted no puede registrar Babel en el mismo archivo tu quieres compilar. Cada nodo es ejecutado antes que Babel ha tenido oportunidad de compilarlo.
> 
> ```js
require("babel-register");
// not compiled:
console.log("Hello world!");
```

## <a id="toc-babel-node"></a>`babel-node`

Si usted esta ejecutando algún código via linea de comandos `node` la forma mas fácil de integrar Babel podría ser usando `babel-node` CLI cual es es un reemplazo para `node` CLI.

Nótese que esto no quiere decir que sea para uso en Producción. Es considerado una mala practica desplegar código compilado en esa manera. Es muchísimo mejor compilar el código antes de desplegar. Como sea, este trabajo es recomendado para script con el fin de ser ejecutados localmente.

Primero asegúrese que ha instalado `babel-cli`.

```sh
$ npm install --save-dev babel-cli
```

> **Note:** If you are wondering why we are installing this locally, please read the [Running Babel CLI from within a project](#toc-running-babel-cli-from-within-a-project) section above.

Entonces reemplace donde sea usted este ejecutando `node` debe ser con `babel-node`.

Si usted esta ejecutando `scripts` con npm, usted puede hacer simplemente esto:

```diff
  {
    "scripts": {
-     "script-name": "node script.js"
+     "script-name": "babel-node script.js"
    }
  }
```

De otra manera, usted tendrá que escribir la localización de `babel-node` en su sistema de archivos.

```diff
- node script.js
+ ./node_modules/.bin/babel-node script.js
```

> Truco: Usted puede usar también [`npm-run`](https://www.npmjs.com/package/npm-run).

## <a id="toc-babel-core"></a>`babel-core`

Si usted necesita usar Babel mediante programación por cualquier razón, usted puede usar `babel-core` en si mismo.

Primero instala `babel-core`.

```sh
$ npm install babel-core
```

```js
var babel = require("babel-core");
```

Si usted tiene una cadena en Javascript puede compilarla directamente usando `babel.transform`.

```js
babel.transform("code();", options);
// => { code, map, ast }
```

Si usted esta trabajando con archivos, usted puede usar también el api asíncrono:

```js
babel.transformFile("filename.js", options, function(err, result) {
  result; // => { code, map, ast }
});
```

O el api síncrono:

```js
babel.transformFileSync("filename.js", options);
// => { code, map, ast }
```

Si usted ya ha usado Babel AST for cualquier razón, podría transformarlo desde AST directamente.

```js
babel.transformFromAst(ast, code, options);
// => { code, map, ast }
```

For all of the above methods, `options` refers to https://babeljs.io/docs/usage/api/#options.

* * *

# <a id="toc-configuring-babel"></a>Configuración de Babel

Usted habrá notado por ahora que ejecutando Babel en si mismo no pareciera hacer nada mas que copiar archivos Javascript de una localización a otra.

Esto es porque nosotros no hemos dicho a Babel hacer nada aún.

> Desde que el propósito general de Babel es compilar que usado en muchísimas formas diferentes, no hace nada por defecto. Usted tiene que decirle explícitamente a Babel que es lo que debería hacer.

Sted puede darle a Babel instrucciones sobre lo que hacer instalando **plugins** o **presets** (grupos de extensiones).

## <a id="toc-babelrc"></a>`.babelrc`

Antes de empezar a decirle a Babel que hacer. Nosotros necesitamos crear un archivo de configuración. Todo lo que usted necesita es crear un archivo `.babelrc` en la raíz de su proyecto. Empezando con algo como esto:

```js
{
  "presets": [],
  "plugins": []
}
```

Este archivo es como usted configuras Babel para hacer lo que usted quiere.

> **Nótese:** Mientras usted puede pasarle opciones a Babel en otras vías diferentes que `.babelrc`, esta es la mejor manera de hacerlo.

## <a id="toc-babel-preset-es2015"></a>`babel-preset-es2015`

Vamos a empezar a decirle a babel que compile de ES2015 (la nueva versión del estándar Javascript, también conocida como ES6) a ES5 (la versión disponible en la mayor parte de los ambientes hoy en día).

Vamos a hacer la instalación del ajuste "es2015" de Babel:

```sh
$ npm install --save-dev babel-preset-es2015
```

Luego vamos modificar nuestro `.babelrc` para incluir nuestro ajuste.

```diff
  {
    "presets": [
+     "es2015"
    ],
    "plugins": []
  }
```

## <a id="toc-babel-preset-react"></a>`babel-preset-react`

Configurando React es muy facil. Solo debemos instalar la libreria de ajuste:

```sh
$ npm install --save-dev babel-preset-react
```

Luego agregar la configuración de ajuste al archivo `.babelrc`:

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

Javascript también dispone algunas propuestas que están en camino de ser estándar a través de el proceso TC39's (el comité técnico detrás del estándar ECMAScript).

El proceso esta dividido en 5 etapas (0-4). Como propuestas ganan mas atracción y tienen mas opciones de ser aceptadas dentro del estándar según van pasando por varias etapas, finalmente son aceptadas en el estándar al llegar a la 4ta etapa.

Estos son los conjuntos en babel para las 4 diferentes ajustes:

  * `babel-preset-stage-0`
  * `babel-preset-stage-1`
  * `babel-preset-stage-2`
  * `babel-preset-stage-3`

> Nótese que no hay stage-4, ya que es considerada simplemente como el ajuste `es2015` de arriba.

Cada una de las ajustes requiere un ajuste posterior definido. Ejemplo. `babel-preset-stage-1` requiere de `babel-preset-stage-2` que a su vez requiere de `babel-preset-stage-3`.

Simplemente instalando las etapas en las que usted esta interesado en usar:

```sh
$ npm install --save-dev babel-preset-stage-2
```

Luego usted puede agregarlas a su archivo `.babelrc` de configuración.

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

# <a id="toc-executing-babel-generated-code"></a>Ejecutar código generado en Babel

Hasta el momento, usted ha compilado código con Babel, pero, esto no es el fin de la historia.

## <a id="toc-babel-polyfill"></a>`babel-polyfill`

Casi toda la sintaxis futurista de Javascript puede ser compilada con Babel, pero, no es lo mismo para los APIs.

Por ejemplo, el siguiente código tiene una función de flecha que necesita ser compilada:

```js
function addAll() {
  return Array.from(arguments).reduce((a, b) => a + b);
}
```

El cual nos retorna en algo así:

```js
function addAll() {
  return Array.from(arguments).reduce(function(a, b) {
    return a + b;
  });
}
```

Como sea, esto no va a funcionar en todos lados porque `Array.from` no existe en todos los ambientes de ejecución de Javascript.

    Uncaught TypeError: Array.from is not a function
    

Para resolver este problema debemos usar algo llamado [Polyfill](https://remysharp.com/2010/10/08/what-is-a-polyfill). Simplemente un polyfill es una pieza de código que replica un comportamiento nativo del api que no existe en el ambiente de ejecución. Permitiéndote usar el APIs mas allá de `Array.from` antes que este disponible.

Babel usa el excelente [core-js](https://github.com/zloirock/core-js) como polyfill, además de un personalizado [regenerator](https://github.com/facebook/regenerator) para poder usar generadores y funciones async.

Para incluir un polyfill en Babel, primero debe instalarlo con npm:

```sh
$ npm install --save babel-polyfill
```

Luego, simplemente incluye el polyfill en la parte superior de cualquiera de los archivos que lo requieran:

```js
import "babel-polyfill";
```

## <a id="toc-babel-runtime"></a>`babel-runtime`

Con el fin de implementar detalles de la especificación de ECAMScript, Babel usara funciones "helper" con el fin the mantener limpio el código generado.

Estos `helpers` pueden llegar a ser muy extensos y son agregados en la parte superior de cada archivo, puedes moverlos en un único ambiente de ejecución `runtime` a parte cuando cuando sean requeridos.

Empieza instalando `babel-plugin-transform-runtime` y `babel-runtime`:

```sh
$ npm install --save-dev babel-plugin-transform-runtime
$ npm install --save babel-runtime
```

Luego, actualiza su `.babelrc`:

```diff
  {
    "plugins": [
+     "transform-runtime",
      "transform-es2015-classes"
    ]
  }
```

Ahora, Babel compilará el código como el siguiente:

```js
class Foo {
  method() {}
}
```

En esto:

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

En vez de poner `_classCallCheck` y `_createClass` en cada archivo cuando son necesitados.

* * *

# <a id="toc-configuring-babel-advanced"></a>Configuración de Babel (Avanzado)

La mayor parte de las personas pueden usar Babel solo con los ajustes incorporados, pero Babel ofrece mucho más poder más que eso.

## <a id="toc-manually-specifying-plugins"></a>Especificar extensiones manualmente

Los ajustes de Babel son simplemente colecciones de extensiones pre-configurados, si usted quiere hacer algo diferente usted puede especificar manualmente extensiones. Esta tarea es muy parecida a la forma de los ajustes.

Primero instalamos la extensión:

```sh
$ npm install --save-dev babel-plugin-transform-es2015-classes
```

Luego agrega el campo `plugins` en tu `.babelrc`.

```diff
  {
+   "plugins": [
+     "transform-es2015-classes"
+   ]
  }
```

Esto le da un control refinado sobre la transformación exacta que usted esta ejecutando.

Para una lista completa de extensiones vea la [página de extensiones de Babel](http://babeljs.io/docs/plugins/).

También eche un ojo a todos las extensiones que han sido construidos [por la comunidad](https://www.npmjs.com/search?q=babel-plugin). Si usted le gustaria aprender como escribir su propio plugin lea el [Babel Plugin Handbook](plugin-handbook.md).

## <a id="toc-plugin-options"></a>Opciones de extensiones

Muchos de los plugin también son opciones de configuración que se comportan diferente. Por ejemplo, muchas transformaciones tienen un modo de "loose" cuando reduce el comportamiento de la especificación en favor the una simple y mejor rendimiento de código generado.

Para agregar opciones al plugin, simplemente tiene que hacer el siguiente cambio:

```diff
  {
    "plugins": [
-     "transform-es2015-classes"
+     ["transform-es2015-classes", { "loose": true }]
    ]
  }
```

> Voy a estar trabajando en actualizaciones the la documentación de extensiones para detallar cada opción en la siguientes semanas. [Sígueme para obtener las actualizaciones](https://twitter.com/thejameskyle).

## <a id="toc-customizing-babel-based-on-environment"></a>Personalizar Babel basado en el entorno

Las extensiones de Babel resuelve muchas tareas diferentes. Muchos de ellos son herramientas de desarrollo que pueden ayudar a debuguear su código o integración con herramientas. Hay también muchas extensiones que solo se enfocan en optimizar su código en producción.

Para esta razón, es común que quieras una configuración de Babel basado en un ambiente. Usted puede fácilmente hacerlo en su archivo `.babelrc`.

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

Babel habilitará una configuración dentro de `env` basado en su ambiente actual.

El ambiente actual usara `process.env.BABEL_ENV`. Cuando `BABEL_ENV` no este disponible, se usara como ultimo recurso `NODE_ENV`, y si tampoco esta disponible por defecto será `"development"`.

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

> **Nótese:**`[COMMAND]` es cualquier cosa que usted ejecute en Babel. (ie. `babel`, `babel-node`, o tal vez solo `node` si usted esta usando el enganche).
> 
> **Truco**: Si usted quiere su commando funcione en multi-plataforma unix y windows entonces use [`cross-env`](https://www.npmjs.com/package/cross-env).

## <a id="toc-making-your-own-preset"></a>Haciendo su propio preset

Especificar extensiones manualmente? Opciones en extensiones? Configuración parametrizada? Todas estas configuraciones podrían llegar a ser toneladas de duplicaciones en todos sus proyectos.

For esta razón, nosotros animamos a la comunidad a crear sus propios ajustes. Esto podria ser un ajuste especifico [node version](https://github.com/leebenson/babel-preset-node5) que ustead ejecutando, o tal vez un ajuste para [toda](https://github.com/cloudflare/babel-preset-cf) su [compañia](https://github.com/airbnb/babel-preset-airbnb).

Es fácil crear un ajuste, tenemos el archivo `.babelrc`:

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

Todo lo que usted necesita hacer es crear un nuevo proyecto siguiendo la convención de nombre `babel-preset-*` (por favor sea responsable con el espacio de nombre), y cree dos archivos.

Primero, cree un archivo nuevo `package.json` con las `dependencies` para su ajuste.

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

Luego, cree un archivo `index.js` que exportará el contenido a su archivo `.babelrc`, reemplace su plugin/preset strings con la llamada `require`.

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

Después, simplemente publique en npm y usted podría usarlo como cualquier otro ajuste.

* * *

# <a id="toc-babel-and-other-tools"></a>Babel y otras herramientas

En Babel es bastante sencillo configurar una vez te enganchas de el, pero puede ser mas bien difícil ver la manera en que se configura con otras herramientas. Como sea, nosotros tratamos de trabajar de cerca con otros proyectos con el fine the hacer esta experiencia lo mas fácil posible.

## <a id="toc-static-analysis-tools"></a>Herramientas de análisis estático

Nuevos estándares traen mucha nueva sintaxis al lenguaje y herramientas análisis estático están empezando a tomar ventaja de ello.

### <a id="toc-linting"></a>Linting

Una de las herramientas mas populares es [ ESLint](http://eslint.org), debido a esto nosotros mantenemos la integración oficial [`babel-eslint`](https://github.com/babel/babel-eslint).

Primero instala `eslint` y `babel-eslint`.

```sh
$ npm install --save-dev eslint babel-eslint
```

Luego crea o usa el archivo existente `.eslintrc`en tu proyecto y configura el `parser` y `babel-eslint`.

```diff
  {
+   "parser": "babel-eslint",
    "rules": {
      ...
    }
  }
```

Ahora agrega la tarea `lint` en tus scripts del`package.json` en npm:

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

Luego solo ejecuta la tarea y tu ya habrás configurado todo.

```sh
$ npm run lint
```

Para mas información consulta la documentación [`babel-eslint`](https://github.com/babel/babel-eslint) o [`eslint`](http://eslint.org).

### <a id="toc-code-style"></a>Estilo de código

> JSCS has merged with ESLint, so checkout Code Styling with ESLint.

JSCS es una herramienta extremadamente popular para ir mas alla de revisar el estilo de código en si mismo. Un contribuidor del core de Babel y JSCS ([@hzoo](https://github.com/hzoo)) mantiene la integración oficial de JSCS.

Incluso mejor, esta integración vive ahora dentro de JSCS debajo de la opcion `--esnext`. Así que integrar Babel es incluso mas fácil:

    $ jscs . --esnext
    

Desde la linea de comando o agregando la opcion `esnext` en el archivo `.jscsrc`.

```diff
  {
    "preset": "airbnb",
+   "esnext": true
  }
```

Para mas informacion consulta la documentación [`babel-jscs`](https://github.com/jscs-dev/babel-jscs) o [`jscs`](http://jscs.info).

<!--
### Code Coverage

> [WIP]
-->

### <a id="toc-documentation"></a>Documentación

Usando Babel, ES2015, y Flow usted puede you can inferir mucho en su código. Usando [documentation.js](http://documentation.js.org) usted puede generar una documentación de su API detallado muy fácilmente.

Documentation.js usa Babel entre bastidores para soportar lo ultimo en sintaxis incluyendo la ultima anotaciones y sintaxis de Flow con el fin de declarar "types" en su código.

## <a id="toc-frameworks"></a>Frameworks

La gran mayoría de los frameworks de Javascript están enfocados ahora a alinear sus API alrededor del futuro del lenguaje. Debido a esto, ha habido mucho trabajo en la herramienta.

Frameworks tienen la oportunidad no solo de usar Babel, pero extendiéndolo con el fin de mejorar la experiencia de sus usuarios.

### <a id="toc-react"></a>React

React ha cambiado dramáticamente su API alienándolo con con classes de ES2015 ([Lee sobre la actualización de su API aquí](https://babeljs.io/blog/2015/06/07/react-on-es6-plus)). Incluso mas allá, React confía en Babel para compilar su sintaxis JSX devaluando su antigua herramienta en favor de Babel. Usted puede empezar configuración el paquete `babel-preset-react` siguiendo las [instrucciones arriba](#babel-preset-react).

La comunidad de React ha tomado took Babel y han avanzado con el. Hay ahora un gran número de transformaciones [construidas por la comunidad](https://www.npmjs.com/search?q=babel-plugin+react).

Mas notablemente el plugin [`babel-plugin-react-transform`](https://github.com/gaearon/babel-plugin-react-transform) que combinado con un numero de [React-specific transforms](https://github.com/gaearon/babel-plugin-react-transform#transforms) pueden permitir cosas como *módulo de recarga instantánea* y otras herramientas para debuguear.

<!--
### Ember

> [WIP]
-->

## <a id="toc-text-editors-and-ides"></a>Editores de texto e IDEs

Presentar ES2015, JSX, y la sintaxis Flow con Babel puede ser de mucha ayuda, pero si su editor de texto no lo soporta entonces puede convertirse en una mala experiencia. Por esta razón, usted querrá configurar su editor de texto o IDE con e plugin de Babel.

  * [Sublime Text](https://github.com/babel/babel-sublime)
  * [Atom](https://atom.io/packages/language-babel)
  * [Vim](https://github.com/jbgutierrez/vim-babel)
  * [WebStorm](https://babeljs.io/docs/setup/#webstorm)

<!--
# Debugging Babel

> [WIP]
-->

* * *

# <a id="toc-babel-support"></a>Soporte de Babel

Babel ha tenido un crecimiento rápido y grande en la comunidad, a medida que crecemos nosotros queremos asegurarnos que la gente tiene todos los recursos que necesita para ser éxito. Así que nosotros proveemos un numero de canales diferentes para obtener soporte.

Recuerde que a través de las comunidades nosotros hacemos cumplir el [Código de Conducta](https://github.com/babel/babel/blob/master/CODE_OF_CONDUCT.md). Si usted no cumple con el Código de Conducta, acciones serán tomadas. Asi que por favor, lea cuidadosamente y sea responsable cuando usted interactúa con otros.

Nosotros también buscamos el crecimiento entre la comunidad para ayudarse mutuamente, para gente que busca ayuda en otros. Si usted encuentra alguien preguntando al que usted puede responder, tómese unos minutos para ayudarle. Trate de ser dar lo mejor para ser amable y comprensible en el proceso.

## <a id="toc-babel-forum"></a>Foro de Babel

</a>Discourse</0> nos ha proveído una version alojada para nuestro foro gratuitamente (y los amamos por ello ¡¡). Si el foro es mas de lo suyo, haga una parada por [discuss.babeljs.io](https://discuss.babeljs.io).

## <a id="toc-babel-chat"></a>Chat de Babel

Todo el mundo ama [Slack](https://slack.com). Si used esta buscando por ayuda inmediata de la comunidad entonces venga a chatear con nosotros en [slack.babeljs.io](https://slack.babeljs.io).

<!--
## Babel Stack Overflow

> [WIP]
-->

## <a id="toc-babel-issues"></a>Problemas en Babel

Babel uses the issue tracker provided by [Github](http://github.com).

You can see all the open and closed issues on [Github](https://github.com/babel/babel/issues).

Si usted desea abrir la resolución de un nuevo fallo:

  * [Busca por un error existente](https://github.com/babel/babel/issues)
  * [Create a new bug report](https://github.com/babel/babel/issues/new) or [request a new feature](https://github.com/babel/babel/issues/new)

### <a id="toc-creating-an-awesome-babel-bug-report"></a>Crear un sorprendente reporte de fallos de Babel

Los fallos en Babel pueden ser a veces muy difíciles de probar en remoto, así que necesitamos toda la ayuda que podamos tener. Tomándose unos minutos para detallar el reporte de un fallo puede ayudar que su problema sea resuelto significativamente más rápido.

Primero, trata de aislar su problema. Es extremadamente It's extremely improvable que cada parte de tu configuración contribuya al problema. Si su problema es un trozo de código, trate de eliminar la mayor cantidad de código posible que pueda causar el problema.

> [WIP]

* * *

> ***Para futuras actualizaciones, sigue a [@thejameskyle](https://twitter.com/thejameskyle) en Twitter.***