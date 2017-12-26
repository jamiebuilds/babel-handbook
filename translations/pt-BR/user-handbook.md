# Manual do Usuário do Babel

Este documento abrange tudo o que você sempre quis saber sobre a utilização do [Babel](https://babeljs.io) e ferramentas relacionadas.

[![cc-by-4.0](https://licensebuttons.net/l/by/4.0/80x15.png)](http://creativecommons.org/licenses/by/4.0/)

Este manual está disponível em outros idiomas, consulte o [arquivo Leia-me](/README.md) para obter uma lista completa.

# Tabela de Conteúdos

  * [Introdução](#toc-introduction)
  * [Configurando o Babel](#toc-setting-up-babel) 
      * [`babel-cli`](#toc-babel-cli)
      * [Usando o "babel-cli" em um projeto](#toc-running-babel-cli-from-within-a-project)
      * [`babel-register`](#toc-babel-register)
      * [`babel-node`](#toc-babel-node)
      * [`babel-core`](#toc-babel-core)
  * [Configurando o Babel](#toc-configuring-babel) 
      * [`.babelrc`](#toc-babelrc)
      * [`babel-preset-es2015`](#toc-babel-preset-es2015)
      * [`babel-preset-react`](#toc-babel-preset-react)
      * [`babel-preset-state-x`](#toc-babel-preset-stage-x)
  * [Executando o código gerado pelo Babel](#toc-executing-babel-generated-code) 
      * [`babel-polyfill`](#toc-babel-polyfill)
      * [`babel-runtime`](#toc-babel-runtime)
  * [Configurando Babel (Avançado)](#toc-configuring-babel-advanced) 
      * [Adicionando plugins manualmente](#toc-manually-specifying-plugins)
      * [Opções de configurações dos plugins](#toc-plugin-options)
      * [Personalizando Babel com variáveis de ambiente](#toc-customizing-babel-based-on-environment)
      * [Criando suas próprias predefinições (presets)](#toc-making-your-own-preset)
  * [Babel e outras ferramentas](#toc-babel-and-other-tools) 
      * [Ferramentas de análise estática](#toc-static-analysis-tools)
      * [Usando Eslint](#toc-linting)
      * [Usando JSCS](#toc-code-style)
      * [Documentação](#toc-documentation)
      * [Frameworks](#toc-frameworks)
      * [React](#toc-react)
      * [IDE's e editores de texto](#toc-text-editors-and-ides)
  * [Procurando ajuda](#toc-babel-support) 
      * [Fóruns](#toc-babel-forum)
      * [Salas de bate-papo](#toc-babel-chat)
      * [Reportando problemas](#toc-babel-issues)
      * [Criando relatórios de bug incríveis](#toc-creating-an-awesome-babel-bug-report)

# <a id="toc-introduction"></a>Introdução

Babel é um compilador genérico multifuncional de JavaScript. Usando o Babel, você pode usar (e criar) a próxima geração do JavaScript, além da próxima geração da ferramenta do JavaScript.

JavaScript é uma linguagem que está em constante desenvolvimento, com novas especificações e propostas vindas com novas funcionalidades o tempo todo. A utilização do Babel vai lhe auxiliar na utilização de muitas funcionalidades muito antes de elas estarem disponíveis de forma abrangente.

O Babel faz isso compilando o código JavaScript escrito com os últimos padrões em uma versão que funcionará de forma abrangente. Esse processo é conhecido como compilação de código para código, também conhecido como transpiling em inglês.

O Babel pode transformar, por exemplo, a nova sintaxe de função de seta do ES2015 disso:

```js
const square = n => n * n;
```

Para isso:

```js
const square = function square(n) {
  return n * n;
};
```

No entanto, Babel pode oferecer muito mais do que isso, já que o Babel tem suporte a extensão de sintaxe, como a sintaxe JSX para React e o suporte a sintaxe Flow para avaliação de tipo estático.

Além disso, tudo no Babel é simplesmente um plugin e qualquer um pode criar seu próprio plugin usando a força do Babel para fazer o que quiser.

*Muito além* disso, Babel é formado por um número de módulos principais que qualquer um pode usar para construir a próxima geração da ferramenta JavaScript.

E muitas pessoas o fazem, por isso, surgiu um enorme e diversificado ecossistema de ferramentas em torno do Babel. Em todo esse manual, vamos aborda as ferramentas embutidas no Babel e também alguns recursos úteis da comunidade.

> ***Para futuras atualizações, siga [@thejameskyle](https://twitter.com/thejameskyle) no Twitter.***

* * *

# <a id="toc-setting-up-babel"></a>Configurando o Babel

Já que a comunidade JavaScript não possui uma única ferramenta de construção, framework, plataforma, etc., Babel possui integrações oficiais para todas as maiores ferramentas. Tudo desde Gulp até Browserify, de Ember até Meteor, não importa como está sua configuração, existe provavelmente uma integração oficial.

Para mérito desse livro, vamos cobrir apenas os métodos padrões já embutidos no Babel para integração, mas você pode visitar a [página de configuração interativa](http://babeljs.io/docs/setup) para visualizar todas as integrações.

> **Nota:** Esse guia usa ferramentas de linha de comando como `node` e `npm`. Antes de seguir adiante, você deve familiarizar-se com essas ferramentas.

## <a id="toc-babel-cli"></a>`babel-cli`

O Cliente do Babel é uma maneira simples de compilar arquivos com o Babel na linha de comando.

Vamos primeiramente instalá-lo globalmente para aprender o básico.

```sh
$ npm install --global babel-cli
```

Nós podemos compilar nosso primeiro arquivo assim:

```sh
$ babel my-file.js
```

Isso irá colocar colocar o arquivo de saída compilado diretamente em seu terminal. Para escrevê-lo em um arquivo, nós iremos especificar um arquivo de saída utilizando a opção `--out-file` ou `-o`.

```sh
$ babel example.js --out-file compiled.js
# ou
$ babel example.js -o compiled.js
```

Se quisermos compilar um diretório inteiro em uma novo diretório, nós podemos fazê-lo com `--out-dir` ou `-d`.

```sh
$ babel src --out-dir lib
# ou
$ babel src -d lib
```

### <a id="toc-running-babel-cli-from-within-a-project"></a>Executando o Babel CLI em um projeto

Embora você *possa* instalar o Cliente do Babel globalmente na sua máquina, é mais recomendável fazer a instalação **localmente** projeto por projeto.

Há duas razões principais para isso:

  1. Diferentes projetos na mesma máquina podem depender de versões diferentes do Babel, o que lhe possibilita atualizar um projeto de cada vez.
  2. Isso significa que você não tem uma dependência implícita do ambiente em que está trabalhando. Isso torna seu projeto mais portável e fácil de configurar.

Nós podemos instalar o Cliente do Babel localmente com o seguinte comando:

```sh
npm install --save-dev babel-cli
```

> **Nota:** Como geralmente é uma má idéia executar Babel globalmente, você pode querer desinstalar a cópia global executando:
> 
> ```sh
$ npm uninstall --global babel-cli
```

Quando o procedimento terminar, o arquivo `package.json` deve ficar assim:

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "devDependencies": {
    "babel-cli": "^6.0.0"
  }
}
```

Agora ao invés de rodar o Babel diretamente da linha de comando, nós iremos colocar nossos comandos no **npm scripts**, o qual irá usar nossa versão local.

Adicione o campo `"scripts"` no seu `package.json` e coloque o comando dentro da chave `"build"`.

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

Agora, do nosso terminal, podemos usar:

```js
npm run build
```

Isso irá rodar o Babel da mesma maneira como no exemplo anterior, porém, agora usando a versão local.

## <a id="toc-babel-register"></a>`babel-register`

O próximo jeito mais comum de rodar o Babel é através do `babel-register`. Essa opção vai permitir que você use Babel em tempo de execução, o que facilita a integração no seu ambiente.

Nota, isso não é recomendado para uso em produção. Usar código que é compilado em tempo de execução é uma má prática. É muito melhor compilar seu código antes de enviar para produção. Porém, dessa maneira, fica fácil criar e testar scripts localmente.

Primeiro, vamos criar nosso arquivo `index.js` em nosso projeto.

```js
console.log("Hello world!");
```

Se rodarmos nosso arquivo, `node index.js`, ele não será compilado por Babel. Ao invés disso, precisamos adicionar `babel-register`.

Primeiro, vamos instalar `babel-register`.

```sh
$ npm install --save-dev babel-register
```

Agora, vamos criar o arquivo `register.js` no projeto, e escrever o seguinte:

```js
require("babel-register");
require("./index.js");
```

O que esse arquivo faz é registrar o Babel no sistema de módulos do Node, com isso, ele compila qualquer arquivo que seja importado usando *required*.

E agora, ao invés de usarmos `node index.js`, vamos usar `register.js`.

```sh
$ node register.js
```

> **Nota:** Você não pode registrar o Babel no mesmo arquivo que você deseja compilar. O sistema de módulos do Node vai executar o arquivo antes do Babel compilá-lo.
> 
> ```js
require("babel-register");
// not compiled:
console.log("Hello world!");
```

## <a id="toc-babel-node"></a>`babel-node`

Se você estiver executando algum código pela CLI do `node`, a maneira mais fácil de integrar Babel é utilizar a CLI `babel-node`, que, em grande parte, é um ótimo substituto para a CLI do `node`.

Nota, isso não é recomendado para uso em produção. Usar código que é compilado em tempo de execução é uma má prática. É muito melhor compilar seu código antes de enviar para produção. Porém, dessa maneira, fica fácil criar e testar scripts localmente.

Primeiramente, tenha certeza que você tem `babel-cli` instalado.

```sh
npm install --save-dev babel-cli
```

> **Nota:** Se você está se perguntando por que estamos instalando isso localmente, leia a seção acima, [executando a CLI do Babel dentro de um projeto](#toc-running-babel-cli-from-within-a-project).

Em seguida, substitua todas as declarações `node` por `babel-node`.

Se você estiver usando npm `scripts`, você pode simplesmente fazer:

```diff
  {
    "scripts": {
-     "script-name": "node script.js"
+     "script-name": "babel-node script.js"
    }
  }
```

Caso contrário, você precisará declarar o caminho completo para o `babel-node`.

```diff
- node script.js
+ ./node_modules/.bin/babel-node script.js
```

> Dica: Você também pode usar o [`npm-run`](https://www.npmjs.com/package/npm-run).

## <a id="toc-babel-core"></a>`babel-core`

Se por algum motivo, você precisar usar o Babel programaticamente, você pode usa-lo através do pacote `babel-core`.

Primeiro, instale o `babel-core`.

```sh
$ npm install babel-core
```

```js
var babel = require("babel-core");
```

Se você tiver uma string, você pode compila-la diretamente usando `babel.transform`.

```js
babel.transform("code();", options);
// => { code, map, ast }
```

Se você estiver trabalhando com arquivos, você também pode usar a Api assíncrona:

```js
babel.transformFile("filename.js", options, function(err, result) {
  result; // => { code, map, ast }
});
```

Ou a Api síncrona:

```js
babel.transformFileSync("filename.js", options);
// => { code, map, ast }
```

Se você já tiver uma Babel AST, você pode transforma-la diretamente usando.

```js
babel.transformFromAst(ast, code, options);
// => { code, map, ast }
```

Para todos os métodos acima, o parâmetro, `options`, refere-se ao: https://babeljs.io/docs/usage/api/#options.

* * *

# <a id="toc-configuring-babel"></a>Configurando o Babel

Agora você já deve ter notado que, usando Babel por conta própria, parece que estamos apenas copiando arquivos de um local para o outro.

Isso é porque não falamos para o Babel o que ele deve fazer.

> Babel é um compilador de propósitos gerais, que é usado em uma infinidade de maneiras diferentes, ele não faz nada por padrão. Você deve, explicitamente, dizer o que o Babel deve fazer.

Você pode dar instruções sobre o que o Babel deve fazer, através da instalação de **plugins** ou **presets** (grupo de plugins).

## <a id="toc-babelrc"></a>`.babelrc`

Antes de começar a falar para o Babel, o que ele deve fazer. Precisamos criar um arquivo de configuração. Tudo o que você precisa fazer é criar o arquivo `.babelrc` na raíz do seu projeto. Começando assim:

```js
{
  "presets": [],
  "plugins": []
}
```

Essa é a maneira de configurar o Babel e dizer o que ele deve fazer.

> **Nota:** Você também pode passar opções para o Babel de outras formas, porém, a melhor maneira é utilizar a convenção do arquivo `.babelrc`.

## <a id="toc-babel-preset-es2015"></a>`babel-preset-es2015`

Vamos começar falando para o Babel compilar ES2015 (a nova versão do JavaScript, também conhecida como ES6) para ES5 (a versão disponível na maioria dos ambientes de hoje em dia).

Vamos fazer isso através da instalação do preset "es2015":

```sh
$ npm install --save-dev babel-preset-es2015
```

Em seguida, vamos modificar nosso arquivo `.babelrc` para incluir o preset.

```diff
  {
    "presets": [
+     "es2015"
    ],
    "plugins": []
  }
```

## <a id="toc-babel-preset-react"></a>`babel-preset-react`

Configurar o React é tão fácil como. Basta instalar o preset:

```sh
$ npm install --save-dev babel-preset-react
```

E adicionar o preset no seu arquivo `.babelrc`:

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

Existem algumas propostas de padrões e funcionalidades em processo para futuras versões do JavaScript, definidas através do TC39 (comitê técnico responsável pelo padrão ECMAScript).

Esse processo contém 5 etapas (0-4). Conforme as propostas vão ganhando mais força e são propensas a serem aceitas como novos padrões, elas vão subindo de estágios até serem finalmente aceitas na etapa 4.

Essas etapas estão agrupadas no Babel em 4 diferentes presets:

  * `babel-preset-stage-0`
  * `babel-preset-stage-1`
  * `babel-preset-stage-2`
  * `babel-preset-stage-3`

> Observe que não há nenhum estágio 4, que é simplesmente o novo padrão já contido no preset `es2015` acima.

Cada um desses presets precisam do preset do seu estágio posterior, o seja, `babel-preset-stage-1` precisa do `babel-preset-stage-2` que precisa do `babel-preset-stage-3`.

Para utiliza-lo, simplesmente instale o preset que você deseja usar:

```sh
$ npm install --save-dev babel-preset-stage-2
```

Em seguida, você pode adicioná-lo no seu arquivo `.babelrc`.

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

# <a id="toc-executing-babel-generated-code"></a>Executando o código gerado pelo Babel

Então você compilou seu código com Babel? Bom, esse não é o final da história.

## <a id="toc-babel-polyfill"></a>`babel-polyfill`

Quase todas as propostas para futuras funcionalidades do JavaScript podem ser compiladas pelo Babel, porém, o mesmo não é verdade para suas APIs.

Por exemplo, o código a seguir faz uso das "arrow functions", e precisa ser compilado:

```js
function addAll() {
  return Array.from(arguments).reduce((a, b) => a + b);
}
```

Que o transforma em:

```js
function addAll() {
  return Array.from(arguments).reduce(function(a, b) {
    return a + b;
  });
}
```

No entando, ele ainda não vai funcionar em todos os lugares porque `Array.from` não existe em todos os ambientes JavaScript.

    Uncaught TypeError: Array.from is not a function
    

Para resolver esse problema, precisamos usar um [Polyfill](https://remysharp.com/2010/10/08/what-is-a-polyfill). Resumindo, um polyfill é um pedaço de código que replica uma Api nativa, caso ela não exista na execução atual. Permitindo que você use APIs como `Array.from` antes de estarem disponíveis.

Babel usa o excelente [core-js](https://github.com/zloirock/core-js) como seu polyfill, juntamente com uma versão customizada do [regenerator](https://github.com/facebook/regenerator), que permite a utilização de "generators" e "async functions".

Para usar o polyfill do Babel, simplesmente instale-o através do npm:

```sh
$ npm install --save babel-polyfill
```

E simplesmente o adicione no topo de todos os arquivos que irão precisar de polyfill:

```js
import "babel-polyfill";
```

## <a id="toc-babel-runtime"></a>`babel-runtime`

Para implementar os detalhes das especificações do ECMAScript, Babel se utilizará de métodos "auxiliares" para manter o código gerado mais limpo.

Esses códigos auxiliares podem ser muito longos, e eles são adicionados no topo de cada arquivo. Para evitar esse trabalho, podemos incluir um único "runtime" que será utilizado, automáticamente, quando necessário.

Comece instalando `babel-plugin-transform-runtime` e `babel-runtime`:

```sh
$ npm install --save-dev babel-plugin-transform-runtime
$ npm install --save babel-runtime
```

Em seguida, atualize seu `.babelrc`:

```diff
  {
    "plugins": [
+     "transform-runtime",
      "transform-es2015-classes"
    ]
  }
```

Agora, Babel irá compilar um código como esse:

```js
class Foo {
  method() {}
}
```

Gerando:

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

Poupando o trabalho de colocar `_classCallCheck` e `_createClass` em cada arquivo onde são necessários.

* * *

# <a id="toc-configuring-babel-advanced"></a>Configurando Babel (Avançado)

A maioria das pessoas, usam Babel apenas com seus presets padrões, porém, Babel expõe um controle muito maior que isso, vamos ver a seguir.

## <a id="toc-manually-specifying-plugins"></a>Adicionando plugins manualmente

Os presets, são simplesmente, coleções de plugins pré-configurados, se você quiser fazer algo diferente, você deve especificar manualmente os plugins. Onde obtemos o funcionamento semelhante ao dos presets.

Primeiro, instale o plugin:

```sh
$ npm install --save-dev babel-plugin-transform-es2015-classes
```

Em seguida, adicione o campo `plugins` no seu `.babelrc`.

```diff
  {
+   "plugins": [
+     "transform-es2015-classes"
+   ]
  }
```

Isso lhe dá um controle mais refinado sobre as transformações que você deseja executar.

Para obter uma lista completa de plugins oficiais, consulte a [página de plugins do Babel](http://babeljs.io/docs/plugins/).

Dê uma olhada também, em todos os plugins que foram [construídos pela comunidade](https://www.npmjs.com/search?q=babel-plugin). Se você quer aprender como escrever seu próprio plugin leia o [Manual de plugins do Babel](plugin-handbook.md).

## <a id="toc-plugin-options"></a>Opções de configurações dos plugins

Muitos plugins também tem opções para configurá-los para um comportamento diferente. Por exemplo, muitas transformações têm um modo "loose", que remove algumas especificações em favor de um código final mais simples e de alto desempenho.

Para adicionar essas opções a um plugin, simplesmente faça a seguinte alteração:

```diff
  {
    "plugins": [
-     "transform-es2015-classes"
+     ["transform-es2015-classes", { "loose": true }]
    ]
  }
```

> Vou estar trabalhando nas atualizações da documentação de plugins, melhorando os detalhes de cada opção nas próximas semanas. [Siga-me para saber mais](https://twitter.com/thejameskyle).

## <a id="toc-customizing-babel-based-on-environment"></a>Personalizando Babel com variáveis de ambiente

Os plugins do Babel resolvem muitas tarefas diferentes. Muitos deles são ferramentas de desenvolvimento que podem ajudá-lo a depurar seu código ou integrar com ferramentas. Há também um monte de plugins que são focados na otimização do seu código para produção.

Por esta razão, é comum querer configurar o Babel com base no seu ambiente. Você pode fazer isso facilmente com seu arquivo `.babelrc`.

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

Babel permitirá configurações dentro do `env`, com base no ambiente atual.

Você pode checar o ambiente atual usando pelo Babel com `process.env.BABEL_ENV`. Quando `BABEL_ENV` não estiver disponível, será usado `NODE_ENV` e, se também não estiver disponível, por padrão, será usado "development".

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

> **Nota:** `[COMMAND]` é o que você irá usar para executar o Babel (ex: `babel`, `babel-node` ou talvez apenas `node`, caso você esteja usando algum atalho).
> 
> **Dica:** Se você deseja que seu comando funcione em plataformas unix e windows, você pode usar [`cross-env`](https://www.npmjs.com/package/cross-env).

## <a id="toc-making-your-own-preset"></a>Criando suas próprias predefinições (presets)

Especificando manualmente plugins? Opções de plugins? Configurações baseadas no ambiente? Toda esta configuração pode parecer como uma tonelada de repetição para todos os seus projetos.

Por este motivo, incentivamos a comunidade para criar suas próprias predefinições. Isto pode ser uma predefinição específica para a versão do [node](https://github.com/leebenson/babel-preset-node5) que estiver executando, ou talvez uma predefinição para [sua](https://github.com/cloudflare/babel-preset-cf) [empresa](https://github.com/airbnb/babel-preset-airbnb).

É fácil criar uma predefinição. Vamos dizer que você tenha este arquivo `.babelrc`:

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

Tudo o que você precisa fazer é criar um novo projeto seguindo a convenção de nomenclatura `babel-preset-*` (por favor, seja responsável isso) e criar dois arquivos.

Primeiro, crie um novo arquivo `package.json` com as `dependências` necessárias para a sua predefinição.

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

Em seguida, crie um arquivo `index.js` que exporta o mesmo conteúdo do seu arquivo `.babelrc` em formato compatível com `módulos node`.

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

Então, simplesmente publique isso no npm e você pode usá-lo como faria com qualquer preset.

* * *

# <a id="toc-babel-and-other-tools"></a>Babel e outras ferramentas

Babel é bastante simples de instalar, uma vez que você pegar o jeito, mas, pode ser um pouco difícil de entender como configurá-lo com outras ferramentas. No entanto, tentamos trabalhar estreitamente com outros projetos para tornar a experiência mais simples possível.

## <a id="toc-static-analysis-tools"></a>Ferramentas de análise estática

Padrões mais recentes trazem várias novidades para a sintaxe do JavaScript e ferramentas de análise estática estão apenas começando a tirar vantagem disso.

### <a id="toc-linting"></a>Usando Eslint

Uma das ferramentas mais populares para linting é o [ESLint](http://eslint.org), por isso mantemos uma integração oficial [`babel-eslint`](https://github.com/babel/babel-eslint).

Primeiro, instale o `eslint` e `babel-eslint`.

```sh
$ npm install --save-dev eslint babel-eslint
```

Em seguida, crie ou use o arquivo `.eslintrc` existente em seu projeto e defina o `parser` como `babel-eslint`.

```diff
  {
+   "parser": "babel-eslint",
    "rules": {
      ...
    }
  }
```

Agora adicione uma tarefa `lint` no seus npm scripts do `package.json`:

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

Em seguida, basta executar a tarefa, e você verá a mágica acontecer.

```sh
$ npm run lint
```

Para obter mais informações, consulte a documentação do [`babel-eslint`](https://github.com/babel/babel-eslint) ou [`eslint`](http://eslint.org).

### <a id="toc-code-style"></a>Usando JSCS

> JSCS has merged with ESLint, so checkout Code Styling with ESLint.

JSCS é uma ferramenta extremamente popular para levar o linting um passo adiante e verificar o estilo do próprio código. Um dos desenvolvedores responsável por manter o Babel e JSCS ([@hzoo](https://github.com/hzoo)), cuida da integração oficial com o JSCS.

E unindo ainda mais os projetos, essa integração agora faz parte do JSCS, utilizando a opção `--esnext`. Então, integrar o Babel é tão fácil quanto:

    $ jscs . --esnext
    

E saindo da linha de comando, adicione a opção `esnext` no seu arquivo `.jscsrc`.

```diff
  {
    "preset": "airbnb",
+   "esnext": true
  }
```

Para obter mais informações, consulte a documentação do [`babel-jscs`](https://github.com/jscs-dev/babel-jscs) ou [`jscs`](http://jscs.info).

<!--
### Code Coverage

> [WIP]
-->

### <a id="toc-documentation"></a>Documentação

Usando o Babel, ES2015 e Flow, você pode inferir muito sobre seu código. Usando [documentation.js](http://documentation.js.org) você pode gerar documentação detalhada de APIs muito facilmente.

Documentation.js se utiliza do Babel por debaixo dos panos para oferecer suporte a todas as sintaxes mais recente, incluindo anotações em Flow, que serve para declarar os tipos no seu código.

## <a id="toc-frameworks"></a>Frameworks

Todos os principais frameworks JavaScript estão focados em alinhar suas APIs em torno do futuro da linguagem. Por causa disso, um grande trabalho tem sido feito em torno das ferramentas e processos de build.

Os frameworks têm a oportunidade não apenas de usar o Babel, mas também de extender suas funcionalidades e melhorar e experiência dos desenvolvedores.

### <a id="toc-react"></a>React

React mudou drasticamente sua API para alinhar com o sistema de class do ES2015 ([Leia mais sobre a atualização da API aqui](https://babeljs.io/blog/2015/06/07/react-on-es6-plus)). E ainda mais, React usa o Babel para compilar sua sintaxe JSX. Eles pararam de usar o compilador que eles criaram em favor do Babel. Você pode começar installando os pacotes `babel-preset-react`, seguindo as [instruções acima](#babel-preset-react).

A comunidade do React abraçou o Babel como parte de seu ecossistema, e hoje, cria ferramentas em cima disso. Há uma série de [pacotes de transformações criados pela comunidade](https://www.npmjs.com/search?q=babel-plugin+react).

Um dos mais notáveis, é o pacote [`babel-plugin-react-transform`](https://github.com/gaearon/babel-plugin-react-transform), que, junto com alguns [pacotes de transformações específicas para React](https://github.com/gaearon/babel-plugin-react-transform#transforms), podem habilitar processos como *hot module reloading* e utilitários para depuração.

<!--
### Ember

> [WIP]
-->

## <a id="toc-text-editors-and-ides"></a>IDE's e editores de texto

Utilizar ES2015, JSX e Flow junto com Babel, pode trazer mais ânimo ao seu desenvolvimento, porém, se seu editor de texto não tem suporte para essas sintaxes, pode ser um problema manter-se produtivo. Por esse motivo, você vai querer configurar sua IDE ou editor de texto com o plugin para o Babel.

  * [Sublime Text](https://github.com/babel/babel-sublime)
  * [Atom](https://atom.io/packages/language-babel)
  * [Vim](https://github.com/jbgutierrez/vim-babel)
  * [WebStorm](https://babeljs.io/docs/setup/#webstorm)

<!--
# Debugging Babel

> [WIP]
-->

* * *

# <a id="toc-babel-support"></a>Procurando ajuda

Babel tem uma comunidade muito grande e que vem crescendo rapidamente, conforme crescemos, queremos assegurar que os desenvolvedores possuem todos os recursos que eles precisam para ter sucesso. Então, nós fornecemos diferentes canais para obter ajuda.

Lembre-se que, através de todas estas comunidades, temos um [Código de conduta](https://github.com/babel/babel/blob/master/CODE_OF_CONDUCT.md), e deve ser respeitado. Se você quebrar o código de conduta, medidas serão tomadas. Então por favor leia e se conscientize, para assim, interagir com os outros.

Também incentivamos que, como comunidade, podemos nos ajudar e tirar dúvidas um dos outros. Se você encontrar alguém fazendo uma pergunta, e você sabe a resposta, tire alguns minutos para ajudá-lo. Tente o seu melhor para ser gentil e ter empatia, quando fazê-lo.

## <a id="toc-babel-forum"></a>Fóruns

[ Discourse ](http://www.discourse.org) nos forneceu uma versão hospedada do seu software de fórum grátis (Nós os amamos por isso!). Se fóruns são para você, acesse [discuss.babeljs.io](https://discuss.babeljs.io).

## <a id="toc-babel-chat"></a>Salas de bate-papo

Todo mundo adora o [Slack](https://slack.com). Se você está procurando por apoio imediato da comunidade, venha conversar conosco no [slack.babeljs.io](https://slack.babeljs.io).

<!--
## Babel Stack Overflow

> [WIP]
-->

## <a id="toc-babel-issues"></a>Reportando problemas

Babel uses the issue tracker provided by [Github](http://github.com).

You can see all the open and closed issues on [Github](https://github.com/babel/babel/issues).

Se você deseja reportar algo:

  * [Procure pelo tema desejado](https://github.com/babel/babel/issues)
  * [Create a new bug report](https://github.com/babel/babel/issues/new) or [request a new feature](https://github.com/babel/babel/issues/new)

### <a id="toc-creating-an-awesome-babel-bug-report"></a>Criando relatórios de bug incríveis

Os problemas listados no Babel, às vezes podem ser muito difíceis de depurar remotamente, então precisamos de toda a ajuda que conseguirmos. Gastar mais uns minutos para elaborar um relatório de bug realmente agradável, pode ajudar a ter seu problema resolvido significativamente mais rápido.

Primeiro, tente isolar o problema. É extremamente improvável que cada parte da sua instalação está contribuindo para o problema. Se seu problema é um pedaço de código de entrada de dados, tente excluir o máximo possível de código e manter o necessário que ainda cause o problema.

> [WIP]

* * *

> ***Para futuras atualizações, siga [@thejameskyle](https://twitter.com/thejameskyle) no Twitter.***